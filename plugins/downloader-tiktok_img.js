// Coded by Xnuvers007
// ======================================================

import axios from 'axios';
import cheerio from 'cheerio';

let handler = async (m, { conn, text, args, command, usedPrefix }) => {
    if (!text) throw 'Where is the link?'

    // Change main and backup URL as needed
    let mainUrl = `https://dlpanda.com/id?url=${text}&token=G7eRpMaa`;
    let backupUrl = `https://dlpanda.com/id?url=${text}&token51=G32254GLM09MN89Maa`;
    let creator = 'Xnuvers007';

    try {
        let response = await axios.get(mainUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.7',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        let asd = [];
        let imgSrc = [];

        $('div.col-md-12 > img').each((index, element) => {
            imgSrc.push($(element).attr('src'));
        });

        asd.push({ creator, imgSrc });

        let fix = imgSrc.map((e, i) => {
            return { img: e, creator: creator[i] }
        });

        // If main URL fails, try backup URL
        if (asd[0].imgSrc.length === 0) {
            response = await axios.get(backupUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.7',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive'
                }
            });

            const html2 = response.data;
            const $2 = cheerio.load(html2);

            let imgSrc2 = [];

            $2('div.col-md-12 > img').each((index, element) => {
                imgSrc2.push($2(element).attr('src'));
            });

            asd.push({ creator, imgSrc: imgSrc2 });
        }

        if (asd[0].imgSrc.length === 0) {
            throw 'No images found';
        }

        m.reply('Please wait, sending images...');
        for (let i of asd[0].imgSrc) {
            try {
                await conn.sendFile(m.chat, i, '', null, m);
            } catch (e) {
                console.error(e);
                m.reply('An error occurred while sending the image, retrying...');
            }
        }
        m.reply(`Keep supporting ${global.namebot}\nDon't forget to donate using the bot number ${global.nomorown}`);
    } catch (error) {
        m.reply('An error occurred, contact the owner to fix it.');
        console.error(error);
    }
}

handler.help = ['tiktokimg / ttimg <url>']
handler.tags = ['downloader']
handler.command = /^(ttimg|tiktokimg)$/i
handler.limit = true;

export default handler
