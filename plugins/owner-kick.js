// Code by Xnuvers007
// https://github.com/Xnuvers007/

import { areJidsSameUser } from '@whiskeysockets/baileys'

let handler = async (m, { conn, participants, isAdmin }) => {
    if (!isAdmin) {
        return m.reply('This command can only be used by group admins.')
    }

    let users = m.mentionedJid.filter(u => !areJidsSameUser(u, conn.user.id))
    let kickedUser = []

    for (let user of users) {
        let participant = participants.find(v => areJidsSameUser(v.id, user)) || {}
        if (user.endsWith('@s.whatsapp.net') && !participant.admin) {
            const res = await conn.groupParticipantsUpdate(m.chat, [user], "remove")
            kickedUser = kickedUser.concat(res)
            await delay(1000)
        }
    }
}

handler.help = ['kick @user']
handler.tags = ['group']
handler.command = /^(kick)$/i

handler.owner = false
handler.group = true
handler.botAdmin = true
handler.admin = true // only group admins can use this command

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
export default handler
