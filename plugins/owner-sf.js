import fs from 'fs'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) 
    throw `Hmm.. where's the file path?\n\nUsage:\n${usedPrefix + command} <file_path>\n\nExample:\n${usedPrefix + command} plugins/melcanz.js`
  
  if (!m.quoted?.text) 
    throw `⚠️ Please reply to a message containing the text you want to save.`

  const path = `${text}`
  fs.writeFileSync(path, m.quoted.text)
  m.reply(`✅ Saved successfully to ${path}`)
}

handler.help = ['sf'].map(v => v + ' <file_path>')
handler.tags = ['owner']
handler.command = /^sf$/i

handler.rowner = true

export default handler