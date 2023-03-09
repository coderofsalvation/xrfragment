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
local Date = _hx_e()
__lua_lib_lrexlib_Rex = _G.require("rex_pcre")
__lua_lib_luautf8_Utf8 = _G.require("lua-utf8")
local EReg = _hx_e()
___EnumValue_EnumValue_Impl_ = _hx_e()
local IntIterator = _hx_e()
local Lambda = _hx_e()
local Math = _hx_e()
local Reflect = _hx_e()
local String = _hx_e()
local Std = _hx_e()
local StringBuf = _hx_e()
__haxe_SysTools = _hx_e()
local StringTools = _hx_e()
local Sys = _hx_e()
local ValueType = _hx_e()
local Type = _hx_e()
__haxe_StackItem = _hx_e()
__haxe__CallStack_CallStack_Impl_ = _hx_e()
__haxe_IMap = _hx_e()
__haxe__DynamicAccess_DynamicAccess_Impl_ = _hx_e()
__haxe_Exception = _hx_e()
__haxe__Int32_Int32_Impl_ = _hx_e()
__haxe__Int64_Int64_Impl_ = _hx_e()
__haxe__Int64____Int64 = _hx_e()
__haxe_Int64Helper = _hx_e()
__haxe_NativeStackTrace = _hx_e()
__haxe__Rest_Rest_Impl_ = _hx_e()
__haxe_ValueException = _hx_e()
__haxe_ds_BalancedTree = _hx_e()
__haxe_ds_TreeNode = _hx_e()
__haxe_ds_EnumValueMap = _hx_e()
__haxe_ds__HashMap_HashMap_Impl_ = _hx_e()
__haxe_ds__HashMap_HashMapData = _hx_e()
__haxe_ds_IntMap = _hx_e()
__haxe_ds_List = _hx_e()
__haxe_ds__List_ListNode = _hx_e()
__haxe_ds__List_ListIterator = _hx_e()
__haxe_ds__List_ListKeyValueIterator = _hx_e()
__haxe_ds__Map_Map_Impl_ = _hx_e()
__haxe_ds_ObjectMap = _hx_e()
__haxe_ds__ReadOnlyArray_ReadOnlyArray_Impl_ = _hx_e()
__haxe_ds_StringMap = _hx_e()
__haxe_ds_WeakMap = _hx_e()
__haxe_exceptions_PosException = _hx_e()
__haxe_exceptions_NotImplementedException = _hx_e()
__haxe_io_Bytes = _hx_e()
__haxe_io_BytesBuffer = _hx_e()
__haxe_io_Encoding = _hx_e()
__haxe_io_Eof = _hx_e()
__haxe_io_Error = _hx_e()
__haxe_io_FPHelper = _hx_e()
__haxe_io_Input = _hx_e()
__haxe_io_Output = _hx_e()
__haxe_io_Path = _hx_e()
__haxe_iterators_ArrayIterator = _hx_e()
__haxe_iterators_ArrayKeyValueIterator = _hx_e()
__haxe_iterators_DynamicAccessIterator = _hx_e()
__haxe_iterators_DynamicAccessKeyValueIterator = _hx_e()
__haxe_iterators_HashMapKeyValueIterator = _hx_e()
__haxe_iterators_MapKeyValueIterator = _hx_e()
__haxe_iterators_RestIterator = _hx_e()
__haxe_iterators_RestKeyValueIterator = _hx_e()
__haxe_iterators_StringIterator = _hx_e()
__haxe_iterators_StringIteratorUnicode = _hx_e()
__haxe_iterators_StringKeyValueIterator = _hx_e()
__lua_Boot = _hx_e()
__lua_UserData = _hx_e()
__lua_HaxeIterator = _hx_e()
__lua__Io_IoType_Impl_ = _hx_e()
__lua_Lib = _hx_e()
__lua__NativeIterator_NativeIterator_Impl_ = _hx_e()
__lua_PairTools = _hx_e()
__lua_Thread = _hx_e()
__lua_lib_luv_Handle = _G.require("luv")
__lua_lib_luv_Loop = _G.require("luv")
__lua_lib_luv_Misc = _G.require("luv")
__lua_lib_luv_Os = _G.require("luv")
__lua_lib_luv_Stream = _G.require("luv")
__lua_lib_luv_Pipe = _G.require("luv")
__lua_lib_luv_Process = _G.require("luv")
__lua_lib_luv_Request = _G.require("luv")
__lua_lib_luv_Signal = _G.require("luv")
__lua_lib_luv_Thread = _G.require("luv")
__lua_lib_luv_Timer = _G.require("luv")
__lua_lib_luv_fs_FileSystem = _G.require("luv")
__lua_lib_luv_net_Tcp = _G.require("luv")
__sys_FileSystem = _hx_e()
__sys_io_FileInput = _hx_e()
__sys_io_FileOutput = _hx_e()
__sys_io_FileSeek = _hx_e()
__sys_io_Process = _hx_e()
__sys_io__Process_ProcessInput = _hx_e()
__sys_io__Process_ProcessOutput = _hx_e()
__xrfragment_Query = _hx_e()

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
_hxClasses["Array"] = Array
Array.__name__ = "Array"
Array.prototype = _hx_e();
Array.prototype.length= nil;
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

Date.new = function(year,month,day,hour,min,sec) 
  local self = _hx_new(Date.prototype)
  Date.super(self,year,month,day,hour,min,sec)
  return self
end
Date.super = function(self,year,month,day,hour,min,sec) 
  self.t = _G.os.time(_hx_o({__fields__={year=true,month=true,day=true,hour=true,min=true,sec=true},year=year,month=month + 1,day=day,hour=hour,min=min,sec=sec}));
  self.d = _G.os.date("*t", self.t);
  self.dUTC = _G.os.date("!*t", self.t);
end
_hxClasses["Date"] = Date
Date.__name__ = "Date"
Date.now = function() 
  local t = _G.os.time() * 1000;
  local d = _hx_e();
  _G.setmetatable(d, _hx_o({__fields__={__index=true},__index=Date.prototype}));
  d.t = t / 1000;
  d.d = _G.os.date("*t", Std.int(d.t));
  d.dUTC = _G.os.date("!*t", Std.int(d.t));
  do return d end;
end
Date.fromTime = function(t) 
  local d = _hx_e();
  _G.setmetatable(d, _hx_o({__fields__={__index=true},__index=Date.prototype}));
  d.t = t / 1000;
  d.d = _G.os.date("*t", Std.int(d.t));
  d.dUTC = _G.os.date("!*t", Std.int(d.t));
  do return d end;
end
Date.fromString = function(s) 
  do return __lua_Boot.strDate(s) end;
end
Date.prototype = _hx_e();
Date.prototype.d= nil;
Date.prototype.dUTC= nil;
Date.prototype.t= nil;
Date.prototype.getTime = function(self) 
  do return self.t * 1000 end
end
Date.prototype.getHours = function(self) 
  do return self.d.hour end
end
Date.prototype.getMinutes = function(self) 
  do return self.d.min end
end
Date.prototype.getSeconds = function(self) 
  do return self.d.sec end
end
Date.prototype.getFullYear = function(self) 
  do return self.d.year end
end
Date.prototype.getMonth = function(self) 
  do return self.d.month - 1 end
end
Date.prototype.getDate = function(self) 
  do return self.d.day end
end
Date.prototype.getDay = function(self) 
  do return self.d.wday - 1 end
end
Date.prototype.getUTCHours = function(self) 
  do return self.dUTC.hour end
end
Date.prototype.getUTCMinutes = function(self) 
  do return self.dUTC.min end
end
Date.prototype.getUTCSeconds = function(self) 
  do return self.dUTC.sec end
end
Date.prototype.getUTCFullYear = function(self) 
  do return self.dUTC.year end
end
Date.prototype.getUTCMonth = function(self) 
  do return self.dUTC.month - 1 end
end
Date.prototype.getUTCDate = function(self) 
  do return self.dUTC.day end
end
Date.prototype.getUTCDay = function(self) 
  do return self.dUTC.wday - 1 end
end
Date.prototype.getTimezoneOffset = function(self) 
  local tUTC = _G.os.time(self.dUTC);
  do return Std.int((tUTC - self.t) / 60) end
end
Date.prototype.toString = function(self) 
  do return __lua_Boot.dateStr(self) end
end

Date.prototype.__class__ =  Date

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
_hxClasses["EReg"] = EReg
EReg.__name__ = "EReg"
EReg.escape = function(s) 
  do return EReg.escapeRegExpRe:map(s, function(r) 
    do return Std.string("\\") .. Std.string(r:matched(0)) end;
  end) end;
end
EReg.prototype = _hx_e();
EReg.prototype.r= nil;
EReg.prototype.global= nil;
EReg.prototype.s= nil;
EReg.prototype.m= nil;
EReg.prototype.match = function(self,s) 
  if (s == nil) then 
    do return false end;
  else
    self.m = _hx_table.pack(self.r:exec(s, 1));
    self.s = s;
    do return self.m[1] ~= nil end;
  end;
end
EReg.prototype.matchFromByte = function(self,s,offset) 
  if (s == nil) then 
    do return false end;
  end;
  self.m = _hx_table.pack(self.r:exec(s, offset));
  self.s = s;
  do return self.m[1] ~= nil end
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
EReg.prototype.matchSub = function(self,s,pos,len) 
  if (len == nil) then 
    len = -1;
  end;
  local pos1 = 0;
  local len = (function() 
    local _hx_1
    if (len < 0) then 
    _hx_1 = __lua_lib_luautf8_Utf8.len(s); else 
    _hx_1 = pos + len; end
    return _hx_1
  end )();
  if ((len == nil) or (len > (pos1 + __lua_lib_luautf8_Utf8.len(s)))) then 
    len = __lua_lib_luautf8_Utf8.len(s);
  else
    if (len < 0) then 
      len = __lua_lib_luautf8_Utf8.len(s) + len;
    end;
  end;
  if (pos1 < 0) then 
    pos1 = __lua_lib_luautf8_Utf8.len(s) + pos1;
  end;
  if (pos1 < 0) then 
    pos1 = 0;
  end;
  local ss = __lua_lib_luautf8_Utf8.sub(s, pos1 + 1, pos1 + len);
  if (self.global) then 
    self.m = _hx_table.pack(self.r:exec(ss, pos + 1));
    local b = self.m[1] ~= nil;
    if (b) then 
      self.s = s;
    end;
    do return b end;
  else
    self.m = _hx_table.pack(self.r:exec(ss, pos + 1));
    local b = self.m[1] ~= nil;
    if (b) then 
      self.s = s;
    end;
    do return b end;
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
EReg.prototype.map = function(self,s,f) 
  local bytesOffset = 1;
  local buf_b = ({});
  local buf_length = 0;
  while (true) do 
    if (bytesOffset > _G.string.len(s)) then 
      break;
    else
      local tmp;
      if (s == nil) then 
        tmp = false;
      else
        self.m = _hx_table.pack(self.r:exec(s, bytesOffset));
        self.s = s;
        tmp = self.m[1] ~= nil;
      end;
      if (not tmp) then 
        local str = Std.string(_G.string.sub(s, bytesOffset));
        _G.table.insert(buf_b, str);
        buf_length = buf_length + __lua_lib_luautf8_Utf8.len(str);
        break;
      end;
    end;
    local pos = self.m[1];
    local length = self.m[2] - self.m[1];
    local str = Std.string(_G.string.sub(s, bytesOffset, pos - 1));
    _G.table.insert(buf_b, str);
    buf_length = buf_length + __lua_lib_luautf8_Utf8.len(str);
    local str = Std.string(f(self));
    _G.table.insert(buf_b, str);
    buf_length = buf_length + __lua_lib_luautf8_Utf8.len(str);
    if (length < 0) then 
      local charBytes = _G.string.len(__lua_lib_luautf8_Utf8.sub(_G.string.sub(s, pos), 1, 1));
      local str = Std.string(_G.string.sub(s, pos, (pos + charBytes) - 1));
      _G.table.insert(buf_b, str);
      buf_length = buf_length + __lua_lib_luautf8_Utf8.len(str);
      bytesOffset = pos + charBytes;
    else
      bytesOffset = self.m[2] + 1;
    end;
    if (not self.global) then 
      break;
    end;
  end;
  if ((not self.global and (bytesOffset > 1)) and ((bytesOffset - 1) < _G.string.len(s))) then 
    local str = Std.string(_G.string.sub(s, bytesOffset));
    _G.table.insert(buf_b, str);
    buf_length = buf_length + __lua_lib_luautf8_Utf8.len(str);
  end;
  do return _G.table.concat(buf_b) end
end
EReg.prototype.map_old = function(self,s,f) 
  local offset = 0;
  local buf_b = ({});
  local buf_length = 0;
  while (true) do 
    if (offset >= __lua_lib_luautf8_Utf8.len(s)) then 
      break;
    else
      if (not self:matchSub(s, offset)) then 
        local pos = offset;
        local len = nil;
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
        local str = Std.string(__lua_lib_luautf8_Utf8.sub(s, pos + 1, pos + len));
        _G.table.insert(buf_b, str);
        buf_length = buf_length + __lua_lib_luautf8_Utf8.len(str);
        break;
      end;
    end;
    local p = self:matchedPos();
    local pos = offset;
    local len = p.pos - offset;
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
    local str = Std.string(__lua_lib_luautf8_Utf8.sub(s, pos + 1, pos + len));
    _G.table.insert(buf_b, str);
    buf_length = buf_length + __lua_lib_luautf8_Utf8.len(str);
    local str = Std.string(f(self));
    _G.table.insert(buf_b, str);
    buf_length = buf_length + __lua_lib_luautf8_Utf8.len(str);
    if (p.len == 0) then 
      local pos = p.pos;
      local len = 1;
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
      local str = Std.string(__lua_lib_luautf8_Utf8.sub(s, pos + 1, pos + len));
      _G.table.insert(buf_b, str);
      buf_length = buf_length + __lua_lib_luautf8_Utf8.len(str);
      offset = p.pos + 1;
    else
      offset = p.pos + p.len;
    end;
    if (not self.global) then 
      break;
    end;
  end;
  if ((not self.global and (offset > 0)) and (offset < __lua_lib_luautf8_Utf8.len(s))) then 
    local pos = offset;
    local len = nil;
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
    local str = Std.string(__lua_lib_luautf8_Utf8.sub(s, pos + 1, pos + len));
    _G.table.insert(buf_b, str);
    buf_length = buf_length + __lua_lib_luautf8_Utf8.len(str);
  end;
  do return _G.table.concat(buf_b) end
end

EReg.prototype.__class__ =  EReg

___EnumValue_EnumValue_Impl_.new = {}
_hxClasses["_EnumValue.EnumValue_Impl_"] = ___EnumValue_EnumValue_Impl_
___EnumValue_EnumValue_Impl_.__name__ = "_EnumValue.EnumValue_Impl_"
___EnumValue_EnumValue_Impl_.match = function(this1,pattern) 
  do return false end;
end

IntIterator.new = function(min,max) 
  local self = _hx_new(IntIterator.prototype)
  IntIterator.super(self,min,max)
  return self
end
IntIterator.super = function(self,min,max) 
  self.min = min;
  self.max = max;
end
_hxClasses["IntIterator"] = IntIterator
IntIterator.__name__ = "IntIterator"
IntIterator.prototype = _hx_e();
IntIterator.prototype.min= nil;
IntIterator.prototype.max= nil;
IntIterator.prototype.hasNext = function(self) 
  do return self.min < self.max end
end
IntIterator.prototype.next = function(self) 
  do return (function() 
  local _hx_obj = self;
  local _hx_fld = 'min';
  local _ = _hx_obj[_hx_fld];
  _hx_obj[_hx_fld] = _hx_obj[_hx_fld]  + 1;
   return _;
   end)() end
end

IntIterator.prototype.__class__ =  IntIterator

Lambda.new = {}
_hxClasses["Lambda"] = Lambda
Lambda.__name__ = "Lambda"
Lambda.array = function(it) 
  local a = Array.new();
  local i = it:iterator();
  while (i:hasNext()) do 
    local i = i:next();
    a:push(i);
  end;
  do return a end;
end
Lambda.list = function(it) 
  local l = __haxe_ds_List.new();
  local i = it:iterator();
  while (i:hasNext()) do 
    local i = i:next();
    l:add(i);
  end;
  do return l end;
end
Lambda.map = function(it,f) 
  local _g = _hx_tab_array({}, 0);
  local x = it:iterator();
  while (x:hasNext()) do 
    local x = x:next();
    _g:push(f(x));
  end;
  do return _g end;
end
Lambda.mapi = function(it,f) 
  local i = 0;
  local _g = _hx_tab_array({}, 0);
  local x = it:iterator();
  while (x:hasNext()) do 
    local x = x:next();
    i = i + 1;
    _g:push(f(i - 1, x));
  end;
  do return _g end;
end
Lambda.flatten = function(it) 
  local _g = _hx_tab_array({}, 0);
  local e = it:iterator();
  while (e:hasNext()) do 
    local e = e:next();
    local x = e:iterator();
    while (x:hasNext()) do 
      local x = x:next();
      _g:push(x);
    end;
  end;
  do return _g end;
end
Lambda.flatMap = function(it,f) 
  local _g = _hx_tab_array({}, 0);
  local x = it:iterator();
  while (x:hasNext()) do 
    local x = x:next();
    _g:push(f(x));
  end;
  local _g1 = _hx_tab_array({}, 0);
  local e = _g:iterator();
  while (e:hasNext()) do 
    local e = e:next();
    local x = e:iterator();
    while (x:hasNext()) do 
      local x = x:next();
      _g1:push(x);
    end;
  end;
  do return _g1 end;
end
Lambda.has = function(it,elt) 
  local x = it:iterator();
  while (x:hasNext()) do 
    local x = x:next();
    if (x == elt) then 
      do return true end;
    end;
  end;
  do return false end;
end
Lambda.exists = function(it,f) 
  local x = it:iterator();
  while (x:hasNext()) do 
    local x = x:next();
    if (f(x)) then 
      do return true end;
    end;
  end;
  do return false end;
end
Lambda.foreach = function(it,f) 
  local x = it:iterator();
  while (x:hasNext()) do 
    local x = x:next();
    if (not f(x)) then 
      do return false end;
    end;
  end;
  do return true end;
end
Lambda.iter = function(it,f) 
  local x = it:iterator();
  while (x:hasNext()) do 
    local x = x:next();
    f(x);
  end;
end
Lambda.filter = function(it,f) 
  local _g = _hx_tab_array({}, 0);
  local x = it:iterator();
  while (x:hasNext()) do 
    local x = x:next();
    if (f(x)) then 
      _g:push(x);
    end;
  end;
  do return _g end;
end
Lambda.fold = function(it,f,first) 
  local x = it:iterator();
  while (x:hasNext()) do 
    local x = x:next();
    first = f(x, first);
  end;
  do return first end;
end
Lambda.foldi = function(it,f,first) 
  local i = 0;
  local x = it:iterator();
  while (x:hasNext()) do 
    local x = x:next();
    first = f(x, first, i);
    i = i + 1;
  end;
  do return first end;
end
Lambda.count = function(it,pred) 
  local n = 0;
  if (pred == nil) then 
    local _ = it:iterator();
    while (_:hasNext()) do 
      local _ = _:next();
      n = n + 1;
    end;
  else
    local x = it:iterator();
    while (x:hasNext()) do 
      local x = x:next();
      if (pred(x)) then 
        n = n + 1;
      end;
    end;
  end;
  do return n end;
end
Lambda.empty = function(it) 
  do return not it:iterator():hasNext() end;
end
Lambda.indexOf = function(it,v) 
  local i = 0;
  local v2 = it:iterator();
  while (v2:hasNext()) do 
    local v2 = v2:next();
    if (v == v2) then 
      do return i end;
    end;
    i = i + 1;
  end;
  do return -1 end;
end
Lambda.find = function(it,f) 
  local v = it:iterator();
  while (v:hasNext()) do 
    local v = v:next();
    if (f(v)) then 
      do return v end;
    end;
  end;
  do return nil end;
end
Lambda.findIndex = function(it,f) 
  local i = 0;
  local v = it:iterator();
  while (v:hasNext()) do 
    local v = v:next();
    if (f(v)) then 
      do return i end;
    end;
    i = i + 1;
  end;
  do return -1 end;
end
Lambda.concat = function(a,b) 
  local l = Array.new();
  local x = a:iterator();
  while (x:hasNext()) do 
    local x = x:next();
    l:push(x);
  end;
  local x = b:iterator();
  while (x:hasNext()) do 
    local x = x:next();
    l:push(x);
  end;
  do return l end;
end

Math.new = {}
_hxClasses["Math"] = Math
Math.__name__ = "Math"
Math.__properties__ = {get_NaN="get_NaN",get_POSITIVE_INFINITY="get_POSITIVE_INFINITY",get_NEGATIVE_INFINITY="get_NEGATIVE_INFINITY",get_PI="get_PI"}
Math.PI = nil
Math.get_PI = function() 
  do return _G.math.pi end;
end
Math.NEGATIVE_INFINITY = nil
Math.get_NEGATIVE_INFINITY = function() 
  do return -_G.math.huge end;
end
Math.POSITIVE_INFINITY = nil
Math.get_POSITIVE_INFINITY = function() 
  do return _G.math.huge end;
end
Math.NaN = nil
Math.get_NaN = function() 
  do return (0/0) end;
end
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
Math.abs = function(v) 
  do return _G.math.abs(v) end;
end
Math.acos = function(v) 
  do return _G.math.acos(v) end;
end
Math.asin = function(v) 
  do return _G.math.asin(v) end;
end
Math.atan = function(v) 
  do return _G.math.atan(v) end;
end
Math.ceil = function(v) 
  do return _G.math.ceil(v) end;
end
Math.cos = function(v) 
  do return _G.math.cos(v) end;
end
Math.exp = function(v) 
  do return _G.math.exp(v) end;
end
Math.sin = function(v) 
  do return _G.math.sin(v) end;
end
Math.sqrt = function(v) 
  do return _G.math.sqrt(v) end;
end
Math.tan = function(v) 
  do return _G.math.tan(v) end;
end
Math.floor = function(v) 
  do return _G.math.floor(v) end;
end
Math.log = function(v) 
  do return _G.math.log(v) end;
end
Math.random = function() 
  do return _G.math.random() end;
end
Math.atan2 = function(y,x) 
  do return _G.math.atan2(y, x) end;
end
Math.max = function(a,b) 
  if (Math.isNaN(a) or Math.isNaN(b)) then 
    do return (0/0) end;
  else
    do return _G.math.max(a, b) end;
  end;
end
Math.min = function(a,b) 
  if (Math.isNaN(a) or Math.isNaN(b)) then 
    do return (0/0) end;
  else
    do return _G.math.min(a, b) end;
  end;
end
Math.pow = function(v,exp) 
  do return _G.math.pow(v, exp) end;
end
Math.round = function(v) 
  do return _G.math.floor(v + 0.5) end;
end
Math.ffloor = function(v) 
  do return _G.math.floor(v) end;
end
Math.fceil = function(v) 
  do return _G.math.ceil(v) end;
end
Math.fround = function(v) 
  do return _G.math.floor(v + 0.5) end;
end

Reflect.new = {}
_hxClasses["Reflect"] = Reflect
Reflect.__name__ = "Reflect"
Reflect.hasField = function(o,field) 
  if ((_G.type(o) == "string") and ((String.prototype[field] ~= nil) or (field == "length"))) then 
    do return true end;
  else
    if (o.__fields__ ~= nil) then 
      do return o.__fields__[field] ~= nil end;
    else
      do return o[field] ~= nil end;
    end;
  end;
end
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
Reflect.setField = function(o,field,value) 
  o[field] = value;
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
Reflect.setProperty = function(o,field,value) 
  if ((o.__properties__ ~= nil) and o.__properties__[Std.string("set_") .. Std.string(field)]) then 
    local tmp = o.__properties__[Std.string("set_") .. Std.string(field)];
    Reflect.callMethod(o,Reflect.field(o, tmp),_hx_tab_array({[0]=value}, 1));
  else
    o[field] = value;
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
Reflect.isFunction = function(f) 
  if (_G.type(f) == "function") then 
    do return not ((function() 
      local _hx_1
      if (_G.type(f) ~= "table") then 
      _hx_1 = false; else 
      _hx_1 = f.__name__; end
      return _hx_1
    end )() or (function() 
      local _hx_2
      if (_G.type(f) ~= "table") then 
      _hx_2 = false; else 
      _hx_2 = f.__ename__; end
      return _hx_2
    end )()) end;
  else
    do return false end;
  end;
end
Reflect.compare = function(a,b) 
  if (a == b) then 
    do return 0 end;
  else
    if (a == nil) then 
      do return -1 end;
    else
      if (b == nil) then 
        do return 1 end;
      else
        if (a > b) then 
          do return 1 end;
        else
          do return -1 end;
        end;
      end;
    end;
  end;
end
Reflect.compareMethods = function(f1,f2) 
  do return f1 == f2 end;
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
Reflect.isEnumValue = function(v) 
  if ((v ~= nil) and __lua_Boot.__instanceof(v, _G.table)) then 
    do return v.__enum__ ~= nil end;
  else
    do return false end;
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
Reflect.makeVarArgs = function(f) 
  do return function(...)
			local a = {...}
			local b = {}
			local l = 0
			for k, v in pairs(a) do
				b[k-1] = v
				l = math.max(k,l)
			end
			return f(_hx_tab_array(b, l))
		end end;
end

String.new = function(string) 
  local self = _hx_new(String.prototype)
  String.super(self,string)
  self = string
  return self
end
String.super = function(self,string) 
end
_hxClasses["String"] = String
String.__name__ = "String"
String.__oldindex = nil
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
String.prototype.length= nil;
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
_hxClasses["Std"] = Std
Std.__name__ = "Std"
Std.is = function(v,t) 
  do return __lua_Boot.__instanceof(v, t) end;
end
Std.isOfType = function(v,t) 
  do return __lua_Boot.__instanceof(v, t) end;
end
Std.downcast = function(value,c) 
  if (__lua_Boot.__instanceof(value, c)) then 
    do return value end;
  else
    do return nil end;
  end;
end
Std.instance = function(value,c) 
  if (__lua_Boot.__instanceof(value, c)) then 
    do return value end;
  else
    do return nil end;
  end;
end
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
Std.random = function(x) 
  if (x <= 0) then 
    do return 0 end;
  else
    do return _G.math.floor(_G.math.random() * x) end;
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
_hxClasses["StringBuf"] = StringBuf
StringBuf.__name__ = "StringBuf"
StringBuf.prototype = _hx_e();
StringBuf.prototype.b= nil;
StringBuf.prototype.length= nil;
StringBuf.prototype.get_length = function(self) 
  do return self.length end
end
StringBuf.prototype.add = function(self,x) 
  local str = Std.string(x);
  _G.table.insert(self.b, str);
  local tmp = self;
  tmp.length = tmp.length + __lua_lib_luautf8_Utf8.len(str);
end
StringBuf.prototype.addChar = function(self,c) 
  _G.table.insert(self.b, __lua_lib_luautf8_Utf8.char(c));
  local tmp = self;
  tmp.length = tmp.length + 1;
end
StringBuf.prototype.addSub = function(self,s,pos,len) 
  local part;
  if (len == nil) then 
    local pos = pos;
    local len = nil;
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
    part = __lua_lib_luautf8_Utf8.sub(s, pos + 1, pos + len);
  else
    local pos = pos;
    local len = len;
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
    part = __lua_lib_luautf8_Utf8.sub(s, pos + 1, pos + len);
  end;
  _G.table.insert(self.b, part);
  local tmp = self;
  tmp.length = tmp.length + __lua_lib_luautf8_Utf8.len(part);
end
StringBuf.prototype.toString = function(self) 
  do return _G.table.concat(self.b) end
end

StringBuf.prototype.__class__ =  StringBuf

StringBuf.prototype.__properties__ =  {get_length="get_length"}

__haxe_SysTools.new = {}
_hxClasses["haxe.SysTools"] = __haxe_SysTools
__haxe_SysTools.__name__ = "haxe.SysTools"
__haxe_SysTools.quoteUnixArg = function(argument) 
  if (argument == "") then 
    do return "''" end;
  end;
  if (not EReg.new("[^a-zA-Z0-9_@%+=:,./-]", ""):match(argument)) then 
    do return argument end;
  end;
  do return Std.string(Std.string("'") .. Std.string(StringTools.replace(argument, "'", "'\"'\"'"))) .. Std.string("'") end;
end
__haxe_SysTools.quoteWinArg = function(argument,escapeMetaCharacters) 
  if (not EReg.new("^[^ \t\\\\\"]+$", ""):match(argument)) then 
    local result_b = ({});
    local result_length = 0;
    local needquote;
    local startIndex = nil;
    if (startIndex == nil) then 
      startIndex = 1;
    else
      startIndex = startIndex + 1;
    end;
    local r = __lua_lib_luautf8_Utf8.find(argument, " ", startIndex, true);
    if ((function() 
      local _hx_1
      if ((r ~= nil) and (r > 0)) then 
      _hx_1 = r - 1; else 
      _hx_1 = -1; end
      return _hx_1
    end )() == -1) then 
      local startIndex = nil;
      if (startIndex == nil) then 
        startIndex = 1;
      else
        startIndex = startIndex + 1;
      end;
      local r = __lua_lib_luautf8_Utf8.find(argument, "\t", startIndex, true);
      needquote = (function() 
        local _hx_2
        if ((r ~= nil) and (r > 0)) then 
        _hx_2 = r - 1; else 
        _hx_2 = -1; end
        return _hx_2
      end )() ~= -1;
    else
      needquote = true;
    end;
    local needquote = needquote or (argument == "");
    if (needquote) then 
      local str = "\"";
      _G.table.insert(result_b, str);
      result_length = result_length + __lua_lib_luautf8_Utf8.len(str);
    end;
    local bs_buf = StringBuf.new();
    local _g = 0;
    local _g1 = __lua_lib_luautf8_Utf8.len(argument);
    while (_g < _g1) do 
      _g = _g + 1;
      local i = _g - 1;
      local _g = __lua_lib_luautf8_Utf8.byte(argument, i + 1);
      local _g1 = _g;
      if (_g1) == 34 then 
        local bs = _G.table.concat(bs_buf.b);
        local str = Std.string(bs);
        _G.table.insert(result_b, str);
        result_length = result_length + __lua_lib_luautf8_Utf8.len(str);
        local str = Std.string(bs);
        _G.table.insert(result_b, str);
        result_length = result_length + __lua_lib_luautf8_Utf8.len(str);
        bs_buf = StringBuf.new();
        local str = "\\\"";
        _G.table.insert(result_b, str);
        result_length = result_length + __lua_lib_luautf8_Utf8.len(str);
      elseif (_g1) == 92 then 
        local str = "\\";
        _G.table.insert(bs_buf.b, str);
        local bs_buf = bs_buf;
        bs_buf.length = bs_buf.length + __lua_lib_luautf8_Utf8.len(str);else
      local c = _g;
      if (bs_buf.length > 0) then 
        local str = Std.string(_G.table.concat(bs_buf.b));
        _G.table.insert(result_b, str);
        result_length = result_length + __lua_lib_luautf8_Utf8.len(str);
        bs_buf = StringBuf.new();
      end;
      _G.table.insert(result_b, __lua_lib_luautf8_Utf8.char(c));
      result_length = result_length + 1; end;
    end;
    local str = Std.string(_G.table.concat(bs_buf.b));
    _G.table.insert(result_b, str);
    result_length = result_length + __lua_lib_luautf8_Utf8.len(str);
    if (needquote) then 
      local str = Std.string(_G.table.concat(bs_buf.b));
      _G.table.insert(result_b, str);
      result_length = result_length + __lua_lib_luautf8_Utf8.len(str);
      local str = "\"";
      _G.table.insert(result_b, str);
      result_length = result_length + __lua_lib_luautf8_Utf8.len(str);
    end;
    argument = _G.table.concat(result_b);
  end;
  if (escapeMetaCharacters) then 
    local result_b = ({});
    local result_length = 0;
    local _g = 0;
    local _g1 = __lua_lib_luautf8_Utf8.len(argument);
    while (_g < _g1) do 
      _g = _g + 1;
      local i = _g - 1;
      local c = __lua_lib_luautf8_Utf8.byte(argument, i + 1);
      if (__haxe_SysTools.winMetaCharacters:indexOf(c) >= 0) then 
        _G.table.insert(result_b, __lua_lib_luautf8_Utf8.char(94));
        result_length = result_length + 1;
      end;
      _G.table.insert(result_b, __lua_lib_luautf8_Utf8.char(c));
      result_length = result_length + 1;
    end;
    do return _G.table.concat(result_b) end;
  else
    do return argument end;
  end;
end

StringTools.new = {}
_hxClasses["StringTools"] = StringTools
StringTools.__name__ = "StringTools"
StringTools.urlEncode = function(s) 
  s = _G.string.gsub(s, "\n", "\r\n");
  s = _G.string.gsub(s, "([^%w %-%_%.%~])", function(c) 
    do return _G.string.format("%%%02X", Std.string(_G.string.byte(c)) .. Std.string("")) end;
  end);
  s = _G.string.gsub(s, " ", "+");
  do return s end;
end
StringTools.urlDecode = function(s) 
  s = _G.string.gsub(s, "+", " ");
  s = _G.string.gsub(s, "%%(%x%x)", function(h) 
    do return _G.string.char(_G.tonumber(h, 16)) end;
  end);
  s = _G.string.gsub(s, "\r\n", "\n");
  do return s end;
end
StringTools.htmlEscape = function(s,quotes) 
  local buf_b = ({});
  local buf_length = 0;
  local _g_offset = 0;
  local _g_s = s;
  while (_g_offset < __lua_lib_luautf8_Utf8.len(_g_s)) do 
    _g_offset = _g_offset + 1;
    local code = __lua_lib_luautf8_Utf8.byte(_g_s, (_g_offset - 1) + 1);
    local code1 = code;
    if (code1) == 34 then 
      if (quotes) then 
        local str = "&quot;";
        _G.table.insert(buf_b, str);
        buf_length = buf_length + __lua_lib_luautf8_Utf8.len(str);
      else
        _G.table.insert(buf_b, __lua_lib_luautf8_Utf8.char(code));
        buf_length = buf_length + 1;
      end;
    elseif (code1) == 38 then 
      local str = "&amp;";
      _G.table.insert(buf_b, str);
      buf_length = buf_length + __lua_lib_luautf8_Utf8.len(str);
    elseif (code1) == 39 then 
      if (quotes) then 
        local str = "&#039;";
        _G.table.insert(buf_b, str);
        buf_length = buf_length + __lua_lib_luautf8_Utf8.len(str);
      else
        _G.table.insert(buf_b, __lua_lib_luautf8_Utf8.char(code));
        buf_length = buf_length + 1;
      end;
    elseif (code1) == 60 then 
      local str = "&lt;";
      _G.table.insert(buf_b, str);
      buf_length = buf_length + __lua_lib_luautf8_Utf8.len(str);
    elseif (code1) == 62 then 
      local str = "&gt;";
      _G.table.insert(buf_b, str);
      buf_length = buf_length + __lua_lib_luautf8_Utf8.len(str);else
    _G.table.insert(buf_b, __lua_lib_luautf8_Utf8.char(code));
    buf_length = buf_length + 1; end;
  end;
  do return _G.table.concat(buf_b) end;
end
StringTools.htmlUnescape = function(s) 
  local idx = 1;
  local ret = _hx_tab_array({}, 0);
  while (idx ~= nil) do 
    local newidx = 0;
    if (__lua_lib_luautf8_Utf8.len("&gt;") > 0) then 
      newidx = __lua_lib_luautf8_Utf8.find(s, "&gt;", idx, true);
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
      idx = newidx + __lua_lib_luautf8_Utf8.len("&gt;");
    else
      ret:push(__lua_lib_luautf8_Utf8.sub(s, idx, __lua_lib_luautf8_Utf8.len(s)));
      idx = nil;
    end;
  end;
  local _this = ret:join(">");
  local idx = 1;
  local ret = _hx_tab_array({}, 0);
  while (idx ~= nil) do 
    local newidx = 0;
    if (__lua_lib_luautf8_Utf8.len("&lt;") > 0) then 
      newidx = __lua_lib_luautf8_Utf8.find(_this, "&lt;", idx, true);
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
      idx = newidx + __lua_lib_luautf8_Utf8.len("&lt;");
    else
      ret:push(__lua_lib_luautf8_Utf8.sub(_this, idx, __lua_lib_luautf8_Utf8.len(_this)));
      idx = nil;
    end;
  end;
  local _this = ret:join("<");
  local idx = 1;
  local ret = _hx_tab_array({}, 0);
  while (idx ~= nil) do 
    local newidx = 0;
    if (__lua_lib_luautf8_Utf8.len("&quot;") > 0) then 
      newidx = __lua_lib_luautf8_Utf8.find(_this, "&quot;", idx, true);
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
      idx = newidx + __lua_lib_luautf8_Utf8.len("&quot;");
    else
      ret:push(__lua_lib_luautf8_Utf8.sub(_this, idx, __lua_lib_luautf8_Utf8.len(_this)));
      idx = nil;
    end;
  end;
  local _this = ret:join("\"");
  local idx = 1;
  local ret = _hx_tab_array({}, 0);
  while (idx ~= nil) do 
    local newidx = 0;
    if (__lua_lib_luautf8_Utf8.len("&#039;") > 0) then 
      newidx = __lua_lib_luautf8_Utf8.find(_this, "&#039;", idx, true);
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
      idx = newidx + __lua_lib_luautf8_Utf8.len("&#039;");
    else
      ret:push(__lua_lib_luautf8_Utf8.sub(_this, idx, __lua_lib_luautf8_Utf8.len(_this)));
      idx = nil;
    end;
  end;
  local _this = ret:join("'");
  local idx = 1;
  local ret = _hx_tab_array({}, 0);
  while (idx ~= nil) do 
    local newidx = 0;
    if (__lua_lib_luautf8_Utf8.len("&amp;") > 0) then 
      newidx = __lua_lib_luautf8_Utf8.find(_this, "&amp;", idx, true);
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
      idx = newidx + __lua_lib_luautf8_Utf8.len("&amp;");
    else
      ret:push(__lua_lib_luautf8_Utf8.sub(_this, idx, __lua_lib_luautf8_Utf8.len(_this)));
      idx = nil;
    end;
  end;
  do return ret:join("&") end;
end
StringTools.contains = function(s,value) 
  local startIndex = nil;
  if (startIndex == nil) then 
    startIndex = 1;
  else
    startIndex = startIndex + 1;
  end;
  local tmp;
  if (value == "") then 
    tmp = String.indexOfEmpty(s, startIndex - 1);
  else
    local r = __lua_lib_luautf8_Utf8.find(s, value, startIndex, true);
    tmp = (function() 
      local _hx_1
      if ((r ~= nil) and (r > 0)) then 
      _hx_1 = r - 1; else 
      _hx_1 = -1; end
      return _hx_1
    end )();
  end;
  do return tmp ~= -1 end;
end
StringTools.startsWith = function(s,start) 
  if (__lua_lib_luautf8_Utf8.len(s) >= __lua_lib_luautf8_Utf8.len(start)) then 
    local startIndex = 0;
    local ret = -1;
    if (startIndex == nil) then 
      startIndex = __lua_lib_luautf8_Utf8.len(s);
    end;
    while (true) do 
      local startIndex1 = ret + 1;
      if (startIndex1 == nil) then 
        startIndex1 = 1;
      else
        startIndex1 = startIndex1 + 1;
      end;
      local p;
      if (start == "") then 
        p = String.indexOfEmpty(s, startIndex1 - 1);
      else
        local r = __lua_lib_luautf8_Utf8.find(s, start, startIndex1, true);
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
    do return ret == 0 end;
  else
    do return false end;
  end;
end
StringTools.endsWith = function(s,_end) 
  local elen = __lua_lib_luautf8_Utf8.len(_end);
  local slen = __lua_lib_luautf8_Utf8.len(s);
  if (slen >= elen) then 
    local startIndex = slen - elen;
    if (startIndex == nil) then 
      startIndex = 1;
    else
      startIndex = startIndex + 1;
    end;
    local tmp;
    if (_end == "") then 
      tmp = String.indexOfEmpty(s, startIndex - 1);
    else
      local r = __lua_lib_luautf8_Utf8.find(s, _end, startIndex, true);
      tmp = (function() 
        local _hx_1
        if ((r ~= nil) and (r > 0)) then 
        _hx_1 = r - 1; else 
        _hx_1 = -1; end
        return _hx_1
      end )();
    end;
    do return tmp == (slen - elen) end;
  else
    do return false end;
  end;
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
StringTools.lpad = function(s,c,l) 
  if (__lua_lib_luautf8_Utf8.len(c) <= 0) then 
    do return s end;
  end;
  local buf_b = ({});
  local buf_length = 0;
  l = l - __lua_lib_luautf8_Utf8.len(s);
  while (buf_length < l) do 
    local str = Std.string(c);
    _G.table.insert(buf_b, str);
    buf_length = buf_length + __lua_lib_luautf8_Utf8.len(str);
  end;
  local str = Std.string(s);
  _G.table.insert(buf_b, str);
  buf_length = buf_length + __lua_lib_luautf8_Utf8.len(str);
  do return _G.table.concat(buf_b) end;
end
StringTools.rpad = function(s,c,l) 
  if (__lua_lib_luautf8_Utf8.len(c) <= 0) then 
    do return s end;
  end;
  local buf_b = ({});
  local buf_length = 0;
  local str = Std.string(s);
  _G.table.insert(buf_b, str);
  buf_length = buf_length + __lua_lib_luautf8_Utf8.len(str);
  while (buf_length < l) do 
    local str = Std.string(c);
    _G.table.insert(buf_b, str);
    buf_length = buf_length + __lua_lib_luautf8_Utf8.len(str);
  end;
  do return _G.table.concat(buf_b) end;
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
StringTools.hex = function(n,digits) 
  local s = "";
  local hexChars = "0123456789ABCDEF";
  while (true) do 
    local index = _hx_bit.band(n,15);
    s = Std.string(__lua_lib_luautf8_Utf8.sub(hexChars, index + 1, index + 1)) .. Std.string(s);
    n = _hx_bit.rshift(n,4);
    if (not (n > 0)) then 
      break;
    end;
  end;
  if (digits ~= nil) then 
    while (__lua_lib_luautf8_Utf8.len(s) < digits) do 
      s = Std.string("0") .. Std.string(s);
    end;
  end;
  do return s end;
end
StringTools.fastCodeAt = function(s,index) 
  do return __lua_lib_luautf8_Utf8.byte(s, index + 1) end;
end
StringTools.unsafeCodeAt = function(s,index) 
  do return __lua_lib_luautf8_Utf8.byte(s, index + 1) end;
end
StringTools.iterator = function(s) 
  do return __haxe_iterators_StringIterator.new(s) end;
end
StringTools.keyValueIterator = function(s) 
  do return __haxe_iterators_StringKeyValueIterator.new(s) end;
end
StringTools.isEof = function(c) 
  do return c == nil end;
end
StringTools.quoteUnixArg = function(argument) 
  if (argument == "") then 
    do return "''" end;
  else
    if (not EReg.new("[^a-zA-Z0-9_@%+=:,./-]", ""):match(argument)) then 
      do return argument end;
    else
      do return Std.string(Std.string("'") .. Std.string(StringTools.replace(argument, "'", "'\"'\"'"))) .. Std.string("'") end;
    end;
  end;
end
StringTools.quoteWinArg = function(argument,escapeMetaCharacters) 
  local argument = argument;
  if (not EReg.new("^[^ \t\\\\\"]+$", ""):match(argument)) then 
    local result_b = ({});
    local result_length = 0;
    local needquote;
    local startIndex = nil;
    if (startIndex == nil) then 
      startIndex = 1;
    else
      startIndex = startIndex + 1;
    end;
    local r = __lua_lib_luautf8_Utf8.find(argument, " ", startIndex, true);
    if ((function() 
      local _hx_1
      if ((r ~= nil) and (r > 0)) then 
      _hx_1 = r - 1; else 
      _hx_1 = -1; end
      return _hx_1
    end )() == -1) then 
      local startIndex = nil;
      if (startIndex == nil) then 
        startIndex = 1;
      else
        startIndex = startIndex + 1;
      end;
      local r = __lua_lib_luautf8_Utf8.find(argument, "\t", startIndex, true);
      needquote = (function() 
        local _hx_2
        if ((r ~= nil) and (r > 0)) then 
        _hx_2 = r - 1; else 
        _hx_2 = -1; end
        return _hx_2
      end )() ~= -1;
    else
      needquote = true;
    end;
    local needquote = needquote or (argument == "");
    if (needquote) then 
      local str = "\"";
      _G.table.insert(result_b, str);
      result_length = result_length + __lua_lib_luautf8_Utf8.len(str);
    end;
    local bs_buf = StringBuf.new();
    local _g = 0;
    local _g1 = __lua_lib_luautf8_Utf8.len(argument);
    while (_g < _g1) do 
      _g = _g + 1;
      local i = _g - 1;
      local _g = __lua_lib_luautf8_Utf8.byte(argument, i + 1);
      local _g1 = _g;
      if (_g1) == 34 then 
        local bs = _G.table.concat(bs_buf.b);
        local str = Std.string(bs);
        _G.table.insert(result_b, str);
        result_length = result_length + __lua_lib_luautf8_Utf8.len(str);
        local str = Std.string(bs);
        _G.table.insert(result_b, str);
        result_length = result_length + __lua_lib_luautf8_Utf8.len(str);
        bs_buf = StringBuf.new();
        local str = "\\\"";
        _G.table.insert(result_b, str);
        result_length = result_length + __lua_lib_luautf8_Utf8.len(str);
      elseif (_g1) == 92 then 
        local str = "\\";
        _G.table.insert(bs_buf.b, str);
        local bs_buf = bs_buf;
        bs_buf.length = bs_buf.length + __lua_lib_luautf8_Utf8.len(str);else
      local c = _g;
      if (bs_buf.length > 0) then 
        local str = Std.string(_G.table.concat(bs_buf.b));
        _G.table.insert(result_b, str);
        result_length = result_length + __lua_lib_luautf8_Utf8.len(str);
        bs_buf = StringBuf.new();
      end;
      _G.table.insert(result_b, __lua_lib_luautf8_Utf8.char(c));
      result_length = result_length + 1; end;
    end;
    local str = Std.string(_G.table.concat(bs_buf.b));
    _G.table.insert(result_b, str);
    result_length = result_length + __lua_lib_luautf8_Utf8.len(str);
    if (needquote) then 
      local str = Std.string(_G.table.concat(bs_buf.b));
      _G.table.insert(result_b, str);
      result_length = result_length + __lua_lib_luautf8_Utf8.len(str);
      local str = "\"";
      _G.table.insert(result_b, str);
      result_length = result_length + __lua_lib_luautf8_Utf8.len(str);
    end;
    argument = _G.table.concat(result_b);
  end;
  if (escapeMetaCharacters) then 
    local result_b = ({});
    local result_length = 0;
    local _g = 0;
    local _g1 = __lua_lib_luautf8_Utf8.len(argument);
    while (_g < _g1) do 
      _g = _g + 1;
      local i = _g - 1;
      local c = __lua_lib_luautf8_Utf8.byte(argument, i + 1);
      if (__haxe_SysTools.winMetaCharacters:indexOf(c) >= 0) then 
        _G.table.insert(result_b, __lua_lib_luautf8_Utf8.char(94));
        result_length = result_length + 1;
      end;
      _G.table.insert(result_b, __lua_lib_luautf8_Utf8.char(c));
      result_length = result_length + 1;
    end;
    do return _G.table.concat(result_b) end;
  else
    do return argument end;
  end;
end

Sys.new = {}
_hxClasses["Sys"] = Sys
Sys.__name__ = "Sys"
Sys._system_name = nil
Sys.print = function(v) 
  _G.io.write(Std.string(v));
  _G.io.flush();
end
Sys.println = function(v) 
  _G.print(Std.string(v));
end
Sys.args = function() 
  local targs = __lua_PairTools.copy(_G.arg);
  local length = nil;
  local tab = __lua_PairTools.copy(targs);
  local length = length;
  local args;
  if (length == nil) then 
    length = _hx_table.maxn(tab);
    if (length > 0) then 
      local head = tab[1];
      _G.table.remove(tab, 1);
      tab[0] = head;
      args = _hx_tab_array(tab, length);
    else
      args = _hx_tab_array({}, 0);
    end;
  else
    args = _hx_tab_array(tab, length);
  end;
  do return args end;
end
Sys.command = function(cmd,args) 
  local p = __sys_io_Process.new(cmd, args);
  local code = p:exitCode();
  p:close();
  do return code end;
end
Sys.cpuTime = function() 
  do return _G.os.clock() end;
end
Sys.exit = function(code) 
  _G.os.exit(code);
end
Sys.getChar = function(echo) 
  do return __lua_lib_luautf8_Utf8.byte(_G.io.read(), 1) end;
end
Sys.getSystemName = function() 
  do return __lua_Boot.systemName() end;
end
Sys.systemName = function() 
  if (Sys._system_name == nil) then 
    Sys._system_name = Sys.getSystemName();
  end;
  do return Sys._system_name end;
end
Sys.environment = function() 
  local env = __lua_lib_luv_Os.os_environ();
  local obj = __haxe_ds_ObjectMap.new();
  __lua_PairTools.pairsFold(env, function(k,v,m) 
    obj.h[k] = v;
    obj.k[k] = true;
    do return obj end;
  end, obj);
  do return obj end;
end
Sys.executablePath = function() 
  do return __lua_lib_luv_Misc.exepath() end;
end
Sys.programPath = function() 
  do return __haxe_io_Path.join(_hx_tab_array({[0]=__lua_lib_luv_Misc.cwd(), _G.arg[0]}, 2)) end;
end
Sys.getCwd = function() 
  do return __lua_lib_luv_Misc.cwd() end;
end
Sys.setCwd = function(s) 
  __lua_lib_luv_Misc.chdir(s);
end
Sys.getEnv = function(s) 
  do return __lua_lib_luv_Os.os_getenv(s) end;
end
Sys.putEnv = function(s,v) 
  __lua_lib_luv_Os.os_setenv(s, v);
end
Sys.setTimeLocale = function(loc) 
  do return _G.os.setlocale(loc) ~= nil end;
end
Sys.sleep = function(seconds) 
  __lua_lib_luv_Thread.sleep(_G.math.floor(seconds * 1000));
end
Sys.stderr = function() 
  do return __sys_io_FileOutput.new(_G.io.stderr) end;
end
Sys.stdin = function() 
  do return __sys_io_FileInput.new(_G.io.stdin) end;
end
Sys.stdout = function() 
  do return __sys_io_FileOutput.new(_G.io.stdout) end;
end
Sys.time = function() 
  local _hx_1_stamp_seconds, _hx_1_stamp_microseconds = __lua_lib_luv_Misc.gettimeofday();
  do return _hx_1_stamp_seconds + (_hx_1_stamp_microseconds / 1000000) end;
end
_hxClasses["ValueType"] = ValueType;
_hxClasses["ValueType"] = { __ename__ = "ValueType", __constructs__ = _hx_tab_array({[0]="TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"},9)}
ValueType = _hxClasses["ValueType"];
ValueType.TNull = _hx_tab_array({[0]="TNull",0,__enum__ = ValueType},2)

ValueType.TInt = _hx_tab_array({[0]="TInt",1,__enum__ = ValueType},2)

ValueType.TFloat = _hx_tab_array({[0]="TFloat",2,__enum__ = ValueType},2)

ValueType.TBool = _hx_tab_array({[0]="TBool",3,__enum__ = ValueType},2)

ValueType.TObject = _hx_tab_array({[0]="TObject",4,__enum__ = ValueType},2)

ValueType.TFunction = _hx_tab_array({[0]="TFunction",5,__enum__ = ValueType},2)

ValueType.TClass = function(c) local _x = _hx_tab_array({[0]="TClass",6,c,__enum__=ValueType}, 3); return _x; end 
ValueType.TEnum = function(e) local _x = _hx_tab_array({[0]="TEnum",7,e,__enum__=ValueType}, 3); return _x; end 
ValueType.TUnknown = _hx_tab_array({[0]="TUnknown",8,__enum__ = ValueType},2)

ValueType.__empty_constructs__ = _hx_tab_array({[0] = ValueType.TNull,ValueType.TInt,ValueType.TFloat,ValueType.TBool,ValueType.TObject,ValueType.TFunction,ValueType.TUnknown}, 7)

Type.new = {}
_hxClasses["Type"] = Type
Type.__name__ = "Type"
Type.getClass = function(o) 
  if (o == nil) then 
    do return nil end;
  end;
  local o = o;
  if (__lua_Boot.__instanceof(o, Array)) then 
    do return Array end;
  else
    if (__lua_Boot.__instanceof(o, String)) then 
      do return String end;
    else
      local cl = o.__class__;
      if (cl ~= nil) then 
        do return cl end;
      else
        do return nil end;
      end;
    end;
  end;
end
Type.getEnum = function(o) 
  if (o == nil) then 
    do return nil end;
  end;
  do return o.__enum__ end;
end
Type.getSuperClass = function(c) 
  do return c.__super__ end;
end
Type.getClassName = function(c) 
  do return c.__name__ end;
end
Type.getEnumName = function(e) 
  if (e.__ename__ == nil) then 
    do return nil end;
  end;
  do return e.__ename__ end;
end
Type.resolveClass = function(name) 
  local cl = _hxClasses[name];
  local tmp;
  if (cl ~= nil) then 
    local o = cl;
    tmp = not ((function() 
      local _hx_1
      if (_G.type(o) ~= "table") then 
      _hx_1 = false; else 
      _hx_1 = o.__name__; end
      return _hx_1
    end )());
  else
    tmp = true;
  end;
  if (tmp) then 
    do return nil end;
  end;
  do return cl end;
end
Type.resolveEnum = function(name) 
  local e = _hxClasses[name];
  if ((e == nil) or not ((function() 
    local _hx_1
    if (_G.type(e) ~= "table") then 
    _hx_1 = false; else 
    _hx_1 = e.__ename__; end
    return _hx_1
  end )())) then 
    do return nil end;
  end;
  do return e end;
end
Type.createInstance = function(cl,args) 
  do return cl.new(_hx_table.unpack(args, 0)) end;
end
Type.createEmptyInstance = function(cl) 
  local ret = ({});
  _G.setmetatable(ret, _hx_o({__fields__={__index=true},__index=cl.prototype}));
  do return ret end;
end
Type.createEnum = function(e,constr,params) 
  local f = Reflect.field(e, constr);
  if (f == nil) then 
    _G.error(__haxe_Exception.thrown(Std.string("No such constructor ") .. Std.string(constr)),0);
  end;
  if (Reflect.isFunction(f)) then 
    if (params == nil) then 
      _G.error(__haxe_Exception.thrown(Std.string(Std.string("Constructor ") .. Std.string(constr)) .. Std.string(" need parameters")),0);
    end;
    do return Reflect.callMethod(nil,f,params) end;
  end;
  if ((params ~= nil) and (params.length ~= 0)) then 
    _G.error(__haxe_Exception.thrown(Std.string(Std.string("Constructor ") .. Std.string(constr)) .. Std.string(" does not need parameters")),0);
  end;
  do return f end;
end
Type.createEnumIndex = function(e,index,params) 
  local c = e.__constructs__[index];
  if (c == nil) then 
    _G.error(__haxe_Exception.thrown(Std.string(index) .. Std.string(" is not a valid enum constructor index")),0);
  end;
  do return Type.createEnum(e, c, params) end;
end
Type.getInstanceFields = function(c) 
  local p = c.prototype;
  local a = _hx_tab_array({}, 0);
  while (p ~= nil) do 
    local _g = 0;
    local _g1 = Reflect.fields(p);
    while (_g < _g1.length) do 
      local f = _g1[_g];
      _g = _g + 1;
      if (not Lambda.has(a, f)) then 
        a:push(f);
      end;
    end;
    local mt = _G.getmetatable(p);
    if ((mt ~= nil) and (mt.__index ~= nil)) then 
      p = mt.__index;
    else
      p = nil;
    end;
  end;
  do return a end;
end
Type.getClassFields = function(c) 
  local a = Reflect.fields(c);
  a:remove("__name__");
  a:remove("__interfaces__");
  a:remove("__properties__");
  a:remove("__super__");
  a:remove("__meta__");
  a:remove("prototype");
  a:remove("new");
  do return a end;
end
Type.getEnumConstructs = function(e) 
  local a = e.__constructs__;
  local _g = _hx_tab_array({}, 0);
  local _g1 = 0;
  local _g2 = a;
  while (_g1 < _g2.length) do 
    local i = _g2[_g1];
    _g1 = _g1 + 1;
    _g:push(i);
  end;
  do return _g end;
end
Type.typeof = function(v) 
  local _g = _G.type(v);
  if (_g) == "boolean" then 
    do return ValueType.TBool end;
  elseif (_g) == "function" then 
    if ((function() 
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
    end )()) then 
      do return ValueType.TObject end;
    end;
    do return ValueType.TFunction end;
  elseif (_g) == "nil" then 
    do return ValueType.TNull end;
  elseif (_g) == "number" then 
    if (_G.math.ceil(v) == (_G.math.fmod(v, 2147483648.0))) then 
      do return ValueType.TInt end;
    end;
    do return ValueType.TFloat end;
  elseif (_g) == "string" then 
    do return ValueType.TClass(String) end;
  elseif (_g) == "table" then 
    local e = v.__enum__;
    if (e ~= nil) then 
      do return ValueType.TEnum(e) end;
    end;
    local c;
    if (__lua_Boot.__instanceof(v, Array)) then 
      c = Array;
    else
      if (__lua_Boot.__instanceof(v, String)) then 
        c = String;
      else
        local cl = v.__class__;
        c = (function() 
          local _hx_3
          if (cl ~= nil) then 
          _hx_3 = cl; else 
          _hx_3 = nil; end
          return _hx_3
        end )();
      end;
    end;
    if (c ~= nil) then 
      do return ValueType.TClass(c) end;
    end;
    do return ValueType.TObject end;else
  do return ValueType.TUnknown end; end;
end
Type.enumEq = function(a,b) 
  if (a == b) then 
    do return true end;
  end;
  local _hx_status, _hx_result = pcall(function() 
  
      if (a[0] ~= b[0]) then 
        do return false end;
      end;
      local _g = 2;
      local _g1 = a.length;
      while (_g < _g1) do 
        _g = _g + 1;
        local i = _g - 1;
        if (not Type.enumEq(a[i], b[i])) then 
          do return false end;
        end;
      end;
      local e = a.__enum__;
      if ((e ~= b.__enum__) or (e == nil)) then 
        do return false end;
      end;
    return _hx_pcall_default
  end)
  if not _hx_status and _hx_result == "_hx_pcall_break" then
  elseif not _hx_status then 
    local _g = _hx_result;
    do return false end;
  elseif _hx_result ~= _hx_pcall_default then
    return _hx_result
  end;
  do return true end;
end
Type.enumConstructor = function(e) 
  do return e[0] end;
end
Type.enumParameters = function(e) 
  do return e:slice(2) end;
end
Type.enumIndex = function(e) 
  do return e[1] end;
end
Type.allEnums = function(e) 
  local _g = _hx_tab_array({}, 0);
  local _g1 = 0;
  local _g2 = e.__empty_constructs__;
  while (_g1 < _g2.length) do 
    local i = _g2[_g1];
    _g1 = _g1 + 1;
    _g:push(i);
  end;
  do return _g end;
end
_hxClasses["haxe.StackItem"] = __haxe_StackItem;
_hxClasses["haxe.StackItem"] = { __ename__ = "haxe.StackItem", __constructs__ = _hx_tab_array({[0]="CFunction","Module","FilePos","Method","LocalFunction"},5)}
__haxe_StackItem = _hxClasses["haxe.StackItem"];
__haxe_StackItem.CFunction = _hx_tab_array({[0]="CFunction",0,__enum__ = __haxe_StackItem},2)

__haxe_StackItem.Module = function(m) local _x = _hx_tab_array({[0]="Module",1,m,__enum__=__haxe_StackItem}, 3); return _x; end 
__haxe_StackItem.FilePos = function(s,file,line,column) local _x = _hx_tab_array({[0]="FilePos",2,s,file,line,column,__enum__=__haxe_StackItem}, 6); return _x; end 
__haxe_StackItem.Method = function(classname,method) local _x = _hx_tab_array({[0]="Method",3,classname,method,__enum__=__haxe_StackItem}, 4); return _x; end 
__haxe_StackItem.LocalFunction = function(v) local _x = _hx_tab_array({[0]="LocalFunction",4,v,__enum__=__haxe_StackItem}, 3); return _x; end 
__haxe_StackItem.__empty_constructs__ = _hx_tab_array({[0] = __haxe_StackItem.CFunction}, 1)

__haxe__CallStack_CallStack_Impl_.new = {}
_hxClasses["haxe._CallStack.CallStack_Impl_"] = __haxe__CallStack_CallStack_Impl_
__haxe__CallStack_CallStack_Impl_.__name__ = "haxe._CallStack.CallStack_Impl_"
__haxe__CallStack_CallStack_Impl_.__properties__ = {get_length="get_length"}
__haxe__CallStack_CallStack_Impl_.get_length = function(this1) 
  do return this1.length end;
end
__haxe__CallStack_CallStack_Impl_.callStack = function() 
  do return __haxe_NativeStackTrace.toHaxe(__haxe_NativeStackTrace.callStack()) end;
end
__haxe__CallStack_CallStack_Impl_.exceptionStack = function(fullStack) 
  if (fullStack == nil) then 
    fullStack = false;
  end;
  local eStack = __haxe_NativeStackTrace.toHaxe(__haxe_NativeStackTrace.exceptionStack());
  do return (function() 
    local _hx_1
    if (fullStack) then 
    _hx_1 = eStack; else 
    _hx_1 = __haxe__CallStack_CallStack_Impl_.subtract(eStack, __haxe__CallStack_CallStack_Impl_.callStack()); end
    return _hx_1
  end )() end;
end
__haxe__CallStack_CallStack_Impl_.toString = function(stack) 
  local b = StringBuf.new();
  local _g = 0;
  local _g1 = stack;
  while (_g < _g1.length) do 
    local s = _g1[_g];
    _g = _g + 1;
    local str = "\nCalled from ";
    _G.table.insert(b.b, str);
    local b1 = b;
    b1.length = b1.length + __lua_lib_luautf8_Utf8.len(str);
    __haxe__CallStack_CallStack_Impl_.itemToString(b, s);
  end;
  do return _G.table.concat(b.b) end;
end
__haxe__CallStack_CallStack_Impl_.subtract = function(this1,stack) 
  local startIndex = -1;
  local i = -1;
  while (true) do 
    i = i + 1;
    if (not (i < this1.length)) then 
      break;
    end;
    local _g = 0;
    local _g1 = stack.length;
    while (_g < _g1) do 
      _g = _g + 1;
      local j = _g - 1;
      if (__haxe__CallStack_CallStack_Impl_.equalItems(this1[i], stack[j])) then 
        if (startIndex < 0) then 
          startIndex = i;
        end;
        i = i + 1;
        if (i >= this1.length) then 
          break;
        end;
      else
        startIndex = -1;
      end;
    end;
    if (startIndex >= 0) then 
      break;
    end;
  end;
  if (startIndex >= 0) then 
    do return this1:slice(0, startIndex) end;
  else
    do return this1 end;
  end;
end
__haxe__CallStack_CallStack_Impl_.copy = function(this1) 
  local _g = _hx_tab_array({}, 0);
  local _g1 = 0;
  local _g2 = this1;
  while (_g1 < _g2.length) do 
    local i = _g2[_g1];
    _g1 = _g1 + 1;
    _g:push(i);
  end;
  do return _g end;
end
__haxe__CallStack_CallStack_Impl_.get = function(this1,index) 
  do return this1[index] end;
end
__haxe__CallStack_CallStack_Impl_.asArray = function(this1) 
  do return this1 end;
end
__haxe__CallStack_CallStack_Impl_.equalItems = function(item1,item2) 
  if (item1 == nil) then 
    if (item2 == nil) then 
      do return true end;
    else
      do return false end;
    end;
  else
    local tmp = item1[1];
    if (tmp) == 0 then 
      if (item2 == nil) then 
        do return false end;
      else
        if (item2[1] == 0) then 
          do return true end;
        else
          do return false end;
        end;
      end;
    elseif (tmp) == 1 then 
      if (item2 == nil) then 
        do return false end;
      else
        if (item2[1] == 1) then 
          local m2 = item2[2];
          local m1 = item1[2];
          do return m1 == m2 end;
        else
          do return false end;
        end;
      end;
    elseif (tmp) == 2 then 
      if (item2 == nil) then 
        do return false end;
      else
        if (item2[1] == 2) then 
          local item21 = item2[2];
          local file2 = item2[3];
          local line2 = item2[4];
          local col2 = item2[5];
          local col1 = item1[5];
          local line1 = item1[4];
          local file1 = item1[3];
          local item1 = item1[2];
          if (((file1 == file2) and (line1 == line2)) and (col1 == col2)) then 
            do return __haxe__CallStack_CallStack_Impl_.equalItems(item1, item21) end;
          else
            do return false end;
          end;
        else
          do return false end;
        end;
      end;
    elseif (tmp) == 3 then 
      if (item2 == nil) then 
        do return false end;
      else
        if (item2[1] == 3) then 
          local class2 = item2[2];
          local method2 = item2[3];
          local method1 = item1[3];
          local class1 = item1[2];
          if (class1 == class2) then 
            do return method1 == method2 end;
          else
            do return false end;
          end;
        else
          do return false end;
        end;
      end;
    elseif (tmp) == 4 then 
      if (item2 == nil) then 
        do return false end;
      else
        if (item2[1] == 4) then 
          local v2 = item2[2];
          local v1 = item1[2];
          do return v1 == v2 end;
        else
          do return false end;
        end;
      end; end;
  end;
end
__haxe__CallStack_CallStack_Impl_.exceptionToString = function(e) 
  if (e:get_previous() == nil) then 
    local tmp = Std.string("Exception: ") .. Std.string(e:toString());
    local tmp1 = e:get_stack();
    do return Std.string(tmp) .. Std.string(((function() 
      local _hx_1
      if (tmp1 == nil) then 
      _hx_1 = "null"; else 
      _hx_1 = _hx_wrap_if_string_field(__haxe__CallStack_CallStack_Impl_,'toString')(tmp1); end
      return _hx_1
    end )())) end;
  end;
  local result = "";
  local e = e;
  local prev = nil;
  while (e ~= nil) do 
    if (prev == nil) then 
      local result1 = Std.string("Exception: ") .. Std.string(e:get_message());
      local tmp = e:get_stack();
      result = Std.string(Std.string(result1) .. Std.string(((function() 
        local _hx_2
        if (tmp == nil) then 
        _hx_2 = "null"; else 
        _hx_2 = _hx_wrap_if_string_field(__haxe__CallStack_CallStack_Impl_,'toString')(tmp); end
        return _hx_2
      end )()))) .. Std.string(result);
    else
      local prevStack = __haxe__CallStack_CallStack_Impl_.subtract(e:get_stack(), prev:get_stack());
      result = Std.string(Std.string(Std.string(Std.string("Exception: ") .. Std.string(e:get_message())) .. Std.string(((function() 
        local _hx_3
        if (prevStack == nil) then 
        _hx_3 = "null"; else 
        _hx_3 = _hx_wrap_if_string_field(__haxe__CallStack_CallStack_Impl_,'toString')(prevStack); end
        return _hx_3
      end )()))) .. Std.string("\n\nNext ")) .. Std.string(result);
    end;
    prev = e;
    e = e:get_previous();
  end;
  do return result end;
end
__haxe__CallStack_CallStack_Impl_.itemToString = function(b,s) 
  local tmp = s[1];
  if (tmp) == 0 then 
    local str = "a C function";
    _G.table.insert(b.b, str);
    local b = b;
    b.length = b.length + __lua_lib_luautf8_Utf8.len(str);
  elseif (tmp) == 1 then 
    local m = s[2];
    local str = "module ";
    _G.table.insert(b.b, str);
    local b1 = b;
    b1.length = b1.length + __lua_lib_luautf8_Utf8.len(str);
    local str = Std.string(m);
    _G.table.insert(b.b, str);
    local b = b;
    b.length = b.length + __lua_lib_luautf8_Utf8.len(str);
  elseif (tmp) == 2 then 
    local s1 = s[2];
    local file = s[3];
    local line = s[4];
    local col = s[5];
    if (s1 ~= nil) then 
      __haxe__CallStack_CallStack_Impl_.itemToString(b, s1);
      local str = " (";
      _G.table.insert(b.b, str);
      local b = b;
      b.length = b.length + __lua_lib_luautf8_Utf8.len(str);
    end;
    local str = Std.string(file);
    _G.table.insert(b.b, str);
    local b1 = b;
    b1.length = b1.length + __lua_lib_luautf8_Utf8.len(str);
    local str = " line ";
    _G.table.insert(b.b, str);
    local b1 = b;
    b1.length = b1.length + __lua_lib_luautf8_Utf8.len(str);
    local str = Std.string(line);
    _G.table.insert(b.b, str);
    local b1 = b;
    b1.length = b1.length + __lua_lib_luautf8_Utf8.len(str);
    if (col ~= nil) then 
      local str = " column ";
      _G.table.insert(b.b, str);
      local b1 = b;
      b1.length = b1.length + __lua_lib_luautf8_Utf8.len(str);
      local str = Std.string(col);
      _G.table.insert(b.b, str);
      local b = b;
      b.length = b.length + __lua_lib_luautf8_Utf8.len(str);
    end;
    if (s1 ~= nil) then 
      local str = ")";
      _G.table.insert(b.b, str);
      local b = b;
      b.length = b.length + __lua_lib_luautf8_Utf8.len(str);
    end;
  elseif (tmp) == 3 then 
    local cname = s[2];
    local meth = s[3];
    local str = Std.string((function() 
      local _hx_1
      if (cname == nil) then 
      _hx_1 = "<unknown>"; else 
      _hx_1 = cname; end
      return _hx_1
    end )());
    _G.table.insert(b.b, str);
    local b1 = b;
    b1.length = b1.length + __lua_lib_luautf8_Utf8.len(str);
    local str = ".";
    _G.table.insert(b.b, str);
    local b1 = b;
    b1.length = b1.length + __lua_lib_luautf8_Utf8.len(str);
    local str = Std.string(meth);
    _G.table.insert(b.b, str);
    local b = b;
    b.length = b.length + __lua_lib_luautf8_Utf8.len(str);
  elseif (tmp) == 4 then 
    local n = s[2];
    local str = "local function #";
    _G.table.insert(b.b, str);
    local b1 = b;
    b1.length = b1.length + __lua_lib_luautf8_Utf8.len(str);
    local str = Std.string(n);
    _G.table.insert(b.b, str);
    local b = b;
    b.length = b.length + __lua_lib_luautf8_Utf8.len(str); end;
end

__haxe_IMap.new = {}
_hxClasses["haxe.IMap"] = __haxe_IMap
__haxe_IMap.__name__ = "haxe.IMap"
__haxe_IMap.prototype = _hx_e();
__haxe_IMap.prototype.get= nil;
__haxe_IMap.prototype.set= nil;
__haxe_IMap.prototype.exists= nil;
__haxe_IMap.prototype.remove= nil;
__haxe_IMap.prototype.keys= nil;
__haxe_IMap.prototype.iterator= nil;
__haxe_IMap.prototype.keyValueIterator= nil;
__haxe_IMap.prototype.copy= nil;
__haxe_IMap.prototype.toString= nil;
__haxe_IMap.prototype.clear= nil;

__haxe_IMap.prototype.__class__ =  __haxe_IMap

__haxe__DynamicAccess_DynamicAccess_Impl_.new = {}
_hxClasses["haxe._DynamicAccess.DynamicAccess_Impl_"] = __haxe__DynamicAccess_DynamicAccess_Impl_
__haxe__DynamicAccess_DynamicAccess_Impl_.__name__ = "haxe._DynamicAccess.DynamicAccess_Impl_"
__haxe__DynamicAccess_DynamicAccess_Impl_._new = function() 
  local this1 = _hx_e();
  do return this1 end;
end
__haxe__DynamicAccess_DynamicAccess_Impl_.get = function(this1,key) 
  do return Reflect.field(this1, key) end;
end
__haxe__DynamicAccess_DynamicAccess_Impl_.set = function(this1,key,value) 
  this1[key] = value;
  do return value end;
end
__haxe__DynamicAccess_DynamicAccess_Impl_.exists = function(this1,key) 
  local o = this1;
  if ((_G.type(o) == "string") and ((String.prototype[key] ~= nil) or (key == "length"))) then 
    do return true end;
  else
    if (o.__fields__ ~= nil) then 
      do return o.__fields__[key] ~= nil end;
    else
      do return o[key] ~= nil end;
    end;
  end;
end
__haxe__DynamicAccess_DynamicAccess_Impl_.remove = function(this1,key) 
  do return Reflect.deleteField(this1, key) end;
end
__haxe__DynamicAccess_DynamicAccess_Impl_.keys = function(this1) 
  do return Reflect.fields(this1) end;
end
__haxe__DynamicAccess_DynamicAccess_Impl_.copy = function(this1) 
  do return Reflect.copy(this1) end;
end
__haxe__DynamicAccess_DynamicAccess_Impl_.iterator = function(this1) 
  do return __haxe_iterators_DynamicAccessIterator.new(this1) end;
end
__haxe__DynamicAccess_DynamicAccess_Impl_.keyValueIterator = function(this1) 
  do return __haxe_iterators_DynamicAccessKeyValueIterator.new(this1) end;
end

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
_hxClasses["haxe.Exception"] = __haxe_Exception
__haxe_Exception.__name__ = "haxe.Exception"
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
__haxe_Exception.prototype.__exceptionMessage= nil;
__haxe_Exception.prototype.__exceptionStack= nil;
__haxe_Exception.prototype.__nativeStack= nil;
__haxe_Exception.prototype.__skipStack= nil;
__haxe_Exception.prototype.__nativeException= nil;
__haxe_Exception.prototype.__previousException= nil;
__haxe_Exception.prototype.unwrap = function(self) 
  do return self.__nativeException end
end
__haxe_Exception.prototype.toString = function(self) 
  do return self:get_message() end
end
__haxe_Exception.prototype.details = function(self) 
  if (self:get_previous() == nil) then 
    local tmp = Std.string("Exception: ") .. Std.string(self:toString());
    local tmp1 = self:get_stack();
    do return Std.string(tmp) .. Std.string(((function() 
      local _hx_1
      if (tmp1 == nil) then 
      _hx_1 = "null"; else 
      _hx_1 = _hx_wrap_if_string_field(__haxe__CallStack_CallStack_Impl_,'toString')(tmp1); end
      return _hx_1
    end )())) end;
  else
    local result = "";
    local e = self;
    local prev = nil;
    while (e ~= nil) do 
      if (prev == nil) then 
        local result1 = Std.string("Exception: ") .. Std.string(e:get_message());
        local tmp = e:get_stack();
        result = Std.string(Std.string(result1) .. Std.string(((function() 
          local _hx_2
          if (tmp == nil) then 
          _hx_2 = "null"; else 
          _hx_2 = _hx_wrap_if_string_field(__haxe__CallStack_CallStack_Impl_,'toString')(tmp); end
          return _hx_2
        end )()))) .. Std.string(result);
      else
        local prevStack = __haxe__CallStack_CallStack_Impl_.subtract(e:get_stack(), prev:get_stack());
        result = Std.string(Std.string(Std.string(Std.string("Exception: ") .. Std.string(e:get_message())) .. Std.string(((function() 
          local _hx_3
          if (prevStack == nil) then 
          _hx_3 = "null"; else 
          _hx_3 = _hx_wrap_if_string_field(__haxe__CallStack_CallStack_Impl_,'toString')(prevStack); end
          return _hx_3
        end )()))) .. Std.string("\n\nNext ")) .. Std.string(result);
      end;
      prev = e;
      e = e:get_previous();
    end;
    do return result end;
  end;
end
__haxe_Exception.prototype.__shiftStack = function(self) 
  self.__skipStack = self.__skipStack + 1;
end
__haxe_Exception.prototype.get_message = function(self) 
  do return self.__exceptionMessage end
end
__haxe_Exception.prototype.get_previous = function(self) 
  do return self.__previousException end
end
__haxe_Exception.prototype.get_native = function(self) 
  do return self.__nativeException end
end
__haxe_Exception.prototype.get_stack = function(self) 
  local _g = self.__exceptionStack;
  if (_g == nil) then 
    self.__exceptionStack = __haxe_NativeStackTrace.toHaxe(self.__nativeStack, self.__skipStack) do return self.__exceptionStack end;
  else
    local s = _g;
    do return s end;
  end;
end

__haxe_Exception.prototype.__class__ =  __haxe_Exception

__haxe_Exception.prototype.__properties__ =  {get_native="get_native",get_previous="get_previous",get_stack="get_stack",get_message="get_message"}

__haxe__Int32_Int32_Impl_.new = {}
_hxClasses["haxe._Int32.Int32_Impl_"] = __haxe__Int32_Int32_Impl_
__haxe__Int32_Int32_Impl_.__name__ = "haxe._Int32.Int32_Impl_"
__haxe__Int32_Int32_Impl_.negate = function(this1) 
  do return __haxe__Int32_Int32_Impl_.clamp(_hx_bit.bnot(this1) + 1) end;
end
__haxe__Int32_Int32_Impl_.preIncrement = function(this1) 
  this1 = this1 + 1;
  this1 = __haxe__Int32_Int32_Impl_.clamp(this1);
  do return this1 end;
end
__haxe__Int32_Int32_Impl_.postIncrement = function(this1) 
  this1 = this1 + 1;
  local ret = this1 - 1;
  this1 = __haxe__Int32_Int32_Impl_.clamp(this1);
  do return ret end;
end
__haxe__Int32_Int32_Impl_.preDecrement = function(this1) 
  this1 = this1 - 1;
  this1 = __haxe__Int32_Int32_Impl_.clamp(this1);
  do return this1 end;
end
__haxe__Int32_Int32_Impl_.postDecrement = function(this1) 
  this1 = this1 - 1;
  local ret = this1 + 1;
  this1 = __haxe__Int32_Int32_Impl_.clamp(this1);
  do return ret end;
end
__haxe__Int32_Int32_Impl_.add = function(a,b) 
  do return __haxe__Int32_Int32_Impl_.clamp(a + b) end;
end
__haxe__Int32_Int32_Impl_.addInt = function(a,b) 
  do return __haxe__Int32_Int32_Impl_.clamp(a + b) end;
end
__haxe__Int32_Int32_Impl_.sub = function(a,b) 
  do return __haxe__Int32_Int32_Impl_.clamp(a - b) end;
end
__haxe__Int32_Int32_Impl_.subInt = function(a,b) 
  do return __haxe__Int32_Int32_Impl_.clamp(a - b) end;
end
__haxe__Int32_Int32_Impl_.intSub = function(a,b) 
  do return __haxe__Int32_Int32_Impl_.clamp(a - b) end;
end
__haxe__Int32_Int32_Impl_.mul = function(a,b) 
  do return __haxe__Int32_Int32_Impl_.clamp((a * (_hx_bit.band(b,65535))) + __haxe__Int32_Int32_Impl_.clamp(_hx_bit.lshift(a * (_hx_bit.rshift(b,16)),16))) end;
end
__haxe__Int32_Int32_Impl_.mulInt = function(a,b) 
  do return __haxe__Int32_Int32_Impl_.mul(a, b) end;
end
__haxe__Int32_Int32_Impl_.complement = function(a) 
  do return _hx_bit_clamp(_hx_bit.bnot(a)) end;
end
__haxe__Int32_Int32_Impl_["or"] = function(a,b) 
  do return __haxe__Int32_Int32_Impl_.clamp(_hx_bit.bor(a,b)) end;
end
__haxe__Int32_Int32_Impl_.orInt = function(a,b) 
  do return __haxe__Int32_Int32_Impl_.clamp(_hx_bit.bor(a,b)) end;
end
__haxe__Int32_Int32_Impl_.xor = function(a,b) 
  do return __haxe__Int32_Int32_Impl_.clamp(_hx_bit.bxor(a,b)) end;
end
__haxe__Int32_Int32_Impl_.xorInt = function(a,b) 
  do return __haxe__Int32_Int32_Impl_.clamp(_hx_bit.bxor(a,b)) end;
end
__haxe__Int32_Int32_Impl_.shr = function(a,b) 
  do return __haxe__Int32_Int32_Impl_.clamp(_hx_bit.arshift(a,b)) end;
end
__haxe__Int32_Int32_Impl_.shrInt = function(a,b) 
  do return __haxe__Int32_Int32_Impl_.clamp(_hx_bit.arshift(a,b)) end;
end
__haxe__Int32_Int32_Impl_.intShr = function(a,b) 
  do return __haxe__Int32_Int32_Impl_.clamp(_hx_bit.arshift(a,b)) end;
end
__haxe__Int32_Int32_Impl_.shl = function(a,b) 
  do return __haxe__Int32_Int32_Impl_.clamp(_hx_bit.lshift(a,b)) end;
end
__haxe__Int32_Int32_Impl_.shlInt = function(a,b) 
  do return __haxe__Int32_Int32_Impl_.clamp(_hx_bit.lshift(a,b)) end;
end
__haxe__Int32_Int32_Impl_.intShl = function(a,b) 
  do return __haxe__Int32_Int32_Impl_.clamp(_hx_bit.lshift(a,b)) end;
end
__haxe__Int32_Int32_Impl_.toFloat = function(this1) 
  do return this1 end;
end
__haxe__Int32_Int32_Impl_.ucompare = function(a,b) 
  if (a < 0) then 
    if (b < 0) then 
      do return __haxe__Int32_Int32_Impl_.clamp(_hx_bit_clamp(_hx_bit.bnot(b)) - _hx_bit_clamp(_hx_bit.bnot(a))) end;
    else
      do return 1 end;
    end;
  end;
  if (b < 0) then 
    do return -1 end;
  else
    do return __haxe__Int32_Int32_Impl_.clamp(a - b) end;
  end;
end
__haxe__Int32_Int32_Impl_.clamp = function(x) 
  do return _hx_bit_clamp(x) end;
end

__haxe__Int64_Int64_Impl_.new = {}
_hxClasses["haxe._Int64.Int64_Impl_"] = __haxe__Int64_Int64_Impl_
__haxe__Int64_Int64_Impl_.__name__ = "haxe._Int64.Int64_Impl_"
__haxe__Int64_Int64_Impl_.__properties__ = {get_low="get_low",get_high="get_high"}
__haxe__Int64_Int64_Impl_._new = function(x) 
  local this1 = x;
  do return this1 end;
end
__haxe__Int64_Int64_Impl_.copy = function(this1) 
  local this1 = __haxe__Int64____Int64.new(this1.high, this1.low);
  do return this1 end;
end
__haxe__Int64_Int64_Impl_.make = function(high,low) 
  local this1 = __haxe__Int64____Int64.new(high, low);
  do return this1 end;
end
__haxe__Int64_Int64_Impl_.ofInt = function(x) 
  local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.shr(x, 31), x);
  do return this1 end;
end
__haxe__Int64_Int64_Impl_.toInt = function(x) 
  if (x.high ~= __haxe__Int32_Int32_Impl_.shr(x.low, 31)) then 
    _G.error(__haxe_Exception.thrown("Overflow"),0);
  end;
  do return x.low end;
end
__haxe__Int64_Int64_Impl_.is = function(val) 
  do return __lua_Boot.__instanceof(val, __haxe__Int64____Int64) end;
end
__haxe__Int64_Int64_Impl_.isInt64 = function(val) 
  do return __lua_Boot.__instanceof(val, __haxe__Int64____Int64) end;
end
__haxe__Int64_Int64_Impl_.getHigh = function(x) 
  do return x.high end;
end
__haxe__Int64_Int64_Impl_.getLow = function(x) 
  do return x.low end;
end
__haxe__Int64_Int64_Impl_.isNeg = function(x) 
  do return x.high < 0 end;
end
__haxe__Int64_Int64_Impl_.isZero = function(x) 
  local b_high = __haxe__Int32_Int32_Impl_.shr(0, 31);
  local b_low = 0;
  if (x.high == b_high) then 
    do return x.low == b_low end;
  else
    do return false end;
  end;
end
__haxe__Int64_Int64_Impl_.compare = function(a,b) 
  local v = __haxe__Int32_Int32_Impl_.clamp(a.high - b.high);
  if (v == 0) then 
    v = __haxe__Int32_Int32_Impl_.ucompare(a.low, b.low);
  end;
  if (a.high < 0) then 
    if (b.high < 0) then 
      do return v end;
    else
      do return -1 end;
    end;
  else
    if (b.high >= 0) then 
      do return v end;
    else
      do return 1 end;
    end;
  end;
end
__haxe__Int64_Int64_Impl_.ucompare = function(a,b) 
  local v = __haxe__Int32_Int32_Impl_.ucompare(a.high, b.high);
  if (v ~= 0) then 
    do return v end;
  else
    do return __haxe__Int32_Int32_Impl_.ucompare(a.low, b.low) end;
  end;
end
__haxe__Int64_Int64_Impl_.toStr = function(x) 
  do return _hx_wrap_if_string_field(__haxe__Int64_Int64_Impl_,'toString')(x) end;
end
__haxe__Int64_Int64_Impl_.toString = function(this1) 
  local i = this1;
  local b_high = __haxe__Int32_Int32_Impl_.shr(0, 31);
  local b_low = 0;
  if ((i.high == b_high) and (i.low == b_low)) then 
    do return "0" end;
  end;
  local str = "";
  local neg = false;
  if (i.high < 0) then 
    neg = true;
  end;
  local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.shr(10, 31), 10);
  local ten = this1;
  while (true) do 
    local b_high = __haxe__Int32_Int32_Impl_.shr(0, 31);
    local b_low = 0;
    if (not ((i.high ~= b_high) or (i.low ~= b_low))) then 
      break;
    end;
    local r = __haxe__Int64_Int64_Impl_.divMod(i, ten);
    if (r.modulus.high < 0) then 
      local x = r.modulus;
      local a = x.high;
      local high = _hx_bit_clamp(_hx_bit.bnot(a));
      local low = __haxe__Int32_Int32_Impl_.clamp(_hx_bit.bnot(x.low) + 1);
      if (low == 0) then 
        high = high + 1;
        local ret = high - 1;
        high = __haxe__Int32_Int32_Impl_.clamp(high);
      end;
      local this_high = high;
      local this_low = low;
      str = Std.string(this_low) .. Std.string(str);
      local x = r.quotient;
      local a = x.high;
      local high = _hx_bit_clamp(_hx_bit.bnot(a));
      local low = __haxe__Int32_Int32_Impl_.clamp(_hx_bit.bnot(x.low) + 1);
      if (low == 0) then 
        high = high + 1;
        local ret = high - 1;
        high = __haxe__Int32_Int32_Impl_.clamp(high);
      end;
      local this1 = __haxe__Int64____Int64.new(high, low);
      i = this1;
    else
      str = Std.string(r.modulus.low) .. Std.string(str);
      i = r.quotient;
    end;
  end;
  if (neg) then 
    str = Std.string("-") .. Std.string(str);
  end;
  do return str end;
end
__haxe__Int64_Int64_Impl_.parseString = function(sParam) 
  do return __haxe_Int64Helper.parseString(sParam) end;
end
__haxe__Int64_Int64_Impl_.fromFloat = function(f) 
  do return __haxe_Int64Helper.fromFloat(f) end;
end
__haxe__Int64_Int64_Impl_.divMod = function(dividend,divisor) 
  if (divisor.high == 0) then 
    local _g = divisor.low;
    if (_g) == 0 then 
      _G.error(__haxe_Exception.thrown("divide by zero"),0);
    elseif (_g) == 1 then 
      local this1 = __haxe__Int64____Int64.new(dividend.high, dividend.low);
      local this2 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.shr(0, 31), 0);
      do return _hx_o({__fields__={quotient=true,modulus=true},quotient=this1,modulus=this2}) end; end;
  end;
  local divSign = (dividend.high < 0) ~= (divisor.high < 0);
  local modulus;
  if (dividend.high < 0) then 
    local a = dividend.high;
    local high = _hx_bit_clamp(_hx_bit.bnot(a));
    local low = __haxe__Int32_Int32_Impl_.clamp(_hx_bit.bnot(dividend.low) + 1);
    if (low == 0) then 
      high = high + 1;
      local ret = high - 1;
      high = __haxe__Int32_Int32_Impl_.clamp(high);
    end;
    local this1 = __haxe__Int64____Int64.new(high, low);
    modulus = this1;
  else
    local this1 = __haxe__Int64____Int64.new(dividend.high, dividend.low);
    modulus = this1;
  end;
  if (divisor.high < 0) then 
    local a = divisor.high;
    local high = _hx_bit_clamp(_hx_bit.bnot(a));
    local low = __haxe__Int32_Int32_Impl_.clamp(_hx_bit.bnot(divisor.low) + 1);
    if (low == 0) then 
      high = high + 1;
      local ret = high - 1;
      high = __haxe__Int32_Int32_Impl_.clamp(high);
    end;
    local this1 = __haxe__Int64____Int64.new(high, low);
    divisor = this1;
  end;
  local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.shr(0, 31), 0);
  local quotient = this1;
  local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.shr(1, 31), 1);
  local mask = this1;
  while (not (divisor.high < 0)) do 
    local v = __haxe__Int32_Int32_Impl_.ucompare(divisor.high, modulus.high);
    local cmp = (function() 
      local _hx_1
      if (v ~= 0) then 
      _hx_1 = v; else 
      _hx_1 = __haxe__Int32_Int32_Impl_.ucompare(divisor.low, modulus.low); end
      return _hx_1
    end )();
    local b = 1;
    b = _hx_bit.band(b,63);
    if (b == 0) then 
      local this1 = __haxe__Int64____Int64.new(divisor.high, divisor.low);
      divisor = this1;
    else
      if (b < 32) then 
        local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_["or"](__haxe__Int32_Int32_Impl_.clamp(_hx_bit.lshift(divisor.high,b)), _hx_bit.rshift(divisor.low,32 - b)), __haxe__Int32_Int32_Impl_.clamp(_hx_bit.lshift(divisor.low,b)));
        divisor = this1;
      else
        local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.clamp(_hx_bit.lshift(divisor.low,b - 32)), 0);
        divisor = this1;
      end;
    end;
    local b = 1;
    b = _hx_bit.band(b,63);
    if (b == 0) then 
      local this1 = __haxe__Int64____Int64.new(mask.high, mask.low);
      mask = this1;
    else
      if (b < 32) then 
        local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_["or"](__haxe__Int32_Int32_Impl_.clamp(_hx_bit.lshift(mask.high,b)), _hx_bit.rshift(mask.low,32 - b)), __haxe__Int32_Int32_Impl_.clamp(_hx_bit.lshift(mask.low,b)));
        mask = this1;
      else
        local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.clamp(_hx_bit.lshift(mask.low,b - 32)), 0);
        mask = this1;
      end;
    end;
    if (cmp >= 0) then 
      break;
    end;
  end;
  while (true) do 
    local b_high = __haxe__Int32_Int32_Impl_.shr(0, 31);
    local b_low = 0;
    if (not ((mask.high ~= b_high) or (mask.low ~= b_low))) then 
      break;
    end;
    local v = __haxe__Int32_Int32_Impl_.ucompare(modulus.high, divisor.high);
    if ((function() 
      local _hx_2
      if (v ~= 0) then 
      _hx_2 = v; else 
      _hx_2 = __haxe__Int32_Int32_Impl_.ucompare(modulus.low, divisor.low); end
      return _hx_2
    end )() >= 0) then 
      local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_["or"](quotient.high, mask.high), __haxe__Int32_Int32_Impl_["or"](quotient.low, mask.low));
      quotient = this1;
      local high = __haxe__Int32_Int32_Impl_.clamp(modulus.high - divisor.high);
      local low = __haxe__Int32_Int32_Impl_.clamp(modulus.low - divisor.low);
      if (__haxe__Int32_Int32_Impl_.ucompare(modulus.low, divisor.low) < 0) then 
        high = high - 1;
        local ret = high + 1;
        high = __haxe__Int32_Int32_Impl_.clamp(high);
      end;
      local this1 = __haxe__Int64____Int64.new(high, low);
      modulus = this1;
    end;
    local b = 1;
    b = _hx_bit.band(b,63);
    if (b == 0) then 
      local this1 = __haxe__Int64____Int64.new(mask.high, mask.low);
      mask = this1;
    else
      if (b < 32) then 
        local this1 = __haxe__Int64____Int64.new(_hx_bit.rshift(mask.high,b), __haxe__Int32_Int32_Impl_["or"](__haxe__Int32_Int32_Impl_.clamp(_hx_bit.lshift(mask.high,32 - b)), _hx_bit.rshift(mask.low,b)));
        mask = this1;
      else
        local this1 = __haxe__Int64____Int64.new(0, _hx_bit.rshift(mask.high,b - 32));
        mask = this1;
      end;
    end;
    local b = 1;
    b = _hx_bit.band(b,63);
    if (b == 0) then 
      local this1 = __haxe__Int64____Int64.new(divisor.high, divisor.low);
      divisor = this1;
    else
      if (b < 32) then 
        local this1 = __haxe__Int64____Int64.new(_hx_bit.rshift(divisor.high,b), __haxe__Int32_Int32_Impl_["or"](__haxe__Int32_Int32_Impl_.clamp(_hx_bit.lshift(divisor.high,32 - b)), _hx_bit.rshift(divisor.low,b)));
        divisor = this1;
      else
        local this1 = __haxe__Int64____Int64.new(0, _hx_bit.rshift(divisor.high,b - 32));
        divisor = this1;
      end;
    end;
  end;
  if (divSign) then 
    local a = quotient.high;
    local high = _hx_bit_clamp(_hx_bit.bnot(a));
    local low = __haxe__Int32_Int32_Impl_.clamp(_hx_bit.bnot(quotient.low) + 1);
    if (low == 0) then 
      high = high + 1;
      local ret = high - 1;
      high = __haxe__Int32_Int32_Impl_.clamp(high);
    end;
    local this1 = __haxe__Int64____Int64.new(high, low);
    quotient = this1;
  end;
  if (dividend.high < 0) then 
    local a = modulus.high;
    local high = _hx_bit_clamp(_hx_bit.bnot(a));
    local low = __haxe__Int32_Int32_Impl_.clamp(_hx_bit.bnot(modulus.low) + 1);
    if (low == 0) then 
      high = high + 1;
      local ret = high - 1;
      high = __haxe__Int32_Int32_Impl_.clamp(high);
    end;
    local this1 = __haxe__Int64____Int64.new(high, low);
    modulus = this1;
  end;
  do return _hx_o({__fields__={quotient=true,modulus=true},quotient=quotient,modulus=modulus}) end;
end
__haxe__Int64_Int64_Impl_.neg = function(x) 
  local a = x.high;
  local high = _hx_bit_clamp(_hx_bit.bnot(a));
  local low = __haxe__Int32_Int32_Impl_.clamp(_hx_bit.bnot(x.low) + 1);
  if (low == 0) then 
    high = high + 1;
    local ret = high - 1;
    high = __haxe__Int32_Int32_Impl_.clamp(high);
  end;
  local this1 = __haxe__Int64____Int64.new(high, low);
  do return this1 end;
end
__haxe__Int64_Int64_Impl_.preIncrement = function(this1) 
  local this2 = __haxe__Int64____Int64.new(this1.high, this1.low);
  this1 = this2;
  local ret = (function() 
  local _hx_obj = this1;
  local _hx_fld = 'low';
  local _ = _hx_obj[_hx_fld];
  _hx_obj[_hx_fld] = _hx_obj[_hx_fld]  + 1;
   return _;
   end)();
  this1.low = __haxe__Int32_Int32_Impl_.clamp(this1.low);
  if (this1.low == 0) then 
    local ret = (function() 
    local _hx_obj = this1;
    local _hx_fld = 'high';
    local _ = _hx_obj[_hx_fld];
    _hx_obj[_hx_fld] = _hx_obj[_hx_fld]  + 1;
     return _;
     end)();
    this1.high = __haxe__Int32_Int32_Impl_.clamp(this1.high);
  end;
  do return this1 end;
end
__haxe__Int64_Int64_Impl_.postIncrement = function(this1) 
  local ret = this1;
  local this2 = __haxe__Int64____Int64.new(this1.high, this1.low);
  this1 = this2;
  local ret1 = (function() 
  local _hx_obj = this1;
  local _hx_fld = 'low';
  local _ = _hx_obj[_hx_fld];
  _hx_obj[_hx_fld] = _hx_obj[_hx_fld]  + 1;
   return _;
   end)();
  this1.low = __haxe__Int32_Int32_Impl_.clamp(this1.low);
  if (this1.low == 0) then 
    local ret = (function() 
    local _hx_obj = this1;
    local _hx_fld = 'high';
    local _ = _hx_obj[_hx_fld];
    _hx_obj[_hx_fld] = _hx_obj[_hx_fld]  + 1;
     return _;
     end)();
    this1.high = __haxe__Int32_Int32_Impl_.clamp(this1.high);
  end;
  do return ret end;
end
__haxe__Int64_Int64_Impl_.preDecrement = function(this1) 
  local this2 = __haxe__Int64____Int64.new(this1.high, this1.low);
  this1 = this2;
  if (this1.low == 0) then 
    local ret = (function() 
    local _hx_obj = this1;
    local _hx_fld = 'high';
    local _ = _hx_obj[_hx_fld];
    _hx_obj[_hx_fld] = _hx_obj[_hx_fld]  - 1;
     return _;
     end)();
    this1.high = __haxe__Int32_Int32_Impl_.clamp(this1.high);
  end;
  local ret = (function() 
  local _hx_obj = this1;
  local _hx_fld = 'low';
  local _ = _hx_obj[_hx_fld];
  _hx_obj[_hx_fld] = _hx_obj[_hx_fld]  - 1;
   return _;
   end)();
  this1.low = __haxe__Int32_Int32_Impl_.clamp(this1.low);
  do return this1 end;
end
__haxe__Int64_Int64_Impl_.postDecrement = function(this1) 
  local ret = this1;
  local this2 = __haxe__Int64____Int64.new(this1.high, this1.low);
  this1 = this2;
  if (this1.low == 0) then 
    local ret = (function() 
    local _hx_obj = this1;
    local _hx_fld = 'high';
    local _ = _hx_obj[_hx_fld];
    _hx_obj[_hx_fld] = _hx_obj[_hx_fld]  - 1;
     return _;
     end)();
    this1.high = __haxe__Int32_Int32_Impl_.clamp(this1.high);
  end;
  local ret1 = (function() 
  local _hx_obj = this1;
  local _hx_fld = 'low';
  local _ = _hx_obj[_hx_fld];
  _hx_obj[_hx_fld] = _hx_obj[_hx_fld]  - 1;
   return _;
   end)();
  this1.low = __haxe__Int32_Int32_Impl_.clamp(this1.low);
  do return ret end;
end
__haxe__Int64_Int64_Impl_.add = function(a,b) 
  local high = __haxe__Int32_Int32_Impl_.clamp(a.high + b.high);
  local low = __haxe__Int32_Int32_Impl_.clamp(a.low + b.low);
  if (__haxe__Int32_Int32_Impl_.ucompare(low, a.low) < 0) then 
    high = high + 1;
    local ret = high - 1;
    high = __haxe__Int32_Int32_Impl_.clamp(high);
  end;
  local this1 = __haxe__Int64____Int64.new(high, low);
  do return this1 end;
end
__haxe__Int64_Int64_Impl_.addInt = function(a,b) 
  local b_high = __haxe__Int32_Int32_Impl_.shr(b, 31);
  local b_low = b;
  local high = __haxe__Int32_Int32_Impl_.clamp(a.high + b_high);
  local low = __haxe__Int32_Int32_Impl_.clamp(a.low + b_low);
  if (__haxe__Int32_Int32_Impl_.ucompare(low, a.low) < 0) then 
    high = high + 1;
    local ret = high - 1;
    high = __haxe__Int32_Int32_Impl_.clamp(high);
  end;
  local this1 = __haxe__Int64____Int64.new(high, low);
  do return this1 end;
end
__haxe__Int64_Int64_Impl_.sub = function(a,b) 
  local high = __haxe__Int32_Int32_Impl_.clamp(a.high - b.high);
  local low = __haxe__Int32_Int32_Impl_.clamp(a.low - b.low);
  if (__haxe__Int32_Int32_Impl_.ucompare(a.low, b.low) < 0) then 
    high = high - 1;
    local ret = high + 1;
    high = __haxe__Int32_Int32_Impl_.clamp(high);
  end;
  local this1 = __haxe__Int64____Int64.new(high, low);
  do return this1 end;
end
__haxe__Int64_Int64_Impl_.subInt = function(a,b) 
  local b_high = __haxe__Int32_Int32_Impl_.shr(b, 31);
  local b_low = b;
  local high = __haxe__Int32_Int32_Impl_.clamp(a.high - b_high);
  local low = __haxe__Int32_Int32_Impl_.clamp(a.low - b_low);
  if (__haxe__Int32_Int32_Impl_.ucompare(a.low, b_low) < 0) then 
    high = high - 1;
    local ret = high + 1;
    high = __haxe__Int32_Int32_Impl_.clamp(high);
  end;
  local this1 = __haxe__Int64____Int64.new(high, low);
  do return this1 end;
end
__haxe__Int64_Int64_Impl_.intSub = function(a,b) 
  local a_high = __haxe__Int32_Int32_Impl_.shr(a, 31);
  local a_low = a;
  local high = __haxe__Int32_Int32_Impl_.clamp(a_high - b.high);
  local low = __haxe__Int32_Int32_Impl_.clamp(a_low - b.low);
  if (__haxe__Int32_Int32_Impl_.ucompare(a_low, b.low) < 0) then 
    high = high - 1;
    local ret = high + 1;
    high = __haxe__Int32_Int32_Impl_.clamp(high);
  end;
  local this1 = __haxe__Int64____Int64.new(high, low);
  do return this1 end;
end
__haxe__Int64_Int64_Impl_.mul = function(a,b) 
  local mask = 65535;
  local al = _hx_bit.band(a.low,mask);
  local ah = _hx_bit.rshift(a.low,16);
  local bl = _hx_bit.band(b.low,mask);
  local bh = _hx_bit.rshift(b.low,16);
  local p00 = __haxe__Int32_Int32_Impl_.mul(al, bl);
  local p10 = __haxe__Int32_Int32_Impl_.mul(ah, bl);
  local p01 = __haxe__Int32_Int32_Impl_.mul(al, bh);
  local p11 = __haxe__Int32_Int32_Impl_.mul(ah, bh);
  local low = p00;
  local high = __haxe__Int32_Int32_Impl_.clamp(__haxe__Int32_Int32_Impl_.clamp(p11 + (_hx_bit.rshift(p01,16))) + (_hx_bit.rshift(p10,16)));
  p01 = __haxe__Int32_Int32_Impl_.clamp(_hx_bit.lshift(p01,16));
  low = __haxe__Int32_Int32_Impl_.clamp(low + p01);
  if (__haxe__Int32_Int32_Impl_.ucompare(low, p01) < 0) then 
    high = high + 1;
    local ret = high - 1;
    high = __haxe__Int32_Int32_Impl_.clamp(high);
  end;
  p10 = __haxe__Int32_Int32_Impl_.clamp(_hx_bit.lshift(p10,16));
  low = __haxe__Int32_Int32_Impl_.clamp(low + p10);
  if (__haxe__Int32_Int32_Impl_.ucompare(low, p10) < 0) then 
    high = high + 1;
    local ret = high - 1;
    high = __haxe__Int32_Int32_Impl_.clamp(high);
  end;
  high = __haxe__Int32_Int32_Impl_.clamp(high + __haxe__Int32_Int32_Impl_.clamp(__haxe__Int32_Int32_Impl_.mul(a.low, b.high) + __haxe__Int32_Int32_Impl_.mul(a.high, b.low)));
  local this1 = __haxe__Int64____Int64.new(high, low);
  do return this1 end;
end
__haxe__Int64_Int64_Impl_.mulInt = function(a,b) 
  local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.shr(b, 31), b);
  do return __haxe__Int64_Int64_Impl_.mul(a, this1) end;
end
__haxe__Int64_Int64_Impl_.div = function(a,b) 
  do return __haxe__Int64_Int64_Impl_.divMod(a, b).quotient end;
end
__haxe__Int64_Int64_Impl_.divInt = function(a,b) 
  local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.shr(b, 31), b);
  do return __haxe__Int64_Int64_Impl_.divMod(a, this1).quotient end;
end
__haxe__Int64_Int64_Impl_.intDiv = function(a,b) 
  local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.shr(a, 31), a);
  local x = __haxe__Int64_Int64_Impl_.divMod(this1, b).quotient;
  if (x.high ~= __haxe__Int32_Int32_Impl_.shr(x.low, 31)) then 
    _G.error(__haxe_Exception.thrown("Overflow"),0);
  end;
  local x = x.low;
  local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.shr(x, 31), x);
  do return this1 end;
end
__haxe__Int64_Int64_Impl_.mod = function(a,b) 
  do return __haxe__Int64_Int64_Impl_.divMod(a, b).modulus end;
end
__haxe__Int64_Int64_Impl_.modInt = function(a,b) 
  local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.shr(b, 31), b);
  local x = __haxe__Int64_Int64_Impl_.divMod(a, this1).modulus;
  if (x.high ~= __haxe__Int32_Int32_Impl_.shr(x.low, 31)) then 
    _G.error(__haxe_Exception.thrown("Overflow"),0);
  end;
  local x = x.low;
  local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.shr(x, 31), x);
  do return this1 end;
end
__haxe__Int64_Int64_Impl_.intMod = function(a,b) 
  local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.shr(a, 31), a);
  local x = __haxe__Int64_Int64_Impl_.divMod(this1, b).modulus;
  if (x.high ~= __haxe__Int32_Int32_Impl_.shr(x.low, 31)) then 
    _G.error(__haxe_Exception.thrown("Overflow"),0);
  end;
  local x = x.low;
  local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.shr(x, 31), x);
  do return this1 end;
end
__haxe__Int64_Int64_Impl_.eq = function(a,b) 
  if (a.high == b.high) then 
    do return a.low == b.low end;
  else
    do return false end;
  end;
end
__haxe__Int64_Int64_Impl_.eqInt = function(a,b) 
  local b_high = __haxe__Int32_Int32_Impl_.shr(b, 31);
  local b_low = b;
  if (a.high == b_high) then 
    do return a.low == b_low end;
  else
    do return false end;
  end;
end
__haxe__Int64_Int64_Impl_.neq = function(a,b) 
  if (a.high == b.high) then 
    do return a.low ~= b.low end;
  else
    do return true end;
  end;
end
__haxe__Int64_Int64_Impl_.neqInt = function(a,b) 
  local b_high = __haxe__Int32_Int32_Impl_.shr(b, 31);
  local b_low = b;
  if (a.high == b_high) then 
    do return a.low ~= b_low end;
  else
    do return true end;
  end;
end
__haxe__Int64_Int64_Impl_.lt = function(a,b) 
  local v = __haxe__Int32_Int32_Impl_.clamp(a.high - b.high);
  if (v == 0) then 
    v = __haxe__Int32_Int32_Impl_.ucompare(a.low, b.low);
  end;
  do return (function() 
    local _hx_1
    if (a.high < 0) then 
    _hx_1 = (function() 
      local _hx_2
      if (b.high < 0) then 
      _hx_2 = v; else 
      _hx_2 = -1; end
      return _hx_2
    end )(); elseif (b.high >= 0) then 
    _hx_1 = v; else 
    _hx_1 = 1; end
    return _hx_1
  end )() < 0 end;
end
__haxe__Int64_Int64_Impl_.ltInt = function(a,b) 
  local b_high = __haxe__Int32_Int32_Impl_.shr(b, 31);
  local b_low = b;
  local v = __haxe__Int32_Int32_Impl_.clamp(a.high - b_high);
  if (v == 0) then 
    v = __haxe__Int32_Int32_Impl_.ucompare(a.low, b_low);
  end;
  do return (function() 
    local _hx_1
    if (a.high < 0) then 
    _hx_1 = (function() 
      local _hx_2
      if (b_high < 0) then 
      _hx_2 = v; else 
      _hx_2 = -1; end
      return _hx_2
    end )(); elseif (b_high >= 0) then 
    _hx_1 = v; else 
    _hx_1 = 1; end
    return _hx_1
  end )() < 0 end;
end
__haxe__Int64_Int64_Impl_.intLt = function(a,b) 
  local a_high = __haxe__Int32_Int32_Impl_.shr(a, 31);
  local a_low = a;
  local v = __haxe__Int32_Int32_Impl_.clamp(a_high - b.high);
  if (v == 0) then 
    v = __haxe__Int32_Int32_Impl_.ucompare(a_low, b.low);
  end;
  do return (function() 
    local _hx_1
    if (a_high < 0) then 
    _hx_1 = (function() 
      local _hx_2
      if (b.high < 0) then 
      _hx_2 = v; else 
      _hx_2 = -1; end
      return _hx_2
    end )(); elseif (b.high >= 0) then 
    _hx_1 = v; else 
    _hx_1 = 1; end
    return _hx_1
  end )() < 0 end;
end
__haxe__Int64_Int64_Impl_.lte = function(a,b) 
  local v = __haxe__Int32_Int32_Impl_.clamp(a.high - b.high);
  if (v == 0) then 
    v = __haxe__Int32_Int32_Impl_.ucompare(a.low, b.low);
  end;
  do return (function() 
    local _hx_1
    if (a.high < 0) then 
    _hx_1 = (function() 
      local _hx_2
      if (b.high < 0) then 
      _hx_2 = v; else 
      _hx_2 = -1; end
      return _hx_2
    end )(); elseif (b.high >= 0) then 
    _hx_1 = v; else 
    _hx_1 = 1; end
    return _hx_1
  end )() <= 0 end;
end
__haxe__Int64_Int64_Impl_.lteInt = function(a,b) 
  local b_high = __haxe__Int32_Int32_Impl_.shr(b, 31);
  local b_low = b;
  local v = __haxe__Int32_Int32_Impl_.clamp(a.high - b_high);
  if (v == 0) then 
    v = __haxe__Int32_Int32_Impl_.ucompare(a.low, b_low);
  end;
  do return (function() 
    local _hx_1
    if (a.high < 0) then 
    _hx_1 = (function() 
      local _hx_2
      if (b_high < 0) then 
      _hx_2 = v; else 
      _hx_2 = -1; end
      return _hx_2
    end )(); elseif (b_high >= 0) then 
    _hx_1 = v; else 
    _hx_1 = 1; end
    return _hx_1
  end )() <= 0 end;
end
__haxe__Int64_Int64_Impl_.intLte = function(a,b) 
  local a_high = __haxe__Int32_Int32_Impl_.shr(a, 31);
  local a_low = a;
  local v = __haxe__Int32_Int32_Impl_.clamp(a_high - b.high);
  if (v == 0) then 
    v = __haxe__Int32_Int32_Impl_.ucompare(a_low, b.low);
  end;
  do return (function() 
    local _hx_1
    if (a_high < 0) then 
    _hx_1 = (function() 
      local _hx_2
      if (b.high < 0) then 
      _hx_2 = v; else 
      _hx_2 = -1; end
      return _hx_2
    end )(); elseif (b.high >= 0) then 
    _hx_1 = v; else 
    _hx_1 = 1; end
    return _hx_1
  end )() <= 0 end;
end
__haxe__Int64_Int64_Impl_.gt = function(a,b) 
  local v = __haxe__Int32_Int32_Impl_.clamp(a.high - b.high);
  if (v == 0) then 
    v = __haxe__Int32_Int32_Impl_.ucompare(a.low, b.low);
  end;
  do return (function() 
    local _hx_1
    if (a.high < 0) then 
    _hx_1 = (function() 
      local _hx_2
      if (b.high < 0) then 
      _hx_2 = v; else 
      _hx_2 = -1; end
      return _hx_2
    end )(); elseif (b.high >= 0) then 
    _hx_1 = v; else 
    _hx_1 = 1; end
    return _hx_1
  end )() > 0 end;
end
__haxe__Int64_Int64_Impl_.gtInt = function(a,b) 
  local b_high = __haxe__Int32_Int32_Impl_.shr(b, 31);
  local b_low = b;
  local v = __haxe__Int32_Int32_Impl_.clamp(a.high - b_high);
  if (v == 0) then 
    v = __haxe__Int32_Int32_Impl_.ucompare(a.low, b_low);
  end;
  do return (function() 
    local _hx_1
    if (a.high < 0) then 
    _hx_1 = (function() 
      local _hx_2
      if (b_high < 0) then 
      _hx_2 = v; else 
      _hx_2 = -1; end
      return _hx_2
    end )(); elseif (b_high >= 0) then 
    _hx_1 = v; else 
    _hx_1 = 1; end
    return _hx_1
  end )() > 0 end;
end
__haxe__Int64_Int64_Impl_.intGt = function(a,b) 
  local a_high = __haxe__Int32_Int32_Impl_.shr(a, 31);
  local a_low = a;
  local v = __haxe__Int32_Int32_Impl_.clamp(a_high - b.high);
  if (v == 0) then 
    v = __haxe__Int32_Int32_Impl_.ucompare(a_low, b.low);
  end;
  do return (function() 
    local _hx_1
    if (a_high < 0) then 
    _hx_1 = (function() 
      local _hx_2
      if (b.high < 0) then 
      _hx_2 = v; else 
      _hx_2 = -1; end
      return _hx_2
    end )(); elseif (b.high >= 0) then 
    _hx_1 = v; else 
    _hx_1 = 1; end
    return _hx_1
  end )() > 0 end;
end
__haxe__Int64_Int64_Impl_.gte = function(a,b) 
  local v = __haxe__Int32_Int32_Impl_.clamp(a.high - b.high);
  if (v == 0) then 
    v = __haxe__Int32_Int32_Impl_.ucompare(a.low, b.low);
  end;
  do return (function() 
    local _hx_1
    if (a.high < 0) then 
    _hx_1 = (function() 
      local _hx_2
      if (b.high < 0) then 
      _hx_2 = v; else 
      _hx_2 = -1; end
      return _hx_2
    end )(); elseif (b.high >= 0) then 
    _hx_1 = v; else 
    _hx_1 = 1; end
    return _hx_1
  end )() >= 0 end;
end
__haxe__Int64_Int64_Impl_.gteInt = function(a,b) 
  local b_high = __haxe__Int32_Int32_Impl_.shr(b, 31);
  local b_low = b;
  local v = __haxe__Int32_Int32_Impl_.clamp(a.high - b_high);
  if (v == 0) then 
    v = __haxe__Int32_Int32_Impl_.ucompare(a.low, b_low);
  end;
  do return (function() 
    local _hx_1
    if (a.high < 0) then 
    _hx_1 = (function() 
      local _hx_2
      if (b_high < 0) then 
      _hx_2 = v; else 
      _hx_2 = -1; end
      return _hx_2
    end )(); elseif (b_high >= 0) then 
    _hx_1 = v; else 
    _hx_1 = 1; end
    return _hx_1
  end )() >= 0 end;
end
__haxe__Int64_Int64_Impl_.intGte = function(a,b) 
  local a_high = __haxe__Int32_Int32_Impl_.shr(a, 31);
  local a_low = a;
  local v = __haxe__Int32_Int32_Impl_.clamp(a_high - b.high);
  if (v == 0) then 
    v = __haxe__Int32_Int32_Impl_.ucompare(a_low, b.low);
  end;
  do return (function() 
    local _hx_1
    if (a_high < 0) then 
    _hx_1 = (function() 
      local _hx_2
      if (b.high < 0) then 
      _hx_2 = v; else 
      _hx_2 = -1; end
      return _hx_2
    end )(); elseif (b.high >= 0) then 
    _hx_1 = v; else 
    _hx_1 = 1; end
    return _hx_1
  end )() >= 0 end;
end
__haxe__Int64_Int64_Impl_.complement = function(a) 
  local a1 = a.high;
  local high = _hx_bit_clamp(_hx_bit.bnot(a1));
  local a = a.low;
  local this1 = __haxe__Int64____Int64.new(high, _hx_bit_clamp(_hx_bit.bnot(a)));
  do return this1 end;
end
__haxe__Int64_Int64_Impl_["and"] = function(a,b) 
  local this1 = __haxe__Int64____Int64.new(_hx_bit.band(a.high,b.high), _hx_bit.band(a.low,b.low));
  do return this1 end;
end
__haxe__Int64_Int64_Impl_["or"] = function(a,b) 
  local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_["or"](a.high, b.high), __haxe__Int32_Int32_Impl_["or"](a.low, b.low));
  do return this1 end;
end
__haxe__Int64_Int64_Impl_.xor = function(a,b) 
  local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.xor(a.high, b.high), __haxe__Int32_Int32_Impl_.xor(a.low, b.low));
  do return this1 end;
end
__haxe__Int64_Int64_Impl_.shl = function(a,b) 
  b = _hx_bit.band(b,63);
  if (b == 0) then 
    local this1 = __haxe__Int64____Int64.new(a.high, a.low);
    do return this1 end;
  else
    if (b < 32) then 
      local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_["or"](__haxe__Int32_Int32_Impl_.clamp(_hx_bit.lshift(a.high,b)), _hx_bit.rshift(a.low,32 - b)), __haxe__Int32_Int32_Impl_.clamp(_hx_bit.lshift(a.low,b)));
      do return this1 end;
    else
      local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.clamp(_hx_bit.lshift(a.low,b - 32)), 0);
      do return this1 end;
    end;
  end;
end
__haxe__Int64_Int64_Impl_.shr = function(a,b) 
  b = _hx_bit.band(b,63);
  if (b == 0) then 
    local this1 = __haxe__Int64____Int64.new(a.high, a.low);
    do return this1 end;
  else
    if (b < 32) then 
      local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.shr(a.high, b), __haxe__Int32_Int32_Impl_["or"](__haxe__Int32_Int32_Impl_.clamp(_hx_bit.lshift(a.high,32 - b)), _hx_bit.rshift(a.low,b)));
      do return this1 end;
    else
      local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.shr(a.high, 31), __haxe__Int32_Int32_Impl_.shr(a.high, b - 32));
      do return this1 end;
    end;
  end;
end
__haxe__Int64_Int64_Impl_.ushr = function(a,b) 
  b = _hx_bit.band(b,63);
  if (b == 0) then 
    local this1 = __haxe__Int64____Int64.new(a.high, a.low);
    do return this1 end;
  else
    if (b < 32) then 
      local this1 = __haxe__Int64____Int64.new(_hx_bit.rshift(a.high,b), __haxe__Int32_Int32_Impl_["or"](__haxe__Int32_Int32_Impl_.clamp(_hx_bit.lshift(a.high,32 - b)), _hx_bit.rshift(a.low,b)));
      do return this1 end;
    else
      local this1 = __haxe__Int64____Int64.new(0, _hx_bit.rshift(a.high,b - 32));
      do return this1 end;
    end;
  end;
end
__haxe__Int64_Int64_Impl_.get_high = function(this1) 
  do return this1.high end;
end
__haxe__Int64_Int64_Impl_.set_high = function(this1,x) 
  this1.high = x do return this1.high end;
end
__haxe__Int64_Int64_Impl_.get_low = function(this1) 
  do return this1.low end;
end
__haxe__Int64_Int64_Impl_.set_low = function(this1,x) 
  this1.low = x do return this1.low end;
end

__haxe__Int64____Int64.new = function(high,low) 
  local self = _hx_new(__haxe__Int64____Int64.prototype)
  __haxe__Int64____Int64.super(self,high,low)
  return self
end
__haxe__Int64____Int64.super = function(self,high,low) 
  self.high = high;
  self.low = low;
end
_hxClasses["haxe._Int64.___Int64"] = __haxe__Int64____Int64
__haxe__Int64____Int64.__name__ = "haxe._Int64.___Int64"
__haxe__Int64____Int64.prototype = _hx_e();
__haxe__Int64____Int64.prototype.high= nil;
__haxe__Int64____Int64.prototype.low= nil;
__haxe__Int64____Int64.prototype.toString = function(self) 
  do return _hx_wrap_if_string_field(__haxe__Int64_Int64_Impl_,'toString')(self) end
end

__haxe__Int64____Int64.prototype.__class__ =  __haxe__Int64____Int64

__haxe_Int64Helper.new = {}
_hxClasses["haxe.Int64Helper"] = __haxe_Int64Helper
__haxe_Int64Helper.__name__ = "haxe.Int64Helper"
__haxe_Int64Helper.parseString = function(sParam) 
  local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.shr(10, 31), 10);
  local base = this1;
  local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.shr(0, 31), 0);
  local current = this1;
  local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.shr(1, 31), 1);
  local multiplier = this1;
  local sIsNegative = false;
  local s = StringTools.trim(sParam);
  if (__lua_lib_luautf8_Utf8.sub(s, 1, 1) == "-") then 
    sIsNegative = true;
    local startIndex = 1;
    local endIndex = __lua_lib_luautf8_Utf8.len(s);
    if (endIndex == nil) then 
      endIndex = __lua_lib_luautf8_Utf8.len(s);
    end;
    if (endIndex < 0) then 
      endIndex = 0;
    end;
    if (startIndex < 0) then 
      startIndex = 0;
    end;
    s = (function() 
      local _hx_1
      if (endIndex < startIndex) then 
      _hx_1 = __lua_lib_luautf8_Utf8.sub(s, endIndex + 1, startIndex); else 
      _hx_1 = __lua_lib_luautf8_Utf8.sub(s, startIndex + 1, endIndex); end
      return _hx_1
    end )();
  end;
  local len = __lua_lib_luautf8_Utf8.len(s);
  local _g = 0;
  local _g1 = len;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    local digitInt = __lua_lib_luautf8_Utf8.byte(s, ((len - 1) - i) + 1) - 48;
    if ((digitInt < 0) or (digitInt > 9)) then 
      _G.error(__haxe_Exception.thrown("NumberFormatError"),0);
    end;
    if (digitInt ~= 0) then 
      local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.shr(digitInt, 31), digitInt);
      local digit = this1;
      if (sIsNegative) then 
        local b = __haxe__Int64_Int64_Impl_.mul(multiplier, digit);
        local high = __haxe__Int32_Int32_Impl_.clamp(current.high - b.high);
        local low = __haxe__Int32_Int32_Impl_.clamp(current.low - b.low);
        if (__haxe__Int32_Int32_Impl_.ucompare(current.low, b.low) < 0) then 
          high = high - 1;
          local ret = high + 1;
          high = __haxe__Int32_Int32_Impl_.clamp(high);
        end;
        local this1 = __haxe__Int64____Int64.new(high, low);
        current = this1;
        if (not (current.high < 0)) then 
          _G.error(__haxe_Exception.thrown("NumberFormatError: Underflow"),0);
        end;
      else
        local b = __haxe__Int64_Int64_Impl_.mul(multiplier, digit);
        local high = __haxe__Int32_Int32_Impl_.clamp(current.high + b.high);
        local low = __haxe__Int32_Int32_Impl_.clamp(current.low + b.low);
        if (__haxe__Int32_Int32_Impl_.ucompare(low, current.low) < 0) then 
          high = high + 1;
          local ret = high - 1;
          high = __haxe__Int32_Int32_Impl_.clamp(high);
        end;
        local this1 = __haxe__Int64____Int64.new(high, low);
        current = this1;
        if (current.high < 0) then 
          _G.error(__haxe_Exception.thrown("NumberFormatError: Overflow"),0);
        end;
      end;
    end;
    multiplier = __haxe__Int64_Int64_Impl_.mul(multiplier, base);
  end;
  do return current end;
end
__haxe_Int64Helper.fromFloat = function(f) 
  if (Math.isNaN(f) or not Math.isFinite(f)) then 
    _G.error(__haxe_Exception.thrown("Number is NaN or Infinite"),0);
  end;
  local noFractions = f - (_G.math.fmod(f, 1));
  if (noFractions > 9007199254740991) then 
    _G.error(__haxe_Exception.thrown("Conversion overflow"),0);
  end;
  if (noFractions < -9007199254740991) then 
    _G.error(__haxe_Exception.thrown("Conversion underflow"),0);
  end;
  local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.shr(0, 31), 0);
  local result = this1;
  local neg = noFractions < 0;
  local rest = (function() 
    local _hx_1
    if (neg) then 
    _hx_1 = -noFractions; else 
    _hx_1 = noFractions; end
    return _hx_1
  end )();
  local i = 0;
  while (rest >= 1) do 
    local curr = _G.math.fmod(rest, 2);
    rest = rest / 2;
    if (curr >= 1) then 
      local a_high = __haxe__Int32_Int32_Impl_.shr(1, 31);
      local a_low = 1;
      local b = i;
      b = _hx_bit.band(b,63);
      local b1;
      if (b == 0) then 
        local this1 = __haxe__Int64____Int64.new(a_high, a_low);
        b1 = this1;
      else
        if (b < 32) then 
          local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_["or"](__haxe__Int32_Int32_Impl_.clamp(_hx_bit.lshift(a_high,b)), _hx_bit.rshift(a_low,32 - b)), __haxe__Int32_Int32_Impl_.clamp(_hx_bit.lshift(a_low,b)));
          b1 = this1;
        else
          local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.clamp(_hx_bit.lshift(a_low,b - 32)), 0);
          b1 = this1;
        end;
      end;
      local high = __haxe__Int32_Int32_Impl_.clamp(result.high + b1.high);
      local low = __haxe__Int32_Int32_Impl_.clamp(result.low + b1.low);
      if (__haxe__Int32_Int32_Impl_.ucompare(low, result.low) < 0) then 
        high = high + 1;
        local ret = high - 1;
        high = __haxe__Int32_Int32_Impl_.clamp(high);
      end;
      local this1 = __haxe__Int64____Int64.new(high, low);
      result = this1;
    end;
    i = i + 1;
  end;
  if (neg) then 
    local a = result.high;
    local high = _hx_bit_clamp(_hx_bit.bnot(a));
    local low = __haxe__Int32_Int32_Impl_.clamp(_hx_bit.bnot(result.low) + 1);
    if (low == 0) then 
      high = high + 1;
      local ret = high - 1;
      high = __haxe__Int32_Int32_Impl_.clamp(high);
    end;
    local this1 = __haxe__Int64____Int64.new(high, low);
    result = this1;
  end;
  do return result end;
end

__haxe_NativeStackTrace.new = {}
_hxClasses["haxe.NativeStackTrace"] = __haxe_NativeStackTrace
__haxe_NativeStackTrace.__name__ = "haxe.NativeStackTrace"
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
__haxe_NativeStackTrace.toHaxe = function(native,skip) 
  if (skip == nil) then 
    skip = 0;
  end;
  local stack = _hx_tab_array({}, 0);
  local cnt = -1;
  local _g = 0;
  local _hx_continue_1 = false;
  while (_g < native.length) do repeat 
    local item = native[_g];
    _g = _g + 1;
    local pos = 1;
    local len = nil;
    if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(item)))) then 
      len = __lua_lib_luautf8_Utf8.len(item);
    else
      if (len < 0) then 
        len = __lua_lib_luautf8_Utf8.len(item) + len;
      end;
    end;
    if (pos < 0) then 
      pos = __lua_lib_luautf8_Utf8.len(item) + pos;
    end;
    if (pos < 0) then 
      pos = 0;
    end;
    local _this = __lua_lib_luautf8_Utf8.sub(item, pos + 1, pos + len);
    local idx = 1;
    local ret = _hx_tab_array({}, 0);
    while (idx ~= nil) do 
      local newidx = 0;
      if (__lua_lib_luautf8_Utf8.len(":") > 0) then 
        newidx = __lua_lib_luautf8_Utf8.find(_this, ":", idx, true);
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
        idx = newidx + __lua_lib_luautf8_Utf8.len(":");
      else
        ret:push(__lua_lib_luautf8_Utf8.sub(_this, idx, __lua_lib_luautf8_Utf8.len(_this)));
        idx = nil;
      end;
    end;
    local parts = ret;
    local file = parts[0];
    if (file == "[C]") then 
      break;
    end;
    cnt = cnt + 1;
    if (skip > cnt) then 
      break;
    end;
    local line = parts[1];
    local method;
    if (parts.length <= 2) then 
      method = nil;
    else
      local _this = parts[2];
      local startIndex = nil;
      if (startIndex == nil) then 
        startIndex = 1;
      else
        startIndex = startIndex + 1;
      end;
      local r = __lua_lib_luautf8_Utf8.find(_this, "'", startIndex, true);
      local methodPos = (function() 
        local _hx_1
        if ((r ~= nil) and (r > 0)) then 
        _hx_1 = r - 1; else 
        _hx_1 = -1; end
        return _hx_1
      end )();
      if (methodPos < 0) then 
        method = nil;
      else
        local _this = parts[2];
        local startIndex = methodPos + 1;
        local endIndex = __lua_lib_luautf8_Utf8.len(parts[2]) - 1;
        if (endIndex == nil) then 
          endIndex = __lua_lib_luautf8_Utf8.len(_this);
        end;
        if (endIndex < 0) then 
          endIndex = 0;
        end;
        if (startIndex < 0) then 
          startIndex = 0;
        end;
        method = __haxe_StackItem.Method(nil, (function() 
          local _hx_2
          if (endIndex < startIndex) then 
          _hx_2 = __lua_lib_luautf8_Utf8.sub(_this, endIndex + 1, startIndex); else 
          _hx_2 = __lua_lib_luautf8_Utf8.sub(_this, startIndex + 1, endIndex); end
          return _hx_2
        end )());
      end;
    end;
    stack:push(__haxe_StackItem.FilePos(method, file, Std.parseInt(line)));until true
    if _hx_continue_1 then 
    _hx_continue_1 = false;
    break;
    end;
    
  end;
  do return stack end;
end

__haxe__Rest_Rest_Impl_.new = {}
_hxClasses["haxe._Rest.Rest_Impl_"] = __haxe__Rest_Rest_Impl_
__haxe__Rest_Rest_Impl_.__name__ = "haxe._Rest.Rest_Impl_"
__haxe__Rest_Rest_Impl_.__properties__ = {get_length="get_length"}
__haxe__Rest_Rest_Impl_.get_length = function(this1) 
  do return _hx_table.maxn(this1) end;
end
__haxe__Rest_Rest_Impl_.of = function(array) 
  local ret = ({});
  local _g = 0;
  local _g1 = array.length;
  while (_g < _g1) do 
    _g = _g + 1;
    local idx = _g - 1;
    ret[idx + 1] = array[idx];
  end;
  local this1 = ret;
  do return this1 end;
end
__haxe__Rest_Rest_Impl_._new = function(table) 
  local this1 = table;
  do return this1 end;
end
__haxe__Rest_Rest_Impl_.get = function(this1,index) 
  do return this1[index + 1] end;
end
__haxe__Rest_Rest_Impl_.toArray = function(this1) 
  local length = nil;
  local tab = __lua_PairTools.copy(this1);
  local length = length;
  if (length == nil) then 
    length = _hx_table.maxn(tab);
    if (length > 0) then 
      local head = tab[1];
      _G.table.remove(tab, 1);
      tab[0] = head;
      do return _hx_tab_array(tab, length) end;
    else
      do return _hx_tab_array({}, 0) end;
    end;
  else
    do return _hx_tab_array(tab, length) end;
  end;
end
__haxe__Rest_Rest_Impl_.iterator = function(this1) 
  do return __haxe_iterators_RestIterator.new(this1) end;
end
__haxe__Rest_Rest_Impl_.keyValueIterator = function(this1) 
  do return __haxe_iterators_RestKeyValueIterator.new(this1) end;
end
__haxe__Rest_Rest_Impl_.append = function(this1,item) 
  local result = __lua_PairTools.copy(this1);
  _G.table.insert(result, item);
  local this1 = result;
  do return this1 end;
end
__haxe__Rest_Rest_Impl_.prepend = function(this1,item) 
  local result = __lua_PairTools.copy(this1);
  _G.table.insert(result, 1, item);
  local this1 = result;
  do return this1 end;
end
__haxe__Rest_Rest_Impl_.toString = function(this1) 
  do return __haxe__Rest_Rest_Impl_.toArray(this1):toString() end;
end

__haxe_ValueException.new = function(value,previous,native) 
  local self = _hx_new(__haxe_ValueException.prototype)
  __haxe_ValueException.super(self,value,previous,native)
  return self
end
__haxe_ValueException.super = function(self,value,previous,native) 
  __haxe_Exception.super(self,Std.string(value),previous,native);
  self.value = value;
  self.__skipStack = self.__skipStack + 1;
end
_hxClasses["haxe.ValueException"] = __haxe_ValueException
__haxe_ValueException.__name__ = "haxe.ValueException"
__haxe_ValueException.prototype = _hx_e();
__haxe_ValueException.prototype.value= nil;
__haxe_ValueException.prototype.unwrap = function(self) 
  do return self.value end
end

__haxe_ValueException.prototype.__class__ =  __haxe_ValueException
__haxe_ValueException.__super__ = __haxe_Exception
setmetatable(__haxe_ValueException.prototype,{__index=__haxe_Exception.prototype})
setmetatable(__haxe_ValueException.prototype.__properties__,{__index=__haxe_Exception.prototype.__properties__})

__haxe_ds_BalancedTree.new = function() 
  local self = _hx_new(__haxe_ds_BalancedTree.prototype)
  __haxe_ds_BalancedTree.super(self)
  return self
end
__haxe_ds_BalancedTree.super = function(self) 
end
_hxClasses["haxe.ds.BalancedTree"] = __haxe_ds_BalancedTree
__haxe_ds_BalancedTree.__name__ = "haxe.ds.BalancedTree"
__haxe_ds_BalancedTree.__interfaces__ = {__haxe_IMap}
__haxe_ds_BalancedTree.iteratorLoop = function(node,acc) 
  if (node ~= nil) then 
    __haxe_ds_BalancedTree.iteratorLoop(node.left, acc);
    acc:push(node.value);
    __haxe_ds_BalancedTree.iteratorLoop(node.right, acc);
  end;
end
__haxe_ds_BalancedTree.prototype = _hx_e();
__haxe_ds_BalancedTree.prototype.root= nil;
__haxe_ds_BalancedTree.prototype.set = function(self,key,value) 
  self.root = self:setLoop(key, value, self.root);
end
__haxe_ds_BalancedTree.prototype.get = function(self,key) 
  local node = self.root;
  while (node ~= nil) do 
    local c = self:compare(key, node.key);
    if (c == 0) then 
      do return node.value end;
    end;
    if (c < 0) then 
      node = node.left;
    else
      node = node.right;
    end;
  end;
  do return nil end
end
__haxe_ds_BalancedTree.prototype.remove = function(self,key) 
  local _hx_status, _hx_result = pcall(function() 
  
      self.root = self:removeLoop(key, self.root);
      do return true end;
    return _hx_pcall_default
  end)
  if not _hx_status and _hx_result == "_hx_pcall_break" then
  elseif not _hx_status then 
    local _g = _hx_result;
    if (__lua_Boot.__instanceof(__haxe_Exception.caught(_g):unwrap(), String)) then 
      do return false end;
    else
      _G.error(_g,0);
    end;
  elseif _hx_result ~= _hx_pcall_default then
    return _hx_result
  end;
end
__haxe_ds_BalancedTree.prototype.exists = function(self,key) 
  local node = self.root;
  while (node ~= nil) do 
    local c = self:compare(key, node.key);
    if (c == 0) then 
      do return true end;
    else
      if (c < 0) then 
        node = node.left;
      else
        node = node.right;
      end;
    end;
  end;
  do return false end
end
__haxe_ds_BalancedTree.prototype.iterator = function(self) 
  local ret = _hx_tab_array({}, 0);
  __haxe_ds_BalancedTree.iteratorLoop(self.root, ret);
  do return __haxe_iterators_ArrayIterator.new(ret) end
end
__haxe_ds_BalancedTree.prototype.keyValueIterator = function(self) 
  do return __haxe_iterators_MapKeyValueIterator.new(self) end
end
__haxe_ds_BalancedTree.prototype.keys = function(self) 
  local ret = _hx_tab_array({}, 0);
  self:keysLoop(self.root, ret);
  do return __haxe_iterators_ArrayIterator.new(ret) end
end
__haxe_ds_BalancedTree.prototype.copy = function(self) 
  local copied = __haxe_ds_BalancedTree.new();
  copied.root = self.root;
  do return copied end
end
__haxe_ds_BalancedTree.prototype.setLoop = function(self,k,v,node) 
  if (node == nil) then 
    do return __haxe_ds_TreeNode.new(nil, k, v, nil) end;
  end;
  local c = self:compare(k, node.key);
  if (c == 0) then 
    do return __haxe_ds_TreeNode.new(node.left, k, v, node.right, (function() 
      local _hx_1
      if (node == nil) then 
      _hx_1 = 0; else 
      _hx_1 = node._height; end
      return _hx_1
    end )()) end;
  else
    if (c < 0) then 
      local nl = self:setLoop(k, v, node.left);
      do return self:balance(nl, node.key, node.value, node.right) end;
    else
      local nr = self:setLoop(k, v, node.right);
      do return self:balance(node.left, node.key, node.value, nr) end;
    end;
  end;
end
__haxe_ds_BalancedTree.prototype.removeLoop = function(self,k,node) 
  if (node == nil) then 
    _G.error(__haxe_Exception.thrown("Not_found"),0);
  end;
  local c = self:compare(k, node.key);
  if (c == 0) then 
    do return self:merge(node.left, node.right) end;
  else
    if (c < 0) then 
      do return self:balance(self:removeLoop(k, node.left), node.key, node.value, node.right) end;
    else
      do return self:balance(node.left, node.key, node.value, self:removeLoop(k, node.right)) end;
    end;
  end;
end
__haxe_ds_BalancedTree.prototype.keysLoop = function(self,node,acc) 
  if (node ~= nil) then 
    self:keysLoop(node.left, acc);
    acc:push(node.key);
    self:keysLoop(node.right, acc);
  end;
end
__haxe_ds_BalancedTree.prototype.merge = function(self,t1,t2) 
  if (t1 == nil) then 
    do return t2 end;
  end;
  if (t2 == nil) then 
    do return t1 end;
  end;
  local t = self:minBinding(t2);
  do return self:balance(t1, t.key, t.value, self:removeMinBinding(t2)) end
end
__haxe_ds_BalancedTree.prototype.minBinding = function(self,t) 
  if (t == nil) then 
    _G.error(__haxe_Exception.thrown("Not_found"),0);
  else
    if (t.left == nil) then 
      do return t end;
    else
      do return self:minBinding(t.left) end;
    end;
  end;
end
__haxe_ds_BalancedTree.prototype.removeMinBinding = function(self,t) 
  if (t.left == nil) then 
    do return t.right end;
  else
    do return self:balance(self:removeMinBinding(t.left), t.key, t.value, t.right) end;
  end;
end
__haxe_ds_BalancedTree.prototype.balance = function(self,l,k,v,r) 
  local hl = (function() 
    local _hx_1
    if (l == nil) then 
    _hx_1 = 0; else 
    _hx_1 = l._height; end
    return _hx_1
  end )();
  local hr = (function() 
    local _hx_2
    if (r == nil) then 
    _hx_2 = 0; else 
    _hx_2 = r._height; end
    return _hx_2
  end )();
  if (hl > (hr + 2)) then 
    local _this = l.left;
    local _this1 = l.right;
    if ((function() 
      local _hx_3
      if (_this == nil) then 
      _hx_3 = 0; else 
      _hx_3 = _this._height; end
      return _hx_3
    end )() >= (function() 
      local _hx_4
      if (_this1 == nil) then 
      _hx_4 = 0; else 
      _hx_4 = _this1._height; end
      return _hx_4
    end )()) then 
      do return __haxe_ds_TreeNode.new(l.left, l.key, l.value, __haxe_ds_TreeNode.new(l.right, k, v, r)) end;
    else
      do return __haxe_ds_TreeNode.new(__haxe_ds_TreeNode.new(l.left, l.key, l.value, l.right.left), l.right.key, l.right.value, __haxe_ds_TreeNode.new(l.right.right, k, v, r)) end;
    end;
  else
    if (hr > (hl + 2)) then 
      local _this = r.right;
      local _this1 = r.left;
      if ((function() 
        local _hx_5
        if (_this == nil) then 
        _hx_5 = 0; else 
        _hx_5 = _this._height; end
        return _hx_5
      end )() > (function() 
        local _hx_6
        if (_this1 == nil) then 
        _hx_6 = 0; else 
        _hx_6 = _this1._height; end
        return _hx_6
      end )()) then 
        do return __haxe_ds_TreeNode.new(__haxe_ds_TreeNode.new(l, k, v, r.left), r.key, r.value, r.right) end;
      else
        do return __haxe_ds_TreeNode.new(__haxe_ds_TreeNode.new(l, k, v, r.left.left), r.left.key, r.left.value, __haxe_ds_TreeNode.new(r.left.right, r.key, r.value, r.right)) end;
      end;
    else
      do return __haxe_ds_TreeNode.new(l, k, v, r, (function() 
        local _hx_7
        if (hl > hr) then 
        _hx_7 = hl; else 
        _hx_7 = hr; end
        return _hx_7
      end )() + 1) end;
    end;
  end;
end
__haxe_ds_BalancedTree.prototype.compare = function(self,k1,k2) 
  do return Reflect.compare(k1, k2) end
end
__haxe_ds_BalancedTree.prototype.toString = function(self) 
  if (self.root == nil) then 
    do return "{}" end;
  else
    do return Std.string(Std.string("{") .. Std.string(self.root:toString())) .. Std.string("}") end;
  end;
end
__haxe_ds_BalancedTree.prototype.clear = function(self) 
  self.root = nil;
end

__haxe_ds_BalancedTree.prototype.__class__ =  __haxe_ds_BalancedTree

__haxe_ds_TreeNode.new = function(l,k,v,r,h) 
  local self = _hx_new(__haxe_ds_TreeNode.prototype)
  __haxe_ds_TreeNode.super(self,l,k,v,r,h)
  return self
end
__haxe_ds_TreeNode.super = function(self,l,k,v,r,h) 
  if (h == nil) then 
    h = -1;
  end;
  self.left = l;
  self.key = k;
  self.value = v;
  self.right = r;
  if (h == -1) then 
    local tmp;
    local _this = self.left;
    local _this1 = self.right;
    if ((function() 
      local _hx_1
      if (_this == nil) then 
      _hx_1 = 0; else 
      _hx_1 = _this._height; end
      return _hx_1
    end )() > (function() 
      local _hx_2
      if (_this1 == nil) then 
      _hx_2 = 0; else 
      _hx_2 = _this1._height; end
      return _hx_2
    end )()) then 
      local _this = self.left;
      tmp = (function() 
        local _hx_3
        if (_this == nil) then 
        _hx_3 = 0; else 
        _hx_3 = _this._height; end
        return _hx_3
      end )();
    else
      local _this = self.right;
      tmp = (function() 
        local _hx_4
        if (_this == nil) then 
        _hx_4 = 0; else 
        _hx_4 = _this._height; end
        return _hx_4
      end )();
    end;
    self._height = tmp + 1;
  else
    self._height = h;
  end;
end
_hxClasses["haxe.ds.TreeNode"] = __haxe_ds_TreeNode
__haxe_ds_TreeNode.__name__ = "haxe.ds.TreeNode"
__haxe_ds_TreeNode.prototype = _hx_e();
__haxe_ds_TreeNode.prototype.left= nil;
__haxe_ds_TreeNode.prototype.right= nil;
__haxe_ds_TreeNode.prototype.key= nil;
__haxe_ds_TreeNode.prototype.value= nil;
__haxe_ds_TreeNode.prototype._height= nil;
__haxe_ds_TreeNode.prototype.toString = function(self) 
  do return Std.string(Std.string(((function() 
    local _hx_1
    if (self.left == nil) then 
    _hx_1 = ""; else 
    _hx_1 = Std.string(self.left:toString()) .. Std.string(", "); end
    return _hx_1
  end )())) .. Std.string((Std.string(Std.string(Std.string("") .. Std.string(Std.string(self.key))) .. Std.string("=")) .. Std.string(Std.string(self.value))))) .. Std.string(((function() 
    local _hx_2
    if (self.right == nil) then 
    _hx_2 = ""; else 
    _hx_2 = Std.string(", ") .. Std.string(self.right:toString()); end
    return _hx_2
  end )())) end
end

__haxe_ds_TreeNode.prototype.__class__ =  __haxe_ds_TreeNode

__haxe_ds_EnumValueMap.new = function() 
  local self = _hx_new(__haxe_ds_EnumValueMap.prototype)
  __haxe_ds_EnumValueMap.super(self)
  return self
end
__haxe_ds_EnumValueMap.super = function(self) 
  __haxe_ds_BalancedTree.super(self);
end
_hxClasses["haxe.ds.EnumValueMap"] = __haxe_ds_EnumValueMap
__haxe_ds_EnumValueMap.__name__ = "haxe.ds.EnumValueMap"
__haxe_ds_EnumValueMap.__interfaces__ = {__haxe_IMap}
__haxe_ds_EnumValueMap.prototype = _hx_e();
__haxe_ds_EnumValueMap.prototype.compare = function(self,k1,k2) 
  local d = k1[1] - k2[1];
  if (d ~= 0) then 
    do return d end;
  end;
  local p1 = k1:slice(2);
  local p2 = k2:slice(2);
  if ((p1.length == 0) and (p2.length == 0)) then 
    do return 0 end;
  end;
  do return self:compareArgs(p1, p2) end
end
__haxe_ds_EnumValueMap.prototype.compareArgs = function(self,a1,a2) 
  local ld = a1.length - a2.length;
  if (ld ~= 0) then 
    do return ld end;
  end;
  local _g = 0;
  local _g1 = a1.length;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    local d = self:compareArg(a1[i], a2[i]);
    if (d ~= 0) then 
      do return d end;
    end;
  end;
  do return 0 end
end
__haxe_ds_EnumValueMap.prototype.compareArg = function(self,v1,v2) 
  if (Reflect.isEnumValue(v1) and Reflect.isEnumValue(v2)) then 
    do return self:compare(v1, v2) end;
  else
    if (__lua_Boot.__instanceof(v1, Array) and __lua_Boot.__instanceof(v2, Array)) then 
      do return self:compareArgs(v1, v2) end;
    else
      do return Reflect.compare(v1, v2) end;
    end;
  end;
end
__haxe_ds_EnumValueMap.prototype.copy = function(self) 
  local copied = __haxe_ds_EnumValueMap.new();
  copied.root = self.root;
  do return copied end
end

__haxe_ds_EnumValueMap.prototype.__class__ =  __haxe_ds_EnumValueMap
__haxe_ds_EnumValueMap.__super__ = __haxe_ds_BalancedTree
setmetatable(__haxe_ds_EnumValueMap.prototype,{__index=__haxe_ds_BalancedTree.prototype})

__haxe_ds__HashMap_HashMap_Impl_.new = {}
_hxClasses["haxe.ds._HashMap.HashMap_Impl_"] = __haxe_ds__HashMap_HashMap_Impl_
__haxe_ds__HashMap_HashMap_Impl_.__name__ = "haxe.ds._HashMap.HashMap_Impl_"
__haxe_ds__HashMap_HashMap_Impl_._new = function() 
  local this1 = __haxe_ds__HashMap_HashMapData.new();
  do return this1 end;
end
__haxe_ds__HashMap_HashMap_Impl_.set = function(this1,k,v) 
  local _this = this1.keys;
  local key = k:hashCode();
  if (k == nil) then 
    _this.h[key] = __haxe_ds_IntMap.tnull;
  else
    _this.h[key] = k;
  end;
  local _this = this1.values;
  local key = k:hashCode();
  if (v == nil) then 
    _this.h[key] = __haxe_ds_IntMap.tnull;
  else
    _this.h[key] = v;
  end;
end
__haxe_ds__HashMap_HashMap_Impl_.get = function(this1,k) 
  local _this = this1.values;
  local key = k:hashCode();
  local ret = _this.h[key];
  if (ret == __haxe_ds_IntMap.tnull) then 
    ret = nil;
  end;
  do return ret end;
end
__haxe_ds__HashMap_HashMap_Impl_.exists = function(this1,k) 
  local _this = this1.values;
  local key = k:hashCode();
  do return _this.h[key] ~= nil end;
end
__haxe_ds__HashMap_HashMap_Impl_.remove = function(this1,k) 
  this1.values:remove(k:hashCode());
  do return this1.keys:remove(k:hashCode()) end;
end
__haxe_ds__HashMap_HashMap_Impl_.keys = function(this1) 
  do return this1.keys:iterator() end;
end
__haxe_ds__HashMap_HashMap_Impl_.copy = function(this1) 
  local copied = __haxe_ds__HashMap_HashMapData.new();
  copied.keys = this1.keys:copy();
  copied.values = this1.values:copy();
  do return copied end;
end
__haxe_ds__HashMap_HashMap_Impl_.iterator = function(this1) 
  do return this1.values:iterator() end;
end
__haxe_ds__HashMap_HashMap_Impl_.keyValueIterator = function(this1) 
  do return __haxe_iterators_HashMapKeyValueIterator.new(this1) end;
end
__haxe_ds__HashMap_HashMap_Impl_.clear = function(this1) 
  this1.keys.h = ({});
  this1.values.h = ({});
end

__haxe_ds__HashMap_HashMapData.new = function() 
  local self = _hx_new(__haxe_ds__HashMap_HashMapData.prototype)
  __haxe_ds__HashMap_HashMapData.super(self)
  return self
end
__haxe_ds__HashMap_HashMapData.super = function(self) 
  self.keys = __haxe_ds_IntMap.new();
  self.values = __haxe_ds_IntMap.new();
end
_hxClasses["haxe.ds._HashMap.HashMapData"] = __haxe_ds__HashMap_HashMapData
__haxe_ds__HashMap_HashMapData.__name__ = "haxe.ds._HashMap.HashMapData"
__haxe_ds__HashMap_HashMapData.prototype = _hx_e();
__haxe_ds__HashMap_HashMapData.prototype.keys= nil;
__haxe_ds__HashMap_HashMapData.prototype.values= nil;

__haxe_ds__HashMap_HashMapData.prototype.__class__ =  __haxe_ds__HashMap_HashMapData

__haxe_ds_IntMap.new = function() 
  local self = _hx_new(__haxe_ds_IntMap.prototype)
  __haxe_ds_IntMap.super(self)
  return self
end
__haxe_ds_IntMap.super = function(self) 
  self.h = ({});
end
_hxClasses["haxe.ds.IntMap"] = __haxe_ds_IntMap
__haxe_ds_IntMap.__name__ = "haxe.ds.IntMap"
__haxe_ds_IntMap.__interfaces__ = {__haxe_IMap}
__haxe_ds_IntMap.prototype = _hx_e();
__haxe_ds_IntMap.prototype.h= nil;
__haxe_ds_IntMap.prototype.set = function(self,key,value) 
  if (value == nil) then 
    self.h[key] = __haxe_ds_IntMap.tnull;
  else
    self.h[key] = value;
  end;
end
__haxe_ds_IntMap.prototype.get = function(self,key) 
  local ret = self.h[key];
  if (ret == __haxe_ds_IntMap.tnull) then 
    ret = nil;
  end;
  do return ret end
end
__haxe_ds_IntMap.prototype.exists = function(self,key) 
  do return self.h[key] ~= nil end
end
__haxe_ds_IntMap.prototype.remove = function(self,key) 
  if (self.h[key] == nil) then 
    do return false end;
  else
    self.h[key] = nil;
    do return true end;
  end;
end
__haxe_ds_IntMap.prototype.keys = function(self) 
  local _gthis = self;
  local next = _G.next;
  local cur = next(self.h, nil);
  do return _hx_o({__fields__={next=true,hasNext=true},next=function(self) 
    local ret = cur;
    cur = next(_gthis.h, cur);
    do return ret end;
  end,hasNext=function(self) 
    do return cur ~= nil end;
  end}) end
end
__haxe_ds_IntMap.prototype.iterator = function(self) 
  local _gthis = self;
  local it = self:keys();
  do return _hx_o({__fields__={hasNext=true,next=true},hasNext=function(self) 
    do return it:hasNext() end;
  end,next=function(self) 
    do return _gthis.h[it:next()] end;
  end}) end
end
__haxe_ds_IntMap.prototype.keyValueIterator = function(self) 
  do return __haxe_iterators_MapKeyValueIterator.new(self) end
end
__haxe_ds_IntMap.prototype.copy = function(self) 
  local copied = __haxe_ds_IntMap.new();
  local key = self:keys();
  while (key:hasNext()) do 
    local key = key:next();
    local ret = self.h[key];
    if (ret == __haxe_ds_IntMap.tnull) then 
      ret = nil;
    end;
    local value = ret;
    if (value == nil) then 
      copied.h[key] = __haxe_ds_IntMap.tnull;
    else
      copied.h[key] = value;
    end;
  end;
  do return copied end
end
__haxe_ds_IntMap.prototype.toString = function(self) 
  local s_b = ({});
  local s_length = 0;
  local str = "{";
  _G.table.insert(s_b, str);
  s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
  local it = self:keys();
  local i = it;
  while (i:hasNext()) do 
    local i = i:next();
    local str = Std.string(i);
    _G.table.insert(s_b, str);
    s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
    local str = " => ";
    _G.table.insert(s_b, str);
    s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
    local ret = self.h[i];
    if (ret == __haxe_ds_IntMap.tnull) then 
      ret = nil;
    end;
    local str = Std.string(ret);
    _G.table.insert(s_b, str);
    s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
    if (it:hasNext()) then 
      local str = ", ";
      _G.table.insert(s_b, str);
      s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
    end;
  end;
  local str = "}";
  _G.table.insert(s_b, str);
  s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
  do return _G.table.concat(s_b) end
end
__haxe_ds_IntMap.prototype.clear = function(self) 
  self.h = ({});
end

__haxe_ds_IntMap.prototype.__class__ =  __haxe_ds_IntMap

__haxe_ds_List.new = function() 
  local self = _hx_new(__haxe_ds_List.prototype)
  __haxe_ds_List.super(self)
  return self
end
__haxe_ds_List.super = function(self) 
  self.length = 0;
end
_hxClasses["haxe.ds.List"] = __haxe_ds_List
__haxe_ds_List.__name__ = "haxe.ds.List"
__haxe_ds_List.prototype = _hx_e();
__haxe_ds_List.prototype.h= nil;
__haxe_ds_List.prototype.q= nil;
__haxe_ds_List.prototype.length= nil;
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
__haxe_ds_List.prototype.last = function(self) 
  if (self.q == nil) then 
    do return nil end;
  else
    do return self.q.item end;
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
__haxe_ds_List.prototype.clear = function(self) 
  self.h = nil;
  self.q = nil;
  self.length = 0;
end
__haxe_ds_List.prototype.remove = function(self,v) 
  local prev = nil;
  local l = self.h;
  while (l ~= nil) do 
    if (l.item == v) then 
      if (prev == nil) then 
        self.h = l.next;
      else
        prev.next = l.next;
      end;
      if (self.q == l) then 
        self.q = prev;
      end;
      self.length = self.length - 1;
      do return true end;
    end;
    prev = l;
    l = l.next;
  end;
  do return false end
end
__haxe_ds_List.prototype.iterator = function(self) 
  do return __haxe_ds__List_ListIterator.new(self.h) end
end
__haxe_ds_List.prototype.keyValueIterator = function(self) 
  do return __haxe_ds__List_ListKeyValueIterator.new(self.h) end
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
__haxe_ds_List.prototype.join = function(self,sep) 
  local s_b = ({});
  local s_length = 0;
  local first = true;
  local l = self.h;
  while (l ~= nil) do 
    if (first) then 
      first = false;
    else
      local str = Std.string(sep);
      _G.table.insert(s_b, str);
      s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
    end;
    local str = Std.string(l.item);
    _G.table.insert(s_b, str);
    s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
    l = l.next;
  end;
  do return _G.table.concat(s_b) end
end
__haxe_ds_List.prototype.filter = function(self,f) 
  local l2 = __haxe_ds_List.new();
  local l = self.h;
  while (l ~= nil) do 
    local v = l.item;
    l = l.next;
    if (f(v)) then 
      l2:add(v);
    end;
  end;
  do return l2 end
end
__haxe_ds_List.prototype.map = function(self,f) 
  local b = __haxe_ds_List.new();
  local l = self.h;
  while (l ~= nil) do 
    local v = l.item;
    l = l.next;
    b:add(f(v));
  end;
  do return b end
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
_hxClasses["haxe.ds._List.ListNode"] = __haxe_ds__List_ListNode
__haxe_ds__List_ListNode.__name__ = "haxe.ds._List.ListNode"
__haxe_ds__List_ListNode.prototype = _hx_e();
__haxe_ds__List_ListNode.prototype.item= nil;
__haxe_ds__List_ListNode.prototype.next= nil;

__haxe_ds__List_ListNode.prototype.__class__ =  __haxe_ds__List_ListNode

__haxe_ds__List_ListIterator.new = function(head) 
  local self = _hx_new(__haxe_ds__List_ListIterator.prototype)
  __haxe_ds__List_ListIterator.super(self,head)
  return self
end
__haxe_ds__List_ListIterator.super = function(self,head) 
  self.head = head;
end
_hxClasses["haxe.ds._List.ListIterator"] = __haxe_ds__List_ListIterator
__haxe_ds__List_ListIterator.__name__ = "haxe.ds._List.ListIterator"
__haxe_ds__List_ListIterator.prototype = _hx_e();
__haxe_ds__List_ListIterator.prototype.head= nil;
__haxe_ds__List_ListIterator.prototype.hasNext = function(self) 
  do return self.head ~= nil end
end
__haxe_ds__List_ListIterator.prototype.next = function(self) 
  local val = self.head.item;
  self.head = self.head.next;
  do return val end
end

__haxe_ds__List_ListIterator.prototype.__class__ =  __haxe_ds__List_ListIterator

__haxe_ds__List_ListKeyValueIterator.new = function(head) 
  local self = _hx_new(__haxe_ds__List_ListKeyValueIterator.prototype)
  __haxe_ds__List_ListKeyValueIterator.super(self,head)
  return self
end
__haxe_ds__List_ListKeyValueIterator.super = function(self,head) 
  self.head = head;
  self.idx = 0;
end
_hxClasses["haxe.ds._List.ListKeyValueIterator"] = __haxe_ds__List_ListKeyValueIterator
__haxe_ds__List_ListKeyValueIterator.__name__ = "haxe.ds._List.ListKeyValueIterator"
__haxe_ds__List_ListKeyValueIterator.prototype = _hx_e();
__haxe_ds__List_ListKeyValueIterator.prototype.idx= nil;
__haxe_ds__List_ListKeyValueIterator.prototype.head= nil;
__haxe_ds__List_ListKeyValueIterator.prototype.hasNext = function(self) 
  do return self.head ~= nil end
end
__haxe_ds__List_ListKeyValueIterator.prototype.next = function(self) 
  local val = self.head.item;
  self.head = self.head.next;
  do return _hx_o({__fields__={value=true,key=true},value=val,key=(function() 
  local _hx_obj = self;
  local _hx_fld = 'idx';
  local _ = _hx_obj[_hx_fld];
  _hx_obj[_hx_fld] = _hx_obj[_hx_fld]  + 1;
   return _;
   end)()}) end
end

__haxe_ds__List_ListKeyValueIterator.prototype.__class__ =  __haxe_ds__List_ListKeyValueIterator

__haxe_ds__Map_Map_Impl_.new = {}
_hxClasses["haxe.ds._Map.Map_Impl_"] = __haxe_ds__Map_Map_Impl_
__haxe_ds__Map_Map_Impl_.__name__ = "haxe.ds._Map.Map_Impl_"
__haxe_ds__Map_Map_Impl_.set = function(this1,key,value) 
  this1:set(key, value);
end
__haxe_ds__Map_Map_Impl_.get = function(this1,key) 
  do return this1:get(key) end;
end
__haxe_ds__Map_Map_Impl_.exists = function(this1,key) 
  do return this1:exists(key) end;
end
__haxe_ds__Map_Map_Impl_.remove = function(this1,key) 
  do return this1:remove(key) end;
end
__haxe_ds__Map_Map_Impl_.keys = function(this1) 
  do return this1:keys() end;
end
__haxe_ds__Map_Map_Impl_.iterator = function(this1) 
  do return this1:iterator() end;
end
__haxe_ds__Map_Map_Impl_.keyValueIterator = function(this1) 
  do return this1:keyValueIterator() end;
end
__haxe_ds__Map_Map_Impl_.copy = function(this1) 
  do return this1:copy() end;
end
__haxe_ds__Map_Map_Impl_.toString = function(this1) 
  do return this1:toString() end;
end
__haxe_ds__Map_Map_Impl_.clear = function(this1) 
  this1:clear();
end
__haxe_ds__Map_Map_Impl_.arrayWrite = function(this1,k,v) 
  this1:set(k, v);
  do return v end;
end
__haxe_ds__Map_Map_Impl_.toStringMap = function(t) 
  do return __haxe_ds_StringMap.new() end;
end
__haxe_ds__Map_Map_Impl_.toIntMap = function(t) 
  do return __haxe_ds_IntMap.new() end;
end
__haxe_ds__Map_Map_Impl_.toEnumValueMapMap = function(t) 
  do return __haxe_ds_EnumValueMap.new() end;
end
__haxe_ds__Map_Map_Impl_.toObjectMap = function(t) 
  do return __haxe_ds_ObjectMap.new() end;
end
__haxe_ds__Map_Map_Impl_.fromStringMap = function(map) 
  do return map end;
end
__haxe_ds__Map_Map_Impl_.fromIntMap = function(map) 
  do return map end;
end
__haxe_ds__Map_Map_Impl_.fromObjectMap = function(map) 
  do return map end;
end

__haxe_ds_ObjectMap.new = function() 
  local self = _hx_new(__haxe_ds_ObjectMap.prototype)
  __haxe_ds_ObjectMap.super(self)
  return self
end
__haxe_ds_ObjectMap.super = function(self) 
  self.h = ({});
  self.k = ({});
end
_hxClasses["haxe.ds.ObjectMap"] = __haxe_ds_ObjectMap
__haxe_ds_ObjectMap.__name__ = "haxe.ds.ObjectMap"
__haxe_ds_ObjectMap.__interfaces__ = {__haxe_IMap}
__haxe_ds_ObjectMap.assignId = function(obj) 
  obj.__id__ = (function() 
  local _hx_obj = __haxe_ds_ObjectMap;
  local _hx_fld = 'count';
  _hx_obj[_hx_fld] = _hx_obj[_hx_fld]  + 1;
   return _hx_obj[_hx_fld];
   end)() do return obj.__id__ end;
end
__haxe_ds_ObjectMap.getId = function(obj) 
  do return obj.__id__ end;
end
__haxe_ds_ObjectMap.prototype = _hx_e();
__haxe_ds_ObjectMap.prototype.h= nil;
__haxe_ds_ObjectMap.prototype.k= nil;
__haxe_ds_ObjectMap.prototype.set = function(self,key,value) 
  self.h[key] = value;
  self.k[key] = true;
end
__haxe_ds_ObjectMap.prototype.get = function(self,key) 
  do return self.h[key] end
end
__haxe_ds_ObjectMap.prototype.exists = function(self,key) 
  do return self.k[key] ~= nil end
end
__haxe_ds_ObjectMap.prototype.remove = function(self,key) 
  if (self.k[key] == nil) then 
    do return false end;
  end;
  self.k[key] = nil;
  self.h[key] = nil;
  do return true end
end
__haxe_ds_ObjectMap.prototype.keys = function(self) 
  local _gthis = self;
  local cur = next(self.h, nil);
  do return _hx_o({__fields__={next=true,hasNext=true},next=function(self) 
    local ret = cur;
    cur = next(_gthis.k, cur);
    do return ret end;
  end,hasNext=function(self) 
    do return cur ~= nil end;
  end}) end
end
__haxe_ds_ObjectMap.prototype.iterator = function(self) 
  local _gthis = self;
  local itr = self:keys();
  do return _hx_o({__fields__={hasNext=true,next=true},hasNext=function(_,...) return _hx_bind(itr,itr.hasNext)(...) end,next=function(self) 
    do return _gthis.h[itr:next()] end;
  end}) end
end
__haxe_ds_ObjectMap.prototype.keyValueIterator = function(self) 
  do return __haxe_iterators_MapKeyValueIterator.new(self) end
end
__haxe_ds_ObjectMap.prototype.copy = function(self) 
  local copied = __haxe_ds_ObjectMap.new();
  local key = self:keys();
  while (key:hasNext()) do 
    local key = key:next();
    copied.h[key] = self.h[key];
    copied.k[key] = true;
  end;
  do return copied end
end
__haxe_ds_ObjectMap.prototype.toString = function(self) 
  local s_b = ({});
  local s_length = 0;
  local str = "{";
  _G.table.insert(s_b, str);
  s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
  local it = self:keys();
  local i = it;
  while (i:hasNext()) do 
    local i = i:next();
    local str = Std.string(i);
    _G.table.insert(s_b, str);
    s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
    local str = " => ";
    _G.table.insert(s_b, str);
    s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
    local str = Std.string(self.h[i]);
    _G.table.insert(s_b, str);
    s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
    if (it:hasNext()) then 
      local str = ", ";
      _G.table.insert(s_b, str);
      s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
    end;
  end;
  local str = "}";
  _G.table.insert(s_b, str);
  s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
  do return _G.table.concat(s_b) end
end
__haxe_ds_ObjectMap.prototype.clear = function(self) 
  self.h = ({});
  self.k = ({});
end

__haxe_ds_ObjectMap.prototype.__class__ =  __haxe_ds_ObjectMap

__haxe_ds__ReadOnlyArray_ReadOnlyArray_Impl_.new = {}
_hxClasses["haxe.ds._ReadOnlyArray.ReadOnlyArray_Impl_"] = __haxe_ds__ReadOnlyArray_ReadOnlyArray_Impl_
__haxe_ds__ReadOnlyArray_ReadOnlyArray_Impl_.__name__ = "haxe.ds._ReadOnlyArray.ReadOnlyArray_Impl_"
__haxe_ds__ReadOnlyArray_ReadOnlyArray_Impl_.__properties__ = {get_length="get_length"}
__haxe_ds__ReadOnlyArray_ReadOnlyArray_Impl_.get_length = function(this1) 
  do return this1.length end;
end
__haxe_ds__ReadOnlyArray_ReadOnlyArray_Impl_.get = function(this1,i) 
  do return this1[i] end;
end
__haxe_ds__ReadOnlyArray_ReadOnlyArray_Impl_.concat = function(this1,a) 
  do return this1:concat(a) end;
end

__haxe_ds_StringMap.new = function() 
  local self = _hx_new(__haxe_ds_StringMap.prototype)
  __haxe_ds_StringMap.super(self)
  return self
end
__haxe_ds_StringMap.super = function(self) 
  self.h = ({});
end
_hxClasses["haxe.ds.StringMap"] = __haxe_ds_StringMap
__haxe_ds_StringMap.__name__ = "haxe.ds.StringMap"
__haxe_ds_StringMap.__interfaces__ = {__haxe_IMap}
__haxe_ds_StringMap.prototype = _hx_e();
__haxe_ds_StringMap.prototype.h= nil;
__haxe_ds_StringMap.prototype.set = function(self,key,value) 
  if (value == nil) then 
    self.h[key] = __haxe_ds_StringMap.tnull;
  else
    self.h[key] = value;
  end;
end
__haxe_ds_StringMap.prototype.get = function(self,key) 
  local ret = self.h[key];
  if (ret == __haxe_ds_StringMap.tnull) then 
    ret = nil;
  end;
  do return ret end
end
__haxe_ds_StringMap.prototype.exists = function(self,key) 
  do return self.h[key] ~= nil end
end
__haxe_ds_StringMap.prototype.remove = function(self,key) 
  if (self.h[key] == nil) then 
    do return false end;
  else
    self.h[key] = nil;
    do return true end;
  end;
end
__haxe_ds_StringMap.prototype.keys = function(self) 
  local _gthis = self;
  local next = _G.next;
  local cur = next(self.h, nil);
  do return _hx_o({__fields__={next=true,hasNext=true},next=function(self) 
    local ret = cur;
    cur = next(_gthis.h, cur);
    do return ret end;
  end,hasNext=function(self) 
    do return cur ~= nil end;
  end}) end
end
__haxe_ds_StringMap.prototype.iterator = function(self) 
  local _gthis = self;
  local it = self:keys();
  do return _hx_o({__fields__={hasNext=true,next=true},hasNext=function(self) 
    do return it:hasNext() end;
  end,next=function(self) 
    do return _gthis.h[it:next()] end;
  end}) end
end
__haxe_ds_StringMap.prototype.keyValueIterator = function(self) 
  do return __haxe_iterators_MapKeyValueIterator.new(self) end
end
__haxe_ds_StringMap.prototype.copy = function(self) 
  local copied = __haxe_ds_StringMap.new();
  local key = self:keys();
  while (key:hasNext()) do 
    local key = key:next();
    local ret = self.h[key];
    if (ret == __haxe_ds_StringMap.tnull) then 
      ret = nil;
    end;
    local value = ret;
    if (value == nil) then 
      copied.h[key] = __haxe_ds_StringMap.tnull;
    else
      copied.h[key] = value;
    end;
  end;
  do return copied end
end
__haxe_ds_StringMap.prototype.toString = function(self) 
  local s_b = ({});
  local s_length = 0;
  local str = "{";
  _G.table.insert(s_b, str);
  s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
  local it = self:keys();
  local i = it;
  while (i:hasNext()) do 
    local i = i:next();
    local str = Std.string(i);
    _G.table.insert(s_b, str);
    s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
    local str = " => ";
    _G.table.insert(s_b, str);
    s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
    local ret = self.h[i];
    if (ret == __haxe_ds_StringMap.tnull) then 
      ret = nil;
    end;
    local str = Std.string(ret);
    _G.table.insert(s_b, str);
    s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
    if (it:hasNext()) then 
      local str = ", ";
      _G.table.insert(s_b, str);
      s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
    end;
  end;
  local str = "}";
  _G.table.insert(s_b, str);
  s_length = s_length + __lua_lib_luautf8_Utf8.len(str);
  do return _G.table.concat(s_b) end
end
__haxe_ds_StringMap.prototype.clear = function(self) 
  self.h = ({});
end

__haxe_ds_StringMap.prototype.__class__ =  __haxe_ds_StringMap

__haxe_ds_WeakMap.new = function() 
  local self = _hx_new(__haxe_ds_WeakMap.prototype)
  __haxe_ds_WeakMap.super(self)
  return self
end
__haxe_ds_WeakMap.super = function(self) 
  _G.error(__haxe_exceptions_NotImplementedException.new("Not implemented for this platform", nil, _hx_o({__fields__={fileName=true,lineNumber=true,className=true,methodName=true},fileName="haxe/ds/WeakMap.hx",lineNumber=39,className="haxe.ds.WeakMap",methodName="new"})),0);
end
_hxClasses["haxe.ds.WeakMap"] = __haxe_ds_WeakMap
__haxe_ds_WeakMap.__name__ = "haxe.ds.WeakMap"
__haxe_ds_WeakMap.__interfaces__ = {__haxe_IMap}
__haxe_ds_WeakMap.prototype = _hx_e();
__haxe_ds_WeakMap.prototype.set = function(self,key,value) 
end
__haxe_ds_WeakMap.prototype.get = function(self,key) 
  do return nil end
end
__haxe_ds_WeakMap.prototype.exists = function(self,key) 
  do return false end
end
__haxe_ds_WeakMap.prototype.remove = function(self,key) 
  do return false end
end
__haxe_ds_WeakMap.prototype.keys = function(self) 
  do return nil end
end
__haxe_ds_WeakMap.prototype.iterator = function(self) 
  do return nil end
end
__haxe_ds_WeakMap.prototype.keyValueIterator = function(self) 
  do return nil end
end
__haxe_ds_WeakMap.prototype.copy = function(self) 
  do return nil end
end
__haxe_ds_WeakMap.prototype.toString = function(self) 
  do return nil end
end
__haxe_ds_WeakMap.prototype.clear = function(self) 
end

__haxe_ds_WeakMap.prototype.__class__ =  __haxe_ds_WeakMap

__haxe_exceptions_PosException.new = function(message,previous,pos) 
  local self = _hx_new(__haxe_exceptions_PosException.prototype)
  __haxe_exceptions_PosException.super(self,message,previous,pos)
  return self
end
__haxe_exceptions_PosException.super = function(self,message,previous,pos) 
  __haxe_Exception.super(self,message,previous);
  if (pos == nil) then 
    self.posInfos = _hx_o({__fields__={fileName=true,lineNumber=true,className=true,methodName=true},fileName="(unknown)",lineNumber=0,className="(unknown)",methodName="(unknown)"});
  else
    self.posInfos = pos;
  end;
  self.__skipStack = self.__skipStack + 1;
end
_hxClasses["haxe.exceptions.PosException"] = __haxe_exceptions_PosException
__haxe_exceptions_PosException.__name__ = "haxe.exceptions.PosException"
__haxe_exceptions_PosException.prototype = _hx_e();
__haxe_exceptions_PosException.prototype.posInfos= nil;
__haxe_exceptions_PosException.prototype.toString = function(self) 
  do return Std.string(Std.string(Std.string(Std.string(Std.string(Std.string(Std.string(Std.string(Std.string("") .. Std.string(__haxe_Exception.prototype.toString(self))) .. Std.string(" in ")) .. Std.string(self.posInfos.className)) .. Std.string(".")) .. Std.string(self.posInfos.methodName)) .. Std.string(" at ")) .. Std.string(self.posInfos.fileName)) .. Std.string(":")) .. Std.string(self.posInfos.lineNumber) end
end

__haxe_exceptions_PosException.prototype.__class__ =  __haxe_exceptions_PosException
__haxe_exceptions_PosException.__super__ = __haxe_Exception
setmetatable(__haxe_exceptions_PosException.prototype,{__index=__haxe_Exception.prototype})
setmetatable(__haxe_exceptions_PosException.prototype.__properties__,{__index=__haxe_Exception.prototype.__properties__})

__haxe_exceptions_NotImplementedException.new = function(message,previous,pos) 
  local self = _hx_new(__haxe_exceptions_NotImplementedException.prototype)
  __haxe_exceptions_NotImplementedException.super(self,message,previous,pos)
  return self
end
__haxe_exceptions_NotImplementedException.super = function(self,message,previous,pos) 
  if (message == nil) then 
    message = "Not implemented";
  end;
  __haxe_exceptions_PosException.super(self,message,previous,pos);
  self.__skipStack = self.__skipStack + 1;
end
_hxClasses["haxe.exceptions.NotImplementedException"] = __haxe_exceptions_NotImplementedException
__haxe_exceptions_NotImplementedException.__name__ = "haxe.exceptions.NotImplementedException"
__haxe_exceptions_NotImplementedException.prototype = _hx_e();

__haxe_exceptions_NotImplementedException.prototype.__class__ =  __haxe_exceptions_NotImplementedException
__haxe_exceptions_NotImplementedException.__super__ = __haxe_exceptions_PosException
setmetatable(__haxe_exceptions_NotImplementedException.prototype,{__index=__haxe_exceptions_PosException.prototype})
setmetatable(__haxe_exceptions_NotImplementedException.prototype.__properties__,{__index=__haxe_exceptions_PosException.prototype.__properties__})

__haxe_io_Bytes.new = function(length,b) 
  local self = _hx_new(__haxe_io_Bytes.prototype)
  __haxe_io_Bytes.super(self,length,b)
  return self
end
__haxe_io_Bytes.super = function(self,length,b) 
  self.length = length;
  self.b = b;
end
_hxClasses["haxe.io.Bytes"] = __haxe_io_Bytes
__haxe_io_Bytes.__name__ = "haxe.io.Bytes"
__haxe_io_Bytes.alloc = function(length) 
  local a = Array.new();
  local _g = 0;
  local _g1 = length;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    a:push(0);
  end;
  do return __haxe_io_Bytes.new(length, a) end;
end
__haxe_io_Bytes.ofString = function(s,encoding) 
  local _g = _hx_tab_array({}, 0);
  local _g1 = 0;
  local _g2 = _G.string.len(s);
  while (_g1 < _g2) do 
    _g1 = _g1 + 1;
    local i = _g1 - 1;
    _g:push(_G.string.byte(s, i + 1));
  end;
  local bytes = _g;
  do return __haxe_io_Bytes.new(bytes.length, bytes) end;
end
__haxe_io_Bytes.ofData = function(b) 
  do return __haxe_io_Bytes.new(b.length, b) end;
end
__haxe_io_Bytes.ofHex = function(s) 
  local len = __lua_lib_luautf8_Utf8.len(s);
  if ((_hx_bit.band(len,1)) ~= 0) then 
    _G.error(__haxe_Exception.thrown("Not a hex string (odd number of digits)"),0);
  end;
  local ret = __haxe_io_Bytes.alloc(_hx_bit.arshift(len,1));
  local _g = 0;
  local _g1 = ret.length;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    local high = __lua_lib_luautf8_Utf8.byte(s, (i * 2) + 1);
    local low = __lua_lib_luautf8_Utf8.byte(s, ((i * 2) + 1) + 1);
    high = (_hx_bit.band(high,15)) + ((_hx_bit.arshift((_hx_bit.band(high,64)),6)) * 9);
    low = (_hx_bit.band(low,15)) + ((_hx_bit.arshift((_hx_bit.band(low,64)),6)) * 9);
    ret.b[i] = _hx_bit.band(_hx_bit.band((_hx_bit.bor(_hx_bit.lshift(high,4),low)),255),255);
  end;
  do return ret end;
end
__haxe_io_Bytes.fastGet = function(b,pos) 
  do return b[pos] end;
end
__haxe_io_Bytes.prototype = _hx_e();
__haxe_io_Bytes.prototype.length= nil;
__haxe_io_Bytes.prototype.b= nil;
__haxe_io_Bytes.prototype.get = function(self,pos) 
  do return self.b[pos] end
end
__haxe_io_Bytes.prototype.set = function(self,pos,v) 
  self.b[pos] = _hx_bit.band(v,255);
end
__haxe_io_Bytes.prototype.blit = function(self,pos,src,srcpos,len) 
  if (((((pos < 0) or (srcpos < 0)) or (len < 0)) or ((pos + len) > self.length)) or ((srcpos + len) > src.length)) then 
    _G.error(__haxe_Exception.thrown(__haxe_io_Error.OutsideBounds),0);
  end;
  local b1 = self.b;
  local b2 = src.b;
  if ((b1 == b2) and (pos > srcpos)) then 
    local i = len;
    while (i > 0) do 
      i = i - 1;
      b1[i + pos] = b2[i + srcpos];
    end;
    do return end;
  end;
  local _g = 0;
  local _g1 = len;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    b1[i + pos] = b2[i + srcpos];
  end;
end
__haxe_io_Bytes.prototype.fill = function(self,pos,len,value) 
  local _g = 0;
  local _g1 = len;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    pos = pos + 1;
    self.b[pos - 1] = _hx_bit.band(value,255);
  end;
end
__haxe_io_Bytes.prototype.sub = function(self,pos,len) 
  if (((pos < 0) or (len < 0)) or ((pos + len) > self.length)) then 
    _G.error(__haxe_Exception.thrown(__haxe_io_Error.OutsideBounds),0);
  end;
  do return __haxe_io_Bytes.new(len, self.b:slice(pos, pos + len)) end
end
__haxe_io_Bytes.prototype.compare = function(self,other) 
  local b1 = self.b;
  local b2 = other.b;
  local len = (function() 
    local _hx_1
    if (self.length < other.length) then 
    _hx_1 = self.length; else 
    _hx_1 = other.length; end
    return _hx_1
  end )();
  local _g = 0;
  local _g1 = len;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    if (b1[i] ~= b2[i]) then 
      do return b1[i] - b2[i] end;
    end;
  end;
  do return self.length - other.length end
end
__haxe_io_Bytes.prototype.getDouble = function(self,pos) 
  local v = _hx_bit.bor(_hx_bit.bor(_hx_bit.bor(self.b[pos],_hx_bit.lshift(self.b[pos + 1],8)),_hx_bit.lshift(self.b[pos + 2],16)),_hx_bit.lshift(self.b[pos + 3],24));
  local tmp = _hx_bit_clamp((function() 
    local _hx_1
    if ((_hx_bit.band(v,-2147483648)) ~= 0) then 
    _hx_1 = _hx_bit.bor(v,-2147483648); else 
    _hx_1 = v; end
    return _hx_1
  end )());
  local pos = pos + 4;
  local v = _hx_bit.bor(_hx_bit.bor(_hx_bit.bor(self.b[pos],_hx_bit.lshift(self.b[pos + 1],8)),_hx_bit.lshift(self.b[pos + 2],16)),_hx_bit.lshift(self.b[pos + 3],24));
  do return __haxe_io_FPHelper.i64ToDouble(tmp, _hx_bit_clamp((function() 
    local _hx_2
    if ((_hx_bit.band(v,-2147483648)) ~= 0) then 
    _hx_2 = _hx_bit.bor(v,-2147483648); else 
    _hx_2 = v; end
    return _hx_2
  end )())) end
end
__haxe_io_Bytes.prototype.getFloat = function(self,pos) 
  local v = _hx_bit.bor(_hx_bit.bor(_hx_bit.bor(self.b[pos],_hx_bit.lshift(self.b[pos + 1],8)),_hx_bit.lshift(self.b[pos + 2],16)),_hx_bit.lshift(self.b[pos + 3],24));
  do return __haxe_io_FPHelper.i32ToFloat(_hx_bit_clamp((function() 
    local _hx_1
    if ((_hx_bit.band(v,-2147483648)) ~= 0) then 
    _hx_1 = _hx_bit.bor(v,-2147483648); else 
    _hx_1 = v; end
    return _hx_1
  end )())) end
end
__haxe_io_Bytes.prototype.setDouble = function(self,pos,v) 
  local i = __haxe_io_FPHelper.doubleToI64(v);
  local v = i.low;
  self.b[pos] = _hx_bit.band(v,255);
  self.b[pos + 1] = _hx_bit.band(_hx_bit.arshift(v,8),255);
  self.b[pos + 2] = _hx_bit.band(_hx_bit.arshift(v,16),255);
  self.b[pos + 3] = _hx_bit.band(_hx_bit.rshift(v,24),255);
  local pos = pos + 4;
  local v = i.high;
  self.b[pos] = _hx_bit.band(v,255);
  self.b[pos + 1] = _hx_bit.band(_hx_bit.arshift(v,8),255);
  self.b[pos + 2] = _hx_bit.band(_hx_bit.arshift(v,16),255);
  self.b[pos + 3] = _hx_bit.band(_hx_bit.rshift(v,24),255);
end
__haxe_io_Bytes.prototype.setFloat = function(self,pos,v) 
  local v = __haxe_io_FPHelper.floatToI32(v);
  self.b[pos] = _hx_bit.band(v,255);
  self.b[pos + 1] = _hx_bit.band(_hx_bit.arshift(v,8),255);
  self.b[pos + 2] = _hx_bit.band(_hx_bit.arshift(v,16),255);
  self.b[pos + 3] = _hx_bit.band(_hx_bit.rshift(v,24),255);
end
__haxe_io_Bytes.prototype.getUInt16 = function(self,pos) 
  do return _hx_bit.bor(self.b[pos],_hx_bit.lshift(self.b[pos + 1],8)) end
end
__haxe_io_Bytes.prototype.setUInt16 = function(self,pos,v) 
  self.b[pos] = _hx_bit.band(v,255);
  self.b[pos + 1] = _hx_bit.band(_hx_bit.arshift(v,8),255);
end
__haxe_io_Bytes.prototype.getInt32 = function(self,pos) 
  local v = _hx_bit.bor(_hx_bit.bor(_hx_bit.bor(self.b[pos],_hx_bit.lshift(self.b[pos + 1],8)),_hx_bit.lshift(self.b[pos + 2],16)),_hx_bit.lshift(self.b[pos + 3],24));
  do return _hx_bit_clamp((function() 
    local _hx_1
    if ((_hx_bit.band(v,-2147483648)) ~= 0) then 
    _hx_1 = _hx_bit.bor(v,-2147483648); else 
    _hx_1 = v; end
    return _hx_1
  end )()) end
end
__haxe_io_Bytes.prototype.getInt64 = function(self,pos) 
  local pos1 = pos + 4;
  local v = _hx_bit.bor(_hx_bit.bor(_hx_bit.bor(self.b[pos1],_hx_bit.lshift(self.b[pos1 + 1],8)),_hx_bit.lshift(self.b[pos1 + 2],16)),_hx_bit.lshift(self.b[pos1 + 3],24));
  local high = _hx_bit_clamp((function() 
    local _hx_1
    if ((_hx_bit.band(v,-2147483648)) ~= 0) then 
    _hx_1 = _hx_bit.bor(v,-2147483648); else 
    _hx_1 = v; end
    return _hx_1
  end )());
  local v = _hx_bit.bor(_hx_bit.bor(_hx_bit.bor(self.b[pos],_hx_bit.lshift(self.b[pos + 1],8)),_hx_bit.lshift(self.b[pos + 2],16)),_hx_bit.lshift(self.b[pos + 3],24));
  local this1 = __haxe__Int64____Int64.new(high, _hx_bit_clamp((function() 
    local _hx_2
    if ((_hx_bit.band(v,-2147483648)) ~= 0) then 
    _hx_2 = _hx_bit.bor(v,-2147483648); else 
    _hx_2 = v; end
    return _hx_2
  end )()));
  do return this1 end
end
__haxe_io_Bytes.prototype.setInt32 = function(self,pos,v) 
  self.b[pos] = _hx_bit.band(v,255);
  self.b[pos + 1] = _hx_bit.band(_hx_bit.arshift(v,8),255);
  self.b[pos + 2] = _hx_bit.band(_hx_bit.arshift(v,16),255);
  self.b[pos + 3] = _hx_bit.band(_hx_bit.rshift(v,24),255);
end
__haxe_io_Bytes.prototype.setInt64 = function(self,pos,v) 
  local v1 = v.low;
  self.b[pos] = _hx_bit.band(v1,255);
  self.b[pos + 1] = _hx_bit.band(_hx_bit.arshift(v1,8),255);
  self.b[pos + 2] = _hx_bit.band(_hx_bit.arshift(v1,16),255);
  self.b[pos + 3] = _hx_bit.band(_hx_bit.rshift(v1,24),255);
  local pos = pos + 4;
  local v = v.high;
  self.b[pos] = _hx_bit.band(v,255);
  self.b[pos + 1] = _hx_bit.band(_hx_bit.arshift(v,8),255);
  self.b[pos + 2] = _hx_bit.band(_hx_bit.arshift(v,16),255);
  self.b[pos + 3] = _hx_bit.band(_hx_bit.rshift(v,24),255);
end
__haxe_io_Bytes.prototype.getString = function(self,pos,len,encoding) 
  local tmp = encoding == nil;
  if (((pos < 0) or (len < 0)) or ((pos + len) > self.length)) then 
    _G.error(__haxe_Exception.thrown(__haxe_io_Error.OutsideBounds),0);
  end;
  if ((self.b.length - pos) <= __lua_Boot.MAXSTACKSIZE) then 
    local _end = Math.min(self.b.length, pos + len) - 1;
    do return _G.string.char(_hx_table.unpack(self.b, pos, _end)) end;
  else
    local tbl = ({});
    local _g = pos;
    local _g1 = pos + len;
    while (_g < _g1) do 
      _g = _g + 1;
      local idx = _g - 1;
      _G.table.insert(tbl, _G.string.char(self.b[idx]));
    end;
    do return _G.table.concat(tbl, "") end;
  end;
end
__haxe_io_Bytes.prototype.readString = function(self,pos,len) 
  do return self:getString(pos, len) end
end
__haxe_io_Bytes.prototype.toString = function(self) 
  do return self:getString(0, self.length) end
end
__haxe_io_Bytes.prototype.toHex = function(self) 
  local s_b = ({});
  local s_length = 0;
  local chars = _hx_tab_array({}, 0);
  local str = "0123456789abcdef";
  local _g = 0;
  local _g1 = __lua_lib_luautf8_Utf8.len(str);
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    chars:push(__lua_lib_luautf8_Utf8.byte(str, i + 1));
  end;
  local _g = 0;
  local _g1 = self.length;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    local c = self.b[i];
    _G.table.insert(s_b, __lua_lib_luautf8_Utf8.char(chars[_hx_bit.arshift(c,4)]));
    s_length = s_length + 1;
    _G.table.insert(s_b, __lua_lib_luautf8_Utf8.char(chars[_hx_bit.band(c,15)]));
    s_length = s_length + 1;
  end;
  do return _G.table.concat(s_b) end
end
__haxe_io_Bytes.prototype.getData = function(self) 
  do return self.b end
end

__haxe_io_Bytes.prototype.__class__ =  __haxe_io_Bytes

__haxe_io_BytesBuffer.new = function() 
  local self = _hx_new(__haxe_io_BytesBuffer.prototype)
  __haxe_io_BytesBuffer.super(self)
  return self
end
__haxe_io_BytesBuffer.super = function(self) 
  self.b = Array.new();
end
_hxClasses["haxe.io.BytesBuffer"] = __haxe_io_BytesBuffer
__haxe_io_BytesBuffer.__name__ = "haxe.io.BytesBuffer"
__haxe_io_BytesBuffer.prototype = _hx_e();
__haxe_io_BytesBuffer.prototype.b= nil;
__haxe_io_BytesBuffer.prototype.get_length = function(self) 
  do return self.b.length end
end
__haxe_io_BytesBuffer.prototype.addByte = function(self,byte) 
  self.b:push(byte);
end
__haxe_io_BytesBuffer.prototype.add = function(self,src) 
  local b1 = self.b;
  local b2 = src.b;
  local _g = 0;
  local _g1 = src.length;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    self.b:push(b2[i]);
  end;
end
__haxe_io_BytesBuffer.prototype.addString = function(self,v,encoding) 
  local src = __haxe_io_Bytes.ofString(v, encoding);
  local b1 = self.b;
  local b2 = src.b;
  local _g = 0;
  local _g1 = src.length;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    self.b:push(b2[i]);
  end;
end
__haxe_io_BytesBuffer.prototype.addInt32 = function(self,v) 
  self.b:push(_hx_bit.band(v,255));
  self.b:push(_hx_bit.band(_hx_bit.arshift(v,8),255));
  self.b:push(_hx_bit.band(_hx_bit.arshift(v,16),255));
  self.b:push(_hx_bit.rshift(v,24));
end
__haxe_io_BytesBuffer.prototype.addInt64 = function(self,v) 
  self:addInt32(v.low);
  self:addInt32(v.high);
end
__haxe_io_BytesBuffer.prototype.addFloat = function(self,v) 
  self:addInt32(__haxe_io_FPHelper.floatToI32(v));
end
__haxe_io_BytesBuffer.prototype.addDouble = function(self,v) 
  self:addInt64(__haxe_io_FPHelper.doubleToI64(v));
end
__haxe_io_BytesBuffer.prototype.addBytes = function(self,src,pos,len) 
  if (((pos < 0) or (len < 0)) or ((pos + len) > src.length)) then 
    _G.error(__haxe_Exception.thrown(__haxe_io_Error.OutsideBounds),0);
  end;
  local b1 = self.b;
  local b2 = src.b;
  local _g = pos;
  local _g1 = pos + len;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    self.b:push(b2[i]);
  end;
end
__haxe_io_BytesBuffer.prototype.getBytes = function(self) 
  local bytes = __haxe_io_Bytes.new(self.b.length, self.b);
  self.b = nil;
  do return bytes end
end

__haxe_io_BytesBuffer.prototype.__class__ =  __haxe_io_BytesBuffer

__haxe_io_BytesBuffer.prototype.__properties__ =  {get_length="get_length"}
_hxClasses["haxe.io.Encoding"] = __haxe_io_Encoding;
_hxClasses["haxe.io.Encoding"] = { __ename__ = "haxe.io.Encoding", __constructs__ = _hx_tab_array({[0]="UTF8","RawNative"},2)}
__haxe_io_Encoding = _hxClasses["haxe.io.Encoding"];
__haxe_io_Encoding.UTF8 = _hx_tab_array({[0]="UTF8",0,__enum__ = __haxe_io_Encoding},2)

__haxe_io_Encoding.RawNative = _hx_tab_array({[0]="RawNative",1,__enum__ = __haxe_io_Encoding},2)

__haxe_io_Encoding.__empty_constructs__ = _hx_tab_array({[0] = __haxe_io_Encoding.UTF8,__haxe_io_Encoding.RawNative}, 2)

__haxe_io_Eof.new = function() 
  local self = _hx_new(__haxe_io_Eof.prototype)
  __haxe_io_Eof.super(self)
  return self
end
__haxe_io_Eof.super = function(self) 
end
_hxClasses["haxe.io.Eof"] = __haxe_io_Eof
__haxe_io_Eof.__name__ = "haxe.io.Eof"
__haxe_io_Eof.prototype = _hx_e();
__haxe_io_Eof.prototype.toString = function(self) 
  do return "Eof" end
end

__haxe_io_Eof.prototype.__class__ =  __haxe_io_Eof
_hxClasses["haxe.io.Error"] = __haxe_io_Error;
_hxClasses["haxe.io.Error"] = { __ename__ = "haxe.io.Error", __constructs__ = _hx_tab_array({[0]="Blocked","Overflow","OutsideBounds","Custom"},4)}
__haxe_io_Error = _hxClasses["haxe.io.Error"];
__haxe_io_Error.Blocked = _hx_tab_array({[0]="Blocked",0,__enum__ = __haxe_io_Error},2)

__haxe_io_Error.Overflow = _hx_tab_array({[0]="Overflow",1,__enum__ = __haxe_io_Error},2)

__haxe_io_Error.OutsideBounds = _hx_tab_array({[0]="OutsideBounds",2,__enum__ = __haxe_io_Error},2)

__haxe_io_Error.Custom = function(e) local _x = _hx_tab_array({[0]="Custom",3,e,__enum__=__haxe_io_Error}, 3); return _x; end 
__haxe_io_Error.__empty_constructs__ = _hx_tab_array({[0] = __haxe_io_Error.Blocked,__haxe_io_Error.Overflow,__haxe_io_Error.OutsideBounds}, 3)

__haxe_io_FPHelper.new = {}
_hxClasses["haxe.io.FPHelper"] = __haxe_io_FPHelper
__haxe_io_FPHelper.__name__ = "haxe.io.FPHelper"
__haxe_io_FPHelper._i32ToFloat = function(i) 
  local sign = 1 - (_hx_bit.lshift(_hx_bit.rshift(i,31),1));
  local e = _hx_bit.band(_hx_bit.arshift(i,23),255);
  if (e == 255) then 
    if ((_hx_bit.band(i,8388607)) == 0) then 
      if (sign > 0) then 
        do return _G.math.huge end;
      else
        do return -_G.math.huge end;
      end;
    else
      do return (0/0) end;
    end;
  end;
  local m = (function() 
    local _hx_1
    if (e == 0) then 
    _hx_1 = _hx_bit.lshift((_hx_bit.band(i,8388607)),1); else 
    _hx_1 = _hx_bit.bor(_hx_bit.band(i,8388607),8388608); end
    return _hx_1
  end )();
  do return (sign * m) * _G.math.pow(2, e - 150) end;
end
__haxe_io_FPHelper._i64ToDouble = function(lo,hi) 
  local sign = 1 - (_hx_bit.lshift(_hx_bit.rshift(hi,31),1));
  local e = _hx_bit.band(_hx_bit.arshift(hi,20),2047);
  if (e == 2047) then 
    if ((lo == 0) and ((_hx_bit.band(hi,1048575)) == 0)) then 
      if (sign > 0) then 
        do return _G.math.huge end;
      else
        do return -_G.math.huge end;
      end;
    else
      do return (0/0) end;
    end;
  end;
  local m = 2.220446049250313e-16 * ((((_hx_bit.band(hi,1048575)) * 4294967296.) + ((_hx_bit.rshift(lo,31)) * 2147483648.)) + (_hx_bit.band(lo,2147483647)));
  m = (function() 
    local _hx_1
    if (e == 0) then 
    _hx_1 = m * 2.0; else 
    _hx_1 = m + 1.0; end
    return _hx_1
  end )();
  do return (sign * m) * _G.math.pow(2, e - 1023) end;
end
__haxe_io_FPHelper._floatToI32 = function(f) 
  if (f == 0) then 
    do return 0 end;
  end;
  local af = (function() 
    local _hx_1
    if (f < 0) then 
    _hx_1 = -f; else 
    _hx_1 = f; end
    return _hx_1
  end )();
  local exp = _G.math.floor(_G.math.log(af) / 0.6931471805599453);
  if (exp > 127) then 
    do return 2139095040 end;
  else
    if (exp <= -127) then 
      exp = -127;
      af = af * 7.1362384635298e+44;
    else
      af = ((af / _G.math.pow(2, exp)) - 1.0) * 8388608;
    end;
    do return _hx_bit.bor(_hx_bit.bor(((function() 
      local _hx_2
      if (f < 0) then 
      _hx_2 = -2147483648; else 
      _hx_2 = 0; end
      return _hx_2
    end )()),_hx_bit.lshift(exp + 127,23)),_G.math.floor(af + 0.5)) end;
  end;
end
__haxe_io_FPHelper._doubleToI64 = function(v) 
  local i64 = __haxe_io_FPHelper.i64tmp;
  if (v == 0) then 
    i64.low = 0;
    i64.high = 0;
  else
    if (not Math.isFinite(v)) then 
      i64.low = 0;
      i64.high = (function() 
        local _hx_1
        if (v > 0) then 
        _hx_1 = 2146435072; else 
        _hx_1 = -1048576; end
        return _hx_1
      end )();
    else
      local av = (function() 
        local _hx_2
        if (v < 0) then 
        _hx_2 = -v; else 
        _hx_2 = v; end
        return _hx_2
      end )();
      local exp = _G.math.floor(_G.math.log(av) / 0.6931471805599453);
      if (exp > 1023) then 
        i64.low = -1;
        i64.high = 2146435071;
      else
        if (exp <= -1023) then 
          exp = -1023;
          av = av / 2.2250738585072014e-308;
        else
          av = (av / _G.math.pow(2, exp)) - 1.0;
        end;
        local sig = _G.math.floor((av * 4503599627370496.) + 0.5);
        local sig_l = Std.int(sig);
        local sig_h = Std.int(sig / 4294967296.0);
        i64.low = sig_l;
        i64.high = _hx_bit.bor(_hx_bit.bor(((function() 
          local _hx_3
          if (v < 0) then 
          _hx_3 = -2147483648; else 
          _hx_3 = 0; end
          return _hx_3
        end )()),_hx_bit.lshift(exp + 1023,20)),sig_h);
      end;
    end;
  end;
  do return i64 end;
end
__haxe_io_FPHelper.i32ToFloat = function(i) 
  local sign = 1 - (_hx_bit.lshift(_hx_bit.rshift(i,31),1));
  local e = _hx_bit.band(_hx_bit.arshift(i,23),255);
  if (e == 255) then 
    if ((_hx_bit.band(i,8388607)) == 0) then 
      if (sign > 0) then 
        do return _G.math.huge end;
      else
        do return -_G.math.huge end;
      end;
    else
      do return (0/0) end;
    end;
  else
    local m = (function() 
      local _hx_1
      if (e == 0) then 
      _hx_1 = _hx_bit.lshift((_hx_bit.band(i,8388607)),1); else 
      _hx_1 = _hx_bit.bor(_hx_bit.band(i,8388607),8388608); end
      return _hx_1
    end )();
    do return (sign * m) * _G.math.pow(2, e - 150) end;
  end;
end
__haxe_io_FPHelper.floatToI32 = function(f) 
  if (f == 0) then 
    do return 0 end;
  else
    local af = (function() 
      local _hx_1
      if (f < 0) then 
      _hx_1 = -f; else 
      _hx_1 = f; end
      return _hx_1
    end )();
    local exp = _G.math.floor(_G.math.log(af) / 0.6931471805599453);
    if (exp > 127) then 
      do return 2139095040 end;
    else
      if (exp <= -127) then 
        exp = -127;
        af = af * 7.1362384635298e+44;
      else
        af = ((af / _G.math.pow(2, exp)) - 1.0) * 8388608;
      end;
      do return _hx_bit.bor(_hx_bit.bor(((function() 
        local _hx_2
        if (f < 0) then 
        _hx_2 = -2147483648; else 
        _hx_2 = 0; end
        return _hx_2
      end )()),_hx_bit.lshift(exp + 127,23)),_G.math.floor(af + 0.5)) end;
    end;
  end;
end
__haxe_io_FPHelper.i64ToDouble = function(low,high) 
  local sign = 1 - (_hx_bit.lshift(_hx_bit.rshift(high,31),1));
  local e = _hx_bit.band(_hx_bit.arshift(high,20),2047);
  if (e == 2047) then 
    if ((low == 0) and ((_hx_bit.band(high,1048575)) == 0)) then 
      if (sign > 0) then 
        do return _G.math.huge end;
      else
        do return -_G.math.huge end;
      end;
    else
      do return (0/0) end;
    end;
  else
    local m = 2.220446049250313e-16 * ((((_hx_bit.band(high,1048575)) * 4294967296.) + ((_hx_bit.rshift(low,31)) * 2147483648.)) + (_hx_bit.band(low,2147483647)));
    m = (function() 
      local _hx_1
      if (e == 0) then 
      _hx_1 = m * 2.0; else 
      _hx_1 = m + 1.0; end
      return _hx_1
    end )();
    do return (sign * m) * _G.math.pow(2, e - 1023) end;
  end;
end
__haxe_io_FPHelper.doubleToI64 = function(v) 
  local i64 = __haxe_io_FPHelper.i64tmp;
  if (v == 0) then 
    i64.low = 0;
    i64.high = 0;
  else
    if (not Math.isFinite(v)) then 
      i64.low = 0;
      i64.high = (function() 
        local _hx_1
        if (v > 0) then 
        _hx_1 = 2146435072; else 
        _hx_1 = -1048576; end
        return _hx_1
      end )();
    else
      local av = (function() 
        local _hx_2
        if (v < 0) then 
        _hx_2 = -v; else 
        _hx_2 = v; end
        return _hx_2
      end )();
      local exp = _G.math.floor(_G.math.log(av) / 0.6931471805599453);
      if (exp > 1023) then 
        i64.low = -1;
        i64.high = 2146435071;
      else
        if (exp <= -1023) then 
          exp = -1023;
          av = av / 2.2250738585072014e-308;
        else
          av = (av / _G.math.pow(2, exp)) - 1.0;
        end;
        local sig = _G.math.floor((av * 4503599627370496.) + 0.5);
        local sig_l = Std.int(sig);
        local sig_h = Std.int(sig / 4294967296.0);
        i64.low = sig_l;
        i64.high = _hx_bit.bor(_hx_bit.bor(((function() 
          local _hx_3
          if (v < 0) then 
          _hx_3 = -2147483648; else 
          _hx_3 = 0; end
          return _hx_3
        end )()),_hx_bit.lshift(exp + 1023,20)),sig_h);
      end;
    end;
  end;
  do return i64 end;
end

__haxe_io_Input.new = {}
_hxClasses["haxe.io.Input"] = __haxe_io_Input
__haxe_io_Input.__name__ = "haxe.io.Input"
__haxe_io_Input.prototype = _hx_e();
__haxe_io_Input.prototype.bigEndian= nil;
__haxe_io_Input.prototype.readByte = function(self) 
  _G.error(__haxe_exceptions_NotImplementedException.new(nil, nil, _hx_o({__fields__={fileName=true,lineNumber=true,className=true,methodName=true},fileName="haxe/io/Input.hx",lineNumber=53,className="haxe.io.Input",methodName="readByte"})),0);
end
__haxe_io_Input.prototype.readBytes = function(self,s,pos,len) 
  local k = len;
  local b = s.b;
  if (((pos < 0) or (len < 0)) or ((pos + len) > s.length)) then 
    _G.error(__haxe_Exception.thrown(__haxe_io_Error.OutsideBounds),0);
  end;
  local _hx_status, _hx_result = pcall(function() 
  
      while (k > 0) do 
        b[pos] = self:readByte();
        pos = pos + 1;
        k = k - 1;
      end;
    return _hx_pcall_default
  end)
  if not _hx_status and _hx_result == "_hx_pcall_break" then
  elseif not _hx_status then 
    local _g = _hx_result;
    if (not __lua_Boot.__instanceof(__haxe_Exception.caught(_g):unwrap(), __haxe_io_Eof)) then 
      _G.error(_g,0);
    end;
  elseif _hx_result ~= _hx_pcall_default then
    return _hx_result
  end;
  do return len - k end
end
__haxe_io_Input.prototype.close = function(self) 
end
__haxe_io_Input.prototype.set_bigEndian = function(self,b) 
  self.bigEndian = b;
  do return b end
end
__haxe_io_Input.prototype.readAll = function(self,bufsize) 
  if (bufsize == nil) then 
    bufsize = 16384;
  end;
  local buf = __haxe_io_Bytes.alloc(bufsize);
  local total = __haxe_io_BytesBuffer.new();
  local _hx_status, _hx_result = pcall(function() 
  
      while (true) do 
        local len = self:readBytes(buf, 0, bufsize);
        if (len == 0) then 
          _G.error(__haxe_Exception.thrown(__haxe_io_Error.Blocked),0);
        end;
        if ((len < 0) or (len > buf.length)) then 
          _G.error(__haxe_Exception.thrown(__haxe_io_Error.OutsideBounds),0);
        end;
        local b1 = total.b;
        local b2 = buf.b;
        local _g = 0;
        local _g1 = len;
        while (_g < _g1) do 
          _g = _g + 1;
          local i = _g - 1;
          total.b:push(b2[i]);
        end;
      end;
    return _hx_pcall_default
  end)
  if not _hx_status and _hx_result == "_hx_pcall_break" then
  elseif not _hx_status then 
    local _g = _hx_result;
    if (not __lua_Boot.__instanceof(__haxe_Exception.caught(_g):unwrap(), __haxe_io_Eof)) then 
      _G.error(_g,0);
    end;
  elseif _hx_result ~= _hx_pcall_default then
    return _hx_result
  end;
  do return total:getBytes() end
end
__haxe_io_Input.prototype.readFullBytes = function(self,s,pos,len) 
  while (len > 0) do 
    local k = self:readBytes(s, pos, len);
    if (k == 0) then 
      _G.error(__haxe_Exception.thrown(__haxe_io_Error.Blocked),0);
    end;
    pos = pos + k;
    len = len - k;
  end;
end
__haxe_io_Input.prototype.read = function(self,nbytes) 
  local s = __haxe_io_Bytes.alloc(nbytes);
  local p = 0;
  while (nbytes > 0) do 
    local k = self:readBytes(s, p, nbytes);
    if (k == 0) then 
      _G.error(__haxe_Exception.thrown(__haxe_io_Error.Blocked),0);
    end;
    p = p + k;
    nbytes = nbytes - k;
  end;
  do return s end
end
__haxe_io_Input.prototype.readUntil = function(self,_end) 
  local buf = __haxe_io_BytesBuffer.new();
  local last;
  while (true) do 
    last = self:readByte();
    if (not (last ~= _end)) then 
      break;
    end;
    buf.b:push(last);
  end;
  do return buf:getBytes():toString() end
end
__haxe_io_Input.prototype.readLine = function(self) 
  local buf = __haxe_io_BytesBuffer.new();
  local last;
  local s;
  local _hx_status, _hx_result = pcall(function() 
  
      while (true) do 
        last = self:readByte();
        if (not (last ~= 10)) then 
          break;
        end;
        buf.b:push(last);
      end;
      s = buf:getBytes():toString();
      if (__lua_lib_luautf8_Utf8.byte(s, (__lua_lib_luautf8_Utf8.len(s) - 1) + 1) == 13) then 
        local pos = 0;
        local len = -1;
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
        s = __lua_lib_luautf8_Utf8.sub(s, pos + 1, pos + len);
      end;
    return _hx_pcall_default
  end)
  if not _hx_status and _hx_result == "_hx_pcall_break" then
  elseif not _hx_status then 
    local _g = _hx_result;
    local _g1 = __haxe_Exception.caught(_g):unwrap();
    if (__lua_Boot.__instanceof(_g1, __haxe_io_Eof)) then 
      local e = _g1;
      s = buf:getBytes():toString();
      if (__lua_lib_luautf8_Utf8.len(s) == 0) then 
        _G.error(__haxe_Exception.thrown(e),0);
      end;
    else
      _G.error(_g,0);
    end;
  elseif _hx_result ~= _hx_pcall_default then
    return _hx_result
  end;
  do return s end
end
__haxe_io_Input.prototype.readFloat = function(self) 
  do return __haxe_io_FPHelper.i32ToFloat(self:readInt32()) end
end
__haxe_io_Input.prototype.readDouble = function(self) 
  local i1 = self:readInt32();
  local i2 = self:readInt32();
  if (self.bigEndian) then 
    do return __haxe_io_FPHelper.i64ToDouble(i2, i1) end;
  else
    do return __haxe_io_FPHelper.i64ToDouble(i1, i2) end;
  end;
end
__haxe_io_Input.prototype.readInt8 = function(self) 
  local n = self:readByte();
  if (n >= 128) then 
    do return n - 256 end;
  end;
  do return n end
end
__haxe_io_Input.prototype.readInt16 = function(self) 
  local ch1 = self:readByte();
  local ch2 = self:readByte();
  local n = (function() 
    local _hx_1
    if (self.bigEndian) then 
    _hx_1 = _hx_bit.bor(ch2,_hx_bit.lshift(ch1,8)); else 
    _hx_1 = _hx_bit.bor(ch1,_hx_bit.lshift(ch2,8)); end
    return _hx_1
  end )();
  if ((_hx_bit.band(n,32768)) ~= 0) then 
    do return n - 65536 end;
  end;
  do return n end
end
__haxe_io_Input.prototype.readUInt16 = function(self) 
  local ch1 = self:readByte();
  local ch2 = self:readByte();
  if (self.bigEndian) then 
    do return _hx_bit.bor(ch2,_hx_bit.lshift(ch1,8)) end;
  else
    do return _hx_bit.bor(ch1,_hx_bit.lshift(ch2,8)) end;
  end;
end
__haxe_io_Input.prototype.readInt24 = function(self) 
  local ch1 = self:readByte();
  local ch2 = self:readByte();
  local ch3 = self:readByte();
  local n = (function() 
    local _hx_1
    if (self.bigEndian) then 
    _hx_1 = _hx_bit.bor(_hx_bit.bor(ch3,_hx_bit.lshift(ch2,8)),_hx_bit.lshift(ch1,16)); else 
    _hx_1 = _hx_bit.bor(_hx_bit.bor(ch1,_hx_bit.lshift(ch2,8)),_hx_bit.lshift(ch3,16)); end
    return _hx_1
  end )();
  if ((_hx_bit.band(n,8388608)) ~= 0) then 
    do return n - 16777216 end;
  end;
  do return n end
end
__haxe_io_Input.prototype.readUInt24 = function(self) 
  local ch1 = self:readByte();
  local ch2 = self:readByte();
  local ch3 = self:readByte();
  if (self.bigEndian) then 
    do return _hx_bit.bor(_hx_bit.bor(ch3,_hx_bit.lshift(ch2,8)),_hx_bit.lshift(ch1,16)) end;
  else
    do return _hx_bit.bor(_hx_bit.bor(ch1,_hx_bit.lshift(ch2,8)),_hx_bit.lshift(ch3,16)) end;
  end;
end
__haxe_io_Input.prototype.readInt32 = function(self) 
  local ch1 = self:readByte();
  local ch2 = self:readByte();
  local ch3 = self:readByte();
  local ch4 = self:readByte();
  local n = (function() 
    local _hx_1
    if (self.bigEndian) then 
    _hx_1 = _hx_bit.bor(_hx_bit.bor(_hx_bit.bor(ch4,_hx_bit.lshift(ch3,8)),_hx_bit.lshift(ch2,16)),_hx_bit.lshift(ch1,24)); else 
    _hx_1 = _hx_bit.bor(_hx_bit.bor(_hx_bit.bor(ch1,_hx_bit.lshift(ch2,8)),_hx_bit.lshift(ch3,16)),_hx_bit.lshift(ch4,24)); end
    return _hx_1
  end )();
  do return _hx_bit_clamp(n) end
end
__haxe_io_Input.prototype.readString = function(self,len,encoding) 
  local b = __haxe_io_Bytes.alloc(len);
  self:readFullBytes(b, 0, len);
  do return b:getString(0, len, encoding) end
end

__haxe_io_Input.prototype.__class__ =  __haxe_io_Input

__haxe_io_Input.prototype.__properties__ =  {set_bigEndian="set_bigEndian"}

__haxe_io_Output.new = {}
_hxClasses["haxe.io.Output"] = __haxe_io_Output
__haxe_io_Output.__name__ = "haxe.io.Output"
__haxe_io_Output.prototype = _hx_e();
__haxe_io_Output.prototype.bigEndian= nil;
__haxe_io_Output.prototype.writeByte = function(self,c) 
  _G.error(__haxe_exceptions_NotImplementedException.new(nil, nil, _hx_o({__fields__={fileName=true,lineNumber=true,className=true,methodName=true},fileName="haxe/io/Output.hx",lineNumber=47,className="haxe.io.Output",methodName="writeByte"})),0);
end
__haxe_io_Output.prototype.writeBytes = function(self,s,pos,len) 
  if (((pos < 0) or (len < 0)) or ((pos + len) > s.length)) then 
    _G.error(__haxe_Exception.thrown(__haxe_io_Error.OutsideBounds),0);
  end;
  local b = s.b;
  local k = len;
  while (k > 0) do 
    self:writeByte(b[pos]);
    pos = pos + 1;
    k = k - 1;
  end;
  do return len end
end
__haxe_io_Output.prototype.flush = function(self) 
end
__haxe_io_Output.prototype.close = function(self) 
end
__haxe_io_Output.prototype.set_bigEndian = function(self,b) 
  self.bigEndian = b;
  do return b end
end
__haxe_io_Output.prototype.write = function(self,s) 
  local l = s.length;
  local p = 0;
  while (l > 0) do 
    local k = self:writeBytes(s, p, l);
    if (k == 0) then 
      _G.error(__haxe_Exception.thrown(__haxe_io_Error.Blocked),0);
    end;
    p = p + k;
    l = l - k;
  end;
end
__haxe_io_Output.prototype.writeFullBytes = function(self,s,pos,len) 
  while (len > 0) do 
    local k = self:writeBytes(s, pos, len);
    pos = pos + k;
    len = len - k;
  end;
end
__haxe_io_Output.prototype.writeFloat = function(self,x) 
  self:writeInt32(__haxe_io_FPHelper.floatToI32(x));
end
__haxe_io_Output.prototype.writeDouble = function(self,x) 
  local i64 = __haxe_io_FPHelper.doubleToI64(x);
  if (self.bigEndian) then 
    self:writeInt32(i64.high);
    self:writeInt32(i64.low);
  else
    self:writeInt32(i64.low);
    self:writeInt32(i64.high);
  end;
end
__haxe_io_Output.prototype.writeInt8 = function(self,x) 
  if ((x < -128) or (x >= 128)) then 
    _G.error(__haxe_Exception.thrown(__haxe_io_Error.Overflow),0);
  end;
  self:writeByte(_hx_bit.band(x,255));
end
__haxe_io_Output.prototype.writeInt16 = function(self,x) 
  if ((x < -32768) or (x >= 32768)) then 
    _G.error(__haxe_Exception.thrown(__haxe_io_Error.Overflow),0);
  end;
  self:writeUInt16(_hx_bit.band(x,65535));
end
__haxe_io_Output.prototype.writeUInt16 = function(self,x) 
  if ((x < 0) or (x >= 65536)) then 
    _G.error(__haxe_Exception.thrown(__haxe_io_Error.Overflow),0);
  end;
  if (self.bigEndian) then 
    self:writeByte(_hx_bit.arshift(x,8));
    self:writeByte(_hx_bit.band(x,255));
  else
    self:writeByte(_hx_bit.band(x,255));
    self:writeByte(_hx_bit.arshift(x,8));
  end;
end
__haxe_io_Output.prototype.writeInt24 = function(self,x) 
  if ((x < -8388608) or (x >= 8388608)) then 
    _G.error(__haxe_Exception.thrown(__haxe_io_Error.Overflow),0);
  end;
  self:writeUInt24(_hx_bit.band(x,16777215));
end
__haxe_io_Output.prototype.writeUInt24 = function(self,x) 
  if ((x < 0) or (x >= 16777216)) then 
    _G.error(__haxe_Exception.thrown(__haxe_io_Error.Overflow),0);
  end;
  if (self.bigEndian) then 
    self:writeByte(_hx_bit.arshift(x,16));
    self:writeByte(_hx_bit.band(_hx_bit.arshift(x,8),255));
    self:writeByte(_hx_bit.band(x,255));
  else
    self:writeByte(_hx_bit.band(x,255));
    self:writeByte(_hx_bit.band(_hx_bit.arshift(x,8),255));
    self:writeByte(_hx_bit.arshift(x,16));
  end;
end
__haxe_io_Output.prototype.writeInt32 = function(self,x) 
  if (self.bigEndian) then 
    self:writeByte(_hx_bit.rshift(x,24));
    self:writeByte(_hx_bit.band(_hx_bit.arshift(x,16),255));
    self:writeByte(_hx_bit.band(_hx_bit.arshift(x,8),255));
    self:writeByte(_hx_bit.band(x,255));
  else
    self:writeByte(_hx_bit.band(x,255));
    self:writeByte(_hx_bit.band(_hx_bit.arshift(x,8),255));
    self:writeByte(_hx_bit.band(_hx_bit.arshift(x,16),255));
    self:writeByte(_hx_bit.rshift(x,24));
  end;
end
__haxe_io_Output.prototype.prepare = function(self,nbytes) 
end
__haxe_io_Output.prototype.writeInput = function(self,i,bufsize) 
  if (bufsize == nil) then 
    bufsize = 4096;
  end;
  local buf = __haxe_io_Bytes.alloc(bufsize);
  local _hx_status, _hx_result = pcall(function() 
  
      while (true) do 
        local len = i:readBytes(buf, 0, bufsize);
        if (len == 0) then 
          _G.error(__haxe_Exception.thrown(__haxe_io_Error.Blocked),0);
        end;
        local p = 0;
        while (len > 0) do 
          local k = self:writeBytes(buf, p, len);
          if (k == 0) then 
            _G.error(__haxe_Exception.thrown(__haxe_io_Error.Blocked),0);
          end;
          p = p + k;
          len = len - k;
        end;
      end;
    return _hx_pcall_default
  end)
  if not _hx_status and _hx_result == "_hx_pcall_break" then
  elseif not _hx_status then 
    local _g = _hx_result;
    if (not __lua_Boot.__instanceof(__haxe_Exception.caught(_g):unwrap(), __haxe_io_Eof)) then 
      _G.error(_g,0);
    end;
  elseif _hx_result ~= _hx_pcall_default then
    return _hx_result
  end;
end
__haxe_io_Output.prototype.writeString = function(self,s,encoding) 
  local b = __haxe_io_Bytes.ofString(s, encoding);
  self:writeFullBytes(b, 0, b.length);
end

__haxe_io_Output.prototype.__class__ =  __haxe_io_Output

__haxe_io_Output.prototype.__properties__ =  {set_bigEndian="set_bigEndian"}

__haxe_io_Path.new = function(path) 
  local self = _hx_new(__haxe_io_Path.prototype)
  __haxe_io_Path.super(self,path)
  return self
end
__haxe_io_Path.super = function(self,path) 
  local path1 = path;
  if (path1) == "." or (path1) == ".." then 
    self.dir = path;
    self.file = "";
    do return end; end;
  local startIndex = nil;
  local ret = -1;
  if (startIndex == nil) then 
    startIndex = __lua_lib_luautf8_Utf8.len(path);
  end;
  while (true) do 
    local startIndex1 = ret + 1;
    if (startIndex1 == nil) then 
      startIndex1 = 1;
    else
      startIndex1 = startIndex1 + 1;
    end;
    local r = __lua_lib_luautf8_Utf8.find(path, "/", startIndex1, true);
    local p = (function() 
      local _hx_1
      if ((r ~= nil) and (r > 0)) then 
      _hx_1 = r - 1; else 
      _hx_1 = -1; end
      return _hx_1
    end )();
    if (((p == -1) or (p > startIndex)) or (p == ret)) then 
      break;
    end;
    ret = p;
  end;
  local c1 = ret;
  local startIndex = nil;
  local ret = -1;
  if (startIndex == nil) then 
    startIndex = __lua_lib_luautf8_Utf8.len(path);
  end;
  while (true) do 
    local startIndex1 = ret + 1;
    if (startIndex1 == nil) then 
      startIndex1 = 1;
    else
      startIndex1 = startIndex1 + 1;
    end;
    local r = __lua_lib_luautf8_Utf8.find(path, "\\", startIndex1, true);
    local p = (function() 
      local _hx_2
      if ((r ~= nil) and (r > 0)) then 
      _hx_2 = r - 1; else 
      _hx_2 = -1; end
      return _hx_2
    end )();
    if (((p == -1) or (p > startIndex)) or (p == ret)) then 
      break;
    end;
    ret = p;
  end;
  local c2 = ret;
  if (c1 < c2) then 
    local pos = 0;
    local len = c2;
    if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(path)))) then 
      len = __lua_lib_luautf8_Utf8.len(path);
    else
      if (len < 0) then 
        len = __lua_lib_luautf8_Utf8.len(path) + len;
      end;
    end;
    if (pos < 0) then 
      pos = __lua_lib_luautf8_Utf8.len(path) + pos;
    end;
    if (pos < 0) then 
      pos = 0;
    end;
    self.dir = __lua_lib_luautf8_Utf8.sub(path, pos + 1, pos + len);
    local pos = c2 + 1;
    local len = nil;
    if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(path)))) then 
      len = __lua_lib_luautf8_Utf8.len(path);
    else
      if (len < 0) then 
        len = __lua_lib_luautf8_Utf8.len(path) + len;
      end;
    end;
    if (pos < 0) then 
      pos = __lua_lib_luautf8_Utf8.len(path) + pos;
    end;
    if (pos < 0) then 
      pos = 0;
    end;
    path = __lua_lib_luautf8_Utf8.sub(path, pos + 1, pos + len);
    self.backslash = true;
  else
    if (c2 < c1) then 
      local pos = 0;
      local len = c1;
      if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(path)))) then 
        len = __lua_lib_luautf8_Utf8.len(path);
      else
        if (len < 0) then 
          len = __lua_lib_luautf8_Utf8.len(path) + len;
        end;
      end;
      if (pos < 0) then 
        pos = __lua_lib_luautf8_Utf8.len(path) + pos;
      end;
      if (pos < 0) then 
        pos = 0;
      end;
      self.dir = __lua_lib_luautf8_Utf8.sub(path, pos + 1, pos + len);
      local pos = c1 + 1;
      local len = nil;
      if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(path)))) then 
        len = __lua_lib_luautf8_Utf8.len(path);
      else
        if (len < 0) then 
          len = __lua_lib_luautf8_Utf8.len(path) + len;
        end;
      end;
      if (pos < 0) then 
        pos = __lua_lib_luautf8_Utf8.len(path) + pos;
      end;
      if (pos < 0) then 
        pos = 0;
      end;
      path = __lua_lib_luautf8_Utf8.sub(path, pos + 1, pos + len);
    else
      self.dir = nil;
    end;
  end;
  local startIndex = nil;
  local ret = -1;
  if (startIndex == nil) then 
    startIndex = __lua_lib_luautf8_Utf8.len(path);
  end;
  while (true) do 
    local startIndex1 = ret + 1;
    if (startIndex1 == nil) then 
      startIndex1 = 1;
    else
      startIndex1 = startIndex1 + 1;
    end;
    local r = __lua_lib_luautf8_Utf8.find(path, ".", startIndex1, true);
    local p = (function() 
      local _hx_3
      if ((r ~= nil) and (r > 0)) then 
      _hx_3 = r - 1; else 
      _hx_3 = -1; end
      return _hx_3
    end )();
    if (((p == -1) or (p > startIndex)) or (p == ret)) then 
      break;
    end;
    ret = p;
  end;
  local cp = ret;
  if (cp ~= -1) then 
    local pos = cp + 1;
    local len = nil;
    if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(path)))) then 
      len = __lua_lib_luautf8_Utf8.len(path);
    else
      if (len < 0) then 
        len = __lua_lib_luautf8_Utf8.len(path) + len;
      end;
    end;
    if (pos < 0) then 
      pos = __lua_lib_luautf8_Utf8.len(path) + pos;
    end;
    if (pos < 0) then 
      pos = 0;
    end;
    self.ext = __lua_lib_luautf8_Utf8.sub(path, pos + 1, pos + len);
    local pos = 0;
    local len = cp;
    if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(path)))) then 
      len = __lua_lib_luautf8_Utf8.len(path);
    else
      if (len < 0) then 
        len = __lua_lib_luautf8_Utf8.len(path) + len;
      end;
    end;
    if (pos < 0) then 
      pos = __lua_lib_luautf8_Utf8.len(path) + pos;
    end;
    if (pos < 0) then 
      pos = 0;
    end;
    self.file = __lua_lib_luautf8_Utf8.sub(path, pos + 1, pos + len);
  else
    self.ext = nil;
    self.file = path;
  end;
end
_hxClasses["haxe.io.Path"] = __haxe_io_Path
__haxe_io_Path.__name__ = "haxe.io.Path"
__haxe_io_Path.withoutExtension = function(path) 
  local s = __haxe_io_Path.new(path);
  s.ext = nil;
  do return s:toString() end;
end
__haxe_io_Path.withoutDirectory = function(path) 
  local s = __haxe_io_Path.new(path);
  s.dir = nil;
  do return s:toString() end;
end
__haxe_io_Path.directory = function(path) 
  local s = __haxe_io_Path.new(path);
  if (s.dir == nil) then 
    do return "" end;
  end;
  do return s.dir end;
end
__haxe_io_Path.extension = function(path) 
  local s = __haxe_io_Path.new(path);
  if (s.ext == nil) then 
    do return "" end;
  end;
  do return s.ext end;
end
__haxe_io_Path.withExtension = function(path,ext) 
  local s = __haxe_io_Path.new(path);
  s.ext = ext;
  do return s:toString() end;
end
__haxe_io_Path.join = function(paths) 
  local _g = _hx_tab_array({}, 0);
  local _g1 = 0;
  local _g2 = paths;
  while (_g1 < _g2.length) do 
    local i = _g2[_g1];
    _g1 = _g1 + 1;
    if ((i ~= nil) and (i ~= "")) then 
      _g:push(i);
    end;
  end;
  local paths = _g;
  if (paths.length == 0) then 
    do return "" end;
  end;
  local path = paths[0];
  local _g = 1;
  local _g1 = paths.length;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    path = __haxe_io_Path.addTrailingSlash(path);
    path = Std.string(path) .. Std.string(paths[i]);
  end;
  do return __haxe_io_Path.normalize(path) end;
end
__haxe_io_Path.normalize = function(path) 
  local slash = "/";
  local idx = 1;
  local ret = _hx_tab_array({}, 0);
  while (idx ~= nil) do 
    local newidx = 0;
    if (__lua_lib_luautf8_Utf8.len("\\") > 0) then 
      newidx = __lua_lib_luautf8_Utf8.find(path, "\\", idx, true);
    else
      if (idx >= __lua_lib_luautf8_Utf8.len(path)) then 
        newidx = nil;
      else
        newidx = idx + 1;
      end;
    end;
    if (newidx ~= nil) then 
      local match = __lua_lib_luautf8_Utf8.sub(path, idx, newidx - 1);
      ret:push(match);
      idx = newidx + __lua_lib_luautf8_Utf8.len("\\");
    else
      ret:push(__lua_lib_luautf8_Utf8.sub(path, idx, __lua_lib_luautf8_Utf8.len(path)));
      idx = nil;
    end;
  end;
  path = ret:join(slash);
  if (path == slash) then 
    do return slash end;
  end;
  local target = _hx_tab_array({}, 0);
  local _g = 0;
  local idx = 1;
  local ret = _hx_tab_array({}, 0);
  while (idx ~= nil) do 
    local newidx = 0;
    if (__lua_lib_luautf8_Utf8.len(slash) > 0) then 
      newidx = __lua_lib_luautf8_Utf8.find(path, slash, idx, true);
    else
      if (idx >= __lua_lib_luautf8_Utf8.len(path)) then 
        newidx = nil;
      else
        newidx = idx + 1;
      end;
    end;
    if (newidx ~= nil) then 
      local match = __lua_lib_luautf8_Utf8.sub(path, idx, newidx - 1);
      ret:push(match);
      idx = newidx + __lua_lib_luautf8_Utf8.len(slash);
    else
      ret:push(__lua_lib_luautf8_Utf8.sub(path, idx, __lua_lib_luautf8_Utf8.len(path)));
      idx = nil;
    end;
  end;
  local _g1 = ret;
  while (_g < _g1.length) do 
    local token = _g1[_g];
    _g = _g + 1;
    if (((token == "..") and (target.length > 0)) and (target[target.length - 1] ~= "..")) then 
      target:pop();
    else
      if (token == "") then 
        if ((target.length > 0) or (__lua_lib_luautf8_Utf8.byte(path, 1) == 47)) then 
          target:push(token);
        end;
      else
        if (token ~= ".") then 
          target:push(token);
        end;
      end;
    end;
  end;
  local tmp = target:join(slash);
  local acc_b = ({});
  local acc_length = 0;
  local colon = false;
  local slashes = false;
  local _g = 0;
  local _g1 = __lua_lib_luautf8_Utf8.len(tmp);
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    local _g = __lua_lib_luautf8_Utf8.byte(tmp, i + 1);
    local _g1 = _g;
    if (_g1) == 47 then 
      if (not colon) then 
        slashes = true;
      else
        local i = _g;
        colon = false;
        if (slashes) then 
          local str = "/";
          _G.table.insert(acc_b, str);
          acc_length = acc_length + __lua_lib_luautf8_Utf8.len(str);
          slashes = false;
        end;
        _G.table.insert(acc_b, __lua_lib_luautf8_Utf8.char(i));
        acc_length = acc_length + 1;
      end;
    elseif (_g1) == 58 then 
      local str = ":";
      _G.table.insert(acc_b, str);
      acc_length = acc_length + __lua_lib_luautf8_Utf8.len(str);
      colon = true;else
    local i = _g;
    colon = false;
    if (slashes) then 
      local str = "/";
      _G.table.insert(acc_b, str);
      acc_length = acc_length + __lua_lib_luautf8_Utf8.len(str);
      slashes = false;
    end;
    _G.table.insert(acc_b, __lua_lib_luautf8_Utf8.char(i));
    acc_length = acc_length + 1; end;
  end;
  do return _G.table.concat(acc_b) end;
end
__haxe_io_Path.addTrailingSlash = function(path) 
  if (__lua_lib_luautf8_Utf8.len(path) == 0) then 
    do return "/" end;
  end;
  local startIndex = nil;
  local ret = -1;
  if (startIndex == nil) then 
    startIndex = __lua_lib_luautf8_Utf8.len(path);
  end;
  while (true) do 
    local startIndex1 = ret + 1;
    if (startIndex1 == nil) then 
      startIndex1 = 1;
    else
      startIndex1 = startIndex1 + 1;
    end;
    local r = __lua_lib_luautf8_Utf8.find(path, "/", startIndex1, true);
    local p = (function() 
      local _hx_1
      if ((r ~= nil) and (r > 0)) then 
      _hx_1 = r - 1; else 
      _hx_1 = -1; end
      return _hx_1
    end )();
    if (((p == -1) or (p > startIndex)) or (p == ret)) then 
      break;
    end;
    ret = p;
  end;
  local c1 = ret;
  local startIndex = nil;
  local ret = -1;
  if (startIndex == nil) then 
    startIndex = __lua_lib_luautf8_Utf8.len(path);
  end;
  while (true) do 
    local startIndex1 = ret + 1;
    if (startIndex1 == nil) then 
      startIndex1 = 1;
    else
      startIndex1 = startIndex1 + 1;
    end;
    local r = __lua_lib_luautf8_Utf8.find(path, "\\", startIndex1, true);
    local p = (function() 
      local _hx_2
      if ((r ~= nil) and (r > 0)) then 
      _hx_2 = r - 1; else 
      _hx_2 = -1; end
      return _hx_2
    end )();
    if (((p == -1) or (p > startIndex)) or (p == ret)) then 
      break;
    end;
    ret = p;
  end;
  local c2 = ret;
  if (c1 < c2) then 
    if (c2 ~= (__lua_lib_luautf8_Utf8.len(path) - 1)) then 
      do return Std.string(path) .. Std.string("\\") end;
    else
      do return path end;
    end;
  else
    if (c1 ~= (__lua_lib_luautf8_Utf8.len(path) - 1)) then 
      do return Std.string(path) .. Std.string("/") end;
    else
      do return path end;
    end;
  end;
end
__haxe_io_Path.removeTrailingSlashes = function(path) 
  while (true) do 
    local _g = __lua_lib_luautf8_Utf8.byte(path, (__lua_lib_luautf8_Utf8.len(path) - 1) + 1);
    if (_g == nil) then 
      break;
    else
      local _g = _g;
      if (_g) == 47 or (_g) == 92 then 
        local pos = 0;
        local len = -1;
        if ((len == nil) or (len > (pos + __lua_lib_luautf8_Utf8.len(path)))) then 
          len = __lua_lib_luautf8_Utf8.len(path);
        else
          if (len < 0) then 
            len = __lua_lib_luautf8_Utf8.len(path) + len;
          end;
        end;
        if (pos < 0) then 
          pos = __lua_lib_luautf8_Utf8.len(path) + pos;
        end;
        if (pos < 0) then 
          pos = 0;
        end;
        path = __lua_lib_luautf8_Utf8.sub(path, pos + 1, pos + len);else
      break; end;
    end;
  end;
  do return path end;
end
__haxe_io_Path.isAbsolute = function(path) 
  if (StringTools.startsWith(path, "/")) then 
    do return true end;
  end;
  if (__lua_lib_luautf8_Utf8.sub(path, 2, 2) == ":") then 
    do return true end;
  end;
  if (StringTools.startsWith(path, "\\\\")) then 
    do return true end;
  end;
  do return false end;
end
__haxe_io_Path.unescape = function(path) 
  local regex = EReg.new("-x([0-9][0-9])", "g");
  do return regex:map(path, function(regex) 
    do return __lua_lib_luautf8_Utf8.char(Std.parseInt(regex:matched(1))) end;
  end) end;
end
__haxe_io_Path.escape = function(path,allowSlashes) 
  if (allowSlashes == nil) then 
    allowSlashes = false;
  end;
  local regex = (function() 
    local _hx_1
    if (allowSlashes) then 
    _hx_1 = EReg.new("[^A-Za-z0-9_/\\\\\\.]", "g"); else 
    _hx_1 = EReg.new("[^A-Za-z0-9_\\.]", "g"); end
    return _hx_1
  end )();
  do return regex:map(path, function(v) 
    do return Std.string("-x") .. Std.string(__lua_lib_luautf8_Utf8.byte(v:matched(0), 1)) end;
  end) end;
end
__haxe_io_Path.prototype = _hx_e();
__haxe_io_Path.prototype.dir= nil;
__haxe_io_Path.prototype.file= nil;
__haxe_io_Path.prototype.ext= nil;
__haxe_io_Path.prototype.backslash= nil;
__haxe_io_Path.prototype.toString = function(self) 
  do return Std.string(Std.string(((function() 
    local _hx_1
    if (self.dir == nil) then 
    _hx_1 = ""; else 
    _hx_1 = Std.string(self.dir) .. Std.string(((function() 
      local _hx_2
      if (self.backslash) then 
      _hx_2 = "\\"; else 
      _hx_2 = "/"; end
      return _hx_2
    end )())); end
    return _hx_1
  end )())) .. Std.string(self.file)) .. Std.string(((function() 
    local _hx_3
    if (self.ext == nil) then 
    _hx_3 = ""; else 
    _hx_3 = Std.string(".") .. Std.string(self.ext); end
    return _hx_3
  end )())) end
end

__haxe_io_Path.prototype.__class__ =  __haxe_io_Path

__haxe_iterators_ArrayIterator.new = function(array) 
  local self = _hx_new(__haxe_iterators_ArrayIterator.prototype)
  __haxe_iterators_ArrayIterator.super(self,array)
  return self
end
__haxe_iterators_ArrayIterator.super = function(self,array) 
  self.current = 0;
  self.array = array;
end
_hxClasses["haxe.iterators.ArrayIterator"] = __haxe_iterators_ArrayIterator
__haxe_iterators_ArrayIterator.__name__ = "haxe.iterators.ArrayIterator"
__haxe_iterators_ArrayIterator.prototype = _hx_e();
__haxe_iterators_ArrayIterator.prototype.array= nil;
__haxe_iterators_ArrayIterator.prototype.current= nil;
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
  self.current = 0;
  self.array = array;
end
_hxClasses["haxe.iterators.ArrayKeyValueIterator"] = __haxe_iterators_ArrayKeyValueIterator
__haxe_iterators_ArrayKeyValueIterator.__name__ = "haxe.iterators.ArrayKeyValueIterator"
__haxe_iterators_ArrayKeyValueIterator.prototype = _hx_e();
__haxe_iterators_ArrayKeyValueIterator.prototype.current= nil;
__haxe_iterators_ArrayKeyValueIterator.prototype.array= nil;
__haxe_iterators_ArrayKeyValueIterator.prototype.hasNext = function(self) 
  do return self.current < self.array.length end
end
__haxe_iterators_ArrayKeyValueIterator.prototype.next = function(self) 
  do return _hx_o({__fields__={value=true,key=true},value=self.array[self.current],key=(function() 
  local _hx_obj = self;
  local _hx_fld = 'current';
  local _ = _hx_obj[_hx_fld];
  _hx_obj[_hx_fld] = _hx_obj[_hx_fld]  + 1;
   return _;
   end)()}) end
end

__haxe_iterators_ArrayKeyValueIterator.prototype.__class__ =  __haxe_iterators_ArrayKeyValueIterator

__haxe_iterators_DynamicAccessIterator.new = function(access) 
  local self = _hx_new(__haxe_iterators_DynamicAccessIterator.prototype)
  __haxe_iterators_DynamicAccessIterator.super(self,access)
  return self
end
__haxe_iterators_DynamicAccessIterator.super = function(self,access) 
  self.access = access;
  self.keys = Reflect.fields(access);
  self.index = 0;
end
_hxClasses["haxe.iterators.DynamicAccessIterator"] = __haxe_iterators_DynamicAccessIterator
__haxe_iterators_DynamicAccessIterator.__name__ = "haxe.iterators.DynamicAccessIterator"
__haxe_iterators_DynamicAccessIterator.prototype = _hx_e();
__haxe_iterators_DynamicAccessIterator.prototype.access= nil;
__haxe_iterators_DynamicAccessIterator.prototype.keys= nil;
__haxe_iterators_DynamicAccessIterator.prototype.index= nil;
__haxe_iterators_DynamicAccessIterator.prototype.hasNext = function(self) 
  do return self.index < self.keys.length end
end
__haxe_iterators_DynamicAccessIterator.prototype.next = function(self) 
  local key = self.keys[(function() 
  local _hx_obj = self;
  local _hx_fld = 'index';
  local _ = _hx_obj[_hx_fld];
  _hx_obj[_hx_fld] = _hx_obj[_hx_fld]  + 1;
   return _;
   end)()];
  do return Reflect.field(self.access, key) end
end

__haxe_iterators_DynamicAccessIterator.prototype.__class__ =  __haxe_iterators_DynamicAccessIterator

__haxe_iterators_DynamicAccessKeyValueIterator.new = function(access) 
  local self = _hx_new(__haxe_iterators_DynamicAccessKeyValueIterator.prototype)
  __haxe_iterators_DynamicAccessKeyValueIterator.super(self,access)
  return self
end
__haxe_iterators_DynamicAccessKeyValueIterator.super = function(self,access) 
  self.access = access;
  self.keys = Reflect.fields(access);
  self.index = 0;
end
_hxClasses["haxe.iterators.DynamicAccessKeyValueIterator"] = __haxe_iterators_DynamicAccessKeyValueIterator
__haxe_iterators_DynamicAccessKeyValueIterator.__name__ = "haxe.iterators.DynamicAccessKeyValueIterator"
__haxe_iterators_DynamicAccessKeyValueIterator.prototype = _hx_e();
__haxe_iterators_DynamicAccessKeyValueIterator.prototype.access= nil;
__haxe_iterators_DynamicAccessKeyValueIterator.prototype.keys= nil;
__haxe_iterators_DynamicAccessKeyValueIterator.prototype.index= nil;
__haxe_iterators_DynamicAccessKeyValueIterator.prototype.hasNext = function(self) 
  do return self.index < self.keys.length end
end
__haxe_iterators_DynamicAccessKeyValueIterator.prototype.next = function(self) 
  local key = self.keys[(function() 
  local _hx_obj = self;
  local _hx_fld = 'index';
  local _ = _hx_obj[_hx_fld];
  _hx_obj[_hx_fld] = _hx_obj[_hx_fld]  + 1;
   return _;
   end)()];
  do return _hx_o({__fields__={value=true,key=true},value=Reflect.field(self.access, key),key=key}) end
end

__haxe_iterators_DynamicAccessKeyValueIterator.prototype.__class__ =  __haxe_iterators_DynamicAccessKeyValueIterator

__haxe_iterators_HashMapKeyValueIterator.new = function(map) 
  local self = _hx_new(__haxe_iterators_HashMapKeyValueIterator.prototype)
  __haxe_iterators_HashMapKeyValueIterator.super(self,map)
  return self
end
__haxe_iterators_HashMapKeyValueIterator.super = function(self,map) 
  self.map = map;
  self.keys = map.keys:iterator();
end
_hxClasses["haxe.iterators.HashMapKeyValueIterator"] = __haxe_iterators_HashMapKeyValueIterator
__haxe_iterators_HashMapKeyValueIterator.__name__ = "haxe.iterators.HashMapKeyValueIterator"
__haxe_iterators_HashMapKeyValueIterator.prototype = _hx_e();
__haxe_iterators_HashMapKeyValueIterator.prototype.map= nil;
__haxe_iterators_HashMapKeyValueIterator.prototype.keys= nil;
__haxe_iterators_HashMapKeyValueIterator.prototype.hasNext = function(self) 
  do return self.keys:hasNext() end
end
__haxe_iterators_HashMapKeyValueIterator.prototype.next = function(self) 
  local key = self.keys:next();
  local _this = self.map.values;
  local key1 = key:hashCode();
  local ret = _this.h[key1];
  if (ret == __haxe_ds_IntMap.tnull) then 
    ret = nil;
  end;
  do return _hx_o({__fields__={value=true,key=true},value=ret,key=key}) end
end

__haxe_iterators_HashMapKeyValueIterator.prototype.__class__ =  __haxe_iterators_HashMapKeyValueIterator

__haxe_iterators_MapKeyValueIterator.new = function(map) 
  local self = _hx_new(__haxe_iterators_MapKeyValueIterator.prototype)
  __haxe_iterators_MapKeyValueIterator.super(self,map)
  return self
end
__haxe_iterators_MapKeyValueIterator.super = function(self,map) 
  self.map = map;
  self.keys = map:keys();
end
_hxClasses["haxe.iterators.MapKeyValueIterator"] = __haxe_iterators_MapKeyValueIterator
__haxe_iterators_MapKeyValueIterator.__name__ = "haxe.iterators.MapKeyValueIterator"
__haxe_iterators_MapKeyValueIterator.prototype = _hx_e();
__haxe_iterators_MapKeyValueIterator.prototype.map= nil;
__haxe_iterators_MapKeyValueIterator.prototype.keys= nil;
__haxe_iterators_MapKeyValueIterator.prototype.hasNext = function(self) 
  do return self.keys:hasNext() end
end
__haxe_iterators_MapKeyValueIterator.prototype.next = function(self) 
  local key = self.keys:next();
  do return _hx_o({__fields__={value=true,key=true},value=self.map:get(key),key=key}) end
end

__haxe_iterators_MapKeyValueIterator.prototype.__class__ =  __haxe_iterators_MapKeyValueIterator

__haxe_iterators_RestIterator.new = function(args) 
  local self = _hx_new(__haxe_iterators_RestIterator.prototype)
  __haxe_iterators_RestIterator.super(self,args)
  return self
end
__haxe_iterators_RestIterator.super = function(self,args) 
  self.current = 0;
  self.args = args;
end
_hxClasses["haxe.iterators.RestIterator"] = __haxe_iterators_RestIterator
__haxe_iterators_RestIterator.__name__ = "haxe.iterators.RestIterator"
__haxe_iterators_RestIterator.prototype = _hx_e();
__haxe_iterators_RestIterator.prototype.args= nil;
__haxe_iterators_RestIterator.prototype.current= nil;
__haxe_iterators_RestIterator.prototype.hasNext = function(self) 
  do return self.current < _hx_table.maxn(self.args) end
end
__haxe_iterators_RestIterator.prototype.next = function(self) 
  local index = (function() 
  local _hx_obj = self;
  local _hx_fld = 'current';
  local _ = _hx_obj[_hx_fld];
  _hx_obj[_hx_fld] = _hx_obj[_hx_fld]  + 1;
   return _;
   end)();
  do return self.args[index + 1] end
end

__haxe_iterators_RestIterator.prototype.__class__ =  __haxe_iterators_RestIterator

__haxe_iterators_RestKeyValueIterator.new = function(args) 
  local self = _hx_new(__haxe_iterators_RestKeyValueIterator.prototype)
  __haxe_iterators_RestKeyValueIterator.super(self,args)
  return self
end
__haxe_iterators_RestKeyValueIterator.super = function(self,args) 
  self.current = 0;
  self.args = args;
end
_hxClasses["haxe.iterators.RestKeyValueIterator"] = __haxe_iterators_RestKeyValueIterator
__haxe_iterators_RestKeyValueIterator.__name__ = "haxe.iterators.RestKeyValueIterator"
__haxe_iterators_RestKeyValueIterator.prototype = _hx_e();
__haxe_iterators_RestKeyValueIterator.prototype.args= nil;
__haxe_iterators_RestKeyValueIterator.prototype.current= nil;
__haxe_iterators_RestKeyValueIterator.prototype.hasNext = function(self) 
  do return self.current < _hx_table.maxn(self.args) end
end
__haxe_iterators_RestKeyValueIterator.prototype.next = function(self) 
  local tmp = self.current;
  local index = (function() 
  local _hx_obj = self;
  local _hx_fld = 'current';
  local _ = _hx_obj[_hx_fld];
  _hx_obj[_hx_fld] = _hx_obj[_hx_fld]  + 1;
   return _;
   end)();
  do return _hx_o({__fields__={key=true,value=true},key=tmp,value=self.args[index + 1]}) end
end

__haxe_iterators_RestKeyValueIterator.prototype.__class__ =  __haxe_iterators_RestKeyValueIterator

__haxe_iterators_StringIterator.new = function(s) 
  local self = _hx_new(__haxe_iterators_StringIterator.prototype)
  __haxe_iterators_StringIterator.super(self,s)
  return self
end
__haxe_iterators_StringIterator.super = function(self,s) 
  self.codes = __lua_lib_luautf8_Utf8.codes(s);
  self.str = s;
  local _hx_1_cp_position, _hx_1_cp_codepoint = self:codes(self.str, 0);
  self.codepoint = _hx_1_cp_codepoint;
  self.position = _hx_1_cp_position;
end
_hxClasses["haxe.iterators.StringIterator"] = __haxe_iterators_StringIterator
__haxe_iterators_StringIterator.__name__ = "haxe.iterators.StringIterator"
__haxe_iterators_StringIterator.prototype = _hx_e();
__haxe_iterators_StringIterator.prototype.codes= nil;
__haxe_iterators_StringIterator.prototype.codepoint= nil;
__haxe_iterators_StringIterator.prototype.str= nil;
__haxe_iterators_StringIterator.prototype.position= nil;
__haxe_iterators_StringIterator.prototype.hasNext = function(self) 
  do return self.codepoint ~= nil end
end
__haxe_iterators_StringIterator.prototype.next = function(self) 
  local ret = self.codepoint;
  local _hx_1_cp_position, _hx_1_cp_codepoint = self:codes(self.str, self.position);
  self.codepoint = _hx_1_cp_codepoint;
  self.position = _hx_1_cp_position;
  do return ret end
end

__haxe_iterators_StringIterator.prototype.__class__ =  __haxe_iterators_StringIterator

__haxe_iterators_StringIteratorUnicode.new = function(s) 
  local self = _hx_new(__haxe_iterators_StringIteratorUnicode.prototype)
  __haxe_iterators_StringIteratorUnicode.super(self,s)
  return self
end
__haxe_iterators_StringIteratorUnicode.super = function(self,s) 
  self.offset = 0;
  self.s = s;
end
_hxClasses["haxe.iterators.StringIteratorUnicode"] = __haxe_iterators_StringIteratorUnicode
__haxe_iterators_StringIteratorUnicode.__name__ = "haxe.iterators.StringIteratorUnicode"
__haxe_iterators_StringIteratorUnicode.unicodeIterator = function(s) 
  do return __haxe_iterators_StringIteratorUnicode.new(s) end;
end
__haxe_iterators_StringIteratorUnicode.prototype = _hx_e();
__haxe_iterators_StringIteratorUnicode.prototype.offset= nil;
__haxe_iterators_StringIteratorUnicode.prototype.s= nil;
__haxe_iterators_StringIteratorUnicode.prototype.hasNext = function(self) 
  do return self.offset < __lua_lib_luautf8_Utf8.len(self.s) end
end
__haxe_iterators_StringIteratorUnicode.prototype.next = function(self) 
  local index = (function() 
  local _hx_obj = self;
  local _hx_fld = 'offset';
  local _ = _hx_obj[_hx_fld];
  _hx_obj[_hx_fld] = _hx_obj[_hx_fld]  + 1;
   return _;
   end)();
  do return __lua_lib_luautf8_Utf8.byte(self.s, index + 1) end
end

__haxe_iterators_StringIteratorUnicode.prototype.__class__ =  __haxe_iterators_StringIteratorUnicode

__haxe_iterators_StringKeyValueIterator.new = function(s) 
  local self = _hx_new(__haxe_iterators_StringKeyValueIterator.prototype)
  __haxe_iterators_StringKeyValueIterator.super(self,s)
  return self
end
__haxe_iterators_StringKeyValueIterator.super = function(self,s) 
  self.offset = 0;
  self.s = s;
end
_hxClasses["haxe.iterators.StringKeyValueIterator"] = __haxe_iterators_StringKeyValueIterator
__haxe_iterators_StringKeyValueIterator.__name__ = "haxe.iterators.StringKeyValueIterator"
__haxe_iterators_StringKeyValueIterator.prototype = _hx_e();
__haxe_iterators_StringKeyValueIterator.prototype.offset= nil;
__haxe_iterators_StringKeyValueIterator.prototype.s= nil;
__haxe_iterators_StringKeyValueIterator.prototype.hasNext = function(self) 
  do return self.offset < __lua_lib_luautf8_Utf8.len(self.s) end
end
__haxe_iterators_StringKeyValueIterator.prototype.next = function(self) 
  local tmp = self.offset;
  local index = (function() 
  local _hx_obj = self;
  local _hx_fld = 'offset';
  local _ = _hx_obj[_hx_fld];
  _hx_obj[_hx_fld] = _hx_obj[_hx_fld]  + 1;
   return _;
   end)();
  do return _hx_o({__fields__={key=true,value=true},key=tmp,value=__lua_lib_luautf8_Utf8.byte(self.s, index + 1)}) end
end

__haxe_iterators_StringKeyValueIterator.prototype.__class__ =  __haxe_iterators_StringKeyValueIterator

__lua_Boot.new = {}
_hxClasses["lua.Boot"] = __lua_Boot
__lua_Boot.__name__ = "lua.Boot"
__lua_Boot.__properties__ = {get_os_patterns="get_os_patterns"}
__lua_Boot._ = nil
__lua_Boot.__unhtml = function(s) 
  local idx = 1;
  local ret = _hx_tab_array({}, 0);
  while (idx ~= nil) do 
    local newidx = 0;
    if (__lua_lib_luautf8_Utf8.len("&") > 0) then 
      newidx = __lua_lib_luautf8_Utf8.find(s, "&", idx, true);
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
      idx = newidx + __lua_lib_luautf8_Utf8.len("&");
    else
      ret:push(__lua_lib_luautf8_Utf8.sub(s, idx, __lua_lib_luautf8_Utf8.len(s)));
      idx = nil;
    end;
  end;
  local _this = ret:join("&amp;");
  local idx = 1;
  local ret = _hx_tab_array({}, 0);
  while (idx ~= nil) do 
    local newidx = 0;
    if (__lua_lib_luautf8_Utf8.len("<") > 0) then 
      newidx = __lua_lib_luautf8_Utf8.find(_this, "<", idx, true);
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
      idx = newidx + __lua_lib_luautf8_Utf8.len("<");
    else
      ret:push(__lua_lib_luautf8_Utf8.sub(_this, idx, __lua_lib_luautf8_Utf8.len(_this)));
      idx = nil;
    end;
  end;
  local _this = ret:join("&lt;");
  local idx = 1;
  local ret = _hx_tab_array({}, 0);
  while (idx ~= nil) do 
    local newidx = 0;
    if (__lua_lib_luautf8_Utf8.len(">") > 0) then 
      newidx = __lua_lib_luautf8_Utf8.find(_this, ">", idx, true);
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
      idx = newidx + __lua_lib_luautf8_Utf8.len(">");
    else
      ret:push(__lua_lib_luautf8_Utf8.sub(_this, idx, __lua_lib_luautf8_Utf8.len(_this)));
      idx = nil;
    end;
  end;
  do return ret:join("&gt;") end;
end
__lua_Boot.isClass = function(o) 
  if (_G.type(o) ~= "table") then 
    do return false end;
  else
    do return o.__name__ end;
  end;
end
__lua_Boot.isEnum = function(e) 
  if (_G.type(e) ~= "table") then 
    do return false end;
  else
    do return e.__ename__ end;
  end;
end
__lua_Boot.getClass = function(o) 
  if (__lua_Boot.__instanceof(o, Array)) then 
    do return Array end;
  else
    if (__lua_Boot.__instanceof(o, String)) then 
      do return String end;
    else
      local cl = o.__class__;
      if (cl ~= nil) then 
        do return cl end;
      else
        do return nil end;
      end;
    end;
  end;
end
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
__lua_Boot.inheritsFrom = function(o,cl) 
  while ((_G.getmetatable(o) ~= nil) and (_G.getmetatable(o).__index ~= nil)) do 
    if (_G.getmetatable(o).__index == cl.prototype) then 
      do return true end;
    end;
    o = _G.getmetatable(o).__index;
  end;
  do return false end;
end
__lua_Boot.__cast = function(o,t) 
  if ((o == nil) or __lua_Boot.__instanceof(o, t)) then 
    do return o end;
  else
    _G.error(__haxe_Exception.thrown(Std.string(Std.string(Std.string("Cannot cast ") .. Std.string(Std.string(o))) .. Std.string(" to ")) .. Std.string(Std.string(t))),0);
  end;
end
__lua_Boot.defArray = function(tab,length) 
  if (length == nil) then 
    length = _hx_table.maxn(tab);
    if (length > 0) then 
      local head = tab[1];
      _G.table.remove(tab, 1);
      tab[0] = head;
      do return _hx_tab_array(tab, length) end;
    else
      do return _hx_tab_array({}, 0) end;
    end;
  else
    do return _hx_tab_array(tab, length) end;
  end;
end
__lua_Boot.tableToObject = function(t) 
  do return _hx_o(t) end;
end
__lua_Boot.dateStr = function(date) 
  local m = date:getMonth() + 1;
  local d = date:getDate();
  local h = date:getHours();
  local mi = date:getMinutes();
  local s = date:getSeconds();
  do return Std.string(Std.string(Std.string(Std.string(Std.string(Std.string(Std.string(Std.string(Std.string(Std.string(date:getFullYear()) .. Std.string("-")) .. Std.string(((function() 
    local _hx_1
    if (m < 10) then 
    _hx_1 = Std.string("0") .. Std.string(m); else 
    _hx_1 = Std.string("") .. Std.string(m); end
    return _hx_1
  end )()))) .. Std.string("-")) .. Std.string(((function() 
    local _hx_2
    if (d < 10) then 
    _hx_2 = Std.string("0") .. Std.string(d); else 
    _hx_2 = Std.string("") .. Std.string(d); end
    return _hx_2
  end )()))) .. Std.string(" ")) .. Std.string(((function() 
    local _hx_3
    if (h < 10) then 
    _hx_3 = Std.string("0") .. Std.string(h); else 
    _hx_3 = Std.string("") .. Std.string(h); end
    return _hx_3
  end )()))) .. Std.string(":")) .. Std.string(((function() 
    local _hx_4
    if (mi < 10) then 
    _hx_4 = Std.string("0") .. Std.string(mi); else 
    _hx_4 = Std.string("") .. Std.string(mi); end
    return _hx_4
  end )()))) .. Std.string(":")) .. Std.string(((function() 
    local _hx_5
    if (s < 10) then 
    _hx_5 = Std.string("0") .. Std.string(s); else 
    _hx_5 = Std.string("") .. Std.string(s); end
    return _hx_5
  end )())) end;
end
__lua_Boot.clampInt32 = function(x) 
  do return _hx_bit_clamp(x) end;
end
__lua_Boot.strDate = function(s) 
  local _g = __lua_lib_luautf8_Utf8.len(s);
  if (_g) == 8 then 
    local idx = 1;
    local ret = _hx_tab_array({}, 0);
    while (idx ~= nil) do 
      local newidx = 0;
      if (__lua_lib_luautf8_Utf8.len(":") > 0) then 
        newidx = __lua_lib_luautf8_Utf8.find(s, ":", idx, true);
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
        idx = newidx + __lua_lib_luautf8_Utf8.len(":");
      else
        ret:push(__lua_lib_luautf8_Utf8.sub(s, idx, __lua_lib_luautf8_Utf8.len(s)));
        idx = nil;
      end;
    end;
    local k = ret;
    local t = ((_G.tonumber(k[0]) * 3600000.) + (_G.tonumber(k[1]) * 60000.)) + (_G.tonumber(k[2]) * 1000.);
    local d = _hx_e();
    _G.setmetatable(d, _hx_o({__fields__={__index=true},__index=Date.prototype}));
    d.t = t / 1000;
    d.d = _G.os.date("*t", Std.int(d.t));
    d.dUTC = _G.os.date("!*t", Std.int(d.t));
    do return d end;
  elseif (_g) == 10 then 
    local idx = 1;
    local ret = _hx_tab_array({}, 0);
    while (idx ~= nil) do 
      local newidx = 0;
      if (__lua_lib_luautf8_Utf8.len("-") > 0) then 
        newidx = __lua_lib_luautf8_Utf8.find(s, "-", idx, true);
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
        idx = newidx + __lua_lib_luautf8_Utf8.len("-");
      else
        ret:push(__lua_lib_luautf8_Utf8.sub(s, idx, __lua_lib_luautf8_Utf8.len(s)));
        idx = nil;
      end;
    end;
    local k = ret;
    do return Date.new(_G.tonumber(k[0]), _G.tonumber(k[1]) - 1, _G.tonumber(k[2]), 0, 0, 0) end;
  elseif (_g) == 19 then 
    local idx = 1;
    local ret = _hx_tab_array({}, 0);
    while (idx ~= nil) do 
      local newidx = 0;
      if (__lua_lib_luautf8_Utf8.len(" ") > 0) then 
        newidx = __lua_lib_luautf8_Utf8.find(s, " ", idx, true);
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
        idx = newidx + __lua_lib_luautf8_Utf8.len(" ");
      else
        ret:push(__lua_lib_luautf8_Utf8.sub(s, idx, __lua_lib_luautf8_Utf8.len(s)));
        idx = nil;
      end;
    end;
    local k = ret;
    local _this = k[0];
    local idx = 1;
    local ret = _hx_tab_array({}, 0);
    while (idx ~= nil) do 
      local newidx = 0;
      if (__lua_lib_luautf8_Utf8.len("-") > 0) then 
        newidx = __lua_lib_luautf8_Utf8.find(_this, "-", idx, true);
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
        idx = newidx + __lua_lib_luautf8_Utf8.len("-");
      else
        ret:push(__lua_lib_luautf8_Utf8.sub(_this, idx, __lua_lib_luautf8_Utf8.len(_this)));
        idx = nil;
      end;
    end;
    local y = ret;
    local _this = k[1];
    local idx = 1;
    local ret = _hx_tab_array({}, 0);
    while (idx ~= nil) do 
      local newidx = 0;
      if (__lua_lib_luautf8_Utf8.len(":") > 0) then 
        newidx = __lua_lib_luautf8_Utf8.find(_this, ":", idx, true);
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
        idx = newidx + __lua_lib_luautf8_Utf8.len(":");
      else
        ret:push(__lua_lib_luautf8_Utf8.sub(_this, idx, __lua_lib_luautf8_Utf8.len(_this)));
        idx = nil;
      end;
    end;
    local t = ret;
    do return Date.new(_G.tonumber(y[0]), _G.tonumber(y[1]) - 1, _G.tonumber(y[2]), _G.tonumber(t[0]), _G.tonumber(t[1]), _G.tonumber(t[2])) end;else
  _G.error(__haxe_Exception.thrown(Std.string("Invalid date format : ") .. Std.string(s)),0); end;
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
__lua_Boot.shellEscapeCmd = function(cmd,args) 
  if (args ~= nil) then 
    if (Sys.systemName() == "Windows") then 
      local _g = _hx_tab_array({}, 0);
      local _g1 = 0;
      local _g2 = _hx_tab_array({[0]=StringTools.replace(cmd, "/", "\\")}, 1):concat(args);
      while (_g1 < _g2.length) do 
        local a = _g2[_g1];
        _g1 = _g1 + 1;
        _g:push(__haxe_SysTools.quoteWinArg(a, true));
      end;
      cmd = _g:join(" ");
    else
      local f = __haxe_SysTools.quoteUnixArg;
      local _g = _hx_tab_array({}, 0);
      local _g1 = 0;
      local _g2 = _hx_tab_array({[0]=cmd}, 1):concat(args);
      while (_g1 < _g2.length) do 
        local i = _g2[_g1];
        _g1 = _g1 + 1;
        _g:push(f(i));
      end;
      cmd = _g:join(" ");
    end;
  end;
  do return cmd end;
end
__lua_Boot.tempFile = function() 
  if (Sys.systemName() == "Windows") then 
    do return __haxe_io_Path.join(_hx_tab_array({[0]=_G.os.getenv("TMP"), _G.os.tmpname()}, 2)) end;
  else
    do return _G.os.tmpname() end;
  end;
end
__lua_Boot.os_patterns = nil
__lua_Boot.get_os_patterns = function() 
  if (__lua_Boot.os_patterns == nil) then 
    local _g = __haxe_ds_StringMap.new();
    local value = _hx_tab_array({[0]="windows", "^mingw", "^cygwin"}, 3);
    if (value == nil) then 
      _g.h.Windows = __haxe_ds_StringMap.tnull;
    else
      _g.h.Windows = value;
    end;
    local value = _hx_tab_array({[0]="linux"}, 1);
    if (value == nil) then 
      _g.h.Linux = __haxe_ds_StringMap.tnull;
    else
      _g.h.Linux = value;
    end;
    local value = _hx_tab_array({[0]="mac", "darwin", "osx"}, 3);
    if (value == nil) then 
      _g.h.Mac = __haxe_ds_StringMap.tnull;
    else
      _g.h.Mac = value;
    end;
    local value = _hx_tab_array({[0]="bsd$"}, 1);
    if (value == nil) then 
      _g.h.BSD = __haxe_ds_StringMap.tnull;
    else
      _g.h.BSD = value;
    end;
    local value = _hx_tab_array({[0]="SunOS"}, 1);
    if (value == nil) then 
      _g.h.Solaris = __haxe_ds_StringMap.tnull;
    else
      _g.h.Solaris = value;
    end;
    __lua_Boot.os_patterns = _g;
  end;
  do return __lua_Boot.os_patterns end;
end
__lua_Boot.systemName = function() 
  local os = nil;
  if ((jit ~= nil) and (jit.os ~= nil)) then 
    os = jit.os;
    os = __lua_lib_luautf8_Utf8.lower(os);
  else
    local popen_status = false;
    local popen_result = nil;
    popen_status, popen_result = pcall(_G.io.popen, '');
    if (popen_status) then 
      popen_result:close();
      os = __lua_lib_luautf8_Utf8.lower(_G.io.popen("uname -s", "r"):read("*l"));
    else
      os = __lua_lib_luautf8_Utf8.lower(_G.os.getenv("OS"));
    end;
  end;
  local k = __lua_Boot.get_os_patterns():keys();
  while (k:hasNext()) do 
    local k = k:next();
    local _g = 0;
    local ret = __lua_Boot.get_os_patterns().h[k];
    if (ret == __haxe_ds_StringMap.tnull) then 
      ret = nil;
    end;
    local _g1 = ret;
    while (_g < _g1.length) do 
      local p = _g1[_g];
      _g = _g + 1;
      if (_G.string.match(os, p) ~= nil) then 
        do return k end;
      end;
    end;
  end;
  do return nil end;
end

__lua_UserData.new = {}
_hxClasses["lua.UserData"] = __lua_UserData
__lua_UserData.__name__ = "lua.UserData"

__lua_HaxeIterator.new = function(f) 
  local self = _hx_new(__lua_HaxeIterator.prototype)
  __lua_HaxeIterator.super(self,f)
  return self
end
__lua_HaxeIterator.super = function(self,f) 
  self.f = _hx_funcToField(f);
  self.state = f();
end
_hxClasses["lua.HaxeIterator"] = __lua_HaxeIterator
__lua_HaxeIterator.__name__ = "lua.HaxeIterator"
__lua_HaxeIterator.prototype = _hx_e();
__lua_HaxeIterator.prototype.state= nil;
__lua_HaxeIterator.prototype.f= nil;
__lua_HaxeIterator.prototype.next = function(self) 
  local ret = self.state;
  self.state = self:f();
  do return ret end
end
__lua_HaxeIterator.prototype.hasNext = function(self) 
  do return self.state ~= nil end
end

__lua_HaxeIterator.prototype.__class__ =  __lua_HaxeIterator

__lua__Io_IoType_Impl_.new = {}
_hxClasses["lua._Io.IoType_Impl_"] = __lua__Io_IoType_Impl_
__lua__Io_IoType_Impl_.__name__ = "lua._Io.IoType_Impl_"
__lua__Io_IoType_Impl_.toString = function(this1) 
  do return this1 end;
end

__lua_Lib.new = {}
_hxClasses["lua.Lib"] = __lua_Lib
__lua_Lib.__name__ = "lua.Lib"
__lua_Lib.println = function(v) 
  _G.print(Std.string(v));
end
__lua_Lib.print = function(v) 
  _G.io.write(Std.string(v));
  _G.io.flush();
end
__lua_Lib.patternQuote = function(str) 
  do return _G.string.gsub(str, "[%(%)%.%%%+%-%*%?%[%]%^%$]", function(c) 
    do return Std.string("%") .. Std.string(c) end;
  end) end;
end
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
__lua_Lib.isShellAvailable = function() 
  local ret = _G.os.execute();
  if (_G.type(ret) == "bool") then 
    do return ret end;
  else
    do return ret ~= 0 end;
  end;
end

__lua__NativeIterator_NativeIterator_Impl_.new = {}
_hxClasses["lua._NativeIterator.NativeIterator_Impl_"] = __lua__NativeIterator_NativeIterator_Impl_
__lua__NativeIterator_NativeIterator_Impl_.__name__ = "lua._NativeIterator.NativeIterator_Impl_"
__lua__NativeIterator_NativeIterator_Impl_._new = function(f) 
  local this1 = f;
  do return this1 end;
end
__lua__NativeIterator_NativeIterator_Impl_.fromF = function(f) 
  do return __lua__NativeIterator_NativeIterator_Impl_._new(f) end;
end
__lua__NativeIterator_NativeIterator_Impl_.toIterator = function(this1) 
  do return __lua_HaxeIterator.new(this1) end;
end

__lua_PairTools.new = {}
_hxClasses["lua.PairTools"] = __lua_PairTools
__lua_PairTools.__name__ = "lua.PairTools"
__lua_PairTools.ipairsEach = function(table,func) 
  for i,v in _G.ipairs(table) do func(i,v) end;
end
__lua_PairTools.pairsEach = function(table,func) 
  for k,v in _G.pairs(table) do func(k,v) end;
end
__lua_PairTools.ipairsMap = function(table,func) 
  local ret = ({});
  for i,v in _G.ipairs(table) do ret[i] = func(i,v) end;
  do return ret end;
end
__lua_PairTools.pairsMap = function(table,func) 
  local ret = ({});
  for k,v in _G.pairs(table) do ret[k] = func(k,v) end;
  do return ret end;
end
__lua_PairTools.ipairsFold = function(table,func,seed) 
  for i,v in _G.ipairs(table) do seed = func(i,v,seed) end;
  do return seed end;
end
__lua_PairTools.pairsFold = function(table,func,seed) 
  for k,v in _G.pairs(table) do seed = func(k,v,seed) end;
  do return seed end;
end
__lua_PairTools.ipairsConcat = function(table1,table2) 
  local ret = ({});
  __lua_PairTools.ipairsFold(table1, function(a,b,c) 
    c[a] = b;
    do return c end;
  end, ret);
  local size = _hx_table.maxn(ret);
  __lua_PairTools.ipairsFold(table2, function(a,b,c) 
    c[a + size] = b;
    do return c end;
  end, ret);
  do return ret end;
end
__lua_PairTools.pairsMerge = function(table1,table2) 
  local ret = __lua_PairTools.copy(table1);
  __lua_PairTools.pairsEach(table2, function(a,b) 
    ret[a] = b;
  end);
  do return ret end;
end
__lua_PairTools.ipairsExist = function(table,func) 
  for k,v in _G.ipairs(table) do if func(k,v) then return true end end;
end
__lua_PairTools.pairsExist = function(table,func) 
  for k,v in _G.pairs(table) do if func(k,v) then return true end end;
end
__lua_PairTools.copy = function(table1) 
  local ret = ({});
  for k,v in _G.pairs(table1) do ret[k] = v end;
  do return ret end;
end
__lua_PairTools.pairsIterator = function(table) 
  local _hx_1_p_next, _hx_1_p_table, _hx_1_p_index = _G.pairs(table);
  local next = _hx_1_p_next;
  local i = _hx_1_p_index;
  do return _hx_o({__fields__={next=true,hasNext=true},next=function(self) 
    local _hx_2_res_index, _hx_2_res_value = next(table, i);
    i = _hx_2_res_index;
    do return _hx_o({__fields__={index=true,value=true},index=_hx_2_res_index,value=_hx_2_res_value}) end;
  end,hasNext=function(self) 
    do return _G.select(2, _G.next(table, i)) ~= nil end;
  end}) end;
end
__lua_PairTools.ipairsIterator = function(table) 
  local _hx_1_p_next, _hx_1_p_table, _hx_1_p_index = _G.ipairs(table);
  local next = _hx_1_p_next;
  local i = _hx_1_p_index;
  do return _hx_o({__fields__={next=true,hasNext=true},next=function(self) 
    local _hx_2_res_index, _hx_2_res_value = next(table, i);
    i = _hx_2_res_index;
    do return _hx_o({__fields__={index=true,value=true},index=_hx_2_res_index,value=_hx_2_res_value}) end;
  end,hasNext=function(self) 
    do return _G.select(2, next(table, i)) ~= nil end;
  end}) end;
end

__lua_Thread.new = {}
_hxClasses["lua.Thread"] = __lua_Thread
__lua_Thread.__name__ = "lua.Thread"

__sys_FileSystem.new = {}
_hxClasses["sys.FileSystem"] = __sys_FileSystem
__sys_FileSystem.__name__ = "sys.FileSystem"
__sys_FileSystem.exists = function(path) 
  if (path == nil) then 
    do return false end;
  else
    local _hx_1_res_result, _hx_1_res_message = __lua_lib_luv_fs_FileSystem.fs_stat(path);
    do return _hx_1_res_result ~= nil end;
  end;
end
__sys_FileSystem.rename = function(path,newPath) 
  local _hx_1_ret_success, _hx_1_ret_message = _G.os.rename(path, newPath);
  if (not _hx_1_ret_success) then 
    _G.error(__haxe_Exception.thrown(_hx_1_ret_message),0);
  end;
end
__sys_FileSystem.stat = function(path) 
  local _hx_1_ls_result, _hx_1_ls_message = __lua_lib_luv_fs_FileSystem.fs_stat(path);
  if (_hx_1_ls_result == nil) then 
    _G.error(__haxe_Exception.thrown(_hx_1_ls_message),0);
  end;
  local l = _hx_1_ls_result;
  local l1 = l.gid;
  local l2 = l.uid;
  local l3 = l.rdev;
  local l4 = l.size;
  local l5 = l.nlink;
  local t = l.mtime.sec + (l.mtime.nsec / 1000000);
  local d = _hx_e();
  _G.setmetatable(d, _hx_o({__fields__={__index=true},__index=Date.prototype}));
  d.t = t / 1000;
  d.d = _G.os.date("*t", Std.int(d.t));
  d.dUTC = _G.os.date("!*t", Std.int(d.t));
  local l6 = l.mode;
  local l7 = l.ino;
  local l8 = l.dev;
  local t = l.ctime.sec + (l.ctime.nsec / 1000000);
  local d1 = _hx_e();
  _G.setmetatable(d1, _hx_o({__fields__={__index=true},__index=Date.prototype}));
  d1.t = t / 1000;
  d1.d = _G.os.date("*t", Std.int(d1.t));
  d1.dUTC = _G.os.date("!*t", Std.int(d1.t));
  local t = l.atime.sec + (l.atime.nsec / 1000000);
  local d2 = _hx_e();
  _G.setmetatable(d2, _hx_o({__fields__={__index=true},__index=Date.prototype}));
  d2.t = t / 1000;
  d2.d = _G.os.date("*t", Std.int(d2.t));
  d2.dUTC = _G.os.date("!*t", Std.int(d2.t));
  do return _hx_o({__fields__={gid=true,uid=true,rdev=true,size=true,nlink=true,mtime=true,mode=true,ino=true,dev=true,ctime=true,atime=true},gid=l1,uid=l2,rdev=l3,size=l4,nlink=l5,mtime=d,mode=l6,ino=l7,dev=l8,ctime=d1,atime=d2}) end;
end
__sys_FileSystem.fullPath = function(relPath) 
  local tmp;
  if (__haxe_io_Path.isAbsolute(relPath)) then 
    tmp = relPath;
  else
    local pwd = __lua_lib_luv_Misc.cwd();
    tmp = (function() 
      local _hx_1
      if (pwd == nil) then 
      _hx_1 = relPath; else 
      _hx_1 = __haxe_io_Path.join(_hx_tab_array({[0]=pwd, relPath}, 2)); end
      return _hx_1
    end )();
  end;
  do return __lua_lib_luv_fs_FileSystem.fs_realpath(__haxe_io_Path.normalize(tmp)) end;
end
__sys_FileSystem.absolutePath = function(relPath) 
  if (__haxe_io_Path.isAbsolute(relPath)) then 
    do return relPath end;
  end;
  local pwd = __lua_lib_luv_Misc.cwd();
  if (pwd == nil) then 
    do return relPath end;
  end;
  do return __haxe_io_Path.join(_hx_tab_array({[0]=pwd, relPath}, 2)) end;
end
__sys_FileSystem.deleteFile = function(path) 
  local _hx_1_ret_success, _hx_1_ret_message = _G.os.remove(path);
  if (not _hx_1_ret_success) then 
    _G.error(__haxe_Exception.thrown(_hx_1_ret_message),0);
  end;
end
__sys_FileSystem.readDirectory = function(path) 
  local scandir = __lua_lib_luv_fs_FileSystem.fs_scandir(path);
  local itr = function() 
    local next = __lua_lib_luv_fs_FileSystem.fs_scandir_next(scandir);
    do return next end;
  end;
  do return __lua_Lib.fillArray(itr) end;
end
__sys_FileSystem.isDirectory = function(path) 
  local result = __lua_lib_luv_fs_FileSystem.fs_stat(path);
  if (result == nil) then 
    do return false end;
  else
    do return result.type == "directory" end;
  end;
end
__sys_FileSystem.deleteDirectory = function(path) 
  local _hx_1_ret_result, _hx_1_ret_message = __lua_lib_luv_fs_FileSystem.fs_rmdir(path);
  if (_hx_1_ret_result == nil) then 
    _G.error(__haxe_Exception.thrown(_hx_1_ret_message),0);
  end;
end
__sys_FileSystem.createDirectory = function(path) 
  local path = __haxe_io_Path.addTrailingSlash(path);
  local _p = nil;
  local parts = _hx_tab_array({}, 0);
  while (true) do 
    _p = __haxe_io_Path.directory(path);
    if (not (path ~= _p)) then 
      break;
    end;
    parts:unshift(path);
    path = _p;
  end;
  local _g = 0;
  while (_g < parts.length) do 
    local part = parts[_g];
    _g = _g + 1;
    if (((__lua_lib_luautf8_Utf8.byte(part, (__lua_lib_luautf8_Utf8.len(part) - 1) + 1) ~= 58) and not __sys_FileSystem.exists(part)) and not __lua_lib_luv_fs_FileSystem.fs_mkdir(part, 511)) then 
      _G.error(__haxe_Exception.thrown(Std.string("Could not create directory:") .. Std.string(part)),0);
    end;
  end;
end

__sys_io_FileInput.new = function(f) 
  local self = _hx_new(__sys_io_FileInput.prototype)
  __sys_io_FileInput.super(self,f)
  return self
end
__sys_io_FileInput.super = function(self,f) 
  if (f == nil) then 
    _G.error(__haxe_Exception.thrown(Std.string("Invalid filehandle : ") .. Std.string(Std.string(f))),0);
  end;
  self:set_bigEndian(__lua_Boot.platformBigEndian);
  self.f = f;
  self._eof = false;
end
_hxClasses["sys.io.FileInput"] = __sys_io_FileInput
__sys_io_FileInput.__name__ = "sys.io.FileInput"
__sys_io_FileInput.prototype = _hx_e();
__sys_io_FileInput.prototype.f= nil;
__sys_io_FileInput.prototype._eof= nil;
__sys_io_FileInput.prototype.seek = function(self,p,pos) 
  local arg;
  local arg1 = pos[1];
  if (arg1) == 0 then 
    arg = "set";
  elseif (arg1) == 1 then 
    arg = "cur";
  elseif (arg1) == 2 then 
    arg = "end"; end;
  self._eof = false;
  self.f:seek(arg, p);
end
__sys_io_FileInput.prototype.tell = function(self) 
  do return self.f:seek() end
end
__sys_io_FileInput.prototype.eof = function(self) 
  do return self._eof end
end
__sys_io_FileInput.prototype.readByte = function(self) 
  local byte = self.f:read(1);
  if (byte == nil) then 
    self._eof = true;
    _G.error(__haxe_Exception.thrown(__haxe_io_Eof.new()),0);
  end;
  do return _G.string.byte(byte) end
end
__sys_io_FileInput.prototype.readBytes = function(self,s,pos,len) 
  if (self._eof) then 
    _G.error(__haxe_Exception.thrown(__haxe_io_Eof.new()),0);
  end;
  do return __haxe_io_Input.prototype.readBytes(self,s,pos,len) end
end
__sys_io_FileInput.prototype.close = function(self) 
  self.f:close();
end
__sys_io_FileInput.prototype.readAll = function(self,bufsize) 
  if (bufsize == nil) then 
    bufsize = 16384;
  end;
  local buf = __haxe_io_Bytes.alloc(bufsize);
  local total = __haxe_io_BytesBuffer.new();
  local _hx_status, _hx_result = pcall(function() 
  
      while (true) do 
        local len = self:readBytes(buf, 0, bufsize);
        if (len == 0) then 
          break;
        end;
        if ((len < 0) or (len > buf.length)) then 
          _G.error(__haxe_Exception.thrown(__haxe_io_Error.OutsideBounds),0);
        end;
        local b1 = total.b;
        local b2 = buf.b;
        local _g = 0;
        local _g1 = len;
        while (_g < _g1) do 
          _g = _g + 1;
          local i = _g - 1;
          total.b:push(b2[i]);
        end;
      end;
    return _hx_pcall_default
  end)
  if not _hx_status and _hx_result == "_hx_pcall_break" then
  elseif not _hx_status then 
    local _g = _hx_result;
    if (__lua_Boot.__instanceof(__haxe_Exception.caught(_g):unwrap(), __haxe_io_Eof)) then 
      self._eof = true;
    else
      _G.error(_g,0);
    end;
  elseif _hx_result ~= _hx_pcall_default then
    return _hx_result
  end;
  do return total:getBytes() end
end

__sys_io_FileInput.prototype.__class__ =  __sys_io_FileInput
__sys_io_FileInput.__super__ = __haxe_io_Input
setmetatable(__sys_io_FileInput.prototype,{__index=__haxe_io_Input.prototype})
setmetatable(__sys_io_FileInput.prototype.__properties__,{__index=__haxe_io_Input.prototype.__properties__})

__sys_io_FileOutput.new = function(f) 
  local self = _hx_new(__sys_io_FileOutput.prototype)
  __sys_io_FileOutput.super(self,f)
  return self
end
__sys_io_FileOutput.super = function(self,f) 
  if (f == nil) then 
    _G.error(__haxe_Exception.thrown(Std.string("Invalid filehandle : ") .. Std.string(Std.string(f))),0);
  end;
  self.f = f;
end
_hxClasses["sys.io.FileOutput"] = __sys_io_FileOutput
__sys_io_FileOutput.__name__ = "sys.io.FileOutput"
__sys_io_FileOutput.prototype = _hx_e();
__sys_io_FileOutput.prototype.f= nil;
__sys_io_FileOutput.prototype.seek = function(self,p,pos) 
  local arg;
  local arg1 = pos[1];
  if (arg1) == 0 then 
    arg = "set";
  elseif (arg1) == 1 then 
    arg = "cur";
  elseif (arg1) == 2 then 
    arg = "end"; end;
  self.f:seek(arg, p);
end
__sys_io_FileOutput.prototype.tell = function(self) 
  do return self.f:seek() end
end
__sys_io_FileOutput.prototype.writeByte = function(self,c) 
  self.f:write(__lua_lib_luautf8_Utf8.char(c));
end
__sys_io_FileOutput.prototype.writeBytes = function(self,s,pos,len) 
  self.f:write(s:getString(pos, len));
  do return s.length end
end
__sys_io_FileOutput.prototype.close = function(self) 
  self.f:close();
end

__sys_io_FileOutput.prototype.__class__ =  __sys_io_FileOutput
__sys_io_FileOutput.__super__ = __haxe_io_Output
setmetatable(__sys_io_FileOutput.prototype,{__index=__haxe_io_Output.prototype})
setmetatable(__sys_io_FileOutput.prototype.__properties__,{__index=__haxe_io_Output.prototype.__properties__})
_hxClasses["sys.io.FileSeek"] = __sys_io_FileSeek;
_hxClasses["sys.io.FileSeek"] = { __ename__ = "sys.io.FileSeek", __constructs__ = _hx_tab_array({[0]="SeekBegin","SeekCur","SeekEnd"},3)}
__sys_io_FileSeek = _hxClasses["sys.io.FileSeek"];
__sys_io_FileSeek.SeekBegin = _hx_tab_array({[0]="SeekBegin",0,__enum__ = __sys_io_FileSeek},2)

__sys_io_FileSeek.SeekCur = _hx_tab_array({[0]="SeekCur",1,__enum__ = __sys_io_FileSeek},2)

__sys_io_FileSeek.SeekEnd = _hx_tab_array({[0]="SeekEnd",2,__enum__ = __sys_io_FileSeek},2)

__sys_io_FileSeek.__empty_constructs__ = _hx_tab_array({[0] = __sys_io_FileSeek.SeekBegin,__sys_io_FileSeek.SeekCur,__sys_io_FileSeek.SeekEnd}, 3)

__sys_io_Process.new = function(cmd,args,detached) 
  local self = _hx_new(__sys_io_Process.prototype)
  __sys_io_Process.super(self,cmd,args,detached)
  return self
end
__sys_io_Process.super = function(self,cmd,args,detached) 
  local _gthis = self;
  if (detached) then 
    _G.error(__haxe_Exception.thrown("Detached process is not supported on this platform"),0);
  end;
  local _stdout = __lua_lib_luv_Pipe.new_pipe(false);
  local _stderr = __lua_lib_luv_Pipe.new_pipe(false);
  local _stdin = __lua_lib_luv_Pipe.new_pipe(false);
  self.stdout = __sys_io__Process_ProcessInput.new(_stdout);
  self.stderr = __sys_io__Process_ProcessInput.new(_stderr);
  self.stdin = __sys_io__Process_ProcessOutput.new(_stdin);
  local stdio = ({_stdin,_stdout,_stderr});
  local opt = _hx_o({__fields__={args=true,stdio=true},args=__sys_io_Process.setArgs(cmd, args),stdio=stdio});
  local _hx_1_p_handle, _hx_1_p_pid = __lua_lib_luv_Process.spawn(__sys_io_Process._shell, opt, function(code,signal) 
    _gthis._code = code;
    if (not _gthis._handle:is_closing()) then 
      _gthis._handle:close();
    end;
    _stdin:shutdown(function() 
      _stdin:close();
    end);
    _stderr:shutdown(function() 
      _stderr:close();
    end);
    _stdout:shutdown(function() 
      _stdout:close();
    end);
  end);
  self._handle = _hx_1_p_handle;
  if (_hx_1_p_handle == nil) then 
    _G.error(__haxe_Exception.thrown(_hx_1_p_pid),0);
  end;
  self._pid = _hx_1_p_pid;
end
_hxClasses["sys.io.Process"] = __sys_io_Process
__sys_io_Process.__name__ = "sys.io.Process"
__sys_io_Process.setArgs = function(cmd,args) 
  local pargs = ({});
  local idx = 1;
  if (__sys_FileSystem.exists(cmd)) then 
    cmd = Std.string(Std.string("\"") .. Std.string(cmd)) .. Std.string("\"");
  end;
  local all = _hx_tab_array({[0]=cmd}, 1);
  if (args ~= nil) then 
    local _g = 0;
    while (_g < args.length) do 
      local a = args[_g];
      _g = _g + 1;
      all:push(__sys_io_Process.argQuote(a));
    end;
  end;
  if (Sys.systemName() == "Windows") then 
    idx = idx + 1;
    pargs[idx - 1] = "/s";
    idx = idx + 1;
    pargs[idx - 1] = "/c";
    idx = idx + 1;
    pargs[idx - 1] = all:join(" ");
  else
    idx = idx + 1;
    pargs[idx - 1] = "-c";
    idx = idx + 1;
    pargs[idx - 1] = all:join(" ");
  end;
  do return pargs end;
end
__sys_io_Process.prototype = _hx_e();
__sys_io_Process.prototype._pid= nil;
__sys_io_Process.prototype._handle= nil;
__sys_io_Process.prototype._code= nil;
__sys_io_Process.prototype.closef= nil;
__sys_io_Process.prototype.stdout= nil;
__sys_io_Process.prototype.stderr= nil;
__sys_io_Process.prototype.stdin= nil;
__sys_io_Process.prototype.getPid = function(self) 
  do return self._pid end
end
__sys_io_Process.prototype.close = function(self) 
  if (not self._handle:is_closing()) then 
    self._handle:close();
  end;
end
__sys_io_Process.prototype.exitCode = function(self,block) 
  if (block == nil) then 
    block = true;
  end;
  if (not block) then 
    do return self._code end;
  end;
  while (self._handle:is_active()) do 
    __lua_lib_luv_Loop.run();
  end;
  do return self._code end
end
__sys_io_Process.prototype.kill = function(self) 
  self._handle:kill("sigterm");
end

__sys_io_Process.prototype.__class__ =  __sys_io_Process

__sys_io__Process_ProcessInput.new = function(pipe) 
  local self = _hx_new(__sys_io__Process_ProcessInput.prototype)
  __sys_io__Process_ProcessInput.super(self,pipe)
  return self
end
__sys_io__Process_ProcessInput.super = function(self,pipe) 
  self.b = pipe;
  self._eof = false;
end
_hxClasses["sys.io._Process.ProcessInput"] = __sys_io__Process_ProcessInput
__sys_io__Process_ProcessInput.__name__ = "sys.io._Process.ProcessInput"
__sys_io__Process_ProcessInput.prototype = _hx_e();
__sys_io__Process_ProcessInput.prototype.b= nil;
__sys_io__Process_ProcessInput.prototype.buf= nil;
__sys_io__Process_ProcessInput.prototype.idx= nil;
__sys_io__Process_ProcessInput.prototype._eof= nil;
__sys_io__Process_ProcessInput.prototype.eof = function(self) 
  do return self._eof end
end
__sys_io__Process_ProcessInput.prototype.readBytes = function(self,s,pos,len) 
  if (self._eof) then 
    _G.error(__haxe_Exception.thrown(__haxe_io_Eof.new()),0);
  end;
  do return __haxe_io_Input.prototype.readBytes(self,s,pos,len) end
end
__sys_io__Process_ProcessInput.prototype.readByte = function(self) 
  local _gthis = self;
  local err_str = nil;
  if ((self.buf == nil) or (self.idx >= _G.string.len(self.buf))) then 
    self.buf = nil;
    self.idx = 0;
    local pending = true;
    self.b:read_start(function(err,chunk) 
      if (chunk ~= nil) then 
        if (_gthis.buf ~= nil) then 
          _gthis.buf = Std.string(_gthis.buf) .. Std.string(chunk);
        else
          _gthis.buf = chunk;
        end;
      end;
      if (err ~= nil) then 
        err_str = err;
      end;
      pending = false;
    end);
    while (pending) do 
      __lua_lib_luv_Loop.run();
    end;
  end;
  if (self.buf == nil) then 
    self._eof = true;
    _G.error(__haxe_Exception.thrown(__haxe_io_Eof.new()),0);
  end;
  if (err_str ~= nil) then 
    _G.error(__haxe_Exception.thrown(err_str),0);
  end;
  local code = _G.string.byte(self.buf, (function() 
  local _hx_obj = self;
  local _hx_fld = 'idx';
  _hx_obj[_hx_fld] = _hx_obj[_hx_fld]  + 1;
   return _hx_obj[_hx_fld];
   end)());
  do return code end
end
__sys_io__Process_ProcessInput.prototype.readAll = function(self,bufsize) 
  if (bufsize == nil) then 
    bufsize = 16384;
  end;
  local buf = __haxe_io_Bytes.alloc(bufsize);
  local total = __haxe_io_BytesBuffer.new();
  local _hx_status, _hx_result = pcall(function() 
  
      while (true) do 
        local len = self:readBytes(buf, 0, bufsize);
        if (len ~= 0) then 
          if ((len < 0) or (len > buf.length)) then 
            _G.error(__haxe_Exception.thrown(__haxe_io_Error.OutsideBounds),0);
          end;
          local b1 = total.b;
          local b2 = buf.b;
          local _g = 0;
          local _g1 = len;
          while (_g < _g1) do 
            _g = _g + 1;
            local i = _g - 1;
            total.b:push(b2[i]);
          end;
        end;
        if (len < bufsize) then 
          break;
        end;
      end;
    return _hx_pcall_default
  end)
  if not _hx_status and _hx_result == "_hx_pcall_break" then
  elseif not _hx_status then 
    local _g = _hx_result;
    if (__lua_Boot.__instanceof(__haxe_Exception.caught(_g):unwrap(), __haxe_io_Eof)) then 
      self._eof = true;
    else
      _G.error(_g,0);
    end;
  elseif _hx_result ~= _hx_pcall_default then
    return _hx_result
  end;
  do return total:getBytes() end
end
__sys_io__Process_ProcessInput.prototype.close = function(self) 
  self.b:close();
end

__sys_io__Process_ProcessInput.prototype.__class__ =  __sys_io__Process_ProcessInput
__sys_io__Process_ProcessInput.__super__ = __haxe_io_Input
setmetatable(__sys_io__Process_ProcessInput.prototype,{__index=__haxe_io_Input.prototype})
setmetatable(__sys_io__Process_ProcessInput.prototype.__properties__,{__index=__haxe_io_Input.prototype.__properties__})

__sys_io__Process_ProcessOutput.new = function(pipe) 
  local self = _hx_new(__sys_io__Process_ProcessOutput.prototype)
  __sys_io__Process_ProcessOutput.super(self,pipe)
  return self
end
__sys_io__Process_ProcessOutput.super = function(self,pipe) 
  self.b = pipe;
  self:set_bigEndian(__lua_Boot.platformBigEndian);
end
_hxClasses["sys.io._Process.ProcessOutput"] = __sys_io__Process_ProcessOutput
__sys_io__Process_ProcessOutput.__name__ = "sys.io._Process.ProcessOutput"
__sys_io__Process_ProcessOutput.prototype = _hx_e();
__sys_io__Process_ProcessOutput.prototype.b= nil;
__sys_io__Process_ProcessOutput.prototype.writeByte = function(self,c) 
  self.b:write(_G.string.char(c));
end
__sys_io__Process_ProcessOutput.prototype.close = function(self) 
  self.b:close();
end

__sys_io__Process_ProcessOutput.prototype.__class__ =  __sys_io__Process_ProcessOutput
__sys_io__Process_ProcessOutput.__super__ = __haxe_io_Output
setmetatable(__sys_io__Process_ProcessOutput.prototype,{__index=__haxe_io_Output.prototype})
setmetatable(__sys_io__Process_ProcessOutput.prototype.__properties__,{__index=__haxe_io_Output.prototype.__properties__})

__xrfragment_Query.new = function(str) 
  local self = _hx_new(__xrfragment_Query.prototype)
  __xrfragment_Query.super(self,str)
  return self
end
__xrfragment_Query.super = function(self,str) 
  self.preset = "";
  self.accept = false;
  self.exclude = Array.new();
  self.include = Array.new();
  self.q = _hx_e();
  self.str = "";
  if (str ~= nil) then 
    self:parse(str);
  end;
end
_hx_exports["xrfragment"]["Query"] = __xrfragment_Query
_hxClasses["xrfragment.Query"] = __xrfragment_Query
__xrfragment_Query.__name__ = "xrfragment.Query"
__xrfragment_Query.prototype = _hx_e();
__xrfragment_Query.prototype.str= nil;
__xrfragment_Query.prototype.q= nil;
__xrfragment_Query.prototype.include= nil;
__xrfragment_Query.prototype.exclude= nil;
__xrfragment_Query.prototype.accept= nil;
__xrfragment_Query.prototype.preset= nil;
__xrfragment_Query.prototype.toObject = function(self) 
  do return self.q end
end
__xrfragment_Query.prototype.qualify = function(self,nodename) 
  if (self.q.copy_all) then 
    self.accept = true;
  end;
  if (self.include:contains(nodename)) then 
    self.accept = true;
  end;
  if (self.exclude:contains(nodename)) then 
    self.accept = false;
  end;
  do return self.accept end
end
__xrfragment_Query.prototype.parse = function(self,str,recurse) 
  if (recurse == nil) then 
    recurse = false;
  end;
  local _gthis = self;
  local copyAll;
  if (recurse) then 
    copyAll = self.q.copy_all;
  else
    local copyAll1;
    local pos = 0;
    local len = 1;
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
    if (__lua_lib_luautf8_Utf8.sub(str, pos + 1, pos + len) ~= "-") then 
      local pos = 0;
      local len = 1;
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
      copyAll1 = __lua_lib_luautf8_Utf8.sub(str, pos + 1, pos + len) == "?";
    else
      copyAll1 = true;
    end;
    copyAll = copyAll1 or (str == "");
  end;
  local isOr = EReg.new("^or$", "");
  local isProp = EReg.new(".*:[><=!]?", "");
  local isName = EReg.new("[^:/]", "");
  local isExclude = EReg.new("^-", "");
  local isInclude = EReg.new("^\\+", "");
  local isPreset = EReg.new("^\\?", "");
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
  local ors = Array.new();
  local q = _hx_e();
  local composeQuery = function() 
    q = _hx_e();
    local value = Array.new();
    q.object = value;
    local value = Array.new();
    q["-object"] = value;
    ors:push(q);
    do return q end;
  end;
  composeQuery();
  local match = nil;
  match = function(str,prefix) 
    if (prefix == nil) then 
      prefix = "";
    end;
    if (isPreset:match(str) and not recurse) then 
      _gthis.preset = str;
      do return end;
    end;
    if (isExclude:match(str) or isInclude:match(str)) then 
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
      local t = __lua_lib_luautf8_Utf8.sub(str, pos + 1, pos + len);
      local pos = 0;
      local len = 1;
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
      match(t, __lua_lib_luautf8_Utf8.sub(str, pos + 1, pos + len));
      do return end;
    end;
    if (isProp:match(str)) then 
      local skip = 0;
      local type = "=";
      local startIndex = nil;
      if (startIndex == nil) then 
        startIndex = 1;
      else
        startIndex = startIndex + 1;
      end;
      local r = __lua_lib_luautf8_Utf8.find(str, "*", startIndex, true);
      if ((function() 
        local _hx_1
        if ((r ~= nil) and (r > 0)) then 
        _hx_1 = r - 1; else 
        _hx_1 = -1; end
        return _hx_1
      end )() ~= -1) then 
        type = "*";
      end;
      local startIndex = nil;
      if (startIndex == nil) then 
        startIndex = 1;
      else
        startIndex = startIndex + 1;
      end;
      local r = __lua_lib_luautf8_Utf8.find(str, ">", startIndex, true);
      if ((function() 
        local _hx_2
        if ((r ~= nil) and (r > 0)) then 
        _hx_2 = r - 1; else 
        _hx_2 = -1; end
        return _hx_2
      end )() ~= -1) then 
        type = ">";
      end;
      local startIndex = nil;
      if (startIndex == nil) then 
        startIndex = 1;
      else
        startIndex = startIndex + 1;
      end;
      local r = __lua_lib_luautf8_Utf8.find(str, "<", startIndex, true);
      if ((function() 
        local _hx_3
        if ((r ~= nil) and (r > 0)) then 
        _hx_3 = r - 1; else 
        _hx_3 = -1; end
        return _hx_3
      end )() ~= -1) then 
        type = "<";
      end;
      local startIndex = nil;
      if (startIndex == nil) then 
        startIndex = 1;
      else
        startIndex = startIndex + 1;
      end;
      local r = __lua_lib_luautf8_Utf8.find(str, "!=", startIndex, true);
      if ((function() 
        local _hx_4
        if ((r ~= nil) and (r > 0)) then 
        _hx_4 = r - 1; else 
        _hx_4 = -1; end
        return _hx_4
      end )() ~= -1) then 
        type = "!=";
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
        type = ">=";
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
        type = "<=";
      end;
      if (type ~= "=") then 
        skip = skip + __lua_lib_luautf8_Utf8.len(type);
      end;
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
      local property = ret[0];
      local value;
      if (Reflect.field(q, Std.string(prefix) .. Std.string(property))) then 
        value = Reflect.field(q, Std.string(prefix) .. Std.string(property));
      else
        value = _hx_e();
      end;
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
      local _this = ret[1];
      local pos = skip;
      local len = nil;
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
      local value1 = __lua_lib_luautf8_Utf8.sub(_this, pos + 1, pos + len);
      value[type] = value1;
      q[Std.string(prefix) .. Std.string(property)] = value;
      do return end;
    end;
    if (isName:match(str)) then 
      if (prefix == "-") then 
        Reflect.field(q, "-object"):push(str);
        while (Reflect.field(q, "object"):contains(str) == true) do 
          Reflect.field(q, "object"):remove(str);
        end;
      else
        Reflect.field(q, "object"):push(str);
        while (Reflect.field(q, "-object"):contains(str) == true) do 
          Reflect.field(q, "-object"):remove(str);
        end;
      end;
      do return end;
    end;
  end;
  local _g = 0;
  local _g1 = token.length;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    if (isOr:match(token[i])) then 
      composeQuery();
    else
      match(token[i]);
    end;
  end;
  local _g = 0;
  local _g1 = ors.length;
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    local _or = ors[i];
    if (Reflect.field(_or, "object") ~= nil) then 
      self.include = self.include:concat(Reflect.field(_or, "object"));
    end;
    if (Reflect.field(_or, "-object") ~= nil) then 
      self.exclude = self.exclude:concat(Reflect.field(_or, "-object"));
    end;
  end;
  self.q = _hx_o({__fields__={['or']=true,copy_all=true},['or']=ors,copy_all=copyAll});
  do return self.q end
end
__xrfragment_Query.prototype.test = function(self,property,value) 
  if (self.preset == property) then 
    self:parse(value, true);
  end;
  local _g = 0;
  local _g1 = _hx_wrap_if_string_field(self.q["or"],'length');
  while (_g < _g1) do 
    _g = _g + 1;
    local i = _g - 1;
    local _or = self.q["or"][i];
    local conds = _hx_tab_array({[0]=0}, 1);
    local fails = _hx_tab_array({[0]=0}, 1);
    local pass = 0;
    local when = (function(fails,conds) 
      do return function(expr) 
        local conds = conds;
        local when = 0;
        conds[when] = conds[when] + 1;
        local fails = fails;
        local when = 0;
        fails[when] = fails[when] + (function() 
          local _hx_1
          if (expr) then 
          _hx_1 = 0; else 
          _hx_1 = 1; end
          return _hx_1
        end )();
        do return expr end;
      end end;
    end)(fails, conds);
    local _g = 0;
    local _g1 = Reflect.fields(_or);
    local _hx_continue_2 = false;
    while (_g < _g1.length) do repeat 
      local k = _g1[_g];
      _g = _g + 1;
      local orval = Reflect.field(_or, k);
      if (k ~= property) then 
        break;
      end;
      if ((Reflect.field(orval, "=") ~= nil) and when(value == Reflect.field(orval, "="))) then 
        pass = pass + 1;
      end;
      if ((Reflect.field(orval, "*") ~= nil) and when(value ~= nil)) then 
        pass = pass + 1;
      end;
      if ((Reflect.field(orval, ">") ~= nil) and when(value > Std.parseInt(Reflect.field(orval, ">")))) then 
        pass = pass + 1;
      end;
      if ((Reflect.field(orval, "<") ~= nil) and when(value < Std.parseInt(Reflect.field(orval, "<")))) then 
        pass = pass + 1;
      end;
      if ((Reflect.field(orval, ">=") ~= nil) and when(value >= Std.parseInt(Reflect.field(orval, ">=")))) then 
        pass = pass + 1;
      end;
      if ((Reflect.field(orval, "<=") ~= nil) and when(value >= Std.parseInt(Reflect.field(orval, "<=")))) then 
        pass = pass + 1;
      end;
      if ((Reflect.field(orval, "!=") ~= nil) and when(value ~= Std.parseInt(Reflect.field(orval, "!=")))) then 
        pass = pass + 1;
      end;until true
      if _hx_continue_2 then 
      _hx_continue_2 = false;
      break;
      end;
      
    end;
    if ((self.accept and (conds[0] > 0)) and (fails[0] > 0)) then 
      self.accept = false;
    end;
    if (((conds[0] > 0) and (pass > 0)) and (fails[0] == 0)) then 
      self.accept = true;
    end;
  end;
end

__xrfragment_Query.prototype.__class__ =  __xrfragment_Query
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
  String.__name__ = "String";
  _hxClasses.Array = Array;
  Array.__name__ = "Array";EReg.FLAGS = __lua_lib_lrexlib_Rex.flags();
  
  EReg.escapeRegExpRe = EReg.new("[\\[\\]{}()*+?.\\\\\\^$|]", "g");
  
  __haxe_SysTools.winMetaCharacters = _hx_tab_array({[0]=32, 40, 41, 37, 33, 94, 34, 60, 62, 38, 124, 10, 13, 44, 59}, 15);
  
  StringTools.winMetaCharacters = __haxe_SysTools.winMetaCharacters;
  
  __haxe_ds_IntMap.tnull = ({});
  
  __haxe_ds_ObjectMap.count = 0;
  
  __haxe_ds_StringMap.tnull = ({});
  
  __haxe_io_FPHelper.i64tmp = (function() 
    local _hx_2
    
    local this1 = __haxe__Int64____Int64.new(__haxe__Int32_Int32_Impl_.shr(0, 31), 0);
    
    _hx_2 = this1;
    return _hx_2
  end )();
  
  __haxe_io_FPHelper.LN2 = 0.6931471805599453;
  
  __lua_Boot._fid = 0;
  
  __lua_Boot.Max_Int32 = 2147483647;
  
  __lua_Boot.Min_Int32 = -2147483648;
  
  __lua_Boot.MAXSTACKSIZE = 1000;
  
  __lua_Boot.platformBigEndian = _G.string.byte(_G.string.dump(function() 
  end), 7) > 0;
  
  __lua_Boot.hiddenFields = {__id__=true, hx__closures=true, super=true, prototype=true, __fields__=true, __ifields__=true, __class__=true, __properties__=true}
  
  __lua__Io_IoType_Impl_.File = "file";
  
  __lua__Io_IoType_Impl_.ClosedFile = "closed file";
  
  __lua__Io_IoType_Impl_.NotAFile = nil;
  
  __sys_io_Process.argQuote = (function() 
    local _hx_3
    if (Sys.systemName() == "Windows") then 
    _hx_3 = function(x) 
      do return __haxe_SysTools.quoteWinArg(x, true) end;
    end; else 
    _hx_3 = __haxe_SysTools.quoteUnixArg; end
    return _hx_3
  end )();
  
  __sys_io_Process._shell = (function() 
    local _hx_4
    if (Sys.systemName() == "Windows") then 
    _hx_4 = "cmd.exe"; else 
    _hx_4 = "/bin/sh"; end
    return _hx_4
  end )();
  
  
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

_hx_funcToField = function(f)
  if type(f) == 'function' then
    return function(self,...)
      return f(...)
    end
  else
    return f
  end
end

_G.math.randomseed(_G.os.time());

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
