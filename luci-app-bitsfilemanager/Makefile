# SPDX-License-Identifier: MIT
#
# BITS File Manager for OpenWrt, SDK-compatible (feeds/luci).

include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-bitsfilemanager
LUCI_TITLE:=BITS File Manager
LUCI_PKGARCH:=all
LUCI_DEPENDS:=+luci-base +rpcd +rpcd-mod-file +cgi-io

PKG_VERSION:=1.0.0
PKG_RELEASE:=1
PKG_LICENSE:=Apache-2.0
PKG_MAINTAINER:=Banten IT Solutions <support@bits.co.id>

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature file
$(eval $(call BuildPackage,luci-app-bitsfilemanager))