import uploadImage from '../lib/uploadImage.js';
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';

    // Ensure the replied message is an image
    if (!/image/.test(mime)) {
        throw `❌ Wrong format! Reply to an image with caption:\n*${usedPrefix + command} <prompt>*\n\n*Example:*\n${usedPrefix + command} in ghibli style`;
    }

    // Ensure prompt exists
    if (!text) {
        throw `❌ Prompt cannot be empty! Reply to an image with caption:\n*${usedPrefix + command} <prompt>*\n\n*Example:*\n${usedPrefix + command} in ghibli style`;
    }

    // Validate prompt length
    if (text.length > 500) {
        throw `❌ Prompt too long! Maximum 500 characters.`;
    }

    let processingMsg;
    try {
        processingMsg = await m.reply('⏳ Processing image with Nano-Banana AI...');

        // Download and upload image
        const img = await q.download();
        if (!img || img.length === 0) throw new Error('Failed to download image!');

        if (img.length > 10 * 1024 * 1024) throw new Error('Image too large! Max 10MB.');

        const imageUrl = await uploadImage(img);
        if (!imageUrl || !imageUrl.startsWith('http')) throw new Error('Invalid uploaded image URL!');

        await conn.sendMessage(m.chat, { 
            text: '🎨 Image uploaded successfully, processing with AI...', 
            edit: processingMsg.key 
        });

        // Retry logic for API call
        const makeRequest = async (retries = 3) => {
            for (let i = 0; i < retries; i++) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

                    const apiUrl = `https://api.platform.web.id/nano-banana?imageUrl=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(text)}`;
                    
                    const response = await fetch(apiUrl, {
                        method: 'GET',
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                            'Accept': 'application/json',
                            'Connection': 'keep-alive'
                        },
                        signal: controller.signal,
                        timeout: 60000
                    });

                    clearTimeout(timeoutId);

                    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

                    const json = await response.json();
                    return json;

                } catch (error) {
                    console.log(`Attempt ${i + 1} failed:`, error.message);
                    
                    if (i === retries - 1) throw error;

                    await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));

                    await conn.sendMessage(m.chat, { 
                        text: `🔄 Retrying... (${i + 2}/${retries})`, 
                        edit: processingMsg.key 
                    });
                }
            }
        };

        const json = await makeRequest();

        if (!json || !json.success || !json.result?.results?.length) {
            throw new Error(json?.message || 'No result returned by AI');
        }

        const resultUrl = json.result.results[0].url;
        if (!resultUrl || !resultUrl.startsWith('http')) throw new Error('Invalid AI result URL');

        await conn.sendMessage(m.chat, { 
            text: '✅ Success! Sending result...', 
            edit: processingMsg.key 
        });

        await conn.sendMessage(m.chat, { 
            image: { url: resultUrl }, 
            caption: `✨ *Nano-Banana AI Result*\n\n*Prompt:* ${text}\n*Processed by:* @${m.sender.split('@')[0]}`,
            mentions: [m.sender]
        }, { quoted: m });

        try { await conn.sendMessage(m.chat, { delete: processingMsg.key }); } catch {}

    } catch (error) {
        console.error('Nano-Banana plugin error:', error);

        if (processingMsg) {
            try { await conn.sendMessage(m.chat, { delete: processingMsg.key }); } catch {}
        }

        let errorMessage = '🚨 Error: ';
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
            errorMessage += 'Request timeout. Server took too long to respond.';
        } else if (error.message.includes('socket hang up') || error.message.includes('ECONNRESET')) {
            errorMessage += 'Connection lost. Try again later.';
        } else if (error.message.includes('invalid parameter')) {
            errorMessage += 'Invalid parameters. Ensure image and prompt are correct.';
        } else if (error.message.includes('HTTP 429')) {
            errorMessage += 'Too many requests. Please wait and try again.';
        } else if (error.message.includes('HTTP 500')) {
            errorMessage += 'Server error. Try again later.';
        } else if (error.message.includes('HTTP')) {
            errorMessage += `Server error: ${error.message}`;
        } else {
            errorMessage += error.message || 'Unknown error';
        }

        await m.reply(errorMessage + '\n\n💡 *Tips:*\n• Max image size: 10MB\n• Use prompt in English\n• Retry after a few minutes if server is busy');
    }
};

handler.help = ['nanobanana <prompt>'];
handler.tags = ['ai', 'tools'];
handler.command = ['nanobanana', 'nb'];
handler.limit = true;
handler.premium = false;

export default handler;