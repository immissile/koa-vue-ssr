const path = require('path')
const range = require('lodash/range')
const fs = require('fs')

exports.isProd = process.env.NODE_ENV === 'production'

const resolve = dir => path.join(__dirname, '../..', dir || '')

const write = (file, output) => {
  return fs.writeFileSync(
    resolve(file),
    output,
    {flag: 'w', encoding: 'utf-8', mode:'0666'}
  )
}

exports.writeJs = (file, jsObj) => {
  return write(file, `module.exports = ${JSON.stringify(jsObj)}`)
}

exports.printBlankSpace = n => {
  let spaces = []
  range(n).forEach(r=> {
    spaces.push(' ')
  })
  return spaces.join('')
}

exports.resolve = resolve
exports.write = write
