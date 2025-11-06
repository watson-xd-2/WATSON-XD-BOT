import fetch from 'node-fetch';

let handler = async (m, { args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`Usage: ${usedPrefix}${command} <apk_name>\nExample: ${usedPrefix}${command} free fire`);

    let query = args.join(' ');
    let url = `https://api.siputzx.my.id/api/apk/apkpure?search=${encodeURIComponent(query)}`;

    try {
        let res = await fetch(url);
        let json = await res.json();

        if (!json.status) return m.reply('❌ An error occurred while fetching data.');
        if (!json.data || json.data.length === 0) return m.reply(`⚠️ No APK found with the name *${query}*.`);

        let text = `📦 *Search results for "${query}" from APKPure*\n\n`;
        for (let i = 0; i < Math.min(json.data.length, 10); i++) {
            let apk = json.data[i];
            text += `*${i + 1}. ${apk.title || 'No Title'}*\n`;
            text += `👨‍💻 Developer: ${apk.developer || '-'}\n`;
            text += `⭐ Rating: ${apk.rating?.score || '-'}\n`;
            text += `🔗 Link: ${apk.link || '-'}\n\n`;
        }

        await m.reply(text.trim());
    } catch (e) {
        console.error(e);
        m.reply('❌ An error occurred while processing the API request.');
    }
};

handler.help = ['apkpure <apk_name>'];
handler.tags = ['downloader'];
handler.command = /^apkpure$/i;
handler.limit = false;

export default handler;