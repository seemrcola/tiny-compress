## 📖 Introduction

```bash
1. Based on tinypng
2. Inspired by github@sudongyuer/easy-tinypng-cli
```


## 📦 Installation


```bash
pnpm add tiny-compress-images -g

yarn add tiny-compress-images -g

npm install tiny-compress-images -g
```


## 🦄 Usage

```json
  package.json:
  "tinifyCompress": {
    "key": "", //The key requested from tinypng.com
    "filePath": "",      //default = 'src'
    "output2md": false,  //Whether to output a `tiny.result.md` to show the compression result
    "cache": false,       //Whether to output a `tiny.cache.json` to show the compression result
    "sync": false,      //sync compress
    "syncCount": 5,     //when sync === true
  },
```

```shell
compress --help

Usage: compress [options] [command]

Options:
-p, --project         Work for a project with package.json
-t, --terminal        Work in any folder without package.json
-h, --help            display help for command

Commands:
set <apikey> <alias>  set apikey
  list                  apikey list
  do                    compress
  help [command]        display help for command
```

```bash
npx compress do  ||  compress do
```

#### The source code is very simple and can be modified by yourself


