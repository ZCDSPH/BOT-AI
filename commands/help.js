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
      return `➯《 ${command.name} 》\n  ➯ ${command.description}\n  ➯ Credits: 𝙼𝚊𝚛𝚓𝚑𝚞𝚗 𝙱𝚊𝚢𝚕𝚘𝚗`;
    });

    const totalCommands = commandFiles.length;
    const pageSize = 5;
    const page = parseInt(args[0]) || 1;
    const totalPages = Math.ceil(totalCommands / pageSize);

    if (page > totalPages || page < 1) {
      return sendMessage(senderId, { text: `Invalid page number. Please enter a page between 1 and ${totalPages}.` }, pageAccessToken);
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedCommands = commands.slice(start, end);

    const helpMessage = `𝐓𝐎𝐒𝐇𝐈𝐀 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒\n━━━━━━━━━━━━━━━━━\n${paginatedCommands.join('\n\n')}\n\nPage ${page} of ${totalPages}\n━━━━━━━━━━━━━━━━━\n𝙳𝙴𝚅𝙴𝙻𝙾𝙿𝙴𝚁 : 𝙼𝙰𝚁𝙹𝙷𝚄𝙽 𝙱𝙰𝚈𝙻𝙾𝙽`;

    const quickReplies = [];

    if (page > 1) {
      quickReplies.push({
        content_type: 'text',
        title: 'Previous',
        payload: `HELP_${page - 1}`
      });
    }

    if (page < totalPages) {
      quickReplies.push({
        content_type: 'text',
        title: 'Next',
        payload: `HELP_${page + 1}`
      });
    }

    const messageData = {
      text: helpMessage,
      quick_replies: quickReplies,
    };

    sendMessage(senderId, messageData, pageAccessToken);
  }
};