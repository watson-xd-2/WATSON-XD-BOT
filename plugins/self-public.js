let handler = async(m, { conn, command }) => {
    let isPublic = command === "public";
    let self = global.opts["self"]

    if(self === !isPublic) return m.reply(`Already ${!isPublic ? "Self" : "Public"} mode ${m.sender.split("@")[0] === global.owner[1] ? "Ma'am" : "Sir"} :v`)

    global.opts["self"] = !isPublic

    m.reply(`Successfully switched to ${!isPublic ? "Self" : "Public"} mode!`)
}

handler.help = ["self", "public"]
handler.tags = ["owner"]

handler.rowner = true

handler.command = /^(self|public)/i

export default handler