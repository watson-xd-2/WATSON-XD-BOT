
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  try {
    // Show cat reaction
    await conn.sendMessage(m.chat, { react: { text: '😼', key: m.key } })

    // Fetch random neko image from API
    const res = await fetch('https://api.sxtream.xyz/dewasa/neko')
    if (!res.ok) throw new Error(`❌ Failed to fetch: ${res.statusText}`)

    // Get image buffer and content type
    const buffer = await res.buffer()
    const contentType = res.headers.get('content-type')

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
    console.error('Neko command error:', e)
    m.reply('❌ Failed to get content from API. Please try again.')
  }
}

// Command configuration
handler.help = ['wneko']        // Help text:.wneko
handler.tags = ['nsfw']         // Category: NSFW content
handler.command = /^wneko$/i    // Triggers on: wneko (case insensitive)
handler.premium = true          // Premium users only
handler.limit = true            // Uses daily limit

export default handler