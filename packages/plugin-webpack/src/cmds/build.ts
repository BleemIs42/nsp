import { Interfaces } from '@nsp/plugin-utils'
import chalk from 'chalk'
import * as cliui from 'cliui'
import * as fileSize from 'filesize'
import { basename, dirname, join } from 'path'
import { fatal } from 'signale'
import * as webpack from 'webpack'
import chainConfig from '../config'
import { gzipSize } from '../utils'

const isLarge = (size) => size > 1024 * 1024 * 255
const notNeedGzip = (name) => /\.(jpe?g|png|gif|svg|mp3|3gp|mp4|swf|webm|woff2?|eot|otf)/i.test(name)

export default class Build implements Interfaces.Cli {
  public get command() {
    return `build`
  }
  public get describe() {
    return `build for production`
  }
  public async handler() {
    const config = chainConfig('production')
    const compiler = webpack(config.toConfig())
    compiler.run((err, webpackStats) => {
      if (err) {
        fatal(err)
      }
      
      const buildFolder = compiler.options.output.path
      const assets: Array<{
        file: string
        size: string
        gzip: string
      }> = webpackStats
        .toJson({ all: false, assets: true })
        .assets.sort((a, b) => a.size - b.size)
        .reduce(
          (acc, asset) => [
            ...acc,
            {
              file: join(dirname(asset.name), chalk.blueBright(basename(asset.name))),
              gzip: notNeedGzip(asset.name) ? 'No' : fileSize(gzipSize(join(buildFolder, asset.name))),
              size: isLarge(asset.size) ? chalk.yellowBright(fileSize(asset.size)) : fileSize(asset.size),
            }
          ],
          [
            {
              gzip: chalk.cyan('Gzip'),
              size: chalk.cyan('Size'),
              file: chalk.cyan('File\n'),
            }
          ]
        )

      const ui = cliui()
      assets.forEach(({ size, gzip, file }) => {
        ui.div(
          {
            padding: [0, 0, 0, 2],
            text: gzip,
            width: 15,
          },
          {
            text: size,
            width: 14
          },
          {
            text: file
          }
        )
      })
      process.stdout.write(`${ui.toString()}\n\n`)
    })
  }
}
