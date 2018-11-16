import { path } from '@nsp/plugin-utils'
import chalk from 'chalk'
import { existsSync } from 'fs'
import { join } from 'path'
import * as webpack from 'webpack'
import * as Config from 'webpack-chain'
import { getCfg, isInteractive } from './utils'

const STYLE_INLINE_IMAGE_LIMIT = 10000

const isDevMode = () => process.env.NODE_ENV !== 'production'

const friendlyProgress = (config) => {
  if (isInteractive) {
    config.plugin('progress').use(require('webpackbar'))
  }
  config.plugin('friendly-errors').use(require('friendly-errors-webpack-plugin'), [
    {
      onErrors(severity, errors) {
        errors
          .filter((err) => !err.message)
          .forEach((err) => {
            process.stdout.write(
              chalk.redBright(
                err.webpackError
                  .split('\n')
                  .slice(0, 3)
                  .concat('\n')
                  .join('\n')
              )
            )
          })
      }
    }
  ])
}

const setPublic = (config) => {
  const publicPath = join(path.cwd, 'public')
  if (existsSync(publicPath)) {
    config.plugin('copy-public').use(require('copy-webpack-plugin'), [
      [
        {
          from: publicPath
        }
      ]
    ])
  }
  config.plugin('html-webpack').use(require('html-webpack-plugin'), [
    {
      template: join(__dirname, '../tpl/document.ejs')
    }
  ])
  config.plugin('hash-module').use(webpack.HashedModuleIdsPlugin)
}

const setCssRule = (config) => {
  const cfgSet = getCfg()
  config.plugin('mini-css').use(require('mini-css-extract-plugin'))
  const rule = config.module.rule('css').test(/\.(le|c)ss$/i)
  if (isDevMode()) {
    rule.use('css-hot-loader').loader(require.resolve('css-hot-loader'))
  }
  rule.use('extract-css-loader').loader(require('mini-css-extract-plugin').loader)
  rule.use('css-loader').loader(require.resolve('css-loader'))
  rule
    .use('postcss-loader')
    .loader(require.resolve('postcss-loader'))
    .options({
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        require('autoprefixer')({
          browsers: cfgSet.browserList(),
          flexbox: 'no-2009'
        })
      ]
    })
  rule
    .use('less-loader')
    .loader(require.resolve('less-loader'))
    .options({
      javascriptEnabled: true
    })
}

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
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all'
      }
    }
  })
  config.optimization.runtimeChunk({
    name: 'manifest'
  })
  config.resolve.extensions.merge(['.js', '.jsx', '.ts', '.tsx', '.vue'])
  config.resolve.alias.set('@', path.absSrcPath)
  config.resolveLoader.modules
    .add('node_modules')
    .add(join(__dirname, '../../node_modules'))
    .end()

  friendlyProgress(config)
  setPublic(config)
  setCssRule(config)

  const compile = config.module.rule('compile').test(/\.tsx?$/i)
  compile.use('ts-loader').loader(require.resolve('ts-loader'))

  if (isDevMode()) {
    config.plugin('hot-module').use(webpack.HotModuleReplacementPlugin)
    config.devtool('cheap-module-source-map')
  } else {
    const filename = '[name].[chunkhash]'
    config.output.chunkFilename(`js/${filename}.js`)
    config.output.filename(`js/${filename}.js`)
    config.optimization.minimizer('css').use(require('optimize-css-assets-webpack-plugin'))

    config.plugin('clean-webpack').use(require('clean-webpack-plugin'), [
      ['dist'],
      {
        root: path.cwd
      }
    ])
    config.plugin('mini-css').tap((args) => [
      {
        ...args[0],
        filename: `css/${filename}.css`,
        chunkFilename: `css/${filename}.css`
      }
    ])
  }

  config.module
    .rule('url')
    .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/i)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options({
      limit: STYLE_INLINE_IMAGE_LIMIT,
      name: 'imgs/[name].[hash].[ext]'
    })

  config.module
    .rule('url')
    .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options({
      limit: STYLE_INLINE_IMAGE_LIMIT,
      name: 'fonts/[name].[hash].[ext]'
    })

  config.module
    .rule('file')
    .test(/\.(json)$/i)
    .use('file-loader')
    .loader(require.resolve('file-loader'))

  cfgSet.webpack(config)
  return config
}
