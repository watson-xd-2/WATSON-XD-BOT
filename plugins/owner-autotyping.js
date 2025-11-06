let handler = async (m, { args }) => {
    if (!args[0]) return m.reply(`
Type:
.autotyping on
.autotyping off
    `)

    let input = args[0].toLowerCase()
    if (!['on', 'off'].includes(input)) return m.reply('Use `on` or `off`')

    global.autotyping = input === 'on'
    m.reply(`Auto Typing is now ${global.autotyping ? '✅ ENABLED' : '❌ DISABLED'}`)
}

handler.help = ['autotyping [on/off]']
handler.tags = ['owner']
handler.command = /^autotyping$/i
handler.owner = true

export default handler