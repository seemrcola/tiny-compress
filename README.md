## 📖 Introduction

```bash
1. Based on tinypng
2. Inspired by github@sudongyuer/easy-tinypng-cli
```


## 📦 Installation


```bash
pnpm add tiny-compress-images

yarn add tiny-compress-images

npm install tiny-compress-images
```


## 🦄 Usage

```json
  package.json:
  "tinifyCompress": {
    "key": "", //The key requested from tinypng.com
    "filePath": "",      //default = 'src'
    "output2md": false,  //Whether to output a `tiny.result.md` to show the compression result
    "cache": false       //Whether to output a `tiny.cache.json` to show the compression result
  },
```

```shell
compress --help

Usage: compress [options]

Options:
  -p, --project   Work for a project with package.json
  -t, --terminal  Work in any folder without package.json
  -h, --help      display help for command
```

```bash
npx compress
```

#### The source code is very simple and can be modified by yourself


