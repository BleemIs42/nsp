import { Interfaces } from '@nsp/nsp-cli'
export default (): Interfaces.IPluginCfg => {
  return {
    command: ['dev', 'start a dev server'],
    run() {
      console.log('dev command')
    }
  }
}
