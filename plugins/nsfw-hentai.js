import axios from 'axios'

const handler = async (m, { conn }) => {
  try {
    m.reply('⏳ Fetching hentai image...')

    // Fetching image from the API
    const response = await axios.get('https://api.nekolabs.my.id/random/waifuim/hentai', { responseType: 'arraybuffer' })

    // Sending image to WhatsApp
    await conn.sendMessage(m.chat, {
      image: response.data,
      caption: 'Hentai image from API'
    }, { quoted: m })

  } catch (error) {
    console.log(error)
    m.reply(`❌ Error\nError log: ${error.message || error}`)
  }
}

handler.command = ['hentai']
handler.tags = ['nsfw']
handler.help = ['hentai']
handler.premium = true

export default handler