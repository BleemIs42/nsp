import { getPluginCfg } from '@nsp/plugin-utils'
import { readFileSync } from 'fs'
import { gzipSync } from 'zlib'

export const PLUGIN_NAME = 'webpack'

export const isInteractive = process.stdout.isTTY

export const getCfg = () => {
  const pluginCfg = getPluginCfg(PLUGIN_NAME)
  return {
    hot: true,
    alias: {},
    define: {},
    proxy: {},
    tsImportOption: [],
    webpack(config) {},
    fastify(server) {},
    browserList() {
      return ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9']
    },
    ...pluginCfg,
    tsLoaderOption: {
      transformers: {
        after: [],
        before: []
      },
      ...(pluginCfg.tsLoaderOption || {})
    }
  }
}

export const gzipSize = (filePath: string) => gzipSync(readFileSync(filePath)).length
