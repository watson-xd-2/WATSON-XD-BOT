let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!/image|video|webp/.test(mime)) {
      return m.reply('⚠️ Please reply to an *image*, *video*, or *sticker* to create a sticker.')
    }

    if (/image|video|webp/.test(mime)) {
      // Treat GIFs as videos (WhatsApp sends them as mp4)
      const isVideoLike = /video|gif/.test(mime) || (q.mediaType === 'videoMessage')
      const seconds = Number(q.msg?.seconds || q.seconds || q.duration || 0)

      if (isVideoLike && seconds > 10) {
        return m.reply('❌ The video must be *under 10 seconds* long.')
      }

      let media = await q.download()
      let exif
      if (text) {
        const [packname, author] = text.split(/[,|\-+&]/)
        exif = { packName: packname?.trim() || '', packPublish: author?.trim() || '' }
      }

      await conn.sendSticker(m.chat, media, m, exif)
      await m.reply('✅ Sticker created successfully!')
      return
    }

    return m.reply('⚠️ Send or reply to any media (image, short video, or sticker) to make a sticker.')
  } catch (e) {
    console.error(e)
    return m.reply('❌ An error occurred while creating the sticker. Please try again.')
  }
}

handler.help = ['sticker']
handler.tags = ['sticker']
handler.command = /^s(tic?ker)?(gif)?$/i
handler.register = true

export default handler