const fs = require('fs')
const { resolve: pathResolve, basename, extname } = require('path')
const sharp = require('sharp')
const mkdirp = require('mkdirp')
const ProgressBar = require('progress')
const debug = require('debug')
const log = debug('unpack-texturepacker')
const { queue } = require('./utils')

const pushTaskQueue = queue()

function unpackTexturepacker({
  type = 'json',
  path = '',
  image = '',
  output = 'unpack-texturepacker',
  recursive = true,
  debug: openDebug = false
}) {
  if (openDebug) {
    debug.enable('unpack-texturepacker')
  }
  path = pathResolve(path)
  if (!path || !fs.existsSync(path)) {
    throw new Error(`not found plist or json path, input path ${path}`)
  }
  if (!type) {
    type = extname(path).slice(1)
  }
  let parser
  switch (type) {
    case 'json':
    case 'js':
      parser = require('./parser/json-parser')
      break
    case 'plist':
      parser = require('./parser/plist-parser')
      break
    default:
      throw new Error(`unsupported media type : ${type}`)
      break
  }
  // json config
  let { meta, frames } = parser(path)
  let basePath = pathResolve(path, '../')
  image = image || `${basePath}/${meta.image}`
  // image source path
  if (!image || !fs.existsSync(image)) {
    throw new Error(`image path undefined : ${image}`)
  }
  // frames init
  if (!frames || !frames.length) {
    throw new Error(`frames empty : ${path}`)
  }
  // images out put path
  let outputPath = pathResolve(`${basePath}/${output}`)

  log('PreResolve Result: %O',{basePath, image, outputPath, type} )

  // create images write path
  const mainSharp = sharp(image)
  const progress = new ProgressBar(
    '[:percent] :bar (:current/:total) => :filename [:result]',
    { total: frames.length, width: 20, complete: '='}
  )
  // post all task
  const postFrameTask = function postFrameTask({
    trimmed,    
    filename,
    rotated = false,
    frame: {x: left = 0, y: top = 0, w: width = 0, h: height = 0},
    spriteSourceSize: {x: offsetX = 0, y: offsetY = 0}
  }) {
    let justFilename = basename(filename)
    let savedFilename = pathResolve(`${outputPath}/${recursive ? filename : basename(filename)}`)
    let savedBasePath = pathResolve(savedFilename, '../')
    // create saved path
    if (!fs.existsSync(savedBasePath)) {
      mkdirp.sync(savedBasePath)
    }
    // rotate handle
    if (rotated) {
      [width, height] = [height, width]
    }
    // TODO image offset
    var promise = new Promise((resolve, reject) => {
      mainSharp.extract({ left, top, width, height }).toFile(savedFilename, err => {
        progress.tick({
          filename: filename,
          result: !err ? 'ok' : 'error'
        })
        if (err) {
          let msg = `extract error! filename : ${filename}, err: ${err.message || 'unknow'}`
          log(msg)
          reject(new Error(msg))
        } else {
          resolve()
        }
      })
    })
    return pushTaskQueue(() => promise)
  }

  // push tasks
  pushTaskQueue(function taskExecuteStart() {
    log('taskExecuteStart')
  })
  for (var i = 0, _len = frames.length; i < _len; i ++) {
    postFrameTask(frames[i])
  }

  pushTaskQueue(function taskExecuteEnd(params) {
    log('taskExecuteEnd')
  })
  
}

module.exports = unpackTexturepacker