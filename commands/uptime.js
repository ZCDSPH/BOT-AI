const moment = require('moment-timezone');

module.exports = {
  name: 'uptime',
  description: 'Shows the bot\'s uptime.',
  author: 'bilat',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));
    const uptimeString = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;

    sendMessage(senderId, { text: `The bot has been online for ${uptimeString}` }, pageAccessToken);
  }
};