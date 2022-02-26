const { createThread } = require('./handle')
const config = require('../../config')

const channels = ['']

/**
 * @param {import('discord.js').Client} client
 */
module.exports = async client => {
  client.on('messageCreate', async (msg) => {
    if (!msg || !msg.content) return
    if (msg.author.bot || !channels.includes(msg.channelId) || msg.guildId !== config.THREAD_HELP_CHANNEL || msg.channel.isThread()) return
    await createThread(msg)
  })
}
