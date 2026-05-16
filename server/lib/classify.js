const { chatCompletion } = require("./nvidia");

const VALID_CATEGORIES = ["urgent", "positive", "neutral", "calendar", "spam"];

async function classifyEmailCategory(emailContent) {
  try {
    const prompt = `You are an email classification expert. Analyze the following email and return ONLY ONE word: urgent, positive, neutral, calendar, or spam.

Email Content:
${emailContent}

Category:`;
    const text = (
      await chatCompletion(prompt, {
        system: "Reply with exactly one category word and nothing else.",
        maxTokens: 16,
        temperature: 0,
      })
    ).toLowerCase();
    const word = text.split(/\s+/)[0]?.replace(/[^a-z]/g, "");
    return VALID_CATEGORIES.includes(word) ? word : "neutral";
  } catch (error) {
    console.error("Email classify error:", error.message);
    return "neutral";
  }
}

module.exports = { classifyEmailCategory, VALID_CATEGORIES };
