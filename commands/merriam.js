const axios = require('axios');

module.exports = {
  name: 'merriam',
  description: 'Fetches the definition of a word from Merriam Webster.',
  author: '𝐌𝐀𝐑𝐉𝐇𝐔𝐍 𝐁𝐀𝐘𝐋𝐎𝐍',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const word = args.join(" ");

    if (!word) {
      return sendMessage(senderId, { text: "❓ Please provide a word to define." }, pageAccessToken);
    }

    sendMessage(senderId, { text: `⚙ Merriam Webster is fetching the definition for➜ "${word}"...` }, pageAccessToken);

    try {
      const response = await axios.get(`https://nash-rest-api-production.up.railway.app/merriam-webster/definition?word=${encodeURIComponent(word)}`);
      const data = response.data;

      if (!data || !data.definitions || data.definitions.length === 0) {
        return sendMessage(senderId, { text: `🥺 Sorry, I couldn't find the definition for➜ "${word}".` }, pageAccessToken);
      }

      const definitions = data.definitions.map((def, index) => `➜${index + 1}. ${def}`).join("\n");
      sendMessage(senderId, { text: `🎓 Here is the result for➜ "${word}":\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n${definitions}\n━━━━━━━━━━━━━━━━━━━━━━━━━━` }, pageAccessToken);
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: `❌ An error occurred: ${error.message}` }, pageAccessToken);
    }
  }
};