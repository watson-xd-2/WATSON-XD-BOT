// AFK command
let afkHandler = async (m, { conn, text }) => {
    let user = global.db.data.users[m.sender];
    let _uptime = process.uptime() * 1000;
    let uptime = clockString(_uptime);

    user.afk = Date.now();
    user.afkReason = text;

    conn.sendMessage(m.chat, {
        text: `${user.registered ? user.name : await conn.getName(m.sender)} is now AFK.\n\nReason ➠ ${text || 'No reason provided'}`,
        contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363421521882437@newsletter',
                newsletterName: `Powered by ${global.author} / runtime ${uptime}`,
                serverMessageId: -1
            },
            forwardingScore: 256,
            externalAdReply: {
                title: global.wm,
                body: '',
                thumbnailUrl: 'https://kua.lat/inori',
                sourceUrl: sgc, // Replace with your relevant website
                mediaType: 1,
                renderLargerThumbnail: false
            }
        }
    });
};

afkHandler.help = ['afk'].map(v => v + ' <reason>');
afkHandler.tags = ['group'];
afkHandler.command = /^afk$/i;

// Middleware to detect returning users
let afkReturnHandler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];

    // If user was AFK
    if (user.afk) {
        const reason = user.afkReason || 'No reason provided';
        const duration = clockString(Date.now() - user.afk);

        // Reset AFK status
        user.afk = false;
        user.afkReason = null;

        // Notify the chat
        conn.sendMessage(m.chat, {
            text: `${user.registered ? user.name : await conn.getName(m.sender)} is back from AFK!\nTime away: ${duration}\nReason was: ${reason}`
        });
    }

    // Notify if any mentioned user is AFK
    if (m.mentionedJid && m.mentionedJid.length) {
        for (let jid of m.mentionedJid) {
            let mentionedUser = global.db.data.users[jid];
            if (mentionedUser && mentionedUser.afk) {
                const reason = mentionedUser.afkReason || 'No reason provided';
                const duration = clockString(Date.now() - mentionedUser.afk);
                conn.sendMessage(m.chat, {
                    text: `${await conn.getName(jid)} is currently AFK\nTime away: ${duration}\nReason: ${reason}`
                });
            }
        }
    }
};

export { afkHandler, afkReturnHandler };

// Utility
function clockString(ms) {
    if (isNaN(ms)) return '--:--:--';
    const h = Math.floor(ms / 3600000);
    const m = Math.floor(ms / 60000) % 60;
    const s = Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}