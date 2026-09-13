module("luci.controller.bitsfilemanager", package.seeall)

require("nixio.fs")

local ALLOWED_PATHS = {
    "/",
    "/mnt",
    "/etc",
    "/root",
    "/tmp",
    "/www"
}

local MAX_UPLOAD_SIZE = 500 * 1024 * 1024

function index()
    -- luci 23.05+ already registers the menu via menu.d JSON; no need to register menu items again
    if not nixio.fs.access("/usr/share/luci/menu.d/luci-app-bitsfilemanager.json") then
        entry({"admin", "system"}, firstchild(), _("System"), 44).dependent = false

        local page
        page = entry({"admin", "system", "bitsfilemanager"}, template("bitsfilemanager"), _("BITS File Manager"), 1)
        page.i18n = "base"
        page.dependent = true
        page.acl_depends = { "luci-app-bitsfilemanager" }
    end

    -- API routes must be registered in both old and new versions (fb.js AJAX requests depend on these routes)
    entry({"admin", "system", "bitsfilemanager", "list"}, call("bitsfilemanager_list"), nil)
    entry({"admin", "system", "bitsfilemanager", "open"}, call("bitsfilemanager_open"), nil)
    entry({"admin", "system", "bitsfilemanager", "read"}, call("bitsfilemanager_read"), nil)
    entry({"admin", "system", "bitsfilemanager", "save"}, call("bitsfilemanager_save"), nil)
    entry({"admin", "system", "bitsfilemanager", "delete"}, call("bitsfilemanager_delete"), nil)
    entry({"admin", "system", "bitsfilemanager", "rename"}, call("bitsfilemanager_rename"), nil)
    entry({"admin", "system", "bitsfilemanager", "upload"}, call("bitsfilemanager_upload"), nil)
    entry({"admin", "system", "bitsfilemanager", "install"}, call("bitsfilemanager_install"), nil)
end

function list_response(path, success, error_msg)
    luci.http.prepare_content("application/json")
    local result
    if success then
        local rv = scandir(path)
        result = {
            ec = 0,
            data = rv
        }
    else
        result = {
            ec = 1,
            error = error_msg or "Operation failed"
        }
    end
    luci.http.write_json(result)
end

function is_path_allowed(path)
    if not path or path == "" then
        return false
    end
    local realpath = nixio.fs.realpath(path)
    if not realpath then
        return false
    end
    for _, allowed in ipairs(ALLOWED_PATHS) do
        if realpath == allowed or realpath:find("^" .. allowed .. "/") then
            return true, realpath
        end
    end
    return false, realpath
end

function sanitize_path(path)
    if not path then
        return nil
    end
    -- Bug fix: original code replaced "<>" with "/", should be "\\" (Windows path backslash)
    path = path:gsub("\\\\", "/"):gsub("//+", "/"):gsub("/$", "")
    if path == "" then
        return "/"
    end
    return path
end

function bitsfilemanager_list()
    local path = sanitize_path(luci.http.formvalue("path")) or "/"
    local allowed, realpath = is_path_allowed(path)
    if not allowed then
        list_response(path, false, "Path not allowed")
        return
    end
    -- Bug fix: in Lua, not has higher precedence than ==, original expression is always false
    if not nixio.fs.stat(realpath) or nixio.fs.stat(realpath, "type") ~= "dir" then
        list_response(path, false, "Invalid directory")
        return
    end
    list_response(path, true)
end

function bitsfilemanager_open()
    local path = sanitize_path(luci.http.formvalue("path")) or "/"
    local filename = luci.http.formvalue("filename") or ""
    local allowed, realpath = is_path_allowed(path)
    if not allowed then
        luci.http.status(403, "Forbidden")
        return
    end
    if filename:match("[\\/]") or filename:match("%..*%.") then
        luci.http.status(400, "Invalid filename")
        return
    end
    local filepath = realpath .. "/" .. filename
    if not nixio.fs.stat(filepath) then
        luci.http.status(404, "File not found")
        return
    end
    local mime = to_mime(filename)
    local fp = io.open(filepath, "r")
    if not fp then
        luci.http.status(500, "Cannot open file")
        return
    end
    luci.http.header('Content-Disposition', 'inline; filename="' .. filename .. '"')
    luci.http.prepare_content(mime)
    luci.ltn12.pump.all(luci.ltn12.source.file(fp), luci.http.write)
    -- fp sudah ditutup oleh luci.ltn12.source.file saat EOF
end

function bitsfilemanager_read()
    local path = sanitize_path(luci.http.formvalue("path")) or "/"
    local filename = luci.http.formvalue("filename") or ""
    local allowed, realpath = is_path_allowed(path)
    luci.http.prepare_content("application/json")
    if not allowed then
        luci.http.write_json({ ec = 1, error = "Path not allowed" })
        return
    end
    if filename == "" or filename:match("[\\/]") then
        luci.http.write_json({ ec = 1, error = "Invalid filename" })
        return
    end
    local filepath = realpath .. "/" .. filename
    local fp = io.open(filepath, "r")
    if not fp then
        luci.http.write_json({ ec = 1, error = "Cannot open file" })
        return
    end
    local content = fp:read("*a") or ""
    fp:close()
    luci.http.write_json({ ec = 0, data = { filename = filename, content = content } })
end

function bitsfilemanager_save()
    local path = sanitize_path(luci.http.formvalue("path")) or "/"
    local filename = luci.http.formvalue("filename") or ""
    local content = luci.http.formvalue("content") or ""
    local allowed, realpath = is_path_allowed(path)
    luci.http.prepare_content("application/json")
    if not allowed then
        luci.http.write_json({ ec = 1, error = "Path not allowed" })
        return
    end
    if filename == "" or filename:match("[\\/]") then
        luci.http.write_json({ ec = 1, error = "Invalid filename" })
        return
    end
    local filepath = realpath .. "/" .. filename
    local fp = io.open(filepath, "w")
    if not fp then
        luci.http.write_json({ ec = 1, error = "Cannot write file" })
        return
    end
    fp:write(content)
    fp:close()
    luci.http.write_json({ ec = 0 })
end

function bitsfilemanager_delete()
    local path = sanitize_path(luci.http.formvalue("path"))
    local isdir = luci.http.formvalue("isdir")
    if not path then
        list_response("/", false, "Invalid path")
        return
    end
    local allowed, realpath = is_path_allowed(path)
    if not allowed then
        list_response(path, false, "Path not allowed")
        return
    end
    local success, err
    if isdir == "1" then
        if nixio.fs.stat(realpath, "type") == "dir" then
            success, err = rmtree(realpath)
        else
            success = false
            err = "Not a directory"
        end
    else
        if nixio.fs.stat(realpath, "type") == "reg" then
            success = nixio.fs.unlink(realpath)
            err = success and nil or "Failed to delete file"
        else
            success = false
            err = "Not a regular file"
        end
    end
    list_response(nixio.fs.dirname(realpath), success, err)
end

function rmtree(path)
    local handle = nixio.fs.dir(path)
    if handle then
        for entry in handle do
            if entry ~= "." and entry ~= ".." then
                local subpath = path .. "/" .. entry
                if nixio.fs.stat(subpath, "type") == "dir" then
                    if not rmtree(subpath) then
                        return false
                    end
                else
                    if not nixio.fs.unlink(subpath) then
                        return false
                    end
                end
            end
        end
    end
    return nixio.fs.rmdir(path)
end

function bitsfilemanager_rename()
    local filepath = luci.http.formvalue("filepath")
    local newpath = luci.http.formvalue("newpath")
    if not filepath or not newpath then
        list_response("/", false, "Invalid parameters")
        return
    end
    local old_allowed, old_realpath = is_path_allowed(filepath)
    local new_allowed, new_realpath = is_path_allowed(newpath)
    if not old_allowed or not new_allowed then
        list_response(filepath, false, "Path not allowed")
        return
    end
    if not nixio.fs.stat(old_realpath) then
        list_response(filepath, false, "Source file not found")
        return
    end
    local success = nixio.fs.rename(old_realpath, new_realpath)
    list_response(nixio.fs.dirname(old_realpath), success, success and nil or "Rename failed")
end

function bitsfilemanager_install()
    local filepath = luci.http.formvalue("filepath")
    local isdir = luci.http.formvalue("isdir")
    if not filepath then
        list_response("/", false, "Invalid filepath")
        return
    end
    local allowed, realpath = is_path_allowed(filepath)
    if not allowed then
        list_response(filepath, false, "Path not allowed")
        return
    end
    if isdir == "1" then
        list_response(realpath, false, "Cannot install directory")
        return
    end
    local ext = filepath:match("%.(%w+)$")
    if ext ~= "ipk" then
        list_response(realpath, false, "Only ipk files allowed")
        return
    end
    local success, err = installIPK(realpath)
    list_response(nixio.fs.dirname(realpath), success, err)
end

function installIPK(filepath)
    -- Security fix: wrap path in single quotes to prevent command injection
    local safe_path = filepath:gsub("'", "'\\''")
    local output = luci.sys.exec("opkg --force-depends install '" .. safe_path .. "' 2>&1")
    luci.sys.exec('rm -rf /tmp/luci-*')
    if output:match("Installing") and output:match("completed") then
        return true
    end
    return false, output
end

function bitsfilemanager_upload()
    local uploaddir = sanitize_path(luci.http.formvalue("upload-dir")) or "/"
    local allowed, realpath = is_path_allowed(uploaddir)
    if not allowed then
        list_response(uploaddir, false, "Path not allowed")
        return
    end
    -- Bug fix: in Lua, not has higher precedence than ==, original expression is always false
    if not nixio.fs.stat(realpath) or nixio.fs.stat(realpath, "type") ~= "dir" then
        list_response(uploaddir, false, "Invalid directory")
        return
    end
    local filename
    local filepath
    local uploaded_size = 0
    local fp
    luci.http.setfilehandler(function(meta, chunk, eof)
        if not fp and meta and meta.name == "upload-file" then
            filename = sanitize_filename(meta.file)
            if not filename then
                return
            end
            filepath = realpath .. "/" .. filename
            fp = io.open(filepath, "w")
            if not fp then
                return
            end
        end
        if fp and chunk then
            uploaded_size = uploaded_size + #chunk
            if uploaded_size > MAX_UPLOAD_SIZE then
                fp:close()
                fp = nil
                nixio.fs.unlink(filepath)
                return
            end
            fp:write(chunk)
        end
        if fp and eof then
            fp:close()
        end
    end)
    list_response(uploaddir, true)
end

function sanitize_filename(filename)
    if not filename or filename == "" then
        return nil
    end
    filename = filename:gsub("[^%w%-_.]", "_"):gsub("_+", "_")
    if #filename > 255 or filename:match("^%.") then
        return nil
    end
    return filename
end

function scandir(directory)
    local results = {}
    local allowed, realpath = is_path_allowed(directory)
    if not allowed then
        return results
    end
    local dir = nixio.fs.dir(realpath)
    if not dir then
        return results
    end
    local entries = {}
    for entry in dir do
        if entry ~= "." and entry ~= ".." then
            table.insert(entries, entry)
        end
    end
    table.sort(entries)
    for _, name in ipairs(entries) do
        local fullpath = realpath .. "/" .. name
        local stat = nixio.fs.stat(fullpath)
        if stat then
            local filetype = stat.type
            local size = stat.size or 0
            local mtime = stat.mtime or 0
            local perms = stat.modedec or "---------"

            local line
            if filetype == "dir" then
                line = string.format("drwxr-xr-x %6d %-8s %-8s %10d %s %s",
                    1, stat.uid or "root", stat.gid or "root", size,
                    os.date("%b %d %H:%M", mtime), name)
            elseif filetype == "lnk" then
                local target = nixio.fs.readlink(fullpath)
                local linktype = "l"
                if target then
                    local target_real = nixio.fs.realpath(fullpath)
                    if target_real then
                        local target_stat = nixio.fs.stat(target_real)
                        if target_stat and target_stat.type == "dir" then
                            linktype = "z"
                        end
                    end
                end
                line = string.format("%srwxr-xr-x %6d %-8s %-8s %10d %s %s -> %s",
                    linktype, 1, stat.uid or "root", stat.gid or "root", size,
                    os.date("%b %d %H:%M", mtime), name, target or "")
            else
                line = string.format("-rw-r--r-- %6d %-8s %-8s %10d %s %s",
                    1, stat.uid or "root", stat.gid or "root", size,
                    os.date("%b %d %H:%M", mtime), name)
            end
            table.insert(results, line)
        end
    end
    return results
end

MIME_TYPES = {
    ["txt"]   = "text/plain",
    ["conf"]  = "text/plain",
    ["ovpn"]  = "text/plain",
    ["log"]   = "text/plain",
    ["js"]    = "text/javascript",
    ["json"]  = "application/json",
    ["css"]   = "text/css",
    ["htm"]   = "text/html",
    ["html"]  = "text/html",
    ["patch"] = "text/x-patch",
    ["c"]     = "text/x-csrc",
    ["h"]     = "text/x-chdr",
    ["o"]     = "text/x-object",
    ["ko"]    = "text/x-object",
    ["bmp"]   = "image/bmp",
    ["gif"]   = "image/gif",
    ["png"]   = "image/png",
    ["jpg"]   = "image/jpeg",
    ["jpeg"]  = "image/jpeg",
    ["svg"]   = "image/svg+xml",
    ["webp"]  = "image/webp",
    ["ico"]   = "image/x-icon",
    ["zip"]   = "application/zip",
    ["pdf"]   = "application/pdf",
    ["xml"]   = "application/xml",
    ["xsl"]   = "application/xml",
    ["doc"]   = "application/msword",
    ["ppt"]   = "application/vnd.ms-powerpoint",
    ["xls"]   = "application/vnd.ms-excel",
    ["odt"]   = "application/vnd.oasis.opendocument.text",
    ["odp"]   = "application/vnd.oasis.opendocument.presentation",
    ["pl"]    = "application/x-perl",
    ["sh"]    = "application/x-shellscript",
    ["bash"]  = "application/x-shellscript",
    ["zsh"]   = "application/x-shellscript",
    ["php"]   = "application/x-php",
    ["deb"]   = "application/x-deb",
    ["ipk"]   = "application/x-ipkg",
    ["iso"]   = "application/x-cd-image",
    ["tar"]   = "application/x-tar",
    ["gz"]    = "application/gzip",
    ["tgz"]   = "application/x-compressed-tar",
    ["xz"]    = "application/x-xz",
    ["bz2"]   = "application/x-bzip2",
    ["7z"]    = "application/x-7z-compressed",
    ["rar"]   = "application/vnd.rar",
    ["bin"]   = "application/octet-stream",
    ["img"]   = "application/octet-stream",
    ["apk"]   = "application/vnd.android.package-archive",
    ["mp3"]   = "audio/mpeg",
    ["ogg"]   = "audio/x-vorbis+ogg",
    ["wav"]   = "audio/x-wav",
    ["flac"]  = "audio/flac",
    ["aac"]   = "audio/aac",
    ["mpg"]   = "video/mpeg",
    ["mpeg"]  = "video/mpeg",
    ["mp4"]   = "video/mp4",
    ["avi"]   = "video/x-msvideo",
    ["mkv"]   = "video/x-matroska",
    ["webm"]  = "video/webm",
    ["mov"]   = "video/quicktime"
}

function to_mime(filename)
    if type(filename) == "string" then
        local ext = filename:match("%.([^%.]+)$")
        if ext and MIME_TYPES[ext:lower()] then
            return MIME_TYPES[ext:lower()]
        end
    end
    return "application/octet-stream"
end
