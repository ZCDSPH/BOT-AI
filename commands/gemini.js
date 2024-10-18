const { callGeminiAPI } = require('../utils/callGeminiAPI');
module.exports = {
  name: 'gemini',
  description: 'Ask a question to the Gemini AI',
  author: '𝐌𝐀𝐑𝐉𝐇𝐔𝐍 𝐁𝐀𝐘𝐋𝐎𝐍',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');  
    
    try {
      sendMessage(senderId, { text: '💬 | 𝙰𝚗𝚜𝚠𝚎𝚛𝚒𝚗𝚐...' }, pageAccessToken);
      const response = await callGeminiAPI(prompt);
      const maxMessageLength = 2000;
      if (response.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(response, maxMessageLength);
        for (const message of messages) {
          sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text: response }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      sendMessage(senderId, { text: '.' }, pageAccessToken);
    }
  }
};

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}
