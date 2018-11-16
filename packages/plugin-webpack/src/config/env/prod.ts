import { path } from '@nsp/plugin-utils'
import { existsSync } from 'fs'
import { join } from 'path'
import * as Config from 'webpack-chain'

export default (config: Config) => {
  const publicPath = join(path.cwd, 'public')
  const filename = '[name].[chunkhash]'
  config.output.chunkFilename(`js/${filename}.js`)
  config.output.filename(`js/${filename}.js`)

  config.optimization.minimizer('css').use(require('optimize-css-assets-webpack-plugin'))

  config.plugin('mini-css').tap((args) => [
    {
      ...args[0],
      chunkFilename: `css/${filename}.css`,
      filename: `css/${filename}.css`
    }
  ])

  config.plugin('clean-webpack').use(require('clean-webpack-plugin'), [
    ['dist'],
    {
      root: path.cwd
    }
  ])

  if (existsSync(publicPath)) {
    config.plugin('copy-public').use(require('copy-webpack-plugin'), [
      [
        {
          from: publicPath
        }
      ]
    ])
  }
}
