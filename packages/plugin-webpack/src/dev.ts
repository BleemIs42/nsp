import { Interfaces } from '@nsp/plugin-utils'
import { ip } from 'address'
import chalk from 'chalk'
import * as Fastify from 'fastify'
import { fatal } from 'signale'
import * as webpack from 'webpack'
import * as devMiddleware from 'webpack-dev-middleware'
import * as hotMiddleware from 'webpack-hot-middleware'
import chainConfig from './config'
import { getCfg } from './utils'


export default class Dev implements Interfaces.Cli {
  public get command() {
    return `dev`
  }
  public get describe() {
    return `start a webpack dev server`
  }
  public get builder() {
    return {
      port: {
        default: 8000
      }
    }
  }
  public async handler(argv) {
    const port = argv.port
    const config = chainConfig('development')
    const fastify = Fastify()

    Object.keys(config.entryPoints.entries()).forEach((name) => {
      config.entry(name).add('webpack-hot-middleware/client')
    })

    const compiler = webpack(config.toConfig())
    const webpackInstance = devMiddleware(compiler, {
      stats: {
        children: false,
        modules: false
      }
    })
    fastify.use(webpackInstance)
    fastify.use(
      hotMiddleware(compiler, {
        log: false
      })
    )

    fastify.setNotFoundHandler((request, reply) => {
      try {
        const filename = compiler.options.output.path + '/index.html'
        if (
          /get/i.test(request.req.method) &&
          ['text/html', '*/*'].filter((type) => request.headers.accept.indexOf(type) > -1).length &&
          webpackInstance.fileSystem.statSync(filename).isFile()
        ) {
          reply.type('text/html').send(webpackInstance.fileSystem.readFileSync(filename))
        } else {
          reply.code(404).send(new Error('Not Found'))
        }
      } catch (e) {
        reply.code(404).send(new Error('Not Found'))
      }
    })

    getCfg().fastify(fastify)

    fastify.listen(port, '0.0.0.0', (err) => {
      if (err) {
        fatal(err)
      }
      webpackInstance.waitUntilValid(() => {
        process.stdout.write(
          [
            `\nApp running at:`,
            `  - Local:    ${chalk.underline.blueBright(`http://localhost:${port}`)}`,
            `  - Network:  ${chalk.underline.blueBright(`http://${ip()}:${port}`)}`
          ].join('\n')
        )
      })
    })
  }
}