const { Configuration, OpenAIApi } = require("openai");

// Set up the OpenAI API configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create a new OpenAIApi instance with the configuration
const openai = new OpenAIApi(configuration);

async function chatgpt(prompt) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Record the response
    return response.data.choices[0].message.content
  } catch (error) {
    console.error("Error sending prompt to ChatGPT API:", error);
  }
}

module.exports.chatgpt = chatgpt;