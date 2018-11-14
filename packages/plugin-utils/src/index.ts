export { default as path } from './path'
export { default as event } from './event'
import IOC from './ioc'

export const NSP = 'nsp'

export const CFG_KEYS = {
  CLI: Symbol('Cli'),
  PLUGIN_CFG: (pluginName) => `PLUGIN:CFG:${pluginName}`
}

// tslint:disable-next-line:no-namespace
export namespace Interfaces{
  export interface Cli {
    command: string
    describe: string
    builder?: object | ((yargs) => any)
    handler: (argv: object) => void
  }
}

export const ioc = new IOC()
export const getCfg = (pluginName) => ioc.getBound(CFG_KEYS.PLUGIN_CFG(pluginName))[0]
