import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

let isPlaying = false;
const queue: string[] = [];

export async function playAudioChunk(base64: string) {
  queue.push(base64);
  if (!isPlaying) playNext();
}

async function playNext() {
  if (queue.length === 0) {
    isPlaying = false;
    return;
  }

  isPlaying = true;
  const chunk = queue.shift()!;
  const uri = FileSystem.cacheDirectory + `tts_${Date.now()}.wav`;

  await FileSystem.writeAsStringAsync(uri, chunk, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const sound = new Audio.Sound();
  await sound.loadAsync({ uri });
  await sound.playAsync();

  sound.setOnPlaybackStatusUpdate((status) => {
    if ((status as any).didJustFinish) {
      playNext();
    }
  });
}
