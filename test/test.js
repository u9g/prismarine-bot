/* eslint-env mocha */
const assert = require('assert')
const parse = require('../src/github_text_embed/github_url_parser')

describe('Github URL Parser', function () {
  it('001 # doesn\'t include line specified', async () => {
    const url = 'https://github.com/PrismarineJS/mineflayer/blob/master/examples/ansi.js'
    const parsedUrl = await parse(url)
    assert.equal(parsedUrl, null)
  })

  it('002 # includes single line specified', async () => {
    const url = 'https://github.com/PrismarineJS/mineflayer/blob/master/examples/ansi.js#L13'
    const parsedUrl = await parse(url)
    assert.equal(parsedUrl.type, 'single')
    assert.equal(parsedUrl.L1, 13)
    assert.equal(parsedUrl.path, 'master/examples/ansi.js')
  })

  it('002 # includes range of lines specified', async () => {
    const url = 'https://github.com/PrismarineJS/node-minecraft-protocol/blob/66f17e43ebb82d66ad294f4cf84c638d6b9db72b/src/transforms/framing.js#L14-L23'
    const parsedUrl = await parse(url)
    assert.equal(parsedUrl.type, 'range')
    assert.equal(parsedUrl.L1, 14)
    assert.equal(parsedUrl.L2, 23)
    assert.equal(parsedUrl.path, '66f17e43ebb82d66ad294f4cf84c638d6b9db72b/src/transforms/framing.js')
  })
})
