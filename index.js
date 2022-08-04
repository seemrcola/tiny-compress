import { cwd } from "node:process";
import path from "path";
import fs from "fs";
import { readPackageJSON } from "pkg-types";
import tinify from "tinify";
import figlet from "figlet";
import ora from 'ora'
import colors from 'colors-console'
import defaultConfig from "./defaultConfig.js";


/*文件列表*/
const filesList = [];
/*可处理文件类型*/
const imgsInclude = [".png", ".jpg"];
/*cli配置*/
let key, filesExclude, filePath;
/*tinifyError 策略模式*/
let errorList = [tinify.AccountError,tinify.ClientError,tinify.ServerError,tinify.ConnectionError]
let tinifyError = {
  0:() => console.log(colors(['white','redBG'],"The error message is: 已超出你每个月限额")),
  1:() => console.log(colors(['white','redBG'],"The error message is: 检查您的源图像和请求选项")),
  2:() => console.log(colors(['white','redBG'],"The error message is: Tinify API 的临时问题")),
  3:() => console.log(colors(['white','redBG'],"The error message is: 发生网络连接错误")),
  4:() => console.log(colors(['white','redBG'],"The error message is: 发生网络连接错误")),
}

async function tinifyCompressPre() {
  /*配置读取*/
  const pkg = await readPackageJSON(
    path.resolve(cwd(), "./package.json", "utf-8")
  );
  if (!pkg) return console.error("package.json not found in current directory");

  /*tinifyCompress配置读取*/
  key = pkg?.tinifyCompress?.key;
  filesExclude = pkg?.tinifyCompress?.filesExclude || defaultConfig.filesExclude;
  filePath = pkg?.tinifyCompress?.filePath || defaultConfig.filePath;
  if (!key)return console.error( "api key is required => https://tinypng.com/developers" );
  tinify.key = key; //申请一个key tinify库需要用到

  /*读取无误 调用压缩函数*/
  tinifyCompress();
}

function tinifyCompress() {
  readFile(filePath);
  figlet('Tinify Compress', (err,data) => {
    if (err) return console.log('figlet-error:Something went wrong...')
    console.log(colors('yellow',data))
    tinifyRun()
  })
}

/*读到文件列表*/
function readFile(filePath) {
  const files = fs.readdirSync(filePath);

  files.forEach((file) => {
    const fPath = path.join(filePath, file);
    const states = fs.statSync(fPath);
    const extname = path.extname(file);

    if (states.isFile()) {
      if (!imgsInclude.includes(extname)) return;
      filesList.push({
        size: states.size,
        name: file,
        path: fPath,
      });
    } else {
      if (filesExclude.includes(file)) return;
      readFile(fPath);
    }
  });
}

/*tinify文件压缩*/
async function tinifyRun() {
  for(let item of filesList) {
    const spinner = ora({ text: `Loading ${item.path}`, color: 'yellow' }).start()
    const output = path.resolve(item.path);
    const source = tinify.fromFile(item.path);
    try {
      await source.toFile(output)
      spinner.succeed()
      console.log(colors(['white','blueBG'],`compress success => ${output}`))
    }
    catch(error) {
      let errorType = undefined
      spinner.fail()
      errorList.forEach((i,idx) => error instanceof i && (errorType = idx));
      tinifyError[errorType]()
    }
  }
  console.log(colors(['white','greenBG'],`\n---------------------->>> all done <<<---------------------`))
}

tinifyCompressPre();
