# BITS-FileManager

BITS File Manager — native file manager for LuCI (OpenWrt), no PHP, no Go.
Browse, upload, download, edit, rename, move, search and delete files.

## Packages

```text
luci-app-bitsfilemanager
```

## LuCI

```text
System > BITS File Manager
```

## Build

Release via semantic-release + openwrt/gh-action-sdk:

- `.ipk` (OpenWrt 24.10, opkg)
- `.apk` (OpenWrt 25.12, apk)

Published to the BITS-WRT-Packages feed.

## License

Apache-2.0