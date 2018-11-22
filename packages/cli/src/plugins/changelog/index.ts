import { CFG_KEYS, getPluginCfg, Interfaces, ioc, NSP, path } from '@nsp/plugin-utils'
import * as conventionalChangelogCore from 'conventional-changelog-core'
import { readFileSync, writeFileSync } from 'fs'
import * as getStream from 'get-stream'
import { join } from 'path'
import { start, success } from 'signale'
import { BLANK_LINE, CHANGELOG_HEADER, EOL } from './constants'

const CHANGELOG = 'changelog'

class Changelog implements Interfaces.Cli {
  public get config() {
    return getPluginCfg(CHANGELOG)
  }
  public get command() {
    return `${CHANGELOG}`
  }
  public get describe() {
    return 'create changelog'
  }
  public get builder() {
    return {}
  }
  public async handler(argv) {
    start('create changelog...')
    const changelogStream = conventionalChangelogCore({
      lernaPackage: this.config.lernaPackage,
      config: {
        ...require(this.config.preset || 'cz-commit-emoji'),
        ...this.config
      }
    })
    const newLog = await getStream(changelogStream)
    const [changelogPath, changelogContent] = this.getExitChangelog()
    
    if (changelogContent.indexOf(newLog) !== -1) {
      return
    }

    const newFile = [CHANGELOG_HEADER, newLog, changelogContent].join(BLANK_LINE)
    writeFileSync(changelogPath, newFile, { encoding: 'utf8' })

    success('create changelog success!')
  }
  protected getExitChangelog() {
    const changelogPath = join(path.cwd, 'CHANGELOG.md')
    const changelogFile = readFileSync(changelogPath, { encoding: 'utf8', flag: 'a+' })
    const changelogContent = changelogFile.split(CHANGELOG_HEADER)[1] || changelogFile
    return [changelogPath, changelogContent]
  }
}

ioc.bind(CFG_KEYS.CLI, Changelog)
