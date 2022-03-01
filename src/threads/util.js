async function getFirstMessage (threadChannel) {
  let msg = null
  try {
    msg = await threadChannel.fetchStarterMessage()
  } catch (e) {}
  return msg
}

module.exports = { getFirstMessage }
