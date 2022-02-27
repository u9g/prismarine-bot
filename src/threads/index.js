const { createThread } = require('./handle')
const config = require('../../config')

/** @param {import('discord.js').Client} client */
module.exports = async client => {
  /** @returns {Boolean} */
  async function userAlreadyHasOpenThread (user) {
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
    }
  }

  client.on('messageCreate', async (msg) => {
    if (!msg || !msg.content || msg.author.bot || msg.channelId !== config.THREAD_HELP_CHANNEL || await userAlreadyHasOpenThread(msg.author)) return
    await createThread(msg)
  })
}
