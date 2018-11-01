import chalk from 'chalk'
import * as cosmiconfig from 'cosmiconfig'
import * as resolveCwd from 'resolve-cwd'
import { error } from 'signale'
import { argv, usage } from 'yargs'

interface ICfg {
  plugins: string[]
}

export namespace Interfaces {
  export interface IPluginCfg {
    command: string[]
    run(): void
  }
  export type IPlugin = () => IPluginCfg
}

const cfgFileName = 'nsp'

const loadCfg: (name: string) => ICfg = (name) => {
  const cfg = cosmiconfig(name).searchSync()
  return cfg && cfg.config
}

const loadPlugins: (cfg: ICfg) => Interfaces.IPluginCfg[] = (cfg) =>
  cfg
    ? cfg.plugins.map((plugin) => {
        const pluginFn = require(resolveCwd(plugin))
        return pluginFn.default ? pluginFn.default() : pluginFn()
      })
    : []

const allPlugins = loadPlugins(loadCfg(cfgFileName))

const allCommand = allPlugins.reduce((cmds, { command: [name], run }) => ({ ...cmds, [name]: run }), {})

const [targetCommand] = argv._
if (!targetCommand) {
  const cmds = allPlugins
    .reduce(
      (_, { command: [name, ...rest] }) => _.command(chalk.green(name), ...rest),
      usage(`\nUsage: <command> [options]`)
    )
    .help('h')
    .alias('h', 'help')
    .epilogue(`Run ${chalk.blue('$0 help [command]')} for usage of a specific command..`)
    .showHelp()
    .argv
} else if (!allCommand[targetCommand]) {
  error(`Command ${chalk.underline.cyan(targetCommand)} does not exists`)
} else {
  allCommand[targetCommand]()
}
