import { Text, View, Pressable } from "react-native";
import { useTranslationSocket } from "./useTranslationSocket";
import { useMicrophone } from "./useMicrophone";

export default function App() {
  const { sendAudioChunk, partial, translated } = useTranslationSocket();
  const mic = useMicrophone(sendAudioChunk);

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>
        You (live):
      </Text>
      <Text style={{ fontSize: 20 }}>{partial}</Text>

      <Text style={{ fontSize: 18, marginTop: 24 }}>
        Translated:
      </Text>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>
        {translated}
      </Text>

      <Pressable
        onPressIn={mic.start}
        onPressOut={mic.stop}
        style={{
          marginTop: 40,
          backgroundColor: "#111",
          padding: 20,
          borderRadius: 100,
          alignItems: "center"
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>
          Hold to Talk
        </Text>
      </Pressable>
    </View>
  );
}
