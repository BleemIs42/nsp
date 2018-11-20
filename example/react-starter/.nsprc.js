const path = require('path');
module.exports = {
  plugins: [
    [
      'webpack',
      {
        proxy: {
          '/todos/1': {
            target: 'http://jsonplaceholder.typicode.com/',
          },
        },
        alias: {
          img: path.join(__dirname, './src/img'),
        },
        define: {
          g: { t: 'test' },
        },
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
