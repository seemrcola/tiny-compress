import process from 'node:process'

/*文件大小计算*/
export function calcSize(size) {
  return `${size > 1024 ? (size / 1024).toFixed(2) + 'KB' : size + 'B'}`
}

/*error函数*/
export function error() {
    /*tinifyError 策略模式*/
    let errorList = [tinify.AccountError, tinify.ClientError, tinify.ServerError, tinify.ConnectionError]
    let tinifyError = {
      '0': () => console.log(colors(['white', 'redBG'], "The error message is: 已超出你每个月限额")),
      '1': () => console.log(colors(['white', 'redBG'], "The error message is: 检查您的源图像和请求选项")),
      '2': () => console.log(colors(['white', 'redBG'], "The error message is: Tinify API 的临时问题")),
      '3': () => console.log(colors(['white', 'redBG'], "The error message is: 发生网络连接错误")),
    }
    
    let errorType = undefined
    errorList.forEach((i, idx) => error instanceof i && (errorType = String(idx)));
    errorType && tinifyError[errorType]()
    !errorType && console.log(colors(['white', 'redBG'], "The error message is: 意料之外的错误"))
    process.exit(1)
  }