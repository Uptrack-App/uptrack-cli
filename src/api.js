/**
 * Uptrack API client — thin wrapper over fetch.
 * No dependencies. Uses Node 18+ native fetch.
 */

const DEFAULT_BASE_URL = 'https://api.uptrack.app'

export function createClient(apiKey, baseUrl = DEFAULT_BASE_URL) {
  async function request(method, path, body) {
    const url = `${baseUrl}${path}`
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'uptrack-cli/0.1.0',
    }

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      let message = `HTTP ${res.status}`
      try {
        const json = JSON.parse(text)
        message = json.error?.message || json.message || message
      } catch {
        if (text) message = text
      }
      throw new Error(message)
    }

    const text = await res.text()
    return text ? JSON.parse(text) : null
  }

  return {
    listMonitors: () => request('GET', '/api/monitors'),
    getMonitor: (id) => request('GET', `/api/monitors/${id}`),
    createMonitor: (data) => request('POST', '/api/monitors', data),
    deleteMonitor: (id) => request('DELETE', `/api/monitors/${id}`),
    listIncidents: () => request('GET', '/api/incidents'),
    listStatusPages: () => request('GET', '/api/status-pages'),
    getOrganization: () => request('GET', '/api/organization'),
  }
}
