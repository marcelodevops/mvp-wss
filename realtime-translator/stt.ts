import { openai } from "./openai";

export async function createSTTStream(
  onPartial: (text: string) => void
) {
  const stream: any = await openai.audio.transcriptions.create({
    model: "gpt-4o-transcribe",
    stream: true,
  } as any);

  (async () => {
    for await (const event of stream as any) {
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
    },
  };
}
