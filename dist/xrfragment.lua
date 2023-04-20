local _hx_hidden = {__id__=true, hx__closures=true, super=true, prototype=true, __fields__=true, __ifields__=true, __class__=true, __properties__=true, __fields__=true, __name__=true}

_hx_array_mt = {
    __newindex = function(t,k,v)
        local len = t.length
        t.length =  k >= len and (k + 1) or len
        rawset(t,k,v)
    end
}

function _hx_is_array(o)
    return type(o) == "table"
        and o.__enum__ == nil
        and getmetatable(o) == _hx_array_mt
end



function _hx_tab_array(tab, length)
    tab.length = length
    return setmetatable(tab, _hx_array_mt)
end



function _hx_print_class(obj, depth)
    local first = true
    local result = ''
    for k,v in pairs(obj) do
        if _hx_hidden[k] == nil then
            if first then
                first = false
            else
                result = result .. ', '
            end
            if _hx_hidden[k] == nil then
                result = result .. k .. ':' .. _hx_tostring(v, depth+1)
            end
        end
    end
    return '{ ' .. result .. ' }'
end

function _hx_print_enum(o, depth)
    if o.length == 2 then
        return o[0]
    else
        local str = o[0] .. "("
        for i = 2, (o.length-1) do
            if i ~= 2 then
                str = str .. "," .. _hx_tostring(o[i], depth+1)
            else
                str = str .. _hx_tostring(o[i], depth+1)
            end
        end
        return str .. ")"
    end
end

function _hx_tostring(obj, depth)
    if depth == nil then
        depth = 0
    elseif depth > 5 then
        return "<...>"
    end

    local tstr = _G.type(obj)
    if tstr == "string" then return obj
    elseif tstr == "nil" then return "null"
    elseif tstr == "number" then
        if obj == _G.math.POSITIVE_INFINITY then return "Infinity"
        elseif obj == _G.math.NEGATIVE_INFINITY then return "-Infinity"
        elseif obj == 0 then return "0"
        elseif obj ~= obj then return "NaN"
        else return _G.tostring(obj)
        end
    elseif tstr == "boolean" then return _G.tostring(obj)
    elseif tstr == "userdata" then
        local mt = _G.getmetatable(obj)
        if mt ~= nil and mt.__tostring ~= nil then
            return _G.tostring(obj)
        else
            return "<userdata>"
        end
    elseif tstr == "function" then return "<function>"
    elseif tstr == "thread" then return "<thread>"
    elseif tstr == "table" then
        if obj.__enum__ ~= nil then
            return _hx_print_enum(obj, depth)
        elseif obj.toString ~= nil and not _hx_is_array(obj) then return obj:toString()
        elseif _hx_is_array(obj) then
            if obj.length > 5 then
                return "[...]"
            else
                local str = ""
                for i=0, (obj.length-1) do
                    if i == 0 then
                        str = str .. _hx_tostring(obj[i], depth+1)
                    else
                        str = str .. "," .. _hx_tostring(obj[i], depth+1)
                    end
                end
                return "[" .. str .. "]"
            end
        elseif obj.__class__ ~= nil then
            return _hx_print_class(obj, depth)
        else
            local buffer = {}
            local ref = obj
            if obj.__fields__ ~= nil then
                ref = obj.__fields__
            end
            for k,v in pairs(ref) do
                if _hx_hidden[k] == nil then
                    _G.table.insert(buffer, _hx_tostring(k, depth+1) .. ' : ' .. _hx_tostring(obj[k], depth+1))
                end
            end

            return "{ " .. table.concat(buffer, ", ") .. " }"
        end
    else
        _G.error("Unknown Lua type", 0)
        return ""
    end
end

function _hx_error(obj)
    if obj.value then
        _G.print("runtime error:\n " .. _hx_tostring(obj.value));
    else
        _G.print("runtime error:\n " .. tostring(obj));
    end

    if _G.debug and _G.debug.traceback then
        _G.print(debug.traceback());
    end
end


local function _hx_obj_newindex(t,k,v)
    t.__fields__[k] = true
    rawset(t,k,v)
end

local _hx_obj_mt = {__newindex=_hx_obj_newindex, __tostring=_hx_tostring}

local function _hx_a(...)
  local __fields__ = {};
  local ret = {__fields__ = __fields__};
  local max = select('#',...);
  local tab = {...};
  local cur = 1;
  while cur < max do
    local v = tab[cur];
    __fields__[v] = true;
    ret[v] = tab[cur+1];
    cur = cur + 2
  end
  return setmetatable(ret, _hx_obj_mt)
end

local function _hx_e()
  return setmetatable({__fields__ = {}}, _hx_obj_mt)
end

local function _hx_o(obj)
  return setmetatable(obj, _hx_obj_mt)
end

local function _hx_new(prototype)
  return setmetatable({__fields__ = {}}, {__newindex=_hx_obj_newindex, __index=prototype, __tostring=_hx_tostring})
end

function _hx_field_arr(obj)
    res = {}
    idx = 0
    if obj.__fields__ ~= nil then
        obj = obj.__fields__
    end
    for k,v in pairs(obj) do
        if _hx_hidden[k] == nil then
            res[idx] = k
            idx = idx + 1
        end
    end
    return _hx_tab_array(res, idx)
end

local _hxClasses = {}
local Int = _hx_e();
local Dynamic = _hx_e();
local Float = _hx_e();
local Bool = _hx_e();
local Class = _hx_e();
local Enum = _hx_e();

local _hx_exports = _hx_exports or {}
_hx_exports["xrfragment"] = _hx_exports["xrfragment"] or _hx_e()
local Array = _hx_e()
__lua_lib_lrexlib_Rex = _G.require("rex_pcre")
__lua_lib_luautf8_Utf8 = _G.require("lua-utf8")
local EReg = _hx_e()
local Math = _hx_e()
local Reflect = _hx_e()
local String = _hx_e()
local Std = _hx_e()
local StringTools = _hx_e()
__haxe_IMap = _hx_e()
__haxe_Exception = _hx_e()
__haxe_Log = _hx_e()
__haxe_NativeStackTrace = _hx_e()
__haxe_ValueException = _hx_e()
__haxe_ds_StringMap = _hx_e()
__haxe_iterators_ArrayIterator = _hx_e()
__haxe_iterators_ArrayKeyValueIterator = _hx_e()
__lua_Boot = _hx_e()
__lua_UserData = _hx_e()
__lua_Lib = _hx_e()
__lua_Thread = _hx_e()
__xrfragment_Parser = _hx_e()
__xrfragment_Query = _hx_e()
__xrfragment_URI = _hx_e()
__xrfragment_XRF = _hx_e()

local _hx_bind, _hx_bit, _hx_staticToInstance, _hx_funcToField, _hx_maxn, _hx_print, _hx_apply_self, _hx_box_mr, _hx_bit_clamp, _hx_table, _hx_bit_raw
local _hx_pcall_default = {};
local _hx_pcall_break = {};

Array.new = function() 
  local self = _hx_new(Array.prototype)
  Array.super(self)
  return self
end
Array.super = function(self) 
  _hx_tab_array(self, 0);
end
Array.__name__ = true
Array.prototype = _hx_e();
Array.prototype.concat = function(self,a) 
  local _g = _hx_tab_array({}, 0);
  local _g1 = 0;
  local _g2 = self;
  while (_g1 < _g2.length) do 
    local i = _g2[_g1];
    _g1 = _g1 + 1;
    _g:push(i);
  end;
  local ret = _g;
  local _g = 0;
  while (_g < a.length) do 
    local i = a[_g];
    _g = _g + 1;
    ret:push(i);
  end;
  do return ret end
end
Array.prototype.join = function(self,sep) 
  local tbl = ({});
  local _g_current = 0;
  local _g_array = self;
  while (_g_current < _g_array.length) do 
    _g_current = _g_current + 1;
    local i = _g_array[_g_current - 1];
    _G.table.insert(tbl, Std.string(i));
  end;
  do return _G.table.concat(tbl, sep) end
end
Array.prototype.pop = function(self) 
  if (self.length == 0) then 
    do return nil end;
  end;
  local ret = self[self.length - 1];
  self[self.length - 1] = nil;
  self.length = self.length - 1;
  do return ret end
end
Array.prototype.push = function(self,x) 
  self[self.length] = x;
  do return self.length end
end
Array.prototype.reverse = function(self) 
  local tmp;
  local i = 0;
  while (i < Std.int(self.length / 2)) do 
    tmp = self[i];
    self[i] = self[(self.length - i) - 1];
    self[(self.length - i) - 1] = tmp;
    i = i + 1;
  end;
end
Array.prototype.shift = function(self) 
  if (self.length == 0) then 
    do return nil end;
  end;
  local ret = self[0];
  if (self.length == 1) then 
    self[0] = nil;
  else
    if (self.length > 1) then 
      self[0] = self[1];
      _G.table.remove(self, 1);
    end;
  end;
  local tmp = self;
  tmp.length = tmp.length - 1;
  do return ret end
end
Array.prototype.slice = function(self,pos,_end) 
  if ((_end == nil) or (_end > self.length)) then 
    _end = self.length;
  else
    if (_end < 0) then 
      _end = _G.math.fmod((self.length - (_G.math.fmod(-_end, self.length))), self.length);
    end;
  end;
  if (pos < 0) then 
    pos = _G.math.fmod((self.length - (_G.math.fmod(-pos, self.length))), self.length);
  end;
  if ((pos > _end) or (pos > self.length)) then 
    do return _hx_tab_array({}, 0) end;
  end;
  local ret = _hx_tab_array({}, 0);
  local _g = pos;
  local _g1 = _end;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    ret:push(self[i]);
  end;
  do return ret end
end
Array.prototype.sort = function(self,f) 
  local i = 0;
  local l = self.length;
  while (i < l) do 
    local swap = false;
    local j = 0;
    local max = (l - i) - 1;
    while (j < max) do 
      if (f(self[j], self[j + 1]) > 0) then 
        local tmp = self[j + 1];
        self[j + 1] = self[j];
        self[j] = tmp;
        swap = true;
      end;
      j = j + 1;
    end;
    if (not swap) then 
      break;
    end;
    i = i + 1;
  end;
end
Array.prototype.splice = function(self,pos,len) 
  if ((len < 0) or (pos > self.length)) then 
    do return _hx_tab_array({}, 0) end;
  else
    if (pos < 0) then 
      pos = self.length - (_G.math.fmod(-pos, self.length));
    end;
  end;
  len = Math.min(len, self.length - pos);
  local ret = _hx_tab_array({}, 0);
  local _g = pos;
  local _g1 = pos + len;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    ret:push(self[i]);
    self[i] = self[i + len];
  end;
  local _g = pos + len;
  local _g1 = self.length;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    self[i] = self[i + len];
  end;
  local tmp = self;
  tmp.length = tmp.length - len;
  do return ret end
end
Array.prototype.toString = function(self) 
  local tbl = ({});
  _G.table.insert(tbl, "[");
  _G.table.insert(tbl, self:join(","));
  _G.table.insert(tbl, "]");
  do return _G.table.concat(tbl, "") end
end
Array.prototype.unshift = function(self,x) 
  local len = self.length;
  local _g = 0;
  local _g1 = len;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    self[len - i] = self[(len - i) - 1];
  end;
  self[0] = x;
end
Array.prototype.insert = function(self,pos,x) 
  if (pos > self.length) then 
    pos = self.length;
  end;
  if (pos < 0) then 
    pos = self.length + pos;
    if (pos < 0) then 
      pos = 0;
    end;
  end;
  local cur_len = self.length;
  while (cur_len > pos) do 
    self[cur_len] = self[cur_len - 1];
    cur_len = cur_len - 1;
  end;
  self[pos] = x;
end
Array.prototype.remove = function(self,x) 
  local _g = 0;
  local _g1 = self.length;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    if (self[i] == x) then 
      local _g = i;
      local _g1 = self.length - 1;
      while (_g < _g1) do 
        _g = _g + 1;
        local j = _g - 1;
        self[j] = self[j + 1];
      end;
      self[self.length - 1] = nil;
      self.length = self.length - 1;
      do return true end;
    end;
  end;
  do return false end
end
Array.prototype.contains = function(self,x) 
  local _g = 0;
  local _g1 = self.length;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    if (self[i] == x) then 
      do return true end;
    end;
  end;
  do return false end
end
Array.prototype.indexOf = function(self,x,fromIndex) 
  local _end = self.length;
  if (fromIndex == nil) then 
    fromIndex = 0;
  else
    if (fromIndex < 0) then 
      fromIndex = self.length + fromIndex;
      if (fromIndex < 0) then 
        fromIndex = 0;
      end;
    end;
  end;
  local _g = fromIndex;
  local _g1 = _end;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    if (x == self[i]) then 
      do return i end;
    end;
  end;
  do return -1 end
end
Array.prototype.lastIndexOf = function(self,x,fromIndex) 
  if ((fromIndex == nil) or (fromIndex >= self.length)) then 
    fromIndex = self.length - 1;
  else
    if (fromIndex < 0) then 
      fromIndex = self.length + fromIndex;
      if (fromIndex < 0) then 
        do return -1 end;
      end;
    end;
  end;
  local i = fromIndex;
  while (i >= 0) do 
    if (self[i] == x) then 
      do return i end;
    else
      i = i - 1;
    end;
  end;
  do return -1 end
end
Array.prototype.copy = function(self) 
  local _g = _hx_tab_array({}, 0);
  local _g1 = 0;
  local _g2 = self;
  while (_g1 < _g2.length) do 
    local i = _g2[_g1];
    _g1 = _g1 + 1;
    _g:push(i);
  end;
  do return _g end
end
Array.prototype.map = function(self,f) 
  local _g = _hx_tab_array({}, 0);
  local _g1 = 0;
  local _g2 = self;
  while (_g1 < _g2.length) do 
    local i = _g2[_g1];
    _g1 = _g1 + 1;
    _g:push(f(i));
  end;
  do return _g end
end
Array.prototype.filter = function(self,f) 
  local _g = _hx_tab_array({}, 0);
  local _g1 = 0;
  local _g2 = self;
  while (_g1 < _g2.length) do 
    local i = _g2[_g1];
    _g1 = _g1 + 1;
    if (f(i)) then 
      _g:push(i);
    end;
  end;
  do return _g end
end
Array.prototype.iterator = function(self) 
  do return __haxe_iterators_ArrayIterator.new(self) end
end
Array.prototype.keyValueIterator = function(self) 
  do return __haxe_iterators_ArrayKeyValueIterator.new(self) end
end
Array.prototype.resize = function(self,len) 
  if (self.length < len) then 
    self.length = len;
  else
    if (self.length > len) then 
      local _g = len;
      local _g1 = self.length;
      while (_g < _g1) do 
        _g = _g + 1;
        local i = _g - 1;
        self[i] = nil;
      end;
      self.length = len;
    end;
  end;
end

Array.prototype.__class__ =  Array

EReg.new = function(r,opt) 
  local self = _hx_new(EReg.prototype)
  EReg.super(self,r,opt)
  return self
end
EReg.super = function(self,r,opt) 
  local ropt = 0;
  local _g = 0;
  local _g1 = __lua_lib_luautf8_Utf8.len(opt);
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    local _g = __lua_lib_luautf8_Utf8.sub(opt, i + 1, i + 1);
    if (_g) == "g" then 
      self.global = true;
    elseif (_g) == "i" then 
      ropt = _hx_bit.bor(ropt,EReg.FLAGS.CASELESS);
    elseif (_g) == "m" then 
      ropt = _hx_bit.bor(ropt,EReg.FLAGS.MULTILINE);
    elseif (_g) == "s" then 
      ropt = _hx_bit.bor(ropt,EReg.FLAGS.DOTALL);else end;
  end;
  ropt = _hx_bit.bor(ropt,EReg.FLAGS.UTF8);
  ropt = _hx_bit.bor(ropt,EReg.FLAGS.UCP);
  if (self.global == nil) then 
    self.global = false;
  end;
  self.r = __lua_lib_lrexlib_Rex.new(r, ropt);
end
EReg.__name__ = true
EReg.prototype = _hx_e();
EReg.prototype.match = function(self,s) 
  if (s == nil) then 
    do return false end;
  else
    self.m = _hx_table.pack(self.r:exec(s, 1));
    self.s = s;
    do return self.m[1] ~= nil end;
  end;
end
EReg.prototype.split = function(self,s) 
  if (self.global) then 
    do return __lua_Lib.fillArray(_hx_wrap_if_string_field(__lua_lib_lrexlib_Rex,'split')(s, self.r)) end;
  else
    local d = "#__delim__#";
    do return __lua_Lib.fillArray(_hx_wrap_if_string_field(__lua_lib_lrexlib_Rex,'split')(self:replace(s, d), d)) end;
  end;
end
EReg.prototype.replace = function(self,s,by) 
  local idx = 1;
  local ret = _hx_tab_array({}, 0);
  while (idx ~= nil) do 
    local newidx = 0;
    if (__lua_lib_luautf8_Utf8.len("$$") > 0) then 
      newidx = __lua_lib_luautf8_Utf8.find(by, "$$", idx, true);
    else
      if (idx >= __lua_lib_luautf8_Utf8.len(by)) then 
        newidx = nil;
      else
        newidx = idx + 1;
      end;
    end;
    if (newidx ~= nil) then 
      local match = __lua_lib_luautf8_Utf8.sub(by, idx, newidx - 1);
      ret:push(match);
      idx = newidx + __lua_lib_luautf8_Utf8.len("$$");
    else
      ret:push(__lua_lib_luautf8_Utf8.sub(by, idx, __lua_lib_luautf8_Utf8.len(by)));
      idx = nil;
    end;
  end;
  local chunks = ret;
  local _g = _hx_tab_array({}, 0);
  local _g1 = 0;
  while (_g1 < chunks.length) do 
    local chunk = chunks[_g1];
    _g1 = _g1 + 1;
    _g:push(__lua_lib_lrexlib_Rex.gsub(chunk, "\\$(\\d)", "%%%1", 1));
  end;
  chunks = _g;
  by = chunks:join("$");
  do return __lua_lib_lrexlib_Rex.gsub(s, self.r, by, (function() 
    local _hx_1
    if (self.global) then 
    _hx_1 = nil; else 
    _hx_1 = 1; end
    return _hx_1
  end )()) end
end

EReg.prototype.__class__ =  EReg

Math.new = {}
Math.__name__ = true
Math.isNaN = function(f) 
  do return f ~= f end;
end
Math.isFinite = function(f) 
  if (f > -_G.math.huge) then 
    do return f < _G.math.huge end;
  else
    do return false end;
  end;
end
Math.min = function(a,b) 
  if (Math.isNaN(a) or Math.isNaN(b)) then 
    do return (0/0) end;
  else
    do return _G.math.min(a, b) end;
  end;
end

Reflect.new = {}
Reflect.__name__ = true
Reflect.field = function(o,field) 
  if (_G.type(o) == "string") then 
    if (field == "length") then 
      do return _hx_wrap_if_string_field(o,'length') end;
    else
      do return String.prototype[field] end;
    end;
  else
    local _hx_status, _hx_result = pcall(function() 
    
        do return o[field] end;
      return _hx_pcall_default
    end)
    if not _hx_status and _hx_result == "_hx_pcall_break" then
    elseif not _hx_status then 
      local _g = _hx_result;
      do return nil end;
    elseif _hx_result ~= _hx_pcall_default then
      return _hx_result
    end;
  end;
end
Reflect.fields = function(o) 
  if (_G.type(o) == "string") then 
    do return Reflect.fields(String.prototype) end;
  else
    do return _hx_field_arr(o) end;
  end;
end
Reflect.deleteField = function(o,field) 
  if (not ((function() 
    local _hx_1
    if ((_G.type(o) == "string") and ((String.prototype[field] ~= nil) or (field == "length"))) then 
    _hx_1 = true; elseif (o.__fields__ ~= nil) then 
    _hx_1 = o.__fields__[field] ~= nil; else 
    _hx_1 = o[field] ~= nil; end
    return _hx_1
  end )())) then 
    do return false end;
  end;
  o[field] = nil;
  o.__fields__[field] = nil;
  do return true end;
end

String.new = function(string) 
  local self = _hx_new(String.prototype)
  String.super(self,string)
  self = string
  return self
end
String.super = function(self,string) 
end
String.__name__ = true
String.__index = function(s,k) 
  if (k == "length") then 
    do return __lua_lib_luautf8_Utf8.len(s) end;
  else
    local o = String.prototype;
    local field = k;
    if ((function() 
      local _hx_1
      if ((_G.type(o) == "string") and ((String.prototype[field] ~= nil) or (field == "length"))) then 
      _hx_1 = true; elseif (o.__fields__ ~= nil) then 
      _hx_1 = o.__fields__[field] ~= nil; else 
      _hx_1 = o[field] ~= nil; end
      return _hx_1
    end )()) then 
      do return String.prototype[k] end;
    else
      if (String.__oldindex ~= nil) then 
        if (_G.type(String.__oldindex) == "function") then 
          do return String.__oldindex(s, k) end;
        else
          if (_G.type(String.__oldindex) == "table") then 
            do return String.__oldindex[k] end;
          end;
        end;
        do return nil end;
      else
        do return nil end;
      end;
    end;
  end;
end
String.indexOfEmpty = function(s,startIndex) 
  local length = __lua_lib_luautf8_Utf8.len(s);
  if (startIndex < 0) then 
    startIndex = length + startIndex;
    if (startIndex < 0) then 
      startIndex = 0;
    end;
  end;
  if (startIndex > length) then 
    do return length end;
  else
    do return startIndex end;
  end;
end
String.fromCharCode = function(code) 
  do return __lua_lib_luautf8_Utf8.char(code) end;
end
String.prototype = _hx_e();
String.prototype.toUpperCase = function(self) 
  do return __lua_lib_luautf8_Utf8.upper(self) end
end
String.prototype.toLowerCase = function(self) 
  do return __lua_lib_luautf8_Utf8.lower(self) end
end
String.prototype.indexOf = function(self,str,startIndex) 
  if (startIndex == nil) then 
    startIndex = 1;
  else
    startIndex = startIndex + 1;
  end;
  if (str == "") then 
    do return String.indexOfEmpty(self, startIndex - 1) end;
  end;
  local r = __lua_lib_luautf8_Utf8.find(self, str, startIndex, true);
  if ((r ~= nil) and (r > 0)) then 
    do return r - 1 end;
  else
    do return -1 end;
  end;
end
String.prototype.lastIndexOf = function(self,str,startIndex) 
  local ret = -1;
  if (startIndex == nil) then 
    startIndex = __lua_lib_luautf8_Utf8.len(self);
  end;
  while (true) do 
    local startIndex1 = ret + 1;
    if (startIndex1 == nil) then 
      startIndex1 = 1;
    else
      startIndex1 = startIndex1 + 1;
    end;
    local p;
    if (str == "") then 
      p = String.indexOfEmpty(self, startIndex1 - 1);
    else
      local r = __lua_lib_luautf8_Utf8.find(self, str, startIndex1, true);
      p = (function() 
        local _hx_1
        if ((r ~= nil) and (r > 0)) then 
        _hx_1 = r - 1; else 
        _hx_1 = -1; end
        return _hx_1
      end )();
    end;
    if (((p == -1) or (p > startIndex)) or (p == ret)) then 
      break;
    end;
    ret = p;
  end;
  do return ret end
end
String.prototype.split = function(self,delimiter) 
  local idx = 1;
  local ret = _hx_tab_array({}, 0);
  while (idx ~= nil) do 
    local newidx = 0;
    if (__lua_lib_luautf8_Utf8.len(delimiter) > 0) then 
      newidx = __lua_lib_luautf8_Utf8.find(self, delimiter, idx, true);
    else
      if (idx >= __lua_lib_luautf8_Utf8.len(self)) then 
        newidx = nil;
      else
        newidx = idx + 1;
      end;
    end;
    if (newidx ~= nil) then 
      local match = __lua_lib_luautf8_Utf8.sub(self, idx, newidx - 1);
      ret:push(match);
      idx = newidx + __lua_lib_luautf8_Utf8.len(delimiter);
    else
      ret:push(__lua_lib_luautf8_Utf8.sub(self, idx, __lua_lib_luautf8_Utf8.len(self)));
      idx = nil;
    end;
  end;
  do return ret end
end
String.prototype.toString = function(self) 
  do return self end
end
String.prototype.substring = function(self,startIndex,endIndex) 
  if (endIndex == nil) then 
    endIndex = __lua_lib_luautf8_Utf8.len(self);
  end;
  if (endIndex < 0) then 
    endIndex = 0;
  end;
  if (startIndex < 0) then 
    startIndex = 0;
  end;
  if (endIndex < startIndex) then 
    do return __lua_lib_luautf8_Utf8.sub(self, endIndex + 1, startIndex) end;
  else
    do return __lua_lib_luautf8_Utf8.sub(self, startIndex + 1, endIndex) end;
  end;
end
String.prototype.charAt = function(self,index) 
  do return __lua_lib_luautf8_Utf8.sub(self, index + 1, index + 1) end
end
String.prototype.charCodeAt = function(self,index) 
  do return __lua_lib_luautf8_Utf8.byte(self, index + 1) end
end
String.prototype.substr = function(self,pos,len) 
  if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(self)))) then 
    len = __lua_lib_luautf8_Utf8.len(self);
  else
    if (len < 0) then 
      len = __lua_lib_luautf8_Utf8.len(self) + len;
    end;
  end;
  if (pos < 0) then 
    pos = __lua_lib_luautf8_Utf8.len(self) + pos;
  end;
  if (pos < 0) then 
    pos = 0;
  end;
  do return __lua_lib_luautf8_Utf8.sub(self, pos + 1, pos + len) end
end

String.prototype.__class__ =  String

Std.new = {}
Std.__name__ = true
Std.string = function(s) 
  do return _hx_tostring(s, 0) end;
end
Std.int = function(x) 
  if (not Math.isFinite(x) or Math.isNaN(x)) then 
    do return 0 end;
  else
    do return _hx_bit_clamp(x) end;
  end;
end
Std.parseInt = function(x) 
  if (x == nil) then 
    do return nil end;
  end;
  local hexMatch = _G.string.match(x, "^[ \t\r\n]*([%-+]*0[xX][%da-fA-F]*)");
  if (hexMatch ~= nil) then 
    local sign;
    local _g = __lua_lib_luautf8_Utf8.byte(hexMatch, 1);
    if (_g) == 43 then 
      sign = 1;
    elseif (_g) == 45 then 
      sign = -1;else
    sign = 0; end;
    local pos = (function() 
      local _hx_1
      if (sign == 0) then 
      _hx_1 = 2; else 
      _hx_1 = 3; end
      return _hx_1
    end )();
    local len = nil;
    if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(hexMatch)))) then 
      len = __lua_lib_luautf8_Utf8.len(hexMatch);
    else
      if (len < 0) then 
        len = __lua_lib_luautf8_Utf8.len(hexMatch) + len;
      end;
    end;
    if (pos < 0) then 
      pos = __lua_lib_luautf8_Utf8.len(hexMatch) + pos;
    end;
    if (pos < 0) then 
      pos = 0;
    end;
    do return (function() 
      local _hx_2
      if (sign == -1) then 
      _hx_2 = -1; else 
      _hx_2 = 1; end
      return _hx_2
    end )() * _G.tonumber(__lua_lib_luautf8_Utf8.sub(hexMatch, pos + 1, pos + len), 16) end;
  else
    local intMatch = _G.string.match(x, "^ *[%-+]?%d*");
    if (intMatch ~= nil) then 
      do return _G.tonumber(intMatch) end;
    else
      do return nil end;
    end;
  end;
end
Std.parseFloat = function(x) 
  if ((x == nil) or (x == "")) then 
    do return (0/0) end;
  end;
  local digitMatch = _G.string.match(x, "^ *[%.%-+]?[0-9]%d*");
  if (digitMatch == nil) then 
    do return (0/0) end;
  end;
  local pos = __lua_lib_luautf8_Utf8.len(digitMatch);
  local len = nil;
  if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(x)))) then 
    len = __lua_lib_luautf8_Utf8.len(x);
  else
    if (len < 0) then 
      len = __lua_lib_luautf8_Utf8.len(x) + len;
    end;
  end;
  if (pos < 0) then 
    pos = __lua_lib_luautf8_Utf8.len(x) + pos;
  end;
  if (pos < 0) then 
    pos = 0;
  end;
  x = __lua_lib_luautf8_Utf8.sub(x, pos + 1, pos + len);
  local decimalMatch = _G.string.match(x, "^%.%d*");
  if (decimalMatch == nil) then 
    decimalMatch = "";
  end;
  local pos = __lua_lib_luautf8_Utf8.len(decimalMatch);
  local len = nil;
  if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(x)))) then 
    len = __lua_lib_luautf8_Utf8.len(x);
  else
    if (len < 0) then 
      len = __lua_lib_luautf8_Utf8.len(x) + len;
    end;
  end;
  if (pos < 0) then 
    pos = __lua_lib_luautf8_Utf8.len(x) + pos;
  end;
  if (pos < 0) then 
    pos = 0;
  end;
  x = __lua_lib_luautf8_Utf8.sub(x, pos + 1, pos + len);
  local eMatch = _G.string.match(x, "^[eE][+%-]?%d+");
  if (eMatch == nil) then 
    eMatch = "";
  end;
  local result = _G.tonumber(Std.string(Std.string(digitMatch) .. Std.string(decimalMatch)) .. Std.string(eMatch));
  if (result ~= nil) then 
    do return result end;
  else
    do return (0/0) end;
  end;
end

StringTools.new = {}
StringTools.__name__ = true
StringTools.urlDecode = function(s) 
  s = _G.string.gsub(s, "+", " ");
  s = _G.string.gsub(s, "%%(%x%x)", function(h) 
    do return _G.string.char(_G.tonumber(h, 16)) end;
  end);
  s = _G.string.gsub(s, "\r\n", "\n");
  do return s end;
end
StringTools.isSpace = function(s,pos) 
  if (((__lua_lib_luautf8_Utf8.len(s) == 0) or (pos < 0)) or (pos >= __lua_lib_luautf8_Utf8.len(s))) then 
    do return false end;
  end;
  local c = __lua_lib_luautf8_Utf8.byte(s, pos + 1);
  if (not ((c > 8) and (c < 14))) then 
    do return c == 32 end;
  else
    do return true end;
  end;
end
StringTools.ltrim = function(s) 
  local l = __lua_lib_luautf8_Utf8.len(s);
  local r = 0;
  while ((r < l) and StringTools.isSpace(s, r)) do 
    r = r + 1;
  end;
  if (r > 0) then 
    local pos = r;
    local len = l - r;
    if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(s)))) then 
      len = __lua_lib_luautf8_Utf8.len(s);
    else
      if (len < 0) then 
        len = __lua_lib_luautf8_Utf8.len(s) + len;
      end;
    end;
    if (pos < 0) then 
      pos = __lua_lib_luautf8_Utf8.len(s) + pos;
    end;
    if (pos < 0) then 
      pos = 0;
    end;
    do return __lua_lib_luautf8_Utf8.sub(s, pos + 1, pos + len) end;
  else
    do return s end;
  end;
end
StringTools.rtrim = function(s) 
  local l = __lua_lib_luautf8_Utf8.len(s);
  local r = 0;
  while ((r < l) and StringTools.isSpace(s, (l - r) - 1)) do 
    r = r + 1;
  end;
  if (r > 0) then 
    local pos = 0;
    local len = l - r;
    if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(s)))) then 
      len = __lua_lib_luautf8_Utf8.len(s);
    else
      if (len < 0) then 
        len = __lua_lib_luautf8_Utf8.len(s) + len;
      end;
    end;
    if (pos < 0) then 
      pos = __lua_lib_luautf8_Utf8.len(s) + pos;
    end;
    if (pos < 0) then 
      pos = 0;
    end;
    do return __lua_lib_luautf8_Utf8.sub(s, pos + 1, pos + len) end;
  else
    do return s end;
  end;
end
StringTools.trim = function(s) 
  do return StringTools.ltrim(StringTools.rtrim(s)) end;
end
StringTools.replace = function(s,sub,by) 
  local idx = 1;
  local ret = _hx_tab_array({}, 0);
  while (idx ~= nil) do 
    local newidx = 0;
    if (__lua_lib_luautf8_Utf8.len(sub) > 0) then 
      newidx = __lua_lib_luautf8_Utf8.find(s, sub, idx, true);
    else
      if (idx >= __lua_lib_luautf8_Utf8.len(s)) then 
        newidx = nil;
      else
        newidx = idx + 1;
      end;
    end;
    if (newidx ~= nil) then 
      local match = __lua_lib_luautf8_Utf8.sub(s, idx, newidx - 1);
      ret:push(match);
      idx = newidx + __lua_lib_luautf8_Utf8.len(sub);
    else
      ret:push(__lua_lib_luautf8_Utf8.sub(s, idx, __lua_lib_luautf8_Utf8.len(s)));
      idx = nil;
    end;
  end;
  do return ret:join(by) end;
end

__haxe_IMap.new = {}
__haxe_IMap.__name__ = true

__haxe_Exception.new = function(message,previous,native) 
  local self = _hx_new(__haxe_Exception.prototype)
  __haxe_Exception.super(self,message,previous,native)
  return self
end
__haxe_Exception.super = function(self,message,previous,native) 
  self.__skipStack = 0;
  self.__exceptionMessage = message;
  self.__previousException = previous;
  if (native ~= nil) then 
    self.__nativeException = native;
    self.__nativeStack = __haxe_NativeStackTrace.exceptionStack();
  else
    self.__nativeException = self;
    self.__nativeStack = __haxe_NativeStackTrace.callStack();
    self.__skipStack = 1;
  end;
end
__haxe_Exception.__name__ = true
__haxe_Exception.thrown = function(value) 
  if (__lua_Boot.__instanceof(value, __haxe_Exception)) then 
    do return value:get_native() end;
  else
    local e = __haxe_ValueException.new(value);
    e.__skipStack = e.__skipStack + 1;
    do return e end;
  end;
end
__haxe_Exception.prototype = _hx_e();
__haxe_Exception.prototype.get_native = function(self) 
  do return self.__nativeException end
end

__haxe_Exception.prototype.__class__ =  __haxe_Exception

__haxe_Log.new = {}
__haxe_Log.__name__ = true
__haxe_Log.formatOutput = function(v,infos) 
  local str = Std.string(v);
  if (infos == nil) then 
    do return str end;
  end;
  local pstr = Std.string(Std.string(infos.fileName) .. Std.string(":")) .. Std.string(infos.lineNumber);
  if (infos.customParams ~= nil) then 
    local _g = 0;
    local _g1 = infos.customParams;
    while (_g < _g1.length) do 
      local v = _g1[_g];
      _g = _g + 1;
      str = Std.string(str) .. Std.string((Std.string(", ") .. Std.string(Std.string(v))));
    end;
  end;
  do return Std.string(Std.string(pstr) .. Std.string(": ")) .. Std.string(str) end;
end
__haxe_Log.trace = function(v,infos) 
  local str = __haxe_Log.formatOutput(v, infos);
  _hx_print(str);
end

__haxe_NativeStackTrace.new = {}
__haxe_NativeStackTrace.__name__ = true
__haxe_NativeStackTrace.saveStack = function(exception) 
end
__haxe_NativeStackTrace.callStack = function() 
  local _g = debug.traceback();
  if (_g == nil) then 
    do return _hx_tab_array({}, 0) end;
  else
    local s = _g;
    local idx = 1;
    local ret = _hx_tab_array({}, 0);
    while (idx ~= nil) do 
      local newidx = 0;
      if (__lua_lib_luautf8_Utf8.len("\n") > 0) then 
        newidx = __lua_lib_luautf8_Utf8.find(s, "\n", idx, true);
      else
        if (idx >= __lua_lib_luautf8_Utf8.len(s)) then 
          newidx = nil;
        else
          newidx = idx + 1;
        end;
      end;
      if (newidx ~= nil) then 
        local match = __lua_lib_luautf8_Utf8.sub(s, idx, newidx - 1);
        ret:push(match);
        idx = newidx + __lua_lib_luautf8_Utf8.len("\n");
      else
        ret:push(__lua_lib_luautf8_Utf8.sub(s, idx, __lua_lib_luautf8_Utf8.len(s)));
        idx = nil;
      end;
    end;
    do return ret:slice(3) end;
  end;
end
__haxe_NativeStackTrace.exceptionStack = function() 
  do return _hx_tab_array({}, 0) end;
end

__haxe_ValueException.new = function(value,previous,native) 
  local self = _hx_new(__haxe_ValueException.prototype)
  __haxe_ValueException.super(self,value,previous,native)
  return self
end
__haxe_ValueException.super = function(self,value,previous,native) 
  __haxe_Exception.super(self,Std.string(value),previous,native);
  self.value = value;
end
__haxe_ValueException.__name__ = true
__haxe_ValueException.prototype = _hx_e();

__haxe_ValueException.prototype.__class__ =  __haxe_ValueException
__haxe_ValueException.__super__ = __haxe_Exception
setmetatable(__haxe_ValueException.prototype,{__index=__haxe_Exception.prototype})

__haxe_ds_StringMap.new = {}
__haxe_ds_StringMap.__name__ = true
__haxe_ds_StringMap.__interfaces__ = {__haxe_IMap}

__haxe_iterators_ArrayIterator.new = function(array) 
  local self = _hx_new(__haxe_iterators_ArrayIterator.prototype)
  __haxe_iterators_ArrayIterator.super(self,array)
  return self
end
__haxe_iterators_ArrayIterator.super = function(self,array) 
  self.current = 0;
  self.array = array;
end
__haxe_iterators_ArrayIterator.__name__ = true
__haxe_iterators_ArrayIterator.prototype = _hx_e();
__haxe_iterators_ArrayIterator.prototype.hasNext = function(self) 
  do return self.current < self.array.length end
end
__haxe_iterators_ArrayIterator.prototype.next = function(self) 
  do return self.array[(function() 
  local _hx_obj = self;
  local _hx_fld = 'current';
  local _ = _hx_obj[_hx_fld];
  _hx_obj[_hx_fld] = _hx_obj[_hx_fld]  + 1;
   return _;
   end)()] end
end

__haxe_iterators_ArrayIterator.prototype.__class__ =  __haxe_iterators_ArrayIterator

__haxe_iterators_ArrayKeyValueIterator.new = function(array) 
  local self = _hx_new(__haxe_iterators_ArrayKeyValueIterator.prototype)
  __haxe_iterators_ArrayKeyValueIterator.super(self,array)
  return self
end
__haxe_iterators_ArrayKeyValueIterator.super = function(self,array) 
  self.array = array;
end
__haxe_iterators_ArrayKeyValueIterator.__name__ = true
__haxe_iterators_ArrayKeyValueIterator.prototype = _hx_e();

__haxe_iterators_ArrayKeyValueIterator.prototype.__class__ =  __haxe_iterators_ArrayKeyValueIterator

__lua_Boot.new = {}
__lua_Boot.__name__ = true
__lua_Boot.__instanceof = function(o,cl) 
  if (cl == nil) then 
    do return false end;
  end;
  local cl1 = cl;
  if (cl1) == Array then 
    do return __lua_Boot.isArray(o) end;
  elseif (cl1) == Bool then 
    do return _G.type(o) == "boolean" end;
  elseif (cl1) == Dynamic then 
    do return o ~= nil end;
  elseif (cl1) == Float then 
    do return _G.type(o) == "number" end;
  elseif (cl1) == Int then 
    if (_G.type(o) == "number") then 
      do return _hx_bit_clamp(o) == o end;
    else
      do return false end;
    end;
  elseif (cl1) == String then 
    do return _G.type(o) == "string" end;
  elseif (cl1) == _G.table then 
    do return _G.type(o) == "table" end;
  elseif (cl1) == __lua_Thread then 
    do return _G.type(o) == "thread" end;
  elseif (cl1) == __lua_UserData then 
    do return _G.type(o) == "userdata" end;else
  if (((o ~= nil) and (_G.type(o) == "table")) and (_G.type(cl) == "table")) then 
    local tmp;
    if (__lua_Boot.__instanceof(o, Array)) then 
      tmp = Array;
    else
      if (__lua_Boot.__instanceof(o, String)) then 
        tmp = String;
      else
        local cl = o.__class__;
        tmp = (function() 
          local _hx_1
          if (cl ~= nil) then 
          _hx_1 = cl; else 
          _hx_1 = nil; end
          return _hx_1
        end )();
      end;
    end;
    if (__lua_Boot.extendsOrImplements(tmp, cl)) then 
      do return true end;
    end;
    if ((function() 
      local _hx_2
      if (cl == Class) then 
      _hx_2 = o.__name__ ~= nil; else 
      _hx_2 = false; end
      return _hx_2
    end )()) then 
      do return true end;
    end;
    if ((function() 
      local _hx_3
      if (cl == Enum) then 
      _hx_3 = o.__ename__ ~= nil; else 
      _hx_3 = false; end
      return _hx_3
    end )()) then 
      do return true end;
    end;
    do return o.__enum__ == cl end;
  else
    do return false end;
  end; end;
end
__lua_Boot.isArray = function(o) 
  if (_G.type(o) == "table") then 
    if ((o.__enum__ == nil) and (_G.getmetatable(o) ~= nil)) then 
      do return _G.getmetatable(o).__index == Array.prototype end;
    else
      do return false end;
    end;
  else
    do return false end;
  end;
end
__lua_Boot.extendsOrImplements = function(cl1,cl2) 
  if ((cl1 == nil) or (cl2 == nil)) then 
    do return false end;
  else
    if (cl1 == cl2) then 
      do return true end;
    else
      if (cl1.__interfaces__ ~= nil) then 
        local intf = cl1.__interfaces__;
        local _g = 1;
        local _g1 = _hx_table.maxn(intf) + 1;
        while (_g < _g1) do 
          _g = _g + 1;
          local i = _g - 1;
          if (__lua_Boot.extendsOrImplements(intf[i], cl2)) then 
            do return true end;
          end;
        end;
      end;
    end;
  end;
  do return __lua_Boot.extendsOrImplements(cl1.__super__, cl2) end;
end

__lua_UserData.new = {}
__lua_UserData.__name__ = true

__lua_Lib.new = {}
__lua_Lib.__name__ = true
__lua_Lib.fillArray = function(itr) 
  local i = nil;
  local ret = _hx_tab_array({}, 0);
  while (true) do 
    i = itr();
    if (not (i ~= nil)) then 
      break;
    end;
    ret:push(i);
  end;
  do return ret end;
end

__lua_Thread.new = {}
__lua_Thread.__name__ = true

__xrfragment_Parser.new = {}
_hx_exports["xrfragment"]["Parser"] = __xrfragment_Parser
__xrfragment_Parser.__name__ = true
__xrfragment_Parser.parse = function(key,value,resultMap) 
  local Frag_h = ({});
  local value1 = _hx_bit.bor(__xrfragment_XRF.ASSET,__xrfragment_XRF.T_INT);
  if (value1 == nil) then 
    Frag_h.prio = __haxe_ds_StringMap.tnull;
  else
    Frag_h.prio = value1;
  end;
  local value1 = _hx_bit.bor(__xrfragment_XRF.ASSET,__xrfragment_XRF.T_PREDEFINED_VIEW);
  if (value1 == nil) then 
    Frag_h["#"] = __haxe_ds_StringMap.tnull;
  else
    Frag_h["#"] = value1;
  end;
  local value1 = _hx_bit.bor(__xrfragment_XRF.ASSET,__xrfragment_XRF.T_STRING);
  if (value1 == nil) then 
    Frag_h.class = __haxe_ds_StringMap.tnull;
  else
    Frag_h.class = value1;
  end;
  local value1 = _hx_bit.bor(__xrfragment_XRF.ASSET,__xrfragment_XRF.T_URL);
  if (value1 == nil) then 
    Frag_h.src = __haxe_ds_StringMap.tnull;
  else
    Frag_h.src = value1;
  end;
  local value1 = _hx_bit.bor(_hx_bit.bor(_hx_bit.bor(__xrfragment_XRF.PV_OVERRIDE,__xrfragment_XRF.ROUNDROBIN),__xrfragment_XRF.T_VECTOR3),__xrfragment_XRF.T_STRING_OBJ);
  if (value1 == nil) then 
    Frag_h.pos = __haxe_ds_StringMap.tnull;
  else
    Frag_h.pos = value1;
  end;
  local value1 = _hx_bit.bor(_hx_bit.bor(__xrfragment_XRF.ASSET,__xrfragment_XRF.T_URL),__xrfragment_XRF.T_PREDEFINED_VIEW);
  if (value1 == nil) then 
    Frag_h.href = __haxe_ds_StringMap.tnull;
  else
    Frag_h.href = value1;
  end;
  local value1 = _hx_bit.bor(__xrfragment_XRF.PV_OVERRIDE,__xrfragment_XRF.T_STRING);
  if (value1 == nil) then 
    Frag_h.q = __haxe_ds_StringMap.tnull;
  else
    Frag_h.q = value1;
  end;
  local value1 = _hx_bit.bor(_hx_bit.bor(_hx_bit.bor(__xrfragment_XRF.QUERY_OPERATOR,__xrfragment_XRF.PV_OVERRIDE),__xrfragment_XRF.ROUNDROBIN),__xrfragment_XRF.T_INT);
  if (value1 == nil) then 
    Frag_h.scale = __haxe_ds_StringMap.tnull;
  else
    Frag_h.scale = value1;
  end;
  local value1 = _hx_bit.bor(_hx_bit.bor(_hx_bit.bor(__xrfragment_XRF.QUERY_OPERATOR,__xrfragment_XRF.PV_OVERRIDE),__xrfragment_XRF.ROUNDROBIN),__xrfragment_XRF.T_VECTOR3);
  if (value1 == nil) then 
    Frag_h.rot = __haxe_ds_StringMap.tnull;
  else
    Frag_h.rot = value1;
  end;
  local value1 = _hx_bit.bor(_hx_bit.bor(_hx_bit.bor(__xrfragment_XRF.QUERY_OPERATOR,__xrfragment_XRF.PV_OVERRIDE),__xrfragment_XRF.ROUNDROBIN),__xrfragment_XRF.T_VECTOR3);
  if (value1 == nil) then 
    Frag_h.translate = __haxe_ds_StringMap.tnull;
  else
    Frag_h.translate = value1;
  end;
  local value1 = _hx_bit.bor(_hx_bit.bor(_hx_bit.bor(__xrfragment_XRF.QUERY_OPERATOR,__xrfragment_XRF.PV_OVERRIDE),__xrfragment_XRF.ROUNDROBIN),__xrfragment_XRF.T_INT);
  if (value1 == nil) then 
    Frag_h.visible = __haxe_ds_StringMap.tnull;
  else
    Frag_h.visible = value1;
  end;
  local value1 = _hx_bit.bor(_hx_bit.bor(__xrfragment_XRF.ASSET,__xrfragment_XRF.PV_OVERRIDE),__xrfragment_XRF.T_STRING);
  if (value1 == nil) then 
    Frag_h.env = __haxe_ds_StringMap.tnull;
  else
    Frag_h.env = value1;
  end;
  local value1 = _hx_bit.bor(_hx_bit.bor(_hx_bit.bor(_hx_bit.bor(__xrfragment_XRF.ASSET,__xrfragment_XRF.PV_OVERRIDE),__xrfragment_XRF.ROUNDROBIN),__xrfragment_XRF.T_VECTOR2),__xrfragment_XRF.BROWSER_OVERRIDE);
  if (value1 == nil) then 
    Frag_h.t = __haxe_ds_StringMap.tnull;
  else
    Frag_h.t = value1;
  end;
  local value1 = _hx_bit.bor(_hx_bit.bor(__xrfragment_XRF.ASSET,__xrfragment_XRF.PV_OVERRIDE),__xrfragment_XRF.T_VECTOR3);
  if (value1 == nil) then 
    Frag_h.gravity = __haxe_ds_StringMap.tnull;
  else
    Frag_h.gravity = value1;
  end;
  local value1 = _hx_bit.bor(_hx_bit.bor(__xrfragment_XRF.ASSET,__xrfragment_XRF.PV_OVERRIDE),__xrfragment_XRF.T_VECTOR3);
  if (value1 == nil) then 
    Frag_h.physics = __haxe_ds_StringMap.tnull;
  else
    Frag_h.physics = value1;
  end;
  local value1 = _hx_bit.bor(_hx_bit.bor(__xrfragment_XRF.ASSET,__xrfragment_XRF.PV_OVERRIDE),__xrfragment_XRF.T_STRING);
  if (value1 == nil) then 
    Frag_h.scroll = __haxe_ds_StringMap.tnull;
  else
    Frag_h.scroll = value1;
  end;
  local value1 = _hx_bit.bor(_hx_bit.bor(_hx_bit.bor(__xrfragment_XRF.ASSET,__xrfragment_XRF.PV_OVERRIDE),__xrfragment_XRF.T_INT),__xrfragment_XRF.BROWSER_OVERRIDE);
  if (value1 == nil) then 
    Frag_h.fov = __haxe_ds_StringMap.tnull;
  else
    Frag_h.fov = value1;
  end;
  local value1 = _hx_bit.bor(_hx_bit.bor(_hx_bit.bor(__xrfragment_XRF.ASSET,__xrfragment_XRF.PV_OVERRIDE),__xrfragment_XRF.T_VECTOR2),__xrfragment_XRF.BROWSER_OVERRIDE);
  if (value1 == nil) then 
    Frag_h.clip = __haxe_ds_StringMap.tnull;
  else
    Frag_h.clip = value1;
  end;
  local value1 = _hx_bit.bor(_hx_bit.bor(_hx_bit.bor(__xrfragment_XRF.ASSET,__xrfragment_XRF.PV_OVERRIDE),__xrfragment_XRF.T_STRING),__xrfragment_XRF.BROWSER_OVERRIDE);
  if (value1 == nil) then 
    Frag_h.fog = __haxe_ds_StringMap.tnull;
  else
    Frag_h.fog = value1;
  end;
  local value1 = _hx_bit.bor(__xrfragment_XRF.ASSET,__xrfragment_XRF.T_STRING);
  if (value1 == nil) then 
    Frag_h.namespace = __haxe_ds_StringMap.tnull;
  else
    Frag_h.namespace = value1;
  end;
  local value1 = _hx_bit.bor(__xrfragment_XRF.ASSET,__xrfragment_XRF.T_STRING);
  if (value1 == nil) then 
    Frag_h.SPFX = __haxe_ds_StringMap.tnull;
  else
    Frag_h.SPFX = value1;
  end;
  local value1 = _hx_bit.bor(__xrfragment_XRF.ASSET,__xrfragment_XRF.T_STRING);
  if (value1 == nil) then 
    Frag_h.unit = __haxe_ds_StringMap.tnull;
  else
    Frag_h.unit = value1;
  end;
  local value1 = _hx_bit.bor(__xrfragment_XRF.ASSET,__xrfragment_XRF.T_STRING);
  if (value1 == nil) then 
    Frag_h.description = __haxe_ds_StringMap.tnull;
  else
    Frag_h.description = value1;
  end;
  local value1 = _hx_bit.bor(_hx_bit.bor(_hx_bit.bor(_hx_bit.bor(__xrfragment_XRF.ASSET,__xrfragment_XRF.T_URL),__xrfragment_XRF.PV_OVERRIDE),__xrfragment_XRF.BROWSER_OVERRIDE),__xrfragment_XRF.PROMPT);
  if (value1 == nil) then 
    Frag_h.src_session = __haxe_ds_StringMap.tnull;
  else
    Frag_h.src_session = value1;
  end;
  if ((__lua_lib_luautf8_Utf8.len(value) == 0) and (Frag_h[key] == nil)) then 
    local value = __xrfragment_XRF.new(key, _hx_bit.bor(__xrfragment_XRF.PV_EXECUTE,__xrfragment_XRF.BROWSER_OVERRIDE));
    resultMap[key] = value;
    do return true end;
  end;
  local tmp;
  local idx = 1;
  local ret = _hx_tab_array({}, 0);
  while (idx ~= nil) do 
    local newidx = 0;
    if (__lua_lib_luautf8_Utf8.len(".") > 0) then 
      newidx = __lua_lib_luautf8_Utf8.find(key, ".", idx, true);
    else
      if (idx >= __lua_lib_luautf8_Utf8.len(key)) then 
        newidx = nil;
      else
        newidx = idx + 1;
      end;
    end;
    if (newidx ~= nil) then 
      local match = __lua_lib_luautf8_Utf8.sub(key, idx, newidx - 1);
      ret:push(match);
      idx = newidx + __lua_lib_luautf8_Utf8.len(".");
    else
      ret:push(__lua_lib_luautf8_Utf8.sub(key, idx, __lua_lib_luautf8_Utf8.len(key)));
      idx = nil;
    end;
  end;
  if (ret.length > 1) then 
    local idx = 1;
    local ret = _hx_tab_array({}, 0);
    while (idx ~= nil) do 
      local newidx = 0;
      if (__lua_lib_luautf8_Utf8.len(".") > 0) then 
        newidx = __lua_lib_luautf8_Utf8.find(value, ".", idx, true);
      else
        if (idx >= __lua_lib_luautf8_Utf8.len(value)) then 
          newidx = nil;
        else
          newidx = idx + 1;
        end;
      end;
      if (newidx ~= nil) then 
        local match = __lua_lib_luautf8_Utf8.sub(value, idx, newidx - 1);
        ret:push(match);
        idx = newidx + __lua_lib_luautf8_Utf8.len(".");
      else
        ret:push(__lua_lib_luautf8_Utf8.sub(value, idx, __lua_lib_luautf8_Utf8.len(value)));
        idx = nil;
      end;
    end;
    tmp = ret.length > 1;
  else
    tmp = false;
  end;
  if (tmp) then 
    local value = __xrfragment_XRF.new(key, _hx_bit.bor(_hx_bit.bor(_hx_bit.bor(__xrfragment_XRF.ASSET,__xrfragment_XRF.PV_OVERRIDE),__xrfragment_XRF.T_STRING),__xrfragment_XRF.PROP_BIND));
    resultMap[key] = value;
    do return true end;
  end;
  if (Frag_h[key] ~= nil) then 
    local ret = Frag_h[key];
    if (ret == __haxe_ds_StringMap.tnull) then 
      ret = nil;
    end;
    local v = __xrfragment_XRF.new(key, ret);
    if (not v:validate(value)) then 
      __haxe_Log.trace(Std.string(Std.string(Std.string(Std.string("[ i ] fragment '") .. Std.string(key)) .. Std.string("' has incompatible value (")) .. Std.string(value)) .. Std.string(")"), _hx_o({__fields__={fileName=true,lineNumber=true,className=true,methodName=true},fileName="src/xrfragment/Parser.hx",lineNumber=75,className="xrfragment.Parser",methodName="parse"}));
      do return false end;
    end;
    resultMap[key] = v;
  else
    __haxe_Log.trace(Std.string(Std.string("[ i ] fragment '") .. Std.string(key)) .. Std.string("' does not exist or has no type typed (yet)"), _hx_o({__fields__={fileName=true,lineNumber=true,className=true,methodName=true},fileName="src/xrfragment/Parser.hx",lineNumber=79,className="xrfragment.Parser",methodName="parse"}));
    do return false end;
  end;
  do return true end;
end

__xrfragment_Query.new = function(str) 
  local self = _hx_new(__xrfragment_Query.prototype)
  __xrfragment_Query.super(self,str)
  return self
end
__xrfragment_Query.super = function(self,str) 
  self.isNumber = EReg.new("^[0-9\\.]+$", "");
  self.isClass = EReg.new("^[-]?class$", "");
  self.isExclude = EReg.new("^-", "");
  self.isProp = EReg.new("^.*:[><=!]?", "");
  self.q = _hx_e();
  self.str = "";
  if (str ~= nil) then 
    self:parse(str);
  end;
end
_hx_exports["xrfragment"]["Query"] = __xrfragment_Query
__xrfragment_Query.__name__ = true
__xrfragment_Query.prototype = _hx_e();
__xrfragment_Query.prototype.toObject = function(self) 
  do return self.q end
end
__xrfragment_Query.prototype.expandAliases = function(self,token) 
  local classAlias = EReg.new("^(-)?\\.", "");
  if (classAlias:match(token)) then 
    do return StringTools.replace(token, ".", "class:") end;
  else
    do return token end;
  end;
end
__xrfragment_Query.prototype.get = function(self) 
  do return self.q end
end
__xrfragment_Query.prototype.parse = function(self,str,recurse) 
  if (recurse == nil) then 
    recurse = false;
  end;
  local _gthis = self;
  local idx = 1;
  local ret = _hx_tab_array({}, 0);
  while (idx ~= nil) do 
    local newidx = 0;
    if (__lua_lib_luautf8_Utf8.len(" ") > 0) then 
      newidx = __lua_lib_luautf8_Utf8.find(str, " ", idx, true);
    else
      if (idx >= __lua_lib_luautf8_Utf8.len(str)) then 
        newidx = nil;
      else
        newidx = idx + 1;
      end;
    end;
    if (newidx ~= nil) then 
      local match = __lua_lib_luautf8_Utf8.sub(str, idx, newidx - 1);
      ret:push(match);
      idx = newidx + __lua_lib_luautf8_Utf8.len(" ");
    else
      ret:push(__lua_lib_luautf8_Utf8.sub(str, idx, __lua_lib_luautf8_Utf8.len(str)));
      idx = nil;
    end;
  end;
  local token = ret;
  local q = _hx_e();
  local process = function(str,prefix) 
    if (prefix == nil) then 
      prefix = "";
    end;
    str = StringTools.trim(str);
    local idx = 1;
    local ret = _hx_tab_array({}, 0);
    while (idx ~= nil) do 
      local newidx = 0;
      if (__lua_lib_luautf8_Utf8.len(":") > 0) then 
        newidx = __lua_lib_luautf8_Utf8.find(str, ":", idx, true);
      else
        if (idx >= __lua_lib_luautf8_Utf8.len(str)) then 
          newidx = nil;
        else
          newidx = idx + 1;
        end;
      end;
      if (newidx ~= nil) then 
        local match = __lua_lib_luautf8_Utf8.sub(str, idx, newidx - 1);
        ret:push(match);
        idx = newidx + __lua_lib_luautf8_Utf8.len(":");
      else
        ret:push(__lua_lib_luautf8_Utf8.sub(str, idx, __lua_lib_luautf8_Utf8.len(str)));
        idx = nil;
      end;
    end;
    local k = ret[0];
    local idx = 1;
    local ret = _hx_tab_array({}, 0);
    while (idx ~= nil) do 
      local newidx = 0;
      if (__lua_lib_luautf8_Utf8.len(":") > 0) then 
        newidx = __lua_lib_luautf8_Utf8.find(str, ":", idx, true);
      else
        if (idx >= __lua_lib_luautf8_Utf8.len(str)) then 
          newidx = nil;
        else
          newidx = idx + 1;
        end;
      end;
      if (newidx ~= nil) then 
        local match = __lua_lib_luautf8_Utf8.sub(str, idx, newidx - 1);
        ret:push(match);
        idx = newidx + __lua_lib_luautf8_Utf8.len(":");
      else
        ret:push(__lua_lib_luautf8_Utf8.sub(str, idx, __lua_lib_luautf8_Utf8.len(str)));
        idx = nil;
      end;
    end;
    local v = ret[1];
    local filter = _hx_e();
    if (Reflect.field(q, Std.string(prefix) .. Std.string(k))) then 
      filter = Reflect.field(q, Std.string(prefix) .. Std.string(k));
    end;
    local value = (function() 
      local _hx_1
      if (Reflect.field(filter, "rules") ~= nil) then 
      _hx_1 = Reflect.field(filter, "rules"); else 
      _hx_1 = Array.new(); end
      return _hx_1
    end )();
    filter.rules = value;
    if (_gthis.isProp:match(str)) then 
      local oper = "";
      local startIndex = nil;
      if (startIndex == nil) then 
        startIndex = 1;
      else
        startIndex = startIndex + 1;
      end;
      local r = __lua_lib_luautf8_Utf8.find(str, "*", startIndex, true);
      if ((function() 
        local _hx_2
        if ((r ~= nil) and (r > 0)) then 
        _hx_2 = r - 1; else 
        _hx_2 = -1; end
        return _hx_2
      end )() ~= -1) then 
        oper = "*";
      end;
      local startIndex = nil;
      if (startIndex == nil) then 
        startIndex = 1;
      else
        startIndex = startIndex + 1;
      end;
      local r = __lua_lib_luautf8_Utf8.find(str, ">", startIndex, true);
      if ((function() 
        local _hx_3
        if ((r ~= nil) and (r > 0)) then 
        _hx_3 = r - 1; else 
        _hx_3 = -1; end
        return _hx_3
      end )() ~= -1) then 
        oper = ">";
      end;
      local startIndex = nil;
      if (startIndex == nil) then 
        startIndex = 1;
      else
        startIndex = startIndex + 1;
      end;
      local r = __lua_lib_luautf8_Utf8.find(str, "<", startIndex, true);
      if ((function() 
        local _hx_4
        if ((r ~= nil) and (r > 0)) then 
        _hx_4 = r - 1; else 
        _hx_4 = -1; end
        return _hx_4
      end )() ~= -1) then 
        oper = "<";
      end;
      local startIndex = nil;
      if (startIndex == nil) then 
        startIndex = 1;
      else
        startIndex = startIndex + 1;
      end;
      local r = __lua_lib_luautf8_Utf8.find(str, ">=", startIndex, true);
      if ((function() 
        local _hx_5
        if ((r ~= nil) and (r > 0)) then 
        _hx_5 = r - 1; else 
        _hx_5 = -1; end
        return _hx_5
      end )() ~= -1) then 
        oper = ">=";
      end;
      local startIndex = nil;
      if (startIndex == nil) then 
        startIndex = 1;
      else
        startIndex = startIndex + 1;
      end;
      local r = __lua_lib_luautf8_Utf8.find(str, "<=", startIndex, true);
      if ((function() 
        local _hx_6
        if ((r ~= nil) and (r > 0)) then 
        _hx_6 = r - 1; else 
        _hx_6 = -1; end
        return _hx_6
      end )() ~= -1) then 
        oper = "<=";
      end;
      if (_gthis.isExclude:match(k)) then 
        oper = "!=";
        local pos = 1;
        local len = nil;
        if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(k)))) then 
          len = __lua_lib_luautf8_Utf8.len(k);
        else
          if (len < 0) then 
            len = __lua_lib_luautf8_Utf8.len(k) + len;
          end;
        end;
        if (pos < 0) then 
          pos = __lua_lib_luautf8_Utf8.len(k) + pos;
        end;
        if (pos < 0) then 
          pos = 0;
        end;
        k = __lua_lib_luautf8_Utf8.sub(k, pos + 1, pos + len);
      else
        local pos = __lua_lib_luautf8_Utf8.len(oper);
        local len = nil;
        if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(v)))) then 
          len = __lua_lib_luautf8_Utf8.len(v);
        else
          if (len < 0) then 
            len = __lua_lib_luautf8_Utf8.len(v) + len;
          end;
        end;
        if (pos < 0) then 
          pos = __lua_lib_luautf8_Utf8.len(v) + pos;
        end;
        if (pos < 0) then 
          pos = 0;
        end;
        v = __lua_lib_luautf8_Utf8.sub(v, pos + 1, pos + len);
      end;
      if (__lua_lib_luautf8_Utf8.len(oper) == 0) then 
        oper = "=";
      end;
      if (_gthis.isClass:match(k)) then 
        local value = oper ~= "!=";
        filter[Std.string(prefix) .. Std.string(k)] = value;
        q[v] = filter;
      else
        local rule = _hx_e();
        if (_gthis.isNumber:match(v)) then 
          local value = Std.parseFloat(v);
          rule[oper] = value;
        else
          rule[oper] = v;
        end;
        Reflect.field(filter, "rules"):push(rule);
        q[k] = filter;
      end;
      do return end;
    else
      local value = (function() 
        local _hx_7
        if (_gthis.isExclude:match(str)) then 
        _hx_7 = false; else 
        _hx_7 = true; end
        return _hx_7
      end )();
      filter.id = value;
      local key;
      if (_gthis.isExclude:match(str)) then 
        local pos = 1;
        local len = nil;
        if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(str)))) then 
          len = __lua_lib_luautf8_Utf8.len(str);
        else
          if (len < 0) then 
            len = __lua_lib_luautf8_Utf8.len(str) + len;
          end;
        end;
        if (pos < 0) then 
          pos = __lua_lib_luautf8_Utf8.len(str) + pos;
        end;
        if (pos < 0) then 
          pos = 0;
        end;
        key = __lua_lib_luautf8_Utf8.sub(str, pos + 1, pos + len);
      else
        key = str;
      end;
      q[key] = filter;
    end;
  end;
  local _g = 0;
  local _g1 = token.length;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    process(self:expandAliases(token[i]));
  end;
  self.q = q do return self.q end
end
__xrfragment_Query.prototype.test = function(self,obj) 
  local qualify = false;
  local _g = 0;
  local _g1 = Reflect.fields(obj);
  while (_g < _g1.length) do 
    local k = _g1[_g];
    _g = _g + 1;
    local v = Std.string(Reflect.field(obj, k));
    if (self:testProperty(k, v)) then 
      qualify = true;
    end;
  end;
  local _g = 0;
  local _g1 = Reflect.fields(obj);
  while (_g < _g1.length) do 
    local k = _g1[_g];
    _g = _g + 1;
    local v = Std.string(Reflect.field(obj, k));
    if (self:testProperty(k, v, true)) then 
      qualify = false;
    end;
  end;
  do return qualify end
end
__xrfragment_Query.prototype.testProperty = function(self,property,value,exclude) 
  local conds = 0;
  local fails = 0;
  local qualify = 0;
  local testprop = function(expr) 
    conds = conds + 1;
    fails = fails + (function() 
      local _hx_1
      if (expr) then 
      _hx_1 = 0; else 
      _hx_1 = 1; end
      return _hx_1
    end )();
    do return expr end;
  end;
  if (Reflect.field(self.q, value) ~= nil) then 
    local v = Reflect.field(self.q, value);
    if (Reflect.field(v, property) ~= nil) then 
      do return Reflect.field(v, property) end;
    end;
  end;
  local _g = 0;
  local _g1 = Reflect.fields(self.q);
  local _hx_continue_1 = false;
  while (_g < _g1.length) do repeat 
    local k = _g1[_g];
    _g = _g + 1;
    local filter = Reflect.field(self.q, k);
    if (filter.rules == nil) then 
      break;
    end;
    local rules = filter.rules;
    local _g = 0;
    while (_g < rules.length) do 
      local rule = rules[_g];
      _g = _g + 1;
      if (exclude) then 
        if (((Reflect.field(rule, "!=") ~= nil) and testprop(Std.string(value) == Std.string(Reflect.field(rule, "!=")))) and exclude) then 
          qualify = qualify + 1;
        end;
      else
        if ((Reflect.field(rule, "*") ~= nil) and testprop(Std.parseFloat(value) ~= nil)) then 
          qualify = qualify + 1;
        end;
        if ((Reflect.field(rule, ">") ~= nil) and testprop(Std.parseFloat(value) > Std.parseFloat(Reflect.field(rule, ">")))) then 
          qualify = qualify + 1;
        end;
        if ((Reflect.field(rule, "<") ~= nil) and testprop(Std.parseFloat(value) < Std.parseFloat(Reflect.field(rule, "<")))) then 
          qualify = qualify + 1;
        end;
        if ((Reflect.field(rule, ">=") ~= nil) and testprop(Std.parseFloat(value) >= Std.parseFloat(Reflect.field(rule, ">=")))) then 
          qualify = qualify + 1;
        end;
        if ((Reflect.field(rule, "<=") ~= nil) and testprop(Std.parseFloat(value) <= Std.parseFloat(Reflect.field(rule, "<=")))) then 
          qualify = qualify + 1;
        end;
        if ((Reflect.field(rule, "=") ~= nil) and (testprop(value == Reflect.field(rule, "=")) or testprop(Std.parseFloat(value) == Std.parseFloat(Reflect.field(rule, "="))))) then 
          qualify = qualify + 1;
        end;
      end;
    end;until true
    if _hx_continue_1 then 
    _hx_continue_1 = false;
    break;
    end;
    
  end;
  do return qualify > 0 end
end

__xrfragment_Query.prototype.__class__ =  __xrfragment_Query

__xrfragment_URI.new = {}
_hx_exports["xrfragment"]["URI"] = __xrfragment_URI
__xrfragment_URI.__name__ = true
__xrfragment_URI.parse = function(qs,browser_override) 
  local idx = 1;
  local ret = _hx_tab_array({}, 0);
  while (idx ~= nil) do 
    local newidx = 0;
    if (__lua_lib_luautf8_Utf8.len("#") > 0) then 
      newidx = __lua_lib_luautf8_Utf8.find(qs, "#", idx, true);
    else
      if (idx >= __lua_lib_luautf8_Utf8.len(qs)) then 
        newidx = nil;
      else
        newidx = idx + 1;
      end;
    end;
    if (newidx ~= nil) then 
      local match = __lua_lib_luautf8_Utf8.sub(qs, idx, newidx - 1);
      ret:push(match);
      idx = newidx + __lua_lib_luautf8_Utf8.len("#");
    else
      ret:push(__lua_lib_luautf8_Utf8.sub(qs, idx, __lua_lib_luautf8_Utf8.len(qs)));
      idx = nil;
    end;
  end;
  local fragment = ret;
  local _this = fragment[1];
  local idx = 1;
  local ret = _hx_tab_array({}, 0);
  while (idx ~= nil) do 
    local newidx = 0;
    if (__lua_lib_luautf8_Utf8.len("&") > 0) then 
      newidx = __lua_lib_luautf8_Utf8.find(_this, "&", idx, true);
    else
      if (idx >= __lua_lib_luautf8_Utf8.len(_this)) then 
        newidx = nil;
      else
        newidx = idx + 1;
      end;
    end;
    if (newidx ~= nil) then 
      local match = __lua_lib_luautf8_Utf8.sub(_this, idx, newidx - 1);
      ret:push(match);
      idx = newidx + __lua_lib_luautf8_Utf8.len("&");
    else
      ret:push(__lua_lib_luautf8_Utf8.sub(_this, idx, __lua_lib_luautf8_Utf8.len(_this)));
      idx = nil;
    end;
  end;
  local splitArray = ret;
  local resultMap = _hx_e();
  local _g = 0;
  local _g1 = splitArray.length;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    local _this = splitArray[i];
    local idx = 1;
    local ret = _hx_tab_array({}, 0);
    while (idx ~= nil) do 
      local newidx = 0;
      if (__lua_lib_luautf8_Utf8.len("=") > 0) then 
        newidx = __lua_lib_luautf8_Utf8.find(_this, "=", idx, true);
      else
        if (idx >= __lua_lib_luautf8_Utf8.len(_this)) then 
          newidx = nil;
        else
          newidx = idx + 1;
        end;
      end;
      if (newidx ~= nil) then 
        local match = __lua_lib_luautf8_Utf8.sub(_this, idx, newidx - 1);
        ret:push(match);
        idx = newidx + __lua_lib_luautf8_Utf8.len("=");
      else
        ret:push(__lua_lib_luautf8_Utf8.sub(_this, idx, __lua_lib_luautf8_Utf8.len(_this)));
        idx = nil;
      end;
    end;
    local splitByEqual = ret;
    local regexPlus = EReg.new("\\+", "g");
    local key = splitByEqual[0];
    local value = "";
    if (splitByEqual.length > 1) then 
      value = StringTools.urlDecode(regexPlus:split(splitByEqual[1]):join(" "));
    end;
    local ok = __xrfragment_Parser.parse(key, value, resultMap);
  end;
  if (browser_override) then 
    local _g = 0;
    local _g1 = Reflect.fields(resultMap);
    while (_g < _g1.length) do 
      local key = _g1[_g];
      _g = _g + 1;
      local xrf = Reflect.field(resultMap, key);
      if (not xrf:is(__xrfragment_XRF.BROWSER_OVERRIDE)) then 
        Reflect.deleteField(resultMap, key);
      end;
    end;
  end;
  do return resultMap end;
end

__xrfragment_XRF.new = function(_fragment,_flags) 
  local self = _hx_new(__xrfragment_XRF.prototype)
  __xrfragment_XRF.super(self,_fragment,_flags)
  return self
end
__xrfragment_XRF.super = function(self,_fragment,_flags) 
  self.fragment = _fragment;
  self.flags = _flags;
end
__xrfragment_XRF.__name__ = true
__xrfragment_XRF.prototype = _hx_e();
__xrfragment_XRF.prototype.is = function(self,flag) 
  do return (_hx_bit.band(self.flags,flag)) ~= 0 end
end
__xrfragment_XRF.prototype.validate = function(self,value) 
  self:guessType(self, value);
  local idx = 1;
  local ret = _hx_tab_array({}, 0);
  while (idx ~= nil) do 
    local newidx = 0;
    if (__lua_lib_luautf8_Utf8.len("|") > 0) then 
      newidx = __lua_lib_luautf8_Utf8.find(value, "|", idx, true);
    else
      if (idx >= __lua_lib_luautf8_Utf8.len(value)) then 
        newidx = nil;
      else
        newidx = idx + 1;
      end;
    end;
    if (newidx ~= nil) then 
      local match = __lua_lib_luautf8_Utf8.sub(value, idx, newidx - 1);
      ret:push(match);
      idx = newidx + __lua_lib_luautf8_Utf8.len("|");
    else
      ret:push(__lua_lib_luautf8_Utf8.sub(value, idx, __lua_lib_luautf8_Utf8.len(value)));
      idx = nil;
    end;
  end;
  if (ret.length > 1) then 
    self.args = Array.new();
    local idx = 1;
    local ret = _hx_tab_array({}, 0);
    while (idx ~= nil) do 
      local newidx = 0;
      if (__lua_lib_luautf8_Utf8.len("|") > 0) then 
        newidx = __lua_lib_luautf8_Utf8.find(value, "|", idx, true);
      else
        if (idx >= __lua_lib_luautf8_Utf8.len(value)) then 
          newidx = nil;
        else
          newidx = idx + 1;
        end;
      end;
      if (newidx ~= nil) then 
        local match = __lua_lib_luautf8_Utf8.sub(value, idx, newidx - 1);
        ret:push(match);
        idx = newidx + __lua_lib_luautf8_Utf8.len("|");
      else
        ret:push(__lua_lib_luautf8_Utf8.sub(value, idx, __lua_lib_luautf8_Utf8.len(value)));
        idx = nil;
      end;
    end;
    local args = ret;
    local _g = 0;
    local _g1 = args.length;
    while (_g < _g1) do 
      _g = _g + 1;
      local i = _g - 1;
      local x = __xrfragment_XRF.new(self.fragment, self.flags);
      self:guessType(x, args[i]);
      self.args:push(x);
    end;
  end;
  if (self.fragment == "q") then 
    self.query = __xrfragment_Query.new(value):get();
  end;
  local ok = true;
  if (not __lua_Boot.__instanceof(self.args, Array)) then 
    if (self:is(__xrfragment_XRF.T_VECTOR3) and not ((__lua_Boot.__instanceof(self.x, Float) and __lua_Boot.__instanceof(self.y, Float)) and __lua_Boot.__instanceof(self.z, Float))) then 
      ok = false;
    end;
    if (self:is(__xrfragment_XRF.T_VECTOR2) and not (__lua_Boot.__instanceof(self.x, Float) and __lua_Boot.__instanceof(self.y, Float))) then 
      ok = false;
    end;
    if (self:is(__xrfragment_XRF.T_INT) and not __lua_Boot.__instanceof(self.int, Int)) then 
      ok = false;
    end;
  end;
  do return ok end
end
__xrfragment_XRF.prototype.guessType = function(self,v,str) 
  v.string = str;
  local idx = 1;
  local ret = _hx_tab_array({}, 0);
  while (idx ~= nil) do 
    local newidx = 0;
    if (__lua_lib_luautf8_Utf8.len(",") > 0) then 
      newidx = __lua_lib_luautf8_Utf8.find(str, ",", idx, true);
    else
      if (idx >= __lua_lib_luautf8_Utf8.len(str)) then 
        newidx = nil;
      else
        newidx = idx + 1;
      end;
    end;
    if (newidx ~= nil) then 
      local match = __lua_lib_luautf8_Utf8.sub(str, idx, newidx - 1);
      ret:push(match);
      idx = newidx + __lua_lib_luautf8_Utf8.len(",");
    else
      ret:push(__lua_lib_luautf8_Utf8.sub(str, idx, __lua_lib_luautf8_Utf8.len(str)));
      idx = nil;
    end;
  end;
  if (ret.length > 1) then 
    local idx = 1;
    local ret = _hx_tab_array({}, 0);
    while (idx ~= nil) do 
      local newidx = 0;
      if (__lua_lib_luautf8_Utf8.len(",") > 0) then 
        newidx = __lua_lib_luautf8_Utf8.find(str, ",", idx, true);
      else
        if (idx >= __lua_lib_luautf8_Utf8.len(str)) then 
          newidx = nil;
        else
          newidx = idx + 1;
        end;
      end;
      if (newidx ~= nil) then 
        local match = __lua_lib_luautf8_Utf8.sub(str, idx, newidx - 1);
        ret:push(match);
        idx = newidx + __lua_lib_luautf8_Utf8.len(",");
      else
        ret:push(__lua_lib_luautf8_Utf8.sub(str, idx, __lua_lib_luautf8_Utf8.len(str)));
        idx = nil;
      end;
    end;
    local xyz = ret;
    if (xyz.length > 0) then 
      v.x = Std.parseFloat(xyz[0]);
    end;
    if (xyz.length > 1) then 
      v.y = Std.parseFloat(xyz[1]);
    end;
    if (xyz.length > 2) then 
      v.z = Std.parseFloat(xyz[2]);
    end;
  end;
  if (__xrfragment_XRF.isColor:match(str)) then 
    v.color = str;
  end;
  if (__xrfragment_XRF.isFloat:match(str)) then 
    v.float = Std.parseFloat(str);
  end;
  if (__xrfragment_XRF.isInt:match(str)) then 
    v.int = Std.parseInt(str);
  end;
end

__xrfragment_XRF.prototype.__class__ =  __xrfragment_XRF
-- require this for lua 5.1
pcall(require, 'bit')
if bit then
  _hx_bit_raw = bit
  _hx_bit = setmetatable({}, { __index = _hx_bit_raw });
else
  _hx_bit_raw = _G.require('bit32')
  _hx_bit = setmetatable({}, { __index = _hx_bit_raw });
  -- lua 5.2 weirdness
  _hx_bit.bnot = function(...) return _hx_bit_clamp(_hx_bit_raw.bnot(...)) end;
  _hx_bit.bxor = function(...) return _hx_bit_clamp(_hx_bit_raw.bxor(...)) end;
end
-- see https://github.com/HaxeFoundation/haxe/issues/8849
_hx_bit.bor = function(...) return _hx_bit_clamp(_hx_bit_raw.bor(...)) end;
_hx_bit.band = function(...) return _hx_bit_clamp(_hx_bit_raw.band(...)) end;
_hx_bit.arshift = function(...) return _hx_bit_clamp(_hx_bit_raw.arshift(...)) end;

if _hx_bit_raw then
    _hx_bit_clamp = function(v)
    if v <= 2147483647 and v >= -2147483648 then
        if v > 0 then return _G.math.floor(v)
        else return _G.math.ceil(v)
        end
    end
    if v > 2251798999999999 then v = v*2 end;
    if (v ~= v or math.abs(v) == _G.math.huge) then return nil end
    return _hx_bit_raw.band(v, 2147483647 ) - math.abs(_hx_bit_raw.band(v, 2147483648))
    end
else
    _hx_bit_clamp = function(v)
        if v < -2147483648 then
            return -2147483648
        elseif v > 2147483647 then
            return 2147483647
        elseif v > 0 then
            return _G.math.floor(v)
        else
            return _G.math.ceil(v)
        end
    end
end;



_hx_array_mt.__index = Array.prototype

local _hx_static_init = function()
  
  if (__lua_lib_lrexlib_Rex == nil) then 
    _G.error(__haxe_Exception.thrown("Rex is missing.  Please install lrexlib-pcre."),0);
  end;
  String.__name__ = true;
  Array.__name__ = true;EReg.FLAGS = __lua_lib_lrexlib_Rex.flags();
  
  __haxe_ds_StringMap.tnull = ({});
  
  __xrfragment_Parser.error = "";
  
  __xrfragment_XRF.ASSET = 1;
  
  __xrfragment_XRF.PROP_BIND = 2;
  
  __xrfragment_XRF.QUERY_OPERATOR = 4;
  
  __xrfragment_XRF.PROMPT = 8;
  
  __xrfragment_XRF.ROUNDROBIN = 16;
  
  __xrfragment_XRF.BROWSER_OVERRIDE = 32;
  
  __xrfragment_XRF.PV_OVERRIDE = 64;
  
  __xrfragment_XRF.PV_EXECUTE = 128;
  
  __xrfragment_XRF.T_INT = 512;
  
  __xrfragment_XRF.T_VECTOR2 = 2048;
  
  __xrfragment_XRF.T_VECTOR3 = 4096;
  
  __xrfragment_XRF.T_URL = 8192;
  
  __xrfragment_XRF.T_PREDEFINED_VIEW = 16384;
  
  __xrfragment_XRF.T_STRING = 32768;
  
  __xrfragment_XRF.T_STRING_OBJ = 65536;
  
  __xrfragment_XRF.isColor = EReg.new("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", "");
  
  __xrfragment_XRF.isInt = EReg.new("^[0-9]+$", "");
  
  __xrfragment_XRF.isFloat = EReg.new("^[0-9]+\\.[0-9]+$", "");
  
  
end

_hx_print = print or (function() end)

_hx_table = {}
_hx_table.pack = _G.table.pack or function(...)
    return {...}
end
_hx_table.unpack = _G.table.unpack or _G.unpack
_hx_table.maxn = _G.table.maxn or function(t)
  local maxn=0;
  for i in pairs(t) do
    maxn=type(i)=='number'and i>maxn and i or maxn
  end
  return maxn
end;

_hx_wrap_if_string_field = function(o, fld)
  if _G.type(o) == 'string' then
    if fld == 'length' then
      return _G.string.len(o)
    else
      return String.prototype[fld]
    end
  else
    return o[fld]
  end
end

_hx_static_init();
return _hx_exports
