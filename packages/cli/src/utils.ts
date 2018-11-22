import { CFG_KEYS, Interfaces, ioc, NSP } from '@nsp/plugin-utils'
import chalk from 'chalk'
import * as cliui from 'cliui'
import * as cosmiconfig from 'cosmiconfig'
import * as resolveCwd from 'resolve-cwd'
import { ls } from 'shelljs'
import { warn } from 'signale'

interface Cfg {
  plugins: Array<string | [string, object]>
}

// e.g: .nsprc.js
// https://github.com/davidtheclark/cosmiconfig#cosmiconfigoptions
export const loadCfg: (name: string) => Cfg = (name) => {
  const cfgFile = cosmiconfig(name).searchSync()
  return cfgFile && cfgFile.config
}

export const addDefaultCommands = () => {
  ls(`${__dirname}/cmds/*.js`).forEach((file) => {
    require(file)
  })
}

const getPluginName = (name) => {
  const pluginNames = /plugin-(\w+)$/.exec(name)
  return pluginNames ? pluginNames[1] : name
}

const getModulePaths = ({ cfgName, pluginName }) => [
  `@${NSP}/${pluginName}`,
  `@${NSP}/plugin-${pluginName}`,
  `${__dirname}/plugins/${pluginName}`,
  cfgName
]

export const loadPlugins: (cfg: Cfg) => void = (cfg) => {
  if (!cfg) {
    return
  }
  const { plugins = [] } = cfg
  plugins.forEach((plugin) => {
    const [cfgName, opts = {}] = Array.isArray(plugin) ? plugin : [plugin]
    const pluginName = getPluginName(cfgName)
    const modules = getModulePaths({ cfgName, pluginName })
      .map((id) => resolveCwd.silent(id))
      .filter((has) => has)
    if (modules.length) {
      ioc.bind(CFG_KEYS.PLUGIN_CFG(pluginName), opts)
      require(modules[0])
    } else {
      warn(`Plugin ${pluginName} does not found, , paths in:`)
      const ui = cliui()
      const paths = getModulePaths({ cfgName, pluginName })
      paths.forEach((path, idx) => {
        ui.div({
          text: `${idx === paths.length - 1 ? '└──' : '├──'}${path}`,
          padding: [0, 0, 0, 5]
        })
      })
      process.stdout.write(`${ui.toString()}\n`)
    }
  })
}

export const getClis = (): Interfaces.Cli[] => ioc.getBound(CFG_KEYS.CLI)

export const getCmd: (cmd: string) => string = (cmd) => cmd.split(' ')[0]

export const showHelp = (clis: Interfaces.Cli[], isHelp: boolean = false) => {
  const ui = cliui()
  const category = isHelp ? 'Options:' : 'Commands:'
  const command = isHelp ? clis[0].command : '<command> [options]'
  ui.div({
    padding: [1, 0, 1, 2],
    text: `Usage: ${NSP} ${command}`
  })
  ui.div({
    padding: [0, 0, 1, 2],
    text: category
  })
  if (isHelp) {
    const { describe, builder = {} } = clis[0]
    Object.keys(builder).forEach((opt) => {
      ui.div({
        padding: [0, 0, 0, 0],
        text: `--${chalk.greenBright(opt)}`,
        width: 15
      })
      Object.keys(builder[opt]).forEach((key) => {
        ui.div(
          {
            padding: [0, 0, 0, 6],
            text: key,
            width: 25
          },
          {
            text: chalk.blueBright(builder[opt][key])
          }
        )
      })
    })
    ui.div({
      padding: [1, 0, 1, 2],
      text: `Run ${chalk.blueBright(`${NSP} ${getCmd(command)}`)} for ${describe}`
    })
  } else {
    clis.forEach((cli) => {
      ui.div(
        {
          padding: [0, 0, 0, 4],
          text: chalk.greenBright(cli.command),
          width: 25
        },
        {
          text: cli.describe
        }
      )
    })
    ui.div({
      padding: [1, 0, 1, 2],
      text: `Run ${chalk.blueBright(`${NSP} help [command]`)} for usage of a specific command.`
    })
  }
  process.stdout.write(ui.toString())
}
