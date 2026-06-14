#!/bin/sh
# Install the `uptrack` CLI — monitoring-as-code for Uptrack (https://uptrack.app).
#   curl -fsSL https://raw.githubusercontent.com/Uptrack-App/uptrack-cli/main/install.sh | sh
set -e

REPO="Uptrack-App/uptrack-cli"
BINDIR="${UPTRACK_BIN_DIR:-/usr/local/bin}"

os=$(uname -s)
arch=$(uname -m)
case "$os" in
  Darwin) plat="apple-darwin" ;;
  Linux)  plat="unknown-linux-musl" ;;
  *) echo "Unsupported OS: $os — grab a binary from https://github.com/$REPO/releases" >&2; exit 1 ;;
esac
case "$arch" in
  arm64|aarch64) cpu="aarch64" ;;
  x86_64|amd64)  cpu="x86_64" ;;
  *) echo "Unsupported architecture: $arch" >&2; exit 1 ;;
esac
target="${cpu}-${plat}"
url="https://github.com/$REPO/releases/latest/download/uptrack-${target}.tar.gz"

echo "Downloading uptrack (${target})…"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
curl -fsSL "$url" -o "$tmp/uptrack.tar.gz" || { echo "Download failed: $url" >&2; exit 1; }
tar -xzf "$tmp/uptrack.tar.gz" -C "$tmp"

if [ -w "$BINDIR" ]; then
  install -m 0755 "$tmp/uptrack" "$BINDIR/uptrack"
elif [ "$(id -u)" -ne 0 ] && command -v sudo >/dev/null 2>&1; then
  echo "Installing to $BINDIR (sudo)…"
  sudo install -m 0755 "$tmp/uptrack" "$BINDIR/uptrack"
else
  BINDIR="$HOME/.local/bin"
  mkdir -p "$BINDIR"
  install -m 0755 "$tmp/uptrack" "$BINDIR/uptrack"
fi

echo "✓ Installed uptrack to $BINDIR/uptrack"
case ":$PATH:" in
  *":$BINDIR:"*) ;;
  *) echo "  Add to your PATH:  export PATH=\"$BINDIR:\$PATH\"" ;;
esac
echo "  Get started:       export UPTRACK_API_KEY=…   # Settings → API keys"
echo "                     uptrack list"
