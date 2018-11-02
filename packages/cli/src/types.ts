export interface IPluginCfg {
  command: string[]
  run(): void
}

export type IPlugin = (opts: object) => IPluginCfg

export interface ICfg {
  plugins: Array<string | [string, object]>
}
