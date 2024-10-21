const axios = require('axios');

module.exports = {
  name: 'toshia',
  description: 'Generate text using toshia datasets',
  author: '𝐌𝐀𝐑𝐉𝐇𝐔𝐍 𝐁𝐀𝐘𝐋𝐎𝐍',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');

    if (prompt === "") {
      sendMessage(senderId, { text: "Usage: gpt4o <question>" }, pageAccessToken);
      return;
    }

    
    sendMessage(senderId, { text: 'Generating content... Please wait.' }, pageAccessToken);

    try {
      const apiUrl = `https://joshweb.click/api/gpt-4o?q=${encodeURIComponent(prompt)}&uid=${senderId}`;
      const response = await axios.get(apiUrl);

     
      const result = response.data.result;

      
      sendMessage(senderId, { text: "TOSHIA CHATBOT:\n\n" + result }, pageAccessToken);

    } catch (error) {
      console.error('Error calling GPT-4o API:', error);
      sendMessage(senderId, { text: 'There was an error generating the content. Please try again later.' }, pageAccessToken);
    }
  }
};