import { openai } from "./openai";
import WebSocket from "ws";

export async function streamTTS(text: string, ws: WebSocket) {
  const response = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "alloy",
    input: text,
    stream: true,
  });

  for await (const chunk of response) {
    if (chunk.type === "audio") {
      ws.send(
        JSON.stringify({
          type: "tts_audio_chunk",
          audio: chunk.data.toString("base64"),
        })
      );
    }
  }
}
