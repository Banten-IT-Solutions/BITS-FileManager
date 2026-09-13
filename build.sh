#!/usr/bin/env bash
# Pack luci-app-bitsfilemanager jadi .ipk tanpa OpenWrt SDK.
# Format ipk OpenWrt = tar.gz luar berisi ./debian-binary + ./control.tar.gz + ./data.tar.gz.
# LuCI mapping: luasrc -> /usr/lib/lua/luci, htdocs -> /www, root -> /
set -euo pipefail

PKG_NAME=luci-app-bitsfilemanager
PKG_VER=$(awk -F': ' '/^Version:/{print $2; exit}' "$PKG_NAME/control")
OUT="dist/${PKG_NAME}_${PKG_VER}_all.ipk"

rm -rf .build dist
mkdir -p .build/root .build/control .build/outer dist

# payload
cp -a "$PKG_NAME/root/." .build/root/ 2>/dev/null || true
if [ -d "$PKG_NAME/luasrc" ]; then
	mkdir -p .build/root/usr/lib/lua/luci
	cp -a "$PKG_NAME/luasrc/." .build/root/usr/lib/lua/luci/
fi
if [ -d "$PKG_NAME/htdocs" ]; then
	mkdir -p .build/root/www
	cp -a "$PKG_NAME/htdocs/." .build/root/www/
fi

# control
cp "$PKG_NAME/control" .build/control/control
if [ -f "$PKG_NAME/postinst" ]; then
	cp "$PKG_NAME/postinst" .build/control/postinst
	chmod 755 .build/control/postinst
fi

tar czf .build/data.tar.gz --owner=0 --group=0 -C .build/root .
tar czf .build/control.tar.gz --owner=0 --group=0 -C .build/control .
printf '2.0\n' > .build/debian-binary

cp .build/debian-binary .build/control.tar.gz .build/data.tar.gz .build/outer/
tar czf "$OUT" -C .build/outer .

rm -rf .build
echo "Built: $OUT"