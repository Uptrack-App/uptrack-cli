# @uptrack-app/cli

Command-line interface for [Uptrack](https://uptrack.app) uptime monitoring. Zero dependencies — uses Node 18+ native fetch.

## Install

```bash
# Run directly (no install needed)
npx @uptrack-app/cli list

# Or install globally
npm i -g @uptrack-app/cli
```

## Authentication

Set your API key (get one at [uptrack.app/dashboard/settings](https://uptrack.app/dashboard/settings)):

```bash
export UPTRACK_API_KEY=your_api_key
```

Or pass it per-command:

```bash
npx @uptrack-app/cli list --api-key=your_api_key
```

## Commands

### List monitors

```bash
uptrack list
```

```
Status  Name           URL                        Interval  Uptime
──────  ─────────────  ─────────────────────────  ────────  ──────
● up    Production     https://example.com        60s       99.99%
● up    API            https://api.example.com    30s       100%
● down  Staging        https://staging.example.com 180s     98.5%

3 monitor(s)
```

### Create a monitor

```bash
uptrack create --url https://example.com
uptrack create --url https://api.example.com --name "API" --interval 30
```

### Check status

```bash
uptrack status
```

```
Monitors: 12 total
  ● 11 up
  ● 1 down

Down monitors:
  ● staging.example.com
```

### Delete a monitor

```bash
uptrack delete <monitor-id>
```

### Help

```bash
uptrack help
```

## Links

- [Uptrack](https://uptrack.app)
- [API Docs](https://api.uptrack.app/api/openapi)
- [Guides](https://uptrack.app/guides)
