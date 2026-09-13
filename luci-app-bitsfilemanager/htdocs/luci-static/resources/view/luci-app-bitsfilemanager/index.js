// SPDX-License-Identifier: Apache-2.0
// NOTE: luci-app-bitsfilemanager uses a template view (luasrc/view/bitsfilemanager.htm)
// loaded via menu.d action.type=template on luci 23.05+,
// does not directly call this JS view; kept for reference.
'use strict';
'require view';
'require rpc';
'require form';

return view.extend({
	render: function() {
		// actual UI is provided by the luasrc/view/bitsfilemanager.htm template
		return E('p', {}, _('Loading…'));
	}
});
