const parse = require('./github_url_parser')

const MSG_MAX_LEN = 1000

module.exports = client => {
  client.on('messageCreate', async msg => {
    const words = msg.content.split(' ')
    const link = words.find(word => word.includes('https://github.com'))
    if (link == null) return
    const ignoreLink = const link = words.find(word => word.includes('<https://github.com'))
    if (ignoreLink) return
    const parsed = await parse(link)
    if (parsed === null || parsed.L1 < 0 || parsed.L1 > parsed.L2 || parsed.L1 - 1 > parsed.text.length || parsed.L2 - 1 > parsed.text.length) return
    let [l1, l2] = [0, 0]
    let [hL1, hL2] = [0, 0] // highlighted l1/2
    const make = (_l1 = null, _l2 = null) => makeFullMessage(parsed.text, parsed.path, _l1 ?? l1, _l2 ?? l2, hL1, hL2)
    if (parsed.type === 'range') {
      l1 = parsed.L1
      l2 = parsed.L2
      hL1 = parsed.L1
      hL2 = parsed.L2
      if (make().length > MSG_MAX_LEN) {
        while (make().length > MSG_MAX_LEN && l2 > l1) l2--
      }
    } else if (parsed.type === 'single') {
      l1 = parsed.L1
      l2 = parsed.L1
      hL1 = parsed.L1
      hL2 = parsed.L1
      if (make().length < MSG_MAX_LEN) {
        while (make(l1 - 1, l2 + 1).length < MSG_MAX_LEN && (l1 - 1 > 0 && l2 - 1 < parsed.text.length)) {
          if (l1 > 0) l1--
          if (l2 < parsed.text.length) l2++
        }
      }
    }
    if (make().length > MSG_MAX_LEN) {
      return // nothing we can do if one line is larger than the max msg len
    }
    msg.reply({ content: make(), allowedMentions: { repliedUser: false } })
  })
}

function makeFullMessage (arr, path, l1, l2, highlightL1, highlightL2) {
  return makeHeader(l1, l2, path) + getRangeOfText(arr, l1, l2, highlightL1, highlightL2) + '```'
}

function makeHeader (l1, l2, path) {
  return `Showing lines ${l1} to ${l2} of \`${path}\`\n\`\`\`${path.includes('.') ? path.substring(path.lastIndexOf('.') + 1) : ''}\n`
}

function getRangeOfText (arr, l1, l2, highlightL1, highlightL2 = Infinity) {
  const text = arr.slice(l1 - 1, l2).map((l, ix) => {
    const lineNumber = l1 + ix
    const shouldHighlight = lineNumber >= highlightL1 && lineNumber <= highlightL2
    const line = `${shouldHighlight ? '>' : ' '}${lineNumber} ${l}`
    return line
  })
  return text.join('\n')
}
