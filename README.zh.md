## 📖 Introduction

##### 1. 基于 tinypng
##### 2. 灵感来自 github@sudongyuer/easy-tinypng-cli


## 📦 Installation

```shell
pnpm add tiny-compress-images

yarn add tiny-compress-images

npm install tiny-compress-images
```


```shell
  package.json
  "tinifyCompress": {
    "key": "", //从 'tinypng.com' 申请到的key
    "filesExclude": "", //默认值 = ["dist", "build", "node_modules", "config"]
    "filePath": ""      //默认值 = 'images' , 项目中一般使用'src'
  },
```

## 🦄 Usage

```shell
npx compress
```

##### 源码非常简单，可以根据需要自行修改


