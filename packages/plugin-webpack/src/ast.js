let ts = require('typescript')

const sourceFile = ts.createSourceFile(
  `test.ts`,
  `
  import React from 'react
  const jsx = () => <div>React</div>
  `,
  ts.ScriptTarget.ES2016
)

console.log(sourceFile)