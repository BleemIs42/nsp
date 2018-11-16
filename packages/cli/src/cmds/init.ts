import { CFG_KEYS, getPluginCfg, Interfaces, ioc, NSP, path } from '@nsp/plugin-utils'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { mkdir, touch } from 'shelljs'
import { info, start, success } from 'signale'
import { loadCfg } from '../utils'

const INIT = 'init'

const createCfgFile = () => {
  const cfgContent = `module.exports = {
  plugins: []
}`
  const cfgFiePath = join(path.cwd, '.nsprc.js')
  info('create .nsprc.js')
  writeFileSync(cfgFiePath, cfgContent, 'utf-8')
}

const init = () => {
  if (loadCfg(NSP)) {
    return
  }
  createCfgFile()
  mkdir('-p', path.absTmpDirPath)
  mkdir('-p', path.absPagesPath)
  touch(join(path.absPagesPath, 'index.js'))
}

class Init implements Interfaces.Cli {
  public get config(){
    return getPluginCfg(INIT)
  }
  public get command() {
    return `${INIT} [dir]`
  }
  public get describe() {
    return 'init current dir with nsp config file'
  }
  public get builder() {
    return {
      dir: {
        default: 'test',
        hhh: 'ddd'
      },
      p: {
        default: '111'
      }
    }
  }
  public handler(argv) {
    start('init...')

    if (loadCfg(NSP)) {
      return
    }
    createCfgFile()
    touch(join(path.absSrcPath, 'index.tsx'))
    mkdir('-p', path.absTmpDirPath)
    mkdir('-p', path.absPagesPath)

    success('init success!')
  }
}

ioc.bind(CFG_KEYS.CLI, Init)
