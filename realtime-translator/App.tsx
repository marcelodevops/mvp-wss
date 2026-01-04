import { View, Text, Pressable } from "react-native";
import { useTranslationSocket } from "./useTranslationSocket";
import { useMicrophoneStream } from "./useMicrophoneStream";

export default function App() {
  const {
    startSpeaking,
    sendPCMChunk,
    partialA,
    partialB,
    translated,
  } = useTranslationSocket();

  const mic = useMicrophoneStream(sendPCMChunk);

  function handlePressIn(speaker: "A" | "B") {
    startSpeaking(speaker);
    mic.start();
  }

  function handlePressOut() {
    mic.stop();
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        justifyContent: "space-between",
      }}
    >
      {/* Speaker A */}
      <View>
        <Text style={{ fontSize: 18 }}>🇺🇸 Speaker A</Text>
        <Text style={{ fontSize: 20 }}>{partialA}</Text>

        <Pressable
          onPressIn={() => handlePressIn("A")}
          onPressOut={handlePressOut}
          style={{
            marginTop: 12,
            backgroundColor: "#111",
            padding: 16,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "#fff" }}>Hold to Talk</Text>
        </Pressable>
      </View>

      {/* Translation */}
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 22, fontWeight: "600" }}>
          {translated}
        </Text>
      </View>

      {/* Speaker B */}
      <View>
        <Text style={{ fontSize: 18 }}>🇪🇸 Speaker B</Text>
        <Text style={{ fontSize: 20 }}>{partialB}</Text>

        <Pressable
          onPressIn={() => handlePressIn("B")}
          onPressOut={handlePressOut}
          style={{
            marginTop: 12,
            backgroundColor: "#111",
            padding: 16,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "#fff" }}>Hold to Talk</Text>
        </Pressable>
      </View>
    </View>
  );
}
