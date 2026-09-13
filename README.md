<div align="center">
  <h1>BITS File Manager</h1>
  <p>
    <a href="https://bits.co.id">
      <img src="https://img.shields.io/badge/Banten%20IT%20Solutions-BITS%20File%20Manager-00C853?style=for-the-badge&logo=files&logoColor=white" alt="BITS File Manager" />
    </a>
  </p>
  <p>
    Native file manager for LuCI on OpenWrt &mdash; browse, upload, download, edit, rename, move, search and delete files from the web interface. No PHP, no Go.
  </p>
  <br>
  <p>
    <img src="https://img.shields.io/badge/OpenWrt-00A1E9?style=flat&logo=openwrt&logoColor=white" alt="OpenWrt" />
    <img src="https://img.shields.io/badge/LuCI-3D5780?style=flat" alt="LuCI" />
    <img src="https://img.shields.io/badge/Lua-2C2D72?style=flat&logo=lua&logoColor=white" alt="Lua" />
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" alt="JavaScript" />
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat" alt="MIT" />
  </p>
</div>

---

## ✨ Features

| Feature                 | Description                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| **Browse**              | Navigate directories with path breadcrumb and parent directory shortcut.                                |
| **Upload**              | Upload files via XHR with inline progress.                                                              |
| **Download**            | Download individual files directly.                                                                     |
| **Edit**                | Edit text files in-browser with a modal textarea (read/save endpoints).                                 |
| **Rename**              | Rename files or directories inline.                                                                     |
| **Delete**              | Delete files or directories with confirmation.                                                          |
| **Move**                | Move files across directories (future-ready path picker).                                               |
| **Search**              | Filter file list by name in real-time (client-side).                                                    |
| **File Info**           | Owner, group, permissions, size, modification date &mdash; responsive columns hide on narrow screens.   |
| **Package Install**     | Install `.ipk` / `.apk` packages directly from the file list.                                           |
| **Dark Mode**           | Full support for OpenWrt light and dark themes (`data-darkmode`, `data-theme`).                         |
| **Security**            | Path allowlisting, filename sanitization, command injection prevention.                                 |
| **Automated Release**   | semantic-release builds `.ipk` + `.apk` and publishes a GitHub Release on every conventional commit.    |

## 🛠️ Tech Stack

| Layer        | Technology                                                                        |
| ------------ | --------------------------------------------------------------------------------- |
| **Runtime**  | OpenWrt (LuCI)                                                                    |
| **Backend**  | `rpcd` + `rpcd-mod-file` + `cgi-io` (upload), Lua controller (8 API endpoints)    |
| **Frontend** | Vanilla JavaScript (no framework), CSS with dark mode support                      |
| **View**     | LuCI template view (`bitsfilemanager.htm`) loaded via `action.type=template`       |
| **Build**    | `bash` + `tar` (ipk) + `apk-tools v3` (apk) — no SDK                       |
| **Release**  | semantic-release + GitHub Actions                                                 |

---

## 📁 Project Structure

```text
BITS-FileManager/
├── .github/
│   ├── dependabot.yml             # dep update (npm + actions)
│   └── workflows/
│       └── release.yml            # semantic-release + build .ipk/.apk + attach asset
├── luci-app-bitsfilemanager/
│   ├── control                    # ipk metadata
│   ├── postinst                   # clear luci cache + reload rpcd on install/upgrade
│   ├── htdocs/
│   │   └── luci-static/resources/bitsfilemanager/
│   │       ├── fb.css             # file browser styles + dark mode
│   │       ├── fb.js              # file browser logic (vanilla JS)
│   │       ├── menu.svg           # sidebar icon
│   │       ├── folder-icon.png    # folder thumbnail
│   │       ├── file-icon.png      # file thumbnail
│   │       └── link-icon.png      # symlink thumbnail
│   ├── luasrc/
│   │   ├── controller/bitsfilemanager.lua    # REST API (list, read, save, etc.)
│   │   └── view/bitsfilemanager.htm          # LuCI template view
│   └── root/
│       └── usr/share/
│           ├── luci/menu.d/luci-app-bitsfilemanager.json
│           └── rpcd/acl.d/luci-app-bitsfilemanager.json
├── scripts/
│   └── prepare.js                 # sync version + build .ipk/.apk (semantic-release)
├── build.sh                       # SDK-less .ipk + .apk packer (bash + tar + apk-tools)
├── package.json                   # semantic-release + plugins
├── package-lock.json              # npm lockfile (npm ci)
├── .releaserc.json                # release plugins (git + github)
├── CHANGELOG.md                   # auto-generated release notes
└── LICENSE
```

---

## 🚀 Quick Start

### Prerequisites

- An OpenWrt device (22.03+), with the `luci` feed installed
- Storage space for file operations

### 1. Download

Grab package dari [Releases](https://github.com/Banten-IT-Solutions/BITS-FileManager/releases), lalu copy ke device:
- `.ipk` untuk OpenWrt 22.03–24.10 (`opkg`)
- `.apk` untuk OpenWrt 25.12+ (`apk`)

### 2. Install

```sh
# OpenWrt 22.03–24.10 (opkg)
opkg install luci-app-bitsfilemanager_<version>_all.ipk

# OpenWrt 25.12+ (apk)
apk add luci-app-bitsfilemanager_<version>_all.apk
```

### 3. Use

Open LuCI (`System → BITS File Manager`) and start managing files on your router.

---

## 🏗️ Build

SDK-less `.ipk` + `.apk`. Butuh `apk-tools v3` (`apk mkpkg`) di `PATH`. Di CI sudah di-cache; lokal install `apk-tools` 3.x atau set `APK_BIN=<path/to/apk>`.

```sh
./build.sh
# output: dist/luci-app-bitsfilemanager_<version>_all.ipk
#         dist/luci-app-bitsfilemanager_<version>_all.apk
```

> `.ipk` = outer `tar.gz` (debian-binary + control.tar.gz + data.tar.gz). `.apk` = ADB container via `apk mkpkg`.

---

## 🚀 Release

Releases are automated with [semantic-release](https://semantic-release.gitbook.io) and [Conventional Commits](https://www.conventionalcommits.org). Write a conventional commit:

| Commit                           | Bump       |
| -------------------------------- | ---------- |
| `fix: ...`                       | patch      |
| `feat: ...`                      | minor      |
| `BREAKING CHANGE:` in body       | major      |

Push to `main` dan workflow build `.ipk` + `.apk` (`build.sh` + `apk-tools`) lalu publish ke GitHub Release.

---

## 📄 License

Distributed under the MIT License. See `LICENSE`.

---

<div align="center">
  <strong>BITS File Manager</strong> Developed with ❤️ by <a href="https://bits.co.id"><strong>Banten IT Solutions</strong></a>
</div>