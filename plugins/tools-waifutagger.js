
import fetch from 'node-fetch';
import FormData from 'form-data';

async function uploadToCatbox(buffer) {
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', buffer, 'file.jpg');

  const res = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: form
  });

  const url = await res.text();
  if (!url.startsWith('http')) throw new Error('❌ Failed to upload to Catbox');
  return url.trim();
}

let handler = async (m, { conn, usedPrefix, command }) => {
  const q = m.quoted? m.quoted: m;
  const mime = (q.msg || q).mimetype || '';

  if (!mime ||!mime.startsWith('image/')) {
    return m.reply(`🖼️ Reply to an image first or send an image with caption: ${usedPrefix + command}`);
  }

  m.reply('✨ Processing waifu tag...');

  try {
    const buffer = await q.download();
    const imageUrl = await uploadToCatbox(buffer);

    const apiUrl = `https://api.nekolabs.my.id/tools/waifu-tagger?imageUrl=${encodeURIComponent(imageUrl)}`;
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json.status ||!json.result) throw new Error('❌ Failed to process image');

    const { prompt, rating, tags } = json.result;

    let ratingText = rating.map(r => `${r.label}: ${(r.confidence * 100).toFixed(2)}%`).join('\n');
    let tagsText = tags.confidences.map(t => `${t.label}: ${(t.confidence * 100).toFixed(2)}%`).join('\n');

    const caption = `✨ *Waifu Tag Result*\n\n*Prompt:* ${prompt}\n\n*Rating:*\n${ratingText}\n\n*Tags:*\n${tagsText}`;

    await conn.sendMessage(m.chat, { image: buffer, caption }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply(`❌ Error occurred while processing image.\nError: ${e.message}`);
  }
};

handler.help = ['waifutagger', 'wt'];
handler.tags = ['tools', 'ai'];
handler.command = /^(waifutagger|wt)$/i;
handler.limit = true;
handler.register = true;

export default handler;
