export async function status(client) {
  const data = await client.listMonitors()
  const monitors = data.data || data

  const up = monitors.filter((m) => m.status === 'active' && m.last_check_status === 'up').length
  const down = monitors.filter((m) => m.last_check_status === 'down').length
  const paused = monitors.filter((m) => m.status === 'paused').length
  const total = monitors.length

  console.log(`Monitors: ${total} total`)
  if (up > 0) console.log(`  \x1b[32m● ${up} up\x1b[0m`)
  if (down > 0) console.log(`  \x1b[31m● ${down} down\x1b[0m`)
  if (paused > 0) console.log(`  \x1b[33m● ${paused} paused\x1b[0m`)

  if (down > 0) {
    console.log('\nDown monitors:')
    monitors
      .filter((m) => m.last_check_status === 'down')
      .forEach((m) => console.log(`  \x1b[31m●\x1b[0m ${m.name || m.url}`))
  }
}
