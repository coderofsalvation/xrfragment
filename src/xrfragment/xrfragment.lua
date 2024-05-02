-- SPDX-License-Identifier: MPL-2.0         
-- Copyright (c) 2023 Leon van Kammen/NLNET 
--
-- This is a tiny minimal portable (re)implementation of the xrfragment parser
-- because sometimes this is easier to integrate compared to the fullfledged
-- HaXe generated code-languages (which requires various libraries)
--
XRF = {
  URI = {}
}

-----------------------------------------------------------------------------------
--- global functions
-----------------------------------------------------------------------------------

function split (inputstr, sep)
	if sep == nil then
		sep = "%s"
	end
	local t={}
	for str in string.gmatch(inputstr, "([^"..sep.."]+)") do
		table.insert(t, str)
	end
	return t
end

function dump(t)
  if( t == nil ) then return print("(nil)") end
  for key, value in pairs(t) do
    print(key, value)
  end
end

-----------------------------------------------------------------------------------
--- global types used across functions
-----------------------------------------------------------------------------------

Value = {}
function Value:new()
  local obj = {}
  obj.x = nil
  obj.y = nil
  obj.z = nil
  obj.color = nil
  obj.string = nil
  obj.int_val = nil
  obj.float = nil 
  obj.args = nil
  setmetatable(obj, self)
  self.__index = self
  return obj
end

Type = {}
Type.isColor = "^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$"
Type.isInt = "^[0-9]+$"
Type.isFloat = "^[0-9]+%.[0-9]+$"
Type.isVector = "([,]+|%w)"

-----------------------------------------------------------------------------------
--- Fragment Parser functions
-----------------------------------------------------------------------------------

function XRF.parse(key, value, resultMap)
  local frag = {}
  frag["prio"] = "^%d+$"
  frag["pos"]  = "(%d+),(%d+),(%d+)"
  frag["q"]    = ".+"

  local regex = frag[key]
  --if string.match(value, regex) then
  local v = Value:new()
  XRF.guessType(v, value)
  resultMap[key] = v;
  return true
end

function XRF.guessType(v, str)
  v.string = str
  local parts = split(str, ",")
  if #parts > 1 then
    v.x = tonumber(parts[1])
    v.y = tonumber(parts[2])
    if #parts > 2 then
      v.z = tonumber(parts[3])
    end
  end

  if string.match(str, Type.isColor) then
    v.color = str
  end
  if string.match(str, Type.isFloat) then
    v.float = tonumber(str)
  end
  if string.match(str, Type.isInt) then
    v.int_val = tonumber(str)
  end
end

-----------------------------------------------------------------------------------
--- URI helper class 
-----------------------------------------------------------------------------------

-- The MIT License (MIT)
-- 
-- Copyright (c) 2011-2013 <Bertrand Mansion>
-- 
-- Permission is hereby granted, free of charge, to any person obtaining a copy
-- of this software and associated documentation files (the "Software"), to deal
-- in the Software without restriction, including without limitation the rights
-- to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
-- copies of the Software, and to permit persons to whom the Software is
-- furnished to do so, subject to the following conditions:
-- 
-- The above copyright notice and this permission notice shall be included in
-- all copies or substantial portions of the Software.
-- 
-- THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
-- IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
-- FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
-- AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
-- LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
-- OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
-- THE SOFTWARE.

-- == list of known and common scheme ports
--
-- @see http://www.iana.org/assignments/uri-schemes.html
--
local SERVICES = {
	http     = 80,
	https    = 443,
}

local LEGAL = {
	["-"] = true, ["_"] = true, ["."] = true, ["!"] = true,
	["~"] = true, ["*"] = true, ["'"] = true, ["("] = true,
	[")"] = true, [":"] = true, ["@"] = true, ["&"] = true,
	["="] = true, ["+"] = true, ["$"] = true, [","] = true,
	[";"] = true -- can be used for parameters in path
}

-- aggressive caching of methods
local gsub   = string.gsub
local char   = string.char
local byte   = string.byte
local upper  = string.upper
local lower  = string.lower
local format = string.format

-- forward declaration of helper utilities
local util = {}

local function decode(str)
	local str = gsub(str, "+", " ")

	return (gsub(str, "%%(%x%x)", function(c)
			return char(tonumber(c, 16))
	end))
end

local function encode(str)
	return (gsub(str, "([^A-Za-z0-9%_%.%-%~])", function(v)
			return upper(format("%%%02x", byte(v)))
	end))
end

-- Build a URL given a table with the fields:
--
--	- scheme
--	- user
--	- password
--	- host
--	- port
--	- path
--	- query
--	- fragment
--
-- Example:
--
--	local url = uri.build({
--		scheme = "http",
--		host = "example.com",
--		path = "/some/path"
--	})
--
--	assert(url == "http://example.com/some/path")
--
local function build(uri)
	local url = ""

	if uri.path then
		local path = uri.path
		
		gsub(path, "([^/]+)", function (s) return util.encode_segment(s) end)

		url = url .. tostring(path)
	end

	if uri.query then
		local qstring = tostring(uri.query)
		if qstring ~= "" then
			url = url .. "?" .. qstring
		end
	end

	if uri.host then
		local authority = uri.host

		if uri.port and uri.scheme and SERVICES[uri.scheme] ~= uri.port then
			authority = authority .. ":" .. uri.port
		end

		local userinfo

		if uri.user and uri.user ~= "" then
			userinfo = encode(uri.user)

			if uri.password then
				userinfo = userinfo .. ":" .. encode(uri.password)
			end
		end

		if userinfo and userinfo ~= "" then
			authority = userinfo .. "@" .. authority
		end

		if authority then
			if url ~= "" then
				url = "//" .. authority .. "/" .. gsub(url, "^/+", "")
			else
				url = "//" .. authority
			end
		end
	end

	if uri.scheme then
		url = uri.scheme .. ":" .. url
	end

	if uri.fragment then
		url = url .. "#" .. uri.fragment
	end

	return url
end

-- Parse the url into the designated parts.
--
-- Depending on the url, the following parts will be available:
--
--	- scheme
--	- userinfo
--	- user
--	- password
--	- authority
--	- host
--	- port
--	- path
--      - query
--      - fragment
--
-- Usage:
--
--     local u = uri.parse("http://john:monkey@example.com/some/path#h1")
--
--     assert(u.host == "example.com")
--     assert(u.scheme == "http")
--     assert(u.user == "john")
--     assert(u.password == "monkey")
--     assert(u.path == "/some/path")
--     assert(u.fragment == "h1")
--
local function parse(url)
	local uri = { query = nil }

	util.setauthority(uri, "")

	local url = tostring(url or "")

	url = gsub(url, "#(.*)$", function(v)
		uri.fragment = v
    uri.frag = {}
    for part in v:gmatch("([^&]+)") do
      if part:match("=") then
        local k,v = string.match(part,"(.-)=(.-)$")
        XRF.parse( k, v, uri.frag )
      else
        XRF.parse( part, " ", uri.frag )
      end
    end
		return ""
	end)

	url = gsub(url, "^([%w][%w%+%-%.]*)%:", function(v)
		uri.scheme = lower(v)
		return ""
	end)

	url = gsub(url, "%?(.*)", function(v)
		uri.query = v
		return ""
	end)

	url = gsub(url, "^//([^/]*)", function(v)
		util.setauthority(uri, v)
		return ""
	end)

	uri.path = decode(url)

	return uri
end

function util.encode_segment(s)
	local function encode_legal(c)
		if LEGAL[c] then
			return c
		end

		return encode(c)
	end

	return gsub(s, "([^a-zA-Z0-9])", encode_legal)
end

-- set the authority part of the url
--
-- The authority is parsed to find the user, password, port and host if available.
-- @param authority The string representing the authority
-- @return a string with what remains after the authority was parsed
function util.setauthority(uri, authority)
	uri.authority = authority
	uri.port = nil
	uri.host = nil
	uri.userinfo = nil
	uri.user = nil
	uri.password = nil

	authority = gsub(authority, "^([^@]*)@", function(v)
		uri.userinfo = decode(v)
		return ""
	end)

	authority = gsub(authority, "^%[[^%]]+%]", function(v)
		-- ipv6
		uri.host = v
		return ""
	end)

	authority = gsub(authority, ":([^:]*)$", function(v)
		uri.port = tonumber(v)
		return ""
	end)

	if authority ~= "" and not uri.host then
		uri.host = lower(authority)
	end

	if uri.userinfo then
		local userinfo = uri.userinfo

		userinfo = gsub(userinfo, ":([^:]*)$", function(v)
				uri.password = v
				return ""
		end)

		uri.user = userinfo
	end

	return authority
end

XRF.URI = {
	build = build,
	parse = parse,
	encode = encode,
	decode = decode
}

-----------------------------------------------------------------------------------
--- some tests 
-----------------------------------------------------------------------------------

local map = {}
XRF.parse("pos","1,2,3",map)
print(map.pos.z)
local URI = XRF.URI.parse("https://foo.com/flop.glb#foo=1&bar=flop")
dump(URI)
dump(URI.frag.foo)
dump(URI.frag.bar)
