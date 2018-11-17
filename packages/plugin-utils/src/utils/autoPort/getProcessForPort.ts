import chalk from 'chalk'
import { execSync } from 'child_process'

const execOptions: {
  encoding: string
  stdio: Array<'pipe' | 'ipc' | 'ignore' | 'inherit'>
} = {
  encoding: 'utf8',
  stdio: [
    'pipe', // stdin (default)s
    'pipe', // stdout (default)
    'ignore' // stderr
  ]
}

const getProcessIdOnPort = (port) =>
  execSync('lsof -i:' + port + ' -P -t -sTCP:LISTEN', execOptions)
    .toString()
    .split('\n')[0]
    .trim()

const getProcessCommand = (processId, processDirectory) =>
  execSync('ps -o command -p ' + processId + ' | sed -n 2p', execOptions)
    .toString()
    .replace(/\n$/, '')

const getDirectoryOfProcessById = (processId) =>
  execSync('lsof -p ' + processId + ' | awk \'$4=="cwd" { printf $9 }\'', execOptions)
    .toString()
    .trim()

export default (port) => {
  try {
    const processId = getProcessIdOnPort(port)
    const directory = getDirectoryOfProcessById(processId)
    const command = getProcessCommand(processId, directory)
    return chalk.cyan(command) + chalk.grey(' (pid ' + processId + ')\n') + chalk.blue('  in ') + chalk.cyan(directory)
  } catch (e) {
    return null
  }
}
