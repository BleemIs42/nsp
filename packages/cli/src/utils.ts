import * as api from '@nsp/plugin-utils'
import chalk from 'chalk'
import * as cliui from 'cliui'
import * as cosmiconfig from 'cosmiconfig'
import * as resolveCwd from 'resolve-cwd'
interface Icli {
  command: string
  desc: string
  builder?: object
  handler: (argv: object) => void
}
type IPlugin = (api: object, opts: object) => Icli
interface ICfg {
  plugins: Array<string | [string, object]>
}

export const moduleName = 'nsp'

// e.g: .nsprc.js
// https://github.com/davidtheclark/cosmiconfig#cosmiconfigoptions
export const loadCfg: (name?: string) => ICfg = (name = moduleName) => {
  const cfgFile = cosmiconfig(name).searchSync()
  return cfgFile && cfgFile.config
}

export const loadPlugins: (moduleName?: string) => Array<() => Icli> = (moduleName) => {
  const cfg: ICfg = loadCfg(moduleName)
  if (!cfg) {
    return []
  }
  const { plugins = [] } = cfg
  return plugins.map((plugin) => {
    const [name, opts = {}] = Array.isArray(plugin) ? plugin : [plugin]
    const pluginFile = require(resolveCwd(name))
    const pluginFn = pluginFile.default || pluginFile
    return () => pluginFn(api, opts)
  })
}

export const getClis = (): Icli[] => loadPlugins().map((pluginFn) => pluginFn())

export const getCmd: (command: string) => string = (command) => command.split(' ')[0]

export const showHelp = (clis: Icli[], isHelp: boolean) => {
  const ui = cliui()
  const category = isHelp ? 'Options:' : 'Commands:'
  const command = isHelp ? clis[0].command : '<command> [options]'
  ui.div({
    padding: [1, 0, 1, 2],
    text: `Usage: ${moduleName} ${command}`
  })
  ui.div({
    padding: [0, 0, 1, 2],
    text: category
  })
  if (isHelp) {
    const { desc, builder = {} } = clis[0]
    Object.keys(builder).forEach((opt) => {
      ui.div({
        padding: [0, 0, 0, 4],
        text: `--${chalk.green(opt)}`,
        width: 14
      })
      Object.keys(builder[opt]).forEach((key) => {
        ui.div(
          {
            padding: [0, 0, 0, 6],
            text: key,
            width: 16
          },
          {
            text: chalk.green(builder[opt][key])
          }
        )
      })
    })
    ui.div({
      padding: [1, 0, 1, 2],
      text: `Run ${chalk.blue(`${moduleName} ${getCmd(command)}`)} for ${desc}`
    })
  } else {
    clis.forEach((cli) => {
      ui.div(
        {
          padding: [0, 0, 0, 4],
          text: chalk.green(cli.command),
          width: 14
        },
        {
          text: cli.desc
        }
      )
    })
    ui.div({
      padding: [1, 0, 1, 2],
      text: `Run ${chalk.blue(`${moduleName} help [command]`)} for usage of a specific command.`
    })
  }
  process.stdout.write(ui.toString())
}
