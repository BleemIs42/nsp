export default (base) =>
  new Proxy(base, {
    construct(target, args) {
      const instance = new target(...args)
      const keys = Object.getOwnPropertyNames(target.prototype)
      keys.forEach((key) => {
        if (key === 'constructor') {
          return
        }
        if (typeof instance[key] !== 'function') {
          return
        }
        const fn = instance[key]
        instance[key] = fn.bind(instance)
      })
      return instance
    }
  })
