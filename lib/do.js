import inquirer from 'inquirer'
import { tinifyCompressPre, tinifyCompress } from '../src/index.js'

async function compress(options) {
  /*项目下直接走正常流程*/
  if (Object.values(options).length === 0)
    await tinifyCompressPre()
  else if (options.project)
    await tinifyCompressPre()
  /*非项目下进行问答*/
  else if (options.terminal) {
    inquirer
      .prompt([
        {
          type: 'input',
          message: 'your tinypng apikey :',
          name: 'apikey',
          prefix: '🟢',
        },
        {
          type: 'input',
          message: 'Select working folder,default is root :',
          name: 'filePath',
          prefix: '🟢',
        },
        {
          type: 'input',
          message: 'output tiny.result.md ? y or n :',
          name: 'md',
          prefix: '🟢',
        },
      ])
      .then(options => {
        options.md = true

        if (!options.apikey) {
          return console.error('api key is required => https://tinypng.com/developers')
        }
        if (!options.filePath) {
          options.filePath = '.'
        }
        if (!options.md || options.md == 'n') {
          options.md = false
        }
        tinifyCompress(options)
      })
  }
}

export default compress
