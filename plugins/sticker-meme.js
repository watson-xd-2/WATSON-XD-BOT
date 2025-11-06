import uploadImage from '../lib/uploadImage.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let [top, bottom] = text.split`|`
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  if (!mime) 
    throw `Reply to an image with the command:\n\n${usedPrefix + command} <${top ? top : 'top text'}>|<${bottom ? bottom : 'bottom text'}>`

  if (!/image\/(jpe?g|png)/.test(mime)) 
    throw `_*Mime type ${mime} is not supported!*_`

  let img = await q.download()
  let url = await uploadImage(img)
  let meme = `https://api.memegen.link/images/custom/${encodeURIComponent(top ? top : '')}/${encodeURIComponent(bottom ? bottom : '')}.png?background=${url}`
  
  await conn.sendSticker(m.chat, meme, m)
  await m.reply('✅ Meme sticker created successfully!')
}

handler.help = ['smeme <top text>|<bottom text>']
handler.tags = ['tools']
handler.command = /^(smeme)$/i

handler.register = true

export default handler