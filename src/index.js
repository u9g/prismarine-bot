require('dotenv').config()
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
process.on('uncaughtException', () => {
  client?.destroy()
  client = null
  startBot()
})
