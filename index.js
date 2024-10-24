const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { handleMessage } = require('./handles/handleMessage');
const { handlePostback } = require('./handles/handlePostback');

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = 'pagebot';
const PAGE_ACCESS_TOKEN = fs.readFileSync('token.txt', 'utf8').trim();

app.get('/webhook', (req, res) => {
  const { mode, verify_token: token, challenge } = req.query;

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
  }
});

app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(entry => {
      if (entry.messaging) {
        entry.messaging.forEach(event => {
          if (event.message) {
            handleMessage(event, PAGE_ACCESS_TOKEN);
          } else if (event.postback) {
            handlePostback(event, PAGE_ACCESS_TOKEN);
          }
        });
      }
    });
    return res.status(200).send('EVENT_RECEIVED');
  }
  return res.sendStatus(404);
});

const loadMenuCommands = async () => {
  try {
    const commandsDir = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

    const commandsList = commandFiles.map(file => {
      const command = require(path.join(commandsDir, file));
      return { name: command.name, description: command.description || 'No description available' };
    });

    const response = await axios.post(`https://graph.facebook.com/v21.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`, {
      commands: [{ locale: "default", commands: commandsList }]
    }, {
      headers: { "Content-Type": "application/json" }
    });

    if (response.data.result === "success") {
      console.log("Commands loaded!");
    } else {
      console.log("Failed to load commands");
    }
  } catch (error) {
    console.error('Error loading commands:', error);
  }
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await loadMenuCommands();
});
