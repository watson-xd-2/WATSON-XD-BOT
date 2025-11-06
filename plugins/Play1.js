/*
• Feature Name : Play (MP3 & MP4)
• Type : ESM Plugin
• Author : Watson-xd
• Mod : ChatGPT
*/

import ytdl from "ytdl-core";
import fs from "fs";
import path from "path";

const handler = async (m, { conn, usedPrefix, text }) => {
  if (!text)
    return m.reply(
      `Please type a song title or YouTube link.\nExample: ${usedPrefix}play Never Gonna Give You Up`
    );

  // React with hourglass while processing
  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

  try {
    let url = text;
    if (!ytdl.validateURL(text)) {
      const ytSearch = (await import("yt-search")).default;
      const result = await ytSearch(text);
      if (!result || !result.videos || result.videos.length === 0)
        throw new Error("No video found for your query.");
      url = result.videos[0].url;
    }

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url;

    const caption = `⬣─ 〔 *Y T - Downloader* 〕 ─⬣
- *Title:* ${title}
- *YouTube Link:* ${url}
⬣────────────────⬣
Choose a format below:`;

    // Buttons for MP3 / MP4 / Menu
    const buttons = [
      { buttonId: `${usedPrefix}playmp3 ${url}`, buttonText: { displayText: "🎵 MP3 (Audio)" }, type: 1 },
      { buttonId: `${usedPrefix}playmp4 ${url}`, buttonText: { displayText: "🎬 MP4 (Video)" }, type: 1 },
      { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "📜 Menu" }, type: 1 },
    ];

    await conn.sendMessage(
      m.chat,
      {
        text: caption,
        buttons,
        headerType: 4,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            title,
            body: global.namebot || "YT Downloader",
            thumbnailUrl: thumbnail,
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: url,
          },
        },
      },
      { quoted: m }
    );

  } catch (err) {
    console.error(err);
    let msg = err.message || "An error occurred while fetching the video.";
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    m.reply(msg);
  }
};

// Handler for MP3 download
handler.command = /^play1$/i;
handler.help = ["play1"];
handler.tags = ["downloader"];
handler.limit = 3;
handler.register = true;

export default handler;