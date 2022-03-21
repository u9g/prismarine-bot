async function getFirstMessage (threadChannel) {
  let msg = null
  try {
    msg = await threadChannel.fetchStarterMessage()
  } catch (e) {}
  return msg
}

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

module.exports = { getFirstMessage, iterateNonLockedThreads }
