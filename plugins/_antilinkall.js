import 'node-fetch';
const isLinkTik = /tiktok.com/i;
const isLinkYt = /youtube.com|youtu.be/i;
const isLinkTel = /telegram.com|t.me/i;
const isLinkFb = /facebook.com|fb.me/i;
const isLinkIg = /instagram.com/i;
const isLinkTw = /twitter.com|x.com/i;
const isLinkDc = /discord.com|discord.gg/i;
const isLinkTh = /threads.net/i;
const isLinkTch = /twitch.tv/i;
let handler = _0x3e8e68 => _0x3e8e68;
handler.before = async function (_0x327259, {
  conn: _0x3666be,
  isAdmin: _0x4b3bbb,
  isBotAdmin: _0x38640a,
  isOwner: _0x4704e1,
  isROwner: _0x12a2ac
}) {
  if (!_0x327259.isGroup) {
    return;
  }
  if (_0x4b3bbb || _0x4704e1 || _0x327259.fromMe || _0x12a2ac || !_0x38640a) {
    return;
  }
  let _0x568ab2 = global.db.data.chats[_0x327259.chat];
  let _0x22f828 = _0x327259.key.participant;
  let _0x399cc8 = _0x327259.key.id;
  let _0x2cb72a = '' + _0x327259.sender.split('@')[0x0];
  let _0x26cbba = _0x2cb72a + '@s.whatsapp.net';
  const _0x335a8c = isLinkTik.exec(_0x327259.text);
  const _0x4e6420 = isLinkYt.exec(_0x327259.text);
  const _0xa9da14 = isLinkTel.exec(_0x327259.text);
  const _0x35cf2e = isLinkFb.exec(_0x327259.text);
  const _0xee24e3 = isLinkIg.exec(_0x327259.text);
  const _0x5533ff = isLinkTw.exec(_0x327259.text);
  const _0x3980ae = isLinkDc.exec(_0x327259.text);
  const _0x55c2d6 = isLinkTh.exec(_0x327259.text);
  const _0xe1baa8 = isLinkTch.exec(_0x327259.text);
  if (_0x568ab2.antiTiktok && _0x335a8c) {
    if (_0x568ab2["delete"]) {
      return _0x3666be.sendMessage(_0x327259.chat, {
        'text': "Warning: Tiktok link detected and will be deleted"
      }, {
        'quoted': _0x327259
      });
    }
    if (_0x38640a) {
      await _0x3666be.reply(_0x327259.chat, "Warning: Tiktok link detected, *@" + _0x2cb72a + '*', null, {
        'mentions': [_0x26cbba]
      });
      await _0x3666be.sendMessage(_0x327259.chat, {
        'delete': {
          'remoteJid': _0x327259.chat,
          'fromMe': false,
          'id': _0x399cc8,
          'participant': _0x22f828
        }
      });
      try {
        await _0x3666be.groupParticipantsUpdate(_0x327259.chat, [_0x327259.sender], 'remove');
      } catch (_0x53a254) {
        console.error("Error while removing participant:", _0x53a254);
      }
    }
  }
  if (_0x568ab2.antiYoutube && _0x4e6420) {
    if (_0x568ab2["delete"]) {
      return _0x3666be.sendMessage(_0x327259.chat, {
        'text': "Warning: Youtube link detected and will be deleted"
      }, {
        'quoted': _0x327259
      });
    }
    if (_0x38640a) {
      await _0x3666be.reply(_0x327259.chat, "Warning: Youtube link detected, *@" + _0x2cb72a + '*', null, {
        'mentions': [_0x26cbba]
      });
      await _0x3666be.sendMessage(_0x327259.chat, {
        'delete': {
          'remoteJid': _0x327259.chat,
          'fromMe': false,
          'id': _0x399cc8,
          'participant': _0x22f828
        }
      });
      try {
        await _0x3666be.groupParticipantsUpdate(_0x327259.chat, [_0x327259.sender], 'remove');
      } catch (_0xedd907) {
        console.error("Error while removing participant:", _0xedd907);
      }
    }
  }
  if (_0x568ab2.antiTelegram && _0xa9da14) {
    if (_0x568ab2["delete"]) {
      return _0x3666be.sendMessage(_0x327259.chat, {
        'text': "Warning: Telegram link detected and will be deleted"
      }, {
        'quoted': _0x327259
      });
    }
    if (_0x38640a) {
      await _0x3666be.reply(_0x327259.chat, "Warning: Telegram link detected, *@" + _0x2cb72a + '*', null, {
        'mentions': [_0x26cbba]
      });
      await _0x3666be.sendMessage(_0x327259.chat, {
        'delete': {
          'remoteJid': _0x327259.chat,
          'fromMe': false,
          'id': _0x399cc8,
          'participant': _0x22f828
        }
      });
      try {
        await _0x3666be.groupParticipantsUpdate(_0x327259.chat, [_0x327259.sender], 'remove');
      } catch (_0x3111b4) {
        console.error("Error while removing participant:", _0x3111b4);
      }
    }
  }
  if (_0x568ab2.antiFacebook && _0x35cf2e) {
    if (_0x568ab2['delete']) {
      return _0x3666be.sendMessage(_0x327259.chat, {
        'text': "Warning: Facebook link detected and will be deleted"
      }, {
        'quoted': _0x327259
      });
    }
    if (_0x38640a) {
      await _0x3666be.reply(_0x327259.chat, "Warning: Facebook link detected, *@" + _0x2cb72a + '*', null, {
        'mentions': [_0x26cbba]
      });
      await _0x3666be.sendMessage(_0x327259.chat, {
        'delete': {
          'remoteJid': _0x327259.chat,
          'fromMe': false,
          'id': _0x399cc8,
          'participant': _0x22f828
        }
      });
      try {
        await _0x3666be.groupParticipantsUpdate(_0x327259.chat, [_0x327259.sender], 'remove');
      } catch (_0x4aa513) {
        console.error("Error while removing participant:", _0x4aa513);
      }
    }
  }
  if (_0x568ab2.antiInstagram && _0xee24e3) {
    if (_0x568ab2['delete']) {
      return _0x3666be.sendMessage(_0x327259.chat, {
        'text': "Warning: Instagram link detected and will be deleted"
      }, {
        'quoted': _0x327259
      });
    }
    if (_0x38640a) {
      await _0x3666be.reply(_0x327259.chat, "Warning: Instagram link detected, *@" + _0x2cb72a + '*', null, {
        'mentions': [_0x26cbba]
      });
      await _0x3666be.sendMessage(_0x327259.chat, {
        'delete': {
          'remoteJid': _0x327259.chat,
          'fromMe': false,
          'id': _0x399cc8,
          'participant': _0x22f828
        }
      });
      try {
        await _0x3666be.groupParticipantsUpdate(_0x327259.chat, [_0x327259.sender], "remove");
      } catch (_0x1261e8) {
        console.error("Error while removing participant:", _0x1261e8);
      }
    }
  }
  if (_0x568ab2.antiTwitter && _0x5533ff) {
    if (_0x568ab2['delete']) {
      return _0x3666be.sendMessage(_0x327259.chat, {
        'text': "Warning: Twitter link detected and will be deleted"
      }, {
        'quoted': _0x327259
      });
    }
    if (_0x38640a) {
      await _0x3666be.reply(_0x327259.chat, "Warning: Twitter link detected, *@" + _0x2cb72a + '*', null, {
        'mentions': [_0x26cbba]
      });
      await _0x3666be.sendMessage(_0x327259.chat, {
        'delete': {
          'remoteJid': _0x327259.chat,
          'fromMe': false,
          'id': _0x399cc8,
          'participant': _0x22f828
        }
      });
      try {
        await _0x3666be.groupParticipantsUpdate(_0x327259.chat, [_0x327259.sender], "remove");
      } catch (_0x29b033) {
        console.error("Error while removing participant:", _0x29b033);
      }
    }
  }
  if (_0x568ab2.antiDiscord && _0x3980ae) {
    if (_0x568ab2["delete"]) {
      return _0x3666be.sendMessage(_0x327259.chat, {
        'text': "Warning: Discord link detected and will be deleted"
      }, {
        'quoted': _0x327259
      });
    }
    if (_0x38640a) {
      await _0x3666be.reply(_0x327259.chat, "Warning: Discord link detected, *@" + _0x2cb72a + '*', null, {
        'mentions': [_0x26cbba]
      });
      await _0x3666be.sendMessage(_0x327259.chat, {
        'delete': {
          'remoteJid': _0x327259.chat,
          'fromMe': false,
          'id': _0x399cc8,
          'participant': _0x22f828
        }
      });
      try {
        await _0x3666be.groupParticipantsUpdate(_0x327259.chat, [_0x327259.sender], "remove");
      } catch (_0x3db8ab) {
        console.error("Error while removing participant:", _0x3db8ab);
      }
    }
  }
  if (_0x568ab2.antiThreads && _0x55c2d6) {
    if (_0x568ab2["delete"]) {
      return _0x3666be.sendMessage(_0x327259.chat, {
        'text': "Warning: Threads link detected and will be deleted"
      }, {
        'quoted': _0x327259
      });
    }
    if (_0x38640a) {
      await _0x3666be.reply(_0x327259.chat, "Warning: Threads link detected, *@" + _0x2cb72a + '*', null, {
        'mentions': [_0x26cbba]
      });
      await _0x3666be.sendMessage(_0x327259.chat, {
        'delete': {
          'remoteJid': _0x327259.chat,
          'fromMe': false,
          'id': _0x399cc8,
          'participant': _0x22f828
        }
      });
      try {
        await _0x3666be.groupParticipantsUpdate(_0x327259.chat, [_0x327259.sender], "remove");
      } catch (_0x16198e) {
        console.error("Error while removing participant:", _0x16198e);
      }
    }
  }
  if (_0x568ab2.antiTwitch && _0xe1baa8) {
    if (_0x568ab2["delete"]) {
      return _0x3666be.sendMessage(_0x327259.chat, {
        'text': "Warning: Twitch link detected and will be deleted"
      }, {
        'quoted': _0x327259
      });
    }
    if (_0x38640a) {
      await _0x3666be.reply(_0x327259.chat, "Warning: Twitch link detected, *@" + _0x2cb72a + '*', null, {
        'mentions': [_0x26cbba]
      });
      await _0x3666be.sendMessage(_0x327259.chat, {
        'delete': {
          'remoteJid': _0x327259.chat,
          'fromMe': false,
          'id': _0x399cc8,
          'participant': _0x22f828
        }
      });
      try {
        await _0x3666be.groupParticipantsUpdate(_0x327259.chat, [_0x327259.sender], "remove");
      } catch (_0x3139f1) {
        console.error("Error while removing participant:", _0x3139f1);
      }
    }
  }
  return true;
};
export default handler;