import { useEffect, useRef, useState } from "react";
import { playAudioChunk } from "./audioPlayer";

export function useTranslationSocket() {
  const ws = useRef<WebSocket | null>(null);
  const [partial, setPartial] = useState("");
  const [translated, setTranslated] = useState("");

  useEffect(() => {
    ws.current = new WebSocket("ws://YOUR_SERVER_IP:8080");

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "partial_transcript") {
        setPartial(msg.text);
      }

      if (msg.type === "translated_text") {
        setTranslated(msg.text);
      }

      if (msg.type === "tts_audio_chunk") {
        playAudioChunk(msg.audio);
      }
    };

    return () => ws.current?.close();
  }, []);

  function sendPCMChunk(base64: string) {
    ws.current?.send(
      JSON.stringify({
        type: "audio_chunk",
        format: "pcm16",
        sampleRate: 16000,
        audio: base64,
      })
    );
  }

  return { sendPCMChunk, partial, translated };
}
