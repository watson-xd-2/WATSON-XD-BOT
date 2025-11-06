let limit = 5

let handler = async (m, { conn, usedPrefix, command, text }) => {
    let who = m.mentionedJid[0] 
        ? m.mentionedJid[0] 
        : m.quoted 
        ? m.quoted.sender 
        : text 
        ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' 
        : false

    if (!who) 
        return m.reply(`⚠️ Please reply to a user or tag them!\n\nExample:\n${usedPrefix + command} @${m.sender.split('@')[0]}`, false, { mentions : [m.sender] })

    let chat = global.db.data.chats[m.chat]
    if (!chat.member[who]) chat.member[who] = { warn: 0 } // ensure user data exists
    let user = chat.member[who]

    switch (command) {
        case 'addwarn':
        case 'warn':
            user.warn += 1
            if (user.warn >= limit) {
                await conn.reply(m.chat, `⚠️ This user has reached the warning limit of ${limit} and will be removed from the group.`, m)
                await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
                user.warn = 0
            } else {
                await conn.reply(m.chat, `⚠️ User has been warned.\nWarnings: ${user.warn}/${limit}`, m)
            }
            break

        case 'delwarn':
        case 'removewarn':
            if (user.warn == 0) {
                await m.reply(`✅ This user has no warnings.`)
            } else {
                user.warn -= 1
                await m.reply(`✅ Successfully removed a warning.\nWarnings: ${user.warn}/${limit}`)
            }
            break

        case 'checkwarn':
        case 'warns':
            await m.reply(`📊 User warning status:\n\n- @${who.split('@')[0]}\n- Warnings: ${user.warn}/${limit}`, false, { mentions: [who] })
            break

        case 'resetwarn':
            user.warn = 0
            await m.reply(`🔄 All warnings for @${who.split('@')[0]} have been reset.`, false, { mentions: [who] })
            break

        default:
            // do nothing
    }
}

handler.help = ['addwarn', 'delwarn', 'checkwarn', 'resetwarn']
handler.tags = ['group']
handler.command = /^(addwarn|warn|delwarn|removewarn|checkwarn|warns|resetwarn)$/i
handler.admin = true
handler.group = true

export default handler