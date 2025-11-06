import fetch from 'node-fetch'

let handler = async (m) => {
    let arr = Object.entries(db.data.chats)
        .filter(user => !user[1].expired >= 1)
        .map(user => user[0])
    
    let msg = `Successfully deleted ${arr.length} chats`
    
    for (let x of arr) delete db.data.chats[x]
    await m.reply(msg)
}

handler.help = ['resetchat']
handler.tags = ['owner']
handler.command = /^(resetchat)$/i
handler.owner = true

export default handler
