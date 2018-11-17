import { path } from '@nsp/plugin-utils'
import chalk from 'chalk'
import { join } from 'path'
import * as Config from 'webpack-chain'
import { getCfg } from '../utils'

import loaders from './loaders'
import plugins from './plugins'

export default (mode: 'development' | 'production') => {
  process.env.NODE_ENV = mode

  const config = new Config()
  const cfgSet = getCfg()

  config.mode(mode)
  config.output.publicPath('/')
  config.output.hashDigestLength(8)
  config.optimization.splitChunks({
    cacheGroups: {
      vendors: {
        chunks: 'all',
        name: 'vendors',
        test: /[\\/]node_modules[\\/]/
      }
    }
  })
  config.optimization.runtimeChunk({
    name: 'manifest'
  })
  config.resolve.extensions.merge(['.js', '.jsx', '.ts', '.tsx', '.vue'])

  config.resolve.alias.set('@', path.absSrcPath)
  Object.keys(cfgSet.alias).forEach((key) => config.resolve.alias.set(key, cfgSet.alias[key]))

  config.resolveLoader.modules
    .add('node_modules')
    .add(join(__dirname, '../../node_modules'))
    .end()

  loaders(config)
  plugins(config)

  if (mode === 'development') {
    require('./env/dev').default(config)
  } else {
    require('./env/prod').default(config)
  }

  cfgSet.webpack(config)
  return config
}
