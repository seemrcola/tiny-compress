
/*文件大小计算*/
export function calcSize(size) {
    return `${size > 1024 ? (size / 1024).toFixed(2) + 'KB' : size + 'B'}`
}
