import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Example: ${usedPrefix + command} tarot feast`

  try {
    let res = await fetch(`https://api.nekolabs.my.id/downloader/youtube/play/v1?q=${encodeURIComponent(text)}`)
    if (!res.ok) throw await res.text()
    let json = await res.json()

    if (!json.status) throw `❌ Song not found.`

    let { metadata, downloadUrl } = json.result
    let { title, channel, duration, cover, url } = metadata

    let caption = `🎵 *${title}*\n👤 Channel: ${channel}\n⏱️ Duration: ${duration}\n🔗 ${url}`

    // Send cover image with song info
    await conn.sendMessage(m.chat, {
      image: { url: cover },
      caption
    }, { quoted: m })

    // Send audio file
    await conn.sendMessage(m.chat, {
      audio: { url: downloadUrl },
      mimetype: 'audio/mp4',
      fileName: `${title}.mp3`
    }, { quoted: m })

  } catch (e) {
    throw `❌ An error occurred!\n\n${e}`
  }
}

handler.help = ['play2 <title>']
handler.tags = ['downloader']
handler.command = /^play2$/i
handler.limit = true

export default handler