import { readdirSync, rmSync, existsSync, statSync } from 'fs'

// Helper to format bytes
const formatSize = bytes => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

// Function to clear the tmp folder and log deleted files with size
const clearTmp = async (conn, notify = false) => {
  const dir = './tmp'
  if (!existsSync(dir)) return

  const files = readdirSync(dir)
  if (files.length === 0) return

  let logLines = []
  files.forEach(file => {
    const filePath = `${dir}/${file}`
    const size = formatSize(statSync(filePath).size)
    logLines.push(`${file} (${size})`)
    rmSync(filePath)
  })

  const logMessage = `✅ The \`tmp\` folder has been cleaned.\nDeleted files:\n${logLines.join('\n')}`

  if (notify && conn) {
    await conn.sendMessage(conn.user.jid, { text: logMessage })
  }

  return logMessage
}

// Automatic cleanup every 30 minutes
setInterval(() => clearTmp(null), 30 * 60 * 1000) // 30 minutes

let handler = async (m, { conn }) => {
  const logMessage = await clearTmp(conn, true)
  m.reply(logMessage || '✅ The `tmp` folder is already empty.')
}

handler.menuowner = ['cleartmp']
handler.tagsowner = ['owner']
handler.owner = true
handler.command = /^(c(lear)?tmp)$/i

export default handler