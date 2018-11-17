import chalk from 'chalk'
import * as detect from 'detect-port'
import { prompt } from 'inquirer'
import getProcessForPort from './getProcessForPort'
const isInteractive = process.stdout.isTTY
const isRoot = () => process.getuid && process.getuid() === 0

export default (defaultPort: number): Promise<number> =>
  detect(defaultPort).then(
    (port) => {
      if (port === defaultPort) {
        return port
      }
      const message =
        process.platform !== 'win32' && defaultPort < 1024 && !isRoot()
          ? `Admin permissions are required to run a server on a port below 1024.`
          : `Something is already running on port ${defaultPort}.`
      if (isInteractive) {
        const existingProcess = getProcessForPort(defaultPort)
        const question = {
          type: 'confirm',
          name: 'shouldChangePort',
          message: `${chalk.yellow(
            `message${
              existingProcess // eslint-disable-line
                ? ` Probably:\n  ${existingProcess}`
                : ''
            }`
          )}\n\nWould you like to run the app on another port instead?`,
          default: true
        }
        return prompt(question).then((answer) => (answer.shouldChangePort ? port : null))
      } else {
        process.stdout.write(chalk.red(message))
        return null
      }
    },
    (err) => {
      throw new Error(chalk.red(`Could not find an open port.\nNetwork error message: ${err.message || err}\n`))
    }
  )
