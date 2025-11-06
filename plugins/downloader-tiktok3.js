import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`Example:\n${usedPrefix + command} https://vt.tiktok.com/ZSkpqLD9U/`)

  try {
    const res = await fetch(`https://zenzxz.dpdns.org/downloader/tiktok?url=${encodeURIComponent(args[0])}`)
    const json = await res.json()

    if (!json.status) return m.reply('Failed to fetch data.')

    const result = json.result.data
    const caption = `🎥 *TikTok Video Downloader*

📛 *Title:* ${result.title}
👤 *Author:* ${result.author.nickname} (@${result.author.unique_id})
🎵 *Music:* ${result.music_info.title} - ${result.music_info.author}
⏳ *Duration:* ${result.duration} seconds
👍 *Likes:* ${result.digg_count}
💬 *Comments:* ${result.comment_count}
🔄 *Shares:* ${result.share_count}

Link: ${args[0]}
`

    // Send video
    await conn.sendFile(m.chat, result.play, 'tiktok.mp4', caption, m)

    // Send audio separately
    if (result.music_info.play_url) {
      await conn.sendFile(m.chat, result.music_info.play_url, 'tiktok_audio.mp3', '🎵 TikTok Audio', m, false, { mimetype: 'audio/mp4' })
    }

  } catch (e) {
    console.error(e)
    m.reply('❌ An error occurred, please try again later.')
  }
}

handler.help = ['tiktok1 <url>']
handler.tags = ['downloader']
handler.command = /^(tiktok1|tt1)$/i
handler.limit = true

export default handler
