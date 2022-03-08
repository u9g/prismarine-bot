const { createThread } = require('./handle')
const { getFirstMessage } = require('./util')
const config = require('../../config')

/** @param {import('discord.js').Client} client */
module.exports = async client => {
  if (config.THREAD_HELP_CHANNEL?.length < 10) return
  /** @returns {Boolean} */
  async function userAlreadyHasOpenThread (ogMsg) {
    for (const thread of ogMsg.channel.threads.cache.toJSON()) {
      const msg = await getFirstMessage(thread)
      if (ogMsg.author === msg?.author) {
        return true
      }
    }
    return false // will be restored once discord stops throwing errors for correct code...
  }

  client.on('messageCreate', async (msg) => {
    if (!msg || !msg.content || msg.author.bot) return
    if (msg.channelId === config.THREAD_HELP_CHANNEL && !(await userAlreadyHasOpenThread(msg))) {
      await createThread(msg)
    } else if (msg.channel.isThread()) {
      const firstMessage = await getFirstMessage(msg.channel) // null | message
      if (msg.content.includes('!close') && (firstMessage?.author === msg.author || msg.member.roles.cache.toJSON().length > 0)) {
        await msg.react('✅')
        await msg.channel.setLocked(true)
        await msg.channel.setArchived(true)
        await firstMessage?.react('✅')
      }
    }
  })
}
