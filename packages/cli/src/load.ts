import * as cosmiconfig from 'cosmiconfig'
import * as resolveCwd from 'resolve-cwd'
import { ICfg, IPlugin, IPluginCfg } from './types'

export const loadCfg: (name: string) => ICfg = (name) => {
  const cfgFile = cosmiconfig(name).searchSync()
  return cfgFile ? cfgFile.config : {}
}

export const loadPlugins = (cfgFile): IPluginCfg[] => {
  const cfg: ICfg = loadCfg(cfgFile)
  const { plugins = [] } = cfg
  return plugins.map((plugin) => {
    const [name, opts = {}] = Array.isArray(plugin) ? plugin : [plugin]
    const pluginFile = require(resolveCwd(name))
    const pluginFn: IPlugin = pluginFile.default || pluginFile
    return pluginFn(opts)
  })
}
