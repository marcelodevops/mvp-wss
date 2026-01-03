import { openai } from "./openai";

export async function translatePhrase(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: `Translate spoken language naturally from ${sourceLang} to ${targetLang}. Keep it conversational.`
      },
      {
        role: "user",
        content: text
      }
    ]
  });

  return response.choices[0].message.content ?? "";
}
