let handler = async (m, { conn, args }) => {
    const bot = conn.user.jid 
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''

    if (/image/.test(mime)) {
        const img = await q.download()
        if (!img) throw `❌ No image found! Please reply to an image.`

        await conn.updateProfilePicture(bot, img)
        await conn.reply(m.chat, '✅ Successfully updated my profile picture!', m)
    } else {
        await conn.reply(m.chat, '❌ Where is the image? Send or reply to an image with the caption .setppbot', m)
    }
}

handler.help = ['setbotpp']
handler.tags = ['owner']
handler.command = /^(setbotpp|setppbot)$/i
handler.owner = true

export default handler