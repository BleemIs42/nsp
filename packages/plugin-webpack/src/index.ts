import { CFG_KEYS, ioc } from '@nsp/plugin-utils'
import Build from './build'
import Dev from './dev'

ioc.bind(CFG_KEYS.CLI, Dev)
ioc.bind(CFG_KEYS.CLI, Build)
