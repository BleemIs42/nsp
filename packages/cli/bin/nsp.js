#!/usr/bin/env node

const resolveCwd = require('resolve-cwd')

const localCli = resolveCwd.silent('@nsp/cli/bin/nsp')
if (localCli && localCli !== __filename) {
  const debug = require('debug')('nsp')
  debug('Using local install of nsp')
  require(localCli)
} else {
  require('../lib')
}