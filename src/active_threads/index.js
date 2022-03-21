const config = require('../../config')
const { iterateNonLockedThreads, getFirstMessage } = require('../util')
const { MessageEmbed } = require('discord.js')

/** @param {import('discord.js').Client} client */
module.exports = async client => {
  if (config.THREAD_HELP_CHANNEL?.length < 10 || config.THREAD_ACTIVITY_CHANNEL?.length < 10) return
  const channel = await client.channels.fetch(config.THREAD_HELP_CHANNEL)
  const guildId = channel.guildId
  setInterval(async () => {
    const activeChannels = []
    const channel = await client.channels.fetch(config.THREAD_HELP_CHANNEL)
    for await (const threadChannel of iterateNonLockedThreads(channel)) {
      const msgs = await threadChannel.messages.fetch({ limit: 1 })
      const msg = msgs.at(0)
      if (!msg?.id) continue
      const firstMessage = await getFirstMessage(threadChannel)
      const startedTimeString = firstMessage?.createdAt ? timeDifference(Date.now(), firstMessage.createdAt) : ''
      activeChannels.push({ channelId: threadChannel.id, msgId: msg.id, name: threadChannel.name, startedTimeString })
    }
    const activityChannel = await client.channels.fetch(config.THREAD_ACTIVITY_CHANNEL)
    const msgsInActivityChannel = await activityChannel.messages.fetch({ limit: 1 })
    const msg = msgsInActivityChannel.at(0)
    const embed = new MessageEmbed()
      .setTitle('Threads that need help:')
      .setFooter({ text: 'Last updated: ' })
      .setTimestamp(new Date(Date.now()))
    if (activeChannels.length === 0) {
      embed.setDescription('None at the moment. :^)')
    } else {
      const description = activeChannels
        .map(({ channelId, msgId, name, startedTimeString }) => `- [${name}](https://discord.com/channels/${guildId}/${channelId}/${msgId}) (${startedTimeString})`)
        .join('\n')
      embed.setDescription(description)
    }
    const msgContents = { embeds: [embed] }
    if (!msg) {
      activityChannel.send(msgContents)
    } else {
      msg.edit(msgContents)
    }
  }, 60 * 1000) // once a minute
}

function timeDifference (current, previous) {
  const msPerMinute = 60 * 1000
  const msPerHour = msPerMinute * 60
  const msPerDay = msPerHour * 24
  const msPerMonth = msPerDay * 30
  const msPerYear = msPerDay * 365

  const elapsed = current - previous

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' seconds ago'
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago'
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago'
  } else if (elapsed < msPerMonth) {
    return 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago'
  } else if (elapsed < msPerYear) {
    return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago'
  } else {
    return 'approximately ' + Math.round(elapsed / msPerYear) + ' years ago'
  }
}
