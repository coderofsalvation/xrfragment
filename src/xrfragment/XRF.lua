-- SPDX-License-Identifier: MPL-2.0        
-- Copyright (c) 2023 Leon van Kammen/NLNET 

local XRF = {}

XRF.ASSET = 1
XRF.ASSET_OBJ = 2
XRF.PV_OVERRIDE = 4
XRF.QUERY_OPERATOR = 8
XRF.PROMPT = 16
XRF.ROUNDROBIN = 32
XRF.NAVIGATOR = 64
XRF.T_COLOR = 128
XRF.T_INT = 256
XRF.T_FLOAT = 512
XRF.T_VECTOR2 = 1024
XRF.T_VECTOR3 = 2048
XRF.T_URL = 4096
XRF.T_PREDEFINED_VIEW = 8192
XRF.T_STRING = 16384
XRF.T_STRING_OBJ = 32768

XRF.isColor = string.match("#([A-fa-f0-9]{6}|[A-fa-f0-9]{3})", "")
XRF.isInt = string.match("^[0-9]+$", "")
XRF.isFloat = string.match("^[0-9]+%.[0-9]+$", "")
XRF.isVector = string.match("([,]+|%w)", "")
XRF.isUrl = string.match("(://)?..*", "")
XRF.isUrlOrPretypedView = string.match("(^#|://)?..*", "")
XRF.isString = string.match(".+", "")

function XRF.new(_fragment, _flags)
  local self = {}
  self.fragment = _fragment
  self.flags = _flags
  self.x = 0
  self.y = 0
  self.z = 0
  self.color = ""
  self.string = ""
  self.int = 0
  self.float = 0
  self.args = {}
  self.query = {}
  function self.is(flag)
		print(flag)
		print(self.flags)
    return self.flags & flag ~= 0
  end
  return self
end

function XRF.set(flag, flags)
  return flags | flag
end

function XRF.unset(flag, flags)
  return flags & ~flag 
end

function XRF.validate(self, value)
  XRF.guessType(self, value)
  if string.len(value:split("|")) then
    self.args = {}
    for i, val in ipairs(value:split("|")) do
      local xrf = XRF.new(self.fragment, self.flags)
      XRF.guessType(xrf, val)
      table.insert(self.args, xrf)
    end
  end
  if self.fragment == "q" then
    --self.query = (new Query(value)):get()
  end
  if not isinstance(self.args, 'array') then
    if self:is(XRF.T_VECTOR3) and (not isinstance(self.x, 'number') or not isinstance(self.y, 'number') or not isinstance(self.z, 'number')) then
      ok = false
    end
    if self:is(XRF.T_VECTOR2) and (not isinstance(self.x, 'number') or not isinstance(self.y, 'number')) then
      ok = false
    end
    if self:is(XRF.T_INT) and not isinstance(self.int, 'number') then
      ok = false
    end
  end
  return ok
end

function XRF.guessType(v, str)
  v.string = str
  if string.len(str:split(",")) > 1 then
    local xyz = string.split(str, ",")
    if #xyz > 0 then
      v.x = tonumber(xyz[1])
    end
    if #xyz > 1 then
      v.y = tonumber(xyz[2])
    end
    if #xyz > 2 then
      v.z = tonumber(xyz[3])
    end
  end
  if XRF.isColor:match(str) then
    v.color = str
  end
  if XRF.isFloat:match(str) then
    v.float = tonumber(str)
  end
  if XRF.isInt:match(str) then
    v.int  = tonumber(str)
  end
end

x = XRF.new("pos", XRF.ASSET | XRF.ROUNDROBIN )
print( "roundrobin: " .. ( x.is( XRF.ROUNDROBIN ) and "ja" or "nee"  ) )

return XRF
