-- SPDX-FileCopyrightText: 2023 Leon van Kammen/NLNET
--
-- SPDX-License-Identifier: MPL-2.0

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
local StringBuf = _hx_e()
local StringTools = _hx_e()
__haxe_IMap = _hx_e()
__haxe_Exception = _hx_e()
__haxe_Log = _hx_e()
__haxe_NativeStackTrace = _hx_e()
__haxe__Template_TemplateExpr = _hx_e()
__haxe_iterators_ArrayIterator = _hx_e()
__haxe_Template = _hx_e()
__haxe_ValueException = _hx_e()
__haxe_ds_List = _hx_e()
__haxe_ds__List_ListNode = _hx_e()
__haxe_ds_StringMap = _hx_e()
__haxe_iterators_ArrayKeyValueIterator = _hx_e()
__lua_Boot = _hx_e()
__lua_UserData = _hx_e()
__lua_Lib = _hx_e()
__lua_Thread = _hx_e()
__xrfragment_Filter = _hx_e()
__xrfragment_Parser = _hx_e()
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
EReg.prototype.matched = function(self,n) 
  if ((self.m[1] == nil) or (n < 0)) then 
    _G.error(__haxe_Exception.thrown("EReg::matched"),0);
  else
    if (n == 0) then 
      local k = _G.string.sub(self.s, self.m[1], self.m[2]);
      do return k end;
    else
      if (__lua_Boot.__instanceof(self.m[3], _G.table)) then 
        local mn = 2 * (n - 1);
        if (__lua_Boot.__instanceof(self.m[3][mn + 1], Bool)) then 
          do return nil end;
        end;
        do return _G.string.sub(self.s, self.m[3][mn + 1], self.m[3][mn + 2]) end;
      else
        _G.error(__haxe_Exception.thrown("EReg:matched"),0);
      end;
    end;
  end;
end
EReg.prototype.matchedLeft = function(self) 
  if (self.m[1] == nil) then 
    _G.error(__haxe_Exception.thrown("No string matched"),0);
  end;
  do return _G.string.sub(self.s, 1, self.m[1] - 1) end
end
EReg.prototype.matchedRight = function(self) 
  if (self.m[1] == nil) then 
    _G.error(__haxe_Exception.thrown("No string matched"),0);
  end;
  do return _G.string.sub(self.s, self.m[2] + 1) end
end
EReg.prototype.matchedPos = function(self) 
  local left = self:matchedLeft();
  local matched = self:matched(0);
  if (self.m[1] == nil) then 
    _G.error(__haxe_Exception.thrown("No string matched"),0);
  end;
  do return _hx_o({__fields__={pos=true,len=true},pos=__lua_lib_luautf8_Utf8.len(left),len=__lua_lib_luautf8_Utf8.len(matched)}) end
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
Reflect.getProperty = function(o,field) 
  if (o == nil) then 
    do return nil end;
  else
    if ((o.__properties__ ~= nil) and (Reflect.field(o, Std.string("get_") .. Std.string(field)) ~= nil)) then 
      do return Reflect.callMethod(o,Reflect.field(o, Std.string("get_") .. Std.string(field)),_hx_tab_array({}, 0)) end;
    else
      do return Reflect.field(o, field) end;
    end;
  end;
end
Reflect.callMethod = function(o,func,args) 
  if ((args == nil) or (args.length == 0)) then 
    do return func(o) end;
  else
    local self_arg = false;
    if ((o ~= nil) and (o.__name__ == nil)) then 
      self_arg = true;
    end;
    if (self_arg) then 
      do return func(o, _hx_table.unpack(args, 0, args.length - 1)) end;
    else
      do return func(_hx_table.unpack(args, 0, args.length - 1)) end;
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
Reflect.isObject = function(v) 
  if (v == nil) then 
    do return false end;
  end;
  local t = type(v);
  if (not ((t == "string") or ((t == "table") and (v.__enum__ == nil)))) then 
    if (t == "function") then 
      do return ((function() 
        local _hx_1
        if (_G.type(v) ~= "table") then 
        _hx_1 = false; else 
        _hx_1 = v.__name__; end
        return _hx_1
      end )() or (function() 
        local _hx_2
        if (_G.type(v) ~= "table") then 
        _hx_2 = false; else 
        _hx_2 = v.__ename__; end
        return _hx_2
      end )()) ~= nil end;
    else
      do return false end;
    end;
  else
    do return true end;
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
Reflect.copy = function(o) 
  if (o == nil) then 
    do return nil end;
  end;
  local o2 = _hx_e();
  local _g = 0;
  local _g1 = Reflect.fields(o);
  while (_g < _g1.length) do 
    local f = _g1[_g];
    _g = _g + 1;
    o2[f] = Reflect.field(o, f);
  end;
  do return o2 end;
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

StringBuf.new = function() 
  local self = _hx_new(StringBuf.prototype)
  StringBuf.super(self)
  return self
end
StringBuf.super = function(self) 
  self.b = ({});
  self.length = 0;
end
StringBuf.__name__ = true
StringBuf.prototype = _hx_e();

StringBuf.prototype.__class__ =  StringBuf

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
__haxe_Exception.caught = function(value) 
  if (__lua_Boot.__instanceof(value, __haxe_Exception)) then 
    do return value end;
  else
    do return __haxe_ValueException.new(value, nil, value) end;
  end;
end
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
__haxe_Exception.prototype.unwrap = function(self) 
  do return self.__nativeException end
end
__haxe_Exception.prototype.get_native = function(self) 
  do return self.__nativeException end
end

__haxe_Exception.prototype.__class__ =  __haxe_Exception

__haxe_Exception.prototype.__properties__ =  {get_native="get_native"}

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
_hxClasses["haxe._Template.TemplateExpr"] = { __ename__ = true, __constructs__ = _hx_tab_array({[0]="OpVar","OpExpr","OpIf","OpStr","OpBlock","OpForeach","OpMacro"},7)}
__haxe__Template_TemplateExpr = _hxClasses["haxe._Template.TemplateExpr"];
__haxe__Template_TemplateExpr.OpVar = function(v) local _x = _hx_tab_array({[0]="OpVar",0,v,__enum__=__haxe__Template_TemplateExpr}, 3); return _x; end 
__haxe__Template_TemplateExpr.OpExpr = function(expr) local _x = _hx_tab_array({[0]="OpExpr",1,expr,__enum__=__haxe__Template_TemplateExpr}, 3); return _x; end 
__haxe__Template_TemplateExpr.OpIf = function(expr,eif,eelse) local _x = _hx_tab_array({[0]="OpIf",2,expr,eif,eelse,__enum__=__haxe__Template_TemplateExpr}, 5); return _x; end 
__haxe__Template_TemplateExpr.OpStr = function(str) local _x = _hx_tab_array({[0]="OpStr",3,str,__enum__=__haxe__Template_TemplateExpr}, 3); return _x; end 
__haxe__Template_TemplateExpr.OpBlock = function(l) local _x = _hx_tab_array({[0]="OpBlock",4,l,__enum__=__haxe__Template_TemplateExpr}, 3); return _x; end 
__haxe__Template_TemplateExpr.OpForeach = function(expr,loop) local _x = _hx_tab_array({[0]="OpForeach",5,expr,loop,__enum__=__haxe__Template_TemplateExpr}, 4); return _x; end 
__haxe__Template_TemplateExpr.OpMacro = function(name,params) local _x = _hx_tab_array({[0]="OpMacro",6,name,params,__enum__=__haxe__Template_TemplateExpr}, 4); return _x; end 

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

__haxe_Template.new = function(str) 
  local self = _hx_new(__haxe_Template.prototype)
  __haxe_Template.super(self,str)
  return self
end
__haxe_Template.super = function(self,str) 
  local tokens = self:parseTokens(str);
  self.expr = self:parseBlock(tokens);
  if (not tokens:isEmpty()) then 
    _G.error(__haxe_Exception.thrown(Std.string(Std.string("Unexpected '") .. Std.string(Std.string(tokens:first().s))) .. Std.string("'")),0);
  end;
end
__haxe_Template.__name__ = true
__haxe_Template.prototype = _hx_e();
__haxe_Template.prototype.execute = function(self,context,macros) 
  self.macros = (function() 
    local _hx_1
    if (macros == nil) then 
    _hx_1 = _hx_e(); else 
    _hx_1 = macros; end
    return _hx_1
  end )();
  self.context = context;
  self.stack = __haxe_ds_List.new();
  self.buf = StringBuf.new();
  self:run(self.expr);
  do return _G.table.concat(self.buf.b) end
end
__haxe_Template.prototype.resolve = function(self,v) 
  if (v == "__current__") then 
    do return self.context end;
  end;
  if (Reflect.isObject(self.context)) then 
    local value = Reflect.getProperty(self.context, v);
    local tmp;
    if (value == nil) then 
      local o = self.context;
      tmp = (function() 
        local _hx_1
        if ((_G.type(o) == "string") and ((String.prototype[v] ~= nil) or (v == "length"))) then 
        _hx_1 = true; elseif (o.__fields__ ~= nil) then 
        _hx_1 = o.__fields__[v] ~= nil; else 
        _hx_1 = o[v] ~= nil; end
        return _hx_1
      end )();
    else
      tmp = true;
    end;
    if (tmp) then 
      do return value end;
    end;
  end;
  local _g_head = self.stack.h;
  while (_g_head ~= nil) do 
    local val = _g_head.item;
    _g_head = _g_head.next;
    local ctx = val;
    local value = Reflect.getProperty(ctx, v);
    local tmp;
    if (value == nil) then 
      local o = ctx;
      tmp = (function() 
        local _hx_2
        if ((_G.type(o) == "string") and ((String.prototype[v] ~= nil) or (v == "length"))) then 
        _hx_2 = true; elseif (o.__fields__ ~= nil) then 
        _hx_2 = o.__fields__[v] ~= nil; else 
        _hx_2 = o[v] ~= nil; end
        return _hx_2
      end )();
    else
      tmp = true;
    end;
    if (tmp) then 
      do return value end;
    end;
  end;
  do return Reflect.field(__haxe_Template.globals, v) end
end
__haxe_Template.prototype.parseTokens = function(self,data) 
  local tokens = __haxe_ds_List.new();
  local _hx_continue_1 = false;
  while (__haxe_Template.splitter:match(data)) do repeat 
    local p = __haxe_Template.splitter:matchedPos();
    if (p.pos > 0) then 
      local pos = 0;
      local len = p.pos;
      if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(data)))) then 
        len = __lua_lib_luautf8_Utf8.len(data);
      else
        if (len < 0) then 
          len = __lua_lib_luautf8_Utf8.len(data) + len;
        end;
      end;
      if (pos < 0) then 
        pos = __lua_lib_luautf8_Utf8.len(data) + pos;
      end;
      if (pos < 0) then 
        pos = 0;
      end;
      tokens:add(_hx_o({__fields__={p=true,s=true,l=true},p=__lua_lib_luautf8_Utf8.sub(data, pos + 1, pos + len),s=true,l=nil}));
    end;
    if (__lua_lib_luautf8_Utf8.byte(data, p.pos + 1) == 58) then 
      local pos = p.pos + 2;
      local len = p.len - 4;
      if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(data)))) then 
        len = __lua_lib_luautf8_Utf8.len(data);
      else
        if (len < 0) then 
          len = __lua_lib_luautf8_Utf8.len(data) + len;
        end;
      end;
      if (pos < 0) then 
        pos = __lua_lib_luautf8_Utf8.len(data) + pos;
      end;
      if (pos < 0) then 
        pos = 0;
      end;
      tokens:add(_hx_o({__fields__={p=true,s=true,l=true},p=__lua_lib_luautf8_Utf8.sub(data, pos + 1, pos + len),s=false,l=nil}));
      data = __haxe_Template.splitter:matchedRight();
      break;
    end;
    local parp = p.pos + p.len;
    local npar = 1;
    local params = _hx_tab_array({}, 0);
    local part = "";
    while (true) do 
      local c = __lua_lib_luautf8_Utf8.byte(data, parp + 1);
      parp = parp + 1;
      if (c == 40) then 
        npar = npar + 1;
      else
        if (c == 41) then 
          npar = npar - 1;
          if (npar <= 0) then 
            break;
          end;
        else
          if (c == nil) then 
            _G.error(__haxe_Exception.thrown("Unclosed macro parenthesis"),0);
          end;
        end;
      end;
      if ((c == 44) and (npar == 1)) then 
        params:push(part);
        part = "";
      else
        part = Std.string(part) .. Std.string(__lua_lib_luautf8_Utf8.char(c));
      end;
    end;
    params:push(part);
    tokens:add(_hx_o({__fields__={p=true,s=true,l=true},p=__haxe_Template.splitter:matched(2),s=false,l=params}));
    local pos = parp;
    local len = __lua_lib_luautf8_Utf8.len(data) - parp;
    if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(data)))) then 
      len = __lua_lib_luautf8_Utf8.len(data);
    else
      if (len < 0) then 
        len = __lua_lib_luautf8_Utf8.len(data) + len;
      end;
    end;
    if (pos < 0) then 
      pos = __lua_lib_luautf8_Utf8.len(data) + pos;
    end;
    if (pos < 0) then 
      pos = 0;
    end;
    data = __lua_lib_luautf8_Utf8.sub(data, pos + 1, pos + len);until true
    if _hx_continue_1 then 
    _hx_continue_1 = false;
    break;
    end;
    
  end;
  if (__lua_lib_luautf8_Utf8.len(data) > 0) then 
    tokens:add(_hx_o({__fields__={p=true,s=true,l=true},p=data,s=true,l=nil}));
  end;
  do return tokens end
end
__haxe_Template.prototype.parseBlock = function(self,tokens) 
  local l = __haxe_ds_List.new();
  while (true) do 
    local t = tokens:first();
    if (t == nil) then 
      break;
    end;
    local tmp;
    if (not t.s) then 
      if (not ((t.p == "end") or (t.p == "else"))) then 
        local _this = t.p;
        local pos = 0;
        local len = 7;
        if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(_this)))) then 
          len = __lua_lib_luautf8_Utf8.len(_this);
        else
          if (len < 0) then 
            len = __lua_lib_luautf8_Utf8.len(_this) + len;
          end;
        end;
        if (pos < 0) then 
          pos = __lua_lib_luautf8_Utf8.len(_this) + pos;
        end;
        if (pos < 0) then 
          pos = 0;
        end;
        tmp = __lua_lib_luautf8_Utf8.sub(_this, pos + 1, pos + len) == "elseif ";
      else
        tmp = true;
      end;
    else
      tmp = false;
    end;
    if (tmp) then 
      break;
    end;
    l:add(self:parse(tokens));
  end;
  if (l.length == 1) then 
    do return l:first() end;
  end;
  do return __haxe__Template_TemplateExpr.OpBlock(l) end
end
__haxe_Template.prototype.parse = function(self,tokens) 
  local t = tokens:pop();
  local p = t.p;
  if (t.s) then 
    do return __haxe__Template_TemplateExpr.OpStr(p) end;
  end;
  if (t.l ~= nil) then 
    local pe = __haxe_ds_List.new();
    local _g = 0;
    local _g1 = t.l;
    while (_g < _g1.length) do 
      local p = _g1[_g];
      _g = _g + 1;
      pe:add(self:parseBlock(self:parseTokens(p)));
    end;
    do return __haxe__Template_TemplateExpr.OpMacro(p, pe) end;
  end;
  local kwdEnd = function(kwd) 
    local pos = -1;
    local length = __lua_lib_luautf8_Utf8.len(kwd);
    local pos1 = 0;
    local len = length;
    if ((len == nil) or (len > (pos1 + __lua_lib_luautf8_Utf8.len(p)))) then 
      len = __lua_lib_luautf8_Utf8.len(p);
    else
      if (len < 0) then 
        len = __lua_lib_luautf8_Utf8.len(p) + len;
      end;
    end;
    if (pos1 < 0) then 
      pos1 = __lua_lib_luautf8_Utf8.len(p) + pos1;
    end;
    if (pos1 < 0) then 
      pos1 = 0;
    end;
    if (__lua_lib_luautf8_Utf8.sub(p, pos1 + 1, pos1 + len) == kwd) then 
      pos = length;
      local pos1 = length;
      local len = nil;
      if ((len == nil) or (len > (pos1 + __lua_lib_luautf8_Utf8.len(p)))) then 
        len = __lua_lib_luautf8_Utf8.len(p);
      else
        if (len < 0) then 
          len = __lua_lib_luautf8_Utf8.len(p) + len;
        end;
      end;
      if (pos1 < 0) then 
        pos1 = __lua_lib_luautf8_Utf8.len(p) + pos1;
      end;
      if (pos1 < 0) then 
        pos1 = 0;
      end;
      local s = __lua_lib_luautf8_Utf8.sub(p, pos1 + 1, pos1 + len);
      local _g_codes = __lua_lib_luautf8_Utf8.codes(s);
      local _g_str = s;
      local _hx_1_cp_position, _hx_1_cp_codepoint = _g_codes(_g_str, 0);
      local _g_codepoint = _hx_1_cp_codepoint;
      local _g_position = _hx_1_cp_position;
      while (_g_codepoint ~= nil) do 
        local ret = _g_codepoint;
        local _hx_2_cp_position, _hx_2_cp_codepoint = _g_codes(_g_str, _g_position);
        _g_codepoint = _hx_2_cp_codepoint;
        _g_position = _hx_2_cp_position;
        local c = ret;
        if (c == 32) then 
          pos = pos + 1;
        else
          break;
        end;
      end;
    end;
    do return pos end;
  end;
  local pos = kwdEnd("if");
  if (pos > 0) then 
    local pos1 = pos;
    local len = __lua_lib_luautf8_Utf8.len(p) - pos;
    if ((len == nil) or (len > (pos1 + __lua_lib_luautf8_Utf8.len(p)))) then 
      len = __lua_lib_luautf8_Utf8.len(p);
    else
      if (len < 0) then 
        len = __lua_lib_luautf8_Utf8.len(p) + len;
      end;
    end;
    if (pos1 < 0) then 
      pos1 = __lua_lib_luautf8_Utf8.len(p) + pos1;
    end;
    if (pos1 < 0) then 
      pos1 = 0;
    end;
    p = __lua_lib_luautf8_Utf8.sub(p, pos1 + 1, pos1 + len);
    local e = self:parseExpr(p);
    local eif = self:parseBlock(tokens);
    local t = tokens:first();
    local eelse;
    if (t == nil) then 
      _G.error(__haxe_Exception.thrown("Unclosed 'if'"),0);
    end;
    if (t.p == "end") then 
      tokens:pop();
      eelse = nil;
    else
      if (t.p == "else") then 
        tokens:pop();
        eelse = self:parseBlock(tokens);
        t = tokens:pop();
        if ((t == nil) or (t.p ~= "end")) then 
          _G.error(__haxe_Exception.thrown("Unclosed 'else'"),0);
        end;
      else
        local _this = t.p;
        local pos = 4;
        local len = __lua_lib_luautf8_Utf8.len(t.p) - 4;
        if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(_this)))) then 
          len = __lua_lib_luautf8_Utf8.len(_this);
        else
          if (len < 0) then 
            len = __lua_lib_luautf8_Utf8.len(_this) + len;
          end;
        end;
        if (pos < 0) then 
          pos = __lua_lib_luautf8_Utf8.len(_this) + pos;
        end;
        if (pos < 0) then 
          pos = 0;
        end;
        t.p = __lua_lib_luautf8_Utf8.sub(_this, pos + 1, pos + len);
        eelse = self:parse(tokens);
      end;
    end;
    do return __haxe__Template_TemplateExpr.OpIf(e, eif, eelse) end;
  end;
  local pos = kwdEnd("foreach");
  if (pos >= 0) then 
    local pos1 = pos;
    local len = __lua_lib_luautf8_Utf8.len(p) - pos;
    if ((len == nil) or (len > (pos1 + __lua_lib_luautf8_Utf8.len(p)))) then 
      len = __lua_lib_luautf8_Utf8.len(p);
    else
      if (len < 0) then 
        len = __lua_lib_luautf8_Utf8.len(p) + len;
      end;
    end;
    if (pos1 < 0) then 
      pos1 = __lua_lib_luautf8_Utf8.len(p) + pos1;
    end;
    if (pos1 < 0) then 
      pos1 = 0;
    end;
    p = __lua_lib_luautf8_Utf8.sub(p, pos1 + 1, pos1 + len);
    local e = self:parseExpr(p);
    local efor = self:parseBlock(tokens);
    local t = tokens:pop();
    if ((t == nil) or (t.p ~= "end")) then 
      _G.error(__haxe_Exception.thrown("Unclosed 'foreach'"),0);
    end;
    do return __haxe__Template_TemplateExpr.OpForeach(e, efor) end;
  end;
  if (__haxe_Template.expr_splitter:match(p)) then 
    do return __haxe__Template_TemplateExpr.OpExpr(self:parseExpr(p)) end;
  end;
  do return __haxe__Template_TemplateExpr.OpVar(p) end
end
__haxe_Template.prototype.parseExpr = function(self,data) 
  local l = __haxe_ds_List.new();
  local expr = data;
  while (__haxe_Template.expr_splitter:match(data)) do 
    local p = __haxe_Template.expr_splitter:matchedPos();
    local k = p.pos + p.len;
    if (p.pos ~= 0) then 
      local pos = 0;
      local len = p.pos;
      if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(data)))) then 
        len = __lua_lib_luautf8_Utf8.len(data);
      else
        if (len < 0) then 
          len = __lua_lib_luautf8_Utf8.len(data) + len;
        end;
      end;
      if (pos < 0) then 
        pos = __lua_lib_luautf8_Utf8.len(data) + pos;
      end;
      if (pos < 0) then 
        pos = 0;
      end;
      l:add(_hx_o({__fields__={p=true,s=true},p=__lua_lib_luautf8_Utf8.sub(data, pos + 1, pos + len),s=true}));
    end;
    local p = __haxe_Template.expr_splitter:matched(0);
    local startIndex = nil;
    if (startIndex == nil) then 
      startIndex = 1;
    else
      startIndex = startIndex + 1;
    end;
    local r = __lua_lib_luautf8_Utf8.find(p, "\"", startIndex, true);
    l:add(_hx_o({__fields__={p=true,s=true},p=p,s=(function() 
      local _hx_1
      if ((r ~= nil) and (r > 0)) then 
      _hx_1 = r - 1; else 
      _hx_1 = -1; end
      return _hx_1
    end )() >= 0}));
    data = __haxe_Template.expr_splitter:matchedRight();
  end;
  if (__lua_lib_luautf8_Utf8.len(data) ~= 0) then 
    local _g_offset = 0;
    local _g_s = data;
    while (_g_offset < __lua_lib_luautf8_Utf8.len(_g_s)) do 
      local _g1_key = _g_offset;
      _g_offset = _g_offset + 1;
      local _g1_value = __lua_lib_luautf8_Utf8.byte(_g_s, (_g_offset - 1) + 1);
      local i = _g1_key;
      local c = _g1_value;
      if (c ~= 32) then 
        local pos = i;
        local len = nil;
        if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(data)))) then 
          len = __lua_lib_luautf8_Utf8.len(data);
        else
          if (len < 0) then 
            len = __lua_lib_luautf8_Utf8.len(data) + len;
          end;
        end;
        if (pos < 0) then 
          pos = __lua_lib_luautf8_Utf8.len(data) + pos;
        end;
        if (pos < 0) then 
          pos = 0;
        end;
        l:add(_hx_o({__fields__={p=true,s=true},p=__lua_lib_luautf8_Utf8.sub(data, pos + 1, pos + len),s=true}));
        break;
      end;
    end;
  end;
  local e;
  local _hx_status, _hx_result = pcall(function() 
  
      e = self:makeExpr(l);
      if (not l:isEmpty()) then 
        _G.error(__haxe_Exception.thrown(l:first().p),0);
      end;
    return _hx_pcall_default
  end)
  if not _hx_status and _hx_result == "_hx_pcall_break" then
  elseif not _hx_status then 
    local _g = _hx_result;
    local _g1 = __haxe_Exception.caught(_g):unwrap();
    if (__lua_Boot.__instanceof(_g1, String)) then 
      local s = _g1;
      _G.error(__haxe_Exception.thrown(Std.string(Std.string(Std.string("Unexpected '") .. Std.string(s)) .. Std.string("' in ")) .. Std.string(expr)),0);
    else
      _G.error(_g,0);
    end;
  elseif _hx_result ~= _hx_pcall_default then
    return _hx_result
  end;
  do return function() 
    local _hx_status, _hx_result = pcall(function() 
    
        do return e() end;
      return _hx_pcall_default
    end)
    if not _hx_status and _hx_result == "_hx_pcall_break" then
    elseif not _hx_status then 
      local _g = _hx_result;
      local exc = __haxe_Exception.caught(_g):unwrap();
      _G.error(__haxe_Exception.thrown(Std.string(Std.string(Std.string("Error : ") .. Std.string(Std.string(exc))) .. Std.string(" in ")) .. Std.string(expr)),0);
    elseif _hx_result ~= _hx_pcall_default then
      return _hx_result
    end;
  end end
end
__haxe_Template.prototype.makeConst = function(self,v) 
  __haxe_Template.expr_trim:match(v);
  v = __haxe_Template.expr_trim:matched(1);
  if (__lua_lib_luautf8_Utf8.byte(v, 1) == 34) then 
    local pos = 1;
    local len = __lua_lib_luautf8_Utf8.len(v) - 2;
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
    local str = __lua_lib_luautf8_Utf8.sub(v, pos + 1, pos + len);
    do return function() 
      do return str end;
    end end;
  end;
  if (__haxe_Template.expr_int:match(v)) then 
    local i = Std.parseInt(v);
    do return function() 
      do return i end;
    end end;
  end;
  if (__haxe_Template.expr_float:match(v)) then 
    local f = Std.parseFloat(v);
    do return function() 
      do return f end;
    end end;
  end;
  local me = self;
  do return function() 
    do return me:resolve(v) end;
  end end
end
__haxe_Template.prototype.makePath = function(self,e,l) 
  local p = l:first();
  if ((p == nil) or (p.p ~= ".")) then 
    do return e end;
  end;
  l:pop();
  local field = l:pop();
  if ((field == nil) or not field.s) then 
    _G.error(__haxe_Exception.thrown(field.p),0);
  end;
  local f = field.p;
  __haxe_Template.expr_trim:match(f);
  f = __haxe_Template.expr_trim:matched(1);
  do return self:makePath(function() 
    do return Reflect.field(e(), f) end;
  end, l) end
end
__haxe_Template.prototype.makeExpr = function(self,l) 
  do return self:makePath(self:makeExpr2(l), l) end
end
__haxe_Template.prototype.skipSpaces = function(self,l) 
  local p = l:first();
  while (p ~= nil) do 
    local s = p.p;
    local _g_codes = __lua_lib_luautf8_Utf8.codes(s);
    local _g_str = s;
    local _hx_1_cp_position, _hx_1_cp_codepoint = _g_codes(_g_str, 0);
    local _g_codepoint = _hx_1_cp_codepoint;
    local _g_position = _hx_1_cp_position;
    while (_g_codepoint ~= nil) do 
      local ret = _g_codepoint;
      local _hx_2_cp_position, _hx_2_cp_codepoint = _g_codes(_g_str, _g_position);
      _g_codepoint = _hx_2_cp_codepoint;
      _g_position = _hx_2_cp_position;
      local c = ret;
      if (c ~= 32) then 
        do return end;
      end;
    end;
    l:pop();
    p = l:first();
  end;
end
__haxe_Template.prototype.makeExpr2 = function(self,l) 
  self:skipSpaces(l);
  local p = l:pop();
  self:skipSpaces(l);
  if (p == nil) then 
    _G.error(__haxe_Exception.thrown("<eof>"),0);
  end;
  if (p.s) then 
    do return self:makeConst(p.p) end;
  end;
  local _g = p.p;
  if (_g) == "!" then 
    local e = self:makeExpr(l);
    do return function() 
      local v = e();
      if (v ~= nil) then 
        do return v == false end;
      else
        do return true end;
      end;
    end end;
  elseif (_g) == "(" then 
    self:skipSpaces(l);
    local e1 = self:makeExpr(l);
    self:skipSpaces(l);
    local p = l:pop();
    if ((p == nil) or p.s) then 
      _G.error(__haxe_Exception.thrown(p),0);
    end;
    if (p.p == ")") then 
      do return e1 end;
    end;
    self:skipSpaces(l);
    local e2 = self:makeExpr(l);
    self:skipSpaces(l);
    local p2 = l:pop();
    self:skipSpaces(l);
    if ((p2 == nil) or (p2.p ~= ")")) then 
      _G.error(__haxe_Exception.thrown(p2),0);
    end;
    local _g = p.p;
    if (_g) == "!=" then 
      do return function() 
        do return e1() ~= e2() end;
      end end;
    elseif (_g) == "&&" then 
      do return function() 
        do return e1() and e2() end;
      end end;
    elseif (_g) == "*" then 
      do return function() 
        do return e1() * e2() end;
      end end;
    elseif (_g) == "+" then 
      do return function() 
        do return _hx_dyn_add(e1(),e2()) end;
      end end;
    elseif (_g) == "-" then 
      do return function() 
        do return e1() - e2() end;
      end end;
    elseif (_g) == "/" then 
      do return function() 
        do return e1() / e2() end;
      end end;
    elseif (_g) == "<" then 
      do return function() 
        do return e1() < e2() end;
      end end;
    elseif (_g) == "<=" then 
      do return function() 
        do return e1() <= e2() end;
      end end;
    elseif (_g) == "==" then 
      do return function() 
        do return e1() == e2() end;
      end end;
    elseif (_g) == ">" then 
      do return function() 
        do return e1() > e2() end;
      end end;
    elseif (_g) == ">=" then 
      do return function() 
        do return e1() >= e2() end;
      end end;
    elseif (_g) == "||" then 
      do return function() 
        do return e1() or e2() end;
      end end;else
    _G.error(__haxe_Exception.thrown(Std.string("Unknown operation ") .. Std.string(p.p)),0); end;
  elseif (_g) == "-" then 
    local e = self:makeExpr(l);
    do return function() 
      do return -e() end;
    end end; end;
  _G.error(__haxe_Exception.thrown(p.p),0);
end
__haxe_Template.prototype.run = function(self,e) 
  local tmp = e[1];
  if (tmp) == 0 then 
    local v = e[2];
    local _this = self.buf;
    local str = Std.string(self:resolve(v));
    _G.table.insert(_this.b, str);
    local _this = _this;
    _this.length = _this.length + __lua_lib_luautf8_Utf8.len(str);
  elseif (tmp) == 1 then 
    local e = e[2];
    local _this = self.buf;
    local str = Std.string(e());
    _G.table.insert(_this.b, str);
    local _this = _this;
    _this.length = _this.length + __lua_lib_luautf8_Utf8.len(str);
  elseif (tmp) == 2 then 
    local e1 = e[2];
    local eif = e[3];
    local eelse = e[4];
    local v = e1();
    if ((v == nil) or (v == false)) then 
      if (eelse ~= nil) then 
        self:run(eelse);
      end;
    else
      self:run(eif);
    end;
  elseif (tmp) == 3 then 
    local str = e[2];
    local _this = self.buf;
    local str = Std.string(str);
    _G.table.insert(_this.b, str);
    local _this = _this;
    _this.length = _this.length + __lua_lib_luautf8_Utf8.len(str);
  elseif (tmp) == 4 then 
    local l = e[2];
    local _g_head = l.h;
    while (_g_head ~= nil) do 
      local val = _g_head.item;
      _g_head = _g_head.next;
      local e = val;
      self:run(e);
    end;
  elseif (tmp) == 5 then 
    local e1 = e[2];
    local loop = e[3];
    local v = e1();
    local _hx_status, _hx_result = pcall(function() 
    
        local x = v:iterator();
        if (x.hasNext == nil) then 
          _G.error(__haxe_Exception.thrown(nil),0);
        end;
        v = x;
      return _hx_pcall_default
    end)
    if not _hx_status and _hx_result == "_hx_pcall_break" then
    elseif not _hx_status then 
      local _g = _hx_result;
      local _hx_status, _hx_result = pcall(function() 
      
          if (v.hasNext == nil) then 
            _G.error(__haxe_Exception.thrown(nil),0);
          end;
        return _hx_pcall_default
      end)
      if not _hx_status and _hx_result == "_hx_pcall_break" then
      elseif not _hx_status then 
        local _g = _hx_result;
        _G.error(__haxe_Exception.thrown(Std.string("Cannot iter on ") .. Std.string(Std.string(v))),0);
      elseif _hx_result ~= _hx_pcall_default then
        return _hx_result
      end;
    elseif _hx_result ~= _hx_pcall_default then
      return _hx_result
    end;
    self.stack:push(self.context);
    local v = v;
    local ctx = v;
    while (ctx:hasNext()) do 
      local ctx = ctx:next();
      self.context = ctx;
      self:run(loop);
    end;
    self.context = self.stack:pop();
  elseif (tmp) == 6 then 
    local m = e[2];
    local params = e[3];
    local v = Reflect.field(self.macros, m);
    local pl = Array.new();
    local old = self.buf;
    pl:push(_hx_bind(self,self.resolve));
    local _g_head = params.h;
    while (_g_head ~= nil) do 
      local val = _g_head.item;
      _g_head = _g_head.next;
      local p = val;
      if (p[1] == 0) then 
        local v = p[2];
        pl:push(self:resolve(v));
      else
        self.buf = StringBuf.new();
        self:run(p);
        pl:push(_G.table.concat(self.buf.b));
      end;
    end;
    self.buf = old;
    local _hx_status, _hx_result = pcall(function() 
    
        local _this = self.buf;
        local str = Std.string(Reflect.callMethod(self.macros,v,pl));
        _G.table.insert(_this.b, str);
        local _this = _this;
        _this.length = _this.length + __lua_lib_luautf8_Utf8.len(str);
      return _hx_pcall_default
    end)
    if not _hx_status and _hx_result == "_hx_pcall_break" then
    elseif not _hx_status then 
      local _g = _hx_result;
      local e = __haxe_Exception.caught(_g):unwrap();
      local plstr;
      local _hx_status, _hx_result = pcall(function() 
      
          plstr = pl:join(",");
        return _hx_pcall_default
      end)
      if not _hx_status and _hx_result == "_hx_pcall_break" then
      elseif not _hx_status then 
        local _g = _hx_result;
        plstr = "???";
      elseif _hx_result ~= _hx_pcall_default then
        return _hx_result
      end;
      local msg = Std.string(Std.string(Std.string(Std.string(Std.string(Std.string("Macro call ") .. Std.string(m)) .. Std.string("(")) .. Std.string(plstr)) .. Std.string(") failed (")) .. Std.string(Std.string(e))) .. Std.string(")");
      _G.error(__haxe_Exception.thrown(msg),0);
    elseif _hx_result ~= _hx_pcall_default then
      return _hx_result
    end; end;
end

__haxe_Template.prototype.__class__ =  __haxe_Template

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
__haxe_ValueException.prototype.unwrap = function(self) 
  do return self.value end
end

__haxe_ValueException.prototype.__class__ =  __haxe_ValueException
__haxe_ValueException.__super__ = __haxe_Exception
setmetatable(__haxe_ValueException.prototype,{__index=__haxe_Exception.prototype})
setmetatable(__haxe_ValueException.prototype.__properties__,{__index=__haxe_Exception.prototype.__properties__})

__haxe_ds_List.new = function() 
  local self = _hx_new(__haxe_ds_List.prototype)
  __haxe_ds_List.super(self)
  return self
end
__haxe_ds_List.super = function(self) 
  self.length = 0;
end
__haxe_ds_List.__name__ = true
__haxe_ds_List.prototype = _hx_e();
__haxe_ds_List.prototype.add = function(self,item) 
  local next = nil;
  local x = __haxe_ds__List_ListNode.new(item, next);
  if (self.h == nil) then 
    self.h = x;
  else
    self.q.next = x;
  end;
  self.q = x;
  self.length = self.length + 1;
end
__haxe_ds_List.prototype.push = function(self,item) 
  local x = __haxe_ds__List_ListNode.new(item, self.h);
  self.h = x;
  if (self.q == nil) then 
    self.q = x;
  end;
  self.length = self.length + 1;
end
__haxe_ds_List.prototype.first = function(self) 
  if (self.h == nil) then 
    do return nil end;
  else
    do return self.h.item end;
  end;
end
__haxe_ds_List.prototype.pop = function(self) 
  if (self.h == nil) then 
    do return nil end;
  end;
  local x = self.h.item;
  self.h = self.h.next;
  if (self.h == nil) then 
    self.q = nil;
  end;
  self.length = self.length - 1;
  do return x end
end
__haxe_ds_List.prototype.isEmpty = function(self) 
  do return self.h == nil end
end
__haxe_ds_List.prototype.toString = function(self) 
  local s_b = ({});
  local s_length = 0;
  local first = true;
  local l = self.h;
  local str = "{";
  _G.table.insert(s_b, str);
  s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
  while (l ~= nil) do 
    if (first) then 
      first = false;
    else
      local str = ", ";
      _G.table.insert(s_b, str);
      s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
    end;
    local str = Std.string(l.item);
    _G.table.insert(s_b, str);
    s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
    l = l.next;
  end;
  local str = "}";
  _G.table.insert(s_b, str);
  s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
  do return _G.table.concat(s_b) end
end

__haxe_ds_List.prototype.__class__ =  __haxe_ds_List

__haxe_ds__List_ListNode.new = function(item,next) 
  local self = _hx_new(__haxe_ds__List_ListNode.prototype)
  __haxe_ds__List_ListNode.super(self,item,next)
  return self
end
__haxe_ds__List_ListNode.super = function(self,item,next) 
  self.item = item;
  self.next = next;
end
__haxe_ds__List_ListNode.__name__ = true
__haxe_ds__List_ListNode.prototype = _hx_e();

__haxe_ds__List_ListNode.prototype.__class__ =  __haxe_ds__List_ListNode

__haxe_ds_StringMap.new = {}
__haxe_ds_StringMap.__name__ = true
__haxe_ds_StringMap.__interfaces__ = {__haxe_IMap}

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

__xrfragment_Filter.new = function(str) 
  local self = _hx_new(__xrfragment_Filter.prototype)
  __xrfragment_Filter.super(self,str)
  return self
end
__xrfragment_Filter.super = function(self,str) 
  self.q = _hx_e();
  self.str = "";
  if (str ~= nil) then 
    self:parse(str);
  end;
end
_hx_exports["xrfragment"]["Filter"] = __xrfragment_Filter
__xrfragment_Filter.__name__ = true
__xrfragment_Filter.prototype = _hx_e();
__xrfragment_Filter.prototype.toObject = function(self) 
  do return Reflect.copy(self.q) end
end
__xrfragment_Filter.prototype.get = function(self) 
  do return Reflect.copy(self.q) end
end
__xrfragment_Filter.prototype.parse = function(self,str) 
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
      if (__lua_lib_luautf8_Utf8.len("=") > 0) then 
        newidx = __lua_lib_luautf8_Utf8.find(str, "=", idx, true);
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
        idx = newidx + __lua_lib_luautf8_Utf8.len("=");
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
      if (__lua_lib_luautf8_Utf8.len("=") > 0) then 
        newidx = __lua_lib_luautf8_Utf8.find(str, "=", idx, true);
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
        idx = newidx + __lua_lib_luautf8_Utf8.len("=");
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
    if (__xrfragment_XRF.isProp:match(str)) then 
      local oper = "";
      local startIndex = nil;
      if (startIndex == nil) then 
        startIndex = 1;
      else
        startIndex = startIndex + 1;
      end;
      local r = __lua_lib_luautf8_Utf8.find(str, ">", startIndex, true);
      if ((function() 
        local _hx_1
        if ((r ~= nil) and (r > 0)) then 
        _hx_1 = r - 1; else 
        _hx_1 = -1; end
        return _hx_1
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
        local _hx_2
        if ((r ~= nil) and (r > 0)) then 
        _hx_2 = r - 1; else 
        _hx_2 = -1; end
        return _hx_2
      end )() ~= -1) then 
        oper = "<";
      end;
      if (__xrfragment_XRF.isExclude:match(k)) then 
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
      end;
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
      if (__lua_lib_luautf8_Utf8.len(oper) == 0) then 
        oper = "=";
      end;
      local rule = _hx_e();
      if (__xrfragment_XRF.isNumber:match(v)) then 
        local value = Std.parseFloat(v);
        rule[oper] = value;
      else
        rule[oper] = v;
      end;
      q.expr = rule;
    end;
    local value;
    if (__xrfragment_XRF.isDeep:match(str)) then 
      local idx = 1;
      local ret = _hx_tab_array({}, 0);
      while (idx ~= nil) do 
        local newidx = 0;
        if (__lua_lib_luautf8_Utf8.len("*") > 0) then 
          newidx = __lua_lib_luautf8_Utf8.find(k, "*", idx, true);
        else
          if (idx >= __lua_lib_luautf8_Utf8.len(k)) then 
            newidx = nil;
          else
            newidx = idx + 1;
          end;
        end;
        if (newidx ~= nil) then 
          local match = __lua_lib_luautf8_Utf8.sub(k, idx, newidx - 1);
          ret:push(match);
          idx = newidx + __lua_lib_luautf8_Utf8.len("*");
        else
          ret:push(__lua_lib_luautf8_Utf8.sub(k, idx, __lua_lib_luautf8_Utf8.len(k)));
          idx = nil;
        end;
      end;
      value = ret.length - 1;
    else
      value = 0;
    end;
    q.deep = value;
    local value = (function() 
      local _hx_3
      if (__xrfragment_XRF.isExclude:match(str)) then 
      _hx_3 = false; else 
      _hx_3 = true; end
      return _hx_3
    end )();
    q.show = value;
    local value = __xrfragment_XRF.operators:replace(k, "");
    q.key = value;
    q.value = v;
  end;
  local _g = 0;
  local _g1 = token.length;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    process(token[i]);
  end;
  self.q = q do return self.q end
end
__xrfragment_Filter.prototype.test = function(self,obj) 
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
__xrfragment_Filter.prototype.testProperty = function(self,property,value,exclude) 
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
  if (Reflect.field(self.q, "expr")) then 
    local f = Reflect.field(self.q, "expr");
    if (not Reflect.field(self.q, "show")) then 
      if (((Reflect.field(f, "!=") ~= nil) and testprop(Std.string(value) == Std.string(Reflect.field(f, "!=")))) and exclude) then 
        qualify = qualify + 1;
      end;
    else
      if ((Reflect.field(f, "*") ~= nil) and testprop(Std.parseFloat(value) ~= nil)) then 
        qualify = qualify + 1;
      end;
      if ((Reflect.field(f, ">") ~= nil) and testprop(Std.parseFloat(value) >= Std.parseFloat(Reflect.field(f, ">")))) then 
        qualify = qualify + 1;
      end;
      if ((Reflect.field(f, "<") ~= nil) and testprop(Std.parseFloat(value) <= Std.parseFloat(Reflect.field(f, "<")))) then 
        qualify = qualify + 1;
      end;
      if ((Reflect.field(f, "=") ~= nil) and (testprop(value == Reflect.field(f, "=")) or testprop(Std.parseFloat(value) == Std.parseFloat(Reflect.field(f, "="))))) then 
        qualify = qualify + 1;
      end;
    end;
  end;
  do return qualify > 0 end
end

__xrfragment_Filter.prototype.__class__ =  __xrfragment_Filter

__xrfragment_Parser.new = {}
_hx_exports["xrfragment"]["Parser"] = __xrfragment_Parser
__xrfragment_Parser.__name__ = true
__xrfragment_Parser.parse = function(key,value,store,index) 
  local Frag_h = ({});
  local value1 = _hx_bit.bor(_hx_bit.bor(__xrfragment_XRF.IMMUTABLE,__xrfragment_XRF.T_PREDEFINED_VIEW),__xrfragment_XRF.PV_EXECUTE);
  if (value1 == nil) then 
    Frag_h["#"] = __haxe_ds_StringMap.tnull;
  else
    Frag_h["#"] = value1;
  end;
  local value1 = __xrfragment_XRF.T_URL;
  if (value1 == nil) then 
    Frag_h.src = __haxe_ds_StringMap.tnull;
  else
    Frag_h.src = value1;
  end;
  local value1 = _hx_bit.bor(__xrfragment_XRF.T_URL,__xrfragment_XRF.T_PREDEFINED_VIEW);
  if (value1 == nil) then 
    Frag_h.href = __haxe_ds_StringMap.tnull;
  else
    Frag_h.href = value1;
  end;
  local value1 = _hx_bit.bor(__xrfragment_XRF.IMMUTABLE,__xrfragment_XRF.T_STRING);
  if (value1 == nil) then 
    Frag_h.tag = __haxe_ds_StringMap.tnull;
  else
    Frag_h.tag = value1;
  end;
  local value1 = _hx_bit.bor(_hx_bit.bor(_hx_bit.bor(_hx_bit.bor(__xrfragment_XRF.PV_OVERRIDE,__xrfragment_XRF.T_VECTOR3),__xrfragment_XRF.T_STRING),__xrfragment_XRF.METADATA),__xrfragment_XRF.NAVIGATOR);
  if (value1 == nil) then 
    Frag_h.pos = __haxe_ds_StringMap.tnull;
  else
    Frag_h.pos = value1;
  end;
  local value1 = _hx_bit.bor(_hx_bit.bor(_hx_bit.bor(_hx_bit.bor(__xrfragment_XRF.QUERY_OPERATOR,__xrfragment_XRF.PV_OVERRIDE),__xrfragment_XRF.T_VECTOR3),__xrfragment_XRF.METADATA),__xrfragment_XRF.NAVIGATOR);
  if (value1 == nil) then 
    Frag_h.rot = __haxe_ds_StringMap.tnull;
  else
    Frag_h.rot = value1;
  end;
  local value1 = _hx_bit.bor(_hx_bit.bor(_hx_bit.bor(_hx_bit.bor(__xrfragment_XRF.PV_OVERRIDE,__xrfragment_XRF.T_FLOAT),__xrfragment_XRF.T_VECTOR2),__xrfragment_XRF.NAVIGATOR),__xrfragment_XRF.METADATA);
  if (value1 == nil) then 
    Frag_h.t = __haxe_ds_StringMap.tnull;
  else
    Frag_h.t = value1;
  end;
  local value1 = _hx_bit.bor(__xrfragment_XRF.PV_OVERRIDE,__xrfragment_XRF.T_MEDIAFRAG);
  if (value1 == nil) then 
    Frag_h.s = __haxe_ds_StringMap.tnull;
  else
    Frag_h.s = value1;
  end;
  local value1 = _hx_bit.bor(__xrfragment_XRF.PV_OVERRIDE,__xrfragment_XRF.T_PREDEFINED_VIEW);
  if (value1 == nil) then 
    Frag_h.loop = __haxe_ds_StringMap.tnull;
  else
    Frag_h.loop = value1;
  end;
  local value1 = _hx_bit.bor(__xrfragment_XRF.T_VECTOR2,__xrfragment_XRF.T_MEDIAFRAG);
  if (value1 == nil) then 
    Frag_h.uv = __haxe_ds_StringMap.tnull;
  else
    Frag_h.uv = value1;
  end;
  local value1 = _hx_bit.bor(__xrfragment_XRF.IMMUTABLE,__xrfragment_XRF.T_STRING);
  if (value1 == nil) then 
    Frag_h.namespace = __haxe_ds_StringMap.tnull;
  else
    Frag_h.namespace = value1;
  end;
  local value1 = _hx_bit.bor(__xrfragment_XRF.IMMUTABLE,__xrfragment_XRF.T_STRING);
  if (value1 == nil) then 
    Frag_h.SPDX = __haxe_ds_StringMap.tnull;
  else
    Frag_h.SPDX = value1;
  end;
  local value1 = _hx_bit.bor(__xrfragment_XRF.IMMUTABLE,__xrfragment_XRF.T_STRING);
  if (value1 == nil) then 
    Frag_h.unit = __haxe_ds_StringMap.tnull;
  else
    Frag_h.unit = value1;
  end;
  local value1 = _hx_bit.bor(__xrfragment_XRF.IMMUTABLE,__xrfragment_XRF.T_STRING);
  if (value1 == nil) then 
    Frag_h.description = __haxe_ds_StringMap.tnull;
  else
    Frag_h.description = value1;
  end;
  local keyStripped = __xrfragment_XRF.operators:replace(key, "");
  local isPVDynamic = (__lua_lib_luautf8_Utf8.len(key) > 0) and (Frag_h[key] == nil);
  if (isPVDynamic) then 
    local v = __xrfragment_XRF.new(key, _hx_bit.bor(__xrfragment_XRF.PV_EXECUTE,__xrfragment_XRF.NAVIGATOR), index);
    v:validate(value);
    v.flags = __xrfragment_XRF.set(__xrfragment_XRF.T_DYNAMICKEY, v.flags);
    if (Frag_h[key] == nil) then 
      v.flags = __xrfragment_XRF.set(__xrfragment_XRF.CUSTOMFRAG, v.flags);
    end;
    if (__lua_lib_luautf8_Utf8.len(value) == 0) then 
      v.flags = __xrfragment_XRF.set(__xrfragment_XRF.T_DYNAMICKEYVALUE, v.flags);
    end;
    store[keyStripped] = v;
    do return true end;
  end;
  local ret = Frag_h[key];
  if (ret == __haxe_ds_StringMap.tnull) then 
    ret = nil;
  end;
  local v = __xrfragment_XRF.new(key, ret, index);
  if (Frag_h[key] ~= nil) then 
    if (not v:validate(value)) then 
      __haxe_Log.trace(Std.string(Std.string(Std.string(Std.string("⚠ fragment '") .. Std.string(key)) .. Std.string("' has incompatible value (")) .. Std.string(value)) .. Std.string(")"), _hx_o({__fields__={fileName=true,lineNumber=true,className=true,methodName=true},fileName="src/xrfragment/Parser.hx",lineNumber=67,className="xrfragment.Parser",methodName="parse"}));
      do return false end;
    end;
    store[keyStripped] = v;
    if (__xrfragment_Parser.debug) then 
      __haxe_Log.trace(Std.string(Std.string(Std.string("✔ ") .. Std.string(key)) .. Std.string(": ")) .. Std.string(v.string), _hx_o({__fields__={fileName=true,lineNumber=true,className=true,methodName=true},fileName="src/xrfragment/Parser.hx",lineNumber=71,className="xrfragment.Parser",methodName="parse"}));
    end;
  else
    if (__lua_Boot.__instanceof(value, String)) then 
      v:guessType(v, value);
    end;
    v.flags = __xrfragment_XRF.set(__xrfragment_XRF.CUSTOMFRAG, v.flags);
    store[keyStripped] = v;
  end;
  do return true end;
end
__xrfragment_Parser.getMetaData = function() 
  local meta = _hx_o({__fields__={title=true,description=true,author=true,publisher=true,website=true,license=true},title=_hx_tab_array({[0]="title", "og:title", "dc.title"}, 3),description=_hx_tab_array({[0]="aria-description", "og:description", "dc.description"}, 3),author=_hx_tab_array({[0]="author", "dc.creator"}, 2),publisher=_hx_tab_array({[0]="publisher", "dc.publisher"}, 2),website=_hx_tab_array({[0]="og:site_name", "og:url", "dc.publisher"}, 3),license=_hx_tab_array({[0]="SPDX", "dc.rights"}, 2)});
  do return meta end;
end

__xrfragment_URI.new = function() 
  local self = _hx_new(__xrfragment_URI.prototype)
  __xrfragment_URI.super(self)
  return self
end
__xrfragment_URI.super = function(self) 
  self.XRF = _hx_e();
  self.hash = _hx_e();
  self.fragment = "";
end
_hx_exports["xrfragment"]["URI"] = __xrfragment_URI
__xrfragment_URI.__name__ = true
__xrfragment_URI.parseFragment = function(url,filter) 
  local store = _hx_e();
  local tmp;
  if (url ~= nil) then 
    local startIndex = nil;
    if (startIndex == nil) then 
      startIndex = 1;
    else
      startIndex = startIndex + 1;
    end;
    local r = __lua_lib_luautf8_Utf8.find(url, "#", startIndex, true);
    tmp = (function() 
      local _hx_1
      if ((r ~= nil) and (r > 0)) then 
      _hx_1 = r - 1; else 
      _hx_1 = -1; end
      return _hx_1
    end )() == -1;
  else
    tmp = true;
  end;
  if (tmp) then 
    do return store end;
  end;
  local idx = 1;
  local ret = _hx_tab_array({}, 0);
  while (idx ~= nil) do 
    local newidx = 0;
    if (__lua_lib_luautf8_Utf8.len("#") > 0) then 
      newidx = __lua_lib_luautf8_Utf8.find(url, "#", idx, true);
    else
      if (idx >= __lua_lib_luautf8_Utf8.len(url)) then 
        newidx = nil;
      else
        newidx = idx + 1;
      end;
    end;
    if (newidx ~= nil) then 
      local match = __lua_lib_luautf8_Utf8.sub(url, idx, newidx - 1);
      ret:push(match);
      idx = newidx + __lua_lib_luautf8_Utf8.len("#");
    else
      ret:push(__lua_lib_luautf8_Utf8.sub(url, idx, __lua_lib_luautf8_Utf8.len(url)));
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
      if (__xrfragment_XRF.isVector:match(splitByEqual[1])) then 
        value = splitByEqual[1];
      else
        value = StringTools.urlDecode(regexPlus:split(splitByEqual[1]):join(" "));
      end;
    end;
    local ok = __xrfragment_Parser.parse(key, value, store, i);
  end;
  if ((filter ~= nil) and (filter ~= 0)) then 
    local _g = 0;
    local _g1 = Reflect.fields(store);
    while (_g < _g1.length) do 
      local key = _g1[_g];
      _g = _g + 1;
      local xrf = Reflect.field(store, key);
      if (not xrf:is(filter)) then 
        Reflect.deleteField(store, key);
      end;
    end;
  end;
  do return store end;
end
__xrfragment_URI.template = function(uri,vars) 
  local idx = 1;
  local ret = _hx_tab_array({}, 0);
  while (idx ~= nil) do 
    local newidx = 0;
    if (__lua_lib_luautf8_Utf8.len("#") > 0) then 
      newidx = __lua_lib_luautf8_Utf8.find(uri, "#", idx, true);
    else
      if (idx >= __lua_lib_luautf8_Utf8.len(uri)) then 
        newidx = nil;
      else
        newidx = idx + 1;
      end;
    end;
    if (newidx ~= nil) then 
      local match = __lua_lib_luautf8_Utf8.sub(uri, idx, newidx - 1);
      ret:push(match);
      idx = newidx + __lua_lib_luautf8_Utf8.len("#");
    else
      ret:push(__lua_lib_luautf8_Utf8.sub(uri, idx, __lua_lib_luautf8_Utf8.len(uri)));
      idx = nil;
    end;
  end;
  local parts = ret;
  if (parts.length == 1) then 
    do return uri end;
  end;
  local frag = parts[1];
  frag = StringTools.replace(frag, "{", "::");
  frag = StringTools.replace(frag, "}", "::");
  frag = __haxe_Template.new(frag):execute(vars);
  frag = StringTools.replace(frag, "null", "");
  parts[1] = frag;
  do return parts:join("#") end;
end
__xrfragment_URI.parse = function(stringUrl,flags) 
  local r = EReg.new("^(?:(?![^:@]+:[^:@/]*@)([^:/?#.]+):)?(?://)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:/?#]*)(?::(\\d*))?)(((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[?#]|$)))*/?)?([^?#/]*))(?:\\?([^#]*))?(?:#(.*))?)", "");
  local startIndex = nil;
  if (startIndex == nil) then 
    startIndex = 1;
  else
    startIndex = startIndex + 1;
  end;
  local r1 = __lua_lib_luautf8_Utf8.find(stringUrl, "://", startIndex, true);
  if (((function() 
    local _hx_1
    if ((r1 ~= nil) and (r1 > 0)) then 
    _hx_1 = r1 - 1; else 
    _hx_1 = -1; end
    return _hx_1
  end )() == -1) and (__lua_lib_luautf8_Utf8.sub(stringUrl, 1, 1) ~= "/")) then 
    stringUrl = Std.string("/") .. Std.string(stringUrl);
  end;
  r:match(stringUrl);
  local url = __xrfragment_URI.new();
  local _g = 0;
  local _g1 = __xrfragment_URI._parts.length;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    url[__xrfragment_URI._parts[i]] = r:matched(i);
  end;
  if (__xrfragment_URI.isRelative(url) == true) then 
    if ((url.directory == nil) and (url.host ~= nil)) then 
      url.file = url.host;
    end;
    url.host = "";
  end;
  url.hash = _hx_e();
  if ((url.fragment ~= nil) and (__lua_lib_luautf8_Utf8.len(url.fragment) > 0)) then 
    url.XRF = __xrfragment_URI.parseFragment(Std.string("#") .. Std.string(url.fragment), flags);
    local key;
    local _g = 0;
    local _g1 = Reflect.fields(url.XRF);
    while (_g < _g1.length) do 
      local key = _g1[_g];
      _g = _g + 1;
      local v = Reflect.field(url.XRF, key);
      local this1 = url.hash;
      local value = Reflect.field(v, "string");
      this1[key] = value;
    end;
  end;
  __xrfragment_URI.computeVars(url);
  do return url end;
end
__xrfragment_URI.computeVars = function(url) 
  local r = EReg.new("//", "g");
  local tmp;
  if (url.directory ~= nil) then 
    local _this = url.directory;
    local startIndex = nil;
    if (startIndex == nil) then 
      startIndex = 1;
    else
      startIndex = startIndex + 1;
    end;
    local r = __lua_lib_luautf8_Utf8.find(_this, "//", startIndex, true);
    tmp = (function() 
      local _hx_1
      if ((r ~= nil) and (r > 0)) then 
      _hx_1 = r - 1; else 
      _hx_1 = -1; end
      return _hx_1
    end )() ~= -1;
  else
    tmp = false;
  end;
  if (tmp) then 
    url.directory = r:replace(url.directory, "/");
  end;
  local tmp;
  if (url.path ~= nil) then 
    local _this = url.path;
    local startIndex = nil;
    if (startIndex == nil) then 
      startIndex = 1;
    else
      startIndex = startIndex + 1;
    end;
    local r = __lua_lib_luautf8_Utf8.find(_this, "//", startIndex, true);
    tmp = (function() 
      local _hx_2
      if ((r ~= nil) and (r > 0)) then 
      _hx_2 = r - 1; else 
      _hx_2 = -1; end
      return _hx_2
    end )() ~= -1;
  else
    tmp = false;
  end;
  if (tmp) then 
    url.path = r:replace(url.path, "/");
  end;
  local tmp;
  if (url.file ~= nil) then 
    local _this = url.file;
    local startIndex = nil;
    if (startIndex == nil) then 
      startIndex = 1;
    else
      startIndex = startIndex + 1;
    end;
    local r = __lua_lib_luautf8_Utf8.find(_this, "//", startIndex, true);
    tmp = (function() 
      local _hx_3
      if ((r ~= nil) and (r > 0)) then 
      _hx_3 = r - 1; else 
      _hx_3 = -1; end
      return _hx_3
    end )() ~= -1;
  else
    tmp = false;
  end;
  if (tmp) then 
    url.file = r:replace(url.file, "/");
  end;
  url.URN = Std.string(Std.string(url.scheme) .. Std.string("://")) .. Std.string(url.host);
  if (url.port ~= nil) then 
    local url1 = url;
    url1.URN = Std.string(url1.URN) .. Std.string((Std.string(":") .. Std.string(url.port)));
  end;
  local url1 = url;
  url1.URN = Std.string(url1.URN) .. Std.string(url.directory);
  if (url.file ~= nil) then 
    local _this = url.file;
    local idx = 1;
    local ret = _hx_tab_array({}, 0);
    while (idx ~= nil) do 
      local newidx = 0;
      if (__lua_lib_luautf8_Utf8.len(".") > 0) then 
        newidx = __lua_lib_luautf8_Utf8.find(_this, ".", idx, true);
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
        idx = newidx + __lua_lib_luautf8_Utf8.len(".");
      else
        ret:push(__lua_lib_luautf8_Utf8.sub(_this, idx, __lua_lib_luautf8_Utf8.len(_this)));
        idx = nil;
      end;
    end;
    local parts = ret;
    if (parts.length > 1) then 
      url.fileExt = parts:pop();
    end;
  end;
end
__xrfragment_URI.toString = function(url) 
  local result = "";
  if (url.scheme ~= nil) then 
    result = Std.string(result) .. Std.string((Std.string(url.scheme) .. Std.string("://")));
  end;
  if (url.user ~= nil) then 
    result = Std.string(result) .. Std.string((Std.string(url.user) .. Std.string(":")));
  end;
  if (url.password ~= nil) then 
    result = Std.string(result) .. Std.string((Std.string(url.password) .. Std.string("@")));
  end;
  if (url.host ~= nil) then 
    result = Std.string(result) .. Std.string(url.host);
  end;
  if (url.port ~= nil) then 
    result = Std.string(result) .. Std.string((Std.string(":") .. Std.string(url.port)));
  end;
  if (url.directory ~= nil) then 
    result = Std.string(result) .. Std.string(url.directory);
  end;
  if (url.file ~= nil) then 
    result = Std.string(result) .. Std.string(url.file);
  end;
  if (url.query ~= nil) then 
    result = Std.string(result) .. Std.string((Std.string("?") .. Std.string(url.query)));
  end;
  if (url.fragment ~= nil) then 
    result = Std.string(result) .. Std.string((Std.string("#") .. Std.string(url.fragment)));
  end;
  do return result end;
end
__xrfragment_URI.appendURI = function(url,appendedURI) 
  if (__xrfragment_URI.isRelative(url) == true) then 
    do return __xrfragment_URI.appendToRelativeURI(url, appendedURI) end;
  else
    do return __xrfragment_URI.appendToAbsoluteURI(url, appendedURI) end;
  end;
end
__xrfragment_URI.isRelative = function(url) 
  do return url.scheme == nil end;
end
__xrfragment_URI.appendToRelativeURI = function(url,appendedURI) 
  if ((url.directory == nil) or (url.host == nil)) then 
    do return __xrfragment_URI.cloneURI(appendedURI) end;
  end;
  local resultURI = __xrfragment_URI.new();
  resultURI.host = url.host;
  resultURI.directory = url.directory;
  if (appendedURI.host ~= nil) then 
    local resultURI = resultURI;
    resultURI.directory = Std.string(resultURI.directory) .. Std.string(appendedURI.host);
  end;
  if (appendedURI.directory ~= nil) then 
    local directory = appendedURI.directory;
    if (appendedURI.host == nil) then 
      local resultURI = resultURI;
      local pos = 1;
      local len = nil;
      if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(directory)))) then 
        len = __lua_lib_luautf8_Utf8.len(directory);
      else
        if (len < 0) then 
          len = __lua_lib_luautf8_Utf8.len(directory) + len;
        end;
      end;
      if (pos < 0) then 
        pos = __lua_lib_luautf8_Utf8.len(directory) + pos;
      end;
      if (pos < 0) then 
        pos = 0;
      end;
      resultURI.directory = Std.string(resultURI.directory) .. Std.string(__lua_lib_luautf8_Utf8.sub(directory, pos + 1, pos + len));
    else
      local resultURI = resultURI;
      resultURI.directory = Std.string(resultURI.directory) .. Std.string(directory);
    end;
  end;
  if (appendedURI.file ~= nil) then 
    resultURI.file = appendedURI.file;
  end;
  resultURI.path = Std.string(resultURI.directory) .. Std.string(resultURI.file);
  if (appendedURI.query ~= nil) then 
    resultURI.query = appendedURI.query;
  end;
  if (appendedURI.fragment ~= nil) then 
    resultURI.fragment = appendedURI.fragment;
  end;
  do return resultURI end;
end
__xrfragment_URI.appendToAbsoluteURI = function(url,appendedURI) 
  local resultURI = __xrfragment_URI.new();
  if (url.scheme ~= nil) then 
    resultURI.scheme = url.scheme;
  end;
  if (url.host ~= nil) then 
    resultURI.host = url.host;
  end;
  local directory = "";
  if (url.directory ~= nil) then 
    directory = url.directory;
  end;
  if (appendedURI.host ~= nil) then 
    local appendedURI1 = appendedURI;
    appendedURI1.directory = Std.string(appendedURI1.directory) .. Std.string(appendedURI.host);
  end;
  if (appendedURI.directory ~= nil) then 
    directory = Std.string(directory) .. Std.string(appendedURI.directory);
  end;
  resultURI.directory = directory;
  if (appendedURI.file ~= nil) then 
    resultURI.file = appendedURI.file;
  end;
  resultURI.path = Std.string(resultURI.directory) .. Std.string(resultURI.file);
  if (appendedURI.query ~= nil) then 
    resultURI.query = appendedURI.query;
  end;
  if (appendedURI.fragment ~= nil) then 
    resultURI.fragment = appendedURI.fragment;
  end;
  do return resultURI end;
end
__xrfragment_URI.toAbsolute = function(url,newUrl) 
  local newURI = __xrfragment_URI.parse(newUrl, 0);
  local resultURI = __xrfragment_URI.new();
  resultURI.port = url.port;
  resultURI.source = newUrl;
  if (newURI.scheme ~= nil) then 
    resultURI.scheme = newURI.scheme;
  else
    resultURI.scheme = url.scheme;
  end;
  if ((newURI.host ~= nil) and (__lua_lib_luautf8_Utf8.len(newURI.host) > 0)) then 
    resultURI.host = newURI.host;
    resultURI.port = nil;
    resultURI.fragment = nil;
    resultURI.hash = _hx_e();
    resultURI.XRF = _hx_e();
    if (newURI.port ~= nil) then 
      resultURI.port = newURI.port;
    end;
  else
    resultURI.host = url.host;
  end;
  local directory = "";
  if (url.directory ~= nil) then 
    directory = url.directory;
  end;
  if (newURI.directory ~= nil) then 
    local tmp;
    if (__lua_lib_luautf8_Utf8.sub(newUrl, 1, 1) ~= "/") then 
      local startIndex = nil;
      if (startIndex == nil) then 
        startIndex = 1;
      else
        startIndex = startIndex + 1;
      end;
      local r = __lua_lib_luautf8_Utf8.find(newUrl, "://", startIndex, true);
      tmp = (function() 
        local _hx_1
        if ((r ~= nil) and (r > 0)) then 
        _hx_1 = r - 1; else 
        _hx_1 = -1; end
        return _hx_1
      end )() == -1;
    else
      tmp = false;
    end;
    if (tmp) then 
      directory = Std.string(directory) .. Std.string(newURI.directory);
    else
      directory = newURI.directory;
    end;
  end;
  resultURI.directory = directory;
  if (newURI.file ~= nil) then 
    resultURI.file = newURI.file;
  else
    resultURI.file = url.file;
  end;
  resultURI.path = Std.string(resultURI.directory) .. Std.string(resultURI.file);
  if (newURI.query ~= nil) then 
    resultURI.query = newURI.query;
  end;
  if (newURI.fragment ~= nil) then 
    resultURI.fragment = newURI.fragment;
  end;
  resultURI.hash = newURI.hash;
  resultURI.XRF = newURI.XRF;
  __xrfragment_URI.computeVars(resultURI);
  do return resultURI end;
end
__xrfragment_URI.cloneURI = function(url) 
  local clonedURI = __xrfragment_URI.new();
  clonedURI.url = url.url;
  clonedURI.source = url.source;
  clonedURI.scheme = url.scheme;
  clonedURI.authority = url.authority;
  clonedURI.userInfo = url.userInfo;
  clonedURI.password = url.password;
  clonedURI.host = url.host;
  clonedURI.port = url.port;
  clonedURI.relative = url.relative;
  clonedURI.path = url.path;
  clonedURI.directory = url.directory;
  clonedURI.file = url.file;
  clonedURI.query = url.query;
  clonedURI.fragment = url.fragment;
  do return clonedURI end;
end
__xrfragment_URI.prototype = _hx_e();

__xrfragment_URI.prototype.__class__ =  __xrfragment_URI

__xrfragment_XRF.new = function(_fragment,_flags,_index) 
  local self = _hx_new(__xrfragment_XRF.prototype)
  __xrfragment_XRF.super(self,_fragment,_flags,_index)
  return self
end
__xrfragment_XRF.super = function(self,_fragment,_flags,_index) 
  self.floats = Array.new();
  self.shift = Array.new();
  self.fragment = _fragment;
  self.flags = _flags;
  self.index = _index;
end
_hx_exports["xrfragment"]["XRF"] = __xrfragment_XRF
__xrfragment_XRF.__name__ = true
__xrfragment_XRF.set = function(flag,flags) 
  do return _hx_bit.bor(flags,flag) end;
end
__xrfragment_XRF.unset = function(flag,flags) 
  do return _hx_bit.band(flags,_hx_bit.bnot(flag)) end;
end
__xrfragment_XRF.prototype = _hx_e();
__xrfragment_XRF.prototype.is = function(self,flag) 
  if (not __lua_Boot.__instanceof(self.flags, Int)) then 
    self.flags = 0;
  end;
  do return (_hx_bit.band(self.flags,flag)) ~= 0 end
end
__xrfragment_XRF.prototype.validate = function(self,value) 
  self:guessType(self, value);
  local ok = true;
  if ((__lua_lib_luautf8_Utf8.len(value) == 0) and not self:is(__xrfragment_XRF.T_PREDEFINED_VIEW)) then 
    ok = false;
  end;
  if ((not self:is(__xrfragment_XRF.T_FLOAT) and self:is(__xrfragment_XRF.T_VECTOR2)) and not (__lua_Boot.__instanceof(self.x, Float) and __lua_Boot.__instanceof(self.y, Float))) then 
    ok = false;
  end;
  if ((not (self:is(__xrfragment_XRF.T_VECTOR2) or self:is(__xrfragment_XRF.T_STRING)) and self:is(__xrfragment_XRF.T_VECTOR3)) and not ((__lua_Boot.__instanceof(self.x, Float) and __lua_Boot.__instanceof(self.y, Float)) and __lua_Boot.__instanceof(self.z, Float))) then 
    ok = false;
  end;
  do return ok end
end
__xrfragment_XRF.prototype.guessType = function(self,v,str) 
  v.string = str;
  if (__xrfragment_XRF.isReset:match(v.fragment)) then 
    v.reset = true;
  end;
  if (v.fragment == "loop") then 
    v.loop = true;
  end;
  if (not __lua_Boot.__instanceof(str, String)) then 
    do return end;
  end;
  if (__lua_lib_luautf8_Utf8.len(str) > 0) then 
    if (__xrfragment_XRF.isXRFScheme:match(str)) then 
      v.xrfScheme = true;
      str = __xrfragment_XRF.isXRFScheme:replace(str, "");
      v.string = str;
    end;
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
      local xyzn = ret;
      if (xyzn.length > 0) then 
        v.x = Std.parseFloat(xyzn[0]);
      end;
      if (xyzn.length > 1) then 
        v.y = Std.parseFloat(xyzn[1]);
      end;
      if (xyzn.length > 2) then 
        v.z = Std.parseFloat(xyzn[2]);
      end;
      local _g = 0;
      local _g1 = xyzn.length;
      while (_g < _g1) do 
        _g = _g + 1;
        local i = _g - 1;
        v.shift:push(__xrfragment_XRF.isShift:match(xyzn[i]));
        v.floats:push(Std.parseFloat(__xrfragment_XRF.isShift:replace(xyzn[i], "")));
      end;
    end;
    if (__xrfragment_XRF.isColor:match(str)) then 
      v.color = str;
    end;
    if (__xrfragment_XRF.isFloat:match(str)) then 
      v.x = Std.parseFloat(str);
      v.float = v.x;
    end;
    if (__xrfragment_XRF.isInt:match(str)) then 
      v.int = Std.parseInt(str);
      v.x = v.int;
      v.floats:push(v.x);
    end;
    v.filter = __xrfragment_Filter.new(Std.string(Std.string(v.fragment) .. Std.string("=")) .. Std.string(v.string));
  else
    v.filter = __xrfragment_Filter.new(v.fragment);
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
  
  __haxe_Template.splitter = EReg.new("(::[A-Za-z0-9_ ()&|!+=/><*.\"-]+::|\\$\\$([A-Za-z0-9_-]+)\\()", "");
  
  __haxe_Template.expr_splitter = EReg.new("(\\(|\\)|[ \r\n\t]*\"[^\"]*\"[ \r\n\t]*|[!+=/><*.&|-]+)", "");
  
  __haxe_Template.expr_trim = EReg.new("^[ ]*([^ ]+)[ ]*$", "");
  
  __haxe_Template.expr_int = EReg.new("^[0-9]+$", "");
  
  __haxe_Template.expr_float = EReg.new("^([+-]?)(?=\\d|,\\d)\\d*(,\\d*)?([Ee]([+-]?\\d+))?$", "");
  
  __haxe_Template.globals = _hx_e();
  
  __haxe_Template.hxKeepArrayIterator = __haxe_iterators_ArrayIterator.new(_hx_tab_array({}, 0));
  
  __haxe_ds_StringMap.tnull = ({});
  
  __xrfragment_Parser.error = "";
  
  __xrfragment_Parser.debug = false;
  
  __xrfragment_URI.__meta__ = _hx_o({__fields__={statics=true},statics=_hx_o({__fields__={template=true},template=_hx_o({__fields__={keep=true},keep=nil})})});
  
  __xrfragment_URI._parts = _hx_tab_array({[0]="source", "scheme", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "fragment"}, 14);
  
  __xrfragment_XRF.IMMUTABLE = 1;
  
  __xrfragment_XRF.PROP_BIND = 2;
  
  __xrfragment_XRF.QUERY_OPERATOR = 4;
  
  __xrfragment_XRF.PROMPT = 8;
  
  __xrfragment_XRF.CUSTOMFRAG = 16;
  
  __xrfragment_XRF.NAVIGATOR = 32;
  
  __xrfragment_XRF.METADATA = 64;
  
  __xrfragment_XRF.PV_OVERRIDE = 128;
  
  __xrfragment_XRF.PV_EXECUTE = 256;
  
  __xrfragment_XRF.T_COLOR = 8192;
  
  __xrfragment_XRF.T_INT = 16384;
  
  __xrfragment_XRF.T_FLOAT = 32768;
  
  __xrfragment_XRF.T_VECTOR2 = 65536;
  
  __xrfragment_XRF.T_VECTOR3 = 131072;
  
  __xrfragment_XRF.T_URL = 262144;
  
  __xrfragment_XRF.T_PREDEFINED_VIEW = 524288;
  
  __xrfragment_XRF.T_STRING = 1048576;
  
  __xrfragment_XRF.T_MEDIAFRAG = 2097152;
  
  __xrfragment_XRF.T_DYNAMICKEY = 4194304;
  
  __xrfragment_XRF.T_DYNAMICKEYVALUE = 8388608;
  
  __xrfragment_XRF.isColor = EReg.new("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", "");
  
  __xrfragment_XRF.isInt = EReg.new("^[-0-9]+$", "");
  
  __xrfragment_XRF.isFloat = EReg.new("^[-0-9]+\\.[0-9]+$", "");
  
  __xrfragment_XRF.isVector = EReg.new("([,]+|\\w)", "");
  
  __xrfragment_XRF.isUrl = EReg.new("(://)?\\..*", "");
  
  __xrfragment_XRF.isUrlOrPretypedView = EReg.new("(^#|://)?\\..*", "");
  
  __xrfragment_XRF.isString = EReg.new(".*", "");
  
  __xrfragment_XRF.operators = EReg.new("(^[-]|^[!]|[\\*]$)", "g");
  
  __xrfragment_XRF.isProp = EReg.new("^.*=[><=]?", "");
  
  __xrfragment_XRF.isExclude = EReg.new("^-", "");
  
  __xrfragment_XRF.isDeep = EReg.new("\\*", "");
  
  __xrfragment_XRF.isNumber = EReg.new("^[0-9\\.]+$", "");
  
  __xrfragment_XRF.isMediaFrag = EReg.new("^([0-9\\.,\\*+-]+)$", "");
  
  __xrfragment_XRF.isReset = EReg.new("^!", "");
  
  __xrfragment_XRF.isShift = EReg.new("^(\\+|--)", "");
  
  __xrfragment_XRF.isXRFScheme = EReg.new("^xrf://", "");
  
  
end

_hx_bind = function(o,m)
  if m == nil then return nil end;
  local f;
  if o._hx__closures == nil then
    _G.rawset(o, '_hx__closures', {});
  else
    f = o._hx__closures[m];
  end
  if (f == nil) then
    f = function(...) return m(o, ...) end;
    o._hx__closures[m] = f;
  end
  return f;
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

_hx_dyn_add = function(a,b)
  if (_G.type(a) == 'string' or _G.type(b) == 'string') then
    return Std.string(a)..Std.string(b)
  else
    return a + b;
  end;
end;

_hx_static_init();
return _hx_exports
