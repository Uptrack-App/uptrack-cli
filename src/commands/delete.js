export async function deleteMonitor(client, flags) {
  const id = flags._[0]
  if (!id) {
    console.error('Error: monitor ID is required\n')
    console.error('Usage: uptrack delete <monitor-id>')
    process.exit(1)
  }

  try {
    await client.deleteMonitor(id)
    console.log(`\x1b[32m✓\x1b[0m Monitor ${id} deleted`)
  } catch (err) {
    console.error(`\x1b[31m✗\x1b[0m Failed to delete monitor: ${err.message}`)
    process.exit(1)
  }
}
