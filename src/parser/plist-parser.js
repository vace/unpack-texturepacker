const plist = require('plist')
const fs = require('fs')
function parser(path) {
  var string = fs.readFileSync(path, 'utf8')
  var {frames: parseFrames, metadata} = plist.parse(string)
  // todo format
  var format = metadata.format
  var meta = {
    image: metadata.textureFileName || metadata.realTextureFileName,
    format,
    smartupdate: metadata.smartupdate
  }
  var frames = Object.keys(parseFrames).map(filename => {
    const item = parseFrames[filename]
    if (format === 1 || format === 2) {
      var rotated = !!item.rotated      
      var [x, y, w, h] = changeValueToIntArray(item.frame)
      var [offsetX, offsetY] = changeValueToIntArray(item.offset)
      var [sourceW, sourceH] = changeValueToIntArray(item.sourceSize)
    } else if (format === 3) {
      var rotated = !!item.textureRotated
      var [x, y, w, h] = changeValueToIntArray(item.textureRect)
      var [offsetX, offsetY] = changeValueToIntArray(item.spriteOffset)
      var [sourceW, sourceH] = changeValueToIntArray(item.spriteSourceSize)
    }
    const frame = {x, y, w, h}
    const sourceSize = {w, h}
    const trimmed = !offsetX && !offsetY
    const spriteSourceSize = {x: offsetX, y: offsetY, w: sourceW, h: sourceH}
    return {
      filename,
      trimmed,
      frame,
      sourceSize,
      spriteSourceSize,
      rotated
    }
  })
  return {frames, meta}
}

const replaceRegx = /[{}]/ig
function changeValueToIntArray(specialChars = '') {
  return specialChars.replace(replaceRegx, '').split(',').map(number => parseInt(number, 10))
}

module.exports = parser
