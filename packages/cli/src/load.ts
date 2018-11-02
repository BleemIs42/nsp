import * as api from '@nsp/plugin-utils'
import * as cosmiconfig from 'cosmiconfig'
import * as resolveCwd from 'resolve-cwd'
interface IPluginCfg {
  command: string[]
  run(): void
}
type IPlugin = (api: object, opts: object) => IPluginCfg
interface ICfg {
  plugins: Array<string | [string, object]>
}

export const loadCfg: (name: string) => ICfg = (name) => {
  const cfgFile = cosmiconfig(name).searchSync()
  return cfgFile ? cfgFile.config : {}
}

export const loadPlugins = (cfgFileName): IPluginCfg[] => {
  const cfg: ICfg = loadCfg(cfgFileName)
  const { plugins = [] } = cfg
  return plugins.map((plugin) => {
    const [name, opts = {}] = Array.isArray(plugin) ? plugin : [plugin]
    const pluginFile = require(resolveCwd(name))
    const pluginFn: IPlugin = pluginFile.default || pluginFile
    return pluginFn(api, opts)
  })
}
