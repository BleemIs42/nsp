export default ({path}, opts) => {
  return {
    command: 'dev',
    desc: 'start a dev server',
    async handler(argv) {
      console.log('dev command')
      console.log(Object.keys(path).forEach(key => console.log(key, path[key])))
    }
  }
}

