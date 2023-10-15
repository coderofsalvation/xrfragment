var $hx_exports = typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this;
(function ($global) { "use strict";
$hx_exports["xrfragment"] = $hx_exports["xrfragment"] || {};
var EReg = function(r,opt) {
	this.r = new RegExp(r,opt.split("u").join(""));
};
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) {
			this.r.lastIndex = 0;
		}
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) {
		return undefined;
	}
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(len == null) {
		len = s.length;
	} else if(len < 0) {
		if(pos == 0) {
			len = s.length + len;
		} else {
			return "";
		}
	}
	return s.substr(pos,len);
};
HxOverrides.now = function() {
	return Date.now();
};
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( _g ) {
		return null;
	}
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) {
			a.push(f);
		}
		}
	}
	return a;
};
Reflect.deleteField = function(o,field) {
	if(!Object.prototype.hasOwnProperty.call(o,field)) {
		return false;
	}
	delete(o[field]);
	return true;
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	if(x != null) {
		var _g = 0;
		var _g1 = x.length;
		while(_g < _g1) {
			var i = _g++;
			var c = x.charCodeAt(i);
			if(c <= 8 || c >= 14 && c != 32 && c != 45) {
				var nc = x.charCodeAt(i + 1);
				var v = parseInt(x,nc == 120 || nc == 88 ? 16 : 10);
				if(isNaN(v)) {
					return null;
				} else {
					return v;
				}
			}
		}
	}
	return null;
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	if(!(c > 8 && c < 14)) {
		return c == 32;
	} else {
		return true;
	}
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,r,l - r);
	} else {
		return s;
	}
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,0,l - r);
	} else {
		return s;
	}
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
haxe_iterators_ArrayIterator.__name__ = true;
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(((o) instanceof Array)) {
			var str = "[";
			s += "\t";
			var _g = 0;
			var _g1 = o.length;
			while(_g < _g1) {
				var i = _g++;
				str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( _g ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		var k = null;
		for( k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) {
			str += ", \n";
		}
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "string":
		return o;
	default:
		return String(o);
	}
};
var xrfragment_Parser = $hx_exports["xrfragment"]["Parser"] = function() { };
xrfragment_Parser.__name__ = true;
xrfragment_Parser.parse = function(key,value,store) {
	var Frag_h = Object.create(null);
	Frag_h["#"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_PREDEFINED_VIEW | xrfragment_XRF.PV_EXECUTE;
	Frag_h["prio"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_INT;
	Frag_h["src"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_URL;
	Frag_h["href"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_URL | xrfragment_XRF.T_PREDEFINED_VIEW;
	Frag_h["tag"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_STRING;
	Frag_h["pos"] = xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.ROUNDROBIN | xrfragment_XRF.T_VECTOR3 | xrfragment_XRF.T_STRING_OBJ | xrfragment_XRF.METADATA | xrfragment_XRF.NAVIGATOR;
	Frag_h["q"] = xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_STRING | xrfragment_XRF.METADATA;
	Frag_h["scale"] = xrfragment_XRF.QUERY_OPERATOR | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.ROUNDROBIN | xrfragment_XRF.T_VECTOR3 | xrfragment_XRF.METADATA;
	Frag_h["rot"] = xrfragment_XRF.QUERY_OPERATOR | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.ROUNDROBIN | xrfragment_XRF.T_VECTOR3 | xrfragment_XRF.METADATA | xrfragment_XRF.NAVIGATOR;
	Frag_h["mov"] = xrfragment_XRF.QUERY_OPERATOR | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.ROUNDROBIN | xrfragment_XRF.T_VECTOR3 | xrfragment_XRF.METADATA;
	Frag_h["show"] = xrfragment_XRF.QUERY_OPERATOR | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.ROUNDROBIN | xrfragment_XRF.T_INT | xrfragment_XRF.METADATA;
	Frag_h["env"] = xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_STRING | xrfragment_XRF.METADATA;
	Frag_h["t"] = xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.ROUNDROBIN | xrfragment_XRF.T_VECTOR2 | xrfragment_XRF.NAVIGATOR | xrfragment_XRF.METADATA;
	Frag_h["gravity"] = xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_VECTOR3 | xrfragment_XRF.METADATA;
	Frag_h["physics"] = xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_VECTOR3 | xrfragment_XRF.METADATA;
	Frag_h["fov"] = xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_INT | xrfragment_XRF.NAVIGATOR | xrfragment_XRF.METADATA;
	Frag_h["clip"] = xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_VECTOR2 | xrfragment_XRF.NAVIGATOR | xrfragment_XRF.METADATA;
	Frag_h["fog"] = xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_VECTOR2 | xrfragment_XRF.NAVIGATOR | xrfragment_XRF.METADATA;
	Frag_h["bg"] = xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_VECTOR3 | xrfragment_XRF.NAVIGATOR | xrfragment_XRF.METADATA;
	Frag_h["namespace"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_STRING;
	Frag_h["SPDX"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_STRING;
	Frag_h["unit"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_STRING;
	Frag_h["description"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_STRING;
	Frag_h["session"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_URL | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.NAVIGATOR | xrfragment_XRF.METADATA | xrfragment_XRF.PROMPT;
	var isPVDynamic = value.length == 0 && key.length > 0 && !Object.prototype.hasOwnProperty.call(Frag_h,key);
	var isPVDefault = value.length == 0 && key.length > 0 && key == "#";
	if(isPVDynamic) {
		var v = new xrfragment_XRF(key,xrfragment_XRF.PV_EXECUTE | xrfragment_XRF.NAVIGATOR);
		v.validate(key);
		store[key] = v;
		return true;
	}
	if(key.split(".").length > 1 && value.split(".").length > 1) {
		store[key] = new xrfragment_XRF(key,xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_STRING | xrfragment_XRF.PROP_BIND);
		return true;
	}
	var v = new xrfragment_XRF(key,Frag_h[key]);
	if(Object.prototype.hasOwnProperty.call(Frag_h,key)) {
		if(!v.validate(value)) {
			console.log("src/xrfragment/Parser.hx:83:","⚠ fragment '" + key + "' has incompatible value (" + value + ")");
			return false;
		}
		store[key] = v;
		if(xrfragment_Parser.debug) {
			console.log("src/xrfragment/Parser.hx:87:","✔ " + key + ": " + v.string);
		}
	} else {
		if(typeof(value) == "string") {
			v.guessType(v,value);
		}
		v.noXRF = true;
		store[key] = v;
	}
	return true;
};
var xrfragment_Query = $hx_exports["xrfragment"]["Query"] = function(str) {
	this.isNumber = new EReg("^[0-9\\.]+$","");
	this.isRoot = new EReg("^[-]?/","");
	this.isExclude = new EReg("^-","");
	this.isProp = new EReg("^.*:[><=!]?","");
	this.q = { };
	this.str = "";
	if(str != null) {
		this.parse(str);
	}
};
xrfragment_Query.__name__ = true;
xrfragment_Query.prototype = {
	toObject: function() {
		return this.q;
	}
	,get: function() {
		return this.q;
	}
	,parse: function(str) {
		var _gthis = this;
		var token = str.split(" ");
		var q = { };
		var process = function(str,prefix) {
			if(prefix == null) {
				prefix = "";
			}
			str = StringTools.trim(str);
			var k = str.split(":")[0];
			var v = str.split(":")[1];
			var filter = { };
			if(q[prefix + k]) {
				filter = q[prefix + k];
			}
			filter["rules"] = filter["rules"] != null ? filter["rules"] : [];
			if(_gthis.isProp.match(str)) {
				var oper = "";
				if(str.indexOf("*") != -1) {
					oper = "*";
				}
				if(str.indexOf(">") != -1) {
					oper = ">";
				}
				if(str.indexOf("<") != -1) {
					oper = "<";
				}
				if(str.indexOf(">=") != -1) {
					oper = ">=";
				}
				if(str.indexOf("<=") != -1) {
					oper = "<=";
				}
				if(_gthis.isExclude.match(k)) {
					oper = "!=";
					k = HxOverrides.substr(k,1,null);
				} else {
					v = HxOverrides.substr(v,oper.length,null);
				}
				if(oper.length == 0) {
					oper = "=";
				}
				var rule = { };
				if(_gthis.isNumber.match(v)) {
					rule[oper] = parseFloat(v);
				} else {
					rule[oper] = v;
				}
				filter["rules"].push(rule);
				q[k] = filter;
				return;
			} else {
				filter["id"] = _gthis.isExclude.match(str) ? false : true;
				filter["root"] = _gthis.isRoot.match(str);
				if(_gthis.isExclude.match(str)) {
					str = HxOverrides.substr(str,1,null);
				}
				if(_gthis.isRoot.match(str)) {
					str = HxOverrides.substr(str,1,null);
				}
				q[str] = filter;
			}
		};
		var _g = 0;
		var _g1 = token.length;
		while(_g < _g1) {
			var i = _g++;
			process(token[i]);
		}
		return this.q = q;
	}
	,test: function(obj) {
		var qualify = false;
		var _g = 0;
		var _g1 = Reflect.fields(obj);
		while(_g < _g1.length) {
			var k = _g1[_g];
			++_g;
			var v = Std.string(Reflect.field(obj,k));
			if(this.testProperty(k,v)) {
				qualify = true;
			}
		}
		var _g = 0;
		var _g1 = Reflect.fields(obj);
		while(_g < _g1.length) {
			var k = _g1[_g];
			++_g;
			var v = Std.string(Reflect.field(obj,k));
			if(this.testProperty(k,v,true)) {
				qualify = false;
			}
		}
		return qualify;
	}
	,testProperty: function(property,value,exclude) {
		var conds = 0;
		var fails = 0;
		var qualify = 0;
		var testprop = function(expr) {
			conds += 1;
			fails += expr ? 0 : 1;
			return expr;
		};
		if(this.q[value] != null) {
			var v = this.q[value];
			if(v[property] != null) {
				return v[property];
			}
		}
		var _g = 0;
		var _g1 = Reflect.fields(this.q);
		while(_g < _g1.length) {
			var k = _g1[_g];
			++_g;
			var filter = Reflect.field(this.q,k);
			if(filter.rules == null) {
				continue;
			}
			var rules = filter.rules;
			var _g2 = 0;
			while(_g2 < rules.length) {
				var rule = rules[_g2];
				++_g2;
				if(exclude) {
					if(Reflect.field(rule,"!=") != null && testprop((value == null ? "null" : "" + value) == Std.string(Reflect.field(rule,"!="))) && exclude) {
						++qualify;
					}
				} else {
					if(Reflect.field(rule,"*") != null && testprop(parseFloat(value) != null)) {
						++qualify;
					}
					if(Reflect.field(rule,">") != null && testprop(parseFloat(value) > parseFloat(Reflect.field(rule,">")))) {
						++qualify;
					}
					if(Reflect.field(rule,"<") != null && testprop(parseFloat(value) < parseFloat(Reflect.field(rule,"<")))) {
						++qualify;
					}
					if(Reflect.field(rule,">=") != null && testprop(parseFloat(value) >= parseFloat(Reflect.field(rule,">=")))) {
						++qualify;
					}
					if(Reflect.field(rule,"<=") != null && testprop(parseFloat(value) <= parseFloat(Reflect.field(rule,"<=")))) {
						++qualify;
					}
					if(Reflect.field(rule,"=") != null && (testprop(value == Reflect.field(rule,"=")) || testprop(parseFloat(value) == parseFloat(Reflect.field(rule,"="))))) {
						++qualify;
					}
				}
			}
		}
		return qualify > 0;
	}
};
var xrfragment_URI = $hx_exports["xrfragment"]["URI"] = function() { };
xrfragment_URI.__name__ = true;
xrfragment_URI.parse = function(url,filter) {
	var store = { };
	if(url == null || url.indexOf("#") == -1) {
		return store;
	}
	var fragment = url.split("#");
	var splitArray = fragment[1].split("&");
	var _g = 0;
	var _g1 = splitArray.length;
	while(_g < _g1) {
		var i = _g++;
		var splitByEqual = splitArray[i].split("=");
		var regexPlus = new EReg("\\+","g");
		var key = splitByEqual[0];
		var value = "";
		if(splitByEqual.length > 1) {
			var s = regexPlus.split(splitByEqual[1]).join(" ");
			value = decodeURIComponent(s.split("+").join(" "));
		}
		var ok = xrfragment_Parser.parse(key,value,store);
	}
	if(filter != null && filter != 0) {
		var _g = 0;
		var _g1 = Reflect.fields(store);
		while(_g < _g1.length) {
			var key = _g1[_g];
			++_g;
			var xrf = store[key];
			if(!xrf.is(filter)) {
				Reflect.deleteField(store,key);
			}
		}
	}
	return store;
};
var xrfragment_XRF = $hx_exports["xrfragment"]["XRF"] = function(_fragment,_flags) {
	this.fragment = _fragment;
	this.flags = _flags;
};
xrfragment_XRF.__name__ = true;
xrfragment_XRF.set = function(flag,flags) {
	return flags | flag;
};
xrfragment_XRF.unset = function(flag,flags) {
	return flags & ~flag;
};
xrfragment_XRF.prototype = {
	is: function(flag) {
		return (this.flags & flag) != 0;
	}
	,validate: function(value) {
		this.guessType(this,value);
		if(value.split("|").length > 1) {
			this.args = [];
			var args = value.split("|");
			var _g = 0;
			var _g1 = args.length;
			while(_g < _g1) {
				var i = _g++;
				var x = new xrfragment_XRF(this.fragment,this.flags);
				this.guessType(x,args[i]);
				this.args.push(x);
			}
		}
		if(this.fragment == "q") {
			this.query = new xrfragment_Query(value).get();
		}
		var ok = true;
		if(!((this.args) instanceof Array)) {
			if(this.is(xrfragment_XRF.T_VECTOR3) && !(typeof(this.x) == "number" && typeof(this.y) == "number" && typeof(this.z) == "number")) {
				ok = false;
			}
			if(this.is(xrfragment_XRF.T_VECTOR2) && !(typeof(this.x) == "number" && typeof(this.y) == "number")) {
				ok = false;
			}
			var tmp;
			if(this.is(xrfragment_XRF.T_INT)) {
				var v = this.int;
				tmp = !(typeof(v) == "number" && ((v | 0) === v));
			} else {
				tmp = false;
			}
			if(tmp) {
				ok = false;
			}
		}
		return ok;
	}
	,guessType: function(v,str) {
		v.string = str;
		if(str.split(",").length > 1) {
			var xyz = str.split(",");
			if(xyz.length > 0) {
				v.x = parseFloat(xyz[0]);
			}
			if(xyz.length > 1) {
				v.y = parseFloat(xyz[1]);
			}
			if(xyz.length > 2) {
				v.z = parseFloat(xyz[2]);
			}
		}
		if(xrfragment_XRF.isColor.match(str)) {
			v.color = str;
		}
		if(xrfragment_XRF.isFloat.match(str)) {
			v.float = parseFloat(str);
		}
		if(xrfragment_XRF.isInt.match(str)) {
			v.int = Std.parseInt(str);
		}
	}
};
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
String.__name__ = true;
Array.__name__ = true;
js_Boot.__toStr = ({ }).toString;
xrfragment_Parser.error = "";
xrfragment_Parser.debug = false;
xrfragment_XRF.ASSET = 1;
xrfragment_XRF.PROP_BIND = 2;
xrfragment_XRF.QUERY_OPERATOR = 4;
xrfragment_XRF.PROMPT = 8;
xrfragment_XRF.ROUNDROBIN = 16;
xrfragment_XRF.NAVIGATOR = 32;
xrfragment_XRF.METADATA = 64;
xrfragment_XRF.PV_OVERRIDE = 128;
xrfragment_XRF.PV_EXECUTE = 256;
xrfragment_XRF.T_COLOR = 8192;
xrfragment_XRF.T_INT = 16384;
xrfragment_XRF.T_FLOAT = 32768;
xrfragment_XRF.T_VECTOR2 = 65536;
xrfragment_XRF.T_VECTOR3 = 131072;
xrfragment_XRF.T_URL = 262144;
xrfragment_XRF.T_PREDEFINED_VIEW = 524288;
xrfragment_XRF.T_STRING = 1048576;
xrfragment_XRF.T_STRING_OBJ = 2097152;
xrfragment_XRF.T_STRING_OBJ_PROP = 4194304;
xrfragment_XRF.isColor = new EReg("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$","");
xrfragment_XRF.isInt = new EReg("^[0-9]+$","");
xrfragment_XRF.isFloat = new EReg("^[0-9]+\\.[0-9]+$","");
xrfragment_XRF.isVector = new EReg("([,]+|\\w)","");
xrfragment_XRF.isUrl = new EReg("(://)?\\..*","");
xrfragment_XRF.isUrlOrPretypedView = new EReg("(^#|://)?\\..*","");
xrfragment_XRF.isString = new EReg(".*","");
})({});
var xrfragment = $hx_exports["xrfragment"];
// SPDX-License-Identifier: MPL-2.0        
// Copyright (c) 2023 Leon van Kammen/NLNET 

var xrf = {}

xrf.init = function(opts){
  opts = opts || {}
  xrf.Parser.debug = xrf.debug 
  for ( let i in opts    ) xrf[i] = opts[i]
  xrf.emit('init',opts)
  return xrf
}

xrf.query = function(){
  // framework implementations can override this function, see src/3rd/js/three/index.sj 
  alert("queries are not implemented (yet) for this particular framework")
}

xrf.roundrobin = (frag, store) => {
  if( !frag.args || frag.args.length == 0 ) return 0
  if( !store.rr                 ) store.rr = {}
  let label = frag.fragment
  if( store.rr[label] ) return store.rr[label].next()
  store.rr[label] = frag.args
  store.rr[label].next  = () => {
    store.rr[label].index = (store.rr[label].index + 1) % store.rr[label].length 
    return store.rr[label].index
  }
  return store.rr[label].index = 0
}

xrf.hasTag = (tag,tags) => String(tags).match( new RegExp(`(^| )${tag}( |$)`,`g`) )

// map library functions to xrf
for ( let i in xrfragment ) xrf[i] = xrfragment[i] 
/* 
 * (promise-able) EVENTS
 *
 * example:
 *
 *  xrf.addEventListener('foo',(e) => {
 *    // let promise = e.promise()   
 *    console.log("navigating to: "+e.detail.destination.url)
 *    // promise.resolve()
 *    // promise.reject("not going to happen")
 *  })
 *
 *  xrf.emit('foo',123)
 *  xrf.emit('foo',123).then(...).catch(...).finally(...)
 */

xrf.addEventListener = function(eventName, callback) {
    if( !this._listeners ) this._listeners = []
    if (!this._listeners[eventName]) {
        // create a new array for this event name if it doesn't exist yet
        this._listeners[eventName] = [];
    }
    // add the callback to the listeners array for this event name
    this._listeners[eventName].push(callback);
};

xrf.emit = function(eventName, data){
  if( typeof data != 'object' ) throw 'emit() requires passing objects'
  return xrf.emit.promise(eventName,data)
}

xrf.emit.normal = function(eventName, data) {
    if( !xrf._listeners ) xrf._listeners = []
    var callbacks = xrf._listeners[eventName]
    if (callbacks) {
        for (var i = 0; i < callbacks.length; i++) {
            callbacks[i](data);
        }
    }
};

xrf.emit.promise = function(e, opts){ 
  opts.XRF = xrf // always pass root XRF obj
  return new Promise( (resolve, reject) => {
    opts.promise = () => {
      opts.promise.halted = true
      return { resolve, reject }
    }
    xrf.emit.normal(e, opts)     
    delete opts.XRF
    if( !opts.promise.halted ) resolve()
    delete opts.promise
  })
}
/*! rasterizeHTML.js - v1.3.1 - 2023-07-06
* http://www.github.com/cburgmer/rasterizeHTML.js
* Copyright (c) 2023 Christoph Burgmer; Licensed MIT */

!function(o,i){void 0===o&&void 0!==window&&(o=window),"function"==typeof define&&define.amd?define(["url","xmlserializer","sane-domparser-error","inlineresources"],function(e,t,n,r){return o.rasterizeHTML=i(e,t,n,r)}):"object"==typeof module&&module.exports?module.exports=i(require("url"),require("xmlserializer"),require("sane-domparser-error"),require("inlineresources")):o.rasterizeHTML=i(o.url,o.xmlserializer,o.sanedomparsererror,o.inlineresources)}(this,function(e,t,n,r){var o=function(n){"use strict";var o={},t=[];o.joinUrl=function(e,t){return e?n.resolve(e,t):t},o.getConstantUniqueIdFor=function(e){return t.indexOf(e)<0&&t.push(e),t.indexOf(e)},o.clone=function(e){var t,n={};for(t in e)e.hasOwnProperty(t)&&(n[t]=e[t]);return n};return o.parseOptionalParameters=function(e){var t,n,r={canvas:null,options:{}};return null==e[0]||(t=e[0],"object"==typeof(n=t)&&null!==n&&Object.prototype.toString.apply(t).match(/\[object (Canvas|HTMLCanvasElement)\]/i))?(r.canvas=e[0]||null,r.options=o.clone(e[1])):r.options=o.clone(e[0]),r},o}(e),i=function(i){"use strict";function u(e,t,n){var r=e[t];return e[t]=function(){var e=Array.prototype.slice.call(arguments);return n.apply(this,[e,r])},r}var e={};return e.baseUrlRespectingXhr=function(t,o){return function(){var e=new t;return u(e,"open",function(e,t){var n=e.shift(),r=e.shift(),r=i.joinUrl(o,r);return t.apply(this,[n,r].concat(e))}),e}},e.finishNotifyingXhr=function(t){function e(){var e=new t;return u(e,"send",function(e,t){return r+=1,t.apply(this,arguments)}),e.addEventListener("load",function(){o+=1,n()}),e}var n,r=0,o=0,i=!1,c=new Promise(function(e){n=function(){r-o<=0&&i&&e({totalCount:r})}});return e.waitForRequestsToFinish=function(){return i=!0,n(),c},e},e}(o),e=function(i){"use strict";function r(e){return Array.prototype.slice.call(e)}var e={},c={active:!0,hover:!0,focus:!1,target:!1};return e.fakeUserAction=function(e,t,n){var r=e.querySelector(t),o=":"+n,t="rasterizehtml"+n;r&&(c[n]?i.addClassNameRecursively(r,t):i.addClassName(r,t),i.rewriteCssSelectorWith(e,o,"."+t))},e.persistInputValues=function(e){function t(e){return"checkbox"===e.type||"radio"===e.type}var n=e.querySelectorAll("input"),e=e.querySelectorAll("textarea");r(n).filter(t).forEach(function(e){e.checked?e.setAttribute("checked",""):e.removeAttribute("checked")}),r(n).filter(function(e){return!t(e)}).forEach(function(e){e.setAttribute("value",e.value)}),r(e).forEach(function(e){e.textContent=e.value})},e.rewriteTagNameSelectorsToLowerCase=function(e){i.lowercaseCssTypeSelectors(e,i.findHtmlOnlyNodeNames(e))},e}(function(){"use strict";function c(e){return Array.prototype.slice.call(e)}var n={};n.addClassName=function(e,t){e.className+=" "+t},n.addClassNameRecursively=function(e,t){n.addClassName(e,t),e.parentNode!==e.ownerDocument&&n.addClassNameRecursively(e.parentNode,t)};function r(e,t,o){var i="((?:^|[^.#:\\w])|(?=\\W))("+t.join("|")+")(?=\\W|$)";c(e.querySelectorAll("style")).forEach(function(e){var t,n;void 0===e.sheet&&(t=e,n=document.implementation.createHTMLDocument(""),(r=document.createElement("style")).textContent=t.textContent,n.body.appendChild(r),t.sheet=r.sheet);var r=c(e.sheet.cssRules).filter(function(e){return e.selectorText&&new RegExp(i,"i").test(e.selectorText)});r.length&&(r.forEach(function(e){var t,n=e.selectorText.replace(new RegExp(i,"gi"),function(e,t,n){return t+o(n)});n!==e.selectorText&&(t=n,e=(n=e).cssText.replace(/^[^\{]+/,""),u(n,t+" "+e))}),e.textContent=a(e.sheet.cssRules))})}var u=function(e,t){var n=e.parentStyleSheet,e=c(n.cssRules).indexOf(e);n.insertRule(t,e+1),n.deleteRule(e)},a=function(e){return c(e).reduce(function(e,t){return e+t.cssText},"")};return n.rewriteCssSelectorWith=function(e,t,n){r(e,[t],function(){return n})},n.lowercaseCssTypeSelectors=function(e,t){r(e,t,function(e){return e.toLowerCase()})},n.findHtmlOnlyNodeNames=function(e){for(var t,n=e.ownerDocument.createTreeWalker(e,NodeFilter.SHOW_ELEMENT),r={},o={};t=n.currentNode.tagName.toLowerCase(),"http://www.w3.org/1999/xhtml"===n.currentNode.namespaceURI?r[t]=!0:o[t]=!0,n.nextNode(););return Object.keys(r).filter(function(e){return!o[e]})},n}()),i=function(a,f,t,m){"use strict";var e={};e.executeJavascript=function(s,l){return new Promise(function(t){function n(){m.document.getElementsByTagName("body")[0].removeChild(r)}function e(){var e=r.contentDocument;t({document:e,errors:i,cleanUp:n})}var r=function(e,t,n,r){t=e.createElement(t);return t.style.visibility="hidden",t.style.width=n+"px",t.style.height=r+"px",t.style.position="absolute",t.style.top=-1e4-r+"px",t.style.left=-1e4-n+"px",e.getElementsByTagName("body")[0].appendChild(t),t}(m.document,"iframe",l.width,l.height),o=s.outerHTML,i=[],c=l.executeJsTimeout||0,u=r.contentWindow.XMLHttpRequest,a=f.finishNotifyingXhr(u),u=f.baseUrlRespectingXhr(a,l.baseUrl);r.onload=function(){var t;(0<(t=c)?new Promise(function(e){setTimeout(e,t)}):Promise.resolve()).then(a.waitForRequestsToFinish).then(e)},r.contentDocument.open(),r.contentWindow.XMLHttpRequest=u,r.contentWindow.onerror=function(e){i.push({resourceType:"scriptExecution",msg:e})},r.contentDocument.write("<!DOCTYPE html>"),r.contentDocument.write(o),r.contentDocument.close()})};function s(e,t,n,r,o){var i,c,u,a=Math.max(e.scrollWidth,e.clientWidth),s=Math.max(e.scrollHeight,e.clientHeight),l=t?(i=(l=function(e,t){var n=e.querySelector(t);if(n)return n;if(e.ownerDocument.querySelector(t)===e)return e;throw{message:"Clipping selector not found"}}(e,t).getBoundingClientRect()).top,c=l.left,u=l.width,l.height):(c=i=0,u=a,s);return l={width:u,height:l},r=r,o=o,r={width:Math.max(l.width*o,n),height:Math.max(l.height*o,r)},e=m.getComputedStyle(e.ownerDocument.documentElement).fontSize,{left:c,top:i,width:r.width,height:r.height,viewportWidth:a,viewportHeight:s,rootFontSize:e}}e.calculateDocumentContentSize=function(c,u){return new Promise(function(n,r){var e,t,o=u.zoom||1,i=function(e,t,n){e=Math.floor(e/n),n=Math.floor(t/n);return function(e,t,n){e=e.createElement("iframe");return e.style.width=t+"px",e.style.height=n+"px",e.style.visibility="hidden",e.style.position="absolute",e.style.top=-1e4-n+"px",e.style.left=-1e4-t+"px",e.style.borderWidth=0,e.sandbox="allow-same-origin",e.scrolling="no",e}(m.document,e,n)}(u.width,u.height,o);m.document.getElementsByTagName("body")[0].appendChild(i),i.onload=function(){var e,t=i.contentDocument;try{e=s(function(e,t){e=e.tagName;return t.querySelector(e)}(c,t),u.clip,u.width,u.height,o),n(e)}catch(e){r(e)}finally{m.document.getElementsByTagName("body")[0].removeChild(i)}},i.contentDocument.open(),i.contentDocument.write("<!DOCTYPE html>"),i.contentDocument.write("html"===(t=(e=c).tagName.toLowerCase())||"body"===t?e.outerHTML:'<body style="margin: 0;">'+e.outerHTML+"</body>"),i.contentDocument.close()})},e.parseHtmlFragment=function(e){var t=m.document.implementation.createHTMLDocument("");t.documentElement.innerHTML=e;t=t.querySelector("body").firstChild;if(!t)throw"Invalid source";return t};e.parseHTML=function(e){var t=m.document.implementation.createHTMLDocument("");return t.documentElement.innerHTML=e,function(e,t){var n,r,o,i=/<html((?:\s+[^>]*)?)>/im.exec(t),t=m.document.implementation.createHTMLDocument("");if(i)for(i="<div"+i[1]+"></div>",t.documentElement.innerHTML=i,r=t.querySelector("div"),n=0;n<r.attributes.length;n++)o=r.attributes[n],e.documentElement.setAttribute(o.name,o.value)}(t,e),t};function n(e){try{return t.failOnParseError(e)}catch(e){throw{message:"Invalid source",originalError:e}}}e.validateXHTML=function(e){e=(new DOMParser).parseFromString(e,"application/xml");n(e)};function r(c,u){return new Promise(function(e,t){function n(e){t({message:"Unable to load page",originalError:e})}var r=new window.XMLHttpRequest,o=a.joinUrl(u.baseUrl,c),i=(i=o,"none"===(o=u.cache)||"repeated"===o?i+"?_="+(l=null===l||"repeated"!==o?Date.now():l):i);r.addEventListener("load",function(){200===r.status||0===r.status?e(r.responseXML):n(r.statusText)},!1),r.addEventListener("error",function(e){n(e)},!1);try{r.open("GET",i,!0),r.responseType="document",r.send(null)}catch(e){n(e)}})}var l=null;return e.loadDocument=function(e,t){return r(e,t).then(n)},e}(o,i,n,window),n=function(r){"use strict";function o(e,t){return t?URL.createObjectURL(new Blob([e],{type:"image/svg+xml"})):"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(e)}function c(e){e instanceof Blob&&URL.revokeObjectURL(e)}function i(o){return new Promise(function(t,e){var n=document.createElement("canvas"),r=new Image;r.onload=function(){var e=n.getContext("2d");try{e.drawImage(r,0,0),n.toDataURL("image/png"),t(!0)}catch(e){t(!1)}},r.onerror=e,r.src=o})}function u(t){return(e=void 0===e?n():e).then(function(e){return o(t,e)})}var e,t={},a='<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><foreignObject></foreignObject></svg>',n=function(){return new Promise(function(t,e){var n;(function(){if(r.Blob)try{return new Blob(["<b></b>"],{type:"text/xml"}),!0}catch(e){}return!1})()&&r.URL?(n=o(a,!0),i(n).then(function(e){return c(n),!e&&i(o(a,!1)).then(function(e){return e})},function(){return!1}).then(function(e){t(!e)},function(){e()})):t(!1)})};return t.renderSvg=function(i){return new Promise(function(e,t){function n(){r&&c(r)}var r,o=new Image;o.onload=function(){o.onload=null,o.onerror=null,n(),e(o)},o.onerror=function(){n(),t()},u(i).then(function(e){r=e,o.src=r},t)})},t}(window);return function(o,i,c){"use strict";var u={};u.drawDocument=function(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1),n=o.parseOptionalParameters(t),r=e.documentElement||e;return c.rasterize(r,n.canvas,(e=(t=n).canvas,r=t.options,n=e?e.width:300,e=e?e.height:200,e={width:void 0!==r.width?r.width:n,height:void 0!==r.height?r.height:e},(t=o.clone(t.options)).width=e.width,t.height=e.height,t))};u.drawHTML=function(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1),t=o.parseOptionalParameters(t);return function(e,t,n){e=i.parseHTML(e);return u.drawDocument(e,t,n)}(e,t.canvas,t.options)};function n(t,n,r){return i.loadDocument(t,r).then(function(e){e=function(e,t,n){var r=document.implementation.createHTMLDocument("");r.replaceChild(e.documentElement,r.documentElement);e=n?o.clone(n):{};return n.baseUrl||(e.baseUrl=t),{document:r,options:e}}(e,t,r);return u.drawDocument(e.document,n,e.options)})}return u.drawURL=function(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1),t=o.parseOptionalParameters(t);return n(e,t.canvas,t.options)},u}(o,i,function(o,i,c,r,e,u){"use strict";function a(t){return e.renderSvg(t).then(function(e){return{image:e,svg:t}},function(e){throw l(e)})}function s(e,t,n){return r.drawDocumentAsSvg(e,n).then(a).then(function(e){return t&&function(e,t){try{t.getContext("2d").drawImage(e,0,0)}catch(e){throw l(e)}}(e.image,t),e})}var t={},l=function(e){return{message:"Error rendering page",originalError:e}};return t.rasterize=function(e,n,r){var t=o.clone(r);return t.inlineScripts=!0===r.executeJs,u.inlineReferences(e,t).then(function(t){return r.executeJs?i.executeJavascript(e,r).then(function(e){var t=e.document;return c.persistInputValues(t),{document:t,errors:e.errors,cleanUp:e.cleanUp}}).then(function(e){return{element:e.document.documentElement,errors:t.concat(e.errors),cleanUp:e.cleanUp}}):{element:e,errors:t,cleanUp:function(){}}}).then(function(t){return s(t.element,n,r).then(function(e){return t.cleanUp(),{image:e.image,svg:e.svg,errors:t.errors}})})},t}(o,i,e,function(c,r,u){"use strict";function a(t){var e=Object.keys(t);return e.length?" "+e.map(function(e){return e+'="'+t[e]+'"'}).join(" "):""}function o(e,t,n){var r,o,i=u.serializeToString(e);return c.validateXHTML(i),(e=(r=t,o=Math.round(r.viewportWidth),e=Math.round(r.viewportHeight),{x:-r.left,y:-r.top,width:o,height:e})).style=(e.style||"")+"float: left;",e.externalResourcesRequired=!0,'<svg xmlns="http://www.w3.org/2000/svg"'+a(function(e,t){t=t||1,e={width:e.width,height:e.height,"font-size":e.rootFontSize};return 1!==t&&(e.style="transform:scale("+t+"); transform-origin: 0 0;"),e}(t,n))+'><style scoped="">html::-webkit-scrollbar { display: none; }</style><foreignObject'+a(e)+">"+i+"</foreignObject></svg>"}var i={};return i.getSvgForDocument=function(e,t,n){return r.rewriteTagNameSelectorsToLowerCase(e),o(e,t,n)},i.drawDocumentAsSvg=function(t,n){return["hover","active","focus","target"].forEach(function(e){n[e]&&r.fakeUserAction(t,n[e],e)}),c.calculateDocumentContentSize(t,n).then(function(e){return i.getSvgForDocument(t,e,n.zoom)})},i}(i,e,t),n,r))});// the XRWG (XR WordGraph)is mentioned in the spec 
//
// it collects metadata-keys ('foo' e.g.), names and tags across 3D scene-nodes (.userData.foo e.g.) 

let XRWG = xrf.XRWG = []

XRWG.word = (key) => XRWG.find( (w) => w.word == word )

XRWG.cleankey = (word) => String(word).replace(/[^0-9\.a-zA-Z_]/g,'')
                                      .toLowerCase()
                                      .replace(/.*:\/\//,'')
XRWG.get = (v,k) => XRWG.find( (x) => x[ k || 'word'] == v )

XRWG.match = (str,types,level) => {
  level = level || 1000
  types = types || []
  let res = XRWG.filter( (n) => {
    types.map( (type) => n[type] ? n = false : false )
    return n
  })
  str = str.toLowerCase()
  if( level <10 ) res = res.filter( (n) => n.key    == str )
  if( level <20 ) res = res.filter( (n) => n.word   == str   || n.key == str )
  if( level <30 ) res = res.filter( (n) => n.word.match(str) || n.key == str )
  if( level <40 ) res = res.filter( (n) => n.word.match(str) || n.key == str || String(n.value||'').match(str) )
  if( level <1001 ) res = res.filter( (n) => n.word.match(str) != null || n.key.match(str) != null || String(n.value||'').match(str) != null)
  return res
}

XRWG.generate = (opts) => {
  let {scene,model} = opts
  XRWG.slice(0,0) // empty  
    
  // collect words from 3d nodes

  let add = (key, spatialNode, type) => {
    if( !key || key.match(/(^#$|name)/) ) return
    let node = XRWG.get( XRWG.cleankey(key) )
    if( node ){
      node.nodes.push(spatialNode)
    }else{
      node = { word: XRWG.cleankey(key), key, nodes:[spatialNode] }
      if( spatialNode.userData[key] ) node.value = spatialNode.userData[key]
      node[type] = true
      xrf.emit('XRWG',node)
      XRWG.push( node )
    }
  }

  scene.traverse( (o) => {
    add( `#${o.name}`, o, 'name')
    for( let k in o.userData ){
      if( k == 'tag' ){
        let tagArr = o.userData.tag.split(" ")
                      .map(    (t) => t.trim() )
                      .filter( (t) => t )
                      .map(    (w) => add( w, o, 'tag') )
      }else if( k.match(/^(href|src)$/) ) add( o.userData[k], o, k)
      else if( k[0] == '#' ) add( k, o , 'pv')
      else add( k, o , 'query')
    }
  }) 

  // sort by n
  XRWG.sort( (a,b) => a.nodes.length - b.nodes.length )
  XRWG = XRWG.reverse() // the cleankey/get functions e.g. will persist
  console.dir(XRWG)
}
// the hashbus (QueryString eventBus) is mentioned in the spec 
//
// it allows metadata-keys ('foo' e.g.) of 3D scene-nodes (.userData.foo e.g.) to 
// react by executing code 

let pub = function( url, model, flags ){  // evaluate fragments in url
  if( !url ) return 
  if( !url.match(/#/) ) url = `#${url}`
  model = model || xrf.model
  let { THREE, camera } = xrf
  let frag = xrf.URI.parse( url, flags != undefined ? flags : xrf.XRF.NAVIGATOR )
  let opts = {frag, mesh:xrf.camera, model, camera: xrf.camera, scene: xrf.scene, renderer: xrf.renderer, THREE: xrf.THREE, hashbus: xrf.hashbus }
  xrf.emit('hashbus',opts)
  .then( () => {
    for ( let k in frag ){
      pub.fragment(k,opts) 
    }
  })
  return frag
}

pub.mesh     = (mesh,model) => { // evaluate embedded fragments (metadata) inside mesh of model 
  if( mesh.userData ){
    let frag = {}
    for( let k in mesh.userData ) xrf.Parser.parse( k, mesh.userData[k], frag )
    for( let k in frag ){
      let opts = {frag, mesh, model, camera: xrf.camera, scene: model.scene, renderer: xrf.renderer, THREE: xrf.THREE, hashbus: xrf.hashbus }
      mesh.userData.XRF = frag // allow fragment impl to access XRF obj already
      xrf.emit('mesh',opts)
      .then( () => pub.fragment(k,opts) )
    }
  }
}

pub.fragment = (k, opts ) => { // evaluate one fragment
  let frag = opts.frag[k];

  // call native function (xrf/env.js e.g.), or pass it to user decorator
  xrf.emit(k,opts)
  .then( () => {
    let func = xrf.frag[k] || function(){} 
    if(  xrf[k] ) xrf[k]( func, frag, opts)
    else                  func( frag, opts)
  })
}

xrf.hashbus = { pub }
xrf.frag   = {}
xrf.model  = {}

xrf.init = ((init) => function(opts){
  let scene = new opts.THREE.Group()
  opts.scene.add(scene)
  opts.scene = scene
  init(opts)
  if( opts.loaders ) Object.values(opts.loaders).map( xrf.patchLoader )

  xrf.patchRenderer(opts.renderer)
  xrf.navigator.init()
  // return xrfragment lib as 'xrf' query functor (like jquery)
  for ( let i in xrf ) xrf.query[i] = xrf[i] 
  return xrf.query
})(xrf.init)

xrf.patchRenderer = function(renderer){
  renderer.xr.addEventListener( 'sessionstart', () => xrf.baseReferenceSpace = renderer.xr.getReferenceSpace() );
  renderer.xr.enabled = true;
  renderer.render = ((render) => function(scene,camera){
    if( xrf.model && xrf.model.render ) 
      xrf.model.render(scene,camera)
    render(scene,camera)
  })(renderer.render.bind(renderer))
}

xrf.patchLoader = function(loader){
  if( loader.prototype.load.xrf_patched ) return // prevent patching aliased loaders twice
  loader.prototype.load = ((load) => function(url, onLoad, onProgress, onError){
    load.call(  this,
                url,
                (model) => { 
                  onLoad(model); 
                  xrf.parseModel(model,url) 
                },
                onProgress,
                onError)
  })(loader.prototype.load)
  loader.prototype.load.xrf_patched = true
}

xrf.getFile = (url) => url.split("/").pop().replace(/#.*/,'')

xrf.parseModel = function(model,url){
  let file               = xrf.getFile(url)
  model.file             = file
  // eval embedded XR fragments
  model.scene.traverse( (mesh) => xrf.hashbus.pub.mesh(mesh,model) )
  // add animations
  model.clock            = new xrf.THREE.Clock();
  model.mixer            = new xrf.THREE.AnimationMixer(model.scene)
  model.animations.map( (anim) => { 
    anim.action = model.mixer.clipAction( anim )
    //anim.action.setLoop(0)
    anim.action.play() 
  })

  let tmp = new xrf.THREE.Vector3()
  model.render           = function(){
    let time = model.clock.getDelta()
    model.mixer.update( time )

    // update focusline 
    xrf.focusLine.material.color.r  = (1.0 + Math.sin( model.clock.getElapsedTime()*10  ))/2
    xrf.focusLine.material.dashSize = 0.2 + 0.02*Math.sin( model.clock.getElapsedTime()  )
    xrf.focusLine.material.gapSize  = 0.1 + 0.02*Math.sin( model.clock.getElapsedTime() *3  )
    xrf.focusLine.material.opacity  = (0.25 + 0.15*Math.sin( model.clock.getElapsedTime() * 3 )) * xrf.focusLine.opacity;
    if( xrf.focusLine.opacity > 0.0 ) xrf.focusLine.opacity -= time*0.2
    if( xrf.focusLine.opacity < 0.0 ) xrf.focusLine.opacity = 0
  }

}

xrf.getLastModel = ()           => xrf.model.last 

xrf.reset = () => {
  const disposeObject = (obj) => {
    if (obj.children.length > 0) obj.children.forEach((child) => disposeObject(child));
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (obj.material.map) obj.material.map.dispose();
      obj.material.dispose();
    }
    obj.clear()
    obj.removeFromParent() 
    return true
  };
  let nodes = []
  xrf.scene.traverse( (child) => child.isXRF ? nodes.push(child) : false )
  nodes.map( disposeObject ) // leave non-XRF objects intact
  xrf.interactive = xrf.InteractiveGroup( xrf.THREE, xrf.renderer, xrf.camera)
  xrf.add( xrf.interactive )
  xrf.layers = 0
}

xrf.parseUrl = (url) => {
  const urlObj = new URL( url.match(/:\/\//) ? url : String(`https://fake.com/${url}`).replace(/\/\//,'/') )
  let   dir  = url.substring(0, url.lastIndexOf('/') + 1)
  const file = urlObj.pathname.substring(urlObj.pathname.lastIndexOf('/') + 1);
  const hash = url.match(/#/) ? url.replace(/.*#/,'') : ''
  const ext  = file.split('.').pop()
  return {urlObj,dir,file,hash,ext}
}

xrf.add = (object) => {
  object.isXRF = true // mark for easy deletion when replacing scene
  xrf.scene.add(object)
}

// wrapper to survive in/outside modules

xrf.InteractiveGroup = function(THREE,renderer,camera){

  let {
    Group,
    Matrix4,
    Raycaster,
    Vector2
  } = THREE 

  const _pointer = new Vector2();
  const _event = { type: '', data: _pointer };
  let object   = {selected:false}

  class InteractiveGroup extends Group {

    constructor( renderer, camera ) {

      super();

      if( !renderer || !camera ) return 

      // extract camera when camera-rig is passed
      camera.traverse( (n) =>  String(n.type).match(/Camera/) ? camera = n : null )

      const scope = this;
      scope.objects = []

      const raycaster = new Raycaster();
      const tempMatrix = new Matrix4();

      // Pointer Events

      const element = renderer.domElement;

      function onPointerEvent( event ) {

        //event.stopPropagation();

        const rect = renderer.domElement.getBoundingClientRect();

        _pointer.x = ( event.clientX - rect.left ) / rect.width * 2 - 1;
        _pointer.y = - ( event.clientY - rect.top ) / rect.height * 2 + 1;

        raycaster.setFromCamera( _pointer, camera );

        const intersects = raycaster.intersectObjects( scope.objects, false );

        if ( intersects.length > 0 ) {

          const intersection = intersects[ 0 ];

          object = intersection.object;
          const uv = intersection.uv;

          _event.type = event.type;
          _event.data.set( uv.x, 1 - uv.y );
          object.dispatchEvent( _event );

        }else{
          if( object.selected ) {
            _event.type = 'mouseleave'
            object.dispatchEvent(_event)
          }
        }

      }

      element.addEventListener( 'pointerdown', onPointerEvent );
      element.addEventListener( 'pointerup', onPointerEvent );
      element.addEventListener( 'pointermove', onPointerEvent );
      element.addEventListener( 'mousedown', onPointerEvent );
      element.addEventListener( 'mouseup', onPointerEvent );
      element.addEventListener( 'mousemove', onPointerEvent );
      element.addEventListener( 'click', onPointerEvent );

      // WebXR Controller Events
      // TODO: Dispatch pointerevents too

      const events = {
        'move': 'mousemove',
        'select': 'click',
        'selectstart': 'mousedown',
        'selectend': 'mouseup'
      };

      function onXRControllerEvent( event ) {

        const controller = event.target;

        tempMatrix.identity().extractRotation( controller.matrixWorld );

        raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
        raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );

        const intersections = raycaster.intersectObjects( scope.objects, false );

        if ( intersections.length > 0 ) {

          const intersection = intersections[ 0 ];

          object = intersection.object;
          const uv = intersection.uv;

          _event.type = events[ event.type ];
          _event.data.set( uv.x, 1 - uv.y );

          object.dispatchEvent( _event );

        }else{
          if( object.selected ) {
            _event.type = 'mouseleave'
            object.dispatchEvent(_event)
          }
        }

      }

      const controller1 = renderer.xr.getController( 0 );
      controller1.addEventListener( 'move', onXRControllerEvent );
      controller1.addEventListener( 'select', onXRControllerEvent );
      controller1.addEventListener( 'selectstart', onXRControllerEvent );
      controller1.addEventListener( 'selectend', onXRControllerEvent );

      const controller2 = renderer.xr.getController( 1 );
      controller2.addEventListener( 'move', onXRControllerEvent );
      controller2.addEventListener( 'select', onXRControllerEvent );
      controller2.addEventListener( 'selectstart', onXRControllerEvent );
      controller2.addEventListener( 'selectend', onXRControllerEvent );

    }

    add(obj){
      Group.prototype.add.call( this, obj )
      this.objects = ([]).concat( this.children )
    }

  }

  return new InteractiveGroup(renderer,camera)
}
xrf.navigator = {}

xrf.navigator.to = (url,flags,loader,data) => {
  if( !url ) throw 'xrf.navigator.to(..) no url given'

  let hashbus = xrf.hashbus

  return new Promise( (resolve,reject) => {
    let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)
    if( !file || (!data && xrf.model.file == file) ){ // we're already loaded
      hashbus.pub( url, xrf.model, flags )    // and eval local URI XR fragments 
      xrf.navigator.updateHash(hash)
      return resolve(xrf.model) 
    }

    if( xrf.model && xrf.model.scene ) xrf.model.scene.visible = false
    if( !loader ){  
      const Loader = xrf.loaders[ext]
      if( !Loader ) throw 'xrfragment: no loader passed to xrfragment for extension .'+ext 
      loader = loader || new Loader().setPath( dir )
    }

    // force relative path 
    if( dir ) dir = dir[0] == '.' ? dir : `.${dir}`
    url = url.replace(dir,"")
    loader = loader || new Loader().setPath( dir )
    const onLoad = (model) => {
      xrf.reset() // clear xrf objects from scene
      model.file = file
      // only change url when loading *another* file
      if( xrf.model ) xrf.navigator.pushState( `${dir}${file}`, hash )
      xrf.model = model 
      // spec: 1. generate the XRWG
      xrf.XRWG.generate({model,scene:model.scene})
      // spec: 1. execute the default predefined view '#' (if exist) (https://xrfragment.org/#predefined_view)
      xrf.frag.defaultPredefinedView({model,scene:model.scene})
      // spec: 2. init metadata
      let frag = hashbus.pub( url, model )           // and eval URI XR fragments 
      // spec: predefined view(s) from URL (https://xrfragment.org/#predefined_view)
      setTimeout( () => { // give external objects some slack 
        xrf.frag.updatePredefinedView({model,scene:model.scene,frag})
      },2000)
      xrf.add( model.scene )
      xrf.navigator.updateHash(hash)
      resolve(model)
    }

    if( data ) loader.parse(data, "", onLoad )
    else       loader.load(url, onLoad )
  })
}

xrf.navigator.init = () => {
  if( xrf.navigator.init.inited ) return

  window.addEventListener('popstate', function (event){
    xrf.navigator.to( document.location.search.substr(1) + document.location.hash )
  })
  
  window.addEventListener('hashchange', function (e){
    xrf.emit('hash', {hash: document.location.hash })
  })

  // this allows selectionlines to be updated according to the camera (renderloop)
  xrf.focusLine = new xrf.THREE.Group()
  xrf.focusLine.material = new xrf.THREE.LineDashedMaterial({color:0xFF00FF,linewidth:3, scale: 1, dashSize: 0.2, gapSize: 0.1,opacity:0.3, transparent:true})
  xrf.focusLine.isXRF = true
  xrf.focusLine.position.set(0,0,-0.5);
  xrf.focusLine.points = []
  xrf.focusLine.lines  = []
  xrf.camera.add(xrf.focusLine)

  xrf.navigator.init.inited = true
}

xrf.navigator.updateHash = (hash,opts) => {
  if( hash.replace(/^#/,'') == document.location.hash.substr(1) || hash.match(/\|/) ) return  // skip unnecesary pushState triggers
  console.log(`URL: ${document.location.search.substr(1)}#${hash}`)
  document.location.hash = hash
  xrf.emit('hash', {...opts, hash: `#${hash}` })
}

xrf.navigator.pushState = (file,hash) => {
  if( file == document.location.search.substr(1) ) return // page is in its default state
  window.history.pushState({},`${file}#${hash}`, document.location.pathname + `?${file}#${hash}` )
  xrf.emit('pushState', {file, hash} )
}
xrf.addEventListener('bg', (opts) => {
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  console.log("└ bg "+v.x+","+v.y+","+v.z);
  if( scene.background ) delete scene.background
  scene.background = new THREE.Color( v.x, v.y, v.z )
})
xrf.addEventListener('env', (opts) => {
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  if( frag.env && !scene.environment ){
    let env = scene.getObjectByName(frag.env.string)
    if( !env ) env = xrf.scene.getObjectByName(frag.env.string) // repurpose from parent scene
    if( !env ) return console.warn("xrf.env "+frag.env.string+" not found")
    env.material.map.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = env.material.map
    //scene.texture = env.material.map    
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 2;
    console.log(`   └ applied image '${frag.env.string}' as environment map`)
  }

})
xrf.addEventListener('fog', (opts) => {
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  let v = frag.fog
  console.log("└ fog "+v.x+","+v.y);
  if( v.x == 0 && v.y == 0 ){  
    if( scene.fog ) delete scene.fog
    scene.fog = null;
  }else scene.fog = new THREE.Fog( scene.background, v.x, v.y );
})
xrf.macros = {}

xrf.addEventListener('mesh', (opts) => {
  let { frag, mesh, model, camera, scene, renderer, THREE, hashbus} = opts

  for( let k in frag ){
    let id = mesh.name+"_"+k
    let fragment = frag[k]

    if( k.match(/^!/) ){
      if( mesh.material) mesh.material = mesh.material.clone()
      if( mesh.isSRC || scene.isSRC ) return; // dont allow recursion for now

      if( xrf.macros[k] ) return // already initialized  

      console.log("└ initing xrmacro: "+k)
      xrf.macros[k] = fragment
      fragment.args = fragment.string.split("|")

      fragment.trigger = (e) => {
        xrf
        .emit('macro',{click:true,mesh,xrf:frag}) // let all listeners agree
        .then( () => {
              rrFrag = fragment.args[ xrf.roundrobin( fragment,model) ]
              console.log("└ xrmacro: "+rrFrag)
              if( xrf.macros[ rrFrag ] ){
                xrf.macros[ rrFrag ].trigger()
              } else {
                xrf.navigator.to( rrFrag,null,0)
              }
        }) 
      }

      let selected = (state) => () => {
        if( mesh.selected == state ) return // nothing changed 
        if( mesh.material ){
          if( mesh.material.uniforms ) mesh.material.uniforms.selected.value = state 
          else mesh.material.color.r = mesh.material.color.g = mesh.material.color.b = state ? 2.0 : 1.0
        }
        // update mouse cursor
        if( !renderer.domElement.lastCursor )
          renderer.domElement.lastCursor = renderer.domElement.style.cursor
        renderer.domElement.style.cursor = state ? 'pointer' : renderer.domElement.lastCursor 
        xrf
        .emit('macro',{selected:state,mesh,xrf:frag}) // let all listeners agree
        .then( () => mesh.selected = state )
      }

      mesh.addEventListener('click', fragment.trigger )
      mesh.addEventListener('mousemove', selected(true) )
      mesh.addEventListener('nocollide', selected(false) )

      // lazy add mesh to interactive group (because we're inside a recursive traverse)
      setTimeout( (mesh) => {
        const world = { 
          pos: new THREE.Vector3(), 
          scale: new THREE.Vector3(),
          quat: new THREE.Quaternion()
        }
        mesh.getWorldPosition(world.pos)
        mesh.getWorldScale(world.scale)
        mesh.getWorldQuaternion(world.quat);
        mesh.position.copy(world.pos)
        mesh.scale.copy(world.scale)
        mesh.setRotationFromQuaternion(world.quat);
        xrf.interactive.add(mesh)
        xrf.emit('interactionReady', {mesh,xrf:fragment, clickHandler: fragment.trigger})
      }, 10, mesh )
    }
  }
})
xrf.addEventListener('mov', (opts) => {
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  if( frag.mov && frag.q ){

    // let wait for the queried objects (as we're inside promise which traverses the graph)
    setTimeout( (v) => {
      frag.q.getObjects().map( (o) => {
        o.position.add( new THREE.Vector3( v.x, v.y, v.z ) )
      })
    },10, frag.mov )
  }
})
xrf.addEventListener('pos', (opts) => {
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  if( frag.pos && frag.q ){
    // apply roundrobin (if any)
    if( v.args ) v = v.args[ xrf.roundrobin(v,model) ]

    frag.q.getObjects().map( (o) => {
      // if object has no parent (name == 'Scene') use absolute positioning, otherwise relative to parent
      o.position.x = o.parent.name == 'Scene' ? v.x : o.positionOriginal.x + v.x
      o.position.y = o.parent.name == 'Scene' ? v.z : o.positionOriginal.y + v.z
      o.position.z = o.parent.name == 'Scene' ? v.y : o.positionOriginal.z + v.y
    })
  }
})
xrf.addEventListener('rot', (opts) => {
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  if( frag.rot && frag.q ){
    // apply roundrobin (if any)
    if( v.args ) v = v.args[ xrf.roundrobin(v,model) ]

    if( frag.q ){ // only operate on queried object(s)
      frag.q.getObjects().map( (o) => {
        o.rotation.set( 
          v.x * Math.PI / 180,
          v.y * Math.PI / 180,
          v.z * Math.PI / 180
        )
      })
    }
  }
})
xrf.addEventListener('scale', (opts) => {
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  if( frag.scale && frag.q ){
    // apply roundrobin (if any)
    if( v.args ) v = v.args[ xrf.roundrobin(v,model) ]

    frag.q.getObjects().map( (o) => {
      o.scale.x = v.x
      o.scale.y = v.y
      o.scale.z = v.z
    })
  }
})
xrf.addEventListener('show', (opts) => {
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  if( frag.show && frag.q ){
    let show = frag.show

    // apply roundrobin (if any)
    if( show.args ) v = show.args[ xrf.roundrobin(show,model) ]
    else v = show.int

    // let wait for the queried objects (as we're inside promise which traverses the graph)
    setTimeout( (v) => {
      frag.q.getObjects().map( (o) => {
        o.visible = v.int == 1;
      })
    }, 20, v)
  }
})
xrf.frag.clip = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts

  if( v.x == 0 ) v.x = 1;  // THREE.js .near restriction
  console.log("└ clip "+v.x+","+v.y);

  camera.near = v.x
  camera.far  = v.y
  camera.updateProjectionMatrix();
}
xrf.frag.fov = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts

  console.log("└ fov "+v.int);
  camera.fov = v.int;
  camera.updateProjectionMatrix();
}
/**
 * 
 * navigation, portals & mutations
 * 
 * | fragment | type | scope | example value |
 * |`href`| string (uri or predefined view) | 🔒 |`#pos=1,1,0`<br>`#pos=1,1,0&rot=90,0,0`<br>`#pos=pyramid`<br>`#pos=lastvisit|pyramid`<br>`://somefile.gltf#pos=1,1,0`<br> |
 * 
 * [[» example implementation|https://github.com/coderofsalvation/xrfragment/blob/main/src/3rd/three/xrf/href.js]]<br>
 * [[» example 3D asset|https://github.com/coderofsalvation/xrfragment/blob/main/example/assets/href.gltf#L192]]<br>
 * [[» discussion|https://github.com/coderofsalvation/xrfragment/issues/1]]<br>
 *
 * [img[xrfragment.jpg]]
 * 
 * 
 * !!!spec 1.0
 * 
 * 1. an ''external''- or ''file URI'' fully replaces the current scene and assumes `pos=0,0,0&rot=0,0,0` by default (unless specified)
 * 
 * 2. navigation should not happen when queries (`q=`) are present in local url: queries will apply (`pos=`, `rot=` e.g.) to the targeted object(s) instead.
 * 
 * 3. navigation should not happen ''immediately'' when user is more than 2 meter away from the portal/object containing the href (to prevent accidental navigation e.g.)
 * 
 * 4. URL navigation should always be reflected in the client (in case of javascript: see [[here|https://github.com/coderofsalvation/xrfragment/blob/dev/src/3rd/three/navigator.js]] for an example navigator).
 * 
 * 5. In XR mode, the navigator back/forward-buttons should be always visible (using a wearable e.g., see [[here|https://github.com/coderofsalvation/xrfragment/blob/dev/example/aframe/sandbox/index.html#L26-L29]] for an example wearable)
 * 
 * [img[navigation.png]]
 * 
 */

xrf.frag.href = function(v, opts){
  opts.embedded = v // indicate embedded XR fragment
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts

  if( mesh.userData.XRF.href.exec ) return // mesh already initialized

  const world = { 
    pos: new THREE.Vector3(), 
    scale: new THREE.Vector3(),
    quat: new THREE.Quaternion()
  }
  // detect equirectangular image
  let texture = mesh.material && mesh.material.map ? mesh.material.map : null
  if( texture && texture.source.data.height == texture.source.data.width/2 ){
    texture.mapping = THREE.ClampToEdgeWrapping
    texture.needsUpdate = true

    // poor man's equi-portal
    mesh.material = new THREE.ShaderMaterial( {
      side: THREE.DoubleSide,
      uniforms: {
        pano: { value: texture },
        selected: { value: false },
      },
      vertexShader: `
         vec3 portalPosition;
         varying vec3 vWorldPosition;
         varying float vDistanceToCenter;
         varying float vDistance;
         void main() {
           vDistanceToCenter = clamp(length(position - vec3(0.0, 0.0, 0.0)), 0.0, 1.0);
           portalPosition = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
           vDistance = length(portalPosition - cameraPosition);
           vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
         }
      `,
      fragmentShader: `
        #define RECIPROCAL_PI2 0.15915494
        uniform sampler2D pano;
        uniform bool selected;
        varying float vDistanceToCenter;
        varying float vDistance;
        varying vec3 vWorldPosition;
        void main() {
          vec3 direction = normalize(vWorldPosition - cameraPosition );
          vec2 sampleUV;
          sampleUV.y = -clamp(direction.y * 0.5  + 0.5, 0.0, 1.0);
          sampleUV.x = atan(direction.z, -direction.x) * -RECIPROCAL_PI2;
          sampleUV.x += 0.33; // adjust focus to AFRAME's a-scene.components.screenshot.capture()
          vec4 color = texture2D(pano, sampleUV);
          // Convert color to grayscale (lazy lite approach to not having to match tonemapping/shaderstacking of THREE.js)
          float luminance = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
          vec4 grayscale_color = selected ? color : vec4(vec3(luminance) + vec3(0.33), color.a);
          gl_FragColor = grayscale_color;
        }
      `,
    });
    mesh.material.needsUpdate = true
  }else if( mesh.material){ mesh.material = mesh.material.clone() }

  let click = mesh.userData.XRF.href.exec = (e) => {

    let isLocal = v.string[0] == '#'
    let lastPos = `pos=${camera.position.x.toFixed(2)},${camera.position.y.toFixed(2)},${camera.position.z.toFixed(2)}`

    xrf
    .emit('href',{click:true,mesh,xrf:v}) // let all listeners agree
    .then( () => {
      const flags = v.string[0] == '#' ? xrf.XRF.PV_OVERRIDE : undefined
      let toFrag = xrf.URI.parse( v.string, xrf.XRF.NAVIGATOR | xrf.XRF.PV_OVERRIDE | xrf.XRF.METADATA )
      // always keep a trail of last positions before we navigate
      if( !document.location.hash.match(lastPos) ) xrf.navigator.to(`#${lastPos}`)
      xrf.navigator.to(v.string)    // let's surf to HREF!
    }) 
    .catch( console.error )
  }

  let selected = mesh.userData.XRF.href.selected = (state) => () => {
    if( mesh.selected == state ) return // nothing changed 
    xrf.interactive.objects.map( (o) => {
      let newState = o.name == mesh.name ? state : false
      if( o.material ){
        if( o.material.uniforms ) o.material.uniforms.selected.value = newState 
        if( o.material.emissive ) o.material.emissive.r = o.material.emissive.g = o.material.emissive.b = newState ? 2.0 : 1.0
      }
    })
    // update mouse cursor
    if( !renderer.domElement.lastCursor )
      renderer.domElement.lastCursor = renderer.domElement.style.cursor
    renderer.domElement.style.cursor = state ? 'pointer' : renderer.domElement.lastCursor 

    xrf
    .emit('href',{selected:state,mesh,xrf:v}) // let all listeners agree
    .then( () => mesh.selected = state )
  }

  mesh.addEventListener('click', click )
  mesh.addEventListener('mousemove', selected(true) )
  mesh.addEventListener('mouseleave', selected(false) )

  // lazy add mesh (because we're inside a recursive traverse)
  setTimeout( (mesh) => {
    mesh.getWorldPosition(world.pos)
    mesh.getWorldScale(world.scale)
    mesh.getWorldQuaternion(world.quat);
    mesh.position.copy(world.pos)
    mesh.scale.copy(world.scale)
    mesh.setRotationFromQuaternion(world.quat);
    xrf.interactive.add(mesh)
    xrf.emit('interactionReady', {mesh,xrf:v,clickHandler: mesh.userData.XRF.href.exec })
  }, 0, mesh )
}

/**
 * > above solutions were abducted from [[this|https://i.imgur.com/E3En0gJ.png]] and [[this|https://i.imgur.com/lpnTz3A.png]] survey result
 *
 * !!!Demo
 * 
 * <$videojs controls="controls" aspectratio="16:9" preload="auto" poster="" fluid="fluid" class="vjs-big-play-centered">
 *   <source src="https://coderofsalvation.github.io/xrfragment.media/href.mp4" type="video/mp4"/>
 * </$videojs>
 * 
 * > capture of <a href="./example/aframe/sandbox" target="_blank">aframe/sandbox</a>
 */
xrf.frag.pos = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  camera.position.x = v.x
  camera.position.y = v.y
  camera.position.z = v.z
}
xrf.frag.defaultPredefinedView = (opts) => {
  let {scene,model} = opts;
  let frag = {}
  xrf.Parser.parse("#","",frag)
  xrf.frag.updatePredefinedView({frag,model,scene})
}

xrf.frag.updatePredefinedView = (opts) => {
  let {frag,scene,model,renderer} = opts 

  // spec: https://xrfragment.org/#Selection%20of%20interest
  const selectionOfInterest = (frag,scene,mesh) => {
    let id = frag.string
    let oldSelection
    if(!id) return id // important: ignore empty strings 
    // Selection of Interest if predefined_view matches object name
    if( mesh.visible && mesh.material){
      xrf.emit('focus',{...opts,frag})
      .then( () => {
        const color    = new THREE.Color();
        const colors   = []
        let from       = new THREE.Vector3()

        let getCenterPoint = (mesh) => {
            var geometry = mesh.geometry;
            geometry.computeBoundingBox();
            var center = new THREE.Vector3();
            geometry.boundingBox.getCenter( center );
            mesh.localToWorld( center );
            return center;
        }         

        xrf.camera.updateMatrixWorld(true); // always keeps me diving into the docs :]
        xrf.camera.getWorldPosition(from)
        from.y -= 0.5 // originate from the heart chakra! :p
        const points = [from, getCenterPoint(mesh) ]
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        let line = new THREE.Line( geometry, xrf.focusLine.material );
        line.isXRF = true
        line.computeLineDistances();
        xrf.focusLine.lines.push(line)
        xrf.focusLine.points.push(from)
        xrf.focusLine.opacity = 1
        scene.add(line)
      })
    }
  }

  //// spec: https://xrfragment.org/#predefined_view
  //const predefinedView = (frag,scene,mesh) => {
  //  let id   = frag.string || frag.fragment
  //  id       = `#${id}`
  //  if( id == '##' ) id = '#'; // default predefined view
  //  if( !id ) return           // prevent empty matches
  //  if( mesh.userData[id] ){   // get alias
  //    frag = xrf.URI.parse( mesh.userData[id], xrf.XRF.NAVIGATOR | xrf.XRF.PV_OVERRIDE | xrf.XRF.METADATA )
  //    xrf.emit('predefinedView',{...opts,frag})
  //    .then( () => {
  //      for ( let k in frag ){
  //        let opts = {frag, model, camera: xrf.camera, scene: xrf.scene, renderer: xrf.renderer, THREE: xrf.THREE }
  //        if( frag[k].is( xrf.XRF.PV_EXECUTE ) && scene.XRF_PV_ORIGIN != k ){  // cyclic detection
  //          highlightInScene(frag[k],scene)                                    // recurse predefined views
  //        }
  //      }
  //    })
  //  }
  //}

  const highlightInScene = (v,scene) => {
    if( !scene ) return 
    let remove = []
    let id = v.string || v.fragment
    if( id == '#' ) return
    let match = xrf.XRWG.match(id)
    console.dir({id,match,XRWG:xrf.XRWG})
    // erase previous lines
    xrf.focusLine.lines.map( (line) => scene.remove(line) )
    xrf.focusLine.points = []
    xrf.focusLine.lines  = []

    scene.traverse( (n) => n.selection ? remove.push(n) : false )
    remove.map(     (n) => scene.remove(n.selection) )
    // create new selections
    match.map( (w) => {
      if( w.key == `#${id}` ){
        if(  w.value && w.value[0] == '#' ){
          // if value is alias, execute fragment value 
          xrf.hashbus.pub( w.value, xrf.model, xrf.XRF.METADATA | xrf.XRF.PV_OVERRIDE | xrf.XRF.NAVIGATOR )
        }
      }
      w.nodes.map( (mesh) => selectionOfInterest( v, scene, mesh ) )
    })
  }

  // if this query was triggered by an src-value, lets filter it
  const isSRC = opts.embedded && opts.embedded.fragment == 'src'
  if( isSRC ){                             // spec : https://xrfragment.org/#src
    console.log("filtering predefined view of src")
    console.dir(frag)
  }else{
    console.log("updatePredefinedView")
    console.dir(frag)
    for ( let i in frag  ) {
      let v = frag[i]
      if( v.is( xrf.XRF.PV_EXECUTE ) ){
        scene.XRF_PV_ORIGIN = v.string
        // wait for nested instances to arrive at the scene ?
        highlightInScene(v,scene)
      }
    }
  }
}

// react to enduser typing url
xrf.addEventListener('hash', (opts) => {
  let frag = xrf.URI.parse( opts.hash, xrf.XRF.NAVIGATOR | xrf.XRF.PV_OVERRIDE | xrf.XRF.METADATA )
  xrf.frag.updatePredefinedView({frag,scene:xrf.scene})
}) 

// clicking href url with predefined view 
xrf.addEventListener('href', (opts) => {
  if( !opts.click || opts.xrf.string[0] != '#' ) return 
  let frag = xrf.URI.parse( opts.xrf.string, xrf.XRF.NAVIGATOR | xrf.XRF.PV_OVERRIDE | xrf.XRF.METADATA )
  xrf.frag.updatePredefinedView({frag,scene:xrf.scene,href:opts.xrf})
}) 
// spec: https://xrfragment.org/#queries

xrf.frag.q = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  console.log("   └ running query ")
  let qobjs = Object.keys(v.query)

  // convience function for other fragments (which apply to the query)
  frag.q.getObjects = () => {
    let objs = []
    scene.traverse( (o) => {
      for ( let name in v.query ) {
        let qobj = v.query[name];
        if( qobj.tag && o.userData.tag && xrf.hasTag(name,o.userData.tag) ) objs.push(o)
        else if( qobj.id && o.name == name ) objs.push(o)
      }
    })
    return objs.filter( (o) => o ) // return and filter out empty
               .map( (o) => {
                 if( !o.positionOriginal ) o.positionOriginal = o.position.clone() 
                 return o
               })
  }
  xrf.frag.q.filter(scene,frag) // spec : https://xrfragment.org/#queries
}

xrf.frag.q.filter = function(scene,frag){
  // spec: https://xrfragment.org/#queries
  let q        = frag.q.query 
  scene.traverse( (mesh) => {
    for ( let i in q ) {
      let isMeshId       = q[i].id    != undefined 
      let isMeshProperty = q[i].rules != undefined && q[i].rules.length && !isMeshId
      if( q[i].root && mesh.isSRC ) continue;  // ignore nested object for root-items (queryseletor '/foo' e.g.)
      if( isMeshId       && 
          (i == mesh.name || xrf.hasTag(i,mesh.userData.tag))) mesh.visible = q[i].id 
      if( isMeshProperty && mesh.userData[i]                 ) mesh.visible = (new xrf.Query(frag.q.string)).testProperty(i,mesh.userData[i])
    }
  })
}
xrf.frag.rot = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  console.log("   └ setting camera rotation to "+v.string)
  camera.rotation.set( 
    v.x * Math.PI / 180,
    v.y * Math.PI / 180,
    v.z * Math.PI / 180
  )
  camera.updateMatrixWorld()
}
// *TODO* use webgl instancing

xrf.frag.src = function(v, opts){

  opts.embedded = v // indicate embedded XR fragment
  let { mesh, model, camera, scene, renderer, THREE, hashbus, frag} = opts

  console.log("   └ instancing src")
  let src;
  let url      = v.string
  let vfrag    = xrfragment.URI.parse(url)
  opts.isPlane = mesh.geometry && mesh.geometry.attributes.uv && mesh.geometry.attributes.uv.count == 4 

  const addScene = (scene,url,frag) => {
    src = xrf.frag.src.filterScene(scene,{...opts,frag})
    xrf.frag.src.scale( src, opts, url )
    xrf.frag.src.eval( src, opts, url )
    enableSourcePortation(src)
    mesh.add(src)
    mesh.traverse( (n) => n.isSRC = n.isXRF = true )
    if( mesh.material ) mesh.material.visible = false
  }

  const enableSourcePortation = (src) => {
    if( vfrag.href || v.string[0] == '#' ) return
    let scale = new THREE.Vector3()
    let size  = new THREE.Vector3()
    mesh.getWorldScale(scale)
    new THREE.Box3().setFromObject(src).getSize(size)
    const geo    = new THREE.SphereGeometry( Math.max(size.x, size.y, size.z) / scale.x, 10, 10 )
    const mat    = new THREE.MeshBasicMaterial()
    mat.transparent = true
    mat.roughness = 0.05
    mat.metalness = 1
    mat.opacity = 0
    const cube = new THREE.Mesh( geo, mat )
    console.log("todo: sourceportate")
    //mesh.add(cube)
  }

  const externalSRC = (url,frag,src) => {
    fetch(url, { method: 'HEAD' })
    .then( (res) => {
      console.log(`loading src ${url}`)
      let mimetype = res.headers.get('Content-type')
      if( url.replace(/#.*/,'').match(/\.(gltf|glb)$/)    ) mimetype = 'gltf'
      //if( url.match(/\.(fbx|stl|obj)$/) ) mimetype = 
      console.log("src mimetype: "+mimetype)
      opts = { ...opts, src, frag }
      return xrf.frag.src.type[ mimetype ] ? xrf.frag.src.type[ mimetype ](url,opts) : xrf.frag.src.type.unknown(url,opts)
    })
    .then( (model) => {
      if( model && model.scene ) addScene(model.scene, url, frag )
    })
    .finally( () => { })
    .catch( console.error )
  }

  if( url[0] == "#" ) addScene(scene,url,vfrag)    // current file 
  else externalSRC(url,vfrag)                      // external file
}

xrf.frag.src.eval = function(scene, opts, url){
    let { mesh, model, camera, renderer, THREE, hashbus} = opts
    if( url ){
      console.log(mesh.name+" url="+url)
      //let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)
      //let frag = xrfragment.URI.parse(url)
      //// scale URI XR Fragments (queries) inside src-value 
      //for( var i in frag ){
      //  hashbus.pub.fragment(i, Object.assign(opts,{frag, model:{scene},scene}))
      //}
      //hashbus.pub( '#', {scene} )                    // execute the default projection '#' (if exist)
      //hashbus.pub( url, {scene} )                    // and eval URI XR fragments 
    }
}

// scale embedded XR fragments https://xrfragment.org/#scaling%20of%20instanced%20objects
xrf.frag.src.scale = function(scene, opts, url){
    let { mesh, model, camera, renderer, THREE} = opts

    let restrictTo3DBoundingBox = mesh.geometry
    if( restrictTo3DBoundingBox ){ 
      // spec 3 of https://xrfragment.org/#src
      // spec 1 of https://xrfragment.org/#scaling%20of%20instanced%20objects  
      // normalize instanced objectsize to boundingbox
      let sizeFrom  = new THREE.Vector3()
      let sizeTo    = new THREE.Vector3()

      let empty = new THREE.Object3D()

// *TODO* exclude invisible objects from boundingbox size-detection
//
//      THREE.Box3.prototype.expandByObject = (function(expandByObject){
//        return function(object,precise){
//          return expandByObject.call(this, object.visible ? object : empty, precise)
//        }
//      })(THREE.Box3.prototype.expandByObject)

      new THREE.Box3().setFromObject(mesh).getSize(sizeTo)
      new THREE.Box3().setFromObject(scene).getSize(sizeFrom)
      let ratio = sizeFrom.divide(sizeTo)
      scene.scale.multiplyScalar( 1.0 / Math.max(ratio.x, ratio.y, ratio.z));
 //     let factor = getMax(sizeTo) < getMax(sizeFrom) ? getMax(sizeTo) / getMax(sizeFrom) : getMax(sizeFrom) / getMax(sizeTo)
 //     scene.scale.multiplyScalar( factor )
    }else{
      // spec 4 of https://xrfragment.org/#src
      // spec 2 of https://xrfragment.org/#scaling%20of%20instanced%20objects
      console.log("normal scale: "+url)
      scene.scale.multiply( mesh.scale ) 
    }
    scene.isXRF = model.scene.isSRC = true
}

xrf.frag.src.filterScene = (scene,opts) => {
  let { mesh, model, camera, renderer, THREE, hashbus, frag} = opts
  let obj, src
  // cherrypicking of object(s)
  if( !frag.q ){
    src = new THREE.Group()
    if( Object.keys(frag).length > 0 ){
      for( var i in frag ){
        if( scene.getObjectByName(i) ){
          src.add( obj = scene.getObjectByName(i).clone(true) )
        }
        hashbus.pub.fragment(i, Object.assign(opts,{frag, model,scene}))
      }
    }else src = scene.clone(true)
    if( src.children.length == 1 ) obj.position.set(0,0,0);
  }

  // filtering of objects using query
  if( frag.q ){
    src = scene.clone(true);
    xrf.frag.q.filter(src,frag)
  }
  src.traverse( (m) => {
    if( m.userData && (m.userData.src || m.userData.href) ) return ; // prevent infinite recursion 
    hashbus.pub.mesh(m,{scene,recursive:true})                       // cool idea: recursion-depth based distance between face & src
  })
  return src
}

/*
 * replace the src-mesh with the contents of the src
 */

xrf.frag.src.type = {}

/*
 * mimetype: unknown 
 */

xrf.frag.src.type['unknown'] = function( url, opts ){
  return new Promise( (resolve,reject) => {
    reject(`${url} mimetype not supported (yet)`)
  })
}

/*
 * mimetype: model/gltf+json
 */

xrf.frag.src.type['gltf'] = function( url, opts ){
  return new Promise( (resolve,reject) => {
    let {mesh,src} = opts
    let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)
    let loader

    const Loader = xrf.loaders[ext]
    if( !Loader ) throw 'xrfragment: no loader passed to xrfragment for extension .'+ext 
    if( !dir.match("://") ){ // force relative path 
      dir = dir[0] == './' ? dir : `./${dir}`
      loader = new Loader().setPath( dir )
    }else loader = new Loader()

    loader.load(url, (model) => {
      resolve(model)
    })
  })
}

/*
 * mimetype: image/png 
 * mimetype: image/jpg 
 * mimetype: image/gif 
 */

xrf.frag.src.type['image/png'] = function(url,opts){
  let {mesh} = opts
  let restrictTo3DBoundingBox = mesh.geometry
  const texture = new THREE.TextureLoader().load( url );
	texture.colorSpace = THREE.SRGBColorSpace;

  //const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ 
    map: texture, 
    transparent: url.match(/(png|gif)/) ? true : false,
    side: THREE.DoubleSide,
    color: 0xFFFFFF,
    opacity:1
  });

  // stretch image by pinning uv-coordinates to corners 
  if( mesh.geometry ){
    if( mesh.geometry.attributes.uv ){ // buffergeometries 
      let uv = mesh.geometry.attributes.uv;
      //       i  u  v
      uv.setXY(0, 0, 0 )
      uv.setXY(1, 1, 0 )
      uv.setXY(2, 0, 1 )
      uv.setXY(3, 1, 1 )
    }else {
      console.warn("xrfragment: uv's of ${url} might be off for non-buffer-geometries *TODO*")
      //if( geometry.faceVertexUvs ){
      // *TODO* force uv's of dynamically created geometries (in threejs)
      //}
    }
  }
  mesh.material = material
}
xrf.frag.src.type['image/gif'] = xrf.frag.src.type['image/png']
xrf.frag.src.type['image/jpg'] = xrf.frag.src.type['image/png']

xrf.frag.t = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  console.log(`   └ setting animation loop to ${v.x} ${v.y} ${v.z}` )
  if( !model.animations || model.animations[0] == undefined ) return console.warn('no animation in scene')

  model.mixer.t = v
  let duration  = model.animations[0].duration
  let frames    = model.animations[0].tracks[0].times.length
  let mixer     = model.mixer
  mixer.loop    = mixer.loop || {frameStart:0,frameStop:99999999,speed: 1}
  let fps       = frames / duration 

  mixer.loop.speed    = v.x 
  mixer.loop.speedAbs = Math.abs(v.x)
  mixer.loop.frameStart = v.y || mixer.loop.frameStart
  mixer.loop.frameStop  = v.z || mixer.loop.frameStop
  // always recalculate time using frameStart/Stop 
  mixer.loop.timeStart = mixer.loop.frameStart / (fps * mixer.loop.speedAbs)
  mixer.loop.timeStop  = mixer.loop.frameStop  / (fps * mixer.loop.speedAbs)
  
  // update speed
  mixer.timeScale = mixer.loop.speed

  let updateTime = (time) => {
    mixer.setTime(time)
    mixer.time = Math.abs(mixer.time)
    mixer.update(0)      // (forgetting) this little buddy costed me lots of time :]
  }

  if( v.y > 0 || v.z > 0 ) updateTime( mixer.loop.timeStart )

  // update loop when needed 
  if( !mixer.update.patched ){
    let update = mixer.update
    mixer.update = function(time){
      mixer.time = Math.abs(mixer.time)
      if( time == 0 ) return update.call(mixer,time)

      if( mixer.loop.speed > 0.0 && mixer.time > mixer.loop.timeStop * mixer.loop.speedAbs ){ 
        setTimeout( (time) => updateTime(time),0,mixer.loop.timeStart) // prevent recursion
      }
      return update.call( mixer, time )
    }
    mixer.update.patched = true
  }
}
window.AFRAME.registerComponent('xrf', {
  schema: {
  },
  init: function () {
    if( !AFRAME.XRF ){
      document.querySelector('a-scene').addEventListener('loaded', () => {

        //window.addEventListener('popstate', clear )
        //window.addEventListener('pushstate', clear )

        // enable XR fragments
        let aScene = document.querySelector('a-scene')
        let XRF = AFRAME.XRF = xrf.init({
          THREE,
          camera:    aScene.camera,
          scene:     aScene.object3D,
          renderer:  aScene.renderer,
          debug: true,
          loaders: { 
            gltf: THREE.GLTFLoader, // which 3D assets (exts) to check for XR fragments?
            glb: THREE.GLTFLoader
          }
        })
        if( !XRF.camera ) throw 'xrfragment: no camera detected, please declare <a-entity camera..> ABOVE entities with xrf-attributes'

        // override the camera-related XR Fragments so the camera-rig is affected
        let camOverride = (xrf,v,opts) => {
          opts.camera = document.querySelector('[camera]').object3D.parent
          xrf(v,opts)
        }

        xrf.pos  = camOverride
        xrf.href = camOverride 

        // in order to set the rotation programmatically
        // we need to disable look-controls
        xrf.rot  = (xrf,v,opts) => {
          let {frag,renderer} = opts;
          if( frag.q ) return // camera was not targeted for rotation 
          let look = document.querySelector('[look-controls]')
          if( look ) look.removeAttribute("look-controls")
 //         camOverride(xrf,v,opts)
          // *TODO* make look-controls compatible, because simply
          // adding the look-controls will revert to the old rotation (cached somehow?)
          //setTimeout( () => look.setAttribute("look-controls",""), 100 )
        }

        // convert href's to a-entity's so AFRAME
        // raycaster can find & execute it
        AFRAME.XRF.clickableMeshToEntity = (opts) => {
          let {mesh,clickHandler} = opts;
          let el = document.createElement("a-entity")
          el.setAttribute("xrf-get",mesh.name )  // turn into AFRAME entity
          el.setAttribute("class","ray")         // expose to raycaster 
          el.setAttribute("pressable", '')       // detect hand-controller click
          // add click
          el.addEventListener("click",          clickHandler )
          el.addEventListener("pressedstarted", clickHandler )
  //      this.el.addEventListener("buttondown",    console.dir )
  //      this.el.addEventListener("touchstart",    console.dir )
  //      this.el.addEventListener("triggerdown",   console.dir )
  //      this.el.addEventListener("gripdown",      console.dir )
  //      this.el.addEventListener("abuttondown",   console.dir )
  //      this.el.addEventListener("pinchended",    console.dir )

          $('a-scene').appendChild(el)
        }
        xrf.addEventListener('interactionReady', AFRAME.XRF.clickableMeshToEntity )

        // cleanup xrf-get objects when resetting scene
        xrf.reset = ((reset) => () => {
          reset()
          console.log("aframe reset")
          let els = [...document.querySelectorAll('[xrf-get]')]
          els.map( (el) => document.querySelector('a-scene').removeChild(el) )
        })(XRF.reset)

        // undo lookup-control shenanigans (which blocks updating camerarig position in VR)
        aScene.addEventListener('enter-vr', () => document.querySelector('[camera]').object3D.parent.matrixAutoUpdate = true )

        AFRAME.XRF.navigator.to(this.data)
                           .then( (model) => {
                             let gets = [ ...document.querySelectorAll('[xrf-get]') ]
                             gets.map( (g) => g.emit('update') )
                           })

        aScene.emit('XRF',{})
        
        // enable gaze-click on Mobile VR
        aScene.setAttribute('xrf-gaze','')

      })
    }

    if( typeof this.data == "string" ){
      if( document.location.search || document.location.hash.length > 1 ){ // override url
        this.data = `${document.location.search.substr(1)}${document.location.hash}`
      }
    }
  },

})
window.AFRAME.registerComponent('xrf-button', {
    schema: {
        label: {
            default: 'label'
        },
        width: {
            default: 0.11
        },
        toggable: {
            default: false
        }, 
        textSize: {
            default: 0.66
        }, 
        color:{
            default: '#111'
        }, 
        textColor:{
            default: '#fff'
        }, 
        hicolor:{
            default: '#555555'
        },
        action:{
            default: ''
        }
    },
    init: function() {
        var el = this.el;
        var labelEl = this.labelEl = document.createElement('a-entity');
        this.color = this.data.color 
        el.setAttribute('geometry', {
            primitive: 'box',
            width: this.data.width,
            height: 0.05,
            depth: 0.005
        });
        el.setAttribute('material', {
            color: this.color, 
            transparent:true,
            opacity:0.7
        });
        el.setAttribute('pressable', '');
        labelEl.setAttribute('position', '0 0 0.01');
        labelEl.setAttribute('text', {
            value: this.data.label,
            color: this.data.textColor, 
            align: 'center'
        });
        labelEl.setAttribute('scale', `${this.data.textSize} ${this.data.textSize} ${this.data.textSize}`);
        this.el.appendChild(labelEl);
        this.bindMethods();
        this.el.addEventListener('stateadded', this.stateChanged);
        this.el.addEventListener('stateremoved', this.stateChanged);
        this.el.addEventListener('pressedstarted', this.onPressedStarted);
        this.el.addEventListener('pressedended', this.onPressedEnded);
        this.el.addEventListener('mouseenter', (e) => this.onMouseEnter(e) );
        this.el.addEventListener('mouseleave', (e) => this.onMouseLeave(e) );

        if( this.data.action ){ 
          this.el.addEventListener('click', new Function(this.data.action) )
        }
    },
    bindMethods: function() {
        this.stateChanged = this.stateChanged.bind(this);
        this.onPressedStarted = this.onPressedStarted.bind(this);
        this.onPressedEnded = this.onPressedEnded.bind(this);
    },
    update: function(oldData) {
        if (oldData.label !== this.data.label) {
            this.labelEl.setAttribute('text', 'value', this.data.label);
        }
    },
    stateChanged: function() {
        var color = this.el.is('pressed') ? this.data.hicolor : this.color;
        this.el.setAttribute('material', {
            color: color
        });
    },
    onMouseEnter: function(){
        this.el.setAttribute('material', { color: this.data.hicolor });
    }, 
    onMouseLeave: function(){
        this.el.setAttribute('material', { color: this.color });
    }, 
    onPressedStarted: function() {
        var el = this.el;
        el.setAttribute('material', {
            color: this.data.hicolor
        });
        el.emit('click');
        if (this.data.togabble) {
            if (el.is('pressed')) {
                el.removeState('pressed');
            } else {
                el.addState('pressed');
            }
        }
    },
    onPressedEnded: function() {
        if (this.el.is('pressed')) {
            return;
        }
        this.el.setAttribute('material', {
            color: this.color
        });
    }
});
// gaze click on mobile VR

AFRAME.registerComponent('xrf-gaze',{
  schema:{
    spawn:{type:'boolean',default:false}, 
  },
  setGazer: function(state){
    let cam = document.querySelector("[camera]") 
    if( state ){
      if( cam.innerHTML.match(/cursor/) ) return; // avoid duplicate calls
      cam.innerHTML = `<a-entity id="cursor" cursor="fuse: true; fuseTimeout: 1500"
        animation__click="property: scale; startEvents: click; easing: easeInCubic; dur: 150; from: 0.1 0.1 0.1; to: 1 1 1"
        animation__fusing="property: scale; startEvents: fusing; easing: easeInCubic; dur: 1500; from: 1 1 1; to: 0.1 0.1 0.1"
        animation__mouseleave="property: scale; startEvents: mouseleave; easing: easeInCubic; dur: 500; to: 1 1 1"
        raycaster="objects: .ray"
        visible="true"
        position="0 0 -1"
        geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
        material="color: #BBBBBB; shader: flat">
      </a-entity>`
    }else{
      //if( document.querySelector('[cursor]') ) 
      //  document.querySelector('[cursor]').setAttribute("visible",false)
    }
  }, 
  init:function(data){
    this.immersive = false;
    let enabled    = () => AFRAME.utils.device.isMobile()
    let setVisible = () => document.querySelector('[cursor]').setAttribute('visible', enabled() )
    this.setGazer(enabled())
    if( enabled() ) setVisible();

    document.querySelector("a-scene").addEventListener('exit-vr', () => {
      this.immersive = false;
      setVisible()
    })
    document.querySelector("a-scene").addEventListener('enter-vr', () => {
      this.immersive = true;
      setVisible()
      if( !document.querySelector("#cursor") ) return
    })


    let highlightMesh = (state) => (e) => {
      if( !e.target.object3D ) return 
      let obj = e.target.object3D.children[0]
      if( obj.userData && obj.userData.XRF && obj.userData.XRF.href )
        obj.userData.XRF.href.selected( state )()
    }
    this.el.addEventListener("mouseenter", highlightMesh(true) )
    this.el.addEventListener("mouseleave", highlightMesh(false ) )
  }
});
window.AFRAME.registerComponent('xrf-get', {
  schema: {
    name: {type: 'string'},
    clone: {type: 'boolean', default:false}
  },

  init: function () {

    var el = this.el;
    var meshname = this.data.name || this.data;

    this.el.addEventListener('update', (evt) => {

      setTimeout( () => {

        if( !this.mesh && this.el.className == "ray" ){
          let scene = AFRAME.XRF.scene 
          let mesh = this.mesh = scene.getObjectByName(meshname);
          if (!mesh){
            console.error("mesh with name '"+meshname+"' not found in model")
            return;
          }
          // convert to worldcoordinates
          mesh.getWorldPosition(mesh.position)
          mesh.getWorldScale(mesh.scale)
          mesh.getWorldQuaternion(mesh.quaternion)
          mesh.isXRF = true    // mark for deletion by xrf
          this.el.setObject3D('mesh',mesh)
          // normalize position
          //this.el.object3D.position.copy( mesh.position )
          //mesh.position.fromArray([0,0,0])
          if( !this.el.id ) this.el.setAttribute("id",`xrf-${mesh.name}`)

        }
      },500)

    })

    this.el.emit("update")

  }

});

window.AFRAME.registerComponent('xrf-wear', {
  schema:{
    el: {type:"selector"}, 
    position: {type:"vec3"}, 
    rotation: {type:"vec3"} 
  }, 
  init: function(){
    $('a-scene').addEventListener('enter-vr', (e) => this.wear(e) )
    $('a-scene').addEventListener('exit-vr',  (e) => this.unwear(e) )
  }, 
  wear: function(){
    if( !this.wearable ){
      let d = this.data
      this.wearable = new THREE.Group()
      this.el.object3D.children.map( (c) => this.wearable.add(c) )
      this.wearable.position.set( d.position.x,  d.position.y,  d.position.z)
      this.wearable.rotation.set( d.rotation.x,  d.rotation.y,  d.rotation.z)
    }
    this.data.el.object3D.add(this.wearable)
  }, 
  unwear: function(){
    this.data.el.remove(this.wearable)
    this.wearable.children.map( (c) => this.el.object3D.add(c) )
    delete this.wearable
  }
})
