export { default as autoBind } from './autoBind'
export { default as autoPort } from './autoPort'

export const isClass = (fn): boolean => typeof fn === 'function' && fn.prototype && fn.prototype.constructor === fn