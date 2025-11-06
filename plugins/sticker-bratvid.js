import axios from 'axios'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'
import { tmpdir } from 'os'
import { join } from 'path'
import { writeFile, unlink } from 'fs/promises'

let handler = async (m, { conn, args, command }) => {
  if (!args[0]) throw `Example: .${command} hello hilman`
  
  let text = encodeURIComponent(args.join(" "))
  let api = `https://alfixd-brat.hf.space/maker/bratvid?text=${text}&background=%23FFFFFF&color=%23000000`

  try {
    // Fetch JSON response from the API
    let { data } = await axios.get(api)
    if (data.status !== 'success') throw 'API failed to return a valid video.'

    // Download the video file
    let res = await axios.get(data.video_url, { responseType: 'arraybuffer' })
    let buffer = Buffer.from(res.data)

    // Save temporarily
    let tmpPath = join(tmpdir(), `${Date.now()}.mp4`)
    await writeFile(tmpPath, buffer)

    // Create a GIF sticker from the video
    let sticker = new Sticker(tmpPath, {
      type: StickerTypes.FULL,
      pack: `${global.stickpack}`,
      author: `${global.stickauth}`,
      categories: ['🎥'],
      id: 'bratvid',
      quality: 70
    })

    let stickerBuffer = await sticker.toBuffer()

    // Send to chat
    await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })

    // Delete the temporary file
    await unlink(tmpPath)

    await m.reply('✅ Brat video sticker created successfully!')

  } catch (err) {
    console.error(err)
    throw '❌ Failed to create brat video sticker.'
  }
}

handler.help = ['bratvid <text>']
handler.tags = ['sticker']
handler.command = /^bratvid$/i
handler.limit = true
handler.register = true
handler.group = false

export default handler