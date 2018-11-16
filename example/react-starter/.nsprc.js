module.exports = {
  plugins: [
    [
      'webpack',
      {
        webpack(config) {
          config
            .entry('index')
            .add('./src/index')
            .end()
        }
      }
    ]
  ]
}
