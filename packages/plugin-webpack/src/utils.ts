import { getPluginCfg } from '@nsp/plugin-utils'
import { readFileSync } from 'fs'
import { gzipSync } from 'zlib'

export const PLUGIN_NAME = 'webpack'

export const isInteractive = process.stdout.isTTY

export const getCfg = () => {
  const pluginCfg = getPluginCfg(PLUGIN_NAME)
  return {
    webpack(config) {},
    fastify(server) {},
    browserList() {
      return ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9']
    },
    ...pluginCfg
  }
}

export const gzipSize = (filePath: string) => gzipSync(readFileSync(filePath)).length
