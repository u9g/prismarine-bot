async function getFirstMessage (threadChannel) {
  let msg = null
  try {
    msg = await threadChannel.fetchStarterMessage()
  } catch (e) {}
  return msg.first()
}

async function getRealThreadOwner (threadChannel) {
  try {
    return await messageByOldIndex(threadChannel, 2).then(msg => msg.mentions.users.at(0))
  } catch (e) {}
  return null
}

async function messageByOldIndex (channel, ix) {
  return await channel.messages.fetch({ limit: String(ix), after: '0' }).then(msgs => msgs.first())
}

// VERY SLOW, USE AT YOUR OWN RISK
// async function oldestMessageInChannel (channel) {
//   const msg = await channel.messages.fetch({ limit: 1 })
//   let prevOldMsgs = null
//   let oldMsgs = await channel.messages.fetch({ before: msg.id, limit: 100 })
//   while (oldMsgs.size === 100) {
//     prevOldMsgs = oldMsgs
//     oldMsgs = await channel.messages.fetch({ before: oldMsgs.last().id, limit: 100 })
//   }
//   return oldMsgs.size === 0 ? prevOldMsgs.last() : oldMsgs.last()
// }

function iterateNonLockedThreads (channel) {
  return {
    async * [Symbol.asyncIterator] () {
      for (const thread of channel.threads.cache.toJSON()) {
        if (thread.locked) continue
        yield thread
      }
    }
  }
}

module.exports = { messageByOldIndex, getRealThreadOwner, iterateNonLockedThreads, getFirstMessage }
