import uploadImage from '../lib/uploadImage.js';
import fetch from 'node-fetch';

let chatHistory = {};

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Reset chat history
    if (text?.toLowerCase().includes('resetchat')) {
        delete chatHistory[m.chat];
        return m.reply('✅ Chat history has been reset!');
    }

    const quoted = m?.quoted || m;
    let imageUrl = '';
    let mime = (quoted?.msg || quoted)?.mimetype || quoted?.mediaType || '';

    // Handle image uploads
    if (quoted && /image/.test(mime) && !/webp/.test(mime)) {
        await conn.reply(m.chat, '⏳ Uploading image, please wait...', m);
        try {
            const img = await quoted.download?.();
            if (!img) throw new Error('Failed to download image.');
            imageUrl = await uploadImage(img);
        } catch (err) {
            console.error('❌ Image upload error:', err);
            return m.reply('🚩 Failed to upload image. Please try again.');
        }
    }

    if (!text) throw `Example:\n${usedPrefix + command} who is Elon Musk?\nOr type: ${usedPrefix + command} send/reply image + prompt`;

    try {
        // Generate standalone AI image
        if (/^(generate|create|image)\b/i.test(text)) {
            const resultImage = await (await fetch(`https://api.nekolabs.my.id/ai/imagen/4-fast?prompt=${encodeURIComponent(text)}&ratio=1%3A1`)).json();
            if (!resultImage.result) throw new Error('Failed to generate image.');
            await conn.sendMessage(
                m.chat,
                { image: { url: resultImage.result }, caption: `✨ *AI Image Generated*\nPrompt: ${text}` },
                { quoted: m }
            );
            return;
        }

        // Generate AI image from uploaded photo
        if (imageUrl) {
            const apiUrl = `https://api.nekolabs.my.id/ai/gemini/nano-banana?prompt=${encodeURIComponent(text)}&imageUrl=${encodeURIComponent(imageUrl)}`;
            const res = await fetch(apiUrl);
            const json = await res.json();
            if (!json || !json.result) throw new Error(json?.message || "API did not return any image.");
            
            const imgRes = await fetch(json.result);
            const resultBuffer = await imgRes.buffer();
            await conn.sendMessage(
                m.chat,
                { image: resultBuffer, caption: `✨ *AI Image Result*\nPrompt: ${text}` },
                { quoted: m }
            );
            return;
        }

        // Chat-based AI conversation
        let chatId = m.chat;
        if (!chatHistory[chatId]) chatHistory[chatId] = [];
        chatHistory[chatId].push(`User: ${text}`);

        let conversation = chatHistory[chatId].join("\n");
        let apiURL = `https://api.nekolabs.my.id/ai/claude/sonnet-4?text=${encodeURIComponent(conversation)}`;
        if (imageUrl) apiURL += `&imageUrl=${encodeURIComponent(imageUrl)}`;

        let res = await fetch(apiURL);
        if (!res.ok) throw new Error('API did not respond.');
        let json = await res.json();

        const replyMessage = json.result || "⚠️ No response from API";
        chatHistory[chatId].push(`Bot: ${replyMessage}`);

        // Keep only the last 200 messages
        if (chatHistory[chatId].length > 200) {
            chatHistory[chatId] = chatHistory[chatId].slice(-200);
        }

        await conn.sendMessage(m.chat, { text: replyMessage }, { quoted: m });

    } catch (err) {
        console.error('❌ AI Error:', err);
        m.reply(`⚠️ You have reached the limit. Please type ${usedPrefix + command} resetchat to reset.`);
    }
};

handler.help = ['ai <text>', 'ai resetchat'];
handler.tags = ['ai'];
handler.command = /^ai$/i;
handler.limit = true;

export default handler;