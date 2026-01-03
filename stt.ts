import { openai } from "./openai";

export async function createSTTStream(
  onPartial: (text: string) => void
) {
  const stream = await openai.audio.transcriptions.create({
    file: null as any, // realtime input
    model: "gpt-4o-transcribe",
    response_format: "verbose_json",
    stream: true,
  });

  (async () => {
    for await (const event of stream) {
      if (event.type === "transcript.partial") {
        onPartial(event.text);
      }
    }
  })();

  return {
    sendAudio(chunk: Buffer) {
      stream.write(chunk);
    },
    close() {
      stream.end();
    }
  };
}
