const marked = require('marked')
module.exports = (md, baseUrl) => {
  const parsed = marked.lexer(md)
  const headers = parsed.filter(o => o.type === 'heading' && o.depth === 4)
  return (searchQuery, type) => {
    if (type === 'function' && !searchQuery.includes('(')) searchQuery += '('
    if (type === 'event' && !searchQuery.includes('"')) searchQuery = `"${searchQuery}"`
    const results = headers.filter(o => o.text.toLowerCase().includes(searchQuery.toLowerCase()))
    return results
      .sort((a, b) => similarity(searchQuery, a.text) - similarity(searchQuery, b.text))
      .map((token) => {
        token.link = baseUrl + token.text
          .replace(/\.|\(|\)|,|\[|\]|=|"/g, '')
          .replace(/ /g, '-')
          .toLowerCase()
        return token
      })
  }
}

function similarity (s1, s2) {
  let longer = s1
  let shorter = s2
  if (s1.length < s2.length) {
    longer = s2
    shorter = s1
  }
  const longerLength = longer.length
  if (longerLength === 0) {
    return 1.0
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
}

function editDistance (s1, s2) {
  s1 = s1.toLowerCase()
  s2 = s2.toLowerCase()

  const costs = []
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) { costs[j] = j } else {
        if (j > 0) {
          let newValue = costs[j - 1]
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1
          }
          costs[j - 1] = lastValue
          lastValue = newValue
        }
      }
    }
    if (i > 0) { costs[s2.length] = lastValue }
  }
  return costs[s2.length]
}
