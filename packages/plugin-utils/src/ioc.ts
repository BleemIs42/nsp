import { isClass } from './utils'
// tslint:disable-next-line:no-namespace
namespace IIOC {
  export interface Lookup {
    add(name, value: any)
    get(name): any[]
    has(name): boolean
    remove(name): boolean
  }
  export interface IOC {
    bind(name, target: any)
    unBind(name)
    reBind(name, target: any)
    isBound(name): boolean
    getBound(name): any[]
  }
}
class Lookup implements IIOC.Lookup {
  private map: Map<any, any[]>
  public constructor() {
    this.map = new Map()
  }
  public add(name, value: any) {
    const entry = this.map.get(name)
    if (entry) {
      entry.push(value)
      this.map.set(name, entry)
    } else {
      this.map.set(name, [value])
    }
  }
  public has(name): boolean {
    return this.map.has(name)
  }
  public get(name): any[] {
    return this.map.get(name) || []
  }
  public remove(name) {
    return this.map.delete(name)
  }
}

// tslint:disable-next-line:max-classes-per-file
export default class IOC implements IIOC.IOC {
  private dir: IIOC.Lookup
  constructor() {
    this.dir = new Lookup()
  }
  public bind(name, target: any) {
    let value = target
    if (isClass(target)) {
      value = new target()
    }
    return this.dir.add(name, value)
  }
  public unBind(name) {
    this.dir.remove(name)
  }
  public reBind(name, target: any) {
    this.unBind(name)
    this.bind(name, target)
  }
  public isBound(name): boolean {
    return this.dir.has(name)
  }
  public getBound(name): any[] {
    return this.dir.get(name)
  }
}
