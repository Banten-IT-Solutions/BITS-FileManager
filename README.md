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

## Install

```sh
# OpenWrt 22.03–24.10 (opkg)
opkg install luci-app-bitsfilemanager_<version>_all.ipk

# OpenWrt 25.12+ (apk)
apk add luci-app-bitsfilemanager_<version>_all.apk
```

## Build

SDK-less `.ipk` + `.apk` via `build.sh` + `apk-tools v3` (`apk mkpkg`). Butuh `apk-tools` 3.x di `PATH` (di CI sudah di-cache).

```sh
./build.sh
# output: dist/luci-app-bitsfilemanager_<version>_all.ipk
#         dist/luci-app-bitsfilemanager_<version>_all.apk
```

## Release

semantic-release build `.ipk` + `.apk` → GitHub Release → dispatch ke BITS-WRT-Packages feed.

## License

Apache-2.0