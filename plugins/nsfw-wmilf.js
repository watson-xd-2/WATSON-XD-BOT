import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  try {
    // React with eyes emoji to show bot is processing
    await conn.sendMessage(m.chat, { react: { text: '👀', key: m.key } })

    // Fetch random waifu image from API
    const res = await fetch('https://api.nekolabs.my.id/random/waifuim/milf')
    if (!res.ok) throw new Error(`❌ Failed to fetch: ${res.statusText}`)

    // Get image buffer and content type
    const buffer = await res.buffer()
    const contentType = res.headers.get('content-type')

    // Send media based on content type
    if (contentType.includes('image/gif')) {
      // Send as GIF
      await conn.sendMessage(m.chat, { 
        video: buffer, 
        gifPlayback: true 
      }, { quoted: m })
    } else if (contentType.includes('image')) {
      // Send as image
      await conn.sendMessage(m.chat, { 
        image: buffer 
      }, { quoted: m })
    } else if (contentType.includes('video')) {
      // Send as video
      await conn.sendMessage(m.chat, { 
        video: buffer 
      }, { quoted: m })
    } else {
      // Unknown media type
      m.reply('❌ Failed to recognize media type from API.')
    }
  } catch (e) {
    // Error handling
    console.error(e)
    m.reply('❌ Failed to get content from API. Please try again later.')
  }
}

// Command metadata
handler.help = ['wmilf']  // Help text:.wmilf
handler.tags = ['nsfw']   // Category: NSFW content
handler.command = /^wmilf$/i  // Triggers on: wmilf (case insensitive)
handler.premium = true    // Only premium users can use
handler.limit = false     // No daily limit

export default handler