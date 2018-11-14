import { CFG_KEYS, ioc } from '@nsp/plugin-utils'
import Dev from './dev'

ioc.bind(CFG_KEYS.CLI, Dev)
