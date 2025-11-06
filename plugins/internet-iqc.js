import fetch from 'node-fetch';
import moment from 'moment-timezone';

let handler = async (m, { conn, text }) => {

  const time = moment().tz('Africa/Harare');
  const displayDate = time.format('dddd, DD MMMM YYYY'); // Date
  const displayTime = time.format('HH:mm:ss'); // Time
  
  if (!text) throw 'Usage: .iqc <message>\nExample: .iqc hello there';

  await conn.reply(m.chat, 'Please wait...', m);

  const url = `https://brat.siputzx.my.id/iphone-quoted?time=${displayTime}&batteryPercentage=60&carrierName=INDOSAT&messageText=${encodeURIComponent(text)}&emojiStyle=apple`;

  const res = await fetch(url);
  if (!res.ok) throw 'Failed to fetch URL';

  const buffer = await res.buffer();
  await conn.sendMessage(m.chat, { image: buffer }, { quoted: m });
};

handler.help = ['iqc'];
handler.tags = ['internet'];
handler.command = ['iqc'];

export default handler;