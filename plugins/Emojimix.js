import fetch from 'node-fetch'
import WSF from 'wa-sticker-formatter'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text || !text.includes('+')) 
    throw `Usage: ${usedPrefix + command} emoji1+emoji2\n\nExample: *${usedPrefix + command} 😅+🤔*`
  
  let [emoji1, emoji2] = text.split`+`
  if (!emoji1) throw 'emoji1 cannot be empty'
  if (!emoji2) throw 'emoji2 cannot be empty'

  const res = await fetch(`https://api.deline.web.id/maker/emojimix?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`)
  if (!res.ok) throw await res.text()
  const json = await res.json()
  if (!json.status || !json.result?.png) throw 'Emoji not supported!'

  try {
    const imgBuf = Buffer.from(await (await fetch(json.result.png)).arrayBuffer())
    const stc = new WSF.Sticker(imgBuf, {
      pack: global.packname || 'Watson Fourpence',
      author: global.author || 'Agas',
      type: 'full',
      quality: 80
    })
    const stickerBuf = await stc.build()
    await conn.sendMessage(m.chat, { sticker: stickerBuf }, { quoted: m })
  } catch (e) {
    console.error(e)
    m.reply('Emoji cannot be used')
  }
}

handler.help = ['emojimix <emoji1+emoji2>']
handler.tags = ['tools']
handler.command = /^(emojimix)$/i
handler.register = true
handler.limit = true

export default handler