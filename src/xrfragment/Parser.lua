-- SPDX-License-Identifier: MPL-2.0         
-- Copyright (c) 2023 Leon van Kammen/NLNET 

XF = {}

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

function XF.parse(key, value, resultMap)
  local frag = {}
  frag["prio"] = "^%d+$"
  frag["pos"]  = "(%d+),(%d+),(%d+)"
  frag["q"]    = ".+"

  if frag[key] ~= nil then
    local regex = frag[key]
    if string.match(value, regex) then
      local v = Value:new()
      XF.guessType(v, value)
      if string.find(value, "|") then
        v.args = {}
        local args = split(value, "|")
        for k, arg in ipairs(args) do
          local x = Value:new()
          XF.guessType(x, arg)
          table.insert(v.args, x)
        end
      end
      resultMap[key] = v;
    else
      error("[ i ] fragment '"..key.."' has incompatible value ("..value..")")
      return false
    end
  else
    error("[ i ] fragment '"..key.."' does not exist or has no type defined (yet)")
    return false
  end
  return true
end

function XF.guessType(v, str)
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

local map = {}
XF.parse("pos","1,2,3",map)
print(map.pos.z)
XF.parse("pos","1,2,3|3,4,5",map)
print(map.pos.args[2].z)
