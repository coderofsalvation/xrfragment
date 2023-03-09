import sys

import math as python_lib_Math
import math as Math
from os import path as python_lib_os_Path
import inspect as python_lib_Inspect
import sys as python_lib_Sys
import functools as python_lib_Functools
try:
    import msvcrt as python_lib_Msvcrt
except:
    pass
import os as python_lib_Os
import random as python_lib_Random
import re as python_lib_Re
import subprocess as python_lib_Subprocess
try:
    import termios as python_lib_Termios
except:
    pass
import time as python_lib_Time
import timeit as python_lib_Timeit
import traceback as python_lib_Traceback
try:
    import tty as python_lib_Tty
except:
    pass
from datetime import datetime as python_lib_datetime_Datetime
from datetime import timedelta as python_lib_datetime_Timedelta
from datetime import tzinfo as python_lib_datetime_Tzinfo
from datetime import timezone as python_lib_datetime_Timezone
from io import IOBase as python_lib_io_IOBase
from io import BufferedIOBase as python_lib_io_BufferedIOBase
from io import RawIOBase as python_lib_io_RawIOBase
from io import FileIO as python_lib_io_FileIO
from io import TextIOBase as python_lib_io_TextIOBase
from io import StringIO as python_lib_io_StringIO
from time import struct_time as python_lib_time_StructTime
import urllib.parse as python_lib_urllib_Parse


class _hx_AnonObject:
    _hx_disable_getattr = False
    def __init__(self, fields):
        self.__dict__ = fields
    def __repr__(self):
        return repr(self.__dict__)
    def __contains__(self, item):
        return item in self.__dict__
    def __getitem__(self, item):
        return self.__dict__[item]
    def __getattr__(self, name):
        if (self._hx_disable_getattr):
            raise AttributeError('field does not exist')
        else:
            return None
    def _hx_hasattr(self,field):
        self._hx_disable_getattr = True
        try:
            getattr(self, field)
            self._hx_disable_getattr = False
            return True
        except AttributeError:
            self._hx_disable_getattr = False
            return False



class Enum:
    _hx_class_name = "Enum"
    __slots__ = ("tag", "index", "params")
    _hx_fields = ["tag", "index", "params"]
    _hx_methods = ["__str__"]

    def __init__(self,tag,index,params):
        self.tag = tag
        self.index = index
        self.params = params

    def __str__(self):
        if (self.params is None):
            return self.tag
        else:
            return self.tag + '(' + (', '.join(str(v) for v in self.params)) + ')'

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.tag = None
        _hx_o.index = None
        _hx_o.params = None


class Class: pass


class Date:
    _hx_class_name = "Date"
    __slots__ = ("date", "dateUTC")
    _hx_fields = ["date", "dateUTC"]
    _hx_methods = ["getTime", "getHours", "getMinutes", "getSeconds", "getFullYear", "getMonth", "getDate", "getDay", "getUTCHours", "getUTCMinutes", "getUTCSeconds", "getUTCFullYear", "getUTCMonth", "getUTCDate", "getUTCDay", "getTimezoneOffset", "toString"]
    _hx_statics = ["now", "fromTime", "makeLocal", "UTC", "fromString"]

    def __init__(self,year,month,day,hour,_hx_min,sec):
        self.dateUTC = None
        if (year < python_lib_datetime_Datetime.min.year):
            year = python_lib_datetime_Datetime.min.year
        if (day == 0):
            day = 1
        self.date = Date.makeLocal(python_lib_datetime_Datetime(year,(month + 1),day,hour,_hx_min,sec,0))
        self.dateUTC = self.date.astimezone(python_lib_datetime_Timezone.utc)

    def getTime(self):
        return (self.date.timestamp() * 1000)

    def getHours(self):
        return self.date.hour

    def getMinutes(self):
        return self.date.minute

    def getSeconds(self):
        return self.date.second

    def getFullYear(self):
        return self.date.year

    def getMonth(self):
        return (self.date.month - 1)

    def getDate(self):
        return self.date.day

    def getDay(self):
        return HxOverrides.mod(self.date.isoweekday(), 7)

    def getUTCHours(self):
        return self.dateUTC.hour

    def getUTCMinutes(self):
        return self.dateUTC.minute

    def getUTCSeconds(self):
        return self.dateUTC.second

    def getUTCFullYear(self):
        return self.dateUTC.year

    def getUTCMonth(self):
        return (self.dateUTC.month - 1)

    def getUTCDate(self):
        return self.dateUTC.day

    def getUTCDay(self):
        return HxOverrides.mod(self.dateUTC.isoweekday(), 7)

    def getTimezoneOffset(self):
        x = (self.date.utcoffset() / python_lib_datetime_Timedelta(0,60))
        tmp = None
        try:
            tmp = int(x)
        except BaseException as _g:
            None
            tmp = None
        return -tmp

    def toString(self):
        return self.date.strftime("%Y-%m-%d %H:%M:%S")

    @staticmethod
    def now():
        d = Date(2000,0,1,0,0,0)
        d.date = Date.makeLocal(python_lib_datetime_Datetime.now())
        d.dateUTC = d.date.astimezone(python_lib_datetime_Timezone.utc)
        return d

    @staticmethod
    def fromTime(t):
        d = Date(2000,0,1,0,0,0)
        d.date = Date.makeLocal(python_lib_datetime_Datetime.fromtimestamp((t / 1000.0)))
        d.dateUTC = d.date.astimezone(python_lib_datetime_Timezone.utc)
        return d

    @staticmethod
    def makeLocal(date):
        try:
            return date.astimezone()
        except BaseException as _g:
            None
            tzinfo = python_lib_datetime_Datetime.now(python_lib_datetime_Timezone.utc).astimezone().tzinfo
            return date.replace(**python__KwArgs_KwArgs_Impl_.fromT(_hx_AnonObject({'tzinfo': tzinfo})))

    @staticmethod
    def UTC(year,month,day,hour,_hx_min,sec):
        return (python_lib_datetime_Datetime(year,(month + 1),day,hour,_hx_min,sec,0,python_lib_datetime_Timezone.utc).timestamp() * 1000)

    @staticmethod
    def fromString(s):
        _g = len(s)
        if (_g == 8):
            k = s.split(":")
            return Date.fromTime((((Std.parseInt((k[0] if 0 < len(k) else None)) * 3600000.) + ((Std.parseInt((k[1] if 1 < len(k) else None)) * 60000.))) + ((Std.parseInt((k[2] if 2 < len(k) else None)) * 1000.))))
        elif (_g == 10):
            k = s.split("-")
            return Date(Std.parseInt((k[0] if 0 < len(k) else None)),(Std.parseInt((k[1] if 1 < len(k) else None)) - 1),Std.parseInt((k[2] if 2 < len(k) else None)),0,0,0)
        elif (_g == 19):
            k = s.split(" ")
            _this = (k[0] if 0 < len(k) else None)
            y = _this.split("-")
            _this = (k[1] if 1 < len(k) else None)
            t = _this.split(":")
            return Date(Std.parseInt((y[0] if 0 < len(y) else None)),(Std.parseInt((y[1] if 1 < len(y) else None)) - 1),Std.parseInt((y[2] if 2 < len(y) else None)),Std.parseInt((t[0] if 0 < len(t) else None)),Std.parseInt((t[1] if 1 < len(t) else None)),Std.parseInt((t[2] if 2 < len(t) else None)))
        else:
            raise haxe_Exception.thrown(("Invalid date format : " + ("null" if s is None else s)))

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.date = None
        _hx_o.dateUTC = None


class EReg:
    _hx_class_name = "EReg"
    __slots__ = ("pattern", "matchObj", "_hx_global")
    _hx_fields = ["pattern", "matchObj", "global"]
    _hx_methods = ["match", "matched", "matchedLeft", "matchedRight", "matchedPos", "matchSub", "split", "replace", "map"]
    _hx_statics = ["escape"]

    def __init__(self,r,opt):
        self.matchObj = None
        self._hx_global = False
        options = 0
        _g = 0
        _g1 = len(opt)
        while (_g < _g1):
            i = _g
            _g = (_g + 1)
            c = (-1 if ((i >= len(opt))) else ord(opt[i]))
            if (c == 109):
                options = (options | python_lib_Re.M)
            if (c == 105):
                options = (options | python_lib_Re.I)
            if (c == 115):
                options = (options | python_lib_Re.S)
            if (c == 117):
                options = (options | python_lib_Re.U)
            if (c == 103):
                self._hx_global = True
        self.pattern = python_lib_Re.compile(r,options)

    def match(self,s):
        self.matchObj = python_lib_Re.search(self.pattern,s)
        return (self.matchObj is not None)

    def matched(self,n):
        return self.matchObj.group(n)

    def matchedLeft(self):
        return HxString.substr(self.matchObj.string,0,self.matchObj.start())

    def matchedRight(self):
        return HxString.substr(self.matchObj.string,self.matchObj.end(),None)

    def matchedPos(self):
        return _hx_AnonObject({'pos': self.matchObj.start(), 'len': (self.matchObj.end() - self.matchObj.start())})

    def matchSub(self,s,pos,_hx_len = None):
        if (_hx_len is None):
            _hx_len = -1
        if (_hx_len != -1):
            self.matchObj = self.pattern.search(s,pos,(pos + _hx_len))
        else:
            self.matchObj = self.pattern.search(s,pos)
        return (self.matchObj is not None)

    def split(self,s):
        if self._hx_global:
            ret = []
            lastEnd = 0
            x = python_HaxeIterator(python_lib_Re.finditer(self.pattern,s))
            while x.hasNext():
                x1 = x.next()
                x2 = HxString.substring(s,lastEnd,x1.start())
                ret.append(x2)
                lastEnd = x1.end()
            x = HxString.substr(s,lastEnd,None)
            ret.append(x)
            return ret
        else:
            self.matchObj = python_lib_Re.search(self.pattern,s)
            if (self.matchObj is None):
                return [s]
            else:
                return [HxString.substring(s,0,self.matchObj.start()), HxString.substr(s,self.matchObj.end(),None)]

    def replace(self,s,by):
        _this = by.split("$$")
        by = "_hx_#repl#__".join([python_Boot.toString1(x1,'') for x1 in _this])
        def _hx_local_0(x):
            res = by
            g = x.groups()
            _g = 0
            _g1 = len(g)
            while (_g < _g1):
                i = _g
                _g = (_g + 1)
                gs = g[i]
                if (gs is None):
                    continue
                delimiter = ("$" + HxOverrides.stringOrNull(str((i + 1))))
                _this = (list(res) if ((delimiter == "")) else res.split(delimiter))
                res = gs.join([python_Boot.toString1(x1,'') for x1 in _this])
            _this = res.split("_hx_#repl#__")
            res = "$".join([python_Boot.toString1(x1,'') for x1 in _this])
            return res
        replace = _hx_local_0
        return python_lib_Re.sub(self.pattern,replace,s,(0 if (self._hx_global) else 1))

    def map(self,s,f):
        buf_b = python_lib_io_StringIO()
        pos = 0
        right = s
        cur = self
        while (pos < len(s)):
            if (self.matchObj is None):
                self.matchObj = python_lib_Re.search(self.pattern,s)
            else:
                self.matchObj = self.matchObj.re.search(s,pos)
            if (self.matchObj is None):
                break
            pos1 = self.matchObj.end()
            curPos_pos = cur.matchObj.start()
            curPos_len = (cur.matchObj.end() - cur.matchObj.start())
            buf_b.write(Std.string(HxString.substr(HxString.substr(cur.matchObj.string,0,cur.matchObj.start()),pos,None)))
            buf_b.write(Std.string(f(cur)))
            right = HxString.substr(cur.matchObj.string,cur.matchObj.end(),None)
            if (not self._hx_global):
                buf_b.write(Std.string(right))
                return buf_b.getvalue()
            if (curPos_len == 0):
                buf_b.write(Std.string(("" if (((pos1 < 0) or ((pos1 >= len(s))))) else s[pos1])))
                right = HxString.substr(right,1,None)
                pos = (pos1 + 1)
            else:
                pos = pos1
        buf_b.write(Std.string(right))
        return buf_b.getvalue()

    @staticmethod
    def escape(s):
        return python_lib_Re.escape(s)

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.pattern = None
        _hx_o.matchObj = None
        _hx_o._hx_global = None


class _EnumValue_EnumValue_Impl_:
    _hx_class_name = "_EnumValue.EnumValue_Impl_"
    __slots__ = ()
    _hx_statics = ["match"]

    @staticmethod
    def match(this1,pattern):
        return False


class IntIterator:
    _hx_class_name = "IntIterator"
    __slots__ = ("min", "max")
    _hx_fields = ["min", "max"]
    _hx_methods = ["hasNext", "next"]

    def __init__(self,_hx_min,_hx_max):
        self.min = _hx_min
        self.max = _hx_max

    def hasNext(self):
        return (self.min < self.max)

    def next(self):
        def _hx_local_3():
            def _hx_local_2():
                _hx_local_0 = self
                _hx_local_1 = _hx_local_0.min
                _hx_local_0.min = (_hx_local_1 + 1)
                return _hx_local_1
            return _hx_local_2()
        return _hx_local_3()

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.min = None
        _hx_o.max = None


class Reflect:
    _hx_class_name = "Reflect"
    __slots__ = ()
    _hx_statics = ["hasField", "field", "setField", "getProperty", "setProperty", "callMethod", "fields", "isFunction", "compare", "isClosure", "compareMethods", "isObject", "isEnumValue", "deleteField", "copy", "makeVarArgs"]

    @staticmethod
    def hasField(o,field):
        return python_Boot.hasField(o,field)

    @staticmethod
    def field(o,field):
        return python_Boot.field(o,field)

    @staticmethod
    def setField(o,field,value):
        setattr(o,(("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field)),value)

    @staticmethod
    def getProperty(o,field):
        if (o is None):
            return None
        if (field in python_Boot.keywords):
            field = ("_hx_" + field)
        elif ((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95))):
            field = ("_hx_" + field)
        if isinstance(o,_hx_AnonObject):
            return Reflect.field(o,field)
        tmp = Reflect.field(o,("get_" + ("null" if field is None else field)))
        if ((tmp is not None) and callable(tmp)):
            return tmp()
        else:
            return Reflect.field(o,field)

    @staticmethod
    def setProperty(o,field,value):
        field1 = (("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field))
        if isinstance(o,_hx_AnonObject):
            setattr(o,field1,value)
        elif hasattr(o,("set_" + ("null" if field1 is None else field1))):
            getattr(o,("set_" + ("null" if field1 is None else field1)))(value)
        else:
            setattr(o,field1,value)

    @staticmethod
    def callMethod(o,func,args):
        if callable(func):
            return func(*args)
        else:
            return None

    @staticmethod
    def fields(o):
        return python_Boot.fields(o)

    @staticmethod
    def isFunction(f):
        if (not ((python_lib_Inspect.isfunction(f) or python_lib_Inspect.ismethod(f)))):
            return python_Boot.hasField(f,"func_code")
        else:
            return True

    @staticmethod
    def compare(a,b):
        if ((a is None) and ((b is None))):
            return 0
        if (a is None):
            return 1
        elif (b is None):
            return -1
        elif HxOverrides.eq(a,b):
            return 0
        elif (a > b):
            return 1
        else:
            return -1

    @staticmethod
    def isClosure(v):
        return isinstance(v,python_internal_MethodClosure)

    @staticmethod
    def compareMethods(f1,f2):
        if HxOverrides.eq(f1,f2):
            return True
        if (isinstance(f1,python_internal_MethodClosure) and isinstance(f2,python_internal_MethodClosure)):
            m1 = f1
            m2 = f2
            if HxOverrides.eq(m1.obj,m2.obj):
                return (m1.func == m2.func)
            else:
                return False
        if ((not Reflect.isFunction(f1)) or (not Reflect.isFunction(f2))):
            return False
        return False

    @staticmethod
    def isObject(v):
        _g = Type.typeof(v)
        tmp = _g.index
        if (tmp == 4):
            return True
        elif (tmp == 6):
            _g1 = _g.params[0]
            return True
        else:
            return False

    @staticmethod
    def isEnumValue(v):
        if not HxOverrides.eq(v,Enum):
            return isinstance(v,Enum)
        else:
            return False

    @staticmethod
    def deleteField(o,field):
        if (field in python_Boot.keywords):
            field = ("_hx_" + field)
        elif ((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95))):
            field = ("_hx_" + field)
        if (not python_Boot.hasField(o,field)):
            return False
        o.__delattr__(field)
        return True

    @staticmethod
    def copy(o):
        if (o is None):
            return None
        o2 = _hx_AnonObject({})
        _g = 0
        _g1 = python_Boot.fields(o)
        while (_g < len(_g1)):
            f = (_g1[_g] if _g >= 0 and _g < len(_g1) else None)
            _g = (_g + 1)
            value = Reflect.field(o,f)
            setattr(o2,(("_hx_" + f) if ((f in python_Boot.keywords)) else (("_hx_" + f) if (((((len(f) > 2) and ((ord(f[0]) == 95))) and ((ord(f[1]) == 95))) and ((ord(f[(len(f) - 1)]) != 95)))) else f)),value)
        return o2

    @staticmethod
    def makeVarArgs(f):
        def _hx_local_0(*v):
            this1 = v
            return f((list(this1) if ((not Std.isOfType(this1,list))) else this1))
        return _hx_local_0


class Std:
    _hx_class_name = "Std"
    __slots__ = ()
    _hx_statics = ["downcast", "instance", "isMetaType", "is", "isOfType", "string", "int", "parseInt", "shortenPossibleNumber", "parseFloat", "random"]

    @staticmethod
    def downcast(value,c):
        try:
            tmp = None
            if (not isinstance(value,c)):
                if c._hx_is_interface:
                    cls = c
                    loop = None
                    def _hx_local_1(intf):
                        f = (intf._hx_interfaces if (hasattr(intf,"_hx_interfaces")) else [])
                        if (f is not None):
                            _g = 0
                            while (_g < len(f)):
                                i = (f[_g] if _g >= 0 and _g < len(f) else None)
                                _g = (_g + 1)
                                if (i == cls):
                                    return True
                                else:
                                    l = loop(i)
                                    if l:
                                        return True
                            return False
                        else:
                            return False
                    loop = _hx_local_1
                    currentClass = value.__class__
                    result = False
                    while (currentClass is not None):
                        if loop(currentClass):
                            result = True
                            break
                        currentClass = python_Boot.getSuperClass(currentClass)
                    tmp = result
                else:
                    tmp = False
            else:
                tmp = True
            if tmp:
                return value
            else:
                return None
        except BaseException as _g:
            None
            return None

    @staticmethod
    def instance(value,c):
        return Std.downcast(value,c)

    @staticmethod
    def isMetaType(v,t):
        return ((type(v) == type) and (v == t))

    @staticmethod
    def _hx_is(v,t):
        return Std.isOfType(v,t)

    @staticmethod
    def isOfType(v,t):
        if ((v is None) and ((t is None))):
            return False
        if (t is None):
            return False
        if ((type(t) == type) and (t == Dynamic)):
            return (v is not None)
        isBool = isinstance(v,bool)
        if (((type(t) == type) and (t == Bool)) and isBool):
            return True
        if ((((not isBool) and (not ((type(t) == type) and (t == Bool)))) and ((type(t) == type) and (t == Int))) and isinstance(v,int)):
            return True
        vIsFloat = isinstance(v,float)
        tmp = None
        tmp1 = None
        if (((not isBool) and vIsFloat) and ((type(t) == type) and (t == Int))):
            f = v
            tmp1 = (((f != Math.POSITIVE_INFINITY) and ((f != Math.NEGATIVE_INFINITY))) and (not python_lib_Math.isnan(f)))
        else:
            tmp1 = False
        if tmp1:
            tmp1 = None
            try:
                tmp1 = int(v)
            except BaseException as _g:
                None
                tmp1 = None
            tmp = (v == tmp1)
        else:
            tmp = False
        if ((tmp and ((v <= 2147483647))) and ((v >= -2147483648))):
            return True
        if (((not isBool) and ((type(t) == type) and (t == Float))) and isinstance(v,(float, int))):
            return True
        if ((type(t) == type) and (t == str)):
            return isinstance(v,str)
        isEnumType = ((type(t) == type) and (t == Enum))
        if ((isEnumType and python_lib_Inspect.isclass(v)) and hasattr(v,"_hx_constructs")):
            return True
        if isEnumType:
            return False
        isClassType = ((type(t) == type) and (t == Class))
        if ((((isClassType and (not isinstance(v,Enum))) and python_lib_Inspect.isclass(v)) and hasattr(v,"_hx_class_name")) and (not hasattr(v,"_hx_constructs"))):
            return True
        if isClassType:
            return False
        tmp = None
        try:
            tmp = isinstance(v,t)
        except BaseException as _g:
            None
            tmp = False
        if tmp:
            return True
        if python_lib_Inspect.isclass(t):
            cls = t
            loop = None
            def _hx_local_1(intf):
                f = (intf._hx_interfaces if (hasattr(intf,"_hx_interfaces")) else [])
                if (f is not None):
                    _g = 0
                    while (_g < len(f)):
                        i = (f[_g] if _g >= 0 and _g < len(f) else None)
                        _g = (_g + 1)
                        if (i == cls):
                            return True
                        else:
                            l = loop(i)
                            if l:
                                return True
                    return False
                else:
                    return False
            loop = _hx_local_1
            currentClass = v.__class__
            result = False
            while (currentClass is not None):
                if loop(currentClass):
                    result = True
                    break
                currentClass = python_Boot.getSuperClass(currentClass)
            return result
        else:
            return False

    @staticmethod
    def string(s):
        return python_Boot.toString1(s,"")

    @staticmethod
    def int(x):
        try:
            return int(x)
        except BaseException as _g:
            None
            return None

    @staticmethod
    def parseInt(x):
        if (x is None):
            return None
        try:
            return int(x)
        except BaseException as _g:
            None
            base = 10
            _hx_len = len(x)
            foundCount = 0
            sign = 0
            firstDigitIndex = 0
            lastDigitIndex = -1
            previous = 0
            _g = 0
            _g1 = _hx_len
            while (_g < _g1):
                i = _g
                _g = (_g + 1)
                c = (-1 if ((i >= len(x))) else ord(x[i]))
                if (((c > 8) and ((c < 14))) or ((c == 32))):
                    if (foundCount > 0):
                        return None
                    continue
                else:
                    c1 = c
                    if (c1 == 43):
                        if (foundCount == 0):
                            sign = 1
                        elif (not (((48 <= c) and ((c <= 57))))):
                            if (not (((base == 16) and ((((97 <= c) and ((c <= 122))) or (((65 <= c) and ((c <= 90))))))))):
                                break
                    elif (c1 == 45):
                        if (foundCount == 0):
                            sign = -1
                        elif (not (((48 <= c) and ((c <= 57))))):
                            if (not (((base == 16) and ((((97 <= c) and ((c <= 122))) or (((65 <= c) and ((c <= 90))))))))):
                                break
                    elif (c1 == 48):
                        if (not (((foundCount == 0) or (((foundCount == 1) and ((sign != 0))))))):
                            if (not (((48 <= c) and ((c <= 57))))):
                                if (not (((base == 16) and ((((97 <= c) and ((c <= 122))) or (((65 <= c) and ((c <= 90))))))))):
                                    break
                    elif ((c1 == 120) or ((c1 == 88))):
                        if ((previous == 48) and ((((foundCount == 1) and ((sign == 0))) or (((foundCount == 2) and ((sign != 0))))))):
                            base = 16
                        elif (not (((48 <= c) and ((c <= 57))))):
                            if (not (((base == 16) and ((((97 <= c) and ((c <= 122))) or (((65 <= c) and ((c <= 90))))))))):
                                break
                    elif (not (((48 <= c) and ((c <= 57))))):
                        if (not (((base == 16) and ((((97 <= c) and ((c <= 122))) or (((65 <= c) and ((c <= 90))))))))):
                            break
                if (((foundCount == 0) and ((sign == 0))) or (((foundCount == 1) and ((sign != 0))))):
                    firstDigitIndex = i
                foundCount = (foundCount + 1)
                lastDigitIndex = i
                previous = c
            if (firstDigitIndex <= lastDigitIndex):
                digits = HxString.substring(x,firstDigitIndex,(lastDigitIndex + 1))
                try:
                    return (((-1 if ((sign == -1)) else 1)) * int(digits,base))
                except BaseException as _g:
                    return None
            return None

    @staticmethod
    def shortenPossibleNumber(x):
        r = ""
        _g = 0
        _g1 = len(x)
        while (_g < _g1):
            i = _g
            _g = (_g + 1)
            c = ("" if (((i < 0) or ((i >= len(x))))) else x[i])
            _g2 = HxString.charCodeAt(c,0)
            if (_g2 is None):
                break
            else:
                _g3 = _g2
                if (((((((((((_g3 == 57) or ((_g3 == 56))) or ((_g3 == 55))) or ((_g3 == 54))) or ((_g3 == 53))) or ((_g3 == 52))) or ((_g3 == 51))) or ((_g3 == 50))) or ((_g3 == 49))) or ((_g3 == 48))) or ((_g3 == 46))):
                    r = (("null" if r is None else r) + ("null" if c is None else c))
                else:
                    break
        return r

    @staticmethod
    def parseFloat(x):
        try:
            return float(x)
        except BaseException as _g:
            None
            if (x is not None):
                r1 = Std.shortenPossibleNumber(x)
                if (r1 != x):
                    return Std.parseFloat(r1)
            return Math.NaN

    @staticmethod
    def random(x):
        if (x <= 0):
            return 0
        else:
            return int((python_lib_Random.random() * x))


class Float: pass


class Int: pass


class Bool: pass


class Dynamic: pass


class StringBuf:
    _hx_class_name = "StringBuf"
    __slots__ = ("b",)
    _hx_fields = ["b"]
    _hx_methods = ["get_length", "add", "add1", "addChar", "addSub", "toString"]

    def __init__(self):
        self.b = python_lib_io_StringIO()

    def get_length(self):
        pos = self.b.tell()
        self.b.seek(0,2)
        _hx_len = self.b.tell()
        self.b.seek(pos,0)
        return _hx_len

    def add(self,x):
        s = Std.string(x)
        self.b.write(s)

    def add1(self,s):
        self.b.write(s)

    def addChar(self,c):
        s = "".join(map(chr,[c]))
        self.b.write(s)

    def addSub(self,s,pos,_hx_len = None):
        s1 = (HxString.substr(s,pos,None) if ((_hx_len is None)) else HxString.substr(s,pos,_hx_len))
        self.b.write(s1)

    def toString(self):
        return self.b.getvalue()

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.b = None


class haxe_SysTools:
    _hx_class_name = "haxe.SysTools"
    __slots__ = ()
    _hx_statics = ["winMetaCharacters", "quoteUnixArg", "quoteWinArg"]

    @staticmethod
    def quoteUnixArg(argument):
        if (argument == ""):
            return "''"
        _this = EReg("[^a-zA-Z0-9_@%+=:,./-]","")
        _this.matchObj = python_lib_Re.search(_this.pattern,argument)
        if (_this.matchObj is None):
            return argument
        return (("'" + HxOverrides.stringOrNull(StringTools.replace(argument,"'","'\"'\"'"))) + "'")

    @staticmethod
    def quoteWinArg(argument,escapeMetaCharacters):
        _this = EReg("^[^ \t\\\\\"]+$","")
        _this.matchObj = python_lib_Re.search(_this.pattern,argument)
        if (_this.matchObj is None):
            result_b = python_lib_io_StringIO()
            needquote = None
            startIndex = None
            if (((argument.find(" ") if ((startIndex is None)) else HxString.indexOfImpl(argument," ",startIndex))) == -1):
                startIndex = None
                needquote = (((argument.find("\t") if ((startIndex is None)) else HxString.indexOfImpl(argument,"\t",startIndex))) != -1)
            else:
                needquote = True
            needquote1 = (needquote or ((argument == "")))
            if needquote1:
                result_b.write("\"")
            bs_buf = StringBuf()
            _g = 0
            _g1 = len(argument)
            while (_g < _g1):
                i = _g
                _g = (_g + 1)
                _g2 = HxString.charCodeAt(argument,i)
                if (_g2 is None):
                    c = _g2
                    if (bs_buf.get_length() > 0):
                        result_b.write(Std.string(bs_buf.b.getvalue()))
                        bs_buf = StringBuf()
                    result_b.write("".join(map(chr,[c])))
                else:
                    _g3 = _g2
                    if (_g3 == 34):
                        bs = bs_buf.b.getvalue()
                        result_b.write(Std.string(bs))
                        result_b.write(Std.string(bs))
                        bs_buf = StringBuf()
                        result_b.write("\\\"")
                    elif (_g3 == 92):
                        bs_buf.b.write("\\")
                    else:
                        c1 = _g2
                        if (bs_buf.get_length() > 0):
                            result_b.write(Std.string(bs_buf.b.getvalue()))
                            bs_buf = StringBuf()
                        result_b.write("".join(map(chr,[c1])))
            result_b.write(Std.string(bs_buf.b.getvalue()))
            if needquote1:
                result_b.write(Std.string(bs_buf.b.getvalue()))
                result_b.write("\"")
            argument = result_b.getvalue()
        if escapeMetaCharacters:
            result_b = python_lib_io_StringIO()
            _g = 0
            _g1 = len(argument)
            while (_g < _g1):
                i = _g
                _g = (_g + 1)
                c = HxString.charCodeAt(argument,i)
                if (python_internal_ArrayImpl.indexOf(haxe_SysTools.winMetaCharacters,c,None) >= 0):
                    result_b.write("".join(map(chr,[94])))
                result_b.write("".join(map(chr,[c])))
            return result_b.getvalue()
        else:
            return argument


class StringTools:
    _hx_class_name = "StringTools"
    __slots__ = ()
    _hx_statics = ["urlEncode", "urlDecode", "htmlEscape", "htmlUnescape", "contains", "startsWith", "endsWith", "isSpace", "ltrim", "rtrim", "trim", "lpad", "rpad", "replace", "hex", "fastCodeAt", "unsafeCodeAt", "iterator", "keyValueIterator", "isEof", "quoteUnixArg", "winMetaCharacters", "quoteWinArg"]

    @staticmethod
    def urlEncode(s):
        return python_lib_urllib_Parse.quote(s,"")

    @staticmethod
    def urlDecode(s):
        return python_lib_urllib_Parse.unquote(s)

    @staticmethod
    def htmlEscape(s,quotes = None):
        buf_b = python_lib_io_StringIO()
        _g_offset = 0
        _g_s = s
        while (_g_offset < len(_g_s)):
            index = _g_offset
            _g_offset = (_g_offset + 1)
            code = ord(_g_s[index])
            code1 = code
            if (code1 == 34):
                if quotes:
                    buf_b.write("&quot;")
                else:
                    buf_b.write("".join(map(chr,[code])))
            elif (code1 == 38):
                buf_b.write("&amp;")
            elif (code1 == 39):
                if quotes:
                    buf_b.write("&#039;")
                else:
                    buf_b.write("".join(map(chr,[code])))
            elif (code1 == 60):
                buf_b.write("&lt;")
            elif (code1 == 62):
                buf_b.write("&gt;")
            else:
                buf_b.write("".join(map(chr,[code])))
        return buf_b.getvalue()

    @staticmethod
    def htmlUnescape(s):
        _this = s.split("&gt;")
        _this1 = ">".join([python_Boot.toString1(x1,'') for x1 in _this])
        _this = _this1.split("&lt;")
        _this1 = "<".join([python_Boot.toString1(x1,'') for x1 in _this])
        _this = _this1.split("&quot;")
        _this1 = "\"".join([python_Boot.toString1(x1,'') for x1 in _this])
        _this = _this1.split("&#039;")
        _this1 = "'".join([python_Boot.toString1(x1,'') for x1 in _this])
        _this = _this1.split("&amp;")
        return "&".join([python_Boot.toString1(x1,'') for x1 in _this])

    @staticmethod
    def contains(s,value):
        startIndex = None
        return (((s.find(value) if ((startIndex is None)) else HxString.indexOfImpl(s,value,startIndex))) != -1)

    @staticmethod
    def startsWith(s,start):
        return s.startswith(start)

    @staticmethod
    def endsWith(s,end):
        return s.endswith(end)

    @staticmethod
    def isSpace(s,pos):
        if (((len(s) == 0) or ((pos < 0))) or ((pos >= len(s)))):
            return False
        c = HxString.charCodeAt(s,pos)
        if (not (((c > 8) and ((c < 14))))):
            return (c == 32)
        else:
            return True

    @staticmethod
    def ltrim(s):
        l = len(s)
        r = 0
        while ((r < l) and StringTools.isSpace(s,r)):
            r = (r + 1)
        if (r > 0):
            return HxString.substr(s,r,(l - r))
        else:
            return s

    @staticmethod
    def rtrim(s):
        l = len(s)
        r = 0
        while ((r < l) and StringTools.isSpace(s,((l - r) - 1))):
            r = (r + 1)
        if (r > 0):
            return HxString.substr(s,0,(l - r))
        else:
            return s

    @staticmethod
    def trim(s):
        return StringTools.ltrim(StringTools.rtrim(s))

    @staticmethod
    def lpad(s,c,l):
        if (len(c) <= 0):
            return s
        buf = StringBuf()
        l = (l - len(s))
        while (buf.get_length() < l):
            s1 = Std.string(c)
            buf.b.write(s1)
        s1 = Std.string(s)
        buf.b.write(s1)
        return buf.b.getvalue()

    @staticmethod
    def rpad(s,c,l):
        if (len(c) <= 0):
            return s
        buf = StringBuf()
        s1 = Std.string(s)
        buf.b.write(s1)
        while (buf.get_length() < l):
            s = Std.string(c)
            buf.b.write(s)
        return buf.b.getvalue()

    @staticmethod
    def replace(s,sub,by):
        _this = (list(s) if ((sub == "")) else s.split(sub))
        return by.join([python_Boot.toString1(x1,'') for x1 in _this])

    @staticmethod
    def hex(n,digits = None):
        s = ""
        hexChars = "0123456789ABCDEF"
        while True:
            index = (n & 15)
            s = (HxOverrides.stringOrNull((("" if (((index < 0) or ((index >= len(hexChars))))) else hexChars[index]))) + ("null" if s is None else s))
            n = HxOverrides.rshift(n, 4)
            if (not ((n > 0))):
                break
        if ((digits is not None) and ((len(s) < digits))):
            diff = (digits - len(s))
            _g = 0
            _g1 = diff
            while (_g < _g1):
                _ = _g
                _g = (_g + 1)
                s = ("0" + ("null" if s is None else s))
        return s

    @staticmethod
    def fastCodeAt(s,index):
        if (index >= len(s)):
            return -1
        else:
            return ord(s[index])

    @staticmethod
    def unsafeCodeAt(s,index):
        return ord(s[index])

    @staticmethod
    def iterator(s):
        return haxe_iterators_StringIterator(s)

    @staticmethod
    def keyValueIterator(s):
        return haxe_iterators_StringKeyValueIterator(s)

    @staticmethod
    def isEof(c):
        return (c == -1)

    @staticmethod
    def quoteUnixArg(argument):
        if (argument == ""):
            return "''"
        else:
            _this = EReg("[^a-zA-Z0-9_@%+=:,./-]","")
            _this.matchObj = python_lib_Re.search(_this.pattern,argument)
            if (_this.matchObj is None):
                return argument
            else:
                return (("'" + HxOverrides.stringOrNull(StringTools.replace(argument,"'","'\"'\"'"))) + "'")

    @staticmethod
    def quoteWinArg(argument,escapeMetaCharacters):
        argument1 = argument
        _this = EReg("^[^ \t\\\\\"]+$","")
        _this.matchObj = python_lib_Re.search(_this.pattern,argument1)
        if (_this.matchObj is None):
            result_b = python_lib_io_StringIO()
            needquote = None
            startIndex = None
            if (((argument1.find(" ") if ((startIndex is None)) else HxString.indexOfImpl(argument1," ",startIndex))) == -1):
                startIndex = None
                needquote = (((argument1.find("\t") if ((startIndex is None)) else HxString.indexOfImpl(argument1,"\t",startIndex))) != -1)
            else:
                needquote = True
            needquote1 = (needquote or ((argument1 == "")))
            if needquote1:
                result_b.write("\"")
            bs_buf = StringBuf()
            _g = 0
            _g1 = len(argument1)
            while (_g < _g1):
                i = _g
                _g = (_g + 1)
                _g2 = HxString.charCodeAt(argument1,i)
                if (_g2 is None):
                    c = _g2
                    if (bs_buf.get_length() > 0):
                        result_b.write(Std.string(bs_buf.b.getvalue()))
                        bs_buf = StringBuf()
                    result_b.write("".join(map(chr,[c])))
                else:
                    _g3 = _g2
                    if (_g3 == 34):
                        bs = bs_buf.b.getvalue()
                        result_b.write(Std.string(bs))
                        result_b.write(Std.string(bs))
                        bs_buf = StringBuf()
                        result_b.write("\\\"")
                    elif (_g3 == 92):
                        bs_buf.b.write("\\")
                    else:
                        c1 = _g2
                        if (bs_buf.get_length() > 0):
                            result_b.write(Std.string(bs_buf.b.getvalue()))
                            bs_buf = StringBuf()
                        result_b.write("".join(map(chr,[c1])))
            result_b.write(Std.string(bs_buf.b.getvalue()))
            if needquote1:
                result_b.write(Std.string(bs_buf.b.getvalue()))
                result_b.write("\"")
            argument1 = result_b.getvalue()
        if escapeMetaCharacters:
            result_b = python_lib_io_StringIO()
            _g = 0
            _g1 = len(argument1)
            while (_g < _g1):
                i = _g
                _g = (_g + 1)
                c = HxString.charCodeAt(argument1,i)
                if (python_internal_ArrayImpl.indexOf(haxe_SysTools.winMetaCharacters,c,None) >= 0):
                    result_b.write("".join(map(chr,[94])))
                result_b.write("".join(map(chr,[c])))
            return result_b.getvalue()
        else:
            return argument1


class sys_FileSystem:
    _hx_class_name = "sys.FileSystem"
    __slots__ = ()
    _hx_statics = ["exists", "stat", "rename", "fullPath", "absolutePath", "isDirectory", "createDirectory", "deleteFile", "deleteDirectory", "readDirectory"]

    @staticmethod
    def exists(path):
        return python_lib_os_Path.exists(path)

    @staticmethod
    def stat(path):
        s = python_lib_Os.stat(path)
        return _hx_AnonObject({'gid': s.st_gid, 'uid': s.st_uid, 'atime': Date.fromTime((1000 * s.st_atime)), 'mtime': Date.fromTime((1000 * s.st_mtime)), 'ctime': Date.fromTime((1000 * s.st_ctime)), 'size': s.st_size, 'dev': s.st_dev, 'ino': s.st_ino, 'nlink': s.st_nlink, 'rdev': getattr(s,"st_rdev",0), 'mode': s.st_mode})

    @staticmethod
    def rename(path,newPath):
        python_lib_Os.rename(path,newPath)

    @staticmethod
    def fullPath(relPath):
        return python_lib_os_Path.realpath(relPath)

    @staticmethod
    def absolutePath(relPath):
        if haxe_io_Path.isAbsolute(relPath):
            return relPath
        return haxe_io_Path.join([Sys.getCwd(), relPath])

    @staticmethod
    def isDirectory(path):
        return python_lib_os_Path.isdir(path)

    @staticmethod
    def createDirectory(path):
        python_lib_Os.makedirs(path,511,True)

    @staticmethod
    def deleteFile(path):
        python_lib_Os.remove(path)

    @staticmethod
    def deleteDirectory(path):
        python_lib_Os.rmdir(path)

    @staticmethod
    def readDirectory(path):
        return python_lib_Os.listdir(path)


class Sys:
    _hx_class_name = "Sys"
    __slots__ = ()
    _hx_statics = ["environ", "get_environ", "time", "exit", "print", "println", "args", "getEnv", "putEnv", "environment", "sleep", "setTimeLocale", "getCwd", "setCwd", "systemName", "command", "cpuTime", "executablePath", "_programPath", "programPath", "getChar", "stdin", "stdout", "stderr"]
    environ = None

    @staticmethod
    def get_environ():
        _g = Sys.environ
        if (_g is None):
            environ = haxe_ds_StringMap()
            env = python_lib_Os.environ
            key = python_HaxeIterator(iter(env.keys()))
            while key.hasNext():
                key1 = key.next()
                value = env.get(key1,None)
                environ.h[key1] = value
            def _hx_local_1():
                def _hx_local_0():
                    Sys.environ = environ
                    return Sys.environ
                return _hx_local_0()
            return _hx_local_1()
        else:
            env = _g
            return env

    @staticmethod
    def time():
        return python_lib_Time.time()

    @staticmethod
    def exit(code):
        python_lib_Sys.exit(code)

    @staticmethod
    def print(v):
        python_Lib.printString(Std.string(v))

    @staticmethod
    def println(v):
        _hx_str = Std.string(v)
        python_Lib.printString((("" + ("null" if _hx_str is None else _hx_str)) + HxOverrides.stringOrNull(python_Lib.lineEnd)))

    @staticmethod
    def args():
        argv = python_lib_Sys.argv
        return argv[1:None]

    @staticmethod
    def getEnv(s):
        return Sys.get_environ().h.get(s,None)

    @staticmethod
    def putEnv(s,v):
        python_lib_Os.putenv(s,v)
        Sys.get_environ().h[s] = v

    @staticmethod
    def environment():
        return Sys.get_environ()

    @staticmethod
    def sleep(seconds):
        python_lib_Time.sleep(seconds)

    @staticmethod
    def setTimeLocale(loc):
        return False

    @staticmethod
    def getCwd():
        return python_lib_Os.getcwd()

    @staticmethod
    def setCwd(s):
        python_lib_Os.chdir(s)

    @staticmethod
    def systemName():
        _g = python_lib_Sys.platform
        x = _g
        if x.startswith("linux"):
            return "Linux"
        else:
            _g1 = _g
            _hx_local_0 = len(_g1)
            if (_hx_local_0 == 5):
                if (_g1 == "win32"):
                    return "Windows"
                else:
                    raise haxe_Exception.thrown("not supported platform")
            elif (_hx_local_0 == 6):
                if (_g1 == "cygwin"):
                    return "Windows"
                elif (_g1 == "darwin"):
                    return "Mac"
                else:
                    raise haxe_Exception.thrown("not supported platform")
            else:
                raise haxe_Exception.thrown("not supported platform")

    @staticmethod
    def command(cmd,args = None):
        if (args is None):
            return python_lib_Subprocess.call(cmd,**python__KwArgs_KwArgs_Impl_.fromT(_hx_AnonObject({'shell': True})))
        else:
            return python_lib_Subprocess.call(([cmd] + args))

    @staticmethod
    def cpuTime():
        return python_lib_Timeit.default_timer()

    @staticmethod
    def executablePath():
        return python_internal_ArrayImpl._get(python_lib_Sys.argv, 0)

    @staticmethod
    def programPath():
        return Sys._programPath

    @staticmethod
    def getChar(echo):
        ch = None
        _g = Sys.systemName()
        _g1 = _g
        _hx_local_0 = len(_g1)
        if (_hx_local_0 == 5):
            if (_g1 == "Linux"):
                fd = python_lib_Sys.stdin.fileno()
                old = python_lib_Termios.tcgetattr(fd)
                fileNo = fd
                when = python_lib_Termios.TCSADRAIN
                settings = old
                def _hx_local_1():
                    python_lib_Termios.tcsetattr(fileNo,when,settings)
                restore = _hx_local_1
                try:
                    python_lib_Tty.setraw(fd)
                    x = python_lib_Sys.stdin.read(1)
                    restore()
                    ch = HxString.charCodeAt(x,0)
                except BaseException as _g1:
                    None
                    e = haxe_Exception.caught(_g1).unwrap()
                    restore()
                    raise haxe_Exception.thrown(e)
            else:
                x = _g
                raise haxe_Exception.thrown((("platform " + ("null" if x is None else x)) + " not supported"))
        elif (_hx_local_0 == 3):
            if (_g1 == "Mac"):
                fd = python_lib_Sys.stdin.fileno()
                old = python_lib_Termios.tcgetattr(fd)
                fileNo = fd
                when = python_lib_Termios.TCSADRAIN
                settings = old
                def _hx_local_2():
                    python_lib_Termios.tcsetattr(fileNo,when,settings)
                restore = _hx_local_2
                try:
                    python_lib_Tty.setraw(fd)
                    x = python_lib_Sys.stdin.read(1)
                    restore()
                    ch = HxString.charCodeAt(x,0)
                except BaseException as _g1:
                    None
                    e = haxe_Exception.caught(_g1).unwrap()
                    restore()
                    raise haxe_Exception.thrown(e)
            else:
                x = _g
                raise haxe_Exception.thrown((("platform " + ("null" if x is None else x)) + " not supported"))
        elif (_hx_local_0 == 7):
            if (_g1 == "Windows"):
                ch = HxString.charCodeAt(python_lib_Msvcrt.getwch(),0)
            else:
                x = _g
                raise haxe_Exception.thrown((("platform " + ("null" if x is None else x)) + " not supported"))
        else:
            x = _g
            raise haxe_Exception.thrown((("platform " + ("null" if x is None else x)) + " not supported"))
        if echo:
            python_Lib.printString(Std.string("".join(map(chr,[ch]))))
        return ch

    @staticmethod
    def stdin():
        return python_io_IoTools.createFileInputFromText(python_lib_Sys.stdin)

    @staticmethod
    def stdout():
        return python_io_IoTools.createFileOutputFromText(python_lib_Sys.stdout)

    @staticmethod
    def stderr():
        return python_io_IoTools.createFileOutputFromText(python_lib_Sys.stderr)

class ValueType(Enum):
    __slots__ = ()
    _hx_class_name = "ValueType"
    _hx_constructs = ["TNull", "TInt", "TFloat", "TBool", "TObject", "TFunction", "TClass", "TEnum", "TUnknown"]

    @staticmethod
    def TClass(c):
        return ValueType("TClass", 6, (c,))

    @staticmethod
    def TEnum(e):
        return ValueType("TEnum", 7, (e,))
ValueType.TNull = ValueType("TNull", 0, ())
ValueType.TInt = ValueType("TInt", 1, ())
ValueType.TFloat = ValueType("TFloat", 2, ())
ValueType.TBool = ValueType("TBool", 3, ())
ValueType.TObject = ValueType("TObject", 4, ())
ValueType.TFunction = ValueType("TFunction", 5, ())
ValueType.TUnknown = ValueType("TUnknown", 8, ())


class Type:
    _hx_class_name = "Type"
    __slots__ = ()
    _hx_statics = ["getClass", "getEnum", "getSuperClass", "getClassName", "getEnumName", "resolveClass", "resolveEnum", "createInstance", "createEmptyInstance", "createEnum", "createEnumIndex", "getInstanceFields", "getClassFields", "getEnumConstructs", "typeof", "asEnumImpl", "enumEq", "enumConstructor", "enumParameters", "enumIndex", "allEnums"]

    @staticmethod
    def getClass(o):
        if (o is None):
            return None
        o1 = o
        if ((o1 is not None) and ((HxOverrides.eq(o1,str) or python_lib_Inspect.isclass(o1)))):
            return None
        if isinstance(o,_hx_AnonObject):
            return None
        if hasattr(o,"_hx_class"):
            return o._hx_class
        if hasattr(o,"__class__"):
            return o.__class__
        else:
            return None

    @staticmethod
    def getEnum(o):
        if (o is None):
            return None
        return o.__class__

    @staticmethod
    def getSuperClass(c):
        return python_Boot.getSuperClass(c)

    @staticmethod
    def getClassName(c):
        if hasattr(c,"_hx_class_name"):
            return c._hx_class_name
        else:
            if (c == list):
                return "Array"
            if (c == Math):
                return "Math"
            if (c == str):
                return "String"
            try:
                return c.__name__
            except BaseException as _g:
                None
                return None

    @staticmethod
    def getEnumName(e):
        return e._hx_class_name

    @staticmethod
    def resolveClass(name):
        if (name == "Array"):
            return list
        if (name == "Math"):
            return Math
        if (name == "String"):
            return str
        cl = _hx_classes.get(name,None)
        tmp = None
        if (cl is not None):
            o = cl
            tmp = (not (((o is not None) and ((HxOverrides.eq(o,str) or python_lib_Inspect.isclass(o))))))
        else:
            tmp = True
        if tmp:
            return None
        return cl

    @staticmethod
    def resolveEnum(name):
        if (name == "Bool"):
            return Bool
        o = Type.resolveClass(name)
        if hasattr(o,"_hx_constructs"):
            return o
        else:
            return None

    @staticmethod
    def createInstance(cl,args):
        return cl(*args)

    @staticmethod
    def createEmptyInstance(cl):
        i = cl.__new__(cl)
        callInit = None
        def _hx_local_0(cl):
            sc = Type.getSuperClass(cl)
            if (sc is not None):
                callInit(sc)
            if hasattr(cl,"_hx_empty_init"):
                cl._hx_empty_init(i)
        callInit = _hx_local_0
        callInit(cl)
        return i

    @staticmethod
    def createEnum(e,constr,params = None):
        f = Reflect.field(e,constr)
        if (f is None):
            raise haxe_Exception.thrown(("No such constructor " + ("null" if constr is None else constr)))
        if Reflect.isFunction(f):
            if (params is None):
                raise haxe_Exception.thrown((("Constructor " + ("null" if constr is None else constr)) + " need parameters"))
            return Reflect.callMethod(e,f,params)
        if ((params is not None) and ((len(params) != 0))):
            raise haxe_Exception.thrown((("Constructor " + ("null" if constr is None else constr)) + " does not need parameters"))
        return f

    @staticmethod
    def createEnumIndex(e,index,params = None):
        c = python_internal_ArrayImpl._get(e._hx_constructs, index)
        if (c is None):
            raise haxe_Exception.thrown((Std.string(index) + " is not a valid enum constructor index"))
        return Type.createEnum(e,c,params)

    @staticmethod
    def getInstanceFields(c):
        return python_Boot.getInstanceFields(c)

    @staticmethod
    def getClassFields(c):
        return python_Boot.getClassFields(c)

    @staticmethod
    def getEnumConstructs(e):
        if hasattr(e,"_hx_constructs"):
            x = e._hx_constructs
            return list(x)
        else:
            return []

    @staticmethod
    def typeof(v):
        if (v is None):
            return ValueType.TNull
        elif isinstance(v,bool):
            return ValueType.TBool
        elif isinstance(v,int):
            return ValueType.TInt
        elif isinstance(v,float):
            return ValueType.TFloat
        elif isinstance(v,str):
            return ValueType.TClass(str)
        elif isinstance(v,list):
            return ValueType.TClass(list)
        elif (isinstance(v,_hx_AnonObject) or python_lib_Inspect.isclass(v)):
            return ValueType.TObject
        elif isinstance(v,Enum):
            return ValueType.TEnum(v.__class__)
        elif (isinstance(v,type) or hasattr(v,"_hx_class")):
            return ValueType.TClass(v.__class__)
        elif callable(v):
            return ValueType.TFunction
        else:
            return ValueType.TUnknown

    @staticmethod
    def asEnumImpl(x):
        return x

    @staticmethod
    def enumEq(a,b):
        if HxOverrides.eq(a,b):
            return True
        try:
            if ((b is None) and (not HxOverrides.eq(a,b))):
                return False
            if (a.tag != b.tag):
                return False
            p1 = a.params
            p2 = b.params
            if (len(p1) != len(p2)):
                return False
            _g = 0
            _g1 = len(p1)
            while (_g < _g1):
                i = _g
                _g = (_g + 1)
                if (not Type.enumEq(p1[i],p2[i])):
                    return False
            if (a._hx_class != b._hx_class):
                return False
        except BaseException as _g:
            None
            return False
        return True

    @staticmethod
    def enumConstructor(e):
        return e.tag

    @staticmethod
    def enumParameters(e):
        return list(e.params)

    @staticmethod
    def enumIndex(e):
        return e.index

    @staticmethod
    def allEnums(e):
        ctors = Type.getEnumConstructs(e)
        ret = []
        _g = 0
        while (_g < len(ctors)):
            ctor = (ctors[_g] if _g >= 0 and _g < len(ctors) else None)
            _g = (_g + 1)
            v = Reflect.field(e,ctor)
            if Std.isOfType(v,e):
                ret.append(v)
        return ret

class haxe_StackItem(Enum):
    __slots__ = ()
    _hx_class_name = "haxe.StackItem"
    _hx_constructs = ["CFunction", "Module", "FilePos", "Method", "LocalFunction"]

    @staticmethod
    def Module(m):
        return haxe_StackItem("Module", 1, (m,))

    @staticmethod
    def FilePos(s,file,line,column = None):
        return haxe_StackItem("FilePos", 2, (s,file,line,column))

    @staticmethod
    def Method(classname,method):
        return haxe_StackItem("Method", 3, (classname,method))

    @staticmethod
    def LocalFunction(v = None):
        return haxe_StackItem("LocalFunction", 4, (v,))
haxe_StackItem.CFunction = haxe_StackItem("CFunction", 0, ())


class haxe__CallStack_CallStack_Impl_:
    _hx_class_name = "haxe._CallStack.CallStack_Impl_"
    __slots__ = ()
    _hx_statics = ["get_length", "callStack", "exceptionStack", "toString", "subtract", "copy", "get", "asArray", "equalItems", "exceptionToString", "itemToString"]
    length = None

    @staticmethod
    def get_length(this1):
        return len(this1)

    @staticmethod
    def callStack():
        infos = python_lib_Traceback.extract_stack()
        if (len(infos) != 0):
            infos.pop()
        infos.reverse()
        return haxe_NativeStackTrace.toHaxe(infos)

    @staticmethod
    def exceptionStack(fullStack = None):
        if (fullStack is None):
            fullStack = False
        eStack = haxe_NativeStackTrace.toHaxe(haxe_NativeStackTrace.exceptionStack())
        return (eStack if fullStack else haxe__CallStack_CallStack_Impl_.subtract(eStack,haxe__CallStack_CallStack_Impl_.callStack()))

    @staticmethod
    def toString(stack):
        b = StringBuf()
        _g = 0
        _g1 = stack
        while (_g < len(_g1)):
            s = (_g1[_g] if _g >= 0 and _g < len(_g1) else None)
            _g = (_g + 1)
            b.b.write("\nCalled from ")
            haxe__CallStack_CallStack_Impl_.itemToString(b,s)
        return b.b.getvalue()

    @staticmethod
    def subtract(this1,stack):
        startIndex = -1
        i = -1
        while True:
            i = (i + 1)
            tmp = i
            if (not ((tmp < len(this1)))):
                break
            _g = 0
            _g1 = len(stack)
            while (_g < _g1):
                j = _g
                _g = (_g + 1)
                if haxe__CallStack_CallStack_Impl_.equalItems((this1[i] if i >= 0 and i < len(this1) else None),python_internal_ArrayImpl._get(stack, j)):
                    if (startIndex < 0):
                        startIndex = i
                    i = (i + 1)
                    if (i >= len(this1)):
                        break
                else:
                    startIndex = -1
            if (startIndex >= 0):
                break
        if (startIndex >= 0):
            return this1[0:startIndex]
        else:
            return this1

    @staticmethod
    def copy(this1):
        return list(this1)

    @staticmethod
    def get(this1,index):
        return (this1[index] if index >= 0 and index < len(this1) else None)

    @staticmethod
    def asArray(this1):
        return this1

    @staticmethod
    def equalItems(item1,item2):
        if (item1 is None):
            if (item2 is None):
                return True
            else:
                return False
        else:
            tmp = item1.index
            if (tmp == 0):
                if (item2 is None):
                    return False
                elif (item2.index == 0):
                    return True
                else:
                    return False
            elif (tmp == 1):
                if (item2 is None):
                    return False
                elif (item2.index == 1):
                    m2 = item2.params[0]
                    m1 = item1.params[0]
                    return (m1 == m2)
                else:
                    return False
            elif (tmp == 2):
                if (item2 is None):
                    return False
                elif (item2.index == 2):
                    item21 = item2.params[0]
                    file2 = item2.params[1]
                    line2 = item2.params[2]
                    col2 = item2.params[3]
                    col1 = item1.params[3]
                    line1 = item1.params[2]
                    file1 = item1.params[1]
                    item11 = item1.params[0]
                    if (((file1 == file2) and ((line1 == line2))) and ((col1 == col2))):
                        return haxe__CallStack_CallStack_Impl_.equalItems(item11,item21)
                    else:
                        return False
                else:
                    return False
            elif (tmp == 3):
                if (item2 is None):
                    return False
                elif (item2.index == 3):
                    class2 = item2.params[0]
                    method2 = item2.params[1]
                    method1 = item1.params[1]
                    class1 = item1.params[0]
                    if (class1 == class2):
                        return (method1 == method2)
                    else:
                        return False
                else:
                    return False
            elif (tmp == 4):
                if (item2 is None):
                    return False
                elif (item2.index == 4):
                    v2 = item2.params[0]
                    v1 = item1.params[0]
                    return (v1 == v2)
                else:
                    return False
            else:
                pass

    @staticmethod
    def exceptionToString(e):
        if (e.get_previous() is None):
            tmp = ("Exception: " + HxOverrides.stringOrNull(e.toString()))
            tmp1 = e.get_stack()
            return (("null" if tmp is None else tmp) + HxOverrides.stringOrNull((("null" if ((tmp1 is None)) else haxe__CallStack_CallStack_Impl_.toString(tmp1)))))
        result = ""
        e1 = e
        prev = None
        while (e1 is not None):
            if (prev is None):
                result1 = ("Exception: " + HxOverrides.stringOrNull(e1.get_message()))
                tmp = e1.get_stack()
                result = ((("null" if result1 is None else result1) + HxOverrides.stringOrNull((("null" if ((tmp is None)) else haxe__CallStack_CallStack_Impl_.toString(tmp))))) + ("null" if result is None else result))
            else:
                prevStack = haxe__CallStack_CallStack_Impl_.subtract(e1.get_stack(),prev.get_stack())
                result = (((("Exception: " + HxOverrides.stringOrNull(e1.get_message())) + HxOverrides.stringOrNull((("null" if ((prevStack is None)) else haxe__CallStack_CallStack_Impl_.toString(prevStack))))) + "\n\nNext ") + ("null" if result is None else result))
            prev = e1
            e1 = e1.get_previous()
        return result

    @staticmethod
    def itemToString(b,s):
        tmp = s.index
        if (tmp == 0):
            b.b.write("a C function")
        elif (tmp == 1):
            m = s.params[0]
            b.b.write("module ")
            s1 = Std.string(m)
            b.b.write(s1)
        elif (tmp == 2):
            s1 = s.params[0]
            file = s.params[1]
            line = s.params[2]
            col = s.params[3]
            if (s1 is not None):
                haxe__CallStack_CallStack_Impl_.itemToString(b,s1)
                b.b.write(" (")
            s2 = Std.string(file)
            b.b.write(s2)
            b.b.write(" line ")
            s2 = Std.string(line)
            b.b.write(s2)
            if (col is not None):
                b.b.write(" column ")
                s2 = Std.string(col)
                b.b.write(s2)
            if (s1 is not None):
                b.b.write(")")
        elif (tmp == 3):
            cname = s.params[0]
            meth = s.params[1]
            s1 = Std.string(("<unknown>" if ((cname is None)) else cname))
            b.b.write(s1)
            b.b.write(".")
            s1 = Std.string(meth)
            b.b.write(s1)
        elif (tmp == 4):
            n = s.params[0]
            b.b.write("local function #")
            s = Std.string(n)
            b.b.write(s)
        else:
            pass


class haxe_IMap:
    _hx_class_name = "haxe.IMap"
    __slots__ = ()
    _hx_methods = ["get", "set", "exists", "remove", "keys", "iterator", "keyValueIterator", "copy", "toString", "clear"]


class haxe__DynamicAccess_DynamicAccess_Impl_:
    _hx_class_name = "haxe._DynamicAccess.DynamicAccess_Impl_"
    __slots__ = ()
    _hx_statics = ["_new", "get", "set", "exists", "remove", "keys", "copy", "iterator", "keyValueIterator"]

    @staticmethod
    def _new():
        this1 = _hx_AnonObject({})
        return this1

    @staticmethod
    def get(this1,key):
        return Reflect.field(this1,key)

    @staticmethod
    def set(this1,key,value):
        setattr(this1,(("_hx_" + key) if ((key in python_Boot.keywords)) else (("_hx_" + key) if (((((len(key) > 2) and ((ord(key[0]) == 95))) and ((ord(key[1]) == 95))) and ((ord(key[(len(key) - 1)]) != 95)))) else key)),value)
        return value

    @staticmethod
    def exists(this1,key):
        return python_Boot.hasField(this1,key)

    @staticmethod
    def remove(this1,key):
        return Reflect.deleteField(this1,key)

    @staticmethod
    def keys(this1):
        return python_Boot.fields(this1)

    @staticmethod
    def copy(this1):
        return Reflect.copy(this1)

    @staticmethod
    def iterator(this1):
        return haxe_iterators_DynamicAccessIterator(this1)

    @staticmethod
    def keyValueIterator(this1):
        return haxe_iterators_DynamicAccessKeyValueIterator(this1)


class haxe_Exception(Exception):
    _hx_class_name = "haxe.Exception"
    __slots__ = ("_hx___exceptionStack", "_hx___nativeStack", "_hx___skipStack", "_hx___nativeException", "_hx___previousException")
    _hx_fields = ["__exceptionStack", "__nativeStack", "__skipStack", "__nativeException", "__previousException"]
    _hx_methods = ["unwrap", "toString", "details", "__shiftStack", "get_message", "get_previous", "get_native", "get_stack"]
    _hx_statics = ["caught", "thrown"]
    _hx_interfaces = []
    _hx_super = Exception


    def __init__(self,message,previous = None,native = None):
        self._hx___previousException = None
        self._hx___nativeException = None
        self._hx___nativeStack = None
        self._hx___exceptionStack = None
        self._hx___skipStack = 0
        super().__init__(message)
        self._hx___previousException = previous
        if ((native is not None) and Std.isOfType(native,BaseException)):
            self._hx___nativeException = native
            self._hx___nativeStack = haxe_NativeStackTrace.exceptionStack()
        else:
            self._hx___nativeException = self
            infos = python_lib_Traceback.extract_stack()
            if (len(infos) != 0):
                infos.pop()
            infos.reverse()
            self._hx___nativeStack = infos

    def unwrap(self):
        return self._hx___nativeException

    def toString(self):
        return self.get_message()

    def details(self):
        if (self.get_previous() is None):
            tmp = ("Exception: " + HxOverrides.stringOrNull(self.toString()))
            tmp1 = self.get_stack()
            return (("null" if tmp is None else tmp) + HxOverrides.stringOrNull((("null" if ((tmp1 is None)) else haxe__CallStack_CallStack_Impl_.toString(tmp1)))))
        else:
            result = ""
            e = self
            prev = None
            while (e is not None):
                if (prev is None):
                    result1 = ("Exception: " + HxOverrides.stringOrNull(e.get_message()))
                    tmp = e.get_stack()
                    result = ((("null" if result1 is None else result1) + HxOverrides.stringOrNull((("null" if ((tmp is None)) else haxe__CallStack_CallStack_Impl_.toString(tmp))))) + ("null" if result is None else result))
                else:
                    prevStack = haxe__CallStack_CallStack_Impl_.subtract(e.get_stack(),prev.get_stack())
                    result = (((("Exception: " + HxOverrides.stringOrNull(e.get_message())) + HxOverrides.stringOrNull((("null" if ((prevStack is None)) else haxe__CallStack_CallStack_Impl_.toString(prevStack))))) + "\n\nNext ") + ("null" if result is None else result))
                prev = e
                e = e.get_previous()
            return result

    def _hx___shiftStack(self):
        _hx_local_0 = self
        _hx_local_1 = _hx_local_0._hx___skipStack
        _hx_local_0._hx___skipStack = (_hx_local_1 + 1)
        _hx_local_1

    def get_message(self):
        return str(self)

    def get_previous(self):
        return self._hx___previousException

    def get_native(self):
        return self._hx___nativeException

    def get_stack(self):
        _g = self._hx___exceptionStack
        if (_g is None):
            def _hx_local_1():
                def _hx_local_0():
                    self._hx___exceptionStack = haxe_NativeStackTrace.toHaxe(self._hx___nativeStack,self._hx___skipStack)
                    return self._hx___exceptionStack
                return _hx_local_0()
            return _hx_local_1()
        else:
            s = _g
            return s

    @staticmethod
    def caught(value):
        if Std.isOfType(value,haxe_Exception):
            return value
        elif Std.isOfType(value,BaseException):
            return haxe_Exception(str(value),None,value)
        else:
            return haxe_ValueException(value,None,value)

    @staticmethod
    def thrown(value):
        if Std.isOfType(value,haxe_Exception):
            return value.get_native()
        elif Std.isOfType(value,BaseException):
            return value
        else:
            e = haxe_ValueException(value)
            e._hx___skipStack = (e._hx___skipStack + 1)
            return e

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o._hx___exceptionStack = None
        _hx_o._hx___nativeStack = None
        _hx_o._hx___skipStack = None
        _hx_o._hx___nativeException = None
        _hx_o._hx___previousException = None


class haxe__Int32_Int32_Impl_:
    _hx_class_name = "haxe._Int32.Int32_Impl_"
    __slots__ = ()
    _hx_statics = ["negate", "preIncrement", "postIncrement", "preDecrement", "postDecrement", "add", "addInt", "sub", "subInt", "intSub", "mul", "mulInt", "complement", "or", "orInt", "xor", "xorInt", "shr", "shrInt", "intShr", "shl", "shlInt", "intShl", "toFloat", "ucompare", "clamp"]

    @staticmethod
    def negate(this1):
        return (((~this1 + 1) + (2 ** 31)) % (2 ** 32) - (2 ** 31))

    @staticmethod
    def preIncrement(this1):
        this1 = (this1 + 1)
        x = this1
        this1 = ((x + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        return this1

    @staticmethod
    def postIncrement(this1):
        ret = this1
        this1 = (this1 + 1)
        this1 = ((this1 + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        return ret

    @staticmethod
    def preDecrement(this1):
        this1 = (this1 - 1)
        x = this1
        this1 = ((x + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        return this1

    @staticmethod
    def postDecrement(this1):
        ret = this1
        this1 = (this1 - 1)
        this1 = ((this1 + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        return ret

    @staticmethod
    def add(a,b):
        return (((a + b) + (2 ** 31)) % (2 ** 32) - (2 ** 31))

    @staticmethod
    def addInt(a,b):
        return (((a + b) + (2 ** 31)) % (2 ** 32) - (2 ** 31))

    @staticmethod
    def sub(a,b):
        return (((a - b) + (2 ** 31)) % (2 ** 32) - (2 ** 31))

    @staticmethod
    def subInt(a,b):
        return (((a - b) + (2 ** 31)) % (2 ** 32) - (2 ** 31))

    @staticmethod
    def intSub(a,b):
        return (((a - b) + (2 ** 31)) % (2 ** 32) - (2 ** 31))

    @staticmethod
    def mul(a,b):
        return ((((a * ((b & 65535))) + ((((((a * (HxOverrides.rshift(b, 16))) << 16)) + (2 ** 31)) % (2 ** 32) - (2 ** 31)))) + (2 ** 31)) % (2 ** 32) - (2 ** 31))

    @staticmethod
    def mulInt(a,b):
        return haxe__Int32_Int32_Impl_.mul(a,b)

    @staticmethod
    def complement(a):
        return ((~a + (2 ** 31)) % (2 ** 32) - (2 ** 31))

    @staticmethod
    def _hx_or(a,b):
        return ((((a | b)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))

    @staticmethod
    def orInt(a,b):
        return ((((a | b)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))

    @staticmethod
    def xor(a,b):
        return ((((a ^ b)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))

    @staticmethod
    def xorInt(a,b):
        return ((((a ^ b)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))

    @staticmethod
    def shr(a,b):
        return ((((a >> b)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))

    @staticmethod
    def shrInt(a,b):
        return ((((a >> b)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))

    @staticmethod
    def intShr(a,b):
        return ((((a >> b)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))

    @staticmethod
    def shl(a,b):
        return ((((a << b)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))

    @staticmethod
    def shlInt(a,b):
        return ((((a << b)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))

    @staticmethod
    def intShl(a,b):
        return ((((a << b)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))

    @staticmethod
    def toFloat(this1):
        return this1

    @staticmethod
    def ucompare(a,b):
        if (a < 0):
            if (b < 0):
                return (((((~b + (2 ** 31)) % (2 ** 32) - (2 ** 31)) - (((~a + (2 ** 31)) % (2 ** 32) - (2 ** 31)))) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            else:
                return 1
        if (b < 0):
            return -1
        else:
            return (((a - b) + (2 ** 31)) % (2 ** 32) - (2 ** 31))

    @staticmethod
    def clamp(x):
        return ((x + (2 ** 31)) % (2 ** 32) - (2 ** 31))


class haxe__Int64_Int64_Impl_:
    _hx_class_name = "haxe._Int64.Int64_Impl_"
    __slots__ = ()
    _hx_statics = ["_new", "copy", "make", "ofInt", "toInt", "is", "isInt64", "getHigh", "getLow", "isNeg", "isZero", "compare", "ucompare", "toStr", "toString", "parseString", "fromFloat", "divMod", "neg", "preIncrement", "postIncrement", "preDecrement", "postDecrement", "add", "addInt", "sub", "subInt", "intSub", "mul", "mulInt", "div", "divInt", "intDiv", "mod", "modInt", "intMod", "eq", "eqInt", "neq", "neqInt", "lt", "ltInt", "intLt", "lte", "lteInt", "intLte", "gt", "gtInt", "intGt", "gte", "gteInt", "intGte", "complement", "and", "or", "xor", "shl", "shr", "ushr", "get_high", "set_high", "get_low", "set_low"]
    high = None
    low = None

    @staticmethod
    def _new(x):
        this1 = x
        return this1

    @staticmethod
    def copy(this1):
        this2 = haxe__Int64____Int64(this1.high,this1.low)
        return this2

    @staticmethod
    def make(high,low):
        this1 = haxe__Int64____Int64(high,low)
        return this1

    @staticmethod
    def ofInt(x):
        this1 = haxe__Int64____Int64((x >> 31),x)
        return this1

    @staticmethod
    def toInt(x):
        if (x.high != ((((x.low >> 31)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))):
            raise haxe_Exception.thrown("Overflow")
        return x.low

    @staticmethod
    def _hx_is(val):
        return Std.isOfType(val,haxe__Int64____Int64)

    @staticmethod
    def isInt64(val):
        return Std.isOfType(val,haxe__Int64____Int64)

    @staticmethod
    def getHigh(x):
        return x.high

    @staticmethod
    def getLow(x):
        return x.low

    @staticmethod
    def isNeg(x):
        return (x.high < 0)

    @staticmethod
    def isZero(x):
        b_high = 0
        b_low = 0
        if (x.high == b_high):
            return (x.low == b_low)
        else:
            return False

    @staticmethod
    def compare(a,b):
        v = (((a.high - b.high) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (v == 0):
            v = haxe__Int32_Int32_Impl_.ucompare(a.low,b.low)
        if (a.high < 0):
            if (b.high < 0):
                return v
            else:
                return -1
        elif (b.high >= 0):
            return v
        else:
            return 1

    @staticmethod
    def ucompare(a,b):
        v = haxe__Int32_Int32_Impl_.ucompare(a.high,b.high)
        if (v != 0):
            return v
        else:
            return haxe__Int32_Int32_Impl_.ucompare(a.low,b.low)

    @staticmethod
    def toStr(x):
        return haxe__Int64_Int64_Impl_.toString(x)

    @staticmethod
    def toString(this1):
        i = this1
        b_high = 0
        b_low = 0
        if ((i.high == b_high) and ((i.low == b_low))):
            return "0"
        _hx_str = ""
        neg = False
        if (i.high < 0):
            neg = True
        this1 = haxe__Int64____Int64(0,10)
        ten = this1
        while True:
            b_high = 0
            b_low = 0
            if (not (((i.high != b_high) or ((i.low != b_low))))):
                break
            r = haxe__Int64_Int64_Impl_.divMod(i,ten)
            if (r.modulus.high < 0):
                x = r.modulus
                high = ((~x.high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                low = (((~x.low + 1) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                if (low == 0):
                    ret = high
                    high = (high + 1)
                    high = ((high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                this_high = high
                this_low = low
                _hx_str = (Std.string(this_low) + ("null" if _hx_str is None else _hx_str))
                x1 = r.quotient
                high1 = ((~x1.high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                low1 = (((~x1.low + 1) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                if (low1 == 0):
                    ret1 = high1
                    high1 = (high1 + 1)
                    high1 = ((high1 + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                this1 = haxe__Int64____Int64(high1,low1)
                i = this1
            else:
                _hx_str = (Std.string(r.modulus.low) + ("null" if _hx_str is None else _hx_str))
                i = r.quotient
        if neg:
            _hx_str = ("-" + ("null" if _hx_str is None else _hx_str))
        return _hx_str

    @staticmethod
    def parseString(sParam):
        return haxe_Int64Helper.parseString(sParam)

    @staticmethod
    def fromFloat(f):
        return haxe_Int64Helper.fromFloat(f)

    @staticmethod
    def divMod(dividend,divisor):
        if (divisor.high == 0):
            _g = divisor.low
            if (_g == 0):
                raise haxe_Exception.thrown("divide by zero")
            elif (_g == 1):
                this1 = haxe__Int64____Int64(dividend.high,dividend.low)
                this2 = haxe__Int64____Int64(0,0)
                return _hx_AnonObject({'quotient': this1, 'modulus': this2})
            else:
                pass
        divSign = ((dividend.high < 0) != ((divisor.high < 0)))
        modulus = None
        if (dividend.high < 0):
            high = ((~dividend.high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            low = (((~dividend.low + 1) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            if (low == 0):
                ret = high
                high = (high + 1)
                high = ((high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            this1 = haxe__Int64____Int64(high,low)
            modulus = this1
        else:
            this1 = haxe__Int64____Int64(dividend.high,dividend.low)
            modulus = this1
        if (divisor.high < 0):
            high = ((~divisor.high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            low = (((~divisor.low + 1) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            if (low == 0):
                ret = high
                high = (high + 1)
                high = ((high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            this1 = haxe__Int64____Int64(high,low)
            divisor = this1
        this1 = haxe__Int64____Int64(0,0)
        quotient = this1
        this1 = haxe__Int64____Int64(0,1)
        mask = this1
        while (not ((divisor.high < 0))):
            v = haxe__Int32_Int32_Impl_.ucompare(divisor.high,modulus.high)
            cmp = (v if ((v != 0)) else haxe__Int32_Int32_Impl_.ucompare(divisor.low,modulus.low))
            b = 1
            b = (b & 63)
            if (b == 0):
                this1 = haxe__Int64____Int64(divisor.high,divisor.low)
                divisor = this1
            elif (b < 32):
                this2 = haxe__Int64____Int64(((((((((divisor.high << b)) + (2 ** 31)) % (2 ** 32) - (2 ** 31)) | HxOverrides.rshift(divisor.low, ((32 - b))))) + (2 ** 31)) % (2 ** 32) - (2 ** 31)),((((divisor.low << b)) + (2 ** 31)) % (2 ** 32) - (2 ** 31)))
                divisor = this2
            else:
                this3 = haxe__Int64____Int64(((((divisor.low << ((b - 32)))) + (2 ** 31)) % (2 ** 32) - (2 ** 31)),0)
                divisor = this3
            b1 = 1
            b1 = (b1 & 63)
            if (b1 == 0):
                this4 = haxe__Int64____Int64(mask.high,mask.low)
                mask = this4
            elif (b1 < 32):
                this5 = haxe__Int64____Int64(((((((((mask.high << b1)) + (2 ** 31)) % (2 ** 32) - (2 ** 31)) | HxOverrides.rshift(mask.low, ((32 - b1))))) + (2 ** 31)) % (2 ** 32) - (2 ** 31)),((((mask.low << b1)) + (2 ** 31)) % (2 ** 32) - (2 ** 31)))
                mask = this5
            else:
                this6 = haxe__Int64____Int64(((((mask.low << ((b1 - 32)))) + (2 ** 31)) % (2 ** 32) - (2 ** 31)),0)
                mask = this6
            if (cmp >= 0):
                break
        while True:
            b_high = 0
            b_low = 0
            if (not (((mask.high != b_high) or ((mask.low != b_low))))):
                break
            v = haxe__Int32_Int32_Impl_.ucompare(modulus.high,divisor.high)
            if (((v if ((v != 0)) else haxe__Int32_Int32_Impl_.ucompare(modulus.low,divisor.low))) >= 0):
                this1 = haxe__Int64____Int64(((((quotient.high | mask.high)) + (2 ** 31)) % (2 ** 32) - (2 ** 31)),((((quotient.low | mask.low)) + (2 ** 31)) % (2 ** 32) - (2 ** 31)))
                quotient = this1
                high = (((modulus.high - divisor.high) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                low = (((modulus.low - divisor.low) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                if (haxe__Int32_Int32_Impl_.ucompare(modulus.low,divisor.low) < 0):
                    ret = high
                    high = (high - 1)
                    high = ((high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                this2 = haxe__Int64____Int64(high,low)
                modulus = this2
            b = 1
            b = (b & 63)
            if (b == 0):
                this3 = haxe__Int64____Int64(mask.high,mask.low)
                mask = this3
            elif (b < 32):
                this4 = haxe__Int64____Int64(HxOverrides.rshift(mask.high, b),((((((((mask.high << ((32 - b)))) + (2 ** 31)) % (2 ** 32) - (2 ** 31)) | HxOverrides.rshift(mask.low, b))) + (2 ** 31)) % (2 ** 32) - (2 ** 31)))
                mask = this4
            else:
                this5 = haxe__Int64____Int64(0,HxOverrides.rshift(mask.high, ((b - 32))))
                mask = this5
            b1 = 1
            b1 = (b1 & 63)
            if (b1 == 0):
                this6 = haxe__Int64____Int64(divisor.high,divisor.low)
                divisor = this6
            elif (b1 < 32):
                this7 = haxe__Int64____Int64(HxOverrides.rshift(divisor.high, b1),((((((((divisor.high << ((32 - b1)))) + (2 ** 31)) % (2 ** 32) - (2 ** 31)) | HxOverrides.rshift(divisor.low, b1))) + (2 ** 31)) % (2 ** 32) - (2 ** 31)))
                divisor = this7
            else:
                this8 = haxe__Int64____Int64(0,HxOverrides.rshift(divisor.high, ((b1 - 32))))
                divisor = this8
        if divSign:
            high = ((~quotient.high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            low = (((~quotient.low + 1) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            if (low == 0):
                ret = high
                high = (high + 1)
                high = ((high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            this1 = haxe__Int64____Int64(high,low)
            quotient = this1
        if (dividend.high < 0):
            high = ((~modulus.high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            low = (((~modulus.low + 1) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            if (low == 0):
                ret = high
                high = (high + 1)
                high = ((high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            this1 = haxe__Int64____Int64(high,low)
            modulus = this1
        return _hx_AnonObject({'quotient': quotient, 'modulus': modulus})

    @staticmethod
    def neg(x):
        high = ((~x.high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        low = (((~x.low + 1) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (low == 0):
            ret = high
            high = (high + 1)
            high = ((high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        this1 = haxe__Int64____Int64(high,low)
        return this1

    @staticmethod
    def preIncrement(this1):
        this2 = haxe__Int64____Int64(this1.high,this1.low)
        this1 = this2
        def _hx_local_1():
            _hx_local_0 = this1.low
            this1.low = (this1.low + 1)
            return _hx_local_0
        ret = _hx_local_1()
        this1.low = ((this1.low + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (this1.low == 0):
            def _hx_local_3():
                _hx_local_2 = this1.high
                this1.high = (this1.high + 1)
                return _hx_local_2
            ret = _hx_local_3()
            this1.high = ((this1.high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        return this1

    @staticmethod
    def postIncrement(this1):
        ret = this1
        this2 = haxe__Int64____Int64(this1.high,this1.low)
        this1 = this2
        def _hx_local_2():
            _hx_local_0 = this1
            _hx_local_1 = _hx_local_0.low
            _hx_local_0.low = (_hx_local_1 + 1)
            return _hx_local_1
        ret1 = _hx_local_2()
        this1.low = ((this1.low + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (this1.low == 0):
            def _hx_local_5():
                _hx_local_3 = this1
                _hx_local_4 = _hx_local_3.high
                _hx_local_3.high = (_hx_local_4 + 1)
                return _hx_local_4
            ret1 = _hx_local_5()
            this1.high = ((this1.high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        return ret

    @staticmethod
    def preDecrement(this1):
        this2 = haxe__Int64____Int64(this1.high,this1.low)
        this1 = this2
        if (this1.low == 0):
            def _hx_local_1():
                _hx_local_0 = this1.high
                this1.high = (this1.high - 1)
                return _hx_local_0
            ret = _hx_local_1()
            this1.high = ((this1.high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        def _hx_local_3():
            _hx_local_2 = this1.low
            this1.low = (this1.low - 1)
            return _hx_local_2
        ret = _hx_local_3()
        this1.low = ((this1.low + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        return this1

    @staticmethod
    def postDecrement(this1):
        ret = this1
        this2 = haxe__Int64____Int64(this1.high,this1.low)
        this1 = this2
        if (this1.low == 0):
            def _hx_local_2():
                _hx_local_0 = this1
                _hx_local_1 = _hx_local_0.high
                _hx_local_0.high = (_hx_local_1 - 1)
                return _hx_local_1
            ret1 = _hx_local_2()
            this1.high = ((this1.high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        def _hx_local_5():
            _hx_local_3 = this1
            _hx_local_4 = _hx_local_3.low
            _hx_local_3.low = (_hx_local_4 - 1)
            return _hx_local_4
        ret1 = _hx_local_5()
        this1.low = ((this1.low + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        return ret

    @staticmethod
    def add(a,b):
        high = (((a.high + b.high) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        low = (((a.low + b.low) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (haxe__Int32_Int32_Impl_.ucompare(low,a.low) < 0):
            ret = high
            high = (high + 1)
            high = ((high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        this1 = haxe__Int64____Int64(high,low)
        return this1

    @staticmethod
    def addInt(a,b):
        b_high = (b >> 31)
        b_low = b
        high = (((a.high + b_high) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        low = (((a.low + b_low) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (haxe__Int32_Int32_Impl_.ucompare(low,a.low) < 0):
            ret = high
            high = (high + 1)
            high = ((high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        this1 = haxe__Int64____Int64(high,low)
        return this1

    @staticmethod
    def sub(a,b):
        high = (((a.high - b.high) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        low = (((a.low - b.low) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (haxe__Int32_Int32_Impl_.ucompare(a.low,b.low) < 0):
            ret = high
            high = (high - 1)
            high = ((high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        this1 = haxe__Int64____Int64(high,low)
        return this1

    @staticmethod
    def subInt(a,b):
        b_high = (b >> 31)
        b_low = b
        high = (((a.high - b_high) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        low = (((a.low - b_low) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (haxe__Int32_Int32_Impl_.ucompare(a.low,b_low) < 0):
            ret = high
            high = (high - 1)
            high = ((high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        this1 = haxe__Int64____Int64(high,low)
        return this1

    @staticmethod
    def intSub(a,b):
        a_high = (a >> 31)
        a_low = a
        high = (((a_high - b.high) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        low = (((a_low - b.low) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (haxe__Int32_Int32_Impl_.ucompare(a_low,b.low) < 0):
            ret = high
            high = (high - 1)
            high = ((high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        this1 = haxe__Int64____Int64(high,low)
        return this1

    @staticmethod
    def mul(a,b):
        mask = 65535
        al = (a.low & mask)
        ah = HxOverrides.rshift(a.low, 16)
        bl = (b.low & mask)
        bh = HxOverrides.rshift(b.low, 16)
        p00 = haxe__Int32_Int32_Impl_.mul(al,bl)
        p10 = haxe__Int32_Int32_Impl_.mul(ah,bl)
        p01 = haxe__Int32_Int32_Impl_.mul(al,bh)
        p11 = haxe__Int32_Int32_Impl_.mul(ah,bh)
        low = p00
        high = ((((((p11 + (HxOverrides.rshift(p01, 16))) + (2 ** 31)) % (2 ** 32) - (2 ** 31)) + (HxOverrides.rshift(p10, 16))) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        p01 = ((((p01 << 16)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        low = (((low + p01) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (haxe__Int32_Int32_Impl_.ucompare(low,p01) < 0):
            ret = high
            high = (high + 1)
            high = ((high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        p10 = ((((p10 << 16)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        low = (((low + p10) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (haxe__Int32_Int32_Impl_.ucompare(low,p10) < 0):
            ret = high
            high = (high + 1)
            high = ((high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        high = (((high + ((((haxe__Int32_Int32_Impl_.mul(a.low,b.high) + haxe__Int32_Int32_Impl_.mul(a.high,b.low)) + (2 ** 31)) % (2 ** 32) - (2 ** 31)))) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        this1 = haxe__Int64____Int64(high,low)
        return this1

    @staticmethod
    def mulInt(a,b):
        b_high = (b >> 31)
        b_low = b
        mask = 65535
        al = (a.low & mask)
        ah = HxOverrides.rshift(a.low, 16)
        bl = (b_low & mask)
        bh = HxOverrides.rshift(b_low, 16)
        p00 = haxe__Int32_Int32_Impl_.mul(al,bl)
        p10 = haxe__Int32_Int32_Impl_.mul(ah,bl)
        p01 = haxe__Int32_Int32_Impl_.mul(al,bh)
        p11 = haxe__Int32_Int32_Impl_.mul(ah,bh)
        low = p00
        high = ((((((p11 + (HxOverrides.rshift(p01, 16))) + (2 ** 31)) % (2 ** 32) - (2 ** 31)) + (HxOverrides.rshift(p10, 16))) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        p01 = ((((p01 << 16)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        low = (((low + p01) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (haxe__Int32_Int32_Impl_.ucompare(low,p01) < 0):
            ret = high
            high = (high + 1)
            high = ((high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        p10 = ((((p10 << 16)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        low = (((low + p10) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (haxe__Int32_Int32_Impl_.ucompare(low,p10) < 0):
            ret = high
            high = (high + 1)
            high = ((high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        high = (((high + ((((haxe__Int32_Int32_Impl_.mul(a.low,b_high) + haxe__Int32_Int32_Impl_.mul(a.high,b_low)) + (2 ** 31)) % (2 ** 32) - (2 ** 31)))) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        this1 = haxe__Int64____Int64(high,low)
        return this1

    @staticmethod
    def div(a,b):
        return haxe__Int64_Int64_Impl_.divMod(a,b).quotient

    @staticmethod
    def divInt(a,b):
        this1 = haxe__Int64____Int64((b >> 31),b)
        return haxe__Int64_Int64_Impl_.divMod(a,this1).quotient

    @staticmethod
    def intDiv(a,b):
        this1 = haxe__Int64____Int64((a >> 31),a)
        x = haxe__Int64_Int64_Impl_.divMod(this1,b).quotient
        if (x.high != ((((x.low >> 31)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))):
            raise haxe_Exception.thrown("Overflow")
        x1 = x.low
        this1 = haxe__Int64____Int64((x1 >> 31),x1)
        return this1

    @staticmethod
    def mod(a,b):
        return haxe__Int64_Int64_Impl_.divMod(a,b).modulus

    @staticmethod
    def modInt(a,b):
        this1 = haxe__Int64____Int64((b >> 31),b)
        x = haxe__Int64_Int64_Impl_.divMod(a,this1).modulus
        if (x.high != ((((x.low >> 31)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))):
            raise haxe_Exception.thrown("Overflow")
        x1 = x.low
        this1 = haxe__Int64____Int64((x1 >> 31),x1)
        return this1

    @staticmethod
    def intMod(a,b):
        this1 = haxe__Int64____Int64((a >> 31),a)
        x = haxe__Int64_Int64_Impl_.divMod(this1,b).modulus
        if (x.high != ((((x.low >> 31)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))):
            raise haxe_Exception.thrown("Overflow")
        x1 = x.low
        this1 = haxe__Int64____Int64((x1 >> 31),x1)
        return this1

    @staticmethod
    def eq(a,b):
        if (a.high == b.high):
            return (a.low == b.low)
        else:
            return False

    @staticmethod
    def eqInt(a,b):
        b_high = (b >> 31)
        b_low = b
        if (a.high == b_high):
            return (a.low == b_low)
        else:
            return False

    @staticmethod
    def neq(a,b):
        if (a.high == b.high):
            return (a.low != b.low)
        else:
            return True

    @staticmethod
    def neqInt(a,b):
        b_high = (b >> 31)
        b_low = b
        if (a.high == b_high):
            return (a.low != b_low)
        else:
            return True

    @staticmethod
    def lt(a,b):
        v = (((a.high - b.high) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (v == 0):
            v = haxe__Int32_Int32_Impl_.ucompare(a.low,b.low)
        return ((((v if ((b.high < 0)) else -1) if ((a.high < 0)) else (v if ((b.high >= 0)) else 1))) < 0)

    @staticmethod
    def ltInt(a,b):
        b_high = (b >> 31)
        b_low = b
        v = (((a.high - b_high) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (v == 0):
            v = haxe__Int32_Int32_Impl_.ucompare(a.low,b_low)
        return ((((v if ((b_high < 0)) else -1) if ((a.high < 0)) else (v if ((b_high >= 0)) else 1))) < 0)

    @staticmethod
    def intLt(a,b):
        a_high = (a >> 31)
        a_low = a
        v = (((a_high - b.high) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (v == 0):
            v = haxe__Int32_Int32_Impl_.ucompare(a_low,b.low)
        return ((((v if ((b.high < 0)) else -1) if ((a_high < 0)) else (v if ((b.high >= 0)) else 1))) < 0)

    @staticmethod
    def lte(a,b):
        v = (((a.high - b.high) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (v == 0):
            v = haxe__Int32_Int32_Impl_.ucompare(a.low,b.low)
        return ((((v if ((b.high < 0)) else -1) if ((a.high < 0)) else (v if ((b.high >= 0)) else 1))) <= 0)

    @staticmethod
    def lteInt(a,b):
        b_high = (b >> 31)
        b_low = b
        v = (((a.high - b_high) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (v == 0):
            v = haxe__Int32_Int32_Impl_.ucompare(a.low,b_low)
        return ((((v if ((b_high < 0)) else -1) if ((a.high < 0)) else (v if ((b_high >= 0)) else 1))) <= 0)

    @staticmethod
    def intLte(a,b):
        a_high = (a >> 31)
        a_low = a
        v = (((a_high - b.high) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (v == 0):
            v = haxe__Int32_Int32_Impl_.ucompare(a_low,b.low)
        return ((((v if ((b.high < 0)) else -1) if ((a_high < 0)) else (v if ((b.high >= 0)) else 1))) <= 0)

    @staticmethod
    def gt(a,b):
        v = (((a.high - b.high) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (v == 0):
            v = haxe__Int32_Int32_Impl_.ucompare(a.low,b.low)
        return ((((v if ((b.high < 0)) else -1) if ((a.high < 0)) else (v if ((b.high >= 0)) else 1))) > 0)

    @staticmethod
    def gtInt(a,b):
        b_high = (b >> 31)
        b_low = b
        v = (((a.high - b_high) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (v == 0):
            v = haxe__Int32_Int32_Impl_.ucompare(a.low,b_low)
        return ((((v if ((b_high < 0)) else -1) if ((a.high < 0)) else (v if ((b_high >= 0)) else 1))) > 0)

    @staticmethod
    def intGt(a,b):
        a_high = (a >> 31)
        a_low = a
        v = (((a_high - b.high) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (v == 0):
            v = haxe__Int32_Int32_Impl_.ucompare(a_low,b.low)
        return ((((v if ((b.high < 0)) else -1) if ((a_high < 0)) else (v if ((b.high >= 0)) else 1))) > 0)

    @staticmethod
    def gte(a,b):
        v = (((a.high - b.high) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (v == 0):
            v = haxe__Int32_Int32_Impl_.ucompare(a.low,b.low)
        return ((((v if ((b.high < 0)) else -1) if ((a.high < 0)) else (v if ((b.high >= 0)) else 1))) >= 0)

    @staticmethod
    def gteInt(a,b):
        b_high = (b >> 31)
        b_low = b
        v = (((a.high - b_high) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (v == 0):
            v = haxe__Int32_Int32_Impl_.ucompare(a.low,b_low)
        return ((((v if ((b_high < 0)) else -1) if ((a.high < 0)) else (v if ((b_high >= 0)) else 1))) >= 0)

    @staticmethod
    def intGte(a,b):
        a_high = (a >> 31)
        a_low = a
        v = (((a_high - b.high) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
        if (v == 0):
            v = haxe__Int32_Int32_Impl_.ucompare(a_low,b.low)
        return ((((v if ((b.high < 0)) else -1) if ((a_high < 0)) else (v if ((b.high >= 0)) else 1))) >= 0)

    @staticmethod
    def complement(a):
        this1 = haxe__Int64____Int64(((~a.high + (2 ** 31)) % (2 ** 32) - (2 ** 31)),((~a.low + (2 ** 31)) % (2 ** 32) - (2 ** 31)))
        return this1

    @staticmethod
    def _hx_and(a,b):
        this1 = haxe__Int64____Int64((a.high & b.high),(a.low & b.low))
        return this1

    @staticmethod
    def _hx_or(a,b):
        this1 = haxe__Int64____Int64(((((a.high | b.high)) + (2 ** 31)) % (2 ** 32) - (2 ** 31)),((((a.low | b.low)) + (2 ** 31)) % (2 ** 32) - (2 ** 31)))
        return this1

    @staticmethod
    def xor(a,b):
        this1 = haxe__Int64____Int64(((((a.high ^ b.high)) + (2 ** 31)) % (2 ** 32) - (2 ** 31)),((((a.low ^ b.low)) + (2 ** 31)) % (2 ** 32) - (2 ** 31)))
        return this1

    @staticmethod
    def shl(a,b):
        b = (b & 63)
        if (b == 0):
            this1 = haxe__Int64____Int64(a.high,a.low)
            return this1
        elif (b < 32):
            this1 = haxe__Int64____Int64(((((((((a.high << b)) + (2 ** 31)) % (2 ** 32) - (2 ** 31)) | HxOverrides.rshift(a.low, ((32 - b))))) + (2 ** 31)) % (2 ** 32) - (2 ** 31)),((((a.low << b)) + (2 ** 31)) % (2 ** 32) - (2 ** 31)))
            return this1
        else:
            this1 = haxe__Int64____Int64(((((a.low << ((b - 32)))) + (2 ** 31)) % (2 ** 32) - (2 ** 31)),0)
            return this1

    @staticmethod
    def shr(a,b):
        b = (b & 63)
        if (b == 0):
            this1 = haxe__Int64____Int64(a.high,a.low)
            return this1
        elif (b < 32):
            this1 = haxe__Int64____Int64(((((a.high >> b)) + (2 ** 31)) % (2 ** 32) - (2 ** 31)),((((((((a.high << ((32 - b)))) + (2 ** 31)) % (2 ** 32) - (2 ** 31)) | HxOverrides.rshift(a.low, b))) + (2 ** 31)) % (2 ** 32) - (2 ** 31)))
            return this1
        else:
            this1 = haxe__Int64____Int64(((((a.high >> 31)) + (2 ** 31)) % (2 ** 32) - (2 ** 31)),((((a.high >> ((b - 32)))) + (2 ** 31)) % (2 ** 32) - (2 ** 31)))
            return this1

    @staticmethod
    def ushr(a,b):
        b = (b & 63)
        if (b == 0):
            this1 = haxe__Int64____Int64(a.high,a.low)
            return this1
        elif (b < 32):
            this1 = haxe__Int64____Int64(HxOverrides.rshift(a.high, b),((((((((a.high << ((32 - b)))) + (2 ** 31)) % (2 ** 32) - (2 ** 31)) | HxOverrides.rshift(a.low, b))) + (2 ** 31)) % (2 ** 32) - (2 ** 31)))
            return this1
        else:
            this1 = haxe__Int64____Int64(0,HxOverrides.rshift(a.high, ((b - 32))))
            return this1

    @staticmethod
    def get_high(this1):
        return this1.high

    @staticmethod
    def set_high(this1,x):
        def _hx_local_1():
            def _hx_local_0():
                this1.high = x
                return this1.high
            return _hx_local_0()
        return _hx_local_1()

    @staticmethod
    def get_low(this1):
        return this1.low

    @staticmethod
    def set_low(this1,x):
        def _hx_local_1():
            def _hx_local_0():
                this1.low = x
                return this1.low
            return _hx_local_0()
        return _hx_local_1()


class haxe__Int64____Int64:
    _hx_class_name = "haxe._Int64.___Int64"
    __slots__ = ("high", "low")
    _hx_fields = ["high", "low"]
    _hx_methods = ["toString"]

    def __init__(self,high,low):
        self.high = high
        self.low = low

    def toString(self):
        return haxe__Int64_Int64_Impl_.toString(self)

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.high = None
        _hx_o.low = None


class haxe_Int64Helper:
    _hx_class_name = "haxe.Int64Helper"
    __slots__ = ()
    _hx_statics = ["parseString", "fromFloat"]

    @staticmethod
    def parseString(sParam):
        base_high = 0
        base_low = 10
        this1 = haxe__Int64____Int64(0,0)
        current = this1
        this1 = haxe__Int64____Int64(0,1)
        multiplier = this1
        sIsNegative = False
        s = StringTools.trim(sParam)
        if ((("" if ((0 >= len(s))) else s[0])) == "-"):
            sIsNegative = True
            s = HxString.substring(s,1,len(s))
        _hx_len = len(s)
        _g = 0
        _g1 = _hx_len
        while (_g < _g1):
            i = _g
            _g = (_g + 1)
            digitInt = (HxString.charCodeAt(s,((_hx_len - 1) - i)) - 48)
            if ((digitInt < 0) or ((digitInt > 9))):
                raise haxe_Exception.thrown("NumberFormatError")
            if (digitInt != 0):
                digit_high = (digitInt >> 31)
                digit_low = digitInt
                if sIsNegative:
                    mask = 65535
                    al = (multiplier.low & mask)
                    ah = HxOverrides.rshift(multiplier.low, 16)
                    bl = (digit_low & mask)
                    bh = HxOverrides.rshift(digit_low, 16)
                    p00 = haxe__Int32_Int32_Impl_.mul(al,bl)
                    p10 = haxe__Int32_Int32_Impl_.mul(ah,bl)
                    p01 = haxe__Int32_Int32_Impl_.mul(al,bh)
                    p11 = haxe__Int32_Int32_Impl_.mul(ah,bh)
                    low = p00
                    high = ((((((p11 + (HxOverrides.rshift(p01, 16))) + (2 ** 31)) % (2 ** 32) - (2 ** 31)) + (HxOverrides.rshift(p10, 16))) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                    p01 = ((((p01 << 16)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                    low = (((low + p01) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                    if (haxe__Int32_Int32_Impl_.ucompare(low,p01) < 0):
                        ret = high
                        high = (high + 1)
                        high = ((high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                    p10 = ((((p10 << 16)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                    low = (((low + p10) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                    if (haxe__Int32_Int32_Impl_.ucompare(low,p10) < 0):
                        ret1 = high
                        high = (high + 1)
                        high = ((high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                    high = (((high + ((((haxe__Int32_Int32_Impl_.mul(multiplier.low,digit_high) + haxe__Int32_Int32_Impl_.mul(multiplier.high,digit_low)) + (2 ** 31)) % (2 ** 32) - (2 ** 31)))) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                    b_high = high
                    b_low = low
                    high1 = (((current.high - b_high) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                    low1 = (((current.low - b_low) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                    if (haxe__Int32_Int32_Impl_.ucompare(current.low,b_low) < 0):
                        ret2 = high1
                        high1 = (high1 - 1)
                        high1 = ((high1 + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                    this1 = haxe__Int64____Int64(high1,low1)
                    current = this1
                    if (not ((current.high < 0))):
                        raise haxe_Exception.thrown("NumberFormatError: Underflow")
                else:
                    mask1 = 65535
                    al1 = (multiplier.low & mask1)
                    ah1 = HxOverrides.rshift(multiplier.low, 16)
                    bl1 = (digit_low & mask1)
                    bh1 = HxOverrides.rshift(digit_low, 16)
                    p001 = haxe__Int32_Int32_Impl_.mul(al1,bl1)
                    p101 = haxe__Int32_Int32_Impl_.mul(ah1,bl1)
                    p011 = haxe__Int32_Int32_Impl_.mul(al1,bh1)
                    p111 = haxe__Int32_Int32_Impl_.mul(ah1,bh1)
                    low2 = p001
                    high2 = ((((((p111 + (HxOverrides.rshift(p011, 16))) + (2 ** 31)) % (2 ** 32) - (2 ** 31)) + (HxOverrides.rshift(p101, 16))) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                    p011 = ((((p011 << 16)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                    low2 = (((low2 + p011) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                    if (haxe__Int32_Int32_Impl_.ucompare(low2,p011) < 0):
                        ret3 = high2
                        high2 = (high2 + 1)
                        high2 = ((high2 + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                    p101 = ((((p101 << 16)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                    low2 = (((low2 + p101) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                    if (haxe__Int32_Int32_Impl_.ucompare(low2,p101) < 0):
                        ret4 = high2
                        high2 = (high2 + 1)
                        high2 = ((high2 + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                    high2 = (((high2 + ((((haxe__Int32_Int32_Impl_.mul(multiplier.low,digit_high) + haxe__Int32_Int32_Impl_.mul(multiplier.high,digit_low)) + (2 ** 31)) % (2 ** 32) - (2 ** 31)))) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                    b_high1 = high2
                    b_low1 = low2
                    high3 = (((current.high + b_high1) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                    low3 = (((current.low + b_low1) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                    if (haxe__Int32_Int32_Impl_.ucompare(low3,current.low) < 0):
                        ret5 = high3
                        high3 = (high3 + 1)
                        high3 = ((high3 + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                    this2 = haxe__Int64____Int64(high3,low3)
                    current = this2
                    if (current.high < 0):
                        raise haxe_Exception.thrown("NumberFormatError: Overflow")
            mask2 = 65535
            al2 = (multiplier.low & mask2)
            ah2 = HxOverrides.rshift(multiplier.low, 16)
            bl2 = (base_low & mask2)
            bh2 = HxOverrides.rshift(base_low, 16)
            p002 = haxe__Int32_Int32_Impl_.mul(al2,bl2)
            p102 = haxe__Int32_Int32_Impl_.mul(ah2,bl2)
            p012 = haxe__Int32_Int32_Impl_.mul(al2,bh2)
            p112 = haxe__Int32_Int32_Impl_.mul(ah2,bh2)
            low4 = p002
            high4 = ((((((p112 + (HxOverrides.rshift(p012, 16))) + (2 ** 31)) % (2 ** 32) - (2 ** 31)) + (HxOverrides.rshift(p102, 16))) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            p012 = ((((p012 << 16)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            low4 = (((low4 + p012) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            if (haxe__Int32_Int32_Impl_.ucompare(low4,p012) < 0):
                ret6 = high4
                high4 = (high4 + 1)
                high4 = ((high4 + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            p102 = ((((p102 << 16)) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            low4 = (((low4 + p102) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            if (haxe__Int32_Int32_Impl_.ucompare(low4,p102) < 0):
                ret7 = high4
                high4 = (high4 + 1)
                high4 = ((high4 + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            high4 = (((high4 + ((((haxe__Int32_Int32_Impl_.mul(multiplier.low,base_high) + haxe__Int32_Int32_Impl_.mul(multiplier.high,base_low)) + (2 ** 31)) % (2 ** 32) - (2 ** 31)))) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            this3 = haxe__Int64____Int64(high4,low4)
            multiplier = this3
        return current

    @staticmethod
    def fromFloat(f):
        if (python_lib_Math.isnan(f) or (not ((((f != Math.POSITIVE_INFINITY) and ((f != Math.NEGATIVE_INFINITY))) and (not python_lib_Math.isnan(f)))))):
            raise haxe_Exception.thrown("Number is NaN or Infinite")
        noFractions = (f - (HxOverrides.modf(f, 1)))
        if (noFractions > 9007199254740991):
            raise haxe_Exception.thrown("Conversion overflow")
        if (noFractions < -9007199254740991):
            raise haxe_Exception.thrown("Conversion underflow")
        this1 = haxe__Int64____Int64(0,0)
        result = this1
        neg = (noFractions < 0)
        rest = (-noFractions if neg else noFractions)
        i = 0
        while (rest >= 1):
            curr = HxOverrides.modf(rest, 2)
            rest = (rest / 2)
            if (curr >= 1):
                a_high = 0
                a_low = 1
                b = i
                b = (b & 63)
                b1 = None
                if (b == 0):
                    this1 = haxe__Int64____Int64(a_high,a_low)
                    b1 = this1
                elif (b < 32):
                    this2 = haxe__Int64____Int64(((((((((a_high << b)) + (2 ** 31)) % (2 ** 32) - (2 ** 31)) | HxOverrides.rshift(a_low, ((32 - b))))) + (2 ** 31)) % (2 ** 32) - (2 ** 31)),((((a_low << b)) + (2 ** 31)) % (2 ** 32) - (2 ** 31)))
                    b1 = this2
                else:
                    this3 = haxe__Int64____Int64(((((a_low << ((b - 32)))) + (2 ** 31)) % (2 ** 32) - (2 ** 31)),0)
                    b1 = this3
                high = (((result.high + b1.high) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                low = (((result.low + b1.low) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                if (haxe__Int32_Int32_Impl_.ucompare(low,result.low) < 0):
                    ret = high
                    high = (high + 1)
                    high = ((high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
                this4 = haxe__Int64____Int64(high,low)
                result = this4
            i = (i + 1)
        if neg:
            high = ((~result.high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            low = (((~result.low + 1) + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            if (low == 0):
                ret = high
                high = (high + 1)
                high = ((high + (2 ** 31)) % (2 ** 32) - (2 ** 31))
            this1 = haxe__Int64____Int64(high,low)
            result = this1
        return result


class haxe_NativeStackTrace:
    _hx_class_name = "haxe.NativeStackTrace"
    __slots__ = ()
    _hx_statics = ["saveStack", "callStack", "exceptionStack", "toHaxe"]

    @staticmethod
    def saveStack(exception):
        pass

    @staticmethod
    def callStack():
        infos = python_lib_Traceback.extract_stack()
        if (len(infos) != 0):
            infos.pop()
        infos.reverse()
        return infos

    @staticmethod
    def exceptionStack():
        exc = python_lib_Sys.exc_info()
        if (exc[2] is not None):
            infos = python_lib_Traceback.extract_tb(exc[2])
            infos.reverse()
            return infos
        else:
            return []

    @staticmethod
    def toHaxe(native,skip = None):
        if (skip is None):
            skip = 0
        stack = []
        _g = 0
        _g1 = len(native)
        while (_g < _g1):
            i = _g
            _g = (_g + 1)
            if (skip > i):
                continue
            elem = (native[i] if i >= 0 and i < len(native) else None)
            x = haxe_StackItem.FilePos(haxe_StackItem.Method(None,elem[2]),elem[0],elem[1])
            stack.append(x)
        return stack


class haxe__Rest_Rest_Impl_:
    _hx_class_name = "haxe._Rest.Rest_Impl_"
    __slots__ = ()
    _hx_statics = ["get_length", "of", "_new", "get", "toArray", "iterator", "keyValueIterator", "append", "prepend", "toString"]
    length = None

    @staticmethod
    def get_length(this1):
        return len(this1)

    @staticmethod
    def of(array):
        this1 = array
        return this1

    @staticmethod
    def _new(array):
        this1 = array
        return this1

    @staticmethod
    def get(this1,index):
        return (this1[index] if index >= 0 and index < len(this1) else None)

    @staticmethod
    def toArray(this1):
        return list(this1)

    @staticmethod
    def iterator(this1):
        return haxe_iterators_RestIterator(this1)

    @staticmethod
    def keyValueIterator(this1):
        return haxe_iterators_RestKeyValueIterator(this1)

    @staticmethod
    def append(this1,item):
        result = list(this1)
        result.append(item)
        this1 = result
        return this1

    @staticmethod
    def prepend(this1,item):
        result = list(this1)
        result.insert(0, item)
        this1 = result
        return this1

    @staticmethod
    def toString(this1):
        return (("[" + HxOverrides.stringOrNull(",".join([python_Boot.toString1(x1,'') for x1 in this1]))) + "]")


class haxe_ValueException(haxe_Exception):
    _hx_class_name = "haxe.ValueException"
    __slots__ = ("value",)
    _hx_fields = ["value"]
    _hx_methods = ["unwrap"]
    _hx_statics = []
    _hx_interfaces = []
    _hx_super = haxe_Exception


    def __init__(self,value,previous = None,native = None):
        self.value = None
        super().__init__(Std.string(value),previous,native)
        self.value = value
        _hx_local_0 = self
        _hx_local_1 = _hx_local_0._hx___skipStack
        _hx_local_0._hx___skipStack = (_hx_local_1 + 1)
        _hx_local_1

    def unwrap(self):
        return self.value

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.value = None


class haxe_ds_BalancedTree:
    _hx_class_name = "haxe.ds.BalancedTree"
    __slots__ = ("root",)
    _hx_fields = ["root"]
    _hx_methods = ["set", "get", "remove", "exists", "iterator", "keyValueIterator", "keys", "copy", "setLoop", "removeLoop", "keysLoop", "merge", "minBinding", "removeMinBinding", "balance", "compare", "toString", "clear"]
    _hx_statics = ["iteratorLoop"]
    _hx_interfaces = [haxe_IMap]

    def __init__(self):
        self.root = None

    def set(self,key,value):
        self.root = self.setLoop(key,value,self.root)

    def get(self,key):
        node = self.root
        while (node is not None):
            c = self.compare(key,node.key)
            if (c == 0):
                return node.value
            if (c < 0):
                node = node.left
            else:
                node = node.right
        return None

    def remove(self,key):
        try:
            self.root = self.removeLoop(key,self.root)
            return True
        except BaseException as _g:
            None
            if Std.isOfType(haxe_Exception.caught(_g).unwrap(),str):
                return False
            else:
                raise _g

    def exists(self,key):
        node = self.root
        while (node is not None):
            c = self.compare(key,node.key)
            if (c == 0):
                return True
            elif (c < 0):
                node = node.left
            else:
                node = node.right
        return False

    def iterator(self):
        ret = []
        haxe_ds_BalancedTree.iteratorLoop(self.root,ret)
        return haxe_iterators_ArrayIterator(ret)

    def keyValueIterator(self):
        return haxe_iterators_MapKeyValueIterator(self)

    def keys(self):
        ret = []
        self.keysLoop(self.root,ret)
        return haxe_iterators_ArrayIterator(ret)

    def copy(self):
        copied = haxe_ds_BalancedTree()
        copied.root = self.root
        return copied

    def setLoop(self,k,v,node):
        if (node is None):
            return haxe_ds_TreeNode(None,k,v,None)
        c = self.compare(k,node.key)
        if (c == 0):
            return haxe_ds_TreeNode(node.left,k,v,node.right,(0 if ((node is None)) else node._height))
        elif (c < 0):
            nl = self.setLoop(k,v,node.left)
            return self.balance(nl,node.key,node.value,node.right)
        else:
            nr = self.setLoop(k,v,node.right)
            return self.balance(node.left,node.key,node.value,nr)

    def removeLoop(self,k,node):
        if (node is None):
            raise haxe_Exception.thrown("Not_found")
        c = self.compare(k,node.key)
        if (c == 0):
            return self.merge(node.left,node.right)
        elif (c < 0):
            return self.balance(self.removeLoop(k,node.left),node.key,node.value,node.right)
        else:
            return self.balance(node.left,node.key,node.value,self.removeLoop(k,node.right))

    def keysLoop(self,node,acc):
        if (node is not None):
            self.keysLoop(node.left,acc)
            x = node.key
            acc.append(x)
            self.keysLoop(node.right,acc)

    def merge(self,t1,t2):
        if (t1 is None):
            return t2
        if (t2 is None):
            return t1
        t = self.minBinding(t2)
        return self.balance(t1,t.key,t.value,self.removeMinBinding(t2))

    def minBinding(self,t):
        if (t is None):
            raise haxe_Exception.thrown("Not_found")
        elif (t.left is None):
            return t
        else:
            return self.minBinding(t.left)

    def removeMinBinding(self,t):
        if (t.left is None):
            return t.right
        else:
            return self.balance(self.removeMinBinding(t.left),t.key,t.value,t.right)

    def balance(self,l,k,v,r):
        hl = (0 if ((l is None)) else l._height)
        hr = (0 if ((r is None)) else r._height)
        if (hl > ((hr + 2))):
            _this = l.left
            _this1 = l.right
            if (((0 if ((_this is None)) else _this._height)) >= ((0 if ((_this1 is None)) else _this1._height))):
                return haxe_ds_TreeNode(l.left,l.key,l.value,haxe_ds_TreeNode(l.right,k,v,r))
            else:
                return haxe_ds_TreeNode(haxe_ds_TreeNode(l.left,l.key,l.value,l.right.left),l.right.key,l.right.value,haxe_ds_TreeNode(l.right.right,k,v,r))
        elif (hr > ((hl + 2))):
            _this = r.right
            _this1 = r.left
            if (((0 if ((_this is None)) else _this._height)) > ((0 if ((_this1 is None)) else _this1._height))):
                return haxe_ds_TreeNode(haxe_ds_TreeNode(l,k,v,r.left),r.key,r.value,r.right)
            else:
                return haxe_ds_TreeNode(haxe_ds_TreeNode(l,k,v,r.left.left),r.left.key,r.left.value,haxe_ds_TreeNode(r.left.right,r.key,r.value,r.right))
        else:
            return haxe_ds_TreeNode(l,k,v,r,(((hl if ((hl > hr)) else hr)) + 1))

    def compare(self,k1,k2):
        return Reflect.compare(k1,k2)

    def toString(self):
        if (self.root is None):
            return "{}"
        else:
            return (("{" + HxOverrides.stringOrNull(self.root.toString())) + "}")

    def clear(self):
        self.root = None

    @staticmethod
    def iteratorLoop(node,acc):
        if (node is not None):
            haxe_ds_BalancedTree.iteratorLoop(node.left,acc)
            x = node.value
            acc.append(x)
            haxe_ds_BalancedTree.iteratorLoop(node.right,acc)

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.root = None


class haxe_ds_TreeNode:
    _hx_class_name = "haxe.ds.TreeNode"
    __slots__ = ("left", "right", "key", "value", "_height")
    _hx_fields = ["left", "right", "key", "value", "_height"]
    _hx_methods = ["toString"]

    def __init__(self,l,k,v,r,h = None):
        if (h is None):
            h = -1
        self._height = None
        self.left = l
        self.key = k
        self.value = v
        self.right = r
        if (h == -1):
            tmp = None
            _this = self.left
            _this1 = self.right
            if (((0 if ((_this is None)) else _this._height)) > ((0 if ((_this1 is None)) else _this1._height))):
                _this = self.left
                tmp = (0 if ((_this is None)) else _this._height)
            else:
                _this = self.right
                tmp = (0 if ((_this is None)) else _this._height)
            self._height = (tmp + 1)
        else:
            self._height = h

    def toString(self):
        return ((HxOverrides.stringOrNull((("" if ((self.left is None)) else (HxOverrides.stringOrNull(self.left.toString()) + ", ")))) + (((("" + Std.string(self.key)) + "=") + Std.string(self.value)))) + HxOverrides.stringOrNull((("" if ((self.right is None)) else (", " + HxOverrides.stringOrNull(self.right.toString()))))))

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.left = None
        _hx_o.right = None
        _hx_o.key = None
        _hx_o.value = None
        _hx_o._height = None


class haxe_ds_EnumValueMap(haxe_ds_BalancedTree):
    _hx_class_name = "haxe.ds.EnumValueMap"
    __slots__ = ()
    _hx_fields = []
    _hx_methods = ["compare", "compareArgs", "compareArg", "copy"]
    _hx_statics = []
    _hx_interfaces = [haxe_IMap]
    _hx_super = haxe_ds_BalancedTree


    def __init__(self):
        super().__init__()

    def compare(self,k1,k2):
        d = (k1.index - k2.index)
        if (d != 0):
            return d
        p1 = list(k1.params)
        p2 = list(k2.params)
        if ((len(p1) == 0) and ((len(p2) == 0))):
            return 0
        return self.compareArgs(p1,p2)

    def compareArgs(self,a1,a2):
        ld = (len(a1) - len(a2))
        if (ld != 0):
            return ld
        _g = 0
        _g1 = len(a1)
        while (_g < _g1):
            i = _g
            _g = (_g + 1)
            d = self.compareArg((a1[i] if i >= 0 and i < len(a1) else None),(a2[i] if i >= 0 and i < len(a2) else None))
            if (d != 0):
                return d
        return 0

    def compareArg(self,v1,v2):
        if (Reflect.isEnumValue(v1) and Reflect.isEnumValue(v2)):
            return self.compare(v1,v2)
        elif (Std.isOfType(v1,list) and Std.isOfType(v2,list)):
            return self.compareArgs(v1,v2)
        else:
            return Reflect.compare(v1,v2)

    def copy(self):
        copied = haxe_ds_EnumValueMap()
        copied.root = self.root
        return copied

    @staticmethod
    def _hx_empty_init(_hx_o):        pass


class haxe_ds__HashMap_HashMap_Impl_:
    _hx_class_name = "haxe.ds._HashMap.HashMap_Impl_"
    __slots__ = ()
    _hx_statics = ["_new", "set", "get", "exists", "remove", "keys", "copy", "iterator", "keyValueIterator", "clear"]

    @staticmethod
    def _new():
        this1 = haxe_ds__HashMap_HashMapData()
        return this1

    @staticmethod
    def set(this1,k,v):
        this1.keys.set(k.hashCode(),k)
        this1.values.set(k.hashCode(),v)

    @staticmethod
    def get(this1,k):
        _this = this1.values
        key = k.hashCode()
        return _this.h.get(key,None)

    @staticmethod
    def exists(this1,k):
        _this = this1.values
        return (k.hashCode() in _this.h)

    @staticmethod
    def remove(this1,k):
        this1.values.remove(k.hashCode())
        return this1.keys.remove(k.hashCode())

    @staticmethod
    def keys(this1):
        return this1.keys.iterator()

    @staticmethod
    def copy(this1):
        copied = haxe_ds__HashMap_HashMapData()
        copied.keys = this1.keys.copy()
        copied.values = this1.values.copy()
        return copied

    @staticmethod
    def iterator(this1):
        return this1.values.iterator()

    @staticmethod
    def keyValueIterator(this1):
        return haxe_iterators_HashMapKeyValueIterator(this1)

    @staticmethod
    def clear(this1):
        this1.keys.h.clear()
        this1.values.h.clear()


class haxe_ds__HashMap_HashMapData:
    _hx_class_name = "haxe.ds._HashMap.HashMapData"
    __slots__ = ("keys", "values")
    _hx_fields = ["keys", "values"]

    def __init__(self):
        self.keys = haxe_ds_IntMap()
        self.values = haxe_ds_IntMap()

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.keys = None
        _hx_o.values = None


class haxe_ds_IntMap:
    _hx_class_name = "haxe.ds.IntMap"
    __slots__ = ("h",)
    _hx_fields = ["h"]
    _hx_methods = ["set", "get", "exists", "remove", "keys", "iterator", "keyValueIterator", "copy", "toString", "clear"]
    _hx_interfaces = [haxe_IMap]

    def __init__(self):
        self.h = dict()

    def set(self,key,value):
        self.h[key] = value

    def get(self,key):
        return self.h.get(key,None)

    def exists(self,key):
        return (key in self.h)

    def remove(self,key):
        if (not (key in self.h)):
            return False
        del self.h[key]
        return True

    def keys(self):
        return python_HaxeIterator(iter(self.h.keys()))

    def iterator(self):
        return python_HaxeIterator(iter(self.h.values()))

    def keyValueIterator(self):
        return haxe_iterators_MapKeyValueIterator(self)

    def copy(self):
        copied = haxe_ds_IntMap()
        key = self.keys()
        while key.hasNext():
            key1 = key.next()
            copied.set(key1,self.h.get(key1,None))
        return copied

    def toString(self):
        s_b = python_lib_io_StringIO()
        s_b.write("{")
        it = self.keys()
        i = it
        while i.hasNext():
            i1 = i.next()
            s_b.write(Std.string(i1))
            s_b.write(" => ")
            s_b.write(Std.string(Std.string(self.h.get(i1,None))))
            if it.hasNext():
                s_b.write(", ")
        s_b.write("}")
        return s_b.getvalue()

    def clear(self):
        self.h.clear()

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.h = None


class haxe_ds__Map_Map_Impl_:
    _hx_class_name = "haxe.ds._Map.Map_Impl_"
    __slots__ = ()
    _hx_statics = ["set", "get", "exists", "remove", "keys", "iterator", "keyValueIterator", "copy", "toString", "clear", "arrayWrite", "toStringMap", "toIntMap", "toEnumValueMapMap", "toObjectMap", "fromStringMap", "fromIntMap", "fromObjectMap"]

    @staticmethod
    def set(this1,key,value):
        this1.set(key,value)

    @staticmethod
    def get(this1,key):
        return this1.get(key)

    @staticmethod
    def exists(this1,key):
        return this1.exists(key)

    @staticmethod
    def remove(this1,key):
        return this1.remove(key)

    @staticmethod
    def keys(this1):
        return this1.keys()

    @staticmethod
    def iterator(this1):
        return this1.iterator()

    @staticmethod
    def keyValueIterator(this1):
        return this1.keyValueIterator()

    @staticmethod
    def copy(this1):
        return this1.copy()

    @staticmethod
    def toString(this1):
        return this1.toString()

    @staticmethod
    def clear(this1):
        this1.clear()

    @staticmethod
    def arrayWrite(this1,k,v):
        this1.set(k,v)
        return v

    @staticmethod
    def toStringMap(t):
        return haxe_ds_StringMap()

    @staticmethod
    def toIntMap(t):
        return haxe_ds_IntMap()

    @staticmethod
    def toEnumValueMapMap(t):
        return haxe_ds_EnumValueMap()

    @staticmethod
    def toObjectMap(t):
        return haxe_ds_ObjectMap()

    @staticmethod
    def fromStringMap(_hx_map):
        return _hx_map

    @staticmethod
    def fromIntMap(_hx_map):
        return _hx_map

    @staticmethod
    def fromObjectMap(_hx_map):
        return _hx_map


class haxe_ds_ObjectMap:
    _hx_class_name = "haxe.ds.ObjectMap"
    __slots__ = ("h",)
    _hx_fields = ["h"]
    _hx_methods = ["set", "get", "exists", "remove", "keys", "iterator", "keyValueIterator", "copy", "toString", "clear"]
    _hx_interfaces = [haxe_IMap]

    def __init__(self):
        self.h = dict()

    def set(self,key,value):
        self.h[key] = value

    def get(self,key):
        return self.h.get(key,None)

    def exists(self,key):
        return (key in self.h)

    def remove(self,key):
        r = (key in self.h)
        if r:
            del self.h[key]
        return r

    def keys(self):
        return python_HaxeIterator(iter(self.h.keys()))

    def iterator(self):
        return python_HaxeIterator(iter(self.h.values()))

    def keyValueIterator(self):
        return haxe_iterators_MapKeyValueIterator(self)

    def copy(self):
        copied = haxe_ds_ObjectMap()
        key = self.keys()
        while key.hasNext():
            key1 = key.next()
            copied.set(key1,self.h.get(key1,None))
        return copied

    def toString(self):
        s_b = python_lib_io_StringIO()
        s_b.write("{")
        it = self.keys()
        i = it
        while i.hasNext():
            i1 = i.next()
            s_b.write(Std.string(Std.string(i1)))
            s_b.write(" => ")
            s_b.write(Std.string(Std.string(self.h.get(i1,None))))
            if it.hasNext():
                s_b.write(", ")
        s_b.write("}")
        return s_b.getvalue()

    def clear(self):
        self.h.clear()

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.h = None


class haxe_ds__ReadOnlyArray_ReadOnlyArray_Impl_:
    _hx_class_name = "haxe.ds._ReadOnlyArray.ReadOnlyArray_Impl_"
    __slots__ = ()
    _hx_statics = ["get_length", "get", "concat"]
    length = None

    @staticmethod
    def get_length(this1):
        return len(this1)

    @staticmethod
    def get(this1,i):
        return (this1[i] if i >= 0 and i < len(this1) else None)

    @staticmethod
    def concat(this1,a):
        return (this1 + a)


class haxe_ds_StringMap:
    _hx_class_name = "haxe.ds.StringMap"
    __slots__ = ("h",)
    _hx_fields = ["h"]
    _hx_methods = ["set", "get", "exists", "remove", "keys", "iterator", "keyValueIterator", "copy", "toString", "clear"]
    _hx_interfaces = [haxe_IMap]

    def __init__(self):
        self.h = dict()

    def set(self,key,value):
        self.h[key] = value

    def get(self,key):
        return self.h.get(key,None)

    def exists(self,key):
        return (key in self.h)

    def remove(self,key):
        has = (key in self.h)
        if has:
            del self.h[key]
        return has

    def keys(self):
        return python_HaxeIterator(iter(self.h.keys()))

    def iterator(self):
        return python_HaxeIterator(iter(self.h.values()))

    def keyValueIterator(self):
        return haxe_iterators_MapKeyValueIterator(self)

    def copy(self):
        copied = haxe_ds_StringMap()
        key = self.keys()
        while key.hasNext():
            key1 = key.next()
            value = self.h.get(key1,None)
            copied.h[key1] = value
        return copied

    def toString(self):
        s_b = python_lib_io_StringIO()
        s_b.write("{")
        it = self.keys()
        i = it
        while i.hasNext():
            i1 = i.next()
            s_b.write(Std.string(i1))
            s_b.write(" => ")
            s_b.write(Std.string(Std.string(self.h.get(i1,None))))
            if it.hasNext():
                s_b.write(", ")
        s_b.write("}")
        return s_b.getvalue()

    def clear(self):
        self.h.clear()

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.h = None


class haxe_ds_WeakMap:
    _hx_class_name = "haxe.ds.WeakMap"
    __slots__ = ()
    _hx_methods = ["set", "get", "exists", "remove", "keys", "iterator", "keyValueIterator", "copy", "toString", "clear"]
    _hx_interfaces = [haxe_IMap]

    def __init__(self):
        raise haxe_exceptions_NotImplementedException("Not implemented for this platform",None,_hx_AnonObject({'fileName': "haxe/ds/WeakMap.hx", 'lineNumber': 39, 'className': "haxe.ds.WeakMap", 'methodName': "new"}))

    def set(self,key,value):
        pass

    def get(self,key):
        return None

    def exists(self,key):
        return False

    def remove(self,key):
        return False

    def keys(self):
        return None

    def iterator(self):
        return None

    def keyValueIterator(self):
        return None

    def copy(self):
        return None

    def toString(self):
        return None

    def clear(self):
        pass

    @staticmethod
    def _hx_empty_init(_hx_o):        pass


class haxe_exceptions_PosException(haxe_Exception):
    _hx_class_name = "haxe.exceptions.PosException"
    __slots__ = ("posInfos",)
    _hx_fields = ["posInfos"]
    _hx_methods = ["toString"]
    _hx_statics = []
    _hx_interfaces = []
    _hx_super = haxe_Exception


    def __init__(self,message,previous = None,pos = None):
        self.posInfos = None
        super().__init__(message,previous)
        if (pos is None):
            self.posInfos = _hx_AnonObject({'fileName': "(unknown)", 'lineNumber': 0, 'className': "(unknown)", 'methodName': "(unknown)"})
        else:
            self.posInfos = pos
        _hx_local_0 = self
        _hx_local_1 = _hx_local_0._hx___skipStack
        _hx_local_0._hx___skipStack = (_hx_local_1 + 1)
        _hx_local_1

    def toString(self):
        return ((((((((("" + HxOverrides.stringOrNull(super().toString())) + " in ") + HxOverrides.stringOrNull(self.posInfos.className)) + ".") + HxOverrides.stringOrNull(self.posInfos.methodName)) + " at ") + HxOverrides.stringOrNull(self.posInfos.fileName)) + ":") + Std.string(self.posInfos.lineNumber))

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.posInfos = None


class haxe_exceptions_NotImplementedException(haxe_exceptions_PosException):
    _hx_class_name = "haxe.exceptions.NotImplementedException"
    __slots__ = ()
    _hx_fields = []
    _hx_methods = []
    _hx_statics = []
    _hx_interfaces = []
    _hx_super = haxe_exceptions_PosException


    def __init__(self,message = None,previous = None,pos = None):
        if (message is None):
            message = "Not implemented"
        super().__init__(message,previous,pos)
        _hx_local_0 = self
        _hx_local_1 = _hx_local_0._hx___skipStack
        _hx_local_0._hx___skipStack = (_hx_local_1 + 1)
        _hx_local_1


class haxe_io_Bytes:
    _hx_class_name = "haxe.io.Bytes"
    __slots__ = ("length", "b")
    _hx_fields = ["length", "b"]
    _hx_methods = ["get", "set", "blit", "fill", "sub", "compare", "getDouble", "getFloat", "setDouble", "setFloat", "getUInt16", "setUInt16", "getInt32", "getInt64", "setInt32", "setInt64", "getString", "readString", "toString", "toHex", "getData"]
    _hx_statics = ["alloc", "ofString", "ofData", "ofHex", "fastGet"]

    def __init__(self,length,b):
        self.length = length
        self.b = b

    def get(self,pos):
        return self.b[pos]

    def set(self,pos,v):
        self.b[pos] = (v & 255)

    def blit(self,pos,src,srcpos,_hx_len):
        if (((((pos < 0) or ((srcpos < 0))) or ((_hx_len < 0))) or (((pos + _hx_len) > self.length))) or (((srcpos + _hx_len) > src.length))):
            raise haxe_Exception.thrown(haxe_io_Error.OutsideBounds)
        self.b[pos:pos+_hx_len] = src.b[srcpos:srcpos+_hx_len]

    def fill(self,pos,_hx_len,value):
        _g = 0
        _g1 = _hx_len
        while (_g < _g1):
            i = _g
            _g = (_g + 1)
            pos1 = pos
            pos = (pos + 1)
            self.b[pos1] = (value & 255)

    def sub(self,pos,_hx_len):
        if (((pos < 0) or ((_hx_len < 0))) or (((pos + _hx_len) > self.length))):
            raise haxe_Exception.thrown(haxe_io_Error.OutsideBounds)
        return haxe_io_Bytes(_hx_len,self.b[pos:(pos + _hx_len)])

    def compare(self,other):
        b1 = self.b
        b2 = other.b
        _hx_len = (self.length if ((self.length < other.length)) else other.length)
        _g = 0
        _g1 = _hx_len
        while (_g < _g1):
            i = _g
            _g = (_g + 1)
            if (b1[i] != b2[i]):
                return (b1[i] - b2[i])
        return (self.length - other.length)

    def getDouble(self,pos):
        v = (((self.b[pos] | ((self.b[(pos + 1)] << 8))) | ((self.b[(pos + 2)] << 16))) | ((self.b[(pos + 3)] << 24)))
        pos1 = (pos + 4)
        v1 = (((self.b[pos1] | ((self.b[(pos1 + 1)] << 8))) | ((self.b[(pos1 + 2)] << 16))) | ((self.b[(pos1 + 3)] << 24)))
        return haxe_io_FPHelper.i64ToDouble(((v | -2147483648) if ((((v & -2147483648)) != 0)) else v),((v1 | -2147483648) if ((((v1 & -2147483648)) != 0)) else v1))

    def getFloat(self,pos):
        v = (((self.b[pos] | ((self.b[(pos + 1)] << 8))) | ((self.b[(pos + 2)] << 16))) | ((self.b[(pos + 3)] << 24)))
        return haxe_io_FPHelper.i32ToFloat(((v | -2147483648) if ((((v & -2147483648)) != 0)) else v))

    def setDouble(self,pos,v):
        i = haxe_io_FPHelper.doubleToI64(v)
        v = i.low
        self.b[pos] = (v & 255)
        self.b[(pos + 1)] = ((v >> 8) & 255)
        self.b[(pos + 2)] = ((v >> 16) & 255)
        self.b[(pos + 3)] = (HxOverrides.rshift(v, 24) & 255)
        pos1 = (pos + 4)
        v = i.high
        self.b[pos1] = (v & 255)
        self.b[(pos1 + 1)] = ((v >> 8) & 255)
        self.b[(pos1 + 2)] = ((v >> 16) & 255)
        self.b[(pos1 + 3)] = (HxOverrides.rshift(v, 24) & 255)

    def setFloat(self,pos,v):
        v1 = haxe_io_FPHelper.floatToI32(v)
        self.b[pos] = (v1 & 255)
        self.b[(pos + 1)] = ((v1 >> 8) & 255)
        self.b[(pos + 2)] = ((v1 >> 16) & 255)
        self.b[(pos + 3)] = (HxOverrides.rshift(v1, 24) & 255)

    def getUInt16(self,pos):
        return (self.b[pos] | ((self.b[(pos + 1)] << 8)))

    def setUInt16(self,pos,v):
        self.b[pos] = (v & 255)
        self.b[(pos + 1)] = ((v >> 8) & 255)

    def getInt32(self,pos):
        v = (((self.b[pos] | ((self.b[(pos + 1)] << 8))) | ((self.b[(pos + 2)] << 16))) | ((self.b[(pos + 3)] << 24)))
        if (((v & -2147483648)) != 0):
            return (v | -2147483648)
        else:
            return v

    def getInt64(self,pos):
        pos1 = (pos + 4)
        v = (((self.b[pos1] | ((self.b[(pos1 + 1)] << 8))) | ((self.b[(pos1 + 2)] << 16))) | ((self.b[(pos1 + 3)] << 24)))
        v1 = (((self.b[pos] | ((self.b[(pos + 1)] << 8))) | ((self.b[(pos + 2)] << 16))) | ((self.b[(pos + 3)] << 24)))
        this1 = haxe__Int64____Int64(((v | -2147483648) if ((((v & -2147483648)) != 0)) else v),((v1 | -2147483648) if ((((v1 & -2147483648)) != 0)) else v1))
        return this1

    def setInt32(self,pos,v):
        self.b[pos] = (v & 255)
        self.b[(pos + 1)] = ((v >> 8) & 255)
        self.b[(pos + 2)] = ((v >> 16) & 255)
        self.b[(pos + 3)] = (HxOverrides.rshift(v, 24) & 255)

    def setInt64(self,pos,v):
        v1 = v.low
        self.b[pos] = (v1 & 255)
        self.b[(pos + 1)] = ((v1 >> 8) & 255)
        self.b[(pos + 2)] = ((v1 >> 16) & 255)
        self.b[(pos + 3)] = (HxOverrides.rshift(v1, 24) & 255)
        pos1 = (pos + 4)
        v1 = v.high
        self.b[pos1] = (v1 & 255)
        self.b[(pos1 + 1)] = ((v1 >> 8) & 255)
        self.b[(pos1 + 2)] = ((v1 >> 16) & 255)
        self.b[(pos1 + 3)] = (HxOverrides.rshift(v1, 24) & 255)

    def getString(self,pos,_hx_len,encoding = None):
        tmp = (encoding is None)
        if (((pos < 0) or ((_hx_len < 0))) or (((pos + _hx_len) > self.length))):
            raise haxe_Exception.thrown(haxe_io_Error.OutsideBounds)
        return self.b[pos:pos+_hx_len].decode('UTF-8','replace')

    def readString(self,pos,_hx_len):
        return self.getString(pos,_hx_len)

    def toString(self):
        return self.getString(0,self.length)

    def toHex(self):
        s_b = python_lib_io_StringIO()
        chars = []
        _hx_str = "0123456789abcdef"
        _g = 0
        _g1 = len(_hx_str)
        while (_g < _g1):
            i = _g
            _g = (_g + 1)
            x = HxString.charCodeAt(_hx_str,i)
            chars.append(x)
        _g = 0
        _g1 = self.length
        while (_g < _g1):
            i = _g
            _g = (_g + 1)
            c = self.b[i]
            s_b.write("".join(map(chr,[python_internal_ArrayImpl._get(chars, (c >> 4))])))
            s_b.write("".join(map(chr,[python_internal_ArrayImpl._get(chars, (c & 15))])))
        return s_b.getvalue()

    def getData(self):
        return self.b

    @staticmethod
    def alloc(length):
        return haxe_io_Bytes(length,bytearray(length))

    @staticmethod
    def ofString(s,encoding = None):
        b = bytearray(s,"UTF-8")
        return haxe_io_Bytes(len(b),b)

    @staticmethod
    def ofData(b):
        return haxe_io_Bytes(len(b),b)

    @staticmethod
    def ofHex(s):
        _hx_len = len(s)
        if (((_hx_len & 1)) != 0):
            raise haxe_Exception.thrown("Not a hex string (odd number of digits)")
        ret = haxe_io_Bytes.alloc((_hx_len >> 1))
        _g = 0
        _g1 = ret.length
        while (_g < _g1):
            i = _g
            _g = (_g + 1)
            index = (i * 2)
            high = (-1 if ((index >= len(s))) else ord(s[index]))
            index1 = ((i * 2) + 1)
            low = (-1 if ((index1 >= len(s))) else ord(s[index1]))
            high = (((high & 15)) + ((((((high & 64)) >> 6)) * 9)))
            low = (((low & 15)) + ((((((low & 64)) >> 6)) * 9)))
            ret.b[i] = (((((high << 4) | low)) & 255) & 255)
        return ret

    @staticmethod
    def fastGet(b,pos):
        return b[pos]

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.length = None
        _hx_o.b = None


class haxe_io_BytesBuffer:
    _hx_class_name = "haxe.io.BytesBuffer"
    __slots__ = ("b",)
    _hx_fields = ["b"]
    _hx_methods = ["get_length", "addByte", "add", "addString", "addInt32", "addInt64", "addFloat", "addDouble", "addBytes", "getBytes"]

    def __init__(self):
        self.b = bytearray()

    def get_length(self):
        return len(self.b)

    def addByte(self,byte):
        self.b.append(byte)

    def add(self,src):
        self.b.extend(src.b)

    def addString(self,v,encoding = None):
        self.b.extend(bytearray(v,"UTF-8"))

    def addInt32(self,v):
        self.b.append((v & 255))
        self.b.append(((v >> 8) & 255))
        self.b.append(((v >> 16) & 255))
        self.b.append(HxOverrides.rshift(v, 24))

    def addInt64(self,v):
        self.addInt32(v.low)
        self.addInt32(v.high)

    def addFloat(self,v):
        self.addInt32(haxe_io_FPHelper.floatToI32(v))

    def addDouble(self,v):
        self.addInt64(haxe_io_FPHelper.doubleToI64(v))

    def addBytes(self,src,pos,_hx_len):
        if (((pos < 0) or ((_hx_len < 0))) or (((pos + _hx_len) > src.length))):
            raise haxe_Exception.thrown(haxe_io_Error.OutsideBounds)
        self.b.extend(src.b[pos:(pos + _hx_len)])

    def getBytes(self):
        _hx_bytes = haxe_io_Bytes(len(self.b),self.b)
        self.b = None
        return _hx_bytes

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.b = None

class haxe_io_Encoding(Enum):
    __slots__ = ()
    _hx_class_name = "haxe.io.Encoding"
    _hx_constructs = ["UTF8", "RawNative"]
haxe_io_Encoding.UTF8 = haxe_io_Encoding("UTF8", 0, ())
haxe_io_Encoding.RawNative = haxe_io_Encoding("RawNative", 1, ())


class haxe_io_Eof:
    _hx_class_name = "haxe.io.Eof"
    __slots__ = ()
    _hx_methods = ["toString"]

    def __init__(self):
        pass

    def toString(self):
        return "Eof"

    @staticmethod
    def _hx_empty_init(_hx_o):        pass

class haxe_io_Error(Enum):
    __slots__ = ()
    _hx_class_name = "haxe.io.Error"
    _hx_constructs = ["Blocked", "Overflow", "OutsideBounds", "Custom"]

    @staticmethod
    def Custom(e):
        return haxe_io_Error("Custom", 3, (e,))
haxe_io_Error.Blocked = haxe_io_Error("Blocked", 0, ())
haxe_io_Error.Overflow = haxe_io_Error("Overflow", 1, ())
haxe_io_Error.OutsideBounds = haxe_io_Error("OutsideBounds", 2, ())


class haxe_io_FPHelper:
    _hx_class_name = "haxe.io.FPHelper"
    __slots__ = ()
    _hx_statics = ["i64tmp", "LN2", "_i32ToFloat", "_i64ToDouble", "_floatToI32", "_doubleToI64", "i32ToFloat", "floatToI32", "i64ToDouble", "doubleToI64"]

    @staticmethod
    def _i32ToFloat(i):
        sign = (1 - ((HxOverrides.rshift(i, 31) << 1)))
        e = ((i >> 23) & 255)
        if (e == 255):
            if (((i & 8388607)) == 0):
                if (sign > 0):
                    return Math.POSITIVE_INFINITY
                else:
                    return Math.NEGATIVE_INFINITY
            else:
                return Math.NaN
        m = ((((i & 8388607)) << 1) if ((e == 0)) else ((i & 8388607) | 8388608))
        return ((sign * m) * Math.pow(2,(e - 150)))

    @staticmethod
    def _i64ToDouble(lo,hi):
        sign = (1 - ((HxOverrides.rshift(hi, 31) << 1)))
        e = ((hi >> 20) & 2047)
        if (e == 2047):
            if ((lo == 0) and ((((hi & 1048575)) == 0))):
                if (sign > 0):
                    return Math.POSITIVE_INFINITY
                else:
                    return Math.NEGATIVE_INFINITY
            else:
                return Math.NaN
        m = (2.220446049250313e-16 * ((((((hi & 1048575)) * 4294967296.) + (((HxOverrides.rshift(lo, 31)) * 2147483648.))) + ((lo & 2147483647)))))
        if (e == 0):
            m = (m * 2.0)
        else:
            m = (m + 1.0)
        return ((sign * m) * Math.pow(2,(e - 1023)))

    @staticmethod
    def _floatToI32(f):
        if (f == 0):
            return 0
        af = (-f if ((f < 0)) else f)
        exp = Math.floor((((Math.NEGATIVE_INFINITY if ((af == 0.0)) else (Math.NaN if ((af < 0.0)) else python_lib_Math.log(af)))) / 0.6931471805599453))
        if (exp > 127):
            return 2139095040
        else:
            if (exp <= -127):
                exp = -127
                af = (af * 7.1362384635298e+44)
            else:
                af = ((((af / Math.pow(2,exp)) - 1.0)) * 8388608)
            return ((((-2147483648 if ((f < 0)) else 0)) | (((exp + 127) << 23))) | Math.floor((af + 0.5)))

    @staticmethod
    def _doubleToI64(v):
        i64 = haxe_io_FPHelper.i64tmp
        if (v == 0):
            i64.low = 0
            i64.high = 0
        elif (not ((((v != Math.POSITIVE_INFINITY) and ((v != Math.NEGATIVE_INFINITY))) and (not python_lib_Math.isnan(v))))):
            i64.low = 0
            i64.high = (2146435072 if ((v > 0)) else -1048576)
        else:
            av = (-v if ((v < 0)) else v)
            exp = Math.floor((((Math.NEGATIVE_INFINITY if ((av == 0.0)) else (Math.NaN if ((av < 0.0)) else python_lib_Math.log(av)))) / 0.6931471805599453))
            if (exp > 1023):
                i64.low = -1
                i64.high = 2146435071
            else:
                if (exp <= -1023):
                    exp = -1023
                    av = (av / 2.2250738585072014e-308)
                else:
                    av = ((av / Math.pow(2,exp)) - 1.0)
                v1 = (av * 4503599627370496.)
                sig = (v1 if (((v1 == Math.POSITIVE_INFINITY) or ((v1 == Math.NEGATIVE_INFINITY)))) else (Math.NaN if (python_lib_Math.isnan(v1)) else Math.floor((v1 + 0.5))))
                sig_l = None
                try:
                    sig_l = int(sig)
                except BaseException as _g:
                    None
                    sig_l = None
                sig_l1 = sig_l
                sig_h = None
                try:
                    sig_h = int((sig / 4294967296.0))
                except BaseException as _g:
                    None
                    sig_h = None
                sig_h1 = sig_h
                i64.low = sig_l1
                i64.high = ((((-2147483648 if ((v < 0)) else 0)) | (((exp + 1023) << 20))) | sig_h1)
        return i64

    @staticmethod
    def i32ToFloat(i):
        sign = (1 - ((HxOverrides.rshift(i, 31) << 1)))
        e = ((i >> 23) & 255)
        if (e == 255):
            if (((i & 8388607)) == 0):
                if (sign > 0):
                    return Math.POSITIVE_INFINITY
                else:
                    return Math.NEGATIVE_INFINITY
            else:
                return Math.NaN
        else:
            m = ((((i & 8388607)) << 1) if ((e == 0)) else ((i & 8388607) | 8388608))
            return ((sign * m) * Math.pow(2,(e - 150)))

    @staticmethod
    def floatToI32(f):
        if (f == 0):
            return 0
        else:
            af = (-f if ((f < 0)) else f)
            exp = Math.floor((((Math.NEGATIVE_INFINITY if ((af == 0.0)) else (Math.NaN if ((af < 0.0)) else python_lib_Math.log(af)))) / 0.6931471805599453))
            if (exp > 127):
                return 2139095040
            else:
                if (exp <= -127):
                    exp = -127
                    af = (af * 7.1362384635298e+44)
                else:
                    af = ((((af / Math.pow(2,exp)) - 1.0)) * 8388608)
                return ((((-2147483648 if ((f < 0)) else 0)) | (((exp + 127) << 23))) | Math.floor((af + 0.5)))

    @staticmethod
    def i64ToDouble(low,high):
        sign = (1 - ((HxOverrides.rshift(high, 31) << 1)))
        e = ((high >> 20) & 2047)
        if (e == 2047):
            if ((low == 0) and ((((high & 1048575)) == 0))):
                if (sign > 0):
                    return Math.POSITIVE_INFINITY
                else:
                    return Math.NEGATIVE_INFINITY
            else:
                return Math.NaN
        else:
            m = (2.220446049250313e-16 * ((((((high & 1048575)) * 4294967296.) + (((HxOverrides.rshift(low, 31)) * 2147483648.))) + ((low & 2147483647)))))
            if (e == 0):
                m = (m * 2.0)
            else:
                m = (m + 1.0)
            return ((sign * m) * Math.pow(2,(e - 1023)))

    @staticmethod
    def doubleToI64(v):
        i64 = haxe_io_FPHelper.i64tmp
        if (v == 0):
            i64.low = 0
            i64.high = 0
        elif (not ((((v != Math.POSITIVE_INFINITY) and ((v != Math.NEGATIVE_INFINITY))) and (not python_lib_Math.isnan(v))))):
            i64.low = 0
            i64.high = (2146435072 if ((v > 0)) else -1048576)
        else:
            av = (-v if ((v < 0)) else v)
            exp = Math.floor((((Math.NEGATIVE_INFINITY if ((av == 0.0)) else (Math.NaN if ((av < 0.0)) else python_lib_Math.log(av)))) / 0.6931471805599453))
            if (exp > 1023):
                i64.low = -1
                i64.high = 2146435071
            else:
                if (exp <= -1023):
                    exp = -1023
                    av = (av / 2.2250738585072014e-308)
                else:
                    av = ((av / Math.pow(2,exp)) - 1.0)
                v1 = (av * 4503599627370496.)
                sig = (v1 if (((v1 == Math.POSITIVE_INFINITY) or ((v1 == Math.NEGATIVE_INFINITY)))) else (Math.NaN if (python_lib_Math.isnan(v1)) else Math.floor((v1 + 0.5))))
                sig_l = None
                try:
                    sig_l = int(sig)
                except BaseException as _g:
                    None
                    sig_l = None
                sig_l1 = sig_l
                sig_h = None
                try:
                    sig_h = int((sig / 4294967296.0))
                except BaseException as _g:
                    None
                    sig_h = None
                sig_h1 = sig_h
                i64.low = sig_l1
                i64.high = ((((-2147483648 if ((v < 0)) else 0)) | (((exp + 1023) << 20))) | sig_h1)
        return i64


class haxe_io_Input:
    _hx_class_name = "haxe.io.Input"
    __slots__ = ("bigEndian",)
    _hx_fields = ["bigEndian"]
    _hx_methods = ["readByte", "readBytes", "close", "set_bigEndian", "readAll", "readFullBytes", "read", "readUntil", "readLine", "readFloat", "readDouble", "readInt8", "readInt16", "readUInt16", "readInt24", "readUInt24", "readInt32", "readString", "getDoubleSig"]

    def readByte(self):
        raise haxe_exceptions_NotImplementedException(None,None,_hx_AnonObject({'fileName': "haxe/io/Input.hx", 'lineNumber': 53, 'className': "haxe.io.Input", 'methodName': "readByte"}))

    def readBytes(self,s,pos,_hx_len):
        k = _hx_len
        b = s.b
        if (((pos < 0) or ((_hx_len < 0))) or (((pos + _hx_len) > s.length))):
            raise haxe_Exception.thrown(haxe_io_Error.OutsideBounds)
        try:
            while (k > 0):
                b[pos] = self.readByte()
                pos = (pos + 1)
                k = (k - 1)
        except BaseException as _g:
            None
            if (not Std.isOfType(haxe_Exception.caught(_g).unwrap(),haxe_io_Eof)):
                raise _g
        return (_hx_len - k)

    def close(self):
        pass

    def set_bigEndian(self,b):
        self.bigEndian = b
        return b

    def readAll(self,bufsize = None):
        if (bufsize is None):
            bufsize = 16384
        buf = haxe_io_Bytes.alloc(bufsize)
        total = haxe_io_BytesBuffer()
        try:
            while True:
                _hx_len = self.readBytes(buf,0,bufsize)
                if (_hx_len == 0):
                    raise haxe_Exception.thrown(haxe_io_Error.Blocked)
                if ((_hx_len < 0) or ((_hx_len > buf.length))):
                    raise haxe_Exception.thrown(haxe_io_Error.OutsideBounds)
                total.b.extend(buf.b[0:_hx_len])
        except BaseException as _g:
            None
            if (not Std.isOfType(haxe_Exception.caught(_g).unwrap(),haxe_io_Eof)):
                raise _g
        return total.getBytes()

    def readFullBytes(self,s,pos,_hx_len):
        while (_hx_len > 0):
            k = self.readBytes(s,pos,_hx_len)
            if (k == 0):
                raise haxe_Exception.thrown(haxe_io_Error.Blocked)
            pos = (pos + k)
            _hx_len = (_hx_len - k)

    def read(self,nbytes):
        s = haxe_io_Bytes.alloc(nbytes)
        p = 0
        while (nbytes > 0):
            k = self.readBytes(s,p,nbytes)
            if (k == 0):
                raise haxe_Exception.thrown(haxe_io_Error.Blocked)
            p = (p + k)
            nbytes = (nbytes - k)
        return s

    def readUntil(self,end):
        buf = haxe_io_BytesBuffer()
        last = None
        while True:
            last = self.readByte()
            if (not ((last != end))):
                break
            buf.b.append(last)
        return buf.getBytes().toString()

    def readLine(self):
        buf = haxe_io_BytesBuffer()
        last = None
        s = None
        try:
            while True:
                last = self.readByte()
                if (not ((last != 10))):
                    break
                buf.b.append(last)
            s = buf.getBytes().toString()
            if (HxString.charCodeAt(s,(len(s) - 1)) == 13):
                s = HxString.substr(s,0,-1)
        except BaseException as _g:
            None
            _g1 = haxe_Exception.caught(_g).unwrap()
            if Std.isOfType(_g1,haxe_io_Eof):
                e = _g1
                s = buf.getBytes().toString()
                if (len(s) == 0):
                    raise haxe_Exception.thrown(e)
            else:
                raise _g
        return s

    def readFloat(self):
        return haxe_io_FPHelper.i32ToFloat(self.readInt32())

    def readDouble(self):
        i1 = self.readInt32()
        i2 = self.readInt32()
        if self.bigEndian:
            return haxe_io_FPHelper.i64ToDouble(i2,i1)
        else:
            return haxe_io_FPHelper.i64ToDouble(i1,i2)

    def readInt8(self):
        n = self.readByte()
        if (n >= 128):
            return (n - 256)
        return n

    def readInt16(self):
        ch1 = self.readByte()
        ch2 = self.readByte()
        n = ((ch2 | ((ch1 << 8))) if (self.bigEndian) else (ch1 | ((ch2 << 8))))
        if (((n & 32768)) != 0):
            return (n - 65536)
        return n

    def readUInt16(self):
        ch1 = self.readByte()
        ch2 = self.readByte()
        if self.bigEndian:
            return (ch2 | ((ch1 << 8)))
        else:
            return (ch1 | ((ch2 << 8)))

    def readInt24(self):
        ch1 = self.readByte()
        ch2 = self.readByte()
        ch3 = self.readByte()
        n = (((ch3 | ((ch2 << 8))) | ((ch1 << 16))) if (self.bigEndian) else ((ch1 | ((ch2 << 8))) | ((ch3 << 16))))
        if (((n & 8388608)) != 0):
            return (n - 16777216)
        return n

    def readUInt24(self):
        ch1 = self.readByte()
        ch2 = self.readByte()
        ch3 = self.readByte()
        if self.bigEndian:
            return ((ch3 | ((ch2 << 8))) | ((ch1 << 16)))
        else:
            return ((ch1 | ((ch2 << 8))) | ((ch3 << 16)))

    def readInt32(self):
        ch1 = self.readByte()
        ch2 = self.readByte()
        ch3 = self.readByte()
        ch4 = self.readByte()
        n = ((((ch4 | ((ch3 << 8))) | ((ch2 << 16))) | ((ch1 << 24))) if (self.bigEndian) else (((ch1 | ((ch2 << 8))) | ((ch3 << 16))) | ((ch4 << 24))))
        if (((n & -2147483648)) != 0):
            return (n | -2147483648)
        else:
            return n

    def readString(self,_hx_len,encoding = None):
        b = haxe_io_Bytes.alloc(_hx_len)
        self.readFullBytes(b,0,_hx_len)
        return b.getString(0,_hx_len,encoding)

    def getDoubleSig(self,_hx_bytes):
        return ((((((((((_hx_bytes[1] if 1 < len(_hx_bytes) else None) & 15)) << 16) | (((_hx_bytes[2] if 2 < len(_hx_bytes) else None) << 8))) | (_hx_bytes[3] if 3 < len(_hx_bytes) else None))) * 4294967296.) + (((((_hx_bytes[4] if 4 < len(_hx_bytes) else None) >> 7)) * 2147483648))) + ((((((((_hx_bytes[4] if 4 < len(_hx_bytes) else None) & 127)) << 24) | (((_hx_bytes[5] if 5 < len(_hx_bytes) else None) << 16))) | (((_hx_bytes[6] if 6 < len(_hx_bytes) else None) << 8))) | (_hx_bytes[7] if 7 < len(_hx_bytes) else None))))

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.bigEndian = None


class haxe_io_Output:
    _hx_class_name = "haxe.io.Output"
    __slots__ = ("bigEndian",)
    _hx_fields = ["bigEndian"]
    _hx_methods = ["writeByte", "writeBytes", "flush", "close", "set_bigEndian", "write", "writeFullBytes", "writeFloat", "writeDouble", "writeInt8", "writeInt16", "writeUInt16", "writeInt24", "writeUInt24", "writeInt32", "prepare", "writeInput", "writeString"]

    def writeByte(self,c):
        raise haxe_exceptions_NotImplementedException(None,None,_hx_AnonObject({'fileName': "haxe/io/Output.hx", 'lineNumber': 47, 'className': "haxe.io.Output", 'methodName': "writeByte"}))

    def writeBytes(self,s,pos,_hx_len):
        if (((pos < 0) or ((_hx_len < 0))) or (((pos + _hx_len) > s.length))):
            raise haxe_Exception.thrown(haxe_io_Error.OutsideBounds)
        b = s.b
        k = _hx_len
        while (k > 0):
            self.writeByte(b[pos])
            pos = (pos + 1)
            k = (k - 1)
        return _hx_len

    def flush(self):
        pass

    def close(self):
        pass

    def set_bigEndian(self,b):
        self.bigEndian = b
        return b

    def write(self,s):
        l = s.length
        p = 0
        while (l > 0):
            k = self.writeBytes(s,p,l)
            if (k == 0):
                raise haxe_Exception.thrown(haxe_io_Error.Blocked)
            p = (p + k)
            l = (l - k)

    def writeFullBytes(self,s,pos,_hx_len):
        while (_hx_len > 0):
            k = self.writeBytes(s,pos,_hx_len)
            pos = (pos + k)
            _hx_len = (_hx_len - k)

    def writeFloat(self,x):
        self.writeInt32(haxe_io_FPHelper.floatToI32(x))

    def writeDouble(self,x):
        i64 = haxe_io_FPHelper.doubleToI64(x)
        if self.bigEndian:
            self.writeInt32(i64.high)
            self.writeInt32(i64.low)
        else:
            self.writeInt32(i64.low)
            self.writeInt32(i64.high)

    def writeInt8(self,x):
        if ((x < -128) or ((x >= 128))):
            raise haxe_Exception.thrown(haxe_io_Error.Overflow)
        self.writeByte((x & 255))

    def writeInt16(self,x):
        if ((x < -32768) or ((x >= 32768))):
            raise haxe_Exception.thrown(haxe_io_Error.Overflow)
        self.writeUInt16((x & 65535))

    def writeUInt16(self,x):
        if ((x < 0) or ((x >= 65536))):
            raise haxe_Exception.thrown(haxe_io_Error.Overflow)
        if self.bigEndian:
            self.writeByte((x >> 8))
            self.writeByte((x & 255))
        else:
            self.writeByte((x & 255))
            self.writeByte((x >> 8))

    def writeInt24(self,x):
        if ((x < -8388608) or ((x >= 8388608))):
            raise haxe_Exception.thrown(haxe_io_Error.Overflow)
        self.writeUInt24((x & 16777215))

    def writeUInt24(self,x):
        if ((x < 0) or ((x >= 16777216))):
            raise haxe_Exception.thrown(haxe_io_Error.Overflow)
        if self.bigEndian:
            self.writeByte((x >> 16))
            self.writeByte(((x >> 8) & 255))
            self.writeByte((x & 255))
        else:
            self.writeByte((x & 255))
            self.writeByte(((x >> 8) & 255))
            self.writeByte((x >> 16))

    def writeInt32(self,x):
        if self.bigEndian:
            self.writeByte(HxOverrides.rshift(x, 24))
            self.writeByte(((x >> 16) & 255))
            self.writeByte(((x >> 8) & 255))
            self.writeByte((x & 255))
        else:
            self.writeByte((x & 255))
            self.writeByte(((x >> 8) & 255))
            self.writeByte(((x >> 16) & 255))
            self.writeByte(HxOverrides.rshift(x, 24))

    def prepare(self,nbytes):
        pass

    def writeInput(self,i,bufsize = None):
        if (bufsize is None):
            bufsize = 4096
        buf = haxe_io_Bytes.alloc(bufsize)
        try:
            while True:
                _hx_len = i.readBytes(buf,0,bufsize)
                if (_hx_len == 0):
                    raise haxe_Exception.thrown(haxe_io_Error.Blocked)
                p = 0
                while (_hx_len > 0):
                    k = self.writeBytes(buf,p,_hx_len)
                    if (k == 0):
                        raise haxe_Exception.thrown(haxe_io_Error.Blocked)
                    p = (p + k)
                    _hx_len = (_hx_len - k)
        except BaseException as _g:
            None
            if (not Std.isOfType(haxe_Exception.caught(_g).unwrap(),haxe_io_Eof)):
                raise _g

    def writeString(self,s,encoding = None):
        b = haxe_io_Bytes.ofString(s,encoding)
        self.writeFullBytes(b,0,b.length)

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.bigEndian = None


class haxe_io_Path:
    _hx_class_name = "haxe.io.Path"
    __slots__ = ("dir", "file", "ext", "backslash")
    _hx_fields = ["dir", "file", "ext", "backslash"]
    _hx_methods = ["toString"]
    _hx_statics = ["withoutExtension", "withoutDirectory", "directory", "extension", "withExtension", "join", "normalize", "addTrailingSlash", "removeTrailingSlashes", "isAbsolute", "unescape", "escape"]

    def __init__(self,path):
        self.backslash = None
        self.ext = None
        self.file = None
        self.dir = None
        path1 = path
        _hx_local_0 = len(path1)
        if (_hx_local_0 == 1):
            if (path1 == "."):
                self.dir = path
                self.file = ""
                return
        elif (_hx_local_0 == 2):
            if (path1 == ".."):
                self.dir = path
                self.file = ""
                return
        else:
            pass
        startIndex = None
        c1 = None
        if (startIndex is None):
            c1 = path.rfind("/", 0, len(path))
        else:
            i = path.rfind("/", 0, (startIndex + 1))
            startLeft = (max(0,((startIndex + 1) - len("/"))) if ((i == -1)) else (i + 1))
            check = path.find("/", startLeft, len(path))
            c1 = (check if (((check > i) and ((check <= startIndex)))) else i)
        startIndex = None
        c2 = None
        if (startIndex is None):
            c2 = path.rfind("\\", 0, len(path))
        else:
            i = path.rfind("\\", 0, (startIndex + 1))
            startLeft = (max(0,((startIndex + 1) - len("\\"))) if ((i == -1)) else (i + 1))
            check = path.find("\\", startLeft, len(path))
            c2 = (check if (((check > i) and ((check <= startIndex)))) else i)
        if (c1 < c2):
            self.dir = HxString.substr(path,0,c2)
            path = HxString.substr(path,(c2 + 1),None)
            self.backslash = True
        elif (c2 < c1):
            self.dir = HxString.substr(path,0,c1)
            path = HxString.substr(path,(c1 + 1),None)
        else:
            self.dir = None
        startIndex = None
        cp = None
        if (startIndex is None):
            cp = path.rfind(".", 0, len(path))
        else:
            i = path.rfind(".", 0, (startIndex + 1))
            startLeft = (max(0,((startIndex + 1) - len("."))) if ((i == -1)) else (i + 1))
            check = path.find(".", startLeft, len(path))
            cp = (check if (((check > i) and ((check <= startIndex)))) else i)
        if (cp != -1):
            self.ext = HxString.substr(path,(cp + 1),None)
            self.file = HxString.substr(path,0,cp)
        else:
            self.ext = None
            self.file = path

    def toString(self):
        return ((HxOverrides.stringOrNull((("" if ((self.dir is None)) else (HxOverrides.stringOrNull(self.dir) + HxOverrides.stringOrNull((("\\" if (self.backslash) else "/"))))))) + HxOverrides.stringOrNull(self.file)) + HxOverrides.stringOrNull((("" if ((self.ext is None)) else ("." + HxOverrides.stringOrNull(self.ext))))))

    @staticmethod
    def withoutExtension(path):
        s = haxe_io_Path(path)
        s.ext = None
        return s.toString()

    @staticmethod
    def withoutDirectory(path):
        s = haxe_io_Path(path)
        s.dir = None
        return s.toString()

    @staticmethod
    def directory(path):
        s = haxe_io_Path(path)
        if (s.dir is None):
            return ""
        return s.dir

    @staticmethod
    def extension(path):
        s = haxe_io_Path(path)
        if (s.ext is None):
            return ""
        return s.ext

    @staticmethod
    def withExtension(path,ext):
        s = haxe_io_Path(path)
        s.ext = ext
        return s.toString()

    @staticmethod
    def join(paths):
        def _hx_local_0(s):
            if (s is not None):
                return (s != "")
            else:
                return False
        paths1 = list(filter(_hx_local_0,paths))
        if (len(paths1) == 0):
            return ""
        path = (paths1[0] if 0 < len(paths1) else None)
        _g = 1
        _g1 = len(paths1)
        while (_g < _g1):
            i = _g
            _g = (_g + 1)
            path = haxe_io_Path.addTrailingSlash(path)
            path = (("null" if path is None else path) + HxOverrides.stringOrNull((paths1[i] if i >= 0 and i < len(paths1) else None)))
        return haxe_io_Path.normalize(path)

    @staticmethod
    def normalize(path):
        slash = "/"
        _this = path.split("\\")
        path = slash.join([python_Boot.toString1(x1,'') for x1 in _this])
        if (path == slash):
            return slash
        target = []
        _g = 0
        _g1 = (list(path) if ((slash == "")) else path.split(slash))
        while (_g < len(_g1)):
            token = (_g1[_g] if _g >= 0 and _g < len(_g1) else None)
            _g = (_g + 1)
            if (((token == "..") and ((len(target) > 0))) and ((python_internal_ArrayImpl._get(target, (len(target) - 1)) != ".."))):
                if (len(target) != 0):
                    target.pop()
            elif (token == ""):
                if ((len(target) > 0) or ((HxString.charCodeAt(path,0) == 47))):
                    target.append(token)
            elif (token != "."):
                target.append(token)
        tmp = slash.join([python_Boot.toString1(x1,'') for x1 in target])
        acc_b = python_lib_io_StringIO()
        colon = False
        slashes = False
        _g = 0
        _g1 = len(tmp)
        while (_g < _g1):
            i = _g
            _g = (_g + 1)
            _g2 = (-1 if ((i >= len(tmp))) else ord(tmp[i]))
            _g3 = _g2
            if (_g3 == 47):
                if (not colon):
                    slashes = True
                else:
                    i1 = _g2
                    colon = False
                    if slashes:
                        acc_b.write("/")
                        slashes = False
                    acc_b.write("".join(map(chr,[i1])))
            elif (_g3 == 58):
                acc_b.write(":")
                colon = True
            else:
                i2 = _g2
                colon = False
                if slashes:
                    acc_b.write("/")
                    slashes = False
                acc_b.write("".join(map(chr,[i2])))
        return acc_b.getvalue()

    @staticmethod
    def addTrailingSlash(path):
        if (len(path) == 0):
            return "/"
        startIndex = None
        c1 = None
        if (startIndex is None):
            c1 = path.rfind("/", 0, len(path))
        else:
            i = path.rfind("/", 0, (startIndex + 1))
            startLeft = (max(0,((startIndex + 1) - len("/"))) if ((i == -1)) else (i + 1))
            check = path.find("/", startLeft, len(path))
            c1 = (check if (((check > i) and ((check <= startIndex)))) else i)
        startIndex = None
        c2 = None
        if (startIndex is None):
            c2 = path.rfind("\\", 0, len(path))
        else:
            i = path.rfind("\\", 0, (startIndex + 1))
            startLeft = (max(0,((startIndex + 1) - len("\\"))) if ((i == -1)) else (i + 1))
            check = path.find("\\", startLeft, len(path))
            c2 = (check if (((check > i) and ((check <= startIndex)))) else i)
        if (c1 < c2):
            if (c2 != ((len(path) - 1))):
                return (("null" if path is None else path) + "\\")
            else:
                return path
        elif (c1 != ((len(path) - 1))):
            return (("null" if path is None else path) + "/")
        else:
            return path

    @staticmethod
    def removeTrailingSlashes(path):
        while True:
            _g = HxString.charCodeAt(path,(len(path) - 1))
            if (_g is None):
                break
            else:
                _g1 = _g
                if ((_g1 == 92) or ((_g1 == 47))):
                    path = HxString.substr(path,0,-1)
                else:
                    break
        return path

    @staticmethod
    def isAbsolute(path):
        if path.startswith("/"):
            return True
        if ((("" if ((1 >= len(path))) else path[1])) == ":"):
            return True
        if path.startswith("\\\\"):
            return True
        return False

    @staticmethod
    def unescape(path):
        regex = EReg("-x([0-9][0-9])","g")
        def _hx_local_1():
            def _hx_local_0(regex):
                code = Std.parseInt(regex.matchObj.group(1))
                return "".join(map(chr,[code]))
            return regex.map(path,_hx_local_0)
        return _hx_local_1()

    @staticmethod
    def escape(path,allowSlashes = None):
        if (allowSlashes is None):
            allowSlashes = False
        regex = (EReg("[^A-Za-z0-9_/\\\\\\.]","g") if allowSlashes else EReg("[^A-Za-z0-9_\\.]","g"))
        def _hx_local_1():
            def _hx_local_0(v):
                return ("-x" + Std.string(HxString.charCodeAt(v.matchObj.group(0),0)))
            return regex.map(path,_hx_local_0)
        return _hx_local_1()

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.dir = None
        _hx_o.file = None
        _hx_o.ext = None
        _hx_o.backslash = None


class haxe_iterators_ArrayIterator:
    _hx_class_name = "haxe.iterators.ArrayIterator"
    __slots__ = ("array", "current")
    _hx_fields = ["array", "current"]
    _hx_methods = ["hasNext", "next"]

    def __init__(self,array):
        self.current = 0
        self.array = array

    def hasNext(self):
        return (self.current < len(self.array))

    def next(self):
        def _hx_local_3():
            def _hx_local_2():
                _hx_local_0 = self
                _hx_local_1 = _hx_local_0.current
                _hx_local_0.current = (_hx_local_1 + 1)
                return _hx_local_1
            return python_internal_ArrayImpl._get(self.array, _hx_local_2())
        return _hx_local_3()

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.array = None
        _hx_o.current = None


class haxe_iterators_ArrayKeyValueIterator:
    _hx_class_name = "haxe.iterators.ArrayKeyValueIterator"
    __slots__ = ("current", "array")
    _hx_fields = ["current", "array"]
    _hx_methods = ["hasNext", "next"]

    def __init__(self,array):
        self.current = 0
        self.array = array

    def hasNext(self):
        return (self.current < len(self.array))

    def next(self):
        def _hx_local_3():
            def _hx_local_2():
                _hx_local_0 = self
                _hx_local_1 = _hx_local_0.current
                _hx_local_0.current = (_hx_local_1 + 1)
                return _hx_local_1
            return _hx_AnonObject({'value': python_internal_ArrayImpl._get(self.array, self.current), 'key': _hx_local_2()})
        return _hx_local_3()

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.current = None
        _hx_o.array = None


class haxe_iterators_DynamicAccessIterator:
    _hx_class_name = "haxe.iterators.DynamicAccessIterator"
    __slots__ = ("access", "keys", "index")
    _hx_fields = ["access", "keys", "index"]
    _hx_methods = ["hasNext", "next"]

    def __init__(self,access):
        self.access = access
        self.keys = python_Boot.fields(access)
        self.index = 0

    def hasNext(self):
        return (self.index < len(self.keys))

    def next(self):
        def _hx_local_2():
            _hx_local_0 = self
            _hx_local_1 = _hx_local_0.index
            _hx_local_0.index = (_hx_local_1 + 1)
            return _hx_local_1
        key = python_internal_ArrayImpl._get(self.keys, _hx_local_2())
        return Reflect.field(self.access,key)

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.access = None
        _hx_o.keys = None
        _hx_o.index = None


class haxe_iterators_DynamicAccessKeyValueIterator:
    _hx_class_name = "haxe.iterators.DynamicAccessKeyValueIterator"
    __slots__ = ("access", "keys", "index")
    _hx_fields = ["access", "keys", "index"]
    _hx_methods = ["hasNext", "next"]

    def __init__(self,access):
        self.access = access
        self.keys = python_Boot.fields(access)
        self.index = 0

    def hasNext(self):
        return (self.index < len(self.keys))

    def next(self):
        def _hx_local_2():
            _hx_local_0 = self
            _hx_local_1 = _hx_local_0.index
            _hx_local_0.index = (_hx_local_1 + 1)
            return _hx_local_1
        key = python_internal_ArrayImpl._get(self.keys, _hx_local_2())
        return _hx_AnonObject({'value': Reflect.field(self.access,key), 'key': key})

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.access = None
        _hx_o.keys = None
        _hx_o.index = None


class haxe_iterators_HashMapKeyValueIterator:
    _hx_class_name = "haxe.iterators.HashMapKeyValueIterator"
    __slots__ = ("map", "keys")
    _hx_fields = ["map", "keys"]
    _hx_methods = ["hasNext", "next"]

    def __init__(self,_hx_map):
        self.map = _hx_map
        self.keys = _hx_map.keys.iterator()

    def hasNext(self):
        return self.keys.hasNext()

    def next(self):
        key = self.keys.next()
        _this = self.map.values
        key1 = key.hashCode()
        return _hx_AnonObject({'value': _this.h.get(key1,None), 'key': key})

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.map = None
        _hx_o.keys = None


class haxe_iterators_MapKeyValueIterator:
    _hx_class_name = "haxe.iterators.MapKeyValueIterator"
    __slots__ = ("map", "keys")
    _hx_fields = ["map", "keys"]
    _hx_methods = ["hasNext", "next"]

    def __init__(self,_hx_map):
        self.map = _hx_map
        self.keys = _hx_map.keys()

    def hasNext(self):
        return self.keys.hasNext()

    def next(self):
        key = self.keys.next()
        return _hx_AnonObject({'value': self.map.get(key), 'key': key})

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.map = None
        _hx_o.keys = None


class haxe_iterators_RestIterator:
    _hx_class_name = "haxe.iterators.RestIterator"
    __slots__ = ("args", "current")
    _hx_fields = ["args", "current"]
    _hx_methods = ["hasNext", "next"]

    def __init__(self,args):
        self.current = 0
        self.args = args

    def hasNext(self):
        return (self.current < len(self.args))

    def next(self):
        index = self.current
        self.current = (self.current + 1)
        return python_internal_ArrayImpl._get(self.args, index)

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.args = None
        _hx_o.current = None


class haxe_iterators_RestKeyValueIterator:
    _hx_class_name = "haxe.iterators.RestKeyValueIterator"
    __slots__ = ("args", "current")
    _hx_fields = ["args", "current"]
    _hx_methods = ["hasNext", "next"]

    def __init__(self,args):
        self.current = 0
        self.args = args

    def hasNext(self):
        return (self.current < len(self.args))

    def next(self):
        tmp = self.current
        index = self.current
        self.current = (self.current + 1)
        return _hx_AnonObject({'key': tmp, 'value': python_internal_ArrayImpl._get(self.args, index)})

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.args = None
        _hx_o.current = None


class haxe_iterators_StringIterator:
    _hx_class_name = "haxe.iterators.StringIterator"
    __slots__ = ("offset", "s")
    _hx_fields = ["offset", "s"]
    _hx_methods = ["hasNext", "next"]

    def __init__(self,s):
        self.offset = 0
        self.s = s

    def hasNext(self):
        return (self.offset < len(self.s))

    def next(self):
        index = self.offset
        self.offset = (self.offset + 1)
        return ord(self.s[index])

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.offset = None
        _hx_o.s = None


class haxe_iterators_StringIteratorUnicode:
    _hx_class_name = "haxe.iterators.StringIteratorUnicode"
    __slots__ = ("offset", "s")
    _hx_fields = ["offset", "s"]
    _hx_methods = ["hasNext", "next"]
    _hx_statics = ["unicodeIterator"]

    def __init__(self,s):
        self.offset = 0
        self.s = s

    def hasNext(self):
        return (self.offset < len(self.s))

    def next(self):
        index = self.offset
        self.offset = (self.offset + 1)
        return ord(self.s[index])

    @staticmethod
    def unicodeIterator(s):
        return haxe_iterators_StringIteratorUnicode(s)

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.offset = None
        _hx_o.s = None


class haxe_iterators_StringKeyValueIterator:
    _hx_class_name = "haxe.iterators.StringKeyValueIterator"
    __slots__ = ("offset", "s")
    _hx_fields = ["offset", "s"]
    _hx_methods = ["hasNext", "next"]

    def __init__(self,s):
        self.offset = 0
        self.s = s

    def hasNext(self):
        return (self.offset < len(self.s))

    def next(self):
        tmp = self.offset
        s = self.s
        index = self.offset
        self.offset = (self.offset + 1)
        return _hx_AnonObject({'key': tmp, 'value': (-1 if ((index >= len(s))) else ord(s[index]))})

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.offset = None
        _hx_o.s = None


class python_Boot:
    _hx_class_name = "python.Boot"
    __slots__ = ()
    _hx_statics = ["keywords", "arrayJoin", "safeJoin", "isPyBool", "isPyInt", "isPyFloat", "isClass", "isAnonObject", "_add_dynamic", "toString", "toString1", "isMetaType", "fields", "isString", "isArray", "simpleField", "createClosure", "hasField", "field", "getInstanceFields", "getSuperClass", "getClassFields", "unsafeFastCodeAt", "handleKeywords", "prefixLength", "unhandleKeywords", "implementsInterface"]

    @staticmethod
    def arrayJoin(x,sep):
        return sep.join([python_Boot.toString1(x1,'') for x1 in x])

    @staticmethod
    def safeJoin(x,sep):
        return sep.join([x1 for x1 in x])

    @staticmethod
    def isPyBool(o):
        return isinstance(o,bool)

    @staticmethod
    def isPyInt(o):
        if isinstance(o,int):
            return (not isinstance(o,bool))
        else:
            return False

    @staticmethod
    def isPyFloat(o):
        return isinstance(o,float)

    @staticmethod
    def isClass(o):
        if (o is not None):
            if not HxOverrides.eq(o,str):
                return python_lib_Inspect.isclass(o)
            else:
                return True
        else:
            return False

    @staticmethod
    def isAnonObject(o):
        return isinstance(o,_hx_AnonObject)

    @staticmethod
    def _add_dynamic(a,b):
        if (isinstance(a,str) and isinstance(b,str)):
            return (a + b)
        if (isinstance(a,str) or isinstance(b,str)):
            return (python_Boot.toString1(a,"") + python_Boot.toString1(b,""))
        return (a + b)

    @staticmethod
    def toString(o):
        return python_Boot.toString1(o,"")

    @staticmethod
    def toString1(o,s):
        if (o is None):
            return "null"
        if isinstance(o,str):
            return o
        if (s is None):
            s = ""
        if (len(s) >= 5):
            return "<...>"
        if isinstance(o,bool):
            if o:
                return "true"
            else:
                return "false"
        if (isinstance(o,int) and (not isinstance(o,bool))):
            return str(o)
        if isinstance(o,float):
            try:
                if (o == int(o)):
                    return str(Math.floor((o + 0.5)))
                else:
                    return str(o)
            except BaseException as _g:
                None
                return str(o)
        if isinstance(o,list):
            o1 = o
            l = len(o1)
            st = "["
            s = (("null" if s is None else s) + "\t")
            _g = 0
            _g1 = l
            while (_g < _g1):
                i = _g
                _g = (_g + 1)
                prefix = ""
                if (i > 0):
                    prefix = ","
                st = (("null" if st is None else st) + HxOverrides.stringOrNull(((("null" if prefix is None else prefix) + HxOverrides.stringOrNull(python_Boot.toString1((o1[i] if i >= 0 and i < len(o1) else None),s))))))
            st = (("null" if st is None else st) + "]")
            return st
        try:
            if hasattr(o,"toString"):
                return o.toString()
        except BaseException as _g:
            None
        if hasattr(o,"__class__"):
            if isinstance(o,_hx_AnonObject):
                toStr = None
                try:
                    fields = python_Boot.fields(o)
                    _g = []
                    _g1 = 0
                    while (_g1 < len(fields)):
                        f = (fields[_g1] if _g1 >= 0 and _g1 < len(fields) else None)
                        _g1 = (_g1 + 1)
                        x = ((("" + ("null" if f is None else f)) + " : ") + HxOverrides.stringOrNull(python_Boot.toString1(python_Boot.simpleField(o,f),(("null" if s is None else s) + "\t"))))
                        _g.append(x)
                    fieldsStr = _g
                    toStr = (("{ " + HxOverrides.stringOrNull(", ".join([x1 for x1 in fieldsStr]))) + " }")
                except BaseException as _g:
                    None
                    return "{ ... }"
                if (toStr is None):
                    return "{ ... }"
                else:
                    return toStr
            if isinstance(o,Enum):
                o1 = o
                l = len(o1.params)
                hasParams = (l > 0)
                if hasParams:
                    paramsStr = ""
                    _g = 0
                    _g1 = l
                    while (_g < _g1):
                        i = _g
                        _g = (_g + 1)
                        prefix = ""
                        if (i > 0):
                            prefix = ","
                        paramsStr = (("null" if paramsStr is None else paramsStr) + HxOverrides.stringOrNull(((("null" if prefix is None else prefix) + HxOverrides.stringOrNull(python_Boot.toString1(o1.params[i],s))))))
                    return (((HxOverrides.stringOrNull(o1.tag) + "(") + ("null" if paramsStr is None else paramsStr)) + ")")
                else:
                    return o1.tag
            if hasattr(o,"_hx_class_name"):
                if (o.__class__.__name__ != "type"):
                    fields = python_Boot.getInstanceFields(o)
                    _g = []
                    _g1 = 0
                    while (_g1 < len(fields)):
                        f = (fields[_g1] if _g1 >= 0 and _g1 < len(fields) else None)
                        _g1 = (_g1 + 1)
                        x = ((("" + ("null" if f is None else f)) + " : ") + HxOverrides.stringOrNull(python_Boot.toString1(python_Boot.simpleField(o,f),(("null" if s is None else s) + "\t"))))
                        _g.append(x)
                    fieldsStr = _g
                    toStr = (((HxOverrides.stringOrNull(o._hx_class_name) + "( ") + HxOverrides.stringOrNull(", ".join([x1 for x1 in fieldsStr]))) + " )")
                    return toStr
                else:
                    fields = python_Boot.getClassFields(o)
                    _g = []
                    _g1 = 0
                    while (_g1 < len(fields)):
                        f = (fields[_g1] if _g1 >= 0 and _g1 < len(fields) else None)
                        _g1 = (_g1 + 1)
                        x = ((("" + ("null" if f is None else f)) + " : ") + HxOverrides.stringOrNull(python_Boot.toString1(python_Boot.simpleField(o,f),(("null" if s is None else s) + "\t"))))
                        _g.append(x)
                    fieldsStr = _g
                    toStr = (((("#" + HxOverrides.stringOrNull(o._hx_class_name)) + "( ") + HxOverrides.stringOrNull(", ".join([x1 for x1 in fieldsStr]))) + " )")
                    return toStr
            if ((type(o) == type) and (o == str)):
                return "#String"
            if ((type(o) == type) and (o == list)):
                return "#Array"
            if callable(o):
                return "function"
            try:
                if hasattr(o,"__repr__"):
                    return o.__repr__()
            except BaseException as _g:
                None
            if hasattr(o,"__str__"):
                return o.__str__([])
            if hasattr(o,"__name__"):
                return o.__name__
            return "???"
        else:
            return str(o)

    @staticmethod
    def isMetaType(v,t):
        return ((type(v) == type) and (v == t))

    @staticmethod
    def fields(o):
        a = []
        if (o is not None):
            if hasattr(o,"_hx_fields"):
                fields = o._hx_fields
                if (fields is not None):
                    return list(fields)
            if isinstance(o,_hx_AnonObject):
                d = o.__dict__
                keys = d.keys()
                handler = python_Boot.unhandleKeywords
                for k in keys:
                    if (k != '_hx_disable_getattr'):
                        a.append(handler(k))
            elif hasattr(o,"__dict__"):
                d = o.__dict__
                keys1 = d.keys()
                for k in keys1:
                    a.append(k)
        return a

    @staticmethod
    def isString(o):
        return isinstance(o,str)

    @staticmethod
    def isArray(o):
        return isinstance(o,list)

    @staticmethod
    def simpleField(o,field):
        if (field is None):
            return None
        field1 = (("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field))
        if hasattr(o,field1):
            return getattr(o,field1)
        else:
            return None

    @staticmethod
    def createClosure(obj,func):
        return python_internal_MethodClosure(obj,func)

    @staticmethod
    def hasField(o,field):
        if isinstance(o,_hx_AnonObject):
            return o._hx_hasattr(field)
        return hasattr(o,(("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field)))

    @staticmethod
    def field(o,field):
        if (field is None):
            return None
        if isinstance(o,str):
            field1 = field
            _hx_local_0 = len(field1)
            if (_hx_local_0 == 10):
                if (field1 == "charCodeAt"):
                    return python_internal_MethodClosure(o,HxString.charCodeAt)
                else:
                    field1 = (("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field))
                    if hasattr(o,field1):
                        return getattr(o,field1)
                    else:
                        return None
            elif (_hx_local_0 == 11):
                if (field1 == "lastIndexOf"):
                    return python_internal_MethodClosure(o,HxString.lastIndexOf)
                elif (field1 == "toLowerCase"):
                    return python_internal_MethodClosure(o,HxString.toLowerCase)
                elif (field1 == "toUpperCase"):
                    return python_internal_MethodClosure(o,HxString.toUpperCase)
                else:
                    field1 = (("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field))
                    if hasattr(o,field1):
                        return getattr(o,field1)
                    else:
                        return None
            elif (_hx_local_0 == 9):
                if (field1 == "substring"):
                    return python_internal_MethodClosure(o,HxString.substring)
                else:
                    field1 = (("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field))
                    if hasattr(o,field1):
                        return getattr(o,field1)
                    else:
                        return None
            elif (_hx_local_0 == 5):
                if (field1 == "split"):
                    return python_internal_MethodClosure(o,HxString.split)
                else:
                    field1 = (("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field))
                    if hasattr(o,field1):
                        return getattr(o,field1)
                    else:
                        return None
            elif (_hx_local_0 == 7):
                if (field1 == "indexOf"):
                    return python_internal_MethodClosure(o,HxString.indexOf)
                else:
                    field1 = (("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field))
                    if hasattr(o,field1):
                        return getattr(o,field1)
                    else:
                        return None
            elif (_hx_local_0 == 8):
                if (field1 == "toString"):
                    return python_internal_MethodClosure(o,HxString.toString)
                else:
                    field1 = (("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field))
                    if hasattr(o,field1):
                        return getattr(o,field1)
                    else:
                        return None
            elif (_hx_local_0 == 6):
                if (field1 == "charAt"):
                    return python_internal_MethodClosure(o,HxString.charAt)
                elif (field1 == "length"):
                    return len(o)
                elif (field1 == "substr"):
                    return python_internal_MethodClosure(o,HxString.substr)
                else:
                    field1 = (("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field))
                    if hasattr(o,field1):
                        return getattr(o,field1)
                    else:
                        return None
            else:
                field1 = (("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field))
                if hasattr(o,field1):
                    return getattr(o,field1)
                else:
                    return None
        elif isinstance(o,list):
            field1 = field
            _hx_local_1 = len(field1)
            if (_hx_local_1 == 11):
                if (field1 == "lastIndexOf"):
                    return python_internal_MethodClosure(o,python_internal_ArrayImpl.lastIndexOf)
                else:
                    field1 = (("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field))
                    if hasattr(o,field1):
                        return getattr(o,field1)
                    else:
                        return None
            elif (_hx_local_1 == 4):
                if (field1 == "copy"):
                    return python_internal_MethodClosure(o,python_internal_ArrayImpl.copy)
                elif (field1 == "join"):
                    return python_internal_MethodClosure(o,python_internal_ArrayImpl.join)
                elif (field1 == "push"):
                    return python_internal_MethodClosure(o,python_internal_ArrayImpl.push)
                elif (field1 == "sort"):
                    return python_internal_MethodClosure(o,python_internal_ArrayImpl.sort)
                else:
                    field1 = (("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field))
                    if hasattr(o,field1):
                        return getattr(o,field1)
                    else:
                        return None
            elif (_hx_local_1 == 5):
                if (field1 == "shift"):
                    return python_internal_MethodClosure(o,python_internal_ArrayImpl.shift)
                elif (field1 == "slice"):
                    return python_internal_MethodClosure(o,python_internal_ArrayImpl.slice)
                else:
                    field1 = (("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field))
                    if hasattr(o,field1):
                        return getattr(o,field1)
                    else:
                        return None
            elif (_hx_local_1 == 7):
                if (field1 == "indexOf"):
                    return python_internal_MethodClosure(o,python_internal_ArrayImpl.indexOf)
                elif (field1 == "reverse"):
                    return python_internal_MethodClosure(o,python_internal_ArrayImpl.reverse)
                elif (field1 == "unshift"):
                    return python_internal_MethodClosure(o,python_internal_ArrayImpl.unshift)
                else:
                    field1 = (("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field))
                    if hasattr(o,field1):
                        return getattr(o,field1)
                    else:
                        return None
            elif (_hx_local_1 == 3):
                if (field1 == "map"):
                    return python_internal_MethodClosure(o,python_internal_ArrayImpl.map)
                elif (field1 == "pop"):
                    return python_internal_MethodClosure(o,python_internal_ArrayImpl.pop)
                else:
                    field1 = (("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field))
                    if hasattr(o,field1):
                        return getattr(o,field1)
                    else:
                        return None
            elif (_hx_local_1 == 8):
                if (field1 == "contains"):
                    return python_internal_MethodClosure(o,python_internal_ArrayImpl.contains)
                elif (field1 == "iterator"):
                    return python_internal_MethodClosure(o,python_internal_ArrayImpl.iterator)
                elif (field1 == "toString"):
                    return python_internal_MethodClosure(o,python_internal_ArrayImpl.toString)
                else:
                    field1 = (("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field))
                    if hasattr(o,field1):
                        return getattr(o,field1)
                    else:
                        return None
            elif (_hx_local_1 == 16):
                if (field1 == "keyValueIterator"):
                    return python_internal_MethodClosure(o,python_internal_ArrayImpl.keyValueIterator)
                else:
                    field1 = (("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field))
                    if hasattr(o,field1):
                        return getattr(o,field1)
                    else:
                        return None
            elif (_hx_local_1 == 6):
                if (field1 == "concat"):
                    return python_internal_MethodClosure(o,python_internal_ArrayImpl.concat)
                elif (field1 == "filter"):
                    return python_internal_MethodClosure(o,python_internal_ArrayImpl.filter)
                elif (field1 == "insert"):
                    return python_internal_MethodClosure(o,python_internal_ArrayImpl.insert)
                elif (field1 == "length"):
                    return len(o)
                elif (field1 == "remove"):
                    return python_internal_MethodClosure(o,python_internal_ArrayImpl.remove)
                elif (field1 == "splice"):
                    return python_internal_MethodClosure(o,python_internal_ArrayImpl.splice)
                else:
                    field1 = (("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field))
                    if hasattr(o,field1):
                        return getattr(o,field1)
                    else:
                        return None
            else:
                field1 = (("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field))
                if hasattr(o,field1):
                    return getattr(o,field1)
                else:
                    return None
        else:
            field1 = (("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field))
            if hasattr(o,field1):
                return getattr(o,field1)
            else:
                return None

    @staticmethod
    def getInstanceFields(c):
        f = (list(c._hx_fields) if (hasattr(c,"_hx_fields")) else [])
        if hasattr(c,"_hx_methods"):
            f = (f + c._hx_methods)
        sc = python_Boot.getSuperClass(c)
        if (sc is None):
            return f
        else:
            scArr = python_Boot.getInstanceFields(sc)
            scMap = set(scArr)
            _g = 0
            while (_g < len(f)):
                f1 = (f[_g] if _g >= 0 and _g < len(f) else None)
                _g = (_g + 1)
                if (not (f1 in scMap)):
                    scArr.append(f1)
            return scArr

    @staticmethod
    def getSuperClass(c):
        if (c is None):
            return None
        try:
            if hasattr(c,"_hx_super"):
                return c._hx_super
            return None
        except BaseException as _g:
            None
        return None

    @staticmethod
    def getClassFields(c):
        if hasattr(c,"_hx_statics"):
            x = c._hx_statics
            return list(x)
        else:
            return []

    @staticmethod
    def unsafeFastCodeAt(s,index):
        return ord(s[index])

    @staticmethod
    def handleKeywords(name):
        if (name in python_Boot.keywords):
            return ("_hx_" + name)
        elif ((((len(name) > 2) and ((ord(name[0]) == 95))) and ((ord(name[1]) == 95))) and ((ord(name[(len(name) - 1)]) != 95))):
            return ("_hx_" + name)
        else:
            return name

    @staticmethod
    def unhandleKeywords(name):
        if (HxString.substr(name,0,python_Boot.prefixLength) == "_hx_"):
            real = HxString.substr(name,python_Boot.prefixLength,None)
            if (real in python_Boot.keywords):
                return real
        return name

    @staticmethod
    def implementsInterface(value,cls):
        loop = None
        def _hx_local_1(intf):
            f = (intf._hx_interfaces if (hasattr(intf,"_hx_interfaces")) else [])
            if (f is not None):
                _g = 0
                while (_g < len(f)):
                    i = (f[_g] if _g >= 0 and _g < len(f) else None)
                    _g = (_g + 1)
                    if (i == cls):
                        return True
                    else:
                        l = loop(i)
                        if l:
                            return True
                return False
            else:
                return False
        loop = _hx_local_1
        currentClass = value.__class__
        result = False
        while (currentClass is not None):
            if loop(currentClass):
                result = True
                break
            currentClass = python_Boot.getSuperClass(currentClass)
        return result


class python_HaxeIterable:
    _hx_class_name = "python.HaxeIterable"
    __slots__ = ("x",)
    _hx_fields = ["x"]
    _hx_methods = ["iterator"]

    def __init__(self,x):
        self.x = x

    def iterator(self):
        return python_HaxeIterator(self.x.__iter__())

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.x = None


class python_HaxeIterator:
    _hx_class_name = "python.HaxeIterator"
    __slots__ = ("it", "x", "has", "checked")
    _hx_fields = ["it", "x", "has", "checked"]
    _hx_methods = ["next", "hasNext"]

    def __init__(self,it):
        self.checked = False
        self.has = False
        self.x = None
        self.it = it

    def next(self):
        if (not self.checked):
            self.hasNext()
        self.checked = False
        return self.x

    def hasNext(self):
        if (not self.checked):
            try:
                self.x = self.it.__next__()
                self.has = True
            except BaseException as _g:
                None
                if Std.isOfType(haxe_Exception.caught(_g).unwrap(),StopIteration):
                    self.has = False
                    self.x = None
                else:
                    raise _g
            self.checked = True
        return self.has

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.it = None
        _hx_o.x = None
        _hx_o.has = None
        _hx_o.checked = None


class python__KwArgs_KwArgs_Impl_:
    _hx_class_name = "python._KwArgs.KwArgs_Impl_"
    __slots__ = ()
    _hx_statics = ["_new", "toDict", "toDictHelper", "fromDict", "fromT", "typed", "get"]

    @staticmethod
    def _new(d):
        this1 = d
        return this1

    @staticmethod
    def toDict(this1):
        return python__KwArgs_KwArgs_Impl_.toDictHelper(this1,None)

    @staticmethod
    def toDictHelper(this1,x):
        return this1

    @staticmethod
    def fromDict(d):
        this1 = d
        return this1

    @staticmethod
    def fromT(d):
        this1 = python_Lib.anonAsDict(d)
        return this1

    @staticmethod
    def typed(this1):
        return _hx_AnonObject(python__KwArgs_KwArgs_Impl_.toDictHelper(this1,None))

    @staticmethod
    def get(this1,key,_hx_def):
        return this1.get(key,_hx_def)


class python_Lib:
    _hx_class_name = "python.Lib"
    __slots__ = ()
    _hx_statics = ["lineEnd", "get___name__", "print", "printString", "println", "dictToAnon", "anonToDict", "anonAsDict", "dictAsAnon", "toPythonIterable", "toHaxeIterable", "toHaxeIterator"]
    __name__ = None

    @staticmethod
    def get___name__():
        return __name__

    @staticmethod
    def print(v):
        python_Lib.printString(Std.string(v))

    @staticmethod
    def printString(_hx_str):
        encoding = "utf-8"
        if (encoding is None):
            encoding = "utf-8"
        python_lib_Sys.stdout.buffer.write(_hx_str.encode(encoding, "strict"))
        python_lib_Sys.stdout.flush()

    @staticmethod
    def println(v):
        _hx_str = Std.string(v)
        python_Lib.printString((("" + ("null" if _hx_str is None else _hx_str)) + HxOverrides.stringOrNull(python_Lib.lineEnd)))

    @staticmethod
    def dictToAnon(v):
        return _hx_AnonObject(v.copy())

    @staticmethod
    def anonToDict(o):
        if isinstance(o,_hx_AnonObject):
            return o.__dict__.copy()
        else:
            return None

    @staticmethod
    def anonAsDict(o):
        if isinstance(o,_hx_AnonObject):
            return o.__dict__
        else:
            return None

    @staticmethod
    def dictAsAnon(d):
        return _hx_AnonObject(d)

    @staticmethod
    def toPythonIterable(it):
        def _hx_local_3():
            def _hx_local_2():
                it1 = HxOverrides.iterator(it)
                _hx_self = None
                def _hx_local_0():
                    if it1.hasNext():
                        return it1.next()
                    else:
                        raise haxe_Exception.thrown(StopIteration())
                def _hx_local_1():
                    return _hx_self
                this1 = _hx_AnonObject({'__next__': _hx_local_0, '__iter__': _hx_local_1})
                _hx_self = this1
                return _hx_self
            return _hx_AnonObject({'__iter__': _hx_local_2})
        return _hx_local_3()

    @staticmethod
    def toHaxeIterable(it):
        return python_HaxeIterable(it)

    @staticmethod
    def toHaxeIterator(it):
        return python_HaxeIterator(it)


class python__NativeIterable_NativeIterable_Impl_:
    _hx_class_name = "python._NativeIterable.NativeIterable_Impl_"
    __slots__ = ()
    _hx_statics = ["toHaxeIterable", "iterator"]

    @staticmethod
    def toHaxeIterable(this1):
        return python_HaxeIterable(this1)

    @staticmethod
    def iterator(this1):
        return python_HaxeIterator(this1.__iter__())


class python__NativeIterator_NativeIterator_Impl_:
    _hx_class_name = "python._NativeIterator.NativeIterator_Impl_"
    __slots__ = ()
    _hx_statics = ["_new", "toHaxeIterator"]

    @staticmethod
    def _new(p):
        this1 = p
        return this1

    @staticmethod
    def toHaxeIterator(this1):
        return python_HaxeIterator(this1)


class python_NativeStringTools:
    _hx_class_name = "python.NativeStringTools"
    __slots__ = ()
    _hx_statics = ["format", "encode", "contains", "strip", "rpartition", "startswith", "endswith"]

    @staticmethod
    def format(s,args):
        return s.format(*args)

    @staticmethod
    def encode(s,encoding = None,errors = None):
        if (encoding is None):
            encoding = "utf-8"
        if (errors is None):
            errors = "strict"
        return s.encode(encoding, errors)

    @staticmethod
    def contains(s,e):
        return (e in s)

    @staticmethod
    def strip(s,chars = None):
        return s.strip(chars)

    @staticmethod
    def rpartition(s,sep):
        return s.rpartition(sep)

    @staticmethod
    def startswith(s,prefix):
        return s.startswith(prefix)

    @staticmethod
    def endswith(s,suffix):
        return s.endswith(suffix)


class python__VarArgs_VarArgs_Impl_:
    _hx_class_name = "python._VarArgs.VarArgs_Impl_"
    __slots__ = ()
    _hx_statics = ["_new", "raw", "toArray", "fromArray"]

    @staticmethod
    def _new(d):
        this1 = d
        return this1

    @staticmethod
    def raw(this1):
        return this1

    @staticmethod
    def toArray(this1):
        if (not Std.isOfType(this1,list)):
            return list(this1)
        else:
            return this1

    @staticmethod
    def fromArray(d):
        this1 = d
        return this1


class python_internal_ArrayImpl:
    _hx_class_name = "python.internal.ArrayImpl"
    __slots__ = ()
    _hx_statics = ["get_length", "concat", "copy", "iterator", "keyValueIterator", "indexOf", "lastIndexOf", "join", "toString", "pop", "push", "unshift", "remove", "contains", "shift", "slice", "sort", "splice", "map", "filter", "insert", "reverse", "_get", "_set", "unsafeGet", "unsafeSet", "resize"]

    @staticmethod
    def get_length(x):
        return len(x)

    @staticmethod
    def concat(a1,a2):
        return (a1 + a2)

    @staticmethod
    def copy(x):
        return list(x)

    @staticmethod
    def iterator(x):
        return python_HaxeIterator(x.__iter__())

    @staticmethod
    def keyValueIterator(x):
        return haxe_iterators_ArrayKeyValueIterator(x)

    @staticmethod
    def indexOf(a,x,fromIndex = None):
        _hx_len = len(a)
        l = (0 if ((fromIndex is None)) else ((_hx_len + fromIndex) if ((fromIndex < 0)) else fromIndex))
        if (l < 0):
            l = 0
        _g = l
        _g1 = _hx_len
        while (_g < _g1):
            i = _g
            _g = (_g + 1)
            if HxOverrides.eq(a[i],x):
                return i
        return -1

    @staticmethod
    def lastIndexOf(a,x,fromIndex = None):
        _hx_len = len(a)
        l = (_hx_len if ((fromIndex is None)) else (((_hx_len + fromIndex) + 1) if ((fromIndex < 0)) else (fromIndex + 1)))
        if (l > _hx_len):
            l = _hx_len
        while True:
            l = (l - 1)
            tmp = l
            if (not ((tmp > -1))):
                break
            if HxOverrides.eq(a[l],x):
                return l
        return -1

    @staticmethod
    def join(x,sep):
        return sep.join([python_Boot.toString1(x1,'') for x1 in x])

    @staticmethod
    def toString(x):
        return (("[" + HxOverrides.stringOrNull(",".join([python_Boot.toString1(x1,'') for x1 in x]))) + "]")

    @staticmethod
    def pop(x):
        if (len(x) == 0):
            return None
        else:
            return x.pop()

    @staticmethod
    def push(x,e):
        x.append(e)
        return len(x)

    @staticmethod
    def unshift(x,e):
        x.insert(0, e)

    @staticmethod
    def remove(x,e):
        try:
            x.remove(e)
            return True
        except BaseException as _g:
            None
            return False

    @staticmethod
    def contains(x,e):
        return (e in x)

    @staticmethod
    def shift(x):
        if (len(x) == 0):
            return None
        return x.pop(0)

    @staticmethod
    def slice(x,pos,end = None):
        return x[pos:end]

    @staticmethod
    def sort(x,f):
        x.sort(key= python_lib_Functools.cmp_to_key(f))

    @staticmethod
    def splice(x,pos,_hx_len):
        if (pos < 0):
            pos = (len(x) + pos)
        if (pos < 0):
            pos = 0
        res = x[pos:(pos + _hx_len)]
        del x[pos:(pos + _hx_len)]
        return res

    @staticmethod
    def map(x,f):
        return list(map(f,x))

    @staticmethod
    def filter(x,f):
        return list(filter(f,x))

    @staticmethod
    def insert(a,pos,x):
        a.insert(pos, x)

    @staticmethod
    def reverse(a):
        a.reverse()

    @staticmethod
    def _get(x,idx):
        if ((idx > -1) and ((idx < len(x)))):
            return x[idx]
        else:
            return None

    @staticmethod
    def _set(x,idx,v):
        l = len(x)
        while (l < idx):
            x.append(None)
            l = (l + 1)
        if (l == idx):
            x.append(v)
        else:
            x[idx] = v
        return v

    @staticmethod
    def unsafeGet(x,idx):
        return x[idx]

    @staticmethod
    def unsafeSet(x,idx,val):
        x[idx] = val
        return val

    @staticmethod
    def resize(x,_hx_len):
        l = len(x)
        if (l < _hx_len):
            idx = (_hx_len - 1)
            v = None
            l1 = len(x)
            while (l1 < idx):
                x.append(None)
                l1 = (l1 + 1)
            if (l1 == idx):
                x.append(v)
            else:
                x[idx] = v
        elif (l > _hx_len):
            pos = _hx_len
            len1 = (l - _hx_len)
            if (pos < 0):
                pos = (len(x) + pos)
            if (pos < 0):
                pos = 0
            res = x[pos:(pos + len1)]
            del x[pos:(pos + len1)]


class HxOverrides:
    _hx_class_name = "HxOverrides"
    __slots__ = ()
    _hx_statics = ["iterator", "keyValueIterator", "eq", "stringOrNull", "shift", "pop", "push", "join", "filter", "map", "toUpperCase", "toLowerCase", "split", "length", "rshift", "modf", "mod", "arrayGet", "arraySet", "mapKwArgs", "reverseMapKwArgs"]

    @staticmethod
    def iterator(x):
        if isinstance(x,list):
            return haxe_iterators_ArrayIterator(x)
        return x.iterator()

    @staticmethod
    def keyValueIterator(x):
        if isinstance(x,list):
            return haxe_iterators_ArrayKeyValueIterator(x)
        return x.keyValueIterator()

    @staticmethod
    def eq(a,b):
        if (isinstance(a,list) or isinstance(b,list)):
            return a is b
        return (a == b)

    @staticmethod
    def stringOrNull(s):
        if (s is None):
            return "null"
        else:
            return s

    @staticmethod
    def shift(x):
        if isinstance(x,list):
            _this = x
            return (None if ((len(_this) == 0)) else _this.pop(0))
        return x.shift()

    @staticmethod
    def pop(x):
        if isinstance(x,list):
            _this = x
            return (None if ((len(_this) == 0)) else _this.pop())
        return x.pop()

    @staticmethod
    def push(x,e):
        if isinstance(x,list):
            _this = x
            _this.append(e)
            return len(_this)
        return x.push(e)

    @staticmethod
    def join(x,sep):
        if isinstance(x,list):
            return sep.join([python_Boot.toString1(x1,'') for x1 in x])
        return x.join(sep)

    @staticmethod
    def filter(x,f):
        if isinstance(x,list):
            return list(filter(f,x))
        return x.filter(f)

    @staticmethod
    def map(x,f):
        if isinstance(x,list):
            return list(map(f,x))
        return x.map(f)

    @staticmethod
    def toUpperCase(x):
        if isinstance(x,str):
            return x.upper()
        return x.toUpperCase()

    @staticmethod
    def toLowerCase(x):
        if isinstance(x,str):
            return x.lower()
        return x.toLowerCase()

    @staticmethod
    def split(x,delimiter):
        if isinstance(x,str):
            _this = x
            if (delimiter == ""):
                return list(_this)
            else:
                return _this.split(delimiter)
        return x.split(delimiter)

    @staticmethod
    def length(x):
        if isinstance(x,str):
            return len(x)
        elif isinstance(x,list):
            return len(x)
        return x.length

    @staticmethod
    def rshift(val,n):
        return ((val % 0x100000000) >> n)

    @staticmethod
    def modf(a,b):
        if (b == 0.0):
            return float('nan')
        elif (a < 0):
            if (b < 0):
                return -(-a % (-b))
            else:
                return -(-a % b)
        elif (b < 0):
            return a % (-b)
        else:
            return a % b

    @staticmethod
    def mod(a,b):
        if (a < 0):
            if (b < 0):
                return -(-a % (-b))
            else:
                return -(-a % b)
        elif (b < 0):
            return a % (-b)
        else:
            return a % b

    @staticmethod
    def arrayGet(a,i):
        if isinstance(a,list):
            x = a
            if ((i > -1) and ((i < len(x)))):
                return x[i]
            else:
                return None
        else:
            return a[i]

    @staticmethod
    def arraySet(a,i,v):
        if isinstance(a,list):
            x = a
            v1 = v
            l = len(x)
            while (l < i):
                x.append(None)
                l = (l + 1)
            if (l == i):
                x.append(v1)
            else:
                x[i] = v1
            return v1
        else:
            a[i] = v
            return v

    @staticmethod
    def mapKwArgs(a,v):
        a1 = _hx_AnonObject(python_Lib.anonToDict(a))
        k = python_HaxeIterator(iter(v.keys()))
        while k.hasNext():
            k1 = k.next()
            val = v.get(k1)
            if a1._hx_hasattr(k1):
                x = getattr(a1,k1)
                setattr(a1,val,x)
                delattr(a1,k1)
        return a1

    @staticmethod
    def reverseMapKwArgs(a,v):
        a1 = a.copy()
        k = python_HaxeIterator(iter(v.keys()))
        while k.hasNext():
            k1 = k.next()
            val = v.get(k1)
            if (val in a1):
                x = a1.get(val,None)
                a1[k1] = x
                del a1[val]
        return a1


class python_internal_Internal:
    _hx_class_name = "python.internal.Internal"
    __slots__ = ()


class python_internal_MethodClosure:
    _hx_class_name = "python.internal.MethodClosure"
    __slots__ = ("obj", "func")
    _hx_fields = ["obj", "func"]
    _hx_methods = ["__call__"]

    def __init__(self,obj,func):
        self.obj = obj
        self.func = func

    def __call__(self,*args):
        return self.func(self.obj,*args)

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.obj = None
        _hx_o.func = None


class HxString:
    _hx_class_name = "HxString"
    __slots__ = ()
    _hx_statics = ["split", "charCodeAt", "charAt", "lastIndexOf", "toUpperCase", "toLowerCase", "indexOf", "indexOfImpl", "toString", "get_length", "fromCharCode", "substring", "substr"]

    @staticmethod
    def split(s,d):
        if (d == ""):
            return list(s)
        else:
            return s.split(d)

    @staticmethod
    def charCodeAt(s,index):
        if ((((s is None) or ((len(s) == 0))) or ((index < 0))) or ((index >= len(s)))):
            return None
        else:
            return ord(s[index])

    @staticmethod
    def charAt(s,index):
        if ((index < 0) or ((index >= len(s)))):
            return ""
        else:
            return s[index]

    @staticmethod
    def lastIndexOf(s,_hx_str,startIndex = None):
        if (startIndex is None):
            return s.rfind(_hx_str, 0, len(s))
        elif (_hx_str == ""):
            length = len(s)
            if (startIndex < 0):
                startIndex = (length + startIndex)
                if (startIndex < 0):
                    startIndex = 0
            if (startIndex > length):
                return length
            else:
                return startIndex
        else:
            i = s.rfind(_hx_str, 0, (startIndex + 1))
            startLeft = (max(0,((startIndex + 1) - len(_hx_str))) if ((i == -1)) else (i + 1))
            check = s.find(_hx_str, startLeft, len(s))
            if ((check > i) and ((check <= startIndex))):
                return check
            else:
                return i

    @staticmethod
    def toUpperCase(s):
        return s.upper()

    @staticmethod
    def toLowerCase(s):
        return s.lower()

    @staticmethod
    def indexOf(s,_hx_str,startIndex = None):
        if (startIndex is None):
            return s.find(_hx_str)
        else:
            return HxString.indexOfImpl(s,_hx_str,startIndex)

    @staticmethod
    def indexOfImpl(s,_hx_str,startIndex):
        if (_hx_str == ""):
            length = len(s)
            if (startIndex < 0):
                startIndex = (length + startIndex)
                if (startIndex < 0):
                    startIndex = 0
            if (startIndex > length):
                return length
            else:
                return startIndex
        return s.find(_hx_str, startIndex)

    @staticmethod
    def toString(s):
        return s

    @staticmethod
    def get_length(s):
        return len(s)

    @staticmethod
    def fromCharCode(code):
        return "".join(map(chr,[code]))

    @staticmethod
    def substring(s,startIndex,endIndex = None):
        if (startIndex < 0):
            startIndex = 0
        if (endIndex is None):
            return s[startIndex:]
        else:
            if (endIndex < 0):
                endIndex = 0
            if (endIndex < startIndex):
                return s[endIndex:startIndex]
            else:
                return s[startIndex:endIndex]

    @staticmethod
    def substr(s,startIndex,_hx_len = None):
        if (_hx_len is None):
            return s[startIndex:]
        else:
            if (_hx_len == 0):
                return ""
            if (startIndex < 0):
                startIndex = (len(s) + startIndex)
                if (startIndex < 0):
                    startIndex = 0
            return s[startIndex:(startIndex + _hx_len)]


class python_io_NativeInput(haxe_io_Input):
    _hx_class_name = "python.io.NativeInput"
    __slots__ = ("stream", "wasEof")
    _hx_fields = ["stream", "wasEof"]
    _hx_methods = ["get_canSeek", "close", "tell", "throwEof", "eof", "readinto", "seek", "readBytes"]
    _hx_statics = []
    _hx_interfaces = []
    _hx_super = haxe_io_Input


    def __init__(self,s):
        self.wasEof = None
        self.stream = s
        self.set_bigEndian(False)
        self.wasEof = False
        if (not self.stream.readable()):
            raise haxe_Exception.thrown("Write-only stream")

    def get_canSeek(self):
        return self.stream.seekable()

    def close(self):
        self.stream.close()

    def tell(self):
        return self.stream.tell()

    def throwEof(self):
        self.wasEof = True
        raise haxe_Exception.thrown(haxe_io_Eof())

    def eof(self):
        return self.wasEof

    def readinto(self,b):
        raise haxe_Exception.thrown("abstract method, should be overridden")

    def seek(self,p,mode):
        raise haxe_Exception.thrown("abstract method, should be overridden")

    def readBytes(self,s,pos,_hx_len):
        if (((pos < 0) or ((_hx_len < 0))) or (((pos + _hx_len) > s.length))):
            raise haxe_Exception.thrown(haxe_io_Error.OutsideBounds)
        ba = bytearray(_hx_len)
        ret = self.readinto(ba)
        if (ret == 0):
            self.throwEof()
        s.blit(pos,haxe_io_Bytes.ofData(ba),0,_hx_len)
        return ret

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.stream = None
        _hx_o.wasEof = None


class python_io_IInput:
    _hx_class_name = "python.io.IInput"
    __slots__ = ("bigEndian",)
    _hx_fields = ["bigEndian"]
    _hx_methods = ["set_bigEndian", "readByte", "readBytes", "close", "readAll", "readFullBytes", "read", "readUntil", "readLine", "readFloat", "readDouble", "readInt8", "readInt16", "readUInt16", "readInt24", "readUInt24", "readInt32", "readString"]


class python_io_NativeBytesInput(python_io_NativeInput):
    _hx_class_name = "python.io.NativeBytesInput"
    __slots__ = ()
    _hx_fields = []
    _hx_methods = ["readByte", "seek", "readinto"]
    _hx_statics = []
    _hx_interfaces = [python_io_IInput]
    _hx_super = python_io_NativeInput


    def __init__(self,stream):
        super().__init__(stream)

    def readByte(self):
        ret = self.stream.read(1)
        if (len(ret) == 0):
            self.throwEof()
        return ret[0]

    def seek(self,p,pos):
        self.wasEof = False
        python_io_IoTools.seekInBinaryMode(self.stream,p,pos)

    def readinto(self,b):
        return self.stream.readinto(b)

    @staticmethod
    def _hx_empty_init(_hx_o):        pass


class python_io_IFileInput:
    _hx_class_name = "python.io.IFileInput"
    __slots__ = ()
    _hx_methods = ["seek", "tell", "eof"]
    _hx_interfaces = [python_io_IInput]


class python_io_FileBytesInput(python_io_NativeBytesInput):
    _hx_class_name = "python.io.FileBytesInput"
    __slots__ = ()
    _hx_fields = []
    _hx_methods = []
    _hx_statics = []
    _hx_interfaces = [python_io_IFileInput]
    _hx_super = python_io_NativeBytesInput


    def __init__(self,stream):
        super().__init__(stream)


class python_io_NativeOutput(haxe_io_Output):
    _hx_class_name = "python.io.NativeOutput"
    __slots__ = ("stream",)
    _hx_fields = ["stream"]
    _hx_methods = ["get_canSeek", "close", "prepare", "flush", "tell"]
    _hx_statics = []
    _hx_interfaces = []
    _hx_super = haxe_io_Output


    def __init__(self,stream):
        self.stream = None
        self.set_bigEndian(False)
        self.stream = stream
        if (not stream.writable()):
            raise haxe_Exception.thrown("Read only stream")

    def get_canSeek(self):
        return self.stream.seekable()

    def close(self):
        self.stream.close()

    def prepare(self,nbytes):
        self.stream.truncate(nbytes)

    def flush(self):
        self.stream.flush()

    def tell(self):
        return self.stream.tell()

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.stream = None


class python_io_NativeBytesOutput(python_io_NativeOutput):
    _hx_class_name = "python.io.NativeBytesOutput"
    __slots__ = ()
    _hx_fields = []
    _hx_methods = ["seek", "prepare", "writeByte", "writeBytes"]
    _hx_statics = []
    _hx_interfaces = []
    _hx_super = python_io_NativeOutput


    def __init__(self,stream):
        super().__init__(stream)

    def seek(self,p,pos):
        python_io_IoTools.seekInBinaryMode(self.stream,p,pos)

    def prepare(self,nbytes):
        self.stream.truncate(nbytes)

    def writeByte(self,c):
        self.stream.write(bytearray([c]))

    def writeBytes(self,s,pos,_hx_len):
        return self.stream.write(s.b[pos:(pos + _hx_len)])

    @staticmethod
    def _hx_empty_init(_hx_o):        pass


class python_io_IOutput:
    _hx_class_name = "python.io.IOutput"
    __slots__ = ("bigEndian",)
    _hx_fields = ["bigEndian"]
    _hx_methods = ["set_bigEndian", "writeByte", "writeBytes", "flush", "close", "write", "writeFullBytes", "writeFloat", "writeDouble", "writeInt8", "writeInt16", "writeUInt16", "writeInt24", "writeUInt24", "writeInt32", "prepare", "writeInput", "writeString"]


class python_io_IFileOutput:
    _hx_class_name = "python.io.IFileOutput"
    __slots__ = ()
    _hx_methods = ["seek", "tell"]
    _hx_interfaces = [python_io_IOutput]


class python_io_FileBytesOutput(python_io_NativeBytesOutput):
    _hx_class_name = "python.io.FileBytesOutput"
    __slots__ = ()
    _hx_fields = []
    _hx_methods = []
    _hx_statics = []
    _hx_interfaces = [python_io_IFileOutput]
    _hx_super = python_io_NativeBytesOutput


    def __init__(self,stream):
        super().__init__(stream)


class python_io_NativeTextInput(python_io_NativeInput):
    _hx_class_name = "python.io.NativeTextInput"
    __slots__ = ()
    _hx_fields = []
    _hx_methods = ["readByte", "seek", "readinto"]
    _hx_statics = []
    _hx_interfaces = [python_io_IInput]
    _hx_super = python_io_NativeInput


    def __init__(self,stream):
        super().__init__(stream)

    def readByte(self):
        ret = self.stream.buffer.read(1)
        if (len(ret) == 0):
            self.throwEof()
        return ret[0]

    def seek(self,p,pos):
        self.wasEof = False
        python_io_IoTools.seekInTextMode(self.stream,self.tell,p,pos)

    def readinto(self,b):
        return self.stream.buffer.readinto(b)

    @staticmethod
    def _hx_empty_init(_hx_o):        pass


class python_io_FileTextInput(python_io_NativeTextInput):
    _hx_class_name = "python.io.FileTextInput"
    __slots__ = ()
    _hx_fields = []
    _hx_methods = []
    _hx_statics = []
    _hx_interfaces = [python_io_IFileInput]
    _hx_super = python_io_NativeTextInput


    def __init__(self,stream):
        super().__init__(stream)


class python_io_NativeTextOutput(python_io_NativeOutput):
    _hx_class_name = "python.io.NativeTextOutput"
    __slots__ = ()
    _hx_fields = []
    _hx_methods = ["seek", "writeBytes", "writeByte"]
    _hx_statics = []
    _hx_interfaces = []
    _hx_super = python_io_NativeOutput


    def __init__(self,stream):
        super().__init__(stream)
        if (not stream.writable()):
            raise haxe_Exception.thrown("Read only stream")

    def seek(self,p,pos):
        python_io_IoTools.seekInTextMode(self.stream,self.tell,p,pos)

    def writeBytes(self,s,pos,_hx_len):
        return self.stream.buffer.write(s.b[pos:(pos + _hx_len)])

    def writeByte(self,c):
        self.stream.write("".join(map(chr,[c])))

    @staticmethod
    def _hx_empty_init(_hx_o):        pass


class python_io_FileTextOutput(python_io_NativeTextOutput):
    _hx_class_name = "python.io.FileTextOutput"
    __slots__ = ()
    _hx_fields = []
    _hx_methods = []
    _hx_statics = []
    _hx_interfaces = [python_io_IFileOutput]
    _hx_super = python_io_NativeTextOutput


    def __init__(self,stream):
        super().__init__(stream)


class python_io_IoTools:
    _hx_class_name = "python.io.IoTools"
    __slots__ = ()
    _hx_statics = ["createFileInputFromText", "createFileInputFromBytes", "createFileOutputFromText", "createFileOutputFromBytes", "seekInTextMode", "seekInBinaryMode"]

    @staticmethod
    def createFileInputFromText(t):
        return sys_io_FileInput(python_io_FileTextInput(t))

    @staticmethod
    def createFileInputFromBytes(t):
        return sys_io_FileInput(python_io_FileBytesInput(t))

    @staticmethod
    def createFileOutputFromText(t):
        return sys_io_FileOutput(python_io_FileTextOutput(t))

    @staticmethod
    def createFileOutputFromBytes(t):
        return sys_io_FileOutput(python_io_FileBytesOutput(t))

    @staticmethod
    def seekInTextMode(stream,tell,p,pos):
        pos1 = None
        pos2 = pos.index
        if (pos2 == 0):
            pos1 = 0
        elif (pos2 == 1):
            p = (tell() + p)
            pos1 = 0
        elif (pos2 == 2):
            stream.seek(0,2)
            p = (tell() + p)
            pos1 = 0
        else:
            pass
        stream.seek(p,pos1)

    @staticmethod
    def seekInBinaryMode(stream,p,pos):
        pos1 = None
        pos2 = pos.index
        if (pos2 == 0):
            pos1 = 0
        elif (pos2 == 1):
            pos1 = 1
        elif (pos2 == 2):
            pos1 = 2
        else:
            pass
        stream.seek(p,pos1)


class python_lib__Re_Choice_Impl_:
    _hx_class_name = "python.lib._Re.Choice_Impl_"
    __slots__ = ()
    _hx_statics = ["fromA", "fromB"]

    @staticmethod
    def fromA(x):
        return x

    @staticmethod
    def fromB(x):
        return x


class python_lib__Re_RegexHelper:
    _hx_class_name = "python.lib._Re.RegexHelper"
    __slots__ = ()
    _hx_statics = ["findallDynamic"]

    @staticmethod
    def findallDynamic(r,string,pos = None,endpos = None):
        if (endpos is None):
            if (pos is None):
                return r.findall(string)
            else:
                return r.findall(string,pos)
        else:
            return r.findall(string,pos,endpos)


class sys_io_FileInput(haxe_io_Input):
    _hx_class_name = "sys.io.FileInput"
    __slots__ = ("impl",)
    _hx_fields = ["impl"]
    _hx_methods = ["set_bigEndian", "seek", "tell", "eof", "readByte", "readBytes", "close", "readAll", "readFullBytes", "read", "readUntil", "readLine", "readFloat", "readDouble", "readInt8", "readInt16", "readUInt16", "readInt24", "readUInt24", "readInt32", "readString"]
    _hx_statics = []
    _hx_interfaces = []
    _hx_super = haxe_io_Input


    def __init__(self,impl):
        self.impl = impl

    def set_bigEndian(self,b):
        return self.impl.set_bigEndian(b)

    def seek(self,p,pos):
        self.impl.seek(p,pos)

    def tell(self):
        return self.impl.tell()

    def eof(self):
        return self.impl.eof()

    def readByte(self):
        return self.impl.readByte()

    def readBytes(self,s,pos,_hx_len):
        return self.impl.readBytes(s,pos,_hx_len)

    def close(self):
        self.impl.close()

    def readAll(self,bufsize = None):
        return self.impl.readAll(bufsize)

    def readFullBytes(self,s,pos,_hx_len):
        self.impl.readFullBytes(s,pos,_hx_len)

    def read(self,nbytes):
        return self.impl.read(nbytes)

    def readUntil(self,end):
        return self.impl.readUntil(end)

    def readLine(self):
        return self.impl.readLine()

    def readFloat(self):
        return self.impl.readFloat()

    def readDouble(self):
        return self.impl.readDouble()

    def readInt8(self):
        return self.impl.readInt8()

    def readInt16(self):
        return self.impl.readInt16()

    def readUInt16(self):
        return self.impl.readUInt16()

    def readInt24(self):
        return self.impl.readInt24()

    def readUInt24(self):
        return self.impl.readUInt24()

    def readInt32(self):
        return self.impl.readInt32()

    def readString(self,_hx_len,encoding = None):
        return self.impl.readString(_hx_len)

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.impl = None


class sys_io_FileOutput(haxe_io_Output):
    _hx_class_name = "sys.io.FileOutput"
    __slots__ = ("impl",)
    _hx_fields = ["impl"]
    _hx_methods = ["seek", "tell", "set_bigEndian", "writeByte", "writeBytes", "flush", "close", "write", "writeFullBytes", "writeFloat", "writeDouble", "writeInt8", "writeInt16", "writeUInt16", "writeInt24", "writeUInt24", "writeInt32", "prepare", "writeInput", "writeString"]
    _hx_statics = []
    _hx_interfaces = []
    _hx_super = haxe_io_Output


    def __init__(self,impl):
        self.impl = impl

    def seek(self,p,pos):
        self.impl.seek(p,pos)

    def tell(self):
        return self.impl.tell()

    def set_bigEndian(self,b):
        return self.impl.set_bigEndian(b)

    def writeByte(self,c):
        self.impl.writeByte(c)

    def writeBytes(self,s,pos,_hx_len):
        return self.impl.writeBytes(s,pos,_hx_len)

    def flush(self):
        self.impl.flush()

    def close(self):
        self.impl.close()

    def write(self,s):
        self.impl.write(s)

    def writeFullBytes(self,s,pos,_hx_len):
        self.impl.writeFullBytes(s,pos,_hx_len)

    def writeFloat(self,x):
        self.impl.writeFloat(x)

    def writeDouble(self,x):
        self.impl.writeDouble(x)

    def writeInt8(self,x):
        self.impl.writeInt8(x)

    def writeInt16(self,x):
        self.impl.writeInt16(x)

    def writeUInt16(self,x):
        self.impl.writeUInt16(x)

    def writeInt24(self,x):
        self.impl.writeInt24(x)

    def writeUInt24(self,x):
        self.impl.writeUInt24(x)

    def writeInt32(self,x):
        self.impl.writeInt32(x)

    def prepare(self,nbytes):
        self.impl.prepare(nbytes)

    def writeInput(self,i,bufsize = None):
        self.impl.writeInput(i,bufsize)

    def writeString(self,s,encoding = None):
        self.impl.writeString(s)

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.impl = None

class sys_io_FileSeek(Enum):
    __slots__ = ()
    _hx_class_name = "sys.io.FileSeek"
    _hx_constructs = ["SeekBegin", "SeekCur", "SeekEnd"]
sys_io_FileSeek.SeekBegin = sys_io_FileSeek("SeekBegin", 0, ())
sys_io_FileSeek.SeekCur = sys_io_FileSeek("SeekCur", 1, ())
sys_io_FileSeek.SeekEnd = sys_io_FileSeek("SeekEnd", 2, ())


class xrfragment_Query:
    _hx_class_name = "xrfragment.Query"
    __slots__ = ("str", "q", "include", "exclude", "accept", "preset")
    _hx_fields = ["str", "q", "include", "exclude", "accept", "preset"]
    _hx_methods = ["toObject", "qualify", "parse", "test"]

    def __init__(self,_hx_str):
        self.preset = ""
        self.accept = False
        self.exclude = list()
        self.include = list()
        self.q = _hx_AnonObject({})
        self.str = ""
        if (_hx_str is not None):
            self.parse(_hx_str)

    def toObject(self):
        return self.q

    def qualify(self,nodename):
        if Reflect.field(self.q,"copy_all"):
            self.accept = True
        if (nodename in self.include):
            self.accept = True
        if (nodename in self.exclude):
            self.accept = False
        return self.accept

    def parse(self,_hx_str,recurse = None):
        if (recurse is None):
            recurse = False
        _gthis = self
        copyAll = (Reflect.field(self.q,"copy_all") if recurse else (((HxString.substr(_hx_str,0,1) == "-") or ((HxString.substr(_hx_str,0,1) == "?"))) or ((_hx_str == ""))))
        isOr = EReg("^or$","")
        isProp = EReg(".*:[><=!]?","")
        isName = EReg("[^:/]","")
        isExclude = EReg("^-","")
        isInclude = EReg("^\\+","")
        isPreset = EReg("^\\?","")
        token = _hx_str.split(" ")
        ors = list()
        q = _hx_AnonObject({})
        def _hx_local_0():
            nonlocal q
            q = _hx_AnonObject({})
            value = list()
            setattr(q,(("_hx_" + "object") if (("object" in python_Boot.keywords)) else (("_hx_" + "object") if (((((len("object") > 2) and ((ord("object"[0]) == 95))) and ((ord("object"[1]) == 95))) and ((ord("object"[(len("object") - 1)]) != 95)))) else "object")),value)
            value = list()
            setattr(q,(("_hx_" + "-object") if (("-object" in python_Boot.keywords)) else (("_hx_" + "-object") if (((((len("-object") > 2) and ((ord("-object"[0]) == 95))) and ((ord("-object"[1]) == 95))) and ((ord("-object"[(len("-object") - 1)]) != 95)))) else "-object")),value)
            ors.append(q)
            return q
        composeQuery = _hx_local_0
        composeQuery()
        match = None
        def _hx_local_2(_hx_str,prefix = None):
            if (prefix is None):
                prefix = ""
            isPreset.matchObj = python_lib_Re.search(isPreset.pattern,_hx_str)
            if ((isPreset.matchObj is not None) and (not recurse)):
                _gthis.preset = _hx_str
                return
            match1 = None
            isExclude.matchObj = python_lib_Re.search(isExclude.pattern,_hx_str)
            if (isExclude.matchObj is None):
                isInclude.matchObj = python_lib_Re.search(isInclude.pattern,_hx_str)
                match1 = (isInclude.matchObj is not None)
            else:
                match1 = True
            if match1:
                t = HxString.substr(_hx_str,1,None)
                match(t,HxString.substr(_hx_str,0,1))
                return
            isProp.matchObj = python_lib_Re.search(isProp.pattern,_hx_str)
            if (isProp.matchObj is not None):
                skip = 0
                _hx_type = "="
                startIndex = None
                if (((_hx_str.find("*") if ((startIndex is None)) else HxString.indexOfImpl(_hx_str,"*",startIndex))) != -1):
                    _hx_type = "*"
                startIndex = None
                if (((_hx_str.find(">") if ((startIndex is None)) else HxString.indexOfImpl(_hx_str,">",startIndex))) != -1):
                    _hx_type = ">"
                startIndex = None
                if (((_hx_str.find("<") if ((startIndex is None)) else HxString.indexOfImpl(_hx_str,"<",startIndex))) != -1):
                    _hx_type = "<"
                startIndex = None
                if (((_hx_str.find("!=") if ((startIndex is None)) else HxString.indexOfImpl(_hx_str,"!=",startIndex))) != -1):
                    _hx_type = "!="
                startIndex = None
                if (((_hx_str.find(">=") if ((startIndex is None)) else HxString.indexOfImpl(_hx_str,">=",startIndex))) != -1):
                    _hx_type = ">="
                startIndex = None
                if (((_hx_str.find("<=") if ((startIndex is None)) else HxString.indexOfImpl(_hx_str,"<=",startIndex))) != -1):
                    _hx_type = "<="
                if (_hx_type != "="):
                    skip = (skip + len(_hx_type))
                property = HxOverrides.arrayGet(_hx_str.split(":"), 0)
                value = None
                if Reflect.field(q,(("null" if prefix is None else prefix) + ("null" if property is None else property))):
                    value = Reflect.field(q,(("null" if prefix is None else prefix) + ("null" if property is None else property)))
                else:
                    value = _hx_AnonObject({})
                value1 = HxString.substr(HxOverrides.arrayGet(_hx_str.split(":"), 1),skip,None)
                setattr(value,(("_hx_" + _hx_type) if ((_hx_type in python_Boot.keywords)) else (("_hx_" + _hx_type) if (((((len(_hx_type) > 2) and ((ord(_hx_type[0]) == 95))) and ((ord(_hx_type[1]) == 95))) and ((ord(_hx_type[(len(_hx_type) - 1)]) != 95)))) else _hx_type)),value1)
                key = (("null" if prefix is None else prefix) + ("null" if property is None else property))
                setattr(q,(("_hx_" + key) if ((key in python_Boot.keywords)) else (("_hx_" + key) if (((((len(key) > 2) and ((ord(key[0]) == 95))) and ((ord(key[1]) == 95))) and ((ord(key[(len(key) - 1)]) != 95)))) else key)),value)
                return
            isName.matchObj = python_lib_Re.search(isName.pattern,_hx_str)
            if (isName.matchObj is not None):
                if (prefix == "-"):
                    Reflect.field(Reflect.field(q,"-object"),"push")(_hx_str)
                    while (Reflect.field(Reflect.field(q,"object"),"contains")(_hx_str) == True):
                        Reflect.field(Reflect.field(q,"object"),"remove")(_hx_str)
                else:
                    Reflect.field(Reflect.field(q,"object"),"push")(_hx_str)
                    while (Reflect.field(Reflect.field(q,"-object"),"contains")(_hx_str) == True):
                        Reflect.field(Reflect.field(q,"-object"),"remove")(_hx_str)
                return
        match = _hx_local_2
        _g = 0
        _g1 = len(token)
        while (_g < _g1):
            i = _g
            _g = (_g + 1)
            isOr.matchObj = python_lib_Re.search(isOr.pattern,(token[i] if i >= 0 and i < len(token) else None))
            if (isOr.matchObj is not None):
                composeQuery()
            else:
                match((token[i] if i >= 0 and i < len(token) else None))
        _g = 0
        _g1 = len(ors)
        while (_g < _g1):
            i = _g
            _g = (_g + 1)
            _hx_or = (ors[i] if i >= 0 and i < len(ors) else None)
            if (Reflect.field(_hx_or,"object") is not None):
                self.include = (self.include + Reflect.field(_hx_or,"object"))
            if (Reflect.field(_hx_or,"-object") is not None):
                self.exclude = (self.exclude + Reflect.field(_hx_or,"-object"))
        self.q = _hx_AnonObject({'_hx_or': ors, 'copy_all': copyAll})
        return self.q

    def test(self,property,value = None):
        if (self.preset == property):
            self.parse(value,True)
        _g = 0
        _g1 = Reflect.field(Reflect.field(self.q,"or"),"length")
        while (_g < _g1):
            i = _g
            _g = (_g + 1)
            _hx_or = HxOverrides.arrayGet(Reflect.field(self.q,"or"), i)
            conds = [0]
            fails = [0]
            _hx_pass = 0
            def _hx_local_7(fails,conds):
                def _hx_local_0(expr):
                    _hx_local_1 = conds
                    _hx_local_2 = 0
                    _hx_local_3 = (_hx_local_1[_hx_local_2] if _hx_local_2 >= 0 and _hx_local_2 < len(_hx_local_1) else None)
                    python_internal_ArrayImpl._set(_hx_local_1, _hx_local_2, (_hx_local_3 + 1))
                    (_hx_local_1[_hx_local_2] if _hx_local_2 >= 0 and _hx_local_2 < len(_hx_local_1) else None)
                    _hx_local_4 = fails
                    _hx_local_5 = 0
                    _hx_local_6 = (_hx_local_4[_hx_local_5] if _hx_local_5 >= 0 and _hx_local_5 < len(_hx_local_4) else None)
                    python_internal_ArrayImpl._set(_hx_local_4, _hx_local_5, (_hx_local_6 + (0 if expr else 1)))
                    (_hx_local_4[_hx_local_5] if _hx_local_5 >= 0 and _hx_local_5 < len(_hx_local_4) else None)
                    return expr
                return _hx_local_0
            when = _hx_local_7(fails,conds)
            _g2 = 0
            _g3 = python_Boot.fields(_hx_or)
            while (_g2 < len(_g3)):
                k = (_g3[_g2] if _g2 >= 0 and _g2 < len(_g3) else None)
                _g2 = (_g2 + 1)
                orval = Reflect.field(_hx_or,k)
                if (k != property):
                    continue
                if ((Reflect.field(orval,"=") is not None) and when(HxOverrides.eq(value,Reflect.field(orval,"=")))):
                    _hx_pass = (_hx_pass + 1)
                if ((Reflect.field(orval,"*") is not None) and when((value is not None))):
                    _hx_pass = (_hx_pass + 1)
                if ((Reflect.field(orval,">") is not None) and when((value > Std.parseInt(Reflect.field(orval,">"))))):
                    _hx_pass = (_hx_pass + 1)
                if ((Reflect.field(orval,"<") is not None) and when((value < Std.parseInt(Reflect.field(orval,"<"))))):
                    _hx_pass = (_hx_pass + 1)
                if ((Reflect.field(orval,">=") is not None) and when((value >= Std.parseInt(Reflect.field(orval,">="))))):
                    _hx_pass = (_hx_pass + 1)
                if ((Reflect.field(orval,"<=") is not None) and when((value >= Std.parseInt(Reflect.field(orval,"<="))))):
                    _hx_pass = (_hx_pass + 1)
                if ((Reflect.field(orval,"!=") is not None) and when((value != Std.parseInt(Reflect.field(orval,"!="))))):
                    _hx_pass = (_hx_pass + 1)
            if ((self.accept and (((conds[0] if 0 < len(conds) else None) > 0))) and (((fails[0] if 0 < len(fails) else None) > 0))):
                self.accept = False
            if ((((conds[0] if 0 < len(conds) else None) > 0) and ((_hx_pass > 0))) and (((fails[0] if 0 < len(fails) else None) == 0))):
                self.accept = True

    @staticmethod
    def _hx_empty_init(_hx_o):
        _hx_o.str = None
        _hx_o.q = None
        _hx_o.include = None
        _hx_o.exclude = None
        _hx_o.accept = None
        _hx_o.preset = None

Math.NEGATIVE_INFINITY = float("-inf")
Math.POSITIVE_INFINITY = float("inf")
Math.NaN = float("nan")
Math.PI = python_lib_Math.pi

haxe_SysTools.winMetaCharacters = [32, 40, 41, 37, 33, 94, 34, 60, 62, 38, 124, 10, 13, 44, 59]
StringTools.winMetaCharacters = haxe_SysTools.winMetaCharacters
Sys._programPath = sys_FileSystem.fullPath(python_lib_Inspect.getsourcefile(Sys))
def _hx_init_haxe_io_FPHelper_i64tmp():
    def _hx_local_0():
        this1 = haxe__Int64____Int64(0,0)
        return this1
    return _hx_local_0()
haxe_io_FPHelper.i64tmp = _hx_init_haxe_io_FPHelper_i64tmp()
haxe_io_FPHelper.LN2 = 0.6931471805599453
python_Boot.keywords = set(["and", "del", "from", "not", "with", "as", "elif", "global", "or", "yield", "assert", "else", "if", "pass", "None", "break", "except", "import", "raise", "True", "class", "exec", "in", "return", "False", "continue", "finally", "is", "try", "def", "for", "lambda", "while"])
python_Boot.prefixLength = len("_hx_")
python_Lib.lineEnd = ("\r\n" if ((Sys.systemName() == "Windows")) else "\n")