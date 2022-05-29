const { createThread } = require('./handle')
const { getRealThreadOwner, getFirstMessage } = require('../util')
const config = require('../../config')

/** @param {import('discord.js').Client} client */
module.exports = async client => {
  if (config.THREAD_HELP_CHANNEL?.length < 10) return
  /** @returns {Boolean} */
  /* async function userAlreadyHasOpenThread (ogMsg) {
    for await (const thread of iterateNonLockedThreads(ogMsg.channel)) {
      const msg = await getFirstMessage(thread)
      if (ogMsg.author === msg?.author) {
        return true
      }
    }
    return false // will be restored once discord stops throwing errors for correct code...
  } */

  client.on('messageCreate', async (msg) => {
    if (!msg || !msg.content || msg.author.bot) return
    if (msg.channelId === config.THREAD_HELP_CHANNEL && !msg.system /* && !(await userAlreadyHasOpenThread(msg)) */) {
      await createThread(msg)
    } else if (msg.channel.isThread()) {
      if (msg.content !== '!close') return
      if (msg.channel.locked) {
        await msg.channel.setLocked(false)
      }
      const realAuthor = await getRealThreadOwner(msg.channel)
      const getStarterAuthor = await getFirstMessage(msg.channel).then(msg => msg?.author)
      if (realAuthor === msg.author || getStarterAuthor == msg.author || msg.member.roles.cache.toJSON().length > 1) {
        await msg.react('✅')
        await msg.channel.setLocked(true)
        await msg.channel.setArchived(true)
        await getFirstMessage(msg.channel).then(msg => msg?.react('✅'))
      }
    }
  })
}
