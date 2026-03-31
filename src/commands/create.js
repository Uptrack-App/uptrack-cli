export async function create(client, flags) {
  if (!flags.url) {
    console.error('Error: --url is required\n')
    console.error('Usage: uptrack create --url https://example.com [--name "My Site"] [--interval 60]')
    process.exit(1)
  }

  const body = { url: flags.url }
  if (flags.name) body.name = flags.name
  if (flags.interval) body.interval = parseInt(flags.interval, 10)
  if (flags.type) body.type = flags.type

  try {
    const data = await client.createMonitor(body)
    const monitor = data.data || data

    console.log(`\x1b[32m✓\x1b[0m Monitor created`)
    console.log(`  ID:       ${monitor.id}`)
    console.log(`  Name:     ${monitor.name}`)
    console.log(`  URL:      ${monitor.url}`)
    console.log(`  Interval: ${monitor.interval}s`)
    console.log(`  Status:   ${monitor.status}`)
  } catch (err) {
    console.error(`\x1b[31m✗\x1b[0m Failed to create monitor: ${err.message}`)
    process.exit(1)
  }
}
