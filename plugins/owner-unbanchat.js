// owner-botoff.js
let handler = async (m, { conn, isOwner, isAdmin }) => {
  if (!(isOwner || isAdmin)) return dfail('admin', m, conn)

  // Get chat data and initialize it if not found
  let chat = global.db.data.chats[m.chat];
  
  // Initialize chat data if it doesn't exist
  if (!chat) {
    global.db.data.chats[m.chat] = {};  // Initialize an empty object for the chat data
    console.log(`Chat data initialized for: ${m.chat}`);
    chat = global.db.data.chats[m.chat];  // Re-fetch the initialized chat data
  }

  // Check if the bot is already turned off
  if (chat.isBanned) return m.reply('🚫 *Bot is already OFF in this chat.*')

  // Set the chat to banned (bot OFF)
  chat.isBanned = true;

  // Send a message notifying the bot is deactivated
  const msg = `
╭──〔 ❌ 𝐁𝐎𝐓 𝐃𝐄𝐀𝐂𝐓𝐈𝐕𝐀𝐓𝐄𝐃 💤 〕──╮
│ ⚠️ *Bot commands are now disabled in this chat.*
│ 👑 *Only owner/admin can turn it back ON.*
│ 💾 *Changes saved successfully!*
╰─────────𒆙─────────╯
`
  await m.reply(msg)

  // Save the updated database
  if (global.db?.save) await global.db.save()
}

handler.help = ['banchat', 'botoff']
handler.tags = ['owner']
handler.command = ['banchat', 'botoff']

export default handler;