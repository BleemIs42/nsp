import { getCfg, Interfaces } from '@nsp/plugin-utils'

const PLUGIN_NAME = 'webpack'
const DEV = 'dev'

export default class Dev implements Interfaces.Cli {
  public get config(){
    return getCfg(PLUGIN_NAME)
  }
  public get command() {
    return `${DEV}`
  }
  public get describe() {
    return `start a webpack dev server`
  }
  public get builder() {
    return {}
  }
  public handler(){
    console.log(this.command, this.config)
    console.log('webpack dev server')
  }
}

