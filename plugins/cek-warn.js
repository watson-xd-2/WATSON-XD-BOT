let handler = async (m, { conn, usedPrefix }) => {
    let warning = global.db.data.users[m.sender].warning

    let status = ''
    if (warning === 0) {
        status = '✅ You are safe. No warnings.'
    } else if (warning === 1) {
        status = '⚠️ Be careful! You have 1 warning.'
    } else if (warning === 2) {
        status = '⚠️⚠️ Warning! You have 2 warnings.'
    } else {
        status = '⛔ You have reached the maximum warning limit!'
    }

    let msg = `You have ${warning} warning${warning === 1 ? '' : 's'}\n\n${status}`

    conn.reply(m.chat, msg, m)
}

handler.help = ['checkwarn']
handler.tags = ['info']
handler.command = /^(checkwarn)$/i

handler.register = true

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
