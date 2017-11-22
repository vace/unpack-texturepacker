const unpackTexturepacker = require('../src')

unpackTexturepacker({
  type: 'json',
  path: __dirname + '/jsonorjs/js.js',
  // image: './jsonorjs/',
  // output: './jsonorjs',
  // recursive: true
})

unpackTexturepacker({
  type: 'plist',
  path: __dirname + '/plist/conf.plist',
  // image: './jsonorjs/',
  // output: './jsonorjs',
  // recursive: true
})
