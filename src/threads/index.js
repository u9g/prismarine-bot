const { Client } = require('discord.js')
const { createThread } = require('./handle')

const channels = ['']
const guild = ''

/**
 * 
 * @param {Client} client 
 */
module.exports = async client => {
  client.on('messageCreate', async (msg) => {
    if (!msg || !msg.content) return
    if (msg.author.bot || !channels.includes(msg.channelId) || msg.guildId !== guild || msg.channel.isThread()) return
    await createThread(msg)
  })
}
