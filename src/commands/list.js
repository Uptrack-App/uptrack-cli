export async function list(client) {
  const data = await client.listMonitors()
  const monitors = data.data || data

  if (!monitors.length) {
    console.log('No monitors found. Create one with: uptrack create --url https://example.com')
    return
  }

  // Table header
  const header = ['Status', 'Name', 'URL', 'Interval', 'Uptime']
  const rows = monitors.map((m) => [
    m.status === 'active' ? '\x1b[32m● up\x1b[0m' : '\x1b[31m● down\x1b[0m',
    m.name || '—',
    m.url || '—',
    `${m.interval}s`,
    m.uptime_percentage != null ? `${m.uptime_percentage}%` : '—',
  ])

  // Calculate column widths
  const widths = header.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => stripAnsi(r[i]).length))
  )

  // Print
  console.log(header.map((h, i) => h.padEnd(widths[i])).join('  '))
  console.log(widths.map((w) => '─'.repeat(w)).join('  '))
  for (const row of rows) {
    console.log(row.map((cell, i) => {
      const pad = widths[i] - stripAnsi(cell).length
      return cell + ' '.repeat(Math.max(0, pad))
    }).join('  '))
  }

  console.log(`\n${monitors.length} monitor(s)`)
}

function stripAnsi(str) {
  return str.replace(/\x1b\[[0-9;]*m/g, '')
}
