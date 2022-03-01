const titleRegex = /!title (.+)/

/**
 *
 * @param {Message} message
 */
async function createThread (message) {
  const thread = await message.startThread({
    name: `${message.author.username} | Help`,
    autoArchiveDuration: 1440
  })

  if (typeof thread === 'undefined') return
  await handleThread(thread, message)
}

/**
 *
 * @param {import('discord.js').ThreadChannel} thread
 * @param {import('discord.js').Message} message
 */
async function handleThread (thread, message) {
  const sent = await thread.send(`Hello <@${message.author.id}>\n\nThis is your help thread\nYou have 1 minute to change the title with \`!title [a brief description]\`\nYou can close the thread with \`!close\``)
  const collector = thread.createMessageCollector({
    filter: message => message.cleanContent.startsWith('!title') && message.cleanContent.length < 100,
    time: 60000,
    max: 1
  })

  collector.once('collect', async (collected) => {
    const title = collected.cleanContent.match(titleRegex)
    const ogAuthor = await collected.channel.fetchStarterMessage().then(msg => msg.author)
    if (title == null ||
       thread.archived ||
        collected.author !== ogAuthor) return

    await thread.edit({
      name: `${message.author.username} | ${title[1]}`
    })
  })

  collector.once('end', async () => {
    if (thread.archived || !sent.editable) return
    await editMessage(sent, message, false)
  })
}

/**
 *
 * @param {Message} message
 * @param {Message} original
 * @param {boolean} closed
 */
async function editMessage (message, original, closed) {
  await message.edit(`Hello <@${original.author.id}>\n\nThis is your help thread\nYou can no longer change the title${closed ? '' : '\nYou can close it with `!close`'}`).catch(() => {})
}

module.exports = {
  createThread
}
