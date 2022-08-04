##### 1. 基于tinypng
##### 2. 灵感来自github@sudongyuer/easy-tinypng-cli


install
```shell
pnpm add tiny-compress-images
```

package.json
```shell
  "tinifyCompress": {
    "key": "HR5gGtwfVvNYyQtwS4HL1VLww3dnndvH", //从tinypng申请到的key
    "filesExclude": "", //哪些文件被忽略，默认["dist", "build", "node_modules", "config"]
    "filePath": ""      //默认images ，项目中一般改成 'src'
  },
```

usage
```shell
npx compress
```

##### 源码非常简单，index.js就是全部逻辑，可以自行更改


