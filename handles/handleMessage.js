const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { sendMessage } = require('./sendMessage');
const { handlePostback } = require('./handlePostback');

// Load command modules
const commands = Object.fromEntries(
  fs.readdirSync(path.join(__dirname, '../commands'))
    .filter(file => file.endsWith('.js'))
    .map(file => [require(`../commands/${file}`).name.toLowerCase(), require(`../commands/${file}`)])
);

const handleMessage = async (event, pageAccessToken) => {
  const senderId = event?.sender?.id;
  if (!senderId) {
    console.error('Invalid event object');
    return;
  }

  const messageText = event?.message?.text?.trim();
  if (!messageText) {
    console.error('No message text found');
    return;
  }

  const [commandName, ...args] = messageText.startsWith('-') 
    ? messageText.slice(1).split(' ') 
    : messageText.split(' ');

  const cmd = commands[commandName.toLowerCase()];

  try {
    if (cmd) {
      await cmd.execute(senderId, args, pageAccessToken, event, getImageUrl);
    } else {
      const userMessage = args.join(" ") || commandName;  
      const { data } = await axios.get(`https://joshweb.click/gpt4?prompt=${encodeURIComponent(userMessage)}&uid=${senderId}`);
      await sendMessage(senderId, { text: data.gpt4 }, pageAccessToken);
    }
  } catch (error) {
    console.error('Error executing command:', error);
    await sendMessage(senderId, { text: 'There was an error executing that command.' }, pageAccessToken);
  }

  if (event?.postback) {
    try {
      await handlePostback(event, pageAccessToken);
    } catch (error) {
      console.error('Error handling postback:', error);
    }
  }
};

const getImageUrl = async (event, pageAccessToken) => {
  const mid = event?.message?.reply_to?.mid;
  if (!mid) return null;

  try {
    const attachments = await getAttachments(mid, pageAccessToken);
    return attachments[0]?.image_data?.url || null;
  } catch (error) {
    console.error('Error retrieving image from reply:', error);
  }
};

const getAttachments = async (mid, pageAccessToken) => {
  const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments?access_token=${pageAccessToken}`);
  return data.data || [];
};

module.exports = { handleMessage, getImageUrl };
