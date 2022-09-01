/*tinifyError函数*/
import tinify from "tinify";

/*原始错误类型*/
let errorList = [
  tinify.AccountError,
  tinify.ClientError,
  tinify.ServerError,
  tinify.ConnectionError,
];

/*错误类型对应的报错*/
let tinifyErrors = {
  0: () =>
    console.log(
      colors(["white", "redBG"], "The error message is: 已超出你每个月限额")
    ),
  1: () =>
    console.log(
      colors(["white", "redBG"], "The error message is: 检查您的源图像和请求选项")
    ),
  2: () =>
    console.log(
      colors(["white", "redBG"], "The error message is: Tinify API 的临时问题")
    ),
  3: () =>
    console.log(
      colors(["white", "redBG"], "The error message is: 发生网络连接错误")
    ),
};

export function tinifyError(error) {
  let errorType = undefined;

  errorList.forEach(
    (i, idx) => error instanceof i && (errorType = String(idx))
  );
  if (errorType) {
    tinifyErrors[errorType]();
  } 
  else {
    console.log(colors(["white", "redBG"], "The error message is: 意料之外的错误"));
  }

  process.exit(1);
}
