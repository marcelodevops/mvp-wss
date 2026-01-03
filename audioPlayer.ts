import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

let sound: Audio.Sound | null = null;

export async function playAudioChunk(base64: string) {
  const uri = FileSystem.cacheDirectory + `tts_${Date.now()}.wav`;

  await FileSystem.writeAsStringAsync(uri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  sound = new Audio.Sound();
  await sound.loadAsync({ uri });
  await sound.playAsync();
}
