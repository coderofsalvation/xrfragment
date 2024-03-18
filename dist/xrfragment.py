import sys

import math as python_lib_Math
import math as Math
import inspect as python_lib_Inspect
import re as python_lib_Re
import sys as python_lib_Sys
import functools as python_lib_Functools
import traceback as python_lib_Traceback
from io import StringIO as python_lib_io_StringIO
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

Enum._hx_class = Enum


class Class: pass


class EReg:
    _hx_class_name = "EReg"
    __slots__ = ("pattern", "matchObj", "_hx_global")
    _hx_fields = ["pattern", "matchObj", "global"]
    _hx_methods = ["split", "replace"]

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

EReg._hx_class = EReg


class Reflect:
    _hx_class_name = "Reflect"
    __slots__ = ()
    _hx_statics = ["field", "getProperty", "callMethod", "isObject", "deleteField", "copy"]

    @staticmethod
    def field(o,field):
        return python_Boot.field(o,field)

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
    def callMethod(o,func,args):
        if callable(func):
            return func(*args)
        else:
            return None

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
Reflect._hx_class = Reflect


class Std:
    _hx_class_name = "Std"
    __slots__ = ()
    _hx_statics = ["isOfType", "string", "parseInt", "shortenPossibleNumber", "parseFloat"]

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
Std._hx_class = Std


class Float: pass


class Int: pass


class Bool: pass


class Dynamic: pass


class StringBuf:
    _hx_class_name = "StringBuf"
    __slots__ = ("b",)
    _hx_fields = ["b"]

    def __init__(self):
        self.b = python_lib_io_StringIO()

StringBuf._hx_class = StringBuf


class StringTools:
    _hx_class_name = "StringTools"
    __slots__ = ()
    _hx_statics = ["isSpace", "ltrim", "rtrim", "trim", "replace"]

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
    def replace(s,sub,by):
        _this = (list(s) if ((sub == "")) else s.split(sub))
        return by.join([python_Boot.toString1(x1,'') for x1 in _this])
StringTools._hx_class = StringTools

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
ValueType._hx_class = ValueType


class Type:
    _hx_class_name = "Type"
    __slots__ = ()
    _hx_statics = ["typeof"]

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
Type._hx_class = Type


class haxe_IMap:
    _hx_class_name = "haxe.IMap"
    __slots__ = ()
haxe_IMap._hx_class = haxe_IMap


class haxe_Exception(Exception):
    _hx_class_name = "haxe.Exception"
    __slots__ = ("_hx___nativeStack", "_hx___skipStack", "_hx___nativeException", "_hx___previousException")
    _hx_fields = ["__nativeStack", "__skipStack", "__nativeException", "__previousException"]
    _hx_methods = ["unwrap", "get_native"]
    _hx_statics = ["caught", "thrown"]
    _hx_interfaces = []
    _hx_super = Exception


    def __init__(self,message,previous = None,native = None):
        self._hx___previousException = None
        self._hx___nativeException = None
        self._hx___nativeStack = None
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

    def get_native(self):
        return self._hx___nativeException

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

haxe_Exception._hx_class = haxe_Exception


class haxe_NativeStackTrace:
    _hx_class_name = "haxe.NativeStackTrace"
    __slots__ = ()
    _hx_statics = ["saveStack", "exceptionStack"]

    @staticmethod
    def saveStack(exception):
        pass

    @staticmethod
    def exceptionStack():
        exc = python_lib_Sys.exc_info()
        if (exc[2] is not None):
            infos = python_lib_Traceback.extract_tb(exc[2])
            infos.reverse()
            return infos
        else:
            return []
haxe_NativeStackTrace._hx_class = haxe_NativeStackTrace

class haxe__Template_TemplateExpr(Enum):
    __slots__ = ()
    _hx_class_name = "haxe._Template.TemplateExpr"
    _hx_constructs = ["OpVar", "OpExpr", "OpIf", "OpStr", "OpBlock", "OpForeach", "OpMacro"]

    @staticmethod
    def OpVar(v):
        return haxe__Template_TemplateExpr("OpVar", 0, (v,))

    @staticmethod
    def OpExpr(expr):
        return haxe__Template_TemplateExpr("OpExpr", 1, (expr,))

    @staticmethod
    def OpIf(expr,eif,eelse):
        return haxe__Template_TemplateExpr("OpIf", 2, (expr,eif,eelse))

    @staticmethod
    def OpStr(str):
        return haxe__Template_TemplateExpr("OpStr", 3, (str,))

    @staticmethod
    def OpBlock(l):
        return haxe__Template_TemplateExpr("OpBlock", 4, (l,))

    @staticmethod
    def OpForeach(expr,loop):
        return haxe__Template_TemplateExpr("OpForeach", 5, (expr,loop))

    @staticmethod
    def OpMacro(name,params):
        return haxe__Template_TemplateExpr("OpMacro", 6, (name,params))
haxe__Template_TemplateExpr._hx_class = haxe__Template_TemplateExpr


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

haxe_iterators_ArrayIterator._hx_class = haxe_iterators_ArrayIterator


class haxe_Template:
    _hx_class_name = "haxe.Template"
    __slots__ = ("expr", "context", "macros", "stack", "buf")
    _hx_fields = ["expr", "context", "macros", "stack", "buf"]
    _hx_methods = ["execute", "resolve", "parseTokens", "parseBlock", "parse", "parseExpr", "makeConst", "makePath", "makeExpr", "skipSpaces", "makeExpr2", "run"]
    _hx_statics = ["splitter", "expr_splitter", "expr_trim", "expr_int", "expr_float", "globals", "hxKeepArrayIterator"]

    def __init__(self,_hx_str):
        self.buf = None
        self.stack = None
        self.macros = None
        self.context = None
        self.expr = None
        tokens = self.parseTokens(_hx_str)
        self.expr = self.parseBlock(tokens)
        if (not tokens.isEmpty()):
            raise haxe_Exception.thrown((("Unexpected '" + Std.string(tokens.first().s)) + "'"))

    def execute(self,context,macros = None):
        self.macros = (_hx_AnonObject({}) if ((macros is None)) else macros)
        self.context = context
        self.stack = haxe_ds_List()
        self.buf = StringBuf()
        self.run(self.expr)
        return self.buf.b.getvalue()

    def resolve(self,v):
        if (v == "__current__"):
            return self.context
        if Reflect.isObject(self.context):
            value = Reflect.getProperty(self.context,v)
            if ((value is not None) or python_Boot.hasField(self.context,v)):
                return value
        _g_head = self.stack.h
        while (_g_head is not None):
            val = _g_head.item
            _g_head = _g_head.next
            ctx = val
            value = Reflect.getProperty(ctx,v)
            if ((value is not None) or python_Boot.hasField(ctx,v)):
                return value
        return Reflect.field(haxe_Template.globals,v)

    def parseTokens(self,data):
        tokens = haxe_ds_List()
        while True:
            _this = haxe_Template.splitter
            _this.matchObj = python_lib_Re.search(_this.pattern,data)
            if (not ((_this.matchObj is not None))):
                break
            _this1 = haxe_Template.splitter
            p_pos = _this1.matchObj.start()
            p_len = (_this1.matchObj.end() - _this1.matchObj.start())
            if (p_pos > 0):
                tokens.add(_hx_AnonObject({'p': HxString.substr(data,0,p_pos), 's': True, 'l': None}))
            if (HxString.charCodeAt(data,p_pos) == 58):
                tokens.add(_hx_AnonObject({'p': HxString.substr(data,(p_pos + 2),(p_len - 4)), 's': False, 'l': None}))
                _this2 = haxe_Template.splitter
                data = HxString.substr(_this2.matchObj.string,_this2.matchObj.end(),None)
                continue
            parp = (p_pos + p_len)
            npar = 1
            params = []
            part = ""
            while True:
                c = HxString.charCodeAt(data,parp)
                parp = (parp + 1)
                if (c == 40):
                    npar = (npar + 1)
                elif (c == 41):
                    npar = (npar - 1)
                    if (npar <= 0):
                        break
                elif (c is None):
                    raise haxe_Exception.thrown("Unclosed macro parenthesis")
                if ((c == 44) and ((npar == 1))):
                    params.append(part)
                    part = ""
                else:
                    part = (("null" if part is None else part) + HxOverrides.stringOrNull("".join(map(chr,[c]))))
            params.append(part)
            tokens.add(_hx_AnonObject({'p': haxe_Template.splitter.matchObj.group(2), 's': False, 'l': params}))
            data = HxString.substr(data,parp,(len(data) - parp))
        if (len(data) > 0):
            tokens.add(_hx_AnonObject({'p': data, 's': True, 'l': None}))
        return tokens

    def parseBlock(self,tokens):
        l = haxe_ds_List()
        while True:
            t = tokens.first()
            if (t is None):
                break
            if ((not t.s) and ((((t.p == "end") or ((t.p == "else"))) or ((HxString.substr(t.p,0,7) == "elseif "))))):
                break
            l.add(self.parse(tokens))
        if (l.length == 1):
            return l.first()
        return haxe__Template_TemplateExpr.OpBlock(l)

    def parse(self,tokens):
        t = tokens.pop()
        p = t.p
        if t.s:
            return haxe__Template_TemplateExpr.OpStr(p)
        if (t.l is not None):
            pe = haxe_ds_List()
            _g = 0
            _g1 = t.l
            while (_g < len(_g1)):
                p1 = (_g1[_g] if _g >= 0 and _g < len(_g1) else None)
                _g = (_g + 1)
                pe.add(self.parseBlock(self.parseTokens(p1)))
            return haxe__Template_TemplateExpr.OpMacro(p,pe)
        def _hx_local_2(kwd):
            pos = -1
            length = len(kwd)
            if (HxString.substr(p,0,length) == kwd):
                pos = length
                _g_offset = 0
                _g_s = HxString.substr(p,length,None)
                while (_g_offset < len(_g_s)):
                    index = _g_offset
                    _g_offset = (_g_offset + 1)
                    c = ord(_g_s[index])
                    if (c == 32):
                        pos = (pos + 1)
                    else:
                        break
            return pos
        kwdEnd = _hx_local_2
        pos = kwdEnd("if")
        if (pos > 0):
            p = HxString.substr(p,pos,(len(p) - pos))
            e = self.parseExpr(p)
            eif = self.parseBlock(tokens)
            t = tokens.first()
            eelse = None
            if (t is None):
                raise haxe_Exception.thrown("Unclosed 'if'")
            if (t.p == "end"):
                tokens.pop()
                eelse = None
            elif (t.p == "else"):
                tokens.pop()
                eelse = self.parseBlock(tokens)
                t = tokens.pop()
                if ((t is None) or ((t.p != "end"))):
                    raise haxe_Exception.thrown("Unclosed 'else'")
            else:
                t.p = HxString.substr(t.p,4,(len(t.p) - 4))
                eelse = self.parse(tokens)
            return haxe__Template_TemplateExpr.OpIf(e,eif,eelse)
        pos = kwdEnd("foreach")
        if (pos >= 0):
            p = HxString.substr(p,pos,(len(p) - pos))
            e = self.parseExpr(p)
            efor = self.parseBlock(tokens)
            t = tokens.pop()
            if ((t is None) or ((t.p != "end"))):
                raise haxe_Exception.thrown("Unclosed 'foreach'")
            return haxe__Template_TemplateExpr.OpForeach(e,efor)
        _this = haxe_Template.expr_splitter
        _this.matchObj = python_lib_Re.search(_this.pattern,p)
        if (_this.matchObj is not None):
            return haxe__Template_TemplateExpr.OpExpr(self.parseExpr(p))
        return haxe__Template_TemplateExpr.OpVar(p)

    def parseExpr(self,data):
        l = haxe_ds_List()
        expr = data
        while True:
            _this = haxe_Template.expr_splitter
            _this.matchObj = python_lib_Re.search(_this.pattern,data)
            if (not ((_this.matchObj is not None))):
                break
            _this1 = haxe_Template.expr_splitter
            p_pos = _this1.matchObj.start()
            p_len = (_this1.matchObj.end() - _this1.matchObj.start())
            k = (p_pos + p_len)
            if (p_pos != 0):
                l.add(_hx_AnonObject({'p': HxString.substr(data,0,p_pos), 's': True}))
            p = haxe_Template.expr_splitter.matchObj.group(0)
            startIndex = None
            l.add(_hx_AnonObject({'p': p, 's': (((p.find("\"") if ((startIndex is None)) else HxString.indexOfImpl(p,"\"",startIndex))) >= 0)}))
            _this2 = haxe_Template.expr_splitter
            data = HxString.substr(_this2.matchObj.string,_this2.matchObj.end(),None)
        if (len(data) != 0):
            _g_offset = 0
            _g_s = data
            while (_g_offset < len(_g_s)):
                _g1_key = _g_offset
                s = _g_s
                index = _g_offset
                _g_offset = (_g_offset + 1)
                _g1_value = (-1 if ((index >= len(s))) else ord(s[index]))
                i = _g1_key
                c = _g1_value
                if (c != 32):
                    l.add(_hx_AnonObject({'p': HxString.substr(data,i,None), 's': True}))
                    break
        e = None
        try:
            e = self.makeExpr(l)
            if (not l.isEmpty()):
                raise haxe_Exception.thrown(l.first().p)
        except BaseException as _g:
            None
            _g1 = haxe_Exception.caught(_g).unwrap()
            if Std.isOfType(_g1,str):
                s = _g1
                raise haxe_Exception.thrown(((("Unexpected '" + ("null" if s is None else s)) + "' in ") + ("null" if expr is None else expr)))
            else:
                raise _g
        def _hx_local_0():
            try:
                return e()
            except BaseException as _g:
                None
                exc = haxe_Exception.caught(_g).unwrap()
                raise haxe_Exception.thrown(((("Error : " + Std.string(exc)) + " in ") + ("null" if expr is None else expr)))
        return _hx_local_0

    def makeConst(self,v):
        _this = haxe_Template.expr_trim
        _this.matchObj = python_lib_Re.search(_this.pattern,v)
        v = haxe_Template.expr_trim.matchObj.group(1)
        if (HxString.charCodeAt(v,0) == 34):
            _hx_str = HxString.substr(v,1,(len(v) - 2))
            def _hx_local_0():
                return _hx_str
            return _hx_local_0
        _this = haxe_Template.expr_int
        _this.matchObj = python_lib_Re.search(_this.pattern,v)
        if (_this.matchObj is not None):
            i = Std.parseInt(v)
            def _hx_local_1():
                return i
            return _hx_local_1
        _this = haxe_Template.expr_float
        _this.matchObj = python_lib_Re.search(_this.pattern,v)
        if (_this.matchObj is not None):
            f = Std.parseFloat(v)
            def _hx_local_2():
                return f
            return _hx_local_2
        me = self
        def _hx_local_3():
            return me.resolve(v)
        return _hx_local_3

    def makePath(self,e,l):
        p = l.first()
        if ((p is None) or ((p.p != "."))):
            return e
        l.pop()
        field = l.pop()
        if ((field is None) or (not field.s)):
            raise haxe_Exception.thrown(field.p)
        f = field.p
        _this = haxe_Template.expr_trim
        _this.matchObj = python_lib_Re.search(_this.pattern,f)
        f = haxe_Template.expr_trim.matchObj.group(1)
        def _hx_local_1():
            def _hx_local_0():
                return Reflect.field(e(),f)
            return self.makePath(_hx_local_0,l)
        return _hx_local_1()

    def makeExpr(self,l):
        return self.makePath(self.makeExpr2(l),l)

    def skipSpaces(self,l):
        p = l.first()
        while (p is not None):
            _g_offset = 0
            _g_s = p.p
            while (_g_offset < len(_g_s)):
                index = _g_offset
                _g_offset = (_g_offset + 1)
                c = ord(_g_s[index])
                if (c != 32):
                    return
            l.pop()
            p = l.first()

    def makeExpr2(self,l):
        self.skipSpaces(l)
        p = l.pop()
        self.skipSpaces(l)
        if (p is None):
            raise haxe_Exception.thrown("<eof>")
        if p.s:
            return self.makeConst(p.p)
        _g = p.p
        if (_g == "!"):
            e = self.makeExpr(l)
            def _hx_local_0():
                v = e()
                if (v is not None):
                    return (v == False)
                else:
                    return True
            return _hx_local_0
        elif (_g == "("):
            self.skipSpaces(l)
            e1 = self.makeExpr(l)
            self.skipSpaces(l)
            p1 = l.pop()
            if ((p1 is None) or p1.s):
                raise haxe_Exception.thrown(p1)
            if (p1.p == ")"):
                return e1
            self.skipSpaces(l)
            e2 = self.makeExpr(l)
            self.skipSpaces(l)
            p2 = l.pop()
            self.skipSpaces(l)
            if ((p2 is None) or ((p2.p != ")"))):
                raise haxe_Exception.thrown(p2)
            _g = p1.p
            _hx_local_1 = len(_g)
            if (_hx_local_1 == 1):
                if (_g == "*"):
                    def _hx_local_2():
                        return (e1() * e2())
                    return _hx_local_2
                elif (_g == "+"):
                    def _hx_local_3():
                        return python_Boot._add_dynamic(e1(),e2())
                    return _hx_local_3
                elif (_g == "-"):
                    def _hx_local_4():
                        return (e1() - e2())
                    return _hx_local_4
                elif (_g == "/"):
                    def _hx_local_5():
                        return (e1() / e2())
                    return _hx_local_5
                elif (_g == "<"):
                    def _hx_local_6():
                        return (e1() < e2())
                    return _hx_local_6
                elif (_g == ">"):
                    def _hx_local_7():
                        return (e1() > e2())
                    return _hx_local_7
                else:
                    raise haxe_Exception.thrown(("Unknown operation " + HxOverrides.stringOrNull(p1.p)))
            elif (_hx_local_1 == 2):
                if (_g == "!="):
                    def _hx_local_8():
                        return not HxOverrides.eq(e1(),e2())
                    return _hx_local_8
                elif (_g == "&&"):
                    def _hx_local_9():
                        return (e1() and e2())
                    return _hx_local_9
                elif (_g == "<="):
                    def _hx_local_10():
                        return (e1() <= e2())
                    return _hx_local_10
                elif (_g == "=="):
                    def _hx_local_11():
                        return HxOverrides.eq(e1(),e2())
                    return _hx_local_11
                elif (_g == ">="):
                    def _hx_local_12():
                        return (e1() >= e2())
                    return _hx_local_12
                elif (_g == "||"):
                    def _hx_local_13():
                        return (e1() or e2())
                    return _hx_local_13
                else:
                    raise haxe_Exception.thrown(("Unknown operation " + HxOverrides.stringOrNull(p1.p)))
            else:
                raise haxe_Exception.thrown(("Unknown operation " + HxOverrides.stringOrNull(p1.p)))
        elif (_g == "-"):
            e3 = self.makeExpr(l)
            def _hx_local_14():
                return -e3()
            return _hx_local_14
        else:
            pass
        raise haxe_Exception.thrown(p.p)

    def run(self,e):
        tmp = e.index
        if (tmp == 0):
            v = e.params[0]
            _this = self.buf
            s = Std.string(Std.string(self.resolve(v)))
            _this.b.write(s)
        elif (tmp == 1):
            e1 = e.params[0]
            _this = self.buf
            s = Std.string(Std.string(e1()))
            _this.b.write(s)
        elif (tmp == 2):
            e1 = e.params[0]
            eif = e.params[1]
            eelse = e.params[2]
            v = e1()
            if ((v is None) or ((v == False))):
                if (eelse is not None):
                    self.run(eelse)
            else:
                self.run(eif)
        elif (tmp == 3):
            _hx_str = e.params[0]
            _this = self.buf
            s = Std.string(_hx_str)
            _this.b.write(s)
        elif (tmp == 4):
            l = e.params[0]
            _g_head = l.h
            while (_g_head is not None):
                val = _g_head.item
                _g_head = _g_head.next
                e1 = val
                self.run(e1)
        elif (tmp == 5):
            e1 = e.params[0]
            loop = e.params[1]
            v = e1()
            try:
                x = Reflect.field(v,"iterator")()
                if (Reflect.field(x,"hasNext") is None):
                    raise haxe_Exception.thrown(None)
                v = x
            except BaseException as _g:
                None
                try:
                    if (Reflect.field(v,"hasNext") is None):
                        raise haxe_Exception.thrown(None)
                except BaseException as _g:
                    raise haxe_Exception.thrown(("Cannot iter on " + Std.string(v)))
            self.stack.push(self.context)
            v1 = v
            ctx = v1
            while ctx.hasNext():
                ctx1 = ctx.next()
                self.context = ctx1
                self.run(loop)
            self.context = self.stack.pop()
        elif (tmp == 6):
            m = e.params[0]
            params = e.params[1]
            v = Reflect.field(self.macros,m)
            pl = list()
            old = self.buf
            pl.append(self.resolve)
            _g_head = params.h
            while (_g_head is not None):
                val = _g_head.item
                _g_head = _g_head.next
                p = val
                if (p.index == 0):
                    v1 = p.params[0]
                    x = self.resolve(v1)
                    pl.append(x)
                else:
                    self.buf = StringBuf()
                    self.run(p)
                    x1 = self.buf.b.getvalue()
                    pl.append(x1)
            self.buf = old
            try:
                _this = self.buf
                s = Std.string(Std.string(Reflect.callMethod(self.macros,v,pl)))
                _this.b.write(s)
            except BaseException as _g:
                None
                e = haxe_Exception.caught(_g).unwrap()
                plstr = None
                try:
                    plstr = ",".join([python_Boot.toString1(x1,'') for x1 in pl])
                except BaseException as _g:
                    plstr = "???"
                msg = (((((("Macro call " + ("null" if m is None else m)) + "(") + ("null" if plstr is None else plstr)) + ") failed (") + Std.string(e)) + ")")
                raise haxe_Exception.thrown(msg)
        else:
            pass

haxe_Template._hx_class = haxe_Template


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

    def unwrap(self):
        return self.value

haxe_ValueException._hx_class = haxe_ValueException


class haxe_ds_List:
    _hx_class_name = "haxe.ds.List"
    __slots__ = ("h", "q", "length")
    _hx_fields = ["h", "q", "length"]
    _hx_methods = ["add", "push", "first", "pop", "isEmpty", "toString"]

    def __init__(self):
        self.q = None
        self.h = None
        self.length = 0

    def add(self,item):
        x = haxe_ds__List_ListNode(item,None)
        if (self.h is None):
            self.h = x
        else:
            self.q.next = x
        self.q = x
        _hx_local_0 = self
        _hx_local_1 = _hx_local_0.length
        _hx_local_0.length = (_hx_local_1 + 1)
        _hx_local_1

    def push(self,item):
        x = haxe_ds__List_ListNode(item,self.h)
        self.h = x
        if (self.q is None):
            self.q = x
        _hx_local_0 = self
        _hx_local_1 = _hx_local_0.length
        _hx_local_0.length = (_hx_local_1 + 1)
        _hx_local_1

    def first(self):
        if (self.h is None):
            return None
        else:
            return self.h.item

    def pop(self):
        if (self.h is None):
            return None
        x = self.h.item
        self.h = self.h.next
        if (self.h is None):
            self.q = None
        _hx_local_0 = self
        _hx_local_1 = _hx_local_0.length
        _hx_local_0.length = (_hx_local_1 - 1)
        _hx_local_1
        return x

    def isEmpty(self):
        return (self.h is None)

    def toString(self):
        s_b = python_lib_io_StringIO()
        first = True
        l = self.h
        s_b.write("{")
        while (l is not None):
            if first:
                first = False
            else:
                s_b.write(", ")
            s_b.write(Std.string(Std.string(l.item)))
            l = l.next
        s_b.write("}")
        return s_b.getvalue()

haxe_ds_List._hx_class = haxe_ds_List


class haxe_ds__List_ListNode:
    _hx_class_name = "haxe.ds._List.ListNode"
    __slots__ = ("item", "next")
    _hx_fields = ["item", "next"]

    def __init__(self,item,next):
        self.item = item
        self.next = next

haxe_ds__List_ListNode._hx_class = haxe_ds__List_ListNode


class haxe_ds_StringMap:
    _hx_class_name = "haxe.ds.StringMap"
    __slots__ = ("h",)
    _hx_fields = ["h"]
    _hx_interfaces = [haxe_IMap]

    def __init__(self):
        self.h = dict()

haxe_ds_StringMap._hx_class = haxe_ds_StringMap


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

haxe_iterators_ArrayKeyValueIterator._hx_class = haxe_iterators_ArrayKeyValueIterator


class python_Boot:
    _hx_class_name = "python.Boot"
    __slots__ = ()
    _hx_statics = ["keywords", "_add_dynamic", "toString1", "fields", "simpleField", "hasField", "field", "getInstanceFields", "getSuperClass", "getClassFields", "prefixLength", "unhandleKeywords"]

    @staticmethod
    def _add_dynamic(a,b):
        if (isinstance(a,str) and isinstance(b,str)):
            return (a + b)
        if (isinstance(a,str) or isinstance(b,str)):
            return (python_Boot.toString1(a,"") + python_Boot.toString1(b,""))
        return (a + b)

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
    def simpleField(o,field):
        if (field is None):
            return None
        field1 = (("_hx_" + field) if ((field in python_Boot.keywords)) else (("_hx_" + field) if (((((len(field) > 2) and ((ord(field[0]) == 95))) and ((ord(field[1]) == 95))) and ((ord(field[(len(field) - 1)]) != 95)))) else field))
        if hasattr(o,field1):
            return getattr(o,field1)
        else:
            return None

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
    def unhandleKeywords(name):
        if (HxString.substr(name,0,python_Boot.prefixLength) == "_hx_"):
            real = HxString.substr(name,python_Boot.prefixLength,None)
            if (real in python_Boot.keywords):
                return real
        return name
python_Boot._hx_class = python_Boot


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

python_HaxeIterator._hx_class = python_HaxeIterator


class python_Lib:
    _hx_class_name = "python.Lib"
    __slots__ = ()
    _hx_statics = ["anonToDict"]

    @staticmethod
    def anonToDict(o):
        if isinstance(o,_hx_AnonObject):
            return o.__dict__.copy()
        else:
            return None
python_Lib._hx_class = python_Lib


class python_internal_ArrayImpl:
    _hx_class_name = "python.internal.ArrayImpl"
    __slots__ = ()
    _hx_statics = ["get_length", "concat", "copy", "iterator", "keyValueIterator", "indexOf", "lastIndexOf", "join", "toString", "pop", "push", "unshift", "remove", "contains", "shift", "slice", "sort", "splice", "map", "filter", "insert", "reverse", "_get", "_set"]

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
python_internal_ArrayImpl._hx_class = python_internal_ArrayImpl


class HxOverrides:
    _hx_class_name = "HxOverrides"
    __slots__ = ()
    _hx_statics = ["iterator", "eq", "stringOrNull", "length", "arrayGet"]

    @staticmethod
    def iterator(x):
        if isinstance(x,list):
            return haxe_iterators_ArrayIterator(x)
        return x.iterator()

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
    def length(x):
        if isinstance(x,str):
            return len(x)
        elif isinstance(x,list):
            return len(x)
        return x.length

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
HxOverrides._hx_class = HxOverrides


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

python_internal_MethodClosure._hx_class = python_internal_MethodClosure


class HxString:
    _hx_class_name = "HxString"
    __slots__ = ()
    _hx_statics = ["split", "charCodeAt", "charAt", "lastIndexOf", "toUpperCase", "toLowerCase", "indexOf", "indexOfImpl", "toString", "get_length", "substring", "substr"]

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
HxString._hx_class = HxString


class xrfragment_Filter:
    _hx_class_name = "xrfragment.Filter"
    __slots__ = ("str", "q")
    _hx_fields = ["str", "q"]
    _hx_methods = ["toObject", "get", "parse", "test", "testProperty"]

    def __init__(self,_hx_str):
        self.q = _hx_AnonObject({})
        self.str = ""
        if (_hx_str is not None):
            self.parse(_hx_str)

    def toObject(self):
        return Reflect.copy(self.q)

    def get(self):
        return Reflect.copy(self.q)

    def parse(self,_hx_str):
        token = _hx_str.split(" ")
        q = _hx_AnonObject({})
        def _hx_local_0(_hx_str,prefix = None):
            if (prefix is None):
                prefix = ""
            _hx_str = StringTools.trim(_hx_str)
            k = HxOverrides.arrayGet(_hx_str.split("="), 0)
            v = HxOverrides.arrayGet(_hx_str.split("="), 1)
            _hx_filter = _hx_AnonObject({})
            if Reflect.field(q,(("null" if prefix is None else prefix) + ("null" if k is None else k))):
                _hx_filter = Reflect.field(q,(("null" if prefix is None else prefix) + ("null" if k is None else k)))
            _this = xrfragment_XRF.isProp
            _this.matchObj = python_lib_Re.search(_this.pattern,_hx_str)
            if (_this.matchObj is not None):
                oper = ""
                startIndex = None
                if (((_hx_str.find(">") if ((startIndex is None)) else HxString.indexOfImpl(_hx_str,">",startIndex))) != -1):
                    oper = ">"
                startIndex = None
                if (((_hx_str.find("<") if ((startIndex is None)) else HxString.indexOfImpl(_hx_str,"<",startIndex))) != -1):
                    oper = "<"
                _this = xrfragment_XRF.isExclude
                _this.matchObj = python_lib_Re.search(_this.pattern,k)
                if (_this.matchObj is not None):
                    k = HxString.substr(k,1,None)
                v = HxString.substr(v,len(oper),None)
                if (len(oper) == 0):
                    oper = "="
                rule = _hx_AnonObject({})
                _this = xrfragment_XRF.isNumber
                _this.matchObj = python_lib_Re.search(_this.pattern,v)
                if (_this.matchObj is not None):
                    value = Std.parseFloat(v)
                    setattr(rule,(("_hx_" + oper) if ((oper in python_Boot.keywords)) else (("_hx_" + oper) if (((((len(oper) > 2) and ((ord(oper[0]) == 95))) and ((ord(oper[1]) == 95))) and ((ord(oper[(len(oper) - 1)]) != 95)))) else oper)),value)
                else:
                    setattr(rule,(("_hx_" + oper) if ((oper in python_Boot.keywords)) else (("_hx_" + oper) if (((((len(oper) > 2) and ((ord(oper[0]) == 95))) and ((ord(oper[1]) == 95))) and ((ord(oper[(len(oper) - 1)]) != 95)))) else oper)),v)
                setattr(q,(("_hx_" + "expr") if (("expr" in python_Boot.keywords)) else (("_hx_" + "expr") if (((((len("expr") > 2) and ((ord("expr"[0]) == 95))) and ((ord("expr"[1]) == 95))) and ((ord("expr"[(len("expr") - 1)]) != 95)))) else "expr")),rule)
            _this = xrfragment_XRF.isDeep
            _this.matchObj = python_lib_Re.search(_this.pattern,_hx_str)
            value = ((Reflect.field(k.split("*"),"length") - 1) if ((_this.matchObj is not None)) else 0)
            setattr(q,(("_hx_" + "deep") if (("deep" in python_Boot.keywords)) else (("_hx_" + "deep") if (((((len("deep") > 2) and ((ord("deep"[0]) == 95))) and ((ord("deep"[1]) == 95))) and ((ord("deep"[(len("deep") - 1)]) != 95)))) else "deep")),value)
            _this = xrfragment_XRF.isExclude
            _this.matchObj = python_lib_Re.search(_this.pattern,_hx_str)
            value = (False if ((_this.matchObj is not None)) else True)
            setattr(q,(("_hx_" + "show") if (("show" in python_Boot.keywords)) else (("_hx_" + "show") if (((((len("show") > 2) and ((ord("show"[0]) == 95))) and ((ord("show"[1]) == 95))) and ((ord("show"[(len("show") - 1)]) != 95)))) else "show")),value)
            value = xrfragment_XRF.operators.replace(k,"")
            setattr(q,(("_hx_" + "key") if (("key" in python_Boot.keywords)) else (("_hx_" + "key") if (((((len("key") > 2) and ((ord("key"[0]) == 95))) and ((ord("key"[1]) == 95))) and ((ord("key"[(len("key") - 1)]) != 95)))) else "key")),value)
            setattr(q,(("_hx_" + "value") if (("value" in python_Boot.keywords)) else (("_hx_" + "value") if (((((len("value") > 2) and ((ord("value"[0]) == 95))) and ((ord("value"[1]) == 95))) and ((ord("value"[(len("value") - 1)]) != 95)))) else "value")),v)
        process = _hx_local_0
        _g = 0
        _g1 = len(token)
        while (_g < _g1):
            i = _g
            _g = (_g + 1)
            process((token[i] if i >= 0 and i < len(token) else None))
        def _hx_local_2():
            def _hx_local_1():
                self.q = q
                return self.q
            return _hx_local_1()
        return _hx_local_2()

    def test(self,obj = None):
        qualify = False
        _g = 0
        _g1 = python_Boot.fields(obj)
        while (_g < len(_g1)):
            k = (_g1[_g] if _g >= 0 and _g < len(_g1) else None)
            _g = (_g + 1)
            v = Std.string(Reflect.field(obj,k))
            if self.testProperty(k,v):
                qualify = True
        _g = 0
        _g1 = python_Boot.fields(obj)
        while (_g < len(_g1)):
            k = (_g1[_g] if _g >= 0 and _g < len(_g1) else None)
            _g = (_g + 1)
            v = Std.string(Reflect.field(obj,k))
            if self.testProperty(k,v,True):
                qualify = False
        return qualify

    def testProperty(self,property,value,exclude = None):
        conds = 0
        fails = 0
        qualify = 0
        def _hx_local_2(expr):


            conds = (conds + 1)
            fails = (fails + (0 if expr else 1))
            return expr
        testprop = _hx_local_2
        if (Reflect.field(self.q,value) is not None):
            v = Reflect.field(self.q,value)
            if (Reflect.field(v,property) is not None):
                return Reflect.field(v,property)
        if Reflect.field(self.q,"expr"):
            f = Reflect.field(self.q,"expr")
            if (not Reflect.field(self.q,"show")):
                if (((Reflect.field(f,"!=") is not None) and testprop((Std.string(value) == Std.string(Reflect.field(f,"!="))))) and exclude):
                    qualify = (qualify + 1)
            else:
                if ((Reflect.field(f,"*") is not None) and testprop((Std.parseFloat(value) is not None))):
                    qualify = (qualify + 1)
                if ((Reflect.field(f,">") is not None) and testprop((Std.parseFloat(value) >= Std.parseFloat(Reflect.field(f,">"))))):
                    qualify = (qualify + 1)
                if ((Reflect.field(f,"<") is not None) and testprop((Std.parseFloat(value) <= Std.parseFloat(Reflect.field(f,"<"))))):
                    qualify = (qualify + 1)
                if ((Reflect.field(f,"=") is not None) and ((testprop((value == Reflect.field(f,"="))) or testprop((Std.parseFloat(value) == Std.parseFloat(Reflect.field(f,"="))))))):
                    qualify = (qualify + 1)
        return (qualify > 0)

xrfragment_Filter._hx_class = xrfragment_Filter


class xrfragment_Parser:
    _hx_class_name = "xrfragment.Parser"
    __slots__ = ()
    _hx_statics = ["error", "debug", "parse", "getMetaData"]

    @staticmethod
    def parse(key,value,store,index = None):
        Frag = haxe_ds_StringMap()
        Frag.h["#"] = ((xrfragment_XRF.IMMUTABLE | xrfragment_XRF.T_PREDEFINED_VIEW) | xrfragment_XRF.PV_EXECUTE)
        Frag.h["src"] = xrfragment_XRF.T_URL
        Frag.h["href"] = (xrfragment_XRF.T_URL | xrfragment_XRF.T_PREDEFINED_VIEW)
        Frag.h["tag"] = (xrfragment_XRF.IMMUTABLE | xrfragment_XRF.T_STRING)
        Frag.h["pos"] = ((((xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_VECTOR3) | xrfragment_XRF.T_STRING) | xrfragment_XRF.METADATA) | xrfragment_XRF.NAVIGATOR)
        Frag.h["rot"] = ((((xrfragment_XRF.QUERY_OPERATOR | xrfragment_XRF.PV_OVERRIDE) | xrfragment_XRF.T_VECTOR3) | xrfragment_XRF.METADATA) | xrfragment_XRF.NAVIGATOR)
        Frag.h["t"] = ((((xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_FLOAT) | xrfragment_XRF.T_VECTOR2) | xrfragment_XRF.NAVIGATOR) | xrfragment_XRF.METADATA)
        Frag.h["s"] = (xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_MEDIAFRAG)
        Frag.h["loop"] = xrfragment_XRF.PV_OVERRIDE
        Frag.h["uv"] = (xrfragment_XRF.T_VECTOR2 | xrfragment_XRF.T_MEDIAFRAG)
        Frag.h["namespace"] = (xrfragment_XRF.IMMUTABLE | xrfragment_XRF.T_STRING)
        Frag.h["SPDX"] = (xrfragment_XRF.IMMUTABLE | xrfragment_XRF.T_STRING)
        Frag.h["unit"] = (xrfragment_XRF.IMMUTABLE | xrfragment_XRF.T_STRING)
        Frag.h["description"] = (xrfragment_XRF.IMMUTABLE | xrfragment_XRF.T_STRING)
        keyStripped = xrfragment_XRF.operators.replace(key,"")
        isPVDynamic = ((len(key) > 0) and (not (key in Frag.h)))
        if isPVDynamic:
            v = xrfragment_XRF(key,(xrfragment_XRF.PV_EXECUTE | xrfragment_XRF.NAVIGATOR),index)
            v.validate(value)
            v.flags = xrfragment_XRF.set(xrfragment_XRF.T_DYNAMICKEY,v.flags)
            if (not (key in Frag.h)):
                v.flags = xrfragment_XRF.set(xrfragment_XRF.CUSTOMFRAG,v.flags)
            if (len(value) == 0):
                v.flags = xrfragment_XRF.set(xrfragment_XRF.T_DYNAMICKEYVALUE,v.flags)
            setattr(store,(("_hx_" + keyStripped) if ((keyStripped in python_Boot.keywords)) else (("_hx_" + keyStripped) if (((((len(keyStripped) > 2) and ((ord(keyStripped[0]) == 95))) and ((ord(keyStripped[1]) == 95))) and ((ord(keyStripped[(len(keyStripped) - 1)]) != 95)))) else keyStripped)),v)
            return True
        v = xrfragment_XRF(key,Frag.h.get(key,None),index)
        if (key in Frag.h):
            if (not v.validate(value)):
                print(str((((("⚠ fragment '" + ("null" if key is None else key)) + "' has incompatible value (") + ("null" if value is None else value)) + ")")))
                return False
            setattr(store,(("_hx_" + keyStripped) if ((keyStripped in python_Boot.keywords)) else (("_hx_" + keyStripped) if (((((len(keyStripped) > 2) and ((ord(keyStripped[0]) == 95))) and ((ord(keyStripped[1]) == 95))) and ((ord(keyStripped[(len(keyStripped) - 1)]) != 95)))) else keyStripped)),v)
            if xrfragment_Parser.debug:
                print(str(((("✔ " + ("null" if key is None else key)) + ": ") + HxOverrides.stringOrNull(v.string))))
        else:
            if Std.isOfType(value,str):
                v.guessType(v,value)
            v.flags = xrfragment_XRF.set(xrfragment_XRF.CUSTOMFRAG,v.flags)
            setattr(store,(("_hx_" + keyStripped) if ((keyStripped in python_Boot.keywords)) else (("_hx_" + keyStripped) if (((((len(keyStripped) > 2) and ((ord(keyStripped[0]) == 95))) and ((ord(keyStripped[1]) == 95))) and ((ord(keyStripped[(len(keyStripped) - 1)]) != 95)))) else keyStripped)),v)
        return True

    @staticmethod
    def getMetaData():
        meta = _hx_AnonObject({'title': ["title", "og:title", "dc.title"], 'description': ["aria-description", "og:description", "dc.description"], 'author': ["author", "dc.creator"], 'publisher': ["publisher", "dc.publisher"], 'website': ["og:site_name", "og:url", "dc.publisher"], 'license': ["SPDX", "dc.rights"]})
        return meta
xrfragment_Parser._hx_class = xrfragment_Parser


class xrfragment_URI:
    _hx_class_name = "xrfragment.URI"
    __slots__ = ()
    _hx_statics = ["__meta__", "parse", "template"]

    @staticmethod
    def parse(url,_hx_filter):
        store = _hx_AnonObject({})
        tmp = None
        if (url is not None):
            startIndex = None
            tmp = (((url.find("#") if ((startIndex is None)) else HxString.indexOfImpl(url,"#",startIndex))) == -1)
        else:
            tmp = True
        if tmp:
            return store
        fragment = url.split("#")
        _this = (fragment[1] if 1 < len(fragment) else None)
        splitArray = _this.split("&")
        _g = 0
        _g1 = len(splitArray)
        while (_g < _g1):
            i = _g
            _g = (_g + 1)
            _this = (splitArray[i] if i >= 0 and i < len(splitArray) else None)
            splitByEqual = _this.split("=")
            regexPlus = EReg("\\+","g")
            key = (splitByEqual[0] if 0 < len(splitByEqual) else None)
            value = ""
            if (len(splitByEqual) > 1):
                _this1 = xrfragment_XRF.isVector
                _this1.matchObj = python_lib_Re.search(_this1.pattern,(splitByEqual[1] if 1 < len(splitByEqual) else None))
                if (_this1.matchObj is not None):
                    value = (splitByEqual[1] if 1 < len(splitByEqual) else None)
                else:
                    _this2 = regexPlus.split((splitByEqual[1] if 1 < len(splitByEqual) else None))
                    value = python_lib_urllib_Parse.unquote(" ".join([python_Boot.toString1(x1,'') for x1 in _this2]))
            ok = xrfragment_Parser.parse(key,value,store,i)
        if ((_hx_filter is not None) and ((_hx_filter != 0))):
            _g = 0
            _g1 = python_Boot.fields(store)
            while (_g < len(_g1)):
                key = (_g1[_g] if _g >= 0 and _g < len(_g1) else None)
                _g = (_g + 1)
                xrf = Reflect.field(store,key)
                if (not xrf._hx_is(_hx_filter)):
                    Reflect.deleteField(store,key)
        return store

    @staticmethod
    def template(uri,vars):
        parts = uri.split("#")
        if (len(parts) == 1):
            return uri
        frag = (parts[1] if 1 < len(parts) else None)
        frag = StringTools.replace(frag,"{","::")
        frag = StringTools.replace(frag,"}","::")
        frag = haxe_Template(frag).execute(vars)
        frag = StringTools.replace(frag,"null","")
        python_internal_ArrayImpl._set(parts, 1, frag)
        return "#".join([python_Boot.toString1(x1,'') for x1 in parts])
xrfragment_URI._hx_class = xrfragment_URI


class xrfragment_XRF:
    _hx_class_name = "xrfragment.XRF"
    __slots__ = ("fragment", "flags", "index", "x", "y", "z", "shift", "floats", "color", "string", "int", "float", "filter", "reset", "loop", "xrfScheme")
    _hx_fields = ["fragment", "flags", "index", "x", "y", "z", "shift", "floats", "color", "string", "int", "float", "filter", "reset", "loop", "xrfScheme"]
    _hx_methods = ["is", "validate", "guessType"]
    _hx_statics = ["__meta__", "IMMUTABLE", "PROP_BIND", "QUERY_OPERATOR", "PROMPT", "CUSTOMFRAG", "NAVIGATOR", "METADATA", "PV_OVERRIDE", "PV_EXECUTE", "T_COLOR", "T_INT", "T_FLOAT", "T_VECTOR2", "T_VECTOR3", "T_URL", "T_PREDEFINED_VIEW", "T_STRING", "T_MEDIAFRAG", "T_DYNAMICKEY", "T_DYNAMICKEYVALUE", "isColor", "isInt", "isFloat", "isVector", "isUrl", "isUrlOrPretypedView", "isString", "operators", "isProp", "isExclude", "isDeep", "isNumber", "isMediaFrag", "isReset", "isShift", "isXRFScheme", "set", "unset", "toDict"]

    def __init__(self,_fragment,_flags,_index = None):
        self.xrfScheme = None
        self.loop = None
        self.reset = None
        self.filter = None
        self.float = None
        self.int = None
        self.string = None
        self.color = None
        self.z = None
        self.y = None
        self.x = None
        self.floats = list()
        self.shift = list()
        self.fragment = _fragment
        self.flags = _flags
        self.index = _index

    def _hx_is(self,flag):
        if (not Std.isOfType(self.flags,Int)):
            self.flags = 0
        return (((self.flags & flag)) != 0)

    def validate(self,value):
        self.guessType(self,value)
        ok = True
        if (len(value) == 0):
            ok = False
        if (((not self._hx_is(xrfragment_XRF.T_FLOAT)) and self._hx_is(xrfragment_XRF.T_VECTOR2)) and (not ((Std.isOfType(self.x,Float) and Std.isOfType(self.y,Float))))):
            ok = False
        if (((not ((self._hx_is(xrfragment_XRF.T_VECTOR2) or self._hx_is(xrfragment_XRF.T_STRING)))) and self._hx_is(xrfragment_XRF.T_VECTOR3)) and (not (((Std.isOfType(self.x,Float) and Std.isOfType(self.y,Float)) and Std.isOfType(self.z,Float))))):
            ok = False
        return ok

    def guessType(self,v,_hx_str):
        v.string = _hx_str
        _this = xrfragment_XRF.isReset
        _this.matchObj = python_lib_Re.search(_this.pattern,v.fragment)
        if (_this.matchObj is not None):
            v.reset = True
        if (v.fragment == "loop"):
            v.loop = True
        if (not Std.isOfType(_hx_str,str)):
            return
        if (len(_hx_str) > 0):
            _this = xrfragment_XRF.isXRFScheme
            _this.matchObj = python_lib_Re.search(_this.pattern,_hx_str)
            if (_this.matchObj is not None):
                v.xrfScheme = True
                _hx_str = xrfragment_XRF.isXRFScheme.replace(_hx_str,"")
                v.string = _hx_str
            if (len(_hx_str.split(",")) > 1):
                xyzn = _hx_str.split(",")
                if (len(xyzn) > 0):
                    v.x = Std.parseFloat((xyzn[0] if 0 < len(xyzn) else None))
                if (len(xyzn) > 1):
                    v.y = Std.parseFloat((xyzn[1] if 1 < len(xyzn) else None))
                if (len(xyzn) > 2):
                    v.z = Std.parseFloat((xyzn[2] if 2 < len(xyzn) else None))
                _g = 0
                _g1 = len(xyzn)
                while (_g < _g1):
                    i = _g
                    _g = (_g + 1)
                    _this = v.shift
                    _this1 = xrfragment_XRF.isShift
                    _this1.matchObj = python_lib_Re.search(_this1.pattern,(xyzn[i] if i >= 0 and i < len(xyzn) else None))
                    x = (_this1.matchObj is not None)
                    _this.append(x)
                    _this2 = v.floats
                    x1 = Std.parseFloat(xrfragment_XRF.isShift.replace((xyzn[i] if i >= 0 and i < len(xyzn) else None),""))
                    _this2.append(x1)
            _this = xrfragment_XRF.isColor
            _this.matchObj = python_lib_Re.search(_this.pattern,_hx_str)
            if (_this.matchObj is not None):
                v.color = _hx_str
            _this = xrfragment_XRF.isFloat
            _this.matchObj = python_lib_Re.search(_this.pattern,_hx_str)
            if (_this.matchObj is not None):
                v.x = Std.parseFloat(_hx_str)
                v.float = v.x
            _this = xrfragment_XRF.isInt
            _this.matchObj = python_lib_Re.search(_this.pattern,_hx_str)
            if (_this.matchObj is not None):
                v.int = Std.parseInt(_hx_str)
                v.x = v.int
                _this = v.floats
                x = v.x
                _this.append(x)
            v.filter = xrfragment_Filter(((HxOverrides.stringOrNull(v.fragment) + "=") + HxOverrides.stringOrNull(v.string)))
        else:
            v.filter = xrfragment_Filter(v.fragment)

    @staticmethod
    def set(flag,flags):
        return (flags | flag)

    @staticmethod
    def unset(flag,flags):
        return (flags & ~flag)

    @staticmethod
    def toDict(o):
        return python_Lib.anonToDict(o)

xrfragment_XRF._hx_class = xrfragment_XRF

Math.NEGATIVE_INFINITY = float("-inf")
Math.POSITIVE_INFINITY = float("inf")
Math.NaN = float("nan")
Math.PI = python_lib_Math.pi

haxe_Template.splitter = EReg("(::[A-Za-z0-9_ ()&|!+=/><*.\"-]+::|\\$\\$([A-Za-z0-9_-]+)\\()","")
haxe_Template.expr_splitter = EReg("(\\(|\\)|[ \r\n\t]*\"[^\"]*\"[ \r\n\t]*|[!+=/><*.&|-]+)","")
haxe_Template.expr_trim = EReg("^[ ]*([^ ]+)[ ]*$","")
haxe_Template.expr_int = EReg("^[0-9]+$","")
haxe_Template.expr_float = EReg("^([+-]?)(?=\\d|,\\d)\\d*(,\\d*)?([Ee]([+-]?\\d+))?$","")
haxe_Template.globals = _hx_AnonObject({})
haxe_Template.hxKeepArrayIterator = haxe_iterators_ArrayIterator([])
python_Boot.keywords = set(["and", "del", "from", "not", "with", "as", "elif", "global", "or", "yield", "assert", "else", "if", "pass", "None", "break", "except", "import", "raise", "True", "class", "exec", "in", "return", "False", "continue", "finally", "is", "try", "def", "for", "lambda", "while"])
python_Boot.prefixLength = len("_hx_")
xrfragment_Parser.error = ""
xrfragment_Parser.debug = False
xrfragment_URI.__meta__ = _hx_AnonObject({'statics': _hx_AnonObject({'template': _hx_AnonObject({'keep': None})})})
xrfragment_XRF.__meta__ = _hx_AnonObject({'statics': _hx_AnonObject({'toDict': _hx_AnonObject({'keep': None})})})
xrfragment_XRF.IMMUTABLE = 1
xrfragment_XRF.PROP_BIND = 2
xrfragment_XRF.QUERY_OPERATOR = 4
xrfragment_XRF.PROMPT = 8
xrfragment_XRF.CUSTOMFRAG = 16
xrfragment_XRF.NAVIGATOR = 32
xrfragment_XRF.METADATA = 64
xrfragment_XRF.PV_OVERRIDE = 128
xrfragment_XRF.PV_EXECUTE = 256
xrfragment_XRF.T_COLOR = 8192
xrfragment_XRF.T_INT = 16384
xrfragment_XRF.T_FLOAT = 32768
xrfragment_XRF.T_VECTOR2 = 65536
xrfragment_XRF.T_VECTOR3 = 131072
xrfragment_XRF.T_URL = 262144
xrfragment_XRF.T_PREDEFINED_VIEW = 524288
xrfragment_XRF.T_STRING = 1048576
xrfragment_XRF.T_MEDIAFRAG = 2097152
xrfragment_XRF.T_DYNAMICKEY = 4194304
xrfragment_XRF.T_DYNAMICKEYVALUE = 8388608
xrfragment_XRF.isColor = EReg("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$","")
xrfragment_XRF.isInt = EReg("^[-0-9]+$","")
xrfragment_XRF.isFloat = EReg("^[-0-9]+\\.[0-9]+$","")
xrfragment_XRF.isVector = EReg("([,]+|\\w)","")
xrfragment_XRF.isUrl = EReg("(://)?\\..*","")
xrfragment_XRF.isUrlOrPretypedView = EReg("(^#|://)?\\..*","")
xrfragment_XRF.isString = EReg(".*","")
xrfragment_XRF.operators = EReg("(^[-]|^[!]|[\\*]$)","g")
xrfragment_XRF.isProp = EReg("^.*=[><=]?","")
xrfragment_XRF.isExclude = EReg("^-","")
xrfragment_XRF.isDeep = EReg("\\*","")
xrfragment_XRF.isNumber = EReg("^[0-9\\.]+$","")
xrfragment_XRF.isMediaFrag = EReg("^([0-9\\.,\\*+-]+)$","")
xrfragment_XRF.isReset = EReg("^!","")
xrfragment_XRF.isShift = EReg("^(\\+|--)","")
xrfragment_XRF.isXRFScheme = EReg("^xrf://","")