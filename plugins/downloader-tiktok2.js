import fetch from 'node-fetch';

let handler = async (m, { text, conn, command }) => {
  if (!text) throw `Where's the TikTok link?\n\nExample: .${command} https://vt.tiktok.com/ZSkpqLD9U/`

  // Validate TikTok URL
  const tiktokRegex = /https?:\/\/(www\.)?(tiktok\.com\/[^\s]+|vt\.tiktok\.com\/[^\s]+)/i;
  if (!tiktokRegex.test(text)) throw '❌ Invalid TikTok URL. Please provide a correct link.';

  try {
    let res = await fetch(`https://www.sankavolereii.my.id/download/tiktok-v2?apikey=planaai&url=${encodeURIComponent(text)}`);
    if (!res.ok) throw 'Failed to fetch data from API.'

    let json = await res.json();
    if (!json.status) throw 'Video not found or invalid link.'

    // Use no-watermark video if available
    let video = json.result.video_nowm || json.result.video_watermark;
    let audio = json.result.audio_url;
    let desc = json.result.description || 'Successfully downloaded TikTok video.';

    await conn.sendFile(m.chat, video, 'tiktok.mp4', `🎬 ${desc}`, m);
    await conn.sendFile(m.chat, audio, 'audio.mp3', '🎵 TikTok audio', m, false, { mimetype: 'audio/mp4' });

  } catch (error) {
    console.error(error);
    m.reply('❌ An error occurred while fetching or sending the TikTok content.');
  }
}

handler.help = ['tiktok <url>']
handler.tags = ['downloader']
handler.command = /(tiktok|tt)$/i
handler.limit = true

export default handler
