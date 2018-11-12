import chalk from 'chalk'
import { error } from 'signale'
import { argv, usage } from 'yargs'
import cmds from './cmds'
import { getClis, getCmd, showHelp } from './utils'

const clis = getClis()

const allCli = [...cmds, ...clis]

// tslint:disable-next-line:no-unused-expression
allCli
  .reduce((_, command) => _.command(command), usage(`\nUsage: <command> [options]`))
  .help(false)
  .version(false)
  .epilogue(`Run ${chalk.blue('$0 help')} see the command list`).argv

const [cmd, opt] = argv._
const isHelp = cmd === 'help'

if (!cmd || isHelp) {
  const clis = isHelp ? allCli.filter(({ command }) => getCmd(command) === opt) : allCli
  if (clis.length) {
    showHelp(clis, isHelp)
  } else {
    error(`Command ${chalk.cyan(isHelp ? opt : cmd)} does not exists`)
  }
}
