import * as Config from 'webpack-chain'
import { getCfg } from '../../utils'

const STYLE_INLINE_IMAGE_LIMIT = 10000

const isDevMode = () => process.env.NODE_ENV !== 'production'

export default (config: Config) => {
  const cfgSet = getCfg()
  config.plugin('mini-css').use(require('mini-css-extract-plugin'))
  const cssRule = config.module.rule('css').test(/\.(le|c)ss$/i)
  if (isDevMode()) {
    cssRule.use('css-hot-loader').loader(require.resolve('css-hot-loader'))
  }
  cssRule.use('extract-css-loader').loader(require('mini-css-extract-plugin').loader)
  cssRule.use('css-loader').loader(require.resolve('css-loader'))
  cssRule
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
  cssRule
    .use('less-loader')
    .loader(require.resolve('less-loader'))
    .options({
      javascriptEnabled: true
    })

  config.module
    .rule('css-url')
    .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/i)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options({
      limit: STYLE_INLINE_IMAGE_LIMIT,
      name: 'imgs/[name].[hash].[ext]'
    })

  config.module
    .rule('css-font-url')
    .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options({
      name: 'fonts/[name].[hash].[ext]'
    })

  config.module
    .rule('json-file')
    .test(/\.(json)$/i)
    .use('file-loader')
    .loader(require.resolve('file-loader'))



  const { transformers, ...restTsLoaderOption } = cfgSet.tsLoaderOption
  const tsImport = cfgSet.tsImportOption.length ? [require('ts-import-plugin')(cfgSet.tsImportOption)] : []

  const compile = config.module.rule('compile').test(/\.tsx?$/i)
  compile
    .use('ts-loader')
    .loader(require.resolve('ts-loader'))
    .options({
      happyPackMode: true,
      transpileOnly: true,
      ...restTsLoaderOption,
      getCustomTransformers: () => ({
        after: transformers.after || [],
        before: tsImport.concat(transformers.before || [])
      })
    })
}
