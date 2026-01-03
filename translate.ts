import { openai } from "./openai";

export async function translatePhrase(
  text: string,
  sourceLang = "English",
  targetLang = "Spanish"
): Promise<string> {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: `Translate spoken language naturally from ${sourceLang} to ${targetLang}.`,
      },
      { role: "user", content: text },
    ],
  });

  return res.choices[0].message.content ?? "";
}
