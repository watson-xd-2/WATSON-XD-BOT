import fs from "fs"
import path from "path"
import axios from "axios"
import fetch from "node-fetch"
import FormData from "form-data"

// Generates the AI prompt for the football poster
const Prompt = (playerName, jerseyNumber) => `
Create an ultra-realistic, high-resolution cinematic professional football (soccer) poster.
The central figure is based on the provided input image.
**Preserve the original face, hair, shape, and angle of the person from the input image exactly.**

The poster features three distinct perspectives of the player:
1.  **Super Close-up Portrait:** The player's face with a clear view of the Manchester United home jersey (2025 season).
2.  **Side Profile View:** The player wearing the Manchester United home jersey (2025 season) from the side, with the name "${playerName}" clearly visible on the back.
3.  **Full-Body Action Shot:** The player in a complete Manchester United home football kit (2025 season jersey, shorts, socks, and cleats) with authentic sponsor logos.

**Jersey Details:** The number "${jerseyNumber}" must be prominently displayed on the front, back, and shorts of the jersey in all depictions.

**Dynamic Action Scene (Bottom Section):** At the bottom of the poster, integrate a dynamic, high-motion action scene. Show the player performing a powerful bicycle kick. Include motion blur and realistic flying grass effects.

**Background:** A bold dark blue Old Trafford stadium serves as the background. Behind the main character, a large, glowing number "${jerseyNumber}" and the name "${playerName}" are subtly integrated, creating an epic aura.

**Overall Style:** The poster should exude professional sports poster vibes, high-resolution details, and cinematic quality.

**Logo:** Place the official Manchester United logo in the top right corner.
`

// Upload image to Uguu
async function uploadToUguu(filePath) {
  const form = new FormData()
  form.append("files[]", fs.createReadStream(filePath))
  const res = await fetch("https://uguu.se/upload.php", { method: "POST", body: form })
  if (!res.ok) throw new Error(`Uguu upload failed: ${res.status}`)
  const json = await res.json()
  const url = json?.files?.[0]?.url
  if (!url) throw new Error("Invalid response from Uguu")
  return url
}

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ""

  // Validate input image
  if (!/image\/(png|jpe?g|webp)/i.test(mime)) {
    return conn.sendMessage(
      m.chat,
      { text: `❌ Reply to an *IMAGE* you want to turn into a player, then use:\n*${usedPrefix + command} <name> | <number>*\nExample: *${usedPrefix + command} Agas | 03*` },
      { quoted: m }
    )
  }

  if (!text || !text.includes("|")) {
    return conn.sendMessage(
      m.chat,
      { text: `⚠️ Format: *${usedPrefix + command} <name> | <number>*\nExample: *${usedPrefix + command} Agas | 03*` },
      { quoted: m }
    )
  }
  
  const [playerName, jerseyNumber] = text.split("|").map(s => s.trim())
  if (!playerName || !jerseyNumber) {
    return conn.sendMessage(
      m.chat,
      { text: `⚠️ Both name & number are required. Example: *${usedPrefix + command} Agas | 03*` },
      { quoted: m }
    )
  }

  const reactStart = { react: { text: "⏳", key: m.key } }
  const reactDone  = { react: { text: "✅", key: m.key } }

  let tmpPath
  try {
    await conn.sendMessage(m.chat, reactStart)

    if (!fs.existsSync("./tmp")) fs.mkdirSync("./tmp", { recursive: true })
    const media = await q.download()
    if (!media?.length) throw new Error("Failed to read image")

    tmpPath = path.join("./tmp", `tofootball_${m.sender}.png`)
    fs.writeFileSync(tmpPath, media)

    const imageUrl   = await uploadToUguu(tmpPath)
    const finalPrompt = Prompt(playerName, jerseyNumber)

    const { data } = await axios.get(
      `https://api.deline.my.id/ai/editimg?url=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(finalPrompt)}`,
      { timeout: 180000 }
    )

    if (!data?.status || !data?.result) throw new Error(data?.error || "Failed to process poster")

    const resultUrl = typeof data.result === "string" ? data.result : data.result.url
    if (!resultUrl) throw new Error("Result URL not found")

    await conn.sendMessage(
      m.chat,
      { image: { url: resultUrl }, caption: `✨ *Football Poster Completed!*` },
      { quoted: m }
    )
  } catch (e) {
    await conn.sendMessage(m.chat, { text: `❌ Error: ${e.message || e}` }, { quoted: m })
  } finally {
    if (tmpPath && fs.existsSync(tmpPath)) { try { fs.unlinkSync(tmpPath) } catch {} }
    await conn.sendMessage(m.chat, reactDone)
  }
}

handler.help = ["tofootball name | number"]
handler.tags = ["ai", "premium"]
handler.command = /^(tofootball)$/i
handler.register = true
handler.premium = true

export default handler