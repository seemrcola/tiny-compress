import colors from "colors-console";
import ora from "ora";
import tinify from "tinify";
import { tinifyError } from "./error.js";
import { divide } from '../utils/index.js'

let compressedMap = {}

/*判断是否压缩过*/
function isCompressed(path) {
    return Boolean(compressedMap[path]);
}

export async function compressAsync(filesList, isCache, map) {
    compressedMap = map

    for (let item of filesList) {
        if (isCache && isCompressed(item.path)) {
            console.log(colors(["yellow"], `compressed => ${item.path}`));
            continue;
        }

        const spinner = ora({
            text: `Loading ${item.path}`,
            color: "yellow",
        }).start();
        const source = tinify.fromFile(item.path);

        try {
            const output = item.path;
            await source.toFile(output);
            spinner.succeed();
            console.log(colors(["blue"], `compress success`));
        } catch (error) {
            spinner.fail();
            tinifyError(error);
        }
    }
}

export async function syncCompress(filesList, isCache, map, syncCount) {
    compressedMap = map

    const list = divide(filesList, syncCount)
    let promiseList = []

    for(let divideList of list) {
        const spinner = ora({
            text: `Loading ${syncCount} files  & compressing \n`,
            color: "yellow",
        }).start();
        for (let item of divideList) {
            if (isCache && isCompressed(item.path)) {
                console.log(colors(["yellow"], `compressed => ${item.path} \n`));
                continue;
            }

            const source = tinify.fromFile(item.path);

            try {
                const output = item.path;
                promiseList.push(source.toFile(output));
            } catch (error) {
                spinner.fail();
                tinifyError(error);
            }
        }
        await Promise.all(promiseList)
        spinner.succeed();
        console.log(colors(["blue"], `compress success`));
    }
}
