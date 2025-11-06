import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command, args }) => {
  let url = args[0]
  if (!url) throw `Example: ${usedPrefix + command} https://youtu.be/abc123`

  // Determine format
  let format = /yt(a|mp3)/i.test(command) ? 'mp3' : 'mp4'
  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

  try {
    let apiUrl = `https://api.platform.web.id/notube/download?url=${encodeURIComponent(url)}&format=${format}`
    let { data } = await axios.get(apiUrl)

    if (!data.download_url) throw 'Download link not found from API.'

    let caption = `🎵 *${data.title}*\nFormat: ${format.toUpperCase()}`
    await conn.sendFile(m.chat, data.download_url, `${data.title}.${format}`, caption, m)
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (e) {
    console.error(e)
    m.reply(`❌ An error occurred: ${e?.message || e}`)
  }
}

handler.help = ['ytmp3 <url>', 'ytmp4 <url>']
handler.tags = ['downloader']
handler.command = /^yt(mp3|mp4|a|v)$/i
handler.limit = true

export default handler
