import { CFG_KEYS, ioc } from '@nsp/plugin-utils'
import Build from './cmds/build'
import Dev from './cmds/dev'

ioc.bind(CFG_KEYS.CLI, Dev)
ioc.bind(CFG_KEYS.CLI, Build)
