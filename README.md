# unpack-texturepacker
nodejs tool texturepacker unpack,support json,plist

# install

`npm install -g unpack-texturepacker`

# usage

unpack-texturepacker [options]

Options:

  -V, --version        output the version number
  -p, --path <path>    plist or json path
  -t, --type <type>    support js,json,plist
  -i, --image <path>   source image path, Reading configuration files by default
  -o, --output <path>  output path, default [unpack-texturepacker]
  -r, --recursive      for directory recursive
  -d, --debug          show debug infomation
  -h, --help           output usage information

Examples:
  $ unpack-tp -p ./test/jsonorjs/js.js -d
  $ unpack-tp -p ./test/plist/conf.plist -d

# 中文

unpack-texturepacker [options]

Options:

  -V, --version        版本号
  -p, --path <path>    需要解包的配置文件路径
  -t, --type <type>    解包文件类型，默认读取后缀，支持js,json,plist
  -i, --image <path>   解包的图片源，默认从配置的meta信息读取
  -o, --output <path>  输出路径, 默认为 [unpack-texturepacker]
  -r, --recursive      是否递归创建目录
  -d, --debug          是否打开调试信息
  -h, --help           输出帮助信息

Examples:
  $ unpack-tp -p ./test/jsonorjs/js.js -d
  $ unpack-tp -p ./test/plist/conf.plist -d
