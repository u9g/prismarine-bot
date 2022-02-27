const fetch = require('node-fetch')
const parse = require('./parser')
const { GH_MD_FILE, RAW_MD_FILE } = require('./links.json')
const { MessageEmbed, Permissions } = require('discord.js')
const config = require('../../config')

module.exports = async client => {
  const txt = await fetch(RAW_MD_FILE).then(res => res.text())
  const search = parse(txt, GH_MD_FILE)
  client.on('messageCreate', msg => {
    if (!msg || !msg.content) return
    if (msg.author.bot || !config.ONLY_ALLOW_SEARCH_COMMANDS_IN_THESE_CHANNELS.includes(msg.channelId) || msg.guildId !== config.TESTING_GUILD) return
    if (!/^!s .+$/.test(msg.content)) return
    const [,, searchQuery] = msg.content.match(/^!s (.+)$/)
    const links = search(searchQuery)
    const title = 'Search results for: ' + searchQuery
    if (msg.channel.permissionsFor(msg.guild.me).has(Permissions.FLAGS.EMBED_LINKS)) {
      const desc = links.map(link => `- [${link.text}](${link.link})`).join('\n')
      const txt = title + desc
      const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(desc)
        .setColor('BLURPLE')
      if (txt.length > 1000) {
        return msg.reply({ content: 'Message too long, be more specific', allowedMentions: { repliedUser: false } })
      }
      msg.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
    } else {
      const desc = links.map(link => `- ${link.text} -> ${link.link}`).join('\n')
      const txt = '__**' + title + '**__' + '\n' + desc
      if (txt.length > 1000) {
        return msg.reply({ content: 'Message too long, be more specific', allowedMentions: { repliedUser: false } })
      }
      msg.reply({ content: txt, allowedMentions: { repliedUser: false } })
    }
  })
}
