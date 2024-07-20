const { create, Client } = require("@open-wa/wa-automate");
const axios = require("axios");

const apiKey = "AIzaSyAxm_xo7CGZ7vbqKu9GX9KPvKnDvsPjlQ0";

async function getGeminiResponse(prompt) {
  if (!prompt) {
    return "No prompt provided.";
  }
  const apiUrl =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
    apiKey;
  const payload = { contents: [{ parts: [{ text: prompt }] }] };
  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    data: payload,
  };
  try {
    const response = await axios(apiUrl, options);
    const json = response.data;
    if (json.error) {
      console.log("Error: " + json.error.message);
      return "Error from Google Gemini: " + json.error.message;
    }
    const chatResponse = json.candidates[0].content.parts[0].text;
    return chatResponse;
  } catch (error) {
    console.log("Error: " + error.message);
    return "There was an error";
  }
}
create()
  .then((client) => start(client))
  .catch((error) => console.error("Error creating WhatsApp client:", error));
function start(client) {
  client.onMessage(async (message) => {
    if (message.isGroupMsg === false) {
      if (message.body.startsWith("<??bot Reza??>")) {
        const prompt = message.body.split("<??bot Reza??> ")[1];
        console.log(`Prompt: ${prompt}`, message.from);
        const response = await getGeminiResponse(prompt);
        await client.sendText(message.from, response);
      }
    }
  });
}
