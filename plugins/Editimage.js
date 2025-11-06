
import axios from "axios"
import FormData from "form-data"

async function uploadToUguu(buffer, filename = "image.jpg") {
  const form = new FormData()
  form.append("files[]", buffer, { filename })
  const { data } = await axios.post("https://uguu.se/upload.php", form, {
    headers: form.getHeaders(),
    timeout: 60000
  })
  const url = data?.files?.[0]?.url
  if (!url) throw new Error("Failed to upload to Uguu")
  return url
}

const handler = async (m, { conn, text, usedPrefix }) => {
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ""

  if (!/image\//i.test(mime)) {
    return conn.sendMessage(
      m.chat,
      { text: `📷 Reply to an *image* with caption: *${usedPrefix}editimg <prompt>*` },
      { quoted: m }
    )
  }

  if (!text) {
    return conn.sendMessage(
      m.chat,
      { text: "📝 Prompt is required!\nExample: *.editimg turn into realistic anime with warm lighting*" },
      { quoted: m }
    )
  }

  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

  try {
    const imgBuffer = await q.download()
    if (!imgBuffer?.length) throw new Error("Failed to download media")

    const imageUrl = await uploadToUguu(imgBuffer, "input.jpg")

    const apiUrl = `https://api.deline.my.id/ai/editimg?url=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(text)}&apikey=agasndul`
    const { data } = await axios.get(apiUrl, { timeout: 180000 })

    if (!data?.status || !data?.result?.url) {
      throw new Error(data?.error || "API did not return a result")
    }

    const outResp = await axios.get(data.result.url, {
      responseType: "arraybuffer",
      timeout: 120000
    })
    const outBuf = Buffer.from(outResp.data)

    await conn.sendFile(m.chat, outBuf, "editimg.jpg", "✨ *Image Edited Successfully*", m)
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })
  } catch (e) {
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
    conn.sendMessage(m.chat, { text: `Failed: ${e?.message || e}` }, { quoted: m })
  }
}

handler.help = ["editimg <prompt>", "editimage <prompt>", "editphoto <prompt>"]
handler.tags = ["ai"]
handler.command = /^(editimg|editimage|editphoto|editgambar)$/i
handler.register = true
handler.premium = true

export default handler