import { Interfaces } from '@nsp/plugin-utils'
import chalk from 'chalk'
import * as cliui from 'cliui'
import * as fileSize from 'filesize'
import { basename, dirname, join } from 'path'
import { fatal } from 'signale'
import * as webpack from 'webpack'
import chainConfig from './config'
import { gzipSize } from './utils'

function canReadAsset(asset) {
  return (
    /\.(js|css|html)$/.test(asset) &&
    !/service-worker\.js/.test(asset) &&
    !/precache-manifest\.[0-9a-f]+\.js/.test(asset)
  )
}

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
        .assets.filter((asset) => canReadAsset(asset.name))
        .reduce(
          (acc, asset) => [
            ...acc,
            {
              file: join(basename(buildFolder), asset.name),
              size: fileSize(asset.size),
              gzip: fileSize(gzipSize(join(buildFolder, asset.name)))
            }
          ],
          [
            {
              file: 'File',
              size: 'Size',
              gzip: 'Gzip\n'
            }
          ]
        )

      const ui = cliui()
      assets.forEach(({ size, gzip, file }) => {
        ui.div(
          {
            text: gzip,
            width: 15,
            padding: [0, 0, 0, 2]
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
      process.stdout.write(`${ui.toString()}\n`)
      process.stdout.write(`\n`)
    })
  }
}
