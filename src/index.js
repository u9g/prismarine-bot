require('dotenv').config()
const { Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

const plugins = [
  require('./github_text_embed'),
  require('./md_search')
  // require('./threads')
]

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  plugins.forEach(plugin => plugin(client))
})

client.login(process.env.DISCORD_TOKEN)
