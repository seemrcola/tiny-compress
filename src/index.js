import tinify from "tinify";
import figlet from "figlet";
import fg from "fast-glob";
import colors from "colors-console";
import { loadConfig } from "unconfig";

import { compressSync, compressAsync } from "./compress.js";

import defaultConfig from "./config.js";
import { outputFile } from "./output.js";
import { cache as cacheFile } from "./cache.js";
import { backup } from "./backups.js";

export const CACHE_MAP_PATH = "tiny.cache.json";
export const PACKAGE_JSON_PATH = "package.json";
export const RESULT_MD = "tiny.result.md";

/*文件列表*/
let filesList = [];
/*可处理文件类型*/
const imgsInclude = ["png", "jpg", "jpeg"];
/*已压缩map*/
let compressedMap = {};
/*cli配置*/
let key, filePath, output2md, cache, sync, syncCount, backupPath;

/*压缩前准备-- for -p*/
export async function tinifyCompressPre() {
  /*配置读取*/
  const pkg = (
    await loadConfig({
      sources: [{ files: PACKAGE_JSON_PATH }],
    })
  ).config;
  if (!pkg) return console.error("package.json not found in current directory");

  /*已压缩文件读取*/
  compressedMap =
    (
      await loadConfig({
        sources: [{ files: CACHE_MAP_PATH }],
      })
    ).config || {};

  key = pkg?.tinifyCompress?.key;
  cache = pkg?.tinifyCompress?.cache || defaultConfig.cache;
  filePath = pkg?.tinifyCompress?.filePath || defaultConfig.filePath;
  output2md = pkg?.tinifyCompress?.output2md || defaultConfig.output2md;
  sync = pkg?.tinifyCompress?.sync || defaultConfig.sync;
  syncCount = pkg?.tinifyCompress?.syncCount || defaultConfig.syncCount;
  backupPath = pkg?.tinifyCompress?.backupPath

  if (!key)
    return console.error(
      "api key is required => https://tinypng.com/developers"
    );
  tinify.key = key; //申请一个key tinify库需要用到

  tinifyCompress();
}

/*读取文件并调用压缩函数*/
export async function tinifyCompress(options) {
  /* for -t*/
  if (options) {
    tinify.key = options.apikey;
    filePath = options.filePath;
    output2md = options.md;
  }

  filesList = await fg(`${filePath}/**/*.{${imgsInclude.join()}}`, {
    absolute: true,
    stats: true,
  });
  if(backupPath){ // 如果有配置，那就备份到指定文件夹下
    backup(filesList, backupPath)
  }

  figlet("Tinify Compress", (err, data) => {
    if (err) return console.log("figlet-error:Something went wrong...");
    console.log(colors("yellow", data));
    tinifyRun();
  });
}

/*tinify文件压缩*/
async function tinifyRun() {
  if(syncCount > 10) syncCount = 10
  if(sync) await compressSync(filesList, cache, compressedMap, syncCount)
  else await compressAsync(filesList, cache, compressedMap)
  console.log(`\n>>>>>>>>> all done <<<<<<<<<`)
  compressFinish();
}

/*压缩完成之后可能要做什么*/
function compressFinish() {
  output2md && outputFile(filesList);
  cache && cacheFile(filesList);
}



