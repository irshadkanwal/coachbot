class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = [];
    this.bufferSize = 4800; // 200ms at 24kHz
  }

  // Base64 encoding for AudioWorklet (btoa not available)
  base64Encode(bytes) {
    const base64abc = [
      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
      "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
      "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
      "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"
    ];

    let result = '';
    let i;
    const l = bytes.length;

    for (i = 2; i < l; i += 3) {
      result += base64abc[bytes[i - 2] >> 2];
      result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
      result += base64abc[((bytes[i - 1] & 0x0f) << 2) | (bytes[i] >> 6)];
      result += base64abc[bytes[i] & 0x3f];
    }

    if (i === l + 1) {
      result += base64abc[bytes[i - 2] >> 2];
      result += base64abc[(bytes[i - 2] & 0x03) << 4];
      result += "==";
    }

    if (i === l) {
      result += base64abc[bytes[i - 2] >> 2];
      result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
      result += base64abc[(bytes[i - 1] & 0x0f) << 2];
      result += "=";
    }

    return result;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input.length > 0) {
      const inputChannel = input[0];

      // Convert Float32Array to Int16Array for PCM16
      const pcm16 = new Int16Array(inputChannel.length);
      for (let i = 0; i < inputChannel.length; i++) {
        const s = Math.max(-1, Math.min(1, inputChannel[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }

      // Add to buffer
      this.buffer.push(...pcm16);

      // Send buffer when it reaches the target size
      if (this.buffer.length >= this.bufferSize) {
        const chunk = new Int16Array(this.buffer.splice(0, this.bufferSize));

        // Convert to base64
        const bytes = new Uint8Array(chunk.buffer);
        const base64 = this.base64Encode(bytes);

        this.port.postMessage({ audio: base64 });
      }
    }

    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);
