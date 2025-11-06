const antiCmds = ["ping", "runtime", "menu", "play", 'song', "tag", "tagall", "repo", "sobxmd", "owner", "hack", "list", "left", "leave", "apk", "modapk", "video"];
export async function before(_0x3f9057, {
  conn: _0x46836a,
  isAdmin: _0x1e47bf,
  isBotAdmin: _0x2a93d0,
  text: _0x4507d3
}) {
  if (_0x3f9057.isBaileys && _0x3f9057.fromMe) {
    return true;
  }
  if (!_0x3f9057.isGroup) {
    return false;
  }
  const _0x1a89a4 = global.db.data.chats[_0x3f9057.chat];
  const _0x2c228b = _0x3f9057.key.id;
  const _0x28d215 = _0x3f9057.key.participant;
  const _0x1c68b5 = '@' + _0x3f9057.sender.split`@`[0];
  if (_0x1a89a4.anticmds && !_0x1e47bf) {
    if (antiCmds.some(_0x426779 => _0x3f9057.text.toLowerCase().includes(',' + _0x426779) || _0x3f9057.text.toLowerCase().includes('.' + _0x426779))) {
      if (_0x2a93d0) {
        await this.sendMessage(_0x3f9057.chat, {
          'text': "*🙋 ʀᴜʟᴇs ᴠɪᴏʟᴀᴛɪᴏɴ ᴄᴏᴍᴍᴀɴᴅ ᴅᴇᴛᴇᴄᴛᴇᴅ ʙʏᴇ ʙʏᴇ 👋🏻* " + _0x1c68b5 + "\n\n*WATSON-XD-BOT*",
          'mentions': [_0x3f9057.sender]
        }, {
          'quoted': _0x3f9057
        });
        await _0x46836a.sendMessage(_0x3f9057.chat, {
          'delete': {
            'remoteJid': _0x3f9057.chat,
            'fromMe': false,
            'id': _0x2c228b,
            'participant': _0x28d215
          }
        });
        const _0x431d4c = await _0x46836a.groupParticipantsUpdate(_0x3f9057.chat, [_0x3f9057.sender], "remove");
        if (_0x431d4c[0]?.["status"] === "404") {
          return;
        }
      } else {
        await _0x3f9057.reply("I don't have admin rights to enforce the anti-command rule.");
      }
    }
  }
  return true;
}