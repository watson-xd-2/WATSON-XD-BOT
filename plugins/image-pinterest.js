import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command, isPrems }) => {
  if (!text) throw `Example: ${usedPrefix + command} spongebob`;

  try {
    // Search reaction
    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

    // Fetch search results
    let res = await fetch(`https://api.platform.web.id/pinterest?q=${encodeURIComponent(text)}`);
    let data = await res.json();

    // Pick a random result
    let result = data.results.getRandom();

    // Send the file
    await conn.sendFile(
      m.chat, 
      result, 
      '', 
      result.status || `*Search result: ${text.trim()}*`, 
      m
    );

  } catch (e) {
    console.log(e);
    m.reply('Media not found');
  }
};

handler.help = ['pinterest'];
handler.tags = ['internet'];
handler.command = /^pin(terest)?$/i;
handler.limit = 2;
handler.register = true;

export default handler;

// Utility function for delays
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}