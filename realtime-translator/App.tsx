import { View, Text, Pressable } from "react-native";
import { useTranslationSocket } from "./useTranslationSocket";
import { useMicrophoneStream } from "./useMicrophoneStream";

export default function App() {
  const { sendPCMChunk, partial, translated } =
    useTranslationSocket();
  const mic = useMicrophoneStream(sendPCMChunk);

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
      <Text style={{ fontSize: 18 }}>You (live):</Text>
      <Text style={{ fontSize: 22 }}>{partial}</Text>

      <Text style={{ fontSize: 18, marginTop: 24 }}>
        Translated:
      </Text>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>
        {translated}
      </Text>

      <Pressable
        onPressIn={mic.start}
        onPressOut={mic.stop}
        style={{
          marginTop: 40,
          backgroundColor: "#000",
          padding: 22,
          borderRadius: 100,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>
          Hold to Talk
        </Text>
      </Pressable>
    </View>
  );
}
