require('dotenv').config()
const wait = require('util').promisify(setTimeout)
const { Client, Intents } = require('discord.js')

const plugins = [
  require('./github_text_embed'),
  require('./md_search'),
  require('./threads'),
  require('./active_threads')
]

let client
function startBot () {
  client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    plugins.forEach(plugin => plugin(client))
  })
  client.login(process.env.DISCORD_TOKEN)
}

startBot()
process.on('uncaughtException', (err) => {
  console.log(err)
  client?.destroy()
  client = null
  await wait(10_000)
  startBot()
})
