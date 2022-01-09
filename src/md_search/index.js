const fetch = require('node-fetch')
const parse = require('./parser')
const { GH_MD_FILE, RAW_MD_FILE } = require('./links.json')
const { MessageEmbed, Permissions } = require('discord.js')

module.exports = async client => {
  const txt = await fetch(RAW_MD_FILE).then(res => res.text())
  const search = parse(txt, GH_MD_FILE)
  // const typeMap = {
  //   f: 'function',
  //   e: 'event',
  //   a: 'all'
  // }
  client.on('messageCreate', msg => {
    if (!msg || !msg.content) return
    if (msg.author.bot || ((!['413438150594265099', '832327016849866792', '738645672085159946'].some(cId => cId === msg.channelId)) && msg.guildId !== '661701980036661308')) return
    // if (!/^![f|e|a|s]/.test(msg.content)) return
    if (!/^!s/.test(msg.content)) return
    const [,, searchQuery] = msg.content.match(/^!([a-z]) (.+)/)
    const links = search(searchQuery/*, typeMap[type] */)
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
