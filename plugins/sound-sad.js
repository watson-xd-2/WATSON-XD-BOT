import fetch from 'node-fetch';

const handler = async (m, { conn, args }) => {
  try {
    const sadNumber = parseInt(args[0], 10);

    if (isNaN(sadNumber) || sadNumber < 1 || sadNumber > 34) {
      return conn.reply(m.chat, 'Enter a number between 1 and 34.\nExample: .sad 2', m);
    }

    const sadURL = `https://github.com/Rangelofficial/Sad-Music/raw/main/audio-sad/sad${sadNumber}.mp3`;
    const response = await fetch(sadURL);
    if (!response.ok) throw new Error("Failed to download audio");

    const sadBuffer = await response.buffer();

    await conn.sendMessage(m.chat, {
      audio: sadBuffer,
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: m });

  } catch (error) {
    await conn.reply(m.chat, "❌ Error occurred while downloading or sending audio.", m);
    console.error(error);
  }
};

handler.help = ['sad'];
handler.tags = ['sound'];
handler.command = ['sad'];
handler.group = true;
handler.limit = true;

export default handler;
