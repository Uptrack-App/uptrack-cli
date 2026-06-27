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
uptrack apply  -f uptrack.yaml     # create/update monitors + channels to match the file
  --dry-run                        # print the plan, change nothing
  --prune --yes                    # also delete resources not in the file
uptrack diff   -f uptrack.yaml     # show drift; exits non-zero if any (for CI gating)
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

### Alert channels (with secrets)

Channels live alongside monitors and reconcile the same way (by name). Put
secret-bearing fields behind `${ENV_VAR}` references so the file is safe to
commit — they're resolved at apply time, and an unset variable fails the run
before any change is made:

```yaml
alert_channels:
  - name: Ops Slack
    type: slack
    config:
      webhook_url: ${SLACK_WEBHOOK}   # resolved from the environment at apply time
```

`export` intentionally dumps monitors only — it never writes resolved channel
secrets to disk.

### Drift detection for CI

`uptrack diff -f uptrack.yaml` prints what `apply` would change and **exits
non-zero when anything differs** — run it on pull requests so a stale config
fails the check.

### GitHub Action

```yaml
- uses: actions/checkout@v4
- uses: Uptrack-App/uptrack-cli@v1
  with:
    command: apply              # or: diff
    config: uptrack.yaml
    # args: '--prune --yes'     # optional flags
    api-key: ${{ secrets.UPTRACK_API_KEY }}
```

A full pull-request-diff / push-apply workflow is in
[`examples/github-workflow.yml`](examples/github-workflow.yml).

## License

MIT
