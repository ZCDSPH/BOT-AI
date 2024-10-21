const fs = require("fs");
const path = require("path");
const { sendMessage } = require("./sendMessage");
const axios = require("axios");

const commands = new Map();
const prefix = "";

const commandFiles = fs
  .readdirSync(path.join(__dirname, "../commands"))
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`../commands/${file}`);
  commands.set(command.name.toLowerCase(), command);
}

async function handleMessage(event, pageAccessToken) {
  if (!event || !event.sender || !event.sender.id) {
    console.error("Invalid event object");
    return;
  }

  const senderId = event.sender.id;

  if (event.message && event.message.text) {
    const messageText = event.message.text.trim();

    let commandName, args;
    if (messageText.startsWith(prefix)) {
      const argsArray = messageText.slice(prefix.length).split(" ");
      commandName = argsArray.shift().toLowerCase();
      args = argsArray;
    } else {
      const words = messageText.split(" ");
      commandName = words.shift().toLowerCase();
      args = words;
    }

    if (commands.has(commandName)) {
      const command = commands.get(commandName);
      try {
        await command.execute(senderId, args, pageAccessToken, sendMessage);
      } catch (error) {
        console.error(`Error executing command ${commandName}:`, error);
        const errorMsg = error.message ? error.message : "There was an error executing that command.";
        sendMessage(senderId, { text: errorMsg }, pageAccessToken);
      }
    } else {
      try {
        
        const userMessage = args.join(" ") || commandName;  
        const { data } = await axios.get(
          `https://joshweb.click/gpt4?prompt=${encodeURIComponent(userMessage)}&uid=${senderId}`
        );
        await sendMessage(senderId, { text: data.gpt4 }, pageAccessToken);
      } catch (error) {
        console.error("Error fetching GPT response:", error);
        sendMessage(senderId, { text: "I'm having trouble answering that right now." }, pageAccessToken);
      }
    }
  } else if (event.message) {
    console.log("Received message without text");
  } else {
    console.log("Received event without message");
  }
}

module.exports = { handleMessage };