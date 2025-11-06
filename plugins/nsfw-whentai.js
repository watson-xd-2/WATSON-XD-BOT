
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  try {
    // Show loading reaction
    await conn.sendMessage(m.chat, { react: { text: '👀', key: m.key } })

    // Fetch random hentai image from API
    const res = await fetch('https://api.nekolabs.my.id/random/waifuim/hentai')
    if (!res.ok) throw new Error(`❌ API request failed: ${res.statusText}`)

    // Get image buffer and content type
    const buffer = await res.buffer()
    const contentType = res.headers.get('content-type') || ''

    // Send media based on content type
    if (contentType.includes('image/gif')) {
      // Send as animated GIF
      await conn.sendMessage(m.chat, { 
        video: buffer, 
        gifPlayback: true 
      }, { quoted: m })
    } else if (contentType.includes('image')) {
      // Send as static image
      await conn.sendMessage(m.chat, { 
        image: buffer 
      }, { quoted: m })
    } else {
      // Unknown file type
      m.reply('❌ Failed to identify file type from API.')
    }
  } catch (e) {
    // Error handling
    console.error('Hentai command error:', e)
    m.reply('❌ Failed to fetch content. Please try again later.')
  }
}

// Command configuration
handler.command = ['whentai']  // Triggers on:.whentai
handler.tags = ['nsfw']        // Category: NSFW content
handler.help = ['whentai']     // Help description
handler.premium = true         // Premium users only
handler.limit = true           // Uses daily limit

export default handler