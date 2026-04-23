import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatData } from '@models/data.models';

export function useVoiceSessionManager({
  chatData,
  selectedVoice,
  handleMessage,
}: {
  chatData: ChatData,
  selectedVoice: string;
  handleMessage: (e: MessageEvent) => void;
}) {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const websocket = useRef<WebSocket | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const audioWorkletNode = useRef<AudioWorkletNode | null>(null);
  const audioQueue = useRef<Float32Array[]>([]);
  const isPlayingAudio = useRef(false);
  const nextStartTime = useRef<number>(0);
  const audioSourceNodes = useRef<AudioBufferSourceNode[]>([]);
  const scheduledChunks = useRef<number>(0);
  const minBufferChunks = 3;

  const startSession = useCallback(async () => {
    if (isSessionActive || websocket.current) {
      return;
    }

    try {
      const response = await fetch('/api/realtime-session');
      if (!response.ok) {
        throw new Error('Failed to get session URL');
      }

      const { wsUrl } = await response.json();
      if (!wsUrl) {
        throw new Error('No WebSocket URL provided');
      }

      const ws = new WebSocket(wsUrl);
      websocket.current = ws;

      ws.onopen = async () => {
        setIsSessionActive(true);
        const instructions = (chatData.assistant.configuration?.instructions || 'You are a helpful AI coach.') + '\n\nIMPORTANT: Respond in English by default. If the user speaks to you in a different language (German, French, Spanish, etc.), then respond in that language. Match the user\'s spoken language exactly.';

        ws.send(JSON.stringify({
          type: 'session.update',
          session: {
            modalities: ['text', 'audio'],
            instructions: instructions,
            voice: selectedVoice || 'alloy',
            input_audio_format: 'pcm16',
            output_audio_format: 'pcm16',
            input_audio_transcription: {
              model: 'whisper-1'
            },
            turn_detection: null
          }
        }));

        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStream.current = stream;

          const context = new AudioContext({ sampleRate: 24000 });
          audioContext.current = context;

          const source = context.createMediaStreamSource(stream);

          await context.audioWorklet.addModule('/audio-processor.js');
          const workletNode = new AudioWorkletNode(context, 'audio-processor');
          audioWorkletNode.current = workletNode;

          let shouldSendAudio = false;

          workletNode.port.onmessage = (event) => {
            if (ws.readyState === WebSocket.OPEN && shouldSendAudio) {
              ws.send(JSON.stringify({
                type: 'input_audio_buffer.append',
                audio: event.data.audio
              }));
            }
          };

          (workletNode as any).setShouldSendAudio = (value: boolean) => {
            shouldSendAudio = value;
          };

          source.connect(workletNode);
        } catch (err) {
          console.error('[Voice] Error setting up microphone:', err);
        }
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'response.audio.delta' && data.delta) {
          playAudio(data.delta);
        }

        handleMessage(event);
      };

      ws.onerror = (error) => {
        console.error('[Voice] WebSocket error:', error);
        stopSession();
      };

      ws.onclose = () => {
        stopSession();
      };

    } catch (error) {
      console.error('[Voice] Failed to start session:', error);
    }
  }, [isSessionActive, selectedVoice, chatData, handleMessage, isRecording]);

  const playAudio = useCallback((base64Audio: string) => {
    if (!audioContext.current) return;

    try {
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const int16Array = new Int16Array(bytes.buffer);
      const float32Array = new Float32Array(int16Array.length);

      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      audioQueue.current.push(float32Array);

      if (!isPlayingAudio.current && audioQueue.current.length >= minBufferChunks) {
        isPlayingAudio.current = true;
        playNextInQueue();
      }
    } catch (err) {
      console.error('[Voice] Error decoding audio:', err);
    }
  }, []);

  const playNextInQueue = useCallback(() => {
    if (!audioContext.current) {
      isPlayingAudio.current = false;
      return;
    }

    const chunksToPlay: Float32Array[] = [];
    const maxChunks = 10;

    while (audioQueue.current.length > 0 && chunksToPlay.length < maxChunks) {
      chunksToPlay.push(audioQueue.current.shift()!);
    }

    if (chunksToPlay.length === 0) {
      isPlayingAudio.current = false;
      nextStartTime.current = 0;
      scheduledChunks.current = 0;
      return;
    }

    try {
      const totalLength = chunksToPlay.reduce((sum, chunk) => sum + chunk.length, 0);
      const combinedAudio = new Float32Array(totalLength);
      let offset = 0;

      for (const chunk of chunksToPlay) {
        combinedAudio.set(chunk, offset);
        offset += chunk.length;
      }

      const audioBuffer = audioContext.current.createBuffer(1, combinedAudio.length, 24000);
      audioBuffer.getChannelData(0).set(combinedAudio);

      const source = audioContext.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.current.destination);
      audioSourceNodes.current.push(source);
      const currentTime = audioContext.current.currentTime;
      let startTime: number;

      if (nextStartTime.current === 0 || currentTime > nextStartTime.current) {
        startTime = currentTime + 0.05;
      } else {
        startTime = nextStartTime.current;
      }

      scheduledChunks.current++;

      source.onended = () => {
        const index = audioSourceNodes.current.indexOf(source);
        if (index > -1) {
          audioSourceNodes.current.splice(index, 1);
        }

        scheduledChunks.current--;

        if (audioQueue.current.length > 0) {
          playNextInQueue();
        } else if (scheduledChunks.current === 0) {
          isPlayingAudio.current = false;
          nextStartTime.current = 0;
        }
      };

      source.start(startTime);

      nextStartTime.current = startTime + audioBuffer.duration - 0.01;
    } catch (err) {
      console.error('[Voice] Audio playback error:', err);
      scheduledChunks.current--;
      if (audioQueue.current.length > 0) {
        playNextInQueue();
      } else {
        isPlayingAudio.current = false;
        nextStartTime.current = 0;
        scheduledChunks.current = 0;
      }
    }
  }, []);

  const stopAudioPlayback = useCallback(() => {
    audioSourceNodes.current.forEach(source => {
      try {
        source.stop();
      } catch (e) {
      }
    });
    audioSourceNodes.current = [];
    audioQueue.current = [];
    isPlayingAudio.current = false;
    nextStartTime.current = 0;
    scheduledChunks.current = 0;
  }, []);

  const updateSession = useCallback((voice?: string) => {
    if (!websocket.current || websocket.current.readyState !== WebSocket.OPEN) return;

    websocket.current.send(JSON.stringify({
      type: 'session.update',
      session: {
        voice: voice || selectedVoice
      }
    }));
  }, [selectedVoice]);

  const stopSession = useCallback(() => {
    stopAudioPlayback();

    if (audioWorkletNode.current) {
      audioWorkletNode.current.disconnect();
      audioWorkletNode.current = null;
    }

    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
      mediaStream.current = null;
    }

    if (audioContext.current) {
      audioContext.current.close();
      audioContext.current = null;
    }

    if (websocket.current) {
      websocket.current.close();
      websocket.current = null;
    }

    setIsSessionActive(false);
    setIsRecording(false);
  }, [stopAudioPlayback]);

  const toggleRecording = useCallback(() => {
    const newRecordingState = !isRecording;
    setIsRecording(newRecordingState);

    if (audioWorkletNode.current && (audioWorkletNode.current as any).setShouldSendAudio) {
      (audioWorkletNode.current as any).setShouldSendAudio(newRecordingState);
    }

    if (newRecordingState) {
      stopAudioPlayback();
      if (websocket.current?.readyState === WebSocket.OPEN) {
        websocket.current.send(JSON.stringify({
          type: 'input_audio_buffer.clear'
        }));
      }
    } else {
      if (websocket.current?.readyState === WebSocket.OPEN) {
        websocket.current.send(JSON.stringify({
          type: 'input_audio_buffer.commit'
        }));

        websocket.current.send(JSON.stringify({
          type: 'response.create'
        }));
      }
    }
  }, [isRecording, stopAudioPlayback]);

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  return {
    dataChannel: websocket.current,
    isSessionActive,
    isRecording,
    startSession,
    stopSession,
    updateSession,
    toggleRecording,
  };
}
