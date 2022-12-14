import fs from "fs";
import path from "path";
import { cwd } from "node:process";

import { RESULT_MD } from "./index.js";

/*文件大小计算*/
export function calcSize(size) {
  return `${size > 1024 ? (size / 1024).toFixed(2) + "KB" : size + "B"}`;
}

/*md字符串*/
let str = `# 项目原始图片对比\n
## 图片压缩信息\n
| 文件名 | 文件体积 | 压缩后体积 | 压缩比 | 文件路径 |\n| -- | -- | -- | -- | -- |\n`;

/*文件输出函数*/
export function outputFile(list = []) {
  let length = list.length;
  if (!length) return;

  let packagePath = cwd();

  for (let i = 0; i < length; i++) {
    /*获取需要展示的数据*/
    const { name, stats, path: p } = list[i];
    const compressionSize = fs.statSync(p).size;
    const compressionRatio =
      ((stats.size - compressionSize) / stats.size).toFixed(2) * 100 + "%";
    const filePath = path.resolve(p).split(packagePath)[1];

    const desc = `| ${name} | ${calcSize(stats.size)} | ${calcSize(
      compressionSize
    )} | ${compressionRatio} | ${filePath} |\n`;
    str += desc;
  }
  return writeFile(RESULT_MD, str);
}

/*写文件*/
function writeFile(fileName, data) {
  fs.writeFile(fileName, data, "utf-8", () => void 0);
}
