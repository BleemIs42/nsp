import chalk from 'chalk'
import { error } from 'signale'
import { argv, usage } from 'yargs'
import { loadPlugins } from './load'

// e.g: .nsprc.js
// https://github.com/davidtheclark/cosmiconfig#cosmiconfigoptions
const cfgFile = 'nsp'

const plugins = loadPlugins(cfgFile)

const cmds = plugins.reduce((acc, { command: [name], run = () => {} }) => ({ ...acc, [name]: run }), {})

const [cmd] = argv._
if (!cmd) {
  const man = plugins
    .reduce(
      (_, { command: [name, ...rest] }) => _.command(chalk.green(name), ...rest),
      usage(`\nUsage: <command> [options]`)
    )
    .help('h')
    .alias('h', 'help')
    .epilogue(`Run ${chalk.blue('$0 help [command]')} for usage of a specific command..`)
    .showHelp().argv
} else if (!cmds[cmd]) {
  error(`Command ${chalk.underline.cyan(cmd)} does not exists`)
} else {
  cmds[cmd]()
}
