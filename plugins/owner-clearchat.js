let handler = async (m, { conn, args }) => {
  try {
    if (!args[0]) throw 'Please provide a JID for a person or group.'
    let jid = args[0]

    // Ensure JID is valid format
    if (!jid.includes('@')) {
      // If user just inputs a number, assume it’s a personal chat
      jid = jid.includes('-') ? jid + '@g.us' : jid + '@s.whatsapp.net'
    }

    // Attempt to delete the last message in that chat
    await conn.chatModify({
      delete: true,
      lastMessages: [{
        key: m.key,
        messageTimestamp: m.messageTimestamp
      }]
    }, jid)

    conn.reply(m.chat, `✅ Successfully deleted chat for ${jid}`, m)
  } catch (error) {
    console.error(error)
    conn.reply(m.chat, '⚠️ An error occurred while deleting the chat. Please check the JID format and try again.', m)
  }
}

handler.help = ['clearchat']
handler.tags = ['owner']
handler.owner = true
handler.command = /^(clearchat)$/i

export default handler