
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  try {
    // Show NSFW warning reaction
    await conn.sendMessage(m.chat, { react: { text: '🔞', key: m.key } })

    // Fetch random Rule34 image from API
    const res = await fetch('https://api.nekolabs.my.id/random/rule34')
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
    console.error('Rule34 command error:', e)
    m.reply('❌ Failed to get content from API. Please try again.')
  }
}

// Command configuration
handler.help = ['rule34']      // Help text:.rule34
handler.tags = ['nsfw']        // Category: NSFW content
handler.command = /^rule34$/i  // Triggers on: rule34 (case insensitive)
handler.premium = true         // Premium users only
handler.limit = false          // No daily limit

export default handler