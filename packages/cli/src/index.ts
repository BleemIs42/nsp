import { NSP } from '@nsp/plugin-utils'
import chalk from 'chalk'
import { warn } from 'signale'
import { argv, usage } from 'yargs'
import { addDefaultCommands, getClis, getCmd, loadCfg, loadPlugins, showHelp } from './utils'

addDefaultCommands()
loadPlugins(loadCfg(NSP))

const allCli = getClis()
// tslint:disable-next-line:no-unused-expression
allCli
  .reduce((_, cli) => _.command(cli), usage(`\nUsage: $0 <command> [options]`))
  .help(false)
  .version(false).argv

const [cmd, opt] = argv._
const isHelp = cmd === 'help'
const warnText = `Command ${chalk.cyanBright(isHelp ? opt : cmd)} does not exists, run ${chalk.blueBright(
  `${NSP} help`
)} to get the command list`

if (!cmd || isHelp) {
  const clis = isHelp ? allCli.filter(({ command }) => getCmd(command) === opt) : allCli
  if (clis.length) {
    showHelp(clis, isHelp)
  } else if (!opt) {
    showHelp(allCli, false)
  } else {
    warn(warnText)
  }
} else if (allCli.filter(({ command }) => cmd === command).length === 0) {
  warn(warnText)
}
