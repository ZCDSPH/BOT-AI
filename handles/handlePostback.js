const { sendMessage } = require('./sendMessage');
const path = require('path');
const fs = require('fs');

const commandsDir = path.join(__dirname, 'commands');
const helpPath = path.join(commandsDir, 'help.js');

let fetchCommandInfo, sendCommandButtons;

if (fs.existsSync(helpPath)) {
  const helpModule = require(helpPath);
  fetchCommandInfo = helpModule.fetchCommandInfo;
  sendCommandButtons = helpModule.sendCommandButtons;
}

async function handlePostback(event, pageAccessToken) {
  const senderId = event.sender.id;
  const payload = event.postback.payload;

  if (payload.startsWith('HELP_')) {
    const page = payload.replace('HELP_', '');
    const helpCommand = require('./commands/help');
    helpCommand.execute(senderId, [page], pageAccessToken, sendMessage);
  } else if (payload.startsWith('COMMAND_')) {
    const commandName = payload.replace('COMMAND_', '').toLowerCase();
    const commandFilePath = path.join(commandsDir, `${commandName}.js`);
    
    if (fs.existsSync(commandFilePath)) {
      const commandModule = require(commandFilePath);
      const commandInfo = `Command: ${commandModule.name}\nDescription: ${commandModule.description}\nCredit: ${commandModule.author}`;
      await sendMessage(senderId, { text: commandInfo }, pageAccessToken);
    } else {
      await sendMessage(senderId, { text: `Error: Command '${commandName}' not found.` }, pageAccessToken);
    }
  } else {
    await sendMessage(senderId, { text: `You sent a postback with payload: ${payload}` }, pageAccessToken);
  }
}

module.exports = { handlePostback };