import { path } from '@nsp/plugin-utils'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { mkdir, touch } from 'shelljs'
import { info, start, success } from 'signale'
import { loadCfg } from '../utils'

export const command = 'init'
export const desc = 'init current dir with nsp config file'
export const handler = (argv) => {
  start('init...')
  init()
  success('init success!')
}

const createCfgFile = () => {
  const cfgContent = `module.exports = {
  plugins: []
}`
  const cfgFiePath = join(path.cwd, '.nsprc.js')
  info('create .nsprc.js')
  writeFileSync(cfgFiePath, cfgContent, 'utf-8')
}

const init = () => {
  if (loadCfg()) { return }
  createCfgFile()
  mkdir('-p', path.absTmpDirPath)
  mkdir('-p', path.absPagesPath)
  touch(join(path.absPagesPath, 'index.js'))
}

