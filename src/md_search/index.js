const fetch = require('node-fetch')
const parse = require('./parser')
const { GH_MD_FILE, RAW_MD_FILE } = require('./links.json')
const { MessageEmbed } = require('discord.js')

module.exports = async client => {
  const txt = await fetch(RAW_MD_FILE).then(res => res.text())
  const search = parse(txt, GH_MD_FILE)
  // const typeMap = {
  //   f: 'function',
  //   e: 'event',
  //   a: 'all'
  // }
  client.on('messageCreate', msg => {
    if (msg.author.bot || ((!['413438150594265099', '832327016849866792', '738645672085159946'].some(cId => cId === msg.channelId)) && msg.guildId !== '661701980036661308')) return
    // if (!/^![f|e|a|s]/.test(msg.content)) return
    if (!/^!s/.test(msg.content)) return

    const [,, searchQuery] = msg.content.match(/^!([a-z]) (.+)/)
    const links = search(searchQuery/*, typeMap[type] */)
    const embed = new MessageEmbed()
      .setTitle('Search results for: ' + searchQuery)
      .setDescription(links.map(link => `- [${link.text}](${link.link})`).join('\n'))
      .setColor('BLURPLE')
    msg.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
  })
}
