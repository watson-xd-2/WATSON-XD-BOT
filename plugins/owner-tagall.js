// Feature: Tag All members in a group
// Type: Plugin ESM
// Author: WATSON-XD-BOT

let handler = async (m, { conn, text, participants }) => {
    // Get all group member IDs except the bot itself
    let users = participants.map(u => u.id).filter(v => v !== conn.user.jid);

    // Construct the message
    let message = `${text ? `${text}\n` : ''}┌─「 Tag All 」\n` +
                  users.map(v => `│◦❒ @${v.split('@')[0]}`).join('\n') +
                  '\n└────';

    // Send the message with mentions
    await conn.sendMessage(m.chat, { text: message, mentions: users }, { quoted: m });
}

handler.help = ['tagall'];
handler.tags = ['owner'];
handler.command = ['tagall'];
handler.owner = true;
handler.group = true;

export default handler;
