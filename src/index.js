import { cwd } from "node:process";
import path from "path";
import { readPackageJSON } from "pkg-types";
import tinify from "tinify";
import figlet from "figlet";
import fg from 'fast-glob'
import ora from 'ora'
import colors from 'colors-console'
import defaultConfig from "./config.js";

/*文件列表*/
let filesList = [];
/*可处理文件类型*/
const imgsInclude = ["png", "jpg", "jpeg"];
/*cli配置*/
let key, filePath;
/*tinifyError 策略模式*/
let errorList = [tinify.AccountError, tinify.ClientError, tinify.ServerError, tinify.ConnectionError]
let tinifyError = {
  '0': () => console.log(colors(['white', 'redBG'], "The error message is: 已超出你每个月限额")),
  '1': () => console.log(colors(['white', 'redBG'], "The error message is: 检查您的源图像和请求选项")),
  '2': () => console.log(colors(['white', 'redBG'], "The error message is: Tinify API 的临时问题")),
  '3': () => console.log(colors(['white', 'redBG'], "The error message is: 发生网络连接错误")),
}

async function tinifyCompressPre() {
  /*配置读取*/
  const pkg = await readPackageJSON(path.resolve(cwd(), "./package.json", "utf-8"));
  if (!pkg) return console.error("package.json not found in current directory");

  /*tinifyCompress配置读取*/
  key = pkg?.tinifyCompress?.key;
  filePath = pkg?.tinifyCompress?.filePath || defaultConfig.filePath;
  if (!key) return console.error("api key is required => https://tinypng.com/developers");
  tinify.key = key; //申请一个key tinify库需要用到

  /*读取无误 调用压缩函数*/
  tinifyCompress();
}

/*读取文件并调用压缩函数*/
async function tinifyCompress() {
  /*读取文件列表*/
  filesList = await fg(
    `${filePath}/**/*.{${imgsInclude.join()}}`,
    { absolute: true, stats: true }
  )
  /*打印花式字体，运行压缩函数*/
  figlet('Tinify Compress', (err, data) => {
    if (err) return console.log('figlet-error:Something went wrong...')
    console.log(colors('yellow', data))
    tinifyRun()
  })
}

/*tinify文件压缩*/
async function tinifyRun() {
  for (let item of filesList) {
    const spinner = ora({ text: `Loading ${item.path}`, color: 'yellow' }).start()
    const output = path.resolve(item.path);
    const source = tinify.fromFile(item.path);
    try {
      await source.toFile(output)
      spinner.succeed()
      console.log(colors(['white', 'blueBG'], `compress success => ${output}`))
    }
    catch (error) {
      let errorType = undefined
      spinner.fail()
      errorList.forEach((i, idx) => error instanceof i && (errorType = String(idx)));
      errorType && tinifyError[errorType]()
      !errorType && console.log(colors(['white', 'redBG'], "The error message is: 意料之外的错误"))
    }
  }
  console.log(colors(['white', 'greenBG'], `\n---------------------->>> all done <<<---------------------`))
}

tinifyCompressPre();
