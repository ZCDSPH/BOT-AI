const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'help',
  description: 'Show available commands',
  author: '𝐌𝐀𝐑𝐉𝐇𝐔𝐍 𝐁𝐀𝐘𝐋𝐎𝐍',
  execute(senderId, args, pageAccessToken, sendMessage) {
    const commandsDir = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

    const commands = commandFiles.map(file => {
      const command = require(path.join(commandsDir, file));
      return `➤ ${command.name}\n  - ${command.description}\n  - Credits: ${command.author}`;
    });

    const totalCommands = commandFiles.length;
    const pageSize = 5;
    const page = parseInt(args[0]) || 1;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedCommands = commands.slice(start, end);
    
    const helpMessage = `𝐓𝐎𝐒𝐇𝐈𝐀 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒: \n𝖳𝖮𝖳𝖠𝖫 𝖢𝖮𝖬𝖬𝖠𝖭𝖣𝖲: ${totalCommands} \n\n${paginatedCommands.join('\n\n')}\n\nPage ${page} of ${Math.ceil(totalCommands / pageSize)}\n\n𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑 : 𝖬𝖠𝖱𝖩𝖧𝖴𝖭 𝖡𝖠𝖸𝖫𝖮𝖭`;
    
    sendMessage(senderId, { text: helpMessage }, pageAccessToken);
  }
};
