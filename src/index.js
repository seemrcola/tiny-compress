import { cwd } from "node:process";
import path from "path";

import tinify from "tinify";
import figlet from "figlet";
import fg from 'fast-glob'
import ora from 'ora'
import colors from 'colors-console'
import { loadConfig } from 'unconfig';

import defaultConfig from "./config.js";
import { outputFile } from './output.js'
import { cache as cacheFile } from './cache.js'

export const CACHE_MAP_PATH = 'tiny.cache.json'
export const PACKAGE_JSON_PATH = 'package.json'
export const RESULT_MD = 'tiny.result.md'

/*文件列表*/
let filesList = [];
/*可处理文件类型*/
const imgsInclude = ["png", "jpg", "jpeg"];
/*已压缩map*/
let compressedMap = {}
/*cli配置*/
let key, filePath, output2md, cache;

/*压缩前准备-- for -p*/
export async function tinifyCompressPre() {
  /*配置读取*/
  const pkg = (await loadConfig({ sources: [{ files: PACKAGE_JSON_PATH }] })).config;
  if (!pkg) return console.error("package.json not found in current directory");

  /*已压缩文件读取*/
  compressedMap = (await loadConfig({ sources: [{ files: CACHE_MAP_PATH }] })).config || {}

  key = pkg?.tinifyCompress?.key;
  cache = pkg?.tinifyCompress?.cache || defaultConfig.cache;
  filePath = pkg?.tinifyCompress?.filePath || defaultConfig.filePath;
  output2md = pkg?.tinifyCompress?.output2md || defaultConfig.output2md;
  if (!key) return console.error("api key is required => https://tinypng.com/developers");
  tinify.key = key; //申请一个key tinify库需要用到

  tinifyCompress();
}

/*读取文件并调用压缩函数*/
export async function tinifyCompress(options) {
  /* for -t*/
  if(options) {
    tinify.key = options.apikey
    filePath = options.filePath
    output2md = options.md
  }

  filesList = await fg(
    `${filePath}/**/*.{${imgsInclude.join()}}`,
    { absolute: true, stats: true }
  )

  figlet('Tinify Compress', (err, data) => {
    if (err) return console.log('figlet-error:Something went wrong...')
    console.log(colors('yellow', data))
    tinifyRun()
  })
}

/*tinify文件压缩*/
async function tinifyRun() {
  for (let item of filesList) {
    if (cache && isCompressed(item.path)) {
      console.log(colors(['white', 'yellowBG'], `compressed => ${item.path}`))
      continue
    }

    const spinner = ora({ text: `Loading ${item.path}`, color: 'yellow' }).start()
    const source = tinify.fromFile(item.path);

    try {
      const output = item.path;
      await source.toFile(output)
      spinner.succeed()
      console.log(colors(['white', 'blueBG'], `compress success => ${output}`))
    }
    catch (error) {
      spinner.fail()
      tinifyError(error)
    }
  }
  console.log(colors(['white', 'greenBG'], `\n---------------------->>> all done <<<---------------------`))

  compressFinish()
}

/*压缩完成之后可能要做什么*/
function compressFinish() {
  output2md && outputFile(filesList)
  cache && cacheFile(filesList)
}

/*判断是否压缩过*/
function isCompressed(path) {
  return Boolean(compressedMap[path])
}

/*tinifyError函数*/
function tinifyError(error) {
  let errorList = [tinify.AccountError, tinify.ClientError, tinify.ServerError, tinify.ConnectionError]
  let tinifyError = {
    '0': () => console.log(colors(['white', 'redBG'], "The error message is: 已超出你每个月限额")),
    '1': () => console.log(colors(['white', 'redBG'], "The error message is: 检查您的源图像和请求选项")),
    '2': () => console.log(colors(['white', 'redBG'], "The error message is: Tinify API 的临时问题")),
    '3': () => console.log(colors(['white', 'redBG'], "The error message is: 发生网络连接错误")),
  }
  let errorType = undefined

  errorList.forEach((i, idx) => error instanceof i && (errorType = String(idx)));
  errorType && tinifyError[errorType]()
  !errorType && console.log(colors(['white', 'redBG'], "The error message is: 意料之外的错误"))

  process.exit(1)
}
