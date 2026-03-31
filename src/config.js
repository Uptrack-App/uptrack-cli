import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { homedir } from 'node:os'

const CONFIG_DIR = join(homedir(), '.uptrack')
const CONFIG_FILE = join(CONFIG_DIR, 'config.json')

export async function loadConfig() {
  try {
    const raw = await readFile(CONFIG_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

export async function saveConfig(config) {
  await mkdir(CONFIG_DIR, { recursive: true })
  await writeFile(CONFIG_FILE, JSON.stringify(config, null, 2) + '\n')
}

export function getApiKey(flags) {
  return flags.apiKey || process.env.UPTRACK_API_KEY
}

export function getBaseUrl(flags) {
  return flags.baseUrl || process.env.UPTRACK_API_URL || 'https://api.uptrack.app'
}
