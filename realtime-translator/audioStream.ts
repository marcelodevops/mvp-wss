import AudioRecord from "react-native-audio-record";

export function startAudioStream(
  onChunk: (base64PCM: string) => void
) {
  AudioRecord.init({
    sampleRate: 16000,
    channels: 1,
    bitsPerSample: 16,
   // bufferSize: 4096, // ~25ms
    wavFile: "null",
  });

  AudioRecord.on("data", (data: string) => {
    onChunk(data); // base64 PCM
  });

  AudioRecord.start();
}

export function stopAudioStream() {
  AudioRecord.stop();
}
