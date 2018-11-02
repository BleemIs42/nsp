export default ({path}) => {
  return {
    command: ['dev', 'start a dev server'],
    run() {
      console.log('dev command')
      console.log(Object.keys(path).forEach(key => console.log(key, path[key])))
    }
  }
}
