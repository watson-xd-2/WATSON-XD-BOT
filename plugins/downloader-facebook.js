import fetch from 'node-fetch'

global.fbTemp = global.fbTemp || {}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })

    if (!args[0]) {
        return m.reply(`🚨 Example:\n• ${usedPrefix + command} <Facebook URL>\n• ${usedPrefix + command} 720p\n\nType *.fb <url>* first to start.`)
    }

    let isUrl = args[0].startsWith('http://') || args[0].startsWith('https://')
    let user = m.sender

    // === SELECTING SAVED RESOLUTION OR DEFAULT HD ===
    if (!isUrl) {
        let videoList = global.fbTemp[user]
        if (!videoList) throw '⚠️ No saved video found. Type *.fb <url>* first.'

        let wanted = args.join(' ').toLowerCase()
        let selected = videoList.find(v => v.quality.toLowerCase().includes(wanted))
        if (!selected) throw '❌ Resolution not found. Check the previous list.'

        await conn.sendMessage(m.chat, { react: { text: '⬇️', key: m.key } })
        await conn.sendFile(m.chat, selected.url, `fb-${selected.quality}.mp4`, `🎞️ Video quality *${selected.quality}*`, m)
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        return
    }

    // === FETCHING NEW VIDEO AND AUTO-SENDING HD ===
    try {
        let api = `https://www.sankavolereii.my.id/download/facebook?apikey=planaai&url=${encodeURIComponent(args[0])}`
        let res = await fetch(api)
        if (!res.ok) throw '❌ Failed to fetch data.'

        let json = await res.json()
        if (!json.status || !json.result || !Array.isArray(json.result.video)) throw '❌ Video not found.'

        let { title, duration, video } = json.result
        global.fbTemp[user] = video // save video list in session

        // Automatically select HD version, fallback to last option
        let selected = video.find(v => /HD/i.test(v.quality)) || video.at(-1)
        if (!selected?.url) throw '❌ Video URL not found.'

        let caption = `📹 *${title}*\n⏱️ Duration: ${duration}\n\n✅ Sending highest quality available: *${selected.quality}*\n\n🔽 Type again to choose another quality:`
        video.forEach(v => caption += `\n• *.fb ${v.quality}*`)

        await conn.sendFile(m.chat, selected.url, `${title.replace(/[^\w\s\-_.]/gi, '')}.mp4`, caption, m)
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error(e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        m.reply('⚠️ Failed to fetch video.')
    }
}

handler.help = ['fb'].map(v => v + ' <url|resolution>')
handler.tags = ['downloader']
handler.command = /^(fb|facebook|fesnuk)$/i
handler.limit = true

export default handler
