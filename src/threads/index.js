const { createThread } = require('./handle')
const config = require('../../config')

/** @param {import('discord.js').Client} client */
module.exports = async client => {
  /** @returns {Boolean} */
  async function userAlreadyHasOpenThread (user) {
    return false // will be restored once discord stops throwing errors for correct code...
    /*
    const channel = await client.channels.fetch(config.THREAD_HELP_CHANNEL, { cache: false, force: true })
    if (channel === null) return true
    if (channel.isText()) {
      const { threads } = await channel.threads.fetchActive()
      for (const [, thread] of threads) {
        const msg = await thread.fetchStarterMessage()
        if (msg.author === user) {
          return true
        }
      }
      return false
    } */
  }

  client.on('messageCreate', async (msg) => {
    if (!msg || !msg.content || msg.author.bot) return
    if (msg.channelId === config.THREAD_HELP_CHANNEL && !(await userAlreadyHasOpenThread(msg))) {
      await createThread(msg)
    } else if (msg.channel.isThread()) {
      const firstMessage = await msg.channel.fetchStarterMessage()
      if (msg.content.includes('!close') && (firstMessage.author === msg.author || msg.member.roles.cache.toJSON().length > 0)) {
        await msg.react('✅')
        await msg.channel.setLocked(true)
        await msg.channel.setArchived(true)
        await firstMessage.react('✅')
      }
    }
  })
}
