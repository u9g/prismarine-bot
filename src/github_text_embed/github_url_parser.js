const fetch = require('node-fetch')
const regex = {
  single: /(.+)#L(\d+)$/,
  range: /(.+)#L(\d+)-L(\d+)$/
}

module.exports = async url => {
  if (!url.startsWith('https://github.com') || !(regex.single.test(url) || regex.range.test(url))) return null
  const fixUrl = _url => _url.replace('/blob', '').replace('https://github.com', 'https://raw.githubusercontent.com')
  const getPath = _url => {
    const [,,,, ...rest] = _url.replace('https://github.com', '').split('/')
    return [...rest].join('/')
  }
  if (regex.single.test(url)) {
    const [, goodUrl, L1] = url.match(regex.single)
    const textUrl = fixUrl(goodUrl)
    const text = await fetch(textUrl).then(res => res.text()).then(text => text.split('\n'))
    return { text, type: 'single', L1: +L1, path: getPath(goodUrl) }
  } else if (regex.range.test(url)) {
    const [, goodUrl, L1, L2] = url.match(regex.range)
    const textUrl = fixUrl(goodUrl)
    const text = await fetch(textUrl).then(res => res.text()).then(text => text.split('\n'))
    return { text, type: 'range', L1: +L1, L2: +L2, path: getPath(goodUrl) }
  }
}
