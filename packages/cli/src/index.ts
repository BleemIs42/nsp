import chalk from 'chalk'
import { usage } from 'yargs'
import { loadPlugins } from './load'

// e.g: .nsprc.js
// https://github.com/davidtheclark/cosmiconfig#cosmiconfigoptions

const plugins = loadPlugins()

const cmds = plugins
  .reduce(
    (_, { command: [name, desc, builder, handler = () => {}], run }) =>
      _.command(name, desc, builder, (argv) => {
        run()
        handler(argv)
      }),
    usage(`\nUsage: <command> [options]`).commandDir('cmds')
  )
  .help('h')
  .alias('h', 'help')
  .epilogue(`Run ${chalk.blue('$0 help [command]')} for usage of a specific command..`).argv
