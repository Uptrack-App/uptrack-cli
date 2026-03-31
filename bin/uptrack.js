#!/usr/bin/env node

import { parseArgs } from 'node:util'
import { createClient } from '../src/api.js'
import { getApiKey, getBaseUrl } from '../src/config.js'
import { list } from '../src/commands/list.js'
import { create } from '../src/commands/create.js'
import { status } from '../src/commands/status.js'
import { deleteMonitor } from '../src/commands/delete.js'

const HELP = `
  \x1b[1muptrack\x1b[0m — CLI for Uptrack uptime monitoring

  \x1b[1mUsage:\x1b[0m
    uptrack <command> [options]

  \x1b[1mCommands:\x1b[0m
    list              List all monitors
    create            Create a new monitor
    status            Show monitoring overview
    delete <id>       Delete a monitor

  \x1b[1mOptions:\x1b[0m
    --api-key <key>   API key (or set UPTRACK_API_KEY env var)
    --base-url <url>  API base URL (default: https://api.uptrack.app)
    --help            Show this help
    --version         Show version

  \x1b[1mCreate options:\x1b[0m
    --url <url>       URL to monitor (required)
    --name <name>     Monitor name (auto-generated if omitted)
    --interval <sec>  Check interval in seconds (default: plan default)

  \x1b[1mExamples:\x1b[0m
    $ uptrack list
    $ uptrack create --url https://example.com
    $ uptrack create --url https://api.myapp.com --name "API" --interval 30
    $ uptrack status
    $ uptrack delete abc123

  \x1b[1mAuthentication:\x1b[0m
    Set UPTRACK_API_KEY environment variable or pass --api-key flag.
    Get your API key at https://uptrack.app/dashboard/settings
`

try {
  const { values: flags, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      'api-key': { type: 'string' },
      'base-url': { type: 'string' },
      url: { type: 'string' },
      name: { type: 'string' },
      interval: { type: 'string' },
      type: { type: 'string' },
      help: { type: 'boolean', short: 'h' },
      version: { type: 'boolean', short: 'v' },
    },
  })

  // Normalize flag names
  const normalizedFlags = {
    apiKey: flags['api-key'],
    baseUrl: flags['base-url'],
    url: flags.url,
    name: flags.name,
    interval: flags.interval,
    type: flags.type,
    help: flags.help,
    version: flags.version,
    _: positionals.slice(1), // args after command
  }

  if (flags.version) {
    const { readFile } = await import('node:fs/promises')
    const { fileURLToPath } = await import('node:url')
    const { dirname, join } = await import('node:path')
    const dir = dirname(fileURLToPath(import.meta.url))
    const pkg = JSON.parse(await readFile(join(dir, '..', 'package.json'), 'utf-8'))
    console.log(`uptrack ${pkg.version}`)
    process.exit(0)
  }

  const command = positionals[0]

  if (!command || flags.help) {
    console.log(HELP)
    process.exit(0)
  }

  const apiKey = getApiKey(normalizedFlags)
  if (!apiKey) {
    console.error('Error: API key required. Set UPTRACK_API_KEY or pass --api-key.\n')
    console.error('Get your API key at https://uptrack.app/dashboard/settings')
    process.exit(1)
  }

  const client = createClient(apiKey, getBaseUrl(normalizedFlags))

  switch (command) {
    case 'list':
    case 'ls':
      await list(client)
      break
    case 'create':
    case 'add':
      await create(client, normalizedFlags)
      break
    case 'status':
      await status(client)
      break
    case 'delete':
    case 'rm':
      await deleteMonitor(client, normalizedFlags)
      break
    default:
      console.error(`Unknown command: ${command}\n`)
      console.log(HELP)
      process.exit(1)
  }
} catch (err) {
  console.error(`\x1b[31mError:\x1b[0m ${err.message}`)
  process.exit(1)
}
