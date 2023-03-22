import fs from 'fs'
import path from 'path'

export async function backup(filelist, backupPath) {
  const root = process.cwd()
  // 校验是否存在这个文件夹
  try {
    fs.readdirSync(backupPath)
  }
  catch (err) {
    fs.mkdirSync(backupPath)
  }
  // 遍历复制
  for(let file of filelist) {
    try {
      fs.copyFileSync(file.path, path.join(root, `${backupPath}/${file.name}`));
    } catch (err) {
      console.error(err);
    }
  }
}
