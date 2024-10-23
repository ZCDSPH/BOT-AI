const axios = require('axios');

const EMAIL_API_URL = "https://www.samirxpikachu.run.place/tempmail/get";
const INBOX_API_URL = "https://www.samirxpikachu.run.place/tempmail/inbox/";

module.exports = {
  name: 'tempmail',
  description: 'Generate temporary email or check inbox',
  author: 'Marjhun Baylon',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      if (args.length === 0) {
        return sendMessage(senderId, { text: "Use '-tempmail create' to generate a temporary email or '-tempmail inbox (email)' to retrieve inbox messages." }, pageAccessToken);
      }

      const command = args[0].toLowerCase();

      if (command === 'create') {
        let email;
        try {
          const response = await axios.get(EMAIL_API_URL);
          email = response.data.email;

          if (!email) {
            throw new Error("Failed to generate email");
          }
        } catch (error) {
          console.error("❌ | Failed to generate email", error.message);
          return sendMessage(senderId, { text: `❌ | Failed to generate email. Error: ${error.message}` }, pageAccessToken);
        }
        return sendMessage(senderId, { text: `📩 Generated email: ${email}` }, pageAccessToken);
      } else if (command === 'inbox' && args.length === 2) {
        const email = args[1];
        if (!email) {
          return sendMessage(senderId, { text: "❌ | Please provide an email address to check the inbox." }, pageAccessToken);
        }

        let inboxMessages;
        try {
          const inboxResponse = await axios.get(`${INBOX_API_URL}${email}`);
          inboxMessages = inboxResponse.data;

          if (!Array.isArray(inboxMessages)) {
            throw new Error("Unexpected response format");
          }
        } catch (error) {
          console.error(`❌ | Failed to retrieve inbox messages`, error.message);
          return sendMessage(senderId, { text: `❌ | Failed to retrieve inbox messages. Error: ${error.message}` }, pageAccessToken);
        }

        if (inboxMessages.length === 0) {
          return sendMessage(senderId, { text: "❌ | No messages found in the inbox." }, pageAccessToken);
        }

        const latestMessage = inboxMessages[0];
        const { date, from, subject } = latestMessage;

        const formattedMessage = `📧 From: ${from}\n📩 Subject: ${subject}\n📅 Date: ${date}\n━━━━━━━━━━━━━━━━`;
        return sendMessage(senderId, { text: `━━━━━━━━━━━━━━━━\n📬 Inbox messages for ${email}:\n${formattedMessage}` }, pageAccessToken);
      } else {
        return sendMessage(senderId, { text: `❌ | Invalid command. Use '-tempmail create' to generate a temporary email or '-tempmail inbox (email)' to retrieve inbox messages.` }, pageAccessToken);
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      return sendMessage(senderId, { text: `❌ | An unexpected error occurred: ${error.message}` }, pageAccessToken);
    }
  }
};
