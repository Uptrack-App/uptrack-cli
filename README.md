# uptrack — monitoring-as-code CLI

Manage your [Uptrack](https://uptrack.app) uptime monitors from your shell or CI.
A small, dependency-free static binary (written in Rust) — a thin client over the
public v2 API that does exactly what the dashboard does, nothing more.

## Install

```bash
# macOS / Linux — downloads the right binary for your OS/arch
curl -fsSL https://raw.githubusercontent.com/Uptrack-App/uptrack-cli/main/install.sh | sh
```

Or grab a binary from the [latest release](https://github.com/Uptrack-App/uptrack-cli/releases/latest) and put it on your `PATH`:

| Platform | Asset |
|---|---|
| macOS (Apple Silicon) | `uptrack-aarch64-apple-darwin.tar.gz` |
| macOS (Intel) | `uptrack-x86_64-apple-darwin.tar.gz` |
| Linux (x86_64) | `uptrack-x86_64-unknown-linux-musl.tar.gz` |
| Linux (arm64) | `uptrack-aarch64-unknown-linux-musl.tar.gz` |

Verify with `SHA256SUMS` from the release.

## Auth

```bash
export UPTRACK_API_KEY=utk_…                      # Settings → API keys in the dashboard
export UPTRACK_API_URL=https://api.uptrack.app    # optional, this is the default
```

## Commands

```bash
uptrack list                       # status, type, name, url, 30-day uptime
uptrack status                     # up/down summary
uptrack create --url https://example.com [--name "Home" --type http --interval 60]
uptrack delete <name|id> [--yes]   # resolves by name or id; --yes to confirm
uptrack export -o uptrack.yaml     # dump current monitors to YAML
uptrack apply  -f uptrack.yaml     # create/update monitors to match the file
  --dry-run                        # print the plan, change nothing
  --prune --yes                    # also delete monitors not in the file
```

## Monitors as code

Keep your monitors in a version-controlled YAML file and `apply` them from CI —
review changes in a pull request, sync on merge.

```yaml
monitors:
  - name: Homepage
    url: https://example.com
    type: http
    interval: 60
  - name: Login keyword
    url: https://example.com/login
    type: keyword
    keyword: "Sign in"
```

Monitors are matched by **name** (case-insensitive): a name in the file that
doesn't exist yet is created; one that exists is updated if its url / type /
interval / keyword differ; `--prune` removes monitors absent from the file.
`type` defaults to `http`; `interval` (seconds) and `keyword` are optional.

### GitHub Actions example

```yaml
- run: curl -fsSL https://raw.githubusercontent.com/Uptrack-App/uptrack-cli/main/install.sh | sh
- run: uptrack apply -f uptrack.yaml
  env:
    UPTRACK_API_KEY: ${{ secrets.UPTRACK_API_KEY }}
```

## License

MIT
