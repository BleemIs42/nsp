import chalk from 'chalk'
import { argv, usage } from 'yargs'
import cmds from './cmds'
import { getClis, showHelp } from './utils'

const clis = getClis()

const allCli = [...cmds, ...clis]

// tslint:disable-next-line:no-unused-expression
allCli
  .reduce((_, command) => _.command(command), usage(`\nUsage: <command> [options]`))
  .help('h')
  .alias('h', 'help')
  .epilogue(`Run ${chalk.blue('$0 help')} see the command list`).argv

const [cmd] = argv._
if (!cmd) {
  showHelp(allCli)
}
