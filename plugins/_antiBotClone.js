
import { areJidsSameUser } from '@whiskeysockets/baileys';

export async function before(m, { participants, conn }) {
  if (m.isGroup) {
    let chat = global.db.data.chats[m.chat];

    if (!chat.antiBotClone) {
      return;
    }

    let botJid = global.conn.user.jid; // JID of the main bot

    if (botJid === conn.user.jid) {
      return;
    } else {
      let isBotPresent = participants.some(p => areJidsSameUser(botJid, p.id));

      if (isBotPresent) {
        setTimeout(async () => {
          await m.reply(`✨ Since the main bot is in this group, I will leave to avoid spam.`);
          await this.groupLeave(m.chat);
        }, 5000); // 5 seconds
      }
    }
  }
}