
/*文件大小计算*/
export function calcSize(size) {
    return `${size > 1024 ? (size / 1024).toFixed(2) + 'KB' : size + 'B'}`
}


/*await-to-js*/
export function to(
    promise,
    errorExt
) {
    return promise
        .then((data) => [null, data])
        .catch((err) => {
            if (errorExt) {
                const parsedError = Object.assign({}, err, errorExt);
                return [parsedError, undefined];
            }

            return [err, undefined];
        });
}
