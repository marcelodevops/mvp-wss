import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as fs from "expo-file-system/legacy"

export function useMicrophone(sendAudioChunk: (b64: string) => void) {
  let recording: Audio.Recording | null = null;

  async function start() {
    await Audio.requestPermissionsAsync();

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    recording = new Audio.Recording();

    await recording.prepareToRecordAsync({
      android: {
        extension: ".wav",
        sampleRate: 16000,
        numberOfChannels: 1,
        outputFormat: Audio.AndroidOutputFormat.DEFAULT,
        audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
        bitRate: 128000,
      },
      ios: {
        extension: ".wav",
        sampleRate: 16000,
        numberOfChannels: 1,
        audioQuality: Audio.IOSAudioQuality.HIGH,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
      web: {},
    });

    await recording.startAsync();
  }

  async function stop() {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    recording = null;

    if (!uri) return;

    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: fs.EncodingType.Base64,
    });

    sendAudioChunk(base64);
  }

  return { start, stop };
}

