import fetch from 'node-fetch'

let handler = async (m, { text, command }) => {
  if (!text) throw `🚩 Example:\n.font Hello Watson\n.font 5 Hello Watson\n.font bubble Hello Watson\n.fontlist Hello Watson`

  let number = null
  let name = null
  let content = text.trim()

  if (/^\d+ /.test(content)) {
    let split = content.split(' ')
    number = parseInt(split[0])
    content = split.slice(1).join(' ')
  } else if (/^\w+ /.test(content) && command !== 'fontlist') {
    let split = content.split(' ')
    name = split[0].toLowerCase()
    content = split.slice(1).join(' ')
  }

  try {
    let url = `https://api.princetechn.com/api/tools/fancyv2?apikey=prince&text=${encodeURIComponent(content)}`
    let res = await fetch(url)
    let json = await res.json()
    if (!json.status || !json.results) throw '❌ Failed to fetch data from API'

    if (command === 'fontlist') {
      let result = `✨ *Font List* ✨\n\n`
      json.results.forEach((r, i) => {
        result += `*${i + 1}.* ${r.name}\n`
      })
      m.reply(result)
      return
    }

    if (number) {
      let selected = json.results[number - 1]
      if (!selected) throw `❌ Number not found!\nChoose between 1 - ${json.results.length}`
      m.reply(`✨ *Font #${number} (${selected.name})*\n\n${selected.result}`)
    } else if (name) {
      let selected = json.results.find(r => r.name.toLowerCase() === name)
      if (!selected) {
        let listNames = json.results.map(r => r.name).slice(0, 10).join(', ')
        throw `❌ Style *${name}* not found!\n\nExample styles: ${listNames}, etc.`
      }
      m.reply(`✨ *Font (${selected.name})*\n\n${selected.result}`)
    } else {
      let result = `✨ *Font Generator* ✨\n\n`
      json.results.forEach((r, i) => {
        result += `*${i + 1}. ${r.name}*\n${r.result}\n\n`
      })
      m.reply(result)
    }
  } catch (e) {
    console.error(e)
    throw '❌ An error occurred!'
  }
}

handler.help = ['font <text>', 'font <no> <text>', 'font <name> <text>', 'fontlist <text>']
handler.tags = ['tools']
handler.command = /^(font|fontlist)$/i
handler.limit = false

export default handler