import sys

import math as python_lib_Math
import math as Math
import inspect as python_lib_Inspect
import sys as python_lib_Sys
import functools as python_lib_Functools
import re as python_lib_Re
import traceback as python_lib_Traceback
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



class Class: pass


class EReg:
    _hx_class_name = "EReg"
    __slots__ = ("pattern", "matchObj", "_hx_global")
    _hx_fields = ["pattern", "matchObj", "global"]
    _hx_methods = ["split"]

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



class Reflect:
    _hx_class_name = "Reflect"
    __slots__ = ()
    _hx_statics = ["field", "deleteField"]

    @staticmethod
    def field(o,field):
        return python_Boot.field(o,field)

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


class Float: pass


class Int: pass


class Bool: pass


class Dynamic: pass


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


class haxe_IMap:
    _hx_class_name = "haxe.IMap"
    __slots__ = ()


class haxe_Exception(Exception):
    _hx_class_name = "haxe.Exception"
    __slots__ = ("_hx___nativeStack", "_hx___nativeException", "_hx___previousException")
    _hx_fields = ["__nativeStack", "__nativeException", "__previousException"]
    _hx_methods = ["unwrap"]
    _hx_statics = ["caught"]
    _hx_interfaces = []
    _hx_super = Exception


    def __init__(self,message,previous = None,native = None):
        self._hx___previousException = None
        self._hx___nativeException = None
        self._hx___nativeStack = None
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

    @staticmethod
    def caught(value):
        if Std.isOfType(value,haxe_Exception):
            return value
        elif Std.isOfType(value,BaseException):
            return haxe_Exception(str(value),None,value)
        else:
            return haxe_ValueException(value,None,value)



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



class haxe_ds_StringMap:
    _hx_class_name = "haxe.ds.StringMap"
    __slots__ = ("h",)
    _hx_fields = ["h"]
    _hx_interfaces = [haxe_IMap]

    def __init__(self):
        self.h = dict()



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



class python_Boot:
    _hx_class_name = "python.Boot"
    __slots__ = ()
    _hx_statics = ["keywords", "toString1", "fields", "simpleField", "hasField", "field", "getInstanceFields", "getSuperClass", "getClassFields", "prefixLength", "unhandleKeywords"]

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



class python_internal_ArrayImpl:
    _hx_class_name = "python.internal.ArrayImpl"
    __slots__ = ()
    _hx_statics = ["concat", "copy", "iterator", "keyValueIterator", "indexOf", "lastIndexOf", "join", "toString", "pop", "push", "unshift", "remove", "contains", "shift", "slice", "sort", "splice", "map", "filter", "insert", "reverse", "_get"]

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


class HxOverrides:
    _hx_class_name = "HxOverrides"
    __slots__ = ()
    _hx_statics = ["eq", "stringOrNull", "push", "arrayGet"]

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
    def push(x,e):
        if isinstance(x,list):
            _this = x
            _this.append(e)
            return len(_this)
        return x.push(e)

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



class HxString:
    _hx_class_name = "HxString"
    __slots__ = ()
    _hx_statics = ["split", "charCodeAt", "charAt", "lastIndexOf", "toUpperCase", "toLowerCase", "indexOf", "indexOfImpl", "toString", "substring", "substr"]

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


class xrfragment_Parser:
    _hx_class_name = "xrfragment.Parser"
    __slots__ = ()
    _hx_statics = ["error", "parse"]

    @staticmethod
    def parse(key,value,resultMap):
        Frag = haxe_ds_StringMap()
        Frag.h["prio"] = (xrfragment_XRF.ASSET_OBJ | xrfragment_XRF.T_INT)
        Frag.h["#"] = (xrfragment_XRF.ASSET | xrfragment_XRF.T_PREDEFINED_VIEW)
        Frag.h["class"] = (xrfragment_XRF.ASSET_OBJ | xrfragment_XRF.T_STRING)
        Frag.h["src"] = (xrfragment_XRF.ASSET_OBJ | xrfragment_XRF.T_URL)
        Frag.h["src_audio"] = (xrfragment_XRF.ASSET_OBJ | xrfragment_XRF.T_URL)
        Frag.h["src_shader"] = (xrfragment_XRF.ASSET_OBJ | xrfragment_XRF.T_URL)
        Frag.h["src_env"] = (xrfragment_XRF.ASSET | xrfragment_XRF.T_URL)
        Frag.h["src_env_audio"] = (xrfragment_XRF.ASSET | xrfragment_XRF.T_URL)
        Frag.h["pos"] = (((xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.ROUNDROBIN) | xrfragment_XRF.T_VECTOR3) | xrfragment_XRF.T_STRING_OBJ)
        Frag.h["href"] = ((xrfragment_XRF.ASSET_OBJ | xrfragment_XRF.T_URL) | xrfragment_XRF.T_PREDEFINED_VIEW)
        Frag.h["q"] = (xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_STRING)
        Frag.h["scale"] = (((xrfragment_XRF.QUERY_OPERATOR | xrfragment_XRF.PV_OVERRIDE) | xrfragment_XRF.ROUNDROBIN) | xrfragment_XRF.T_INT)
        Frag.h["rot"] = (((xrfragment_XRF.QUERY_OPERATOR | xrfragment_XRF.PV_OVERRIDE) | xrfragment_XRF.ROUNDROBIN) | xrfragment_XRF.T_VECTOR3)
        Frag.h["translate"] = (((xrfragment_XRF.QUERY_OPERATOR | xrfragment_XRF.PV_OVERRIDE) | xrfragment_XRF.ROUNDROBIN) | xrfragment_XRF.T_VECTOR3)
        Frag.h["visible"] = (((xrfragment_XRF.QUERY_OPERATOR | xrfragment_XRF.PV_OVERRIDE) | xrfragment_XRF.ROUNDROBIN) | xrfragment_XRF.T_INT)
        Frag.h["t"] = ((((xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE) | xrfragment_XRF.ROUNDROBIN) | xrfragment_XRF.T_VECTOR2) | xrfragment_XRF.BROWSER_OVERRIDE)
        Frag.h["gravity"] = ((xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE) | xrfragment_XRF.T_VECTOR3)
        Frag.h["physics"] = ((xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE) | xrfragment_XRF.T_VECTOR3)
        Frag.h["scroll"] = ((xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE) | xrfragment_XRF.T_STRING)
        Frag.h["."] = ((xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE) | xrfragment_XRF.T_STRING)
        Frag.h["fov"] = (((xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE) | xrfragment_XRF.T_INT) | xrfragment_XRF.BROWSER_OVERRIDE)
        Frag.h["clip"] = (((xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE) | xrfragment_XRF.T_VECTOR2) | xrfragment_XRF.BROWSER_OVERRIDE)
        Frag.h["fog"] = (((xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE) | xrfragment_XRF.T_STRING) | xrfragment_XRF.BROWSER_OVERRIDE)
        Frag.h["namespace"] = (xrfragment_XRF.ASSET | xrfragment_XRF.T_STRING)
        Frag.h["SPFX"] = (xrfragment_XRF.ASSET | xrfragment_XRF.T_STRING)
        Frag.h["unit"] = (xrfragment_XRF.ASSET | xrfragment_XRF.T_STRING)
        Frag.h["description"] = (xrfragment_XRF.ASSET | xrfragment_XRF.T_STRING)
        Frag.h["src_session"] = ((((xrfragment_XRF.ASSET | xrfragment_XRF.T_URL) | xrfragment_XRF.PV_OVERRIDE) | xrfragment_XRF.BROWSER_OVERRIDE) | xrfragment_XRF.PROMPT)
        if ((len(value) == 0) and (not (key in Frag.h))):
            value1 = xrfragment_XRF(key,(xrfragment_XRF.PV_EXECUTE | xrfragment_XRF.BROWSER_OVERRIDE))
            setattr(resultMap,(("_hx_" + key) if ((key in python_Boot.keywords)) else (("_hx_" + key) if (((((len(key) > 2) and ((ord(key[0]) == 95))) and ((ord(key[1]) == 95))) and ((ord(key[(len(key) - 1)]) != 95)))) else key)),value1)
            return True
        if (key in Frag.h):
            v = xrfragment_XRF(key,Frag.h.get(key,None))
            if (not v.validate(value)):
                print(str((((("[ i ] fragment '" + ("null" if key is None else key)) + "' has incompatible value (") + ("null" if value is None else value)) + ")")))
                return False
            setattr(resultMap,(("_hx_" + key) if ((key in python_Boot.keywords)) else (("_hx_" + key) if (((((len(key) > 2) and ((ord(key[0]) == 95))) and ((ord(key[1]) == 95))) and ((ord(key[(len(key) - 1)]) != 95)))) else key)),v)
        else:
            print(str((("[ i ] fragment '" + ("null" if key is None else key)) + "' does not exist or has no type typed (yet)")))
            return False
        return True


class xrfragment_Query:
    _hx_class_name = "xrfragment.Query"
    __slots__ = ("str", "q", "isProp", "isExclude", "isClass", "isNumber")
    _hx_fields = ["str", "q", "isProp", "isExclude", "isClass", "isNumber"]
    _hx_methods = ["toObject", "expandAliases", "get", "parse", "test", "testProperty"]

    def __init__(self,_hx_str):
        self.isNumber = EReg("^[0-9\\.]+$","")
        self.isClass = EReg("^[-]?class$","")
        self.isExclude = EReg("^-","")
        self.isProp = EReg("^.*:[><=!]?","")
        self.q = _hx_AnonObject({})
        self.str = ""
        if (_hx_str is not None):
            self.parse(_hx_str)

    def toObject(self):
        return self.q

    def expandAliases(self,token):
        classAlias = EReg("^(-)?\\.","")
        classAlias.matchObj = python_lib_Re.search(classAlias.pattern,token)
        if (classAlias.matchObj is not None):
            return StringTools.replace(token,".","class:")
        else:
            return token

    def get(self):
        return self.q

    def parse(self,_hx_str,recurse = None):
        if (recurse is None):
            recurse = False
        _gthis = self
        token = _hx_str.split(" ")
        q = _hx_AnonObject({})
        def _hx_local_0(_hx_str,prefix = None):
            if (prefix is None):
                prefix = ""
            _hx_str = StringTools.trim(_hx_str)
            k = HxOverrides.arrayGet(_hx_str.split(":"), 0)
            v = HxOverrides.arrayGet(_hx_str.split(":"), 1)
            _hx_filter = _hx_AnonObject({})
            if Reflect.field(q,(("null" if prefix is None else prefix) + ("null" if k is None else k))):
                _hx_filter = Reflect.field(q,(("null" if prefix is None else prefix) + ("null" if k is None else k)))
            value = (Reflect.field(_hx_filter,"rules") if ((Reflect.field(_hx_filter,"rules") is not None)) else list())
            setattr(_hx_filter,(("_hx_" + "rules") if (("rules" in python_Boot.keywords)) else (("_hx_" + "rules") if (((((len("rules") > 2) and ((ord("rules"[0]) == 95))) and ((ord("rules"[1]) == 95))) and ((ord("rules"[(len("rules") - 1)]) != 95)))) else "rules")),value)
            _this = _gthis.isProp
            _this.matchObj = python_lib_Re.search(_this.pattern,_hx_str)
            if (_this.matchObj is not None):
                oper = ""
                startIndex = None
                if (((_hx_str.find("*") if ((startIndex is None)) else HxString.indexOfImpl(_hx_str,"*",startIndex))) != -1):
                    oper = "*"
                startIndex = None
                if (((_hx_str.find(">") if ((startIndex is None)) else HxString.indexOfImpl(_hx_str,">",startIndex))) != -1):
                    oper = ">"
                startIndex = None
                if (((_hx_str.find("<") if ((startIndex is None)) else HxString.indexOfImpl(_hx_str,"<",startIndex))) != -1):
                    oper = "<"
                startIndex = None
                if (((_hx_str.find(">=") if ((startIndex is None)) else HxString.indexOfImpl(_hx_str,">=",startIndex))) != -1):
                    oper = ">="
                startIndex = None
                if (((_hx_str.find("<=") if ((startIndex is None)) else HxString.indexOfImpl(_hx_str,"<=",startIndex))) != -1):
                    oper = "<="
                _this = _gthis.isExclude
                _this.matchObj = python_lib_Re.search(_this.pattern,k)
                if (_this.matchObj is not None):
                    oper = "!="
                    k = HxString.substr(k,1,None)
                else:
                    v = HxString.substr(v,len(oper),None)
                if (len(oper) == 0):
                    oper = "="
                _this = _gthis.isClass
                _this.matchObj = python_lib_Re.search(_this.pattern,k)
                if (_this.matchObj is not None):
                    key = (("null" if prefix is None else prefix) + ("null" if k is None else k))
                    value = (oper != "!=")
                    setattr(_hx_filter,(("_hx_" + key) if ((key in python_Boot.keywords)) else (("_hx_" + key) if (((((len(key) > 2) and ((ord(key[0]) == 95))) and ((ord(key[1]) == 95))) and ((ord(key[(len(key) - 1)]) != 95)))) else key)),value)
                    setattr(q,(("_hx_" + v) if ((v in python_Boot.keywords)) else (("_hx_" + v) if (((((len(v) > 2) and ((ord(v[0]) == 95))) and ((ord(v[1]) == 95))) and ((ord(v[(len(v) - 1)]) != 95)))) else v)),_hx_filter)
                else:
                    rule = _hx_AnonObject({})
                    _this = _gthis.isNumber
                    _this.matchObj = python_lib_Re.search(_this.pattern,v)
                    if (_this.matchObj is not None):
                        value = Std.parseFloat(v)
                        setattr(rule,(("_hx_" + oper) if ((oper in python_Boot.keywords)) else (("_hx_" + oper) if (((((len(oper) > 2) and ((ord(oper[0]) == 95))) and ((ord(oper[1]) == 95))) and ((ord(oper[(len(oper) - 1)]) != 95)))) else oper)),value)
                    else:
                        setattr(rule,(("_hx_" + oper) if ((oper in python_Boot.keywords)) else (("_hx_" + oper) if (((((len(oper) > 2) and ((ord(oper[0]) == 95))) and ((ord(oper[1]) == 95))) and ((ord(oper[(len(oper) - 1)]) != 95)))) else oper)),v)
                    Reflect.field(Reflect.field(_hx_filter,"rules"),"push")(rule)
                    setattr(q,(("_hx_" + k) if ((k in python_Boot.keywords)) else (("_hx_" + k) if (((((len(k) > 2) and ((ord(k[0]) == 95))) and ((ord(k[1]) == 95))) and ((ord(k[(len(k) - 1)]) != 95)))) else k)),_hx_filter)
                return
            else:
                _this = _gthis.isExclude
                _this.matchObj = python_lib_Re.search(_this.pattern,_hx_str)
                value = (False if ((_this.matchObj is not None)) else True)
                setattr(_hx_filter,(("_hx_" + "id") if (("id" in python_Boot.keywords)) else (("_hx_" + "id") if (((((len("id") > 2) and ((ord("id"[0]) == 95))) and ((ord("id"[1]) == 95))) and ((ord("id"[(len("id") - 1)]) != 95)))) else "id")),value)
                _this = _gthis.isExclude
                _this.matchObj = python_lib_Re.search(_this.pattern,_hx_str)
                key = (HxString.substr(_hx_str,1,None) if ((_this.matchObj is not None)) else _hx_str)
                setattr(q,(("_hx_" + key) if ((key in python_Boot.keywords)) else (("_hx_" + key) if (((((len(key) > 2) and ((ord(key[0]) == 95))) and ((ord(key[1]) == 95))) and ((ord(key[(len(key) - 1)]) != 95)))) else key)),_hx_filter)
        process = _hx_local_0
        _g = 0
        _g1 = len(token)
        while (_g < _g1):
            i = _g
            _g = (_g + 1)
            process(self.expandAliases((token[i] if i >= 0 and i < len(token) else None)))
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
        _g = 0
        _g1 = python_Boot.fields(self.q)
        while (_g < len(_g1)):
            k = (_g1[_g] if _g >= 0 and _g < len(_g1) else None)
            _g = (_g + 1)
            _hx_filter = Reflect.field(self.q,k)
            if (Reflect.field(_hx_filter,"rules") is None):
                continue
            rules = Reflect.field(_hx_filter,"rules")
            _g2 = 0
            while (_g2 < len(rules)):
                rule = (rules[_g2] if _g2 >= 0 and _g2 < len(rules) else None)
                _g2 = (_g2 + 1)
                if exclude:
                    if (((Reflect.field(rule,"!=") is not None) and testprop((Std.string(value) == Std.string(Reflect.field(rule,"!="))))) and exclude):
                        qualify = (qualify + 1)
                else:
                    if ((Reflect.field(rule,"*") is not None) and testprop((Std.parseFloat(value) is not None))):
                        qualify = (qualify + 1)
                    if ((Reflect.field(rule,">") is not None) and testprop((Std.parseFloat(value) > Std.parseFloat(Reflect.field(rule,">"))))):
                        qualify = (qualify + 1)
                    if ((Reflect.field(rule,"<") is not None) and testprop((Std.parseFloat(value) < Std.parseFloat(Reflect.field(rule,"<"))))):
                        qualify = (qualify + 1)
                    if ((Reflect.field(rule,">=") is not None) and testprop((Std.parseFloat(value) >= Std.parseFloat(Reflect.field(rule,">="))))):
                        qualify = (qualify + 1)
                    if ((Reflect.field(rule,"<=") is not None) and testprop((Std.parseFloat(value) <= Std.parseFloat(Reflect.field(rule,"<="))))):
                        qualify = (qualify + 1)
                    if ((Reflect.field(rule,"=") is not None) and ((testprop((value == Reflect.field(rule,"="))) or testprop((Std.parseFloat(value) == Std.parseFloat(Reflect.field(rule,"="))))))):
                        qualify = (qualify + 1)
        return (qualify > 0)



class xrfragment_URI:
    _hx_class_name = "xrfragment.URI"
    __slots__ = ()
    _hx_statics = ["parse"]

    @staticmethod
    def parse(qs,browser_override):
        fragment = qs.split("#")
        _this = (fragment[1] if 1 < len(fragment) else None)
        splitArray = _this.split("&")
        resultMap = _hx_AnonObject({})
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
                _this1 = regexPlus.split((splitByEqual[1] if 1 < len(splitByEqual) else None))
                value = python_lib_urllib_Parse.unquote(" ".join([python_Boot.toString1(x1,'') for x1 in _this1]))
            ok = xrfragment_Parser.parse(key,value,resultMap)
        if browser_override:
            _g = 0
            _g1 = python_Boot.fields(resultMap)
            while (_g < len(_g1)):
                key = (_g1[_g] if _g >= 0 and _g < len(_g1) else None)
                _g = (_g + 1)
                xrf = Reflect.field(resultMap,key)
                if (not xrf._hx_is(xrfragment_XRF.BROWSER_OVERRIDE)):
                    Reflect.deleteField(resultMap,key)
        return resultMap


class xrfragment_XRF:
    _hx_class_name = "xrfragment.XRF"
    __slots__ = ("fragment", "flags", "x", "y", "z", "color", "string", "int", "float", "args", "query")
    _hx_fields = ["fragment", "flags", "x", "y", "z", "color", "string", "int", "float", "args", "query"]
    _hx_methods = ["is", "validate", "guessType"]
    _hx_statics = ["ASSET", "ASSET_OBJ", "QUERY_OPERATOR", "PROMPT", "ROUNDROBIN", "BROWSER_OVERRIDE", "PV_OVERRIDE", "PV_EXECUTE", "T_INT", "T_VECTOR2", "T_VECTOR3", "T_URL", "T_PREDEFINED_VIEW", "T_STRING", "T_STRING_OBJ", "isColor", "isInt", "isFloat"]

    def __init__(self,_fragment,_flags):
        self.query = None
        self.args = None
        self.float = None
        self.int = None
        self.string = None
        self.color = None
        self.z = None
        self.y = None
        self.x = None
        self.fragment = _fragment
        self.flags = _flags

    def _hx_is(self,flag):
        return (((self.flags & flag)) != 0)

    def validate(self,value):
        self.guessType(self,value)
        if (len(value.split("|")) > 1):
            self.args = list()
            args = value.split("|")
            _g = 0
            _g1 = len(args)
            while (_g < _g1):
                i = _g
                _g = (_g + 1)
                x = xrfragment_XRF(self.fragment,self.flags)
                self.guessType(x,(args[i] if i >= 0 and i < len(args) else None))
                _this = self.args
                _this.append(x)
        if (self.fragment == "q"):
            self.query = xrfragment_Query(value).get()
        ok = True
        if (not Std.isOfType(self.args,list)):
            if (self._hx_is(xrfragment_XRF.T_VECTOR3) and (not (((Std.isOfType(self.x,Float) and Std.isOfType(self.y,Float)) and Std.isOfType(self.z,Float))))):
                ok = False
            if (self._hx_is(xrfragment_XRF.T_VECTOR2) and (not ((Std.isOfType(self.x,Float) and Std.isOfType(self.y,Float))))):
                ok = False
            if (self._hx_is(xrfragment_XRF.T_INT) and (not Std.isOfType(self.int,Int))):
                ok = False
        return ok

    def guessType(self,v,_hx_str):
        v.string = _hx_str
        if (len(_hx_str.split(",")) > 1):
            xyz = _hx_str.split(",")
            if (len(xyz) > 0):
                v.x = Std.parseFloat((xyz[0] if 0 < len(xyz) else None))
            if (len(xyz) > 1):
                v.y = Std.parseFloat((xyz[1] if 1 < len(xyz) else None))
            if (len(xyz) > 2):
                v.z = Std.parseFloat((xyz[2] if 2 < len(xyz) else None))
        _this = xrfragment_XRF.isColor
        _this.matchObj = python_lib_Re.search(_this.pattern,_hx_str)
        if (_this.matchObj is not None):
            v.color = _hx_str
        _this = xrfragment_XRF.isFloat
        _this.matchObj = python_lib_Re.search(_this.pattern,_hx_str)
        if (_this.matchObj is not None):
            v.float = Std.parseFloat(_hx_str)
        _this = xrfragment_XRF.isInt
        _this.matchObj = python_lib_Re.search(_this.pattern,_hx_str)
        if (_this.matchObj is not None):
            v.int = Std.parseInt(_hx_str)


Math.NEGATIVE_INFINITY = float("-inf")
Math.POSITIVE_INFINITY = float("inf")
Math.NaN = float("nan")
Math.PI = python_lib_Math.pi

python_Boot.keywords = set(["and", "del", "from", "not", "with", "as", "elif", "global", "or", "yield", "assert", "else", "if", "pass", "None", "break", "except", "import", "raise", "True", "class", "exec", "in", "return", "False", "continue", "finally", "is", "try", "def", "for", "lambda", "while"])
python_Boot.prefixLength = len("_hx_")
xrfragment_Parser.error = ""
xrfragment_XRF.ASSET = 1
xrfragment_XRF.ASSET_OBJ = 2
xrfragment_XRF.QUERY_OPERATOR = 4
xrfragment_XRF.PROMPT = 8
xrfragment_XRF.ROUNDROBIN = 16
xrfragment_XRF.BROWSER_OVERRIDE = 32
xrfragment_XRF.PV_OVERRIDE = 64
xrfragment_XRF.PV_EXECUTE = 128
xrfragment_XRF.T_INT = 512
xrfragment_XRF.T_VECTOR2 = 2048
xrfragment_XRF.T_VECTOR3 = 4096
xrfragment_XRF.T_URL = 8192
xrfragment_XRF.T_PREDEFINED_VIEW = 16384
xrfragment_XRF.T_STRING = 32768
xrfragment_XRF.T_STRING_OBJ = 65536
xrfragment_XRF.isColor = EReg("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$","")
xrfragment_XRF.isInt = EReg("^[0-9]+$","")
xrfragment_XRF.isFloat = EReg("^[0-9]+\\.[0-9]+$","")