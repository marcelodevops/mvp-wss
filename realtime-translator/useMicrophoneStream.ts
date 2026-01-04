import { startAudioStream, stopAudioStream } from "./audioStream";

export function useMicrophoneStream(
  sendChunk: (b64: string) => void
) {
  return {
    start: () => startAudioStream(sendChunk),
    stop: () => stopAudioStream(),
  };
}
