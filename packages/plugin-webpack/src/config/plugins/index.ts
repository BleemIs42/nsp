import chalk from 'chalk'
import { join } from 'path'
import * as webpack from 'webpack'
import * as Config from 'webpack-chain'
import { getCfg, isInteractive } from '../../utils'

export default (config: Config) => {
  const cfgSet = getCfg()

  config.plugin('html-webpack').use(require('html-webpack-plugin'), [
    {
      template: join(__dirname, '../../../tpl/document.ejs')
    }
  ])

  config.plugin('hash-module').use(webpack.HashedModuleIdsPlugin)

  config.plugin('define').use(webpack.DefinePlugin, [
    Object.keys(cfgSet.define).reduce(
      (preDefined, defineKey) => ({
        ...preDefined,
        [defineKey]: JSON.stringify(cfgSet.define[defineKey])
      }),
      {}
    )
  ])

  config.plugin('fork-ts-checker').use(require('fork-ts-checker-webpack-plugin'), [
    {
      checkSyntacticErrors: true,
      formatter: 'codeframe'
    }
  ])

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
