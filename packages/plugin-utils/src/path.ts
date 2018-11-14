import { join } from 'path'

export default {
  get cwd(){
    return process.cwd()
  },
  get absSrcPath(){
    return join(this.cwd, 'src')
  },
  get absTmpDirPath(){
    return join(this.absSrcPath, `.nsp`)
  },
  get absPagesPath(){
    return join(this.absSrcPath, 'pages')
  },
}