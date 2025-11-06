import { join } from 'path';
import { readdirSync, statSync, unlinkSync } from 'fs';

let handler = async (m, { conn, __dirname }) => {
    try {
        const sessionsDir = join(__dirname, '../sessions');
        const filenames = [];

        // Collect all files except creds.json
        readdirSync(sessionsDir).forEach(file => {
            if (file !== 'creds.json') {
                filenames.push(join(sessionsDir, file));
            }
        });

        const deletedFiles = [];

        // Delete each file
        filenames.forEach(file => {
            const stats = statSync(file);
            if (stats.isFile()) {
                unlinkSync(file);
                deletedFiles.push(file);
            }
        });

        // Send success message
        if (deletedFiles.length > 0) {
            conn.reply(m.chat, `Deleted files:\n${deletedFiles.join('\n')}`, m);
        } else {
            conn.reply(m.chat, 'No files left in the sessions folder.', m);
        }
    } catch (error) {
        console.error("Error clearing sessions:", error);
        conn.reply(m.chat, 'An error occurred while clearing session files.', m);
    }
};

handler.help = ['clearsession'];
handler.tags = ['owner'];
handler.command = /^(clearsession|clear)$/i;
handler.rowner = true; // Only owner can run

export default handler;
