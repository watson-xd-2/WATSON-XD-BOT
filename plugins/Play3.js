import axios from "axios";

const handler = async (m, { conn, usedPrefix, text, command }) => {
  if (!text)
    return m.reply(
      `Please type a song title\nExample: ${usedPrefix + command} You Are Still My Love`
    );

  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

  try {
    const res = await axios.get(
      `https://api.deline.web.id/downloader/ytplay?q=${encodeURIComponent(text)}`,
      { timeout: 30000 }
    );

    if (!res.data?.status || !res.data?.result)
      throw new Error("Failed to fetch data from API.");

    const { url, title, thumbnail, pick, dlink } = res.data.result;

    const caption = `⬣─ 〔 *Y T - A U D I O* 〕 ─⬣
- *Title:* ${title}
- *Quality:* ${pick?.quality || "N/A"}
- *Size:* ${pick?.size || "N/A"}
- *YouTube Link:* ${url}
⬣────────────────⬣`;

    await conn.sendMessage(
      m.chat,
      {
        text: caption,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            title,
            body: global.namebot || "Audio Player",
            thumbnailUrl: thumbnail,
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: url,
          },
        },
      },
      { quoted: m }
    );

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: dlink },
        mimetype: "audio/mp4",
        fileName: `${title}.mp3`,
      },
      { quoted: m }
    );

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  } catch (err) {
    console.error(err);
    let msg;
    if (err.code === "ECONNABORTED") msg = "Timeout: server took too long to respond.";
    else msg = "An error occurred:\n" + err.message;

    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    m.reply(msg);
  }
};

handler.help = ["play3"];
handler.tags = ["downloader"];
handler.command = /^play3$/i;
handler.limit = 3;
handler.register = true;

export default handler;