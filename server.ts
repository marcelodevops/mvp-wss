import WebSocket, { WebSocketServer } from "ws";

type SessionState = {
  phraseBuffer: string;
  lastSpeechTime: number;
};

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws: WebSocket) => {
  const session: SessionState = {
    phraseBuffer: "",
    lastSpeechTime: Date.now(),
  };

  console.log("Client connected");

  ws.on("message", async (msg: Buffer) => {
    const data = JSON.parse(msg.toString());

    switch (data.type) {
      case "audio_chunk":
        // 1️⃣ Send audio chunk to STT
        // sttStream.write(data.audio)
        break;

      case "stt_partial":
        // 2️⃣ Forward live captions
        ws.send(JSON.stringify({
          type: "partial_transcript",
          text: data.text,
        }));

        session.phraseBuffer += " " + data.text;
        session.lastSpeechTime = Date.now();
        break;

      case "speech_pause":
        // 3️⃣ Phrase boundary detected
        const phrase = session.phraseBuffer.trim();
        session.phraseBuffer = "";

        if (phrase.length > 0) {
          const translated = await translatePhrase(phrase);

          ws.send(JSON.stringify({
            type: "translated_text",
            text: translated,
          }));

          // 4️⃣ Stream TTS
          streamTTS(translated, ws);
        }
        break;
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

function streamTTS(text: string, ws: WebSocket) {
  const fakeChunks = ["audio1", "audio2", "audio3"];

  fakeChunks.forEach(chunk => {
    ws.send(JSON.stringify({
      type: "tts_audio_chunk",
      audio: chunk
    }));
  });
}


async function translatePhrase(text: string): Promise<string> {
  // Replace with OpenAI / DeepL
  return `[translated] ${text}`;
}

console.log("WebSocket server running on ws://localhost:8080");
