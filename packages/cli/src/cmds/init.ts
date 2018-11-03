import { path } from '@nsp/plugin-utils'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { mkdir } from 'shelljs'
import { info, start, success } from 'signale'
import { loadCfg } from '../load'

export const command = 'init [dir]'
export const desc = 'init current dir or create a dir and init it with nsp config file'

const createCfgFile = (dir = '') => {
  const cfgContent = `module.exports = {
plugins: []
}`
  const cfgFiePath = join(path.cwd, dir, '.nsprc.js')
  info('create .nsprc.js')
  writeFileSync(cfgFiePath, cfgContent, 'utf-8')
}

export const handler = (argv) => {
  start('init...')
  if(argv.dir){
    info(`create ${argv.dir}`)
    mkdir('-p', join(path.cwd, argv.dir))
    createCfgFile(argv.dir)
  }else{
    if (!loadCfg()) {
      createCfgFile()
    }
  }
  success('init success!')
}
