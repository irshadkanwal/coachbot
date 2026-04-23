import { useCallback, useEffect, useRef, useState } from 'react';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';
import { twMerge } from 'tailwind-merge';
import { blobToBase64 } from '@/utils/formatter';
import { getTextFromSpeech } from '@/server/actions/speechActions';

const VoiceRecorder: React.FC<{
  disabled?: boolean;
  onRecordToggle: (isInputDisabled: boolean) => void;
  onTextTranscript: (text: string) => void;
  setIsTranscriptLoading: (isLoading: boolean) => void;
  showCloseButton: boolean;
}> = ({ onRecordToggle, onTextTranscript, showCloseButton, setIsTranscriptLoading, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState('00:00');
  const containerRef = useRef<HTMLDivElement>(null);
  const recordPlugin = useRef<RecordPlugin | null>(null);
  const isClearedRef = useRef(false);

  useEffect(() => {
    initializeRecorder();

    return () => {
      if (recordPlugin.current) {
        recordPlugin.current.destroy();
      }
    };
  }, []);

  const setLoader = useCallback((isLoading: boolean) => {
    setIsTranscriptLoading(isLoading);
    setIsLoading(isLoading);
  }, []);

  const initializeRecorder = () => {
    if (containerRef.current) {
      recordPlugin.current = RecordPlugin.create({
        scrollingWaveform: true,
        renderRecordedAudio: false,
      });

      recordPlugin.current.on('record-end', (blob: Blob) => {
        !isClearedRef.current && blobToBase64(blob, getText);
      });

      recordPlugin.current.on('record-progress', (time: number) => {
        updateProgress(time);
      });
    }
  };

  const getText = async (base64data: string, mimeType: string) => {
    try {
      setLoader(true);

      const text = await getTextFromSpeech(base64data, mimeType);
      onTextTranscript(text);
    } catch (error: any) {
      console.error('Audio parsing error: ', error);
      onTextTranscript('');
    } finally {
      setLoader(false);
      onRecordToggle(false);
    }
  };

  const updateProgress = (time: number) => {
    const formattedTime = [Math.floor((time % 3600000) / 60000), Math.floor((time % 60000) / 1000)]
      .map((v) => (v < 10 ? '0' + v : v))
      .join(':');
    setProgress(formattedTime);
  };

  const startRecording = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (recordPlugin.current) {
        isClearedRef.current = false;

        recordPlugin.current.startRecording().then(() => {
          setIsRecording(true);
          onRecordToggle(true);
        });
      }
    } catch (error: any) {
      console.error('Error accessing microphone: ', error);
      alert('Error accessing microphone: ' + error);
    }
  };

  const stopRecording = (e?: any) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (recordPlugin.current) {
      recordPlugin.current.stopRecording();
      setIsRecording(false);
    }
  };

  const clearAll = () => {
    isClearedRef.current = true;
    stopRecording();
    setIsRecording(false);
    onTextTranscript('');
    setProgress('00:00');
  };

  return (
    <div
      className={twMerge(
        'flex h-full items-center justify-center',
        isRecording ? 'absolute inset-0 inset-y-0 size-full min-w-0 rounded-lg border-2 border-[#34B691]' : ''
      )}
    >
      {showCloseButton && !isLoading && (
        <button onClick={clearAll} className="h-full shrink-0 px-3" type="button">
          <i className="cbi-close-circle text-lg text-salmon"></i>
        </button>
      )}
      <div className={twMerge('flex-center h-full min-w-0 flex-grow overflow-hidden')}>
        <div ref={containerRef} id="mic" className="histogram flex size-full"></div>
      </div>

      {isLoading && <span className="cbi-voice-loader gradient-icon inline-flex animate-spin px-3 text-lg"></span>}
      {isRecording || isLoading ? (
        <>
          <span className="inline-flex rounded-2xl border border-gray-border px-2 py-1 text-xs">{progress}</span>
          <button onClick={stopRecording} className="flex-center h-full shrink-0 px-3" type="button">
            <i
              className={twMerge('cbi-check text-[1.35rem] text-white hover:text-saffron', isLoading && 'text-saffron')}
            ></i>
          </button>
        </>
      ) : (
        <>
          {!showCloseButton && (
            <button
              disabled={disabled}
              onClick={startRecording}
              className={twMerge('hover:gradient-icon inline-flex px-3', disabled && 'pointer-events-none opacity-30')}
              type="button"
            >
              <i className="cbi-microphone text-xl"></i>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default VoiceRecorder;
