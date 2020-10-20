#!/usr/bin/env node
/* eslint-disable no-process-exit */
import niz from 'niz'
import meow from 'meow'
import logSymbols from 'log-symbols'
import readline from 'readline'

import helpMessage from './help-message'

const cli = meow(helpMessage, {
  flags: {
    regex: {
      type: 'string',
      alias: 'r',
    },
  },
})

const { input, flags } = cli
if (input.length === 0 || input[0] === '-h') {
  console.error(helpMessage)
  process.exit(1)
}

process.stdout.write('\x1B[?25l')
;(async () => {
  const [length] = input
  const { regex } = flags

  await niz({
    length: Number(length),
    inject: (name, available) => {
      readline.clearLine(process.stdout, 0)
      readline.cursorTo(process.stdout, 0)

      const msg = available
        ? `${logSymbols.success} ${name}\n`
        : `${logSymbols.error} ${name}`
      process.stdout.write(msg)
    },
    ...(regex && {
      filter: (string: string) => new RegExp(regex).test(string),
    }),
  })

  readline.clearLine(process.stdout, 0)
})()
