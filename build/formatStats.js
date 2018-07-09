module.exports = function formatStats (stats, dir, printOmitted = true) {
  const fs = require('fs')
  const path = require('path')
  const zlib = require('zlib')
  const chalk = require('chalk')
  const ui = require('cliui')({width: 80})

  const resolve = dir => path.join(__dirname, '..', dir || '')

  const json = stats.toJson({
    hash: false,
    modules: false,
    chunks: false
  })

  let assets = json.assets
    ? json.assets
    : json.children.reduce((acc, child) => acc.concat(child.assets), [])

  const seenNames = new Map()
  const isJS = val => /\.js$/.test(val)
  const isCSS = val => /\.css$/.test(val)
  const isMinJS = val => /\.min\.js$/.test(val)
  const isJson = val => /\.json$/.test(val)
  assets = assets
    .filter(a => {
      if (seenNames.has(a.name)) {
        return false
      }
      seenNames.set(a.name, true)
      return isJS(a.name) || isCSS(a.name) || isJson(a.name)
    })
    .sort((a, b) => {
      if (isJS(a.name) && isCSS(b.name)) return -1
      if (isCSS(a.name) && isJS(b.name)) return 1
      if (isMinJS(a.name) && !isMinJS(b.name)) return -1
      if (!isMinJS(a.name) && isMinJS(b.name)) return 1
      return b.size - a.size
    })

  function formatSize (size) {
    return (size / 1024).toFixed(2) + ' kb'
  }

  function getGzippedSize (asset) {
    const filepath = resolve(path.join(dir, asset.name))
    const buffer = fs.readFileSync(filepath)
    return formatSize(zlib.gzipSync(buffer).length)
  }

  function makeRow (a, b, c) {
    return `  ${a}\t    ${b}\t ${c}`
  }

  function colorIt (asset) {
    let name = path.join(dir, asset.name)
    if (/js$/.test(asset.name)) {
      return chalk.green(name)
    }
    if (/css$/.test(asset.name)) {
      return chalk.blue(name)
    }
    // return chalk.yellow(name)
    return chalk.keyword('orange')(name)
  }

  ui.div(
    makeRow(
      chalk.cyan.bold(`File`),
      chalk.cyan.bold(`Size`),
      chalk.cyan.bold(`Gzipped`)
    ) + `\n\n` +
    assets.map(asset => makeRow(
      colorIt(asset),
      formatSize(asset.size),
      getGzippedSize(asset)
    )).join(`\n`)
  )

  return `${ui.toString()}\n\n  ${printOmitted ? chalk.gray(`Images and other types of assets omitted.\n`) : ''}`
}
