import fs from 'fs'
import ini from 'ini'
import { COMPRESSRC } from '../config/index.js'

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
