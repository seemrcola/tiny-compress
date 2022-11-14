#! /usr/bin/env node
import { program } from 'commander';
import { exit } from 'process'
import setApikey from '../lib/set.js'
import getList from '../lib/list.js'
import compress from '../lib/do.js'

program
    .option('-p, --project', 'Work for a project with package.json')
    .option('-t, --terminal', 'Work in any folder without package.json')

const options = program.opts();

program
    .command('set <apikey> <alias>')
    .description('set apikey')
    .action(async (apikey, alias) => {
        await setApikey(apikey, alias)
        exit(0)
    })

program
    .command('list')
    .description('apikey list')
    .action(async () => {
        await getList()
        exit(0)
    })

program
    .command('do')
    .description('compress')
    .action(() => {
        compress(options)
    })

program.parse();


