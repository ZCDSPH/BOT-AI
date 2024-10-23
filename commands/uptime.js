const moment = require('moment-timezone');

module.exports = {
  name: 'up',
  description: 'Displays the bot\'s uptime.',
  author: 'bilat',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const uptime = process.uptime();
      const duration = moment.duration(uptime, 'seconds');
      const days = Math.floor(duration.asDays());
      const hours = String(duration.hours()).padStart(2, '0');
      const minutes = String(duration.minutes()).padStart(2, '0');
      const seconds = String(duration.seconds()).padStart(2, '0');
      
      const uptimeString = `${days} days, ${hours}:${minutes}:${seconds}`;
      
      sendMessage(senderId, { text: `The bot has been online for ${uptimeString}.` }, pageAccessToken);
    } catch (error) {
      sendMessage(senderId, { text: 'Sorry, there was an error retrieving the bot\'s uptime.' }, pageAccessToken);
    }
  }
};