const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.CHATGPT_API_KEY });

async function chatGPT(prompt) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0];
}

module.exports.chatGPT = chatGPT;