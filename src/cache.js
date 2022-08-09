import fs from 'fs'
import path from 'path'

import {CACHE_MAP_PATH} from './index.js'

export function cache(list = []) {
    let paths = list
        .map(file => file.path)
        .reduce((pre, cur) => {
            pre[cur] = true
            return pre
        }
            , {})
    let str = JSON.stringify(paths, null, 2)
    writeFile(CACHE_MAP_PATH, str)
}

/*写文件*/
function writeFile(fileName, data) {
    fs.writeFile(fileName, data, 'utf-8', () => void 0);
}
