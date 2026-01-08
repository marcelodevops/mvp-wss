import { openai } from "./openai";
import WebSocket from "ws";

export async function streamTTS(text: string, ws: WebSocket) {
  const response = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "alloy",
    input: text,
  });

  // response is not an async iterable; read the full audio and send it once
  const arrayBuffer = await response.arrayBuffer();
  const audioBase64 = Buffer.from(arrayBuffer).toString("base64");
  ws.send(
    JSON.stringify({
      type: "tts_audio_chunk",
      audio: audioBase64,
    })
  );
}
