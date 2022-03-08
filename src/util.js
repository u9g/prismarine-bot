async function getFirstMessage (threadChannel) {
  let msg = null
  try {
    msg = await threadChannel.fetchStarterMessage()
  } catch (e) {}
  return msg
}

function iterateNonArchivedThreads (channel) {
  return {
    async * [Symbol.asyncIterator] () {
      for (const thread of channel.threads.cache.toJSON()) {
        if (thread.archived) continue
        yield thread
      }
    }
  }
}

module.exports = { getFirstMessage, iterateNonArchivedThreads }
