let handler = async (m, { conn, args, isOwner }) => {
  if (!isOwner) throw '❌ Only the main owner can use this command!'
  if (!args[0]) throw 'Example: .addowner 263xxxxx'

  let number = args[0].replace(/[^0-9]/g, '')
  let jid = number + '@s.whatsapp.net'

  if (global.owner.find(([id]) => id === number)) {
    throw '✅ This number is already an owner!'
  }

  global.owner.push([number, ''])
  conn.reply(m.chat, `✅ @${number} is now a temporary owner`, m, {
    mentions: [jid]
  })
}

handler.help = ['addowner <number>']
handler.tags = ['owner']
handler.command = /^addowner$/i
handler.owner = true

export default handler