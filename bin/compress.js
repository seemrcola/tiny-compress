#! /usr/bin/env node
import { program } from 'commander';
import inquirer from 'inquirer'
import { tinifyCompressPre, tinifyCompress } from '../src/index.js'

program
    .option('-p, --project', 'Work for a project with package.json')
    .option('-t, --terminal', 'Work in any folder without package.json')

program.parse();

const options = program.opts();
/*项目下直接走正常流程*/
if(Object.values(options).length == 0) tinifyCompressPre()
if (options.project) tinifyCompressPre()
/*非项目下进行问答*/
if (options.terminal) {
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

            if(!options.apikey) {
                return console.error('api key is required => https://tinypng.com/developers')
            }
            if(!options.filePath) {
                options.filePath = '.'
            }
            if(!options.md || options.md == 'n') {
                options.md = false
            }
            tinifyCompress(options)
        })
}

