import { join } from 'path'
import { readdirSync, statSync, unlinkSync } from 'fs'

let handler = async (m, { conn, __dirname }) => {
  const sessionsDir = join(__dirname, '../sessions')
  const filesToDelete = []

  readdirSync(sessionsDir).forEach(file => {
    if (file !== 'creds.json') {
      filesToDelete.push(join(sessionsDir, file))
    }
  })

  const deletedFiles = []

  filesToDelete.forEach(file => {
    const stats = statSync(file)
    if (stats.isFile()) {
      unlinkSync(file)
      deletedFiles.push(file)
    }
  })

  if (deletedFiles.length > 0) {
    await conn.reply(m.chat, `✅ Deleted ${deletedFiles.length} file(s) from sessions:\n${deletedFiles.map(f => f.split('/').pop()).join('\n')}`, m)
  } else {
    await conn.reply(m.chat, 'ℹ️ No session files to delete.', m)
  }
}

handler.help = ['clearsession']
handler.tags = ['owner']
handler.command = /^(clearsession|clear)$/i
handler.rowner = true

export default handler