import { cwd } from 'process'
import fs from 'fs'
import ini from 'ini'
import { COMPRESSRC } from '../config/index.js'


export function splitPath(path) {
    const root = cwd()
    return path.replace(root, '')
}

export async function writeFile(path, content) {
    return new Promise(resolve => {
        try {
            fs.writeFileSync(path, ini.stringify(content));
            resolve();
        } catch (error) {
            exit(error);
        }
    });
}

export async function readFile(file) {
    return new Promise(resolve => {
        if (!fs.existsSync(file)) resolve({})
        else {
            try {
                const content = ini.parse(fs.readFileSync(file, 'utf-8'));
                resolve(content);
            } catch (error) {
                exit(error);
            }
        }
    });
}

export async function getApikeys() {
    const customRegistries = await readFile(COMPRESSRC);
    return Object.assign({}, customRegistries);
}

export function divide(arr ,arrlen) {
    let result = [], container = []
    for (let i = 0,len = arr.length; i< len; i++) {
        if(container.length + 1 === arrlen || i+1 === len) {
            container.push(arr[i])
            result.push([...container])
            container = []
            continue
        }
        container.push(arr[i])
    }
    return result
}
