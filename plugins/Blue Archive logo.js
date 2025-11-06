import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Example: ${usedPrefix + command} Ytta|Aja`
  
  let [textL, textR] = text.split('|')
  if (!textL || !textR) throw `Incorrect format!\n\nExample: ${usedPrefix + command} Ytta|Aja`
  
  try {
    let url = `https://api.nekolabs.my.id/canvas/ba-logo?textL=${encodeURIComponent(textL)}&textR=${encodeURIComponent(textR)}`
    let res = await fetch(url)
    if (!res.ok) throw await res.text()
    
    let buffer = await res.arrayBuffer()
    await conn.sendFile(m.chat, buffer, 'balogo.jpg', `✨ Logo created successfully!`, m)
  } catch (e) {
    throw `❌ An error occurred while creating the logo`
  }
}

handler.help = ['balogo <text1|text2>']
handler.tags = ['maker']
handler.command = /^balogo$/i
handler.limit = true

export default handler