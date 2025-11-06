import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) throw `⚠️ Please provide a Pastebin link!\n\nExample:\n.pastebin https://pastebin.com/kwLd6w7N`

  try {
    let url = `https://api.princetechn.com/api/download/pastebin?apikey=prince&url=${encodeURIComponent(text)}`
    let res = await fetch(url)
    let data = await res.json()

    if (!data.success) throw `❌ Failed to fetch data from Pastebin.`

    let result = data.result || 'No content found.'
    await conn.reply(m.chat, result, m)
  } catch (e) {
    console.error(e)
    throw `❌ Error fetching Pastebin data!`
  }
}

handler.help = ['pastebin <url>']
handler.tags = ['downloader', 'tools']
handler.command = /^pastebin$/i
handler.limit = true

export default handler