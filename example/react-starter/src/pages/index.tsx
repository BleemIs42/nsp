import '@/pages/index.less'
import * as React from 'react'
import { hot } from 'react-hot-loader'

// require.context('.', false, /\.(le|sc|c)ss/)
class A extends React.Component {
  public render() {
    return <div>Index</div>
  }
}
export default hot(module)(() => (
  <div>
    hto module <A />
  </div>
))
