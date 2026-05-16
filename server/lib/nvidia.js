const axios = require("axios");

const NVIDIA_CHAT_URL =
  process.env.NVIDIA_API_BASE_URL ||
  "https://integrate.api.nvidia.com/v1/chat/completions";

const DEFAULT_MODEL =
  process.env.NVIDIA_MODEL || "meta/llama-3.1-8b-instruct";

function getApiKey() {
  const key = process.env.NVIDIA_API_KEY;
  if (!key) throw new Error("NVIDIA_API_KEY is not configured");
  return key;
}

/**
 * Call NVIDIA NIM (OpenAI-compatible chat completions).
 * @param {string} userPrompt
 * @param {{ system?: string, maxTokens?: number, temperature?: number }} options
 * @returns {Promise<string>}
 */
async function chatCompletion(userPrompt, options = {}) {
  const {
    system = "You are a helpful assistant for email management.",
    maxTokens = 1024,
    temperature = 0.3,
  } = options;

  const messages = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: userPrompt });

  const response = await axios.post(
    NVIDIA_CHAT_URL,
    {
      model: DEFAULT_MODEL,
      messages,
      max_tokens: maxTokens,
      temperature,
      stream: false,
    },
    {
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        "Content-Type": "application/json",
      },
      timeout: 60000,
    }
  );

  const text = response.data?.choices?.[0]?.message?.content;
  if (!text?.trim()) {
    throw new Error("NVIDIA API returned an empty response");
  }
  return text.trim();
}

module.exports = { chatCompletion, DEFAULT_MODEL };
