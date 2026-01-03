import WebSocket, { WebSocketServer } from "ws";
import { createSTTStream } from "./stt";
import { translatePhrase } from "./translate";
import { streamTTS } from "./tts";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", async (ws) => {
  let phraseBuffer = "";
  let lastSpeech = Date.now();

  const stt = await createSTTStream((partial) => {
    ws.send(
      JSON.stringify({
        type: "partial_transcript",
        text: partial,
      })
    );

    phraseBuffer += " " + partial;
    lastSpeech = Date.now();
  });

  // Phrase boundary detection
  const interval = setInterval(async () => {
    if (phraseBuffer && Date.now() - lastSpeech > 500) {
      const phrase = phraseBuffer.trim();
      phraseBuffer = "";

      const translated = await translatePhrase(phrase);

      ws.send(
        JSON.stringify({
          type: "translated_text",
          text: translated,
        })
      );

      streamTTS(translated, ws);
    }
  }, 200);

  ws.on("message", (msg) => {
    const data = JSON.parse(msg.toString());

    if (data.type === "audio_chunk") {
      const pcm = Buffer.from(data.audio, "base64");
      stt.sendAudio(pcm);
    }
  });

  ws.on("close", () => {
    clearInterval(interval);
    stt.close();
  });
});

console.log("🔥 Server running on ws://localhost:8080");
