import axios from 'axios'
import FormData from 'form-data'
import { writeFileSync, unlinkSync } from 'fs'

// Your API key for Reaimagine
const API_KEY = "-mY6Nh3EWwV1JihHxpZEGV1hTxe2M_zDyT0i8WNeDV4buW9l02UteD6ZZrlAIO0qf6NhYA"

// Simple sleep function for retry delays
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

// Process the image buffer
async function processImage(buffer) {
  const tempPath = `./tmp/temp_${Date.now()}.jpg`
  writeFileSync(tempPath, buffer)

  try {
    const form = new FormData()
    form.append("file", buffer, { filename: 'image.jpg' })

    // Upload the image
    const uploadRes = await axios.post(
      "https://reaimagine.zipoapps.com/enhance/autoenhance/",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: API_KEY,
          "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 10; Redmi Note 5 Pro Build/QQ3A.200805.001)",
        },
      }
    )

    const name = uploadRes.headers["name"] || uploadRes.data?.name
    if (!name) throw new Error("Failed to get 'name' from upload response")

    // Poll for the processed image
    let attempts = 0
    const maxAttempts = 20

    while (attempts < maxAttempts) {
      attempts++
      try {
        const res = await axios.post(
          "https://reaimagine.zipoapps.com/enhance/request_res/",
          null,
          {
            headers: {
              name,
              app: "enhanceit",
              ad: "0",
              Authorization: API_KEY,
              "Content-Type": "application/x-www-form-urlencoded",
              "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 10; Redmi Note 5 Pro Build/QQ3A.200805.001)",
            },
            responseType: "arraybuffer",
            validateStatus: () => true,
          }
        )

        if (res.status === 200 && res.data && res.data.length > 0) {
          return Buffer.from(res.data)
        }
      } catch {}
      await sleep(5000) // Wait 5 seconds before next attempt
    }

    throw new Error("Failed to get processed image after multiple attempts.")
  } finally {
    try { unlinkSync(tempPath) } catch {}
  }
}

// WhatsApp handler
let handler = async (m, { conn }) => {
  try {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''

    if (!mime.startsWith('image/')) return m.reply('🚫 Please reply to an image!')

    m.reply('⏳ Enhancing your image, please wait...')

    const media = await q.download()
    const result = await processImage(media)

    await conn.sendMessage(m.chat, { 
      image: result, 
      caption: '✅ Image enhanced successfully!' 
    }, { quoted: m })

  } catch (e) {
    m.reply(`❌ Error: ${e.message}`)
  }
}

handler.help = ['enhance']
handler.command = ['enhance']
handler.tags = ['tools']

export default handler
