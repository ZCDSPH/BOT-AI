const axios = require('axios');

module.exports = {
  name: 'spotify',
  description: 'Get a Spotify link for a song',
  author: 'Deku (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(' ');
    const apiUrl = `https://hiroshi-api.onrender.com/tiktok/spotify?search=${encodeURIComponent(query)}`;

    try {
      const { data } = await axios.get(apiUrl);
      const spotifyDownloadLink = data[0]?.download;

      if (spotifyDownloadLink) {
        sendMessage(senderId, {
          attachment: {
            type: 'file',
            payload: { url: spotifyDownloadLink, is_reusable: true }
          }
        }, pageAccessToken);

        sendMessage(senderId, {
          text: 'What would you like to do next?',
          quick_replies: [
            { content_type: 'text', title: 'Search another song', payload: 'SEARCH_ANOTHER_SONG' },
            { content_type: 'text', title: 'Help', payload: 'HELP' }
          ]
        }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: 'Sorry, no Spotify link found for that query.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error retrieving Spotify link:', error);
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
