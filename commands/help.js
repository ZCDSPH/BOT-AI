const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'help',
  description: 'Show available commands',
  usage: '-help',
  author: 'System',

  execute(senderId, args, pageAccessToken, sendMessage) {
    if (args.length > 0) {
      const commandName = args[0];
      const commandInfo = fetchCommandInfo(commandName);
      sendMessage(senderId, { text: commandInfo }, pageAccessToken);
    } else {
      sendHelpMenu(senderId, pageAccessToken, sendMessage);
    }
  }
};

async function sendHelpMenu(senderId, pageAccessToken, sendMessage) {
  const categories = [
    { title: '📖 | 𝙴𝚞𝚌𝚊𝚝𝚒𝚘𝚗', payload: 'CATEGORY_EDUCATION' },
    { title: '🖼 | 𝙸𝚖𝚊𝚐𝚎', payload: 'CATEGORY_IMAGE' },
    { title: '🎧 | 𝙼𝚞𝚜𝚒𝚌', payload: 'CATEGORY_MUSIC' },
    { title: '👥 | 𝙾𝚝𝚑𝚎𝚛𝚜', payload: 'CATEGORY_OTHERS' }
  ];

  const buttonChunks = chunkArray(categories, 3);

  for (let i = 0; i < buttonChunks.length; i++) {
    const buttons = buttonChunks[i].map(category => ({
      type: 'postback',
      title: category.title,
      payload: category.payload
    }));

    await sendMessage(senderId, {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: `🤖 | Command categories: (Part ${i + 1})`,
          buttons: buttons
        }
      }
    }, pageAccessToken);
  }
}

async function sendCommandButtons(senderId, category, pageAccessToken, sendMessage) {
  const commandCategories = {
    "CATEGORY_EDUCATION": ['ai', 'blackbox', 'chatgpt', 'cohere', 'gemini', 'llama', 'mixtral'],
    "CATEGORY_IMAGE": ['gmage', 'imagine', 'pinterest'],
    "CATEGORY_MUSIC": ['audio', 'lyrics', 'spotify'],
    "CATEGORY_OTHERS": ['alldl', 'font', 'gtranslate', 'help', 'shawty']
  };

  const commands = commandCategories[category];
  const commandChunks = chunkArray(commands, 3);

  for (let i = 0; i < commandChunks.length; i++) {
    const buttons = commandChunks[i].map(command => ({
      type: 'postback',
      title: command,
      payload: `COMMAND_${command.toUpperCase()}`
    }));

    await sendMessage(senderId, {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: `🤖 | Commands in ${category.replace('CATEGORY_', '')}: (Part ${i + 1})`,
          buttons: buttons
        }
      }
    }, pageAccessToken);
  }
}

function chunkArray(array, size) {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}

function fetchCommandInfo(commandName) {
  const commandsDir = path.join(__dirname, '../commands');
  const commandFilePath = path.join(commandsDir, `${commandName}.js`);

  if (fs.existsSync(commandFilePath)) {
    try {
      const command = require(commandFilePath);
      return `
━━━━━━━━━━━━━━
𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙽𝚊𝚖𝚎: ${command.name}
𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗: ${command.description}
𝚄𝚜𝚊𝚐𝚎: ${command.usage}
━━━━━━━━━━━━━━
      `;
    } catch (error) {
      return `Error loading command "${commandName}": ${error.message}`;
    }
  } else {
    return `Command "${commandName}" not found.`;
  }
}