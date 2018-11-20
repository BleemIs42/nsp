import * as React from 'react'
import { render } from 'react-dom'
import App from './pages/index'

declare const g:string
console.log('g', g)

render(
  <div>
    <App />
    Root app
  </div>,
  document.getElementById('root')
)
