(function () {
  'use strict';

  function escapeHtml(str) {
    if (str === null || str === undefined) {
      return '';
    }
    var div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  var ICO = {
    'folder-icon': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z"/></svg>',
    'file-icon': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/></svg>',
    'link-icon': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/><path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/></svg>',
    'rename': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M5 2a.5.5 0 0 1 .5-.5c.862 0 1.573.187 2.132.576.56.39.874 1.04.874 2.004v7.84c0 .964-.314 1.614-.874 2.004-.56.39-1.27.576-2.132.576a.5.5 0 0 1 0-1c.638 0 1.064-.152 1.39-.4.328-.25.485-.62.485-1.18V4.08c0-.56-.157-.93-.485-1.18-.326-.248-.752-.4-1.39-.4A.5.5 0 0 1 5 2z"/><path d="M12.5 2h-2a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1h-2v11h.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1h.5V2z"/></svg>',
    'edit': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>',
    'remove': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>',
    'install': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>',
    'up': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/></svg>'
  };

  var iwxhr = new XHR();
  var listElem = document.getElementById("list-content");
  listElem.onclick = handleClick;
  var currentPath;
  var pathElem = document.getElementById("current-path");

  pathElem.onblur = function () {
    var newPath = this.value.trim();
    if (newPath && newPath !== currentPath) {
      update_list(newPath);
    }
  };

  pathElem.onkeyup = function (evt) {
    if (evt.keyCode === 13) {
      this.blur();
    }
  };

  function removePath(filename, isdir) {
    var msg = isdir === "1" ? 'Delete directory? ' : 'Delete file? ';
    if (confirm(msg + escapeHtml(filename) + '?')) {
      iwxhr.get('/cgi-bin/luci/admin/system/bitsfilemanager/delete', {
          path: concatPath(currentPath, filename),
          isdir: isdir
        },
        function (x, res) {
          if (res.ec === 0) {
            refresh_list(res.data, currentPath);
          } else {
            alert('Delete failed: ' + (res.error || 'unknown error'));
          }
        }
      );
    }
  }

  function installPath(filename, isdir) {
    if (isdir === "1") {
      alert('This is a directory, choose an .ipk file to install.');
      return;
    }
    if (!isIPK(filename)) {
      alert('Only .ipk files can be installed.');
      return;
    }
    if (confirm('Install ' + escapeHtml(filename) + '?')) {
      iwxhr.get('/cgi-bin/luci/admin/system/bitsfilemanager/install', {
          filepath: concatPath(currentPath, filename),
          isdir: isdir
        },
        function (x, res) {
          if (res.ec === 0) {
            alert('Installed successfully.');
            location.reload();
          } else {
            alert('Install failed: ' + (res.error || 'check file format'));
          }
        }
      );
    }
  }

  function isIPK(filename) {
    var ext = filename.slice(filename.lastIndexOf(".") + 1);
    return ext.toLowerCase() === 'ipk' ? 1 : 0;
  }

  function renamePath(filename) {
    var newname = prompt('New filename:', filename);
    if (newname) {
      newname = newname.trim();
      if (newname && newname !== filename) {
        if (!/^[\w\-.\s]+$/.test(newname)) {
          alert('Filename has invalid characters');
          return;
        }
        var newpath = concatPath(currentPath, newname);
        iwxhr.get('/cgi-bin/luci/admin/system/bitsfilemanager/rename', {
            filepath: concatPath(currentPath, filename),
            newpath: newpath
          },
          function (x, res) {
            if (res.ec === 0) {
              refresh_list(res.data, currentPath);
            } else {
              alert('Rename failed: ' + (res.error || 'unknown error'));
            }
          }
        );
      }
    }
  }

  function openpath(filename, dirname) {
    dirname = dirname || currentPath;
    window.open('/cgi-bin/luci/admin/system/bitsfilemanager/open?path='
      + encodeURIComponent(dirname) + '&filename='
      + encodeURIComponent(filename));
  }

  function getFileElem(elem) {
    var cls, pcls;
    if (!elem) {
      return null;
    }
    cls = elem.getAttribute ? elem.getAttribute('class') : '';
    if (cls && cls.indexOf('-icon') > -1) {
      return elem;
    }
    if (elem.parentNode) {
      pcls = elem.parentNode.getAttribute ? elem.parentNode.getAttribute('class') : '';
      if (pcls && pcls.indexOf('-icon') > -1) {
        return elem.parentNode;
      }
    }
    return null;
  }

  function concatPath(path, filename) {
    if (path === '/') {
      return path + filename;
    }
    return path.replace(/\/$/, '') + '/' + filename;
  }

  function parent_of(path) {
    var p = String(path || '/').replace(/\/+$/, '');
    if (p === '' || p === '/') {
      return '/';
    }
    var idx = p.lastIndexOf('/');
    return idx <= 0 ? '/' : p.substring(0, idx);
  }

  function handleClick(evt) {
    var targetElem = evt.target;
    if (!targetElem) {
      return;
    }
    var actionBtn = targetElem.closest ? targetElem.closest('[data-action]') : null;
    var infoElem, row;

    if (actionBtn) {
      var action = actionBtn.getAttribute('data-action');
      infoElem = actionBtn.closest('tr');
      if (infoElem) {
        if (action === 'delete') {
          removePath(infoElem.dataset.filename, infoElem.dataset.isdir);
        } else if (action === 'install') {
          installPath(infoElem.dataset.filename, infoElem.dataset.isdir);
        } else if (action === 'rename') {
          renamePath(infoElem.dataset.filename);
        } else if (action === 'edit') {
          edit_file(infoElem.dataset.filename);
        }
      }
      return;
    }

    var fileElem = getFileElem(targetElem);
    if (fileElem) {
      var fileClass = fileElem.className || '';
      row = fileElem.closest('tr');
      if (fileClass.indexOf('parent-icon') > -1) {
        update_list(parent_of(currentPath));
      } else if (fileClass.indexOf('file-icon') > -1 && row) {
        edit_file(row.dataset.filename);
      } else if (fileClass.indexOf('link-icon') > -1) {
        if (row && row.dataset.linktarget) {
          if (row.dataset.isdir === "1") {
            update_list(row.dataset.linktarget);
          } else {
            var target = row.dataset.linktarget;
            var lastSlash = target.lastIndexOf('/');
            openpath(target.substring(lastSlash + 1), target.substring(0, lastSlash || 1));
          }
        }
      } else if (fileClass.indexOf('folder-icon') > -1 && row) {
        update_list(concatPath(currentPath, row.dataset.filename));
      }
    }
  }

  function refresh_list(filenames, path) {
    var listHtml = '<table class="cbi-section-table"><tbody>';
    if (path !== '/') {
      listHtml += '<tr class="cbi-section-table-row cbi-rowstyle-2"><td class="parent-icon" colspan="6">' + ICO.up + '<strong>..</strong></td></tr>';
    }
    if (filenames && filenames.length) {
      for (var i = 0; i < filenames.length; i++) {
        var line = filenames[i];
        if (line) {
          var f = line.match(/^([drwl-][r-][w-][x-][r-][w-][x-][r-][w-][x-])\s+(\S+)\s+(\S+)\s+(\S+)\s+(\d+)\s+(\S+\s+\d+\s+\d+:\d+)\s+(.+)$/);
          if (!f) {
            continue;
          }
          var perm = f[1];
          var owner = f[3];
          var size = f[5];
          var date = f[6];
          var name = f[7];
          var isLink = perm[0] === 'l' || perm[0] === 'z' || perm[0] === 'x';
          var displayname = name;
          var filename = name;
          var linktarget = '';
          if (isLink && name.indexOf(' -> ') > -1) {
            var parts = name.split(' -> ');
            displayname = parts[0] + ' -> ' + escapeHtml(parts[1]);
            filename = parts[0];
            linktarget = parts[1];
          } else {
            displayname = escapeHtml(name);
          }
          var icon = (perm[0] === 'd') ? 'folder-icon' : (isLink ? 'link-icon' : 'file-icon');
          var installBtn = '';
          if (filename.slice(filename.lastIndexOf('.') + 1).toLowerCase() === 'ipk') {
            installBtn = '<button class="fb-iconbtn" data-action="install" title="Install">' + ICO.install + '</button>';
          }
          listHtml += '<tr class="cbi-section-table-row cbi-rowstyle-' + (1 + i % 2) + '"'
            + ' data-filename="' + escapeHtml(filename) + '"'
            + ' data-isdir="' + (perm[0] === 'd' ? 1 : 0) + '"'
            + (linktarget ? ' data-linktarget="' + escapeHtml(linktarget) + '"' : '')
            + '>'
            + '<td class="cbi-value-field ' + icon + '">' + ICO[icon] + '<strong>' + displayname + '</strong></td>'
            + '<td class="cbi-value-field cbi-value-owner">' + escapeHtml(owner) + '</td>'
            + '<td class="cbi-value-field cbi-value-date">' + escapeHtml(date) + '</td>'
            + '<td class="cbi-value-field cbi-value-size">' + escapeHtml(size) + '</td>'
            + '<td class="cbi-value-field cbi-value-perm">' + escapeHtml(perm) + '</td>'
            + '<td class="cbi-section-table-cell">'
            + '<button class="fb-iconbtn" data-action="edit" title="Edit">' + ICO.edit + '</button>'
            + '<button class="fb-iconbtn" data-action="rename" title="Rename">' + ICO.rename + '</button>'
            + '<button class="fb-iconbtn" data-action="delete" title="Delete">' + ICO.remove + '</button>'
            + installBtn
            + '</td>'
            + '</tr>';
        }
      }
    }
    listHtml += '</tbody></table>';
    listElem.innerHTML = listHtml;
  }

  function update_list(path, opt) {
    opt = opt || {};
    path = concatPath(path, '');
    if (currentPath !== path) {
      iwxhr.get('/cgi-bin/luci/admin/system/bitsfilemanager/list', {
          path: path
        },
        function (x, res) {
          if (res.ec === 0) {
            refresh_list(res.data, path);
          } else {
            refresh_list([], path);
            if (res.error) {
              console.error('Error:', res.error);
            }
          }
        }
      );
      if (!opt.popState) {
        history.pushState({path: path}, null, '?path=' + encodeURIComponent(path));
      }
      currentPath = path;
      pathElem.value = currentPath;
    }
  }

  var uploadToggle = document.getElementById('upload-toggle');
  var uploadContainer = document.getElementById('upload-container');
  var isUploadHide = true;

  if (uploadToggle && uploadContainer) {
    uploadToggle.onclick = function () {
      isUploadHide = !isUploadHide;
      uploadContainer.style.display = isUploadHide ? 'none' : 'inline-flex';
    };
  }

  var uploadBtn = uploadContainer ? uploadContainer.querySelector('#upload-submit') : null;
  if (uploadBtn) {
    uploadBtn.onclick = function (evt) {
      evt.preventDefault();
      var uploadInput = document.getElementById('upload-file');
      if (!uploadInput || !uploadInput.files || !uploadInput.files[0]) {
        alert('Select a file to upload');
        return;
      }
      var file = uploadInput.files[0];
      var formData = new FormData();
      var filename = file.name;
      var lastSlash = Math.max(filename.lastIndexOf('\\'), filename.lastIndexOf('/'));
      if (lastSlash >= 0) {
        filename = filename.substring(lastSlash + 1);
      }
      formData.append('upload-filename', filename);
      formData.append('upload-dir', concatPath(currentPath, ''));
      formData.append('upload-file', file);

      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/cgi-bin/luci/admin/system/bitsfilemanager/upload', true);

      xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
          // Upload progress tracking
        }
      };

      xhr.onload = function () {
        if (xhr.status === 200) {
          try {
            var res = JSON.parse(xhr.responseText);
            if (res.ec === 0) {
              refresh_list(res.data, currentPath);
              uploadInput.value = '';
              alert('Uploaded successfully.');
            } else {
              alert('Upload failed: ' + (res.error || 'unknown error'));
            }
          } catch (e) {
            alert('Upload failed: response parse error');
          }
        } else {
          alert('Upload failed, please try again...');
        }
      };

      xhr.onerror = function () {
        alert('Upload failed, check network connection');
      };

      xhr.send(formData);
    };
  }

  // ===== edit file modal =====
  var editModal = document.getElementById('edit-modal');
  var editTextarea = document.getElementById('edit-textarea');
  var editTitle = document.getElementById('edit-title');
  var currentEditFilename = '';

  function edit_file(filename) {
    iwxhr.get('/cgi-bin/luci/admin/system/bitsfilemanager/read', {
        path: currentPath,
        filename: filename
      },
      function (x, res) {
        if (res && res.ec === 0) {
          currentEditFilename = filename;
          editTitle.textContent = 'Edit: ' + filename;
          editTextarea.value = res.data.content;
          if (editModal) editModal.style.display = 'block';
        } else {
          alert('Cannot read file: ' + ((res && res.error) || 'unknown error'));
        }
      }
    );
  }

  function close_edit() {
    if (editModal) editModal.style.display = 'none';
    currentEditFilename = '';
  }

  function save_file() {
    if (!currentEditFilename) return;
    iwxhr.post('/cgi-bin/luci/admin/system/bitsfilemanager/save', {
        path: currentPath,
        filename: currentEditFilename,
        content: editTextarea.value
      },
      function (x, res) {
        if (res && res.ec === 0) {
          close_edit();
        } else {
          alert('Save failed: ' + ((res && res.error) || 'unknown error'));
        }
      }
    );
  }

  var editClose = document.getElementById('edit-close');
  var editSave = document.getElementById('edit-save');
  var editCancel = document.getElementById('edit-cancel');
  if (editClose) editClose.onclick = close_edit;
  if (editSave) editSave.onclick = save_file;
  if (editCancel) editCancel.onclick = close_edit;

  function init() {
    var initPath = '/';
    var match = location.search.match(/path=([^&]+)/);
    if (match && match[1]) {
      try {
        initPath = decodeURIComponent(match[1]);
      } catch (e) {
        initPath = '/';
      }
    }
    update_list(initPath, {popState: true});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('popstate', function (evt) {
    var path = '/';
    if (evt.state && evt.state.path) {
      path = evt.state.path;
    }
    update_list(path, {popState: true});
  });

})();
