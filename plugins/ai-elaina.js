import fetch from 'node-fetch'
import moment from 'moment-timezone'

// Return a greeting based on user's local time (fallback to Harare)
function getGreeting(timezone = 'Africa/Harare') {
  const hour = moment().tz(timezone).hour()
  if (hour >= 4 && hour < 10) return 'Good morning 🌅'
  if (hour >= 10 && hour < 15) return 'Good afternoon ☀️'
  if (hour >= 15 && hour < 18) return 'Good evening 🌇'
  if (hour >= 18 || hour < 4) return 'Good night 🌙'
  return 'Hello~'
}

let handler = async (m, { conn, text, userTimezone }) => {
  if (!text) throw '💬 What would you like to chat about with watsonx, the elegant witch?'

  // Fetch Elaina thumbnail as buffer
  const thumb = await fetch('https://files.catbox.moe/oqf3vm.jpg').then(res => res.buffer())

  // Use userTimezone if provided, otherwise fallback to Harare
  const greeting = getGreeting(userTimezone || 'Africa/Harare')

  // Optional global adReply for reuse
  global.adReply = {
    contextInfo: {
      forwardingScore: 999,
      isForwarded: false,
      forwardedNewsletterMessageInfo: {
        newsletterName: '「 WATSONX 」',
        newsletterJid: '120363421521882437@newsletter'
      },
      externalAdReply: {
        title: 'ELAINA',
        body: greeting,
        previewType: 'PHOTO',
        thumbnail: thumb,
        sourceUrl: 'https://t.me/watson-xd3'
      }
    }
  }

  // AI prompt
  const prompt = `You are WATSON-XD-BOT, the best bot in Zimbabwe, created by Watson Fourpence. You are friendly, smart, helpful, and fun. You offer AI commands, group assistant features, and interactive buttons. Your personality is playful but respectful, and you respond in a cool, confident tone.`

  const url = `https://api.siputzx.my.id/api/ai/gpt3?prompt=${encodeURIComponent(prompt)}&content=${encodeURIComponent(text)}`
  const res = await fetch(url)
  const json = await res.json()

  if (!json.status || !json.data) throw '🪄 watson is exploring the world. Try asking again later~'

  const reply = `🪄 *Elaina:*\n${json.data}`

  // Send message with adReply + thumbnail
  await conn.sendMessage(m.chat, {
    text: reply,
    contextInfo: global.adReply.contextInfo
  }, { quoted: m })
}

handler.help = ['watsonx <message>']
handler.tags = ['ai']
handler.command = /^watsonx$/i
handler.premium = false
export default handler