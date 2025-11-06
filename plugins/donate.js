// 💰 Support / Donate Plugin with EcoCash Merchant

// By Watson-xd

let handler = async (m, { conn }) => {

  const text = `

╭───「 ⚓ *Support Watson-XD Bot* 」

│

│ 🌊 Help keep the bot running by donating!

│

│ 💵 *EcoCash (Zimbabwe)*:

│ • Merchant Name: Watson-xd Devs

│ • Number: +263781330745

│ • Dial: *151*1*1*263781330745*AMOUNT# on your phone

│

│ 💳 *Other Methods:*

│ • Coming Soon.....

│

│ 📞 *Contact Owner:* .owner

│

│ ⚓ "Every drop fills the ocean — thank you for supporting!"

╰────────────────────────────╯

`

  await conn.reply(m.chat, text, m)

}

handler.help = ['support', 'donate']

handler.tags = ['info']

handler.command = /^(support|donate)$/i

export default handler