import axios from 'axios';
import cheerio from 'cheerio';

// Function to fetch lyrics from lirik-lagu.net
async function LirikByPonta(query) {
    let url = 'https://lirik-lagu.net/search/' + encodeURIComponent(query.trim().replace(/\s+/g, '+')) + '.html';
    let { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    let $ = cheerio.load(data);

    // Get the first search result
    let first = $('.card-body.list_main .title-list a').first();
    if (!first.length) return null;

    let title = first.text().trim();
    let link = 'https://lirik-lagu.net' + first.attr('href');

    let { data: detail } = await axios.get(link, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    let $$ = cheerio.load(detail);

    // Select the lyrics section and remove unnecessary elements
    let lyrics = $$('.post-read.lirik_lagu, #lirik_lagu').first();
    lyrics.find('script,style,div[align="center"],ins,.mt-3.pt-3,.artis,.tags,.adsbygoogle').remove();

    let html = lyrics.html();
    if (!html) return null;

    let text = cheerio.load(html.replace(/<br\s*\/?>/gi, '\n')).text();
    let lines = text.split('\n').map(v => v.trim()).filter(v => v);

    // Add spacing for special lines
    let result = [];
    for (let i = 0; i < lines.length; i++) {
        if (/^(.*|.*)$/.test(lines[i]) && i > 0) result.push('');
        result.push(lines[i]);
    }

    return { title, link, lyrics: result.join('\n') };
}

// Command handler
let handler = async (m, { conn, args }) => {
    try {
        let query = args.join(' ');
        if (!query) return m.reply('❌ Please provide the song title to search for lyrics!');

        let res = await LirikByPonta(query);
        if (!res) return m.reply('⚠️ No lyrics found for this song.');

        // Prepare message text
        let message = `*${res.title}*\n\n${res.lyrics}`;

        // Send message with a button linking to the full lyrics
        await conn.sendMessage(m.chat, {
            text: message,
            buttons: [
                {
                    buttonId: `openlink ${res.link}`,
                    buttonText: { displayText: '🔗 View Full Lyrics' },
                    type: 1
                }
            ],
            headerType: 1
        }, { quoted: m });
    } catch (e) {
        console.error(e);
        m.reply('⚠️ An error occurred while fetching lyrics.');
    }
}

handler.help = ['lyrics'];
handler.command = ['lyrics', 'lirik'];
handler.tags = ['internet'];

export default handler;
