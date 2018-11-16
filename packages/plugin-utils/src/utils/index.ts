export { default as autoBind } from './autoBind'

export const isClass = (fn): boolean => typeof fn === 'function' && fn.prototype && fn.prototype.constructor === fn
