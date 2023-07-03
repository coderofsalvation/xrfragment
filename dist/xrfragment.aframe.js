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
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
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
	Frag_h["prio"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_INT;
	Frag_h["#"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_PREDEFINED_VIEW;
	Frag_h["class"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_STRING;
	Frag_h["src"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_URL;
	Frag_h["pos"] = xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.ROUNDROBIN | xrfragment_XRF.T_VECTOR3 | xrfragment_XRF.T_STRING_OBJ | xrfragment_XRF.EMBEDDED | xrfragment_XRF.NAVIGATOR;
	Frag_h["href"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_URL | xrfragment_XRF.T_PREDEFINED_VIEW;
	Frag_h["q"] = xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_STRING | xrfragment_XRF.EMBEDDED;
	Frag_h["scale"] = xrfragment_XRF.QUERY_OPERATOR | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.ROUNDROBIN | xrfragment_XRF.T_VECTOR3 | xrfragment_XRF.EMBEDDED;
	Frag_h["rot"] = xrfragment_XRF.QUERY_OPERATOR | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.ROUNDROBIN | xrfragment_XRF.T_VECTOR3 | xrfragment_XRF.EMBEDDED | xrfragment_XRF.NAVIGATOR;
	Frag_h["translate"] = xrfragment_XRF.QUERY_OPERATOR | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.ROUNDROBIN | xrfragment_XRF.T_VECTOR3 | xrfragment_XRF.EMBEDDED;
	Frag_h["visible"] = xrfragment_XRF.QUERY_OPERATOR | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.ROUNDROBIN | xrfragment_XRF.T_INT | xrfragment_XRF.EMBEDDED;
	Frag_h["env"] = xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_STRING | xrfragment_XRF.EMBEDDED;
	Frag_h["t"] = xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.ROUNDROBIN | xrfragment_XRF.T_VECTOR2 | xrfragment_XRF.NAVIGATOR | xrfragment_XRF.EMBEDDED;
	Frag_h["gravity"] = xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_VECTOR3 | xrfragment_XRF.EMBEDDED;
	Frag_h["physics"] = xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_VECTOR3 | xrfragment_XRF.EMBEDDED;
	Frag_h["fov"] = xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_INT | xrfragment_XRF.NAVIGATOR | xrfragment_XRF.EMBEDDED;
	Frag_h["clip"] = xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_VECTOR2 | xrfragment_XRF.NAVIGATOR | xrfragment_XRF.EMBEDDED;
	Frag_h["fog"] = xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_STRING | xrfragment_XRF.NAVIGATOR | xrfragment_XRF.EMBEDDED;
	Frag_h["namespace"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_STRING;
	Frag_h["SPDX"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_STRING;
	Frag_h["unit"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_STRING;
	Frag_h["description"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_STRING;
	Frag_h["session"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_URL | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.NAVIGATOR | xrfragment_XRF.EMBEDDED | xrfragment_XRF.PROMPT;
	if(value.length == 0 && key.length > 0 && !Object.prototype.hasOwnProperty.call(Frag_h,key)) {
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
			console.log("src/xrfragment/Parser.hx:82:","⚠ fragment '" + key + "' has incompatible value (" + value + ")");
			return false;
		}
		store[key] = v;
		if(xrfragment_Parser.debug) {
			console.log("src/xrfragment/Parser.hx:86:","✔ " + key + ": " + v.string);
		}
	} else {
		if(typeof(value) == "string") {
			v.guessType(v,value);
		}
		store["_" + key] = v;
	}
	return true;
};
var xrfragment_Query = $hx_exports["xrfragment"]["Query"] = function(str) {
	this.isNumber = new EReg("^[0-9\\.]+$","");
	this.isClass = new EReg("^[-]?class$","");
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
	,expandAliases: function(token) {
		var classAlias = new EReg("^(-)?\\.","");
		if(classAlias.match(token)) {
			return StringTools.replace(token,".","class:");
		} else {
			return token;
		}
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
				if(_gthis.isClass.match(k)) {
					filter[prefix + k] = oper != "!=";
					q[v] = filter;
				} else {
					var rule = { };
					if(_gthis.isNumber.match(v)) {
						rule[oper] = parseFloat(v);
					} else {
						rule[oper] = v;
					}
					filter["rules"].push(rule);
					q[k] = filter;
				}
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
			process(this.expandAliases(token[i]));
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
xrfragment_XRF.EMBEDDED = 64;
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
  return xrf.query
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
    if( !opts.promise.halted ) resolve()
  })
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

  class InteractiveGroup extends Group {

    constructor( renderer, camera ) {

      super();

      if( !renderer || !camera ) return 

      // extract camera when camera-rig is passed
      camera.traverse( (n) =>  String(n.type).match(/Camera/) ? camera = n : null )

      const scope = this;

      const raycaster = new Raycaster();
      const tempMatrix = new Matrix4();

      function nocollide(){
        if( nocollide.tid ) return  // ratelimit
        _event.type = "nocollide"
        scope.children.map( (c) => c.dispatchEvent(_event) )
        nocollide.tid = setTimeout( () => nocollide.tid = null, 100 )
      }

      // Pointer Events

      const element = renderer.domElement;

      function onPointerEvent( event ) {

        //event.stopPropagation();

        const rect = renderer.domElement.getBoundingClientRect();

        _pointer.x = ( event.clientX - rect.left ) / rect.width * 2 - 1;
        _pointer.y = - ( event.clientY - rect.top ) / rect.height * 2 + 1;

        raycaster.setFromCamera( _pointer, camera );

        const intersects = raycaster.intersectObjects( scope.children, false );

        if ( intersects.length > 0 ) {

          const intersection = intersects[ 0 ];

          const object = intersection.object;
          const uv = intersection.uv;

          _event.type = event.type;
          _event.data.set( uv.x, 1 - uv.y );

          object.dispatchEvent( _event );

        }else nocollide()

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

        const intersections = raycaster.intersectObjects( scope.children, false );

        if ( intersections.length > 0 ) {

          const intersection = intersections[ 0 ];

          const object = intersection.object;
          const uv = intersection.uv;

          _event.type = events[ event.type ];
          _event.data.set( uv.x, 1 - uv.y );
          if( _event.type != "mousemove" ){
            console.log(event.type+" => "+_event.type)
          }

          object.dispatchEvent( _event );

        }else nocollide()

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

  }

  return new InteractiveGroup(renderer,camera)
}
xrf.frag   = {}
xrf.model  = {}

xrf.init = ((init) => function(opts){
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
}

xrf.getFile = (url) => url.split("/").pop().replace(/#.*/,'')

xrf.parseModel = function(model,url){
  let file               = xrf.getFile(url)
  model.file             = file
  // eval embedded XR fragments
  model.scene.traverse( (mesh) => xrf.eval.mesh(mesh,model) )
  // add animations
  model.clock            = new xrf.THREE.Clock();
  model.mixer            = new xrf.THREE.AnimationMixer(model.scene)
  model.animations.map( (anim) => model.mixer.clipAction( anim ).play() )
  model.render           = function(){
    model.mixer.update( model.clock.getDelta() )
    xrf.navigator.material.selection.color.r = (1.0 + Math.sin( model.clock.getElapsedTime() * 10 ))/2
  }
}

xrf.getLastModel = ()           => xrf.model.last 

xrf.eval = function( url, model, flags ){  // evaluate fragments in url
  let notice = false
  model = model || xrf.model
  let { THREE, camera } = xrf
  let frag = xrf.URI.parse( url, flags || xrf.XRF.NAVIGATOR )
  let opts = {frag, mesh:xrf.camera, model, camera: xrf.camera, scene: xrf.scene, renderer: xrf.renderer, THREE: xrf.THREE }
  xrf.emit('eval',opts)
  .then( () => {
    for ( let k in frag ){
      xrf.eval.fragment(k,opts) 
    }
  })
}

xrf.eval.mesh     = (mesh,model) => { // evaluate embedded fragments (metadata) inside mesh of model 
  if( mesh.userData ){
    let frag = {}
    for( let k in mesh.userData ) xrf.Parser.parse( k, mesh.userData[k], frag )
    for( let k in frag ){
      let opts = {frag, mesh, model, camera: xrf.camera, scene: xrf.scene, renderer: xrf.renderer, THREE: xrf.THREE }
      mesh.userData.XRF = frag // allow fragment impl to access XRF obj already
      xrf.emit('eval',opts)
      .then( () => xrf.eval.fragment(k,opts) )
    }
  }
}

xrf.eval.fragment = (k, opts ) => { // evaluate one fragment
  // call native function (xrf/env.js e.g.), or pass it to user decorator
  let func = xrf.frag[k] || function(){} 
  if(  xrf[k] ) xrf[k]( func, opts.frag[k], opts)
  else                  func( opts.frag[k], opts)
}

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
  xrf.add( xrf.interactive)
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

xrf.navigator = {}

xrf.navigator.to = (url,flags) => {
  if( !url ) throw 'xrf.navigator.to(..) no url given'

  return new Promise( (resolve,reject) => {
    let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)

    if( !file || xrf.model.file == file ){ // we're already loaded
      xrf.eval( url, xrf.model, flags )    // and eval local URI XR fragments 
      return resolve(xrf.model) 
    }

    if( xrf.model && xrf.model.scene ) xrf.model.scene.visible = false
    const Loader = xrf.loaders[ext]
    if( !Loader ) throw 'xrfragment: no loader passed to xrfragment for extension .'+ext 
    xrf.reset() // clear xrf objects from scene
    // force relative path 
    if( dir ) dir = dir[0] == '.' ? dir : `.${dir}`
    const loader = new Loader().setPath( dir )
    loader.load( file, function(model){
      model.file = file
      xrf.add( model.scene )
      // only change url when loading *another* file
      if( xrf.model ) xrf.navigator.pushState( `${dir}${file}`, hash )
      xrf.model = model 
      xrf.eval( '#', model )     // execute the default projection '#' (if exist)
      xrf.eval( url, model )     // and eval URI XR fragments 
      if( !hash.match(/pos=/) ) 
        xrf.eval( '#pos=0,0,0' ) // set default position if not specified
      resolve(model)
    })
  })
}

xrf.navigator.init = () => {
  if( xrf.navigator.init.inited ) return
  window.addEventListener('popstate', function (event){
    xrf.navigator.to( document.location.search.substr(1) + document.location.hash )
  })
  xrf.navigator.material = {
    selection: new xrf.THREE.LineBasicMaterial({color:0xFF00FF,linewidth:2})
  }
  xrf.navigator.init.inited = true
}

xrf.navigator.updateHash = (hash) => {
  if( hash == document.location.hash || hash.match(/\|/) ) return  // skip unnecesary pushState triggers
  console.log(`URL: ${document.location.search.substr(1)}#${hash}`)
  document.location.hash = hash
  xrf.emit('updateHash', {hash} )
}

xrf.navigator.pushState = (file,hash) => {
  if( file == document.location.search.substr(1) ) return // page is in its default state
  window.history.pushState({},`${file}#${hash}`, document.location.pathname + `?${file}#${hash}` )
}
xrf.frag.env = function(v, opts){
  let { mesh, model, camera, scene, renderer, THREE} = opts
  let env = mesh.getObjectByName(v.string)
  if( !env ) return console.warn("xrf.env "+v.string+" not found")
  env.material.map.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = env.material.map
  //scene.texture = env.material.map    
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 2;
  console.log(`   └ applied image '${v.string}' as environment map`)
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
  let { mesh, model, camera, scene, renderer, THREE} = opts

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
          vec3 direction = normalize(vWorldPosition - cameraPosition);
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
    let lastPos = `#pos=${camera.position.x},${camera.position.y},${camera.position.z}`
    xrf
    .emit('href',{click:true,mesh,xrf:v}) // let all listeners agree
    .then( () => {
      const flags = v.string[0] == '#' && v.string.match(/(\||#q)/) ? xrf.XRF.PV_OVERRIDE : undefined
      if( !isLocal || v.string.match(/pos=/) ) xrf.navigator.to(lastPos) // commit last position 
      xrf.navigator.to(v.string,flags)    // let's surf to HREF!
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
    .emit('href',{selected:state,mesh,xrf:v}) // let all listeners agree
    .then( () => mesh.selected = state )
  }

  mesh.addEventListener('click', click )
  mesh.addEventListener('mousemove', selected(true) )
  mesh.addEventListener('nocollide', selected(false) )

  // lazy add mesh (because we're inside a recursive traverse)
  setTimeout( (mesh) => {
    mesh.getWorldPosition(world.pos)
    mesh.getWorldScale(world.scale)
    mesh.getWorldQuaternion(world.quat);
    mesh.position.copy(world.pos)
    mesh.scale.copy(world.scale)
    mesh.setRotationFromQuaternion(world.quat);
    xrf.interactive.add(mesh)
  }, 20, mesh )
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

  if( !frag.q ){ 
    camera.position.x = v.x
    camera.position.y = v.y
    camera.position.z = v.z
  }
}
const updatePredefinedView = (opts) => {
  let {frag,scene} = opts 

  // spec: https://xrfragment.org/#Selection%20of%20interest
  const selectionOfInterest = (frag,scene,mesh) => {
    let id = frag.string
    let oldSelection
    if(!id) return id // important: ignore empty strings 
    if( mesh.selection ) oldSelection = mesh.selection 
    // Selection of Interest if predefined_view matches object name
    if( mesh.visible && (id == mesh.name || id.substr(1) == mesh.userData.class) ){
      xrf.emit('selection',{...opts,frag})
      .then( () => {
        const margin = 1.2
        mesh.scale.multiplyScalar( margin )
        mesh.selection = new xrf.THREE.BoxHelper(mesh,0xff00ff)
        mesh.scale.divideScalar( margin )
        mesh.selection.material.dispose()
        mesh.selection.material = xrf.navigator.material.selection
        mesh.selection.isXRF = true
        scene.add(mesh.selection)
      })
    }
    return oldSelection
  }

  // spec: https://xrfragment.org/#predefined_view
  const predefinedView = (frag,scene,mesh) => {
    let id   = frag.string
    if( !id ) return  // prevent empty matches
    if( mesh.userData[`#${id}`] ){ // get alias
      frag = xrf.URI.parse( mesh.userData[`#${id}`], xrf.XRF.NAVIGATOR | xrf.XRF.PV_OVERRIDE | xrf.XRF.EMBEDDED )
      xrf.emit('predefinedView',{...opts,frag})
      .then( () => {
        for ( let k in frag ){
          let opts = {frag, model, camera: xrf.camera, scene: xrf.scene, renderer: xrf.renderer, THREE: xrf.THREE }
          xrf.eval.fragment(k,opts) 
        }
      })
    }
  }

  const traverseScene = (v,scene) => {
    let remove = []
    if( !scene ) return 
    scene.traverse( (mesh) => {
      remove.push( selectionOfInterest( v, scene, mesh ) )
      predefinedView( v , scene, mesh )
    })
    remove.filter( (e) => e ).map( (selection) => {
      scene.remove(selection)
    })
  }

  let pviews = []
  for ( let i in frag  ) {
    let v = frag[i]
    if( v.is( xrf.XRF.PV_EXECUTE ) ){
      if( v.args ) v = v.args[ xrf.roundrobin(v,xrf.model) ]
      // wait for nested instances to arrive at the scene 
      setTimeout( () => traverseScene(v,scene), 100 )
      if( v.string ) pviews.push(v.string)
    }else if( v.is( xrf.XRF.NAVIGATOR ) ) pviews.push(`${i}=${v.string}`)
  }
  if( pviews.length ) xrf.navigator.updateHash( pviews.join("&") )
}

// when predefined view occurs in url changes
xrf.addEventListener('eval', updatePredefinedView ) 

// clicking href url with predefined view 
xrf.addEventListener('href', (opts) => {
  if( !opts.click || opts.xrf.string[0] != '#' ) return 
  let frag = xrf.URI.parse( opts.xrf.string, xrf.XRF.NAVIGATOR | xrf.XRF.PV_OVERRIDE | xrf.XRF.EMBEDDED )
  updatePredefinedView({frag,scene:xrf.scene,href:opts.xrf})
}) 

//let updateUrl = (opts) => {
//  console.dir(opts)
//}
//
//xrf.addEventListener('predefinedView', updateUrl )
//xrf.addEventListener('selection', updateUrl )
// spec: https://xrfragment.org/#queries

xrf.frag.q = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  console.log("   └ running query ")
  let qobjs = Object.keys(v.query)

  // spec: https://xrfragment.org/#src
  const instanceScene = () => {
    v.scene = new THREE.Group()
    for ( let i in v.query  ) {
      let target = v.query[i]
      if( !scene.getObjectByName(i) && i != '*' ) return console.log(`     └ mesh not found: ${i}`)
      if( i == '*' ){
        let cloneScene = scene.clone()
        cloneScene.children.forEach( (child) => v.scene.getObjectByName(child.name) ? null : v.scene.add(child) ) 
        target.mesh = v.scene
      }else{
        console.log(`     └ query-ing mesh: ${i}`)
        if( !v.scene.getObjectByName(i) && target.id === true ){ 
          v.scene.add( target.mesh = scene.getObjectByName(i).clone() )
        }
      }
      if( target.id != undefined && target.mesh  ){  
          target.mesh.position.set(0,0,0)
          target.mesh.rotation.set(0,0,0)
      }
    }
    // hide negative selectors
    let negative = []
    v.scene.traverse( (mesh) => {
      for ( let i in v.query  ) {
        if( mesh.name == i && v.query[i].id === false ) negative.push(mesh)
      }
    })
    negative.map( (mesh) => mesh.visible = false )
  }

  // spec: https://xrfragment.org/#queries
  const showHide = () => {
    let q = frag.q.query 
    scene.traverse( (mesh) => {
      for ( let i in q ) {
        let isMeshId       = q[i].id    != undefined 
        let isMeshClass    = q[i].class != undefined 
        let isMeshProperty = q[i].rules != undefined && q[i].rules.length && !isMeshId && !isMeshClass 
        if( q[i].root && mesh.isSRC ) continue;  // ignore nested object for root-items (queryseletor '/foo' e.g.)
        if( isMeshId       && i == mesh.name           ) mesh.visible = q[i].id 
        if( isMeshClass    && i == mesh.userData.class ) mesh.visible = q[i].class
        if( isMeshProperty && mesh.userData[i]         ) mesh.visible = (new xrf.Query(frag.q.string)).testProperty(i,mesh.userData[i])
      }
    })
  }

  if( opts.embedded && opts.embedded.fragment == "src" ) instanceScene()  // spec : https://xrfragment.org/#src
  else showHide() // predefined view                                      // spec : https://xrfragment.org/#queries
}
xrf.frag.rot = function(v, opts){
  let { mesh, model, camera, scene, renderer, THREE} = opts
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
  let { mesh, model, camera, scene, renderer, THREE} = opts
  let src = new THREE.Group()

  if( v.string[0] == "#" ){ // local 
    console.log("   └ instancing src")
    let frag = xrfragment.URI.parse(v.string)
    
    // apply embedded XR fragments
    setTimeout( () => {
      // apply URI XR Fragments inside src-value 
      for( var i in frag ){
        xrf.eval.fragment(i, Object.assign(opts,{frag, model,scene}))
      }
      if( frag.q.query ){  
        let srcScene = frag.q.scene // three/xrf/q.js initializes .scene
        if( !srcScene || !srcScene.visible ) return 
        console.log("       └ inserting "+i+" (srcScene)")
        srcScene.position.set(0,0,0)
        srcScene.rotation.set(0,0,0)
        // add interactive elements (href's e.g.)
        srcScene.add( xrf.interactive.clone() )
        srcScene.traverse( (m) => {
          if( m.userData && (m.userData.src || m.userData.href) ) return ;//delete m.userData.src // prevent infinite recursion 
          xrf.eval.mesh(m,{scene,recursive:true}) 
          m.isSRC = true
        })
        console.dir(xrf)
        if( srcScene.visible ) src.add( srcScene )
      }
      src.position.copy( mesh.position )
      src.rotation.copy( mesh.rotation )
      src.scale.copy( mesh.scale )
      mesh.add(src)
      if( !opts.recursive ) mesh.material.visible = false // lets hide the preview object because deleting disables animations+nested objs
    },10)
  }
}
window.AFRAME.registerComponent('xrf', {
  schema: {
  },
  init: function () {
    if( !AFRAME.XRF ) this.initXRFragments()
    if( typeof this.data == "string" ){
      if( document.location.search || document.location.hash.length > 1 ){ // override url
        this.data = `${document.location.search.substr(1)}${document.location.hash}`
      }
      AFRAME.XRF.navigator.to(this.data)
                         .then( (model) => {
                           let gets = [ ...document.querySelectorAll('[xrf-get]') ]
                           gets.map( (g) => g.emit('update') )
                         })
    }
  },

  initXRFragments: function(){

    //window.addEventListener('popstate', clear )
    //window.addEventListener('pushstate', clear )

    // enable XR fragments
    let aScene = document.querySelector('a-scene')
    let XRF = AFRAME.XRF = xrf.init({
      THREE,
      camera:   aScene.camera,
      scene:    aScene.object3D,
      renderer: aScene.renderer,
      debug: true,
      loaders: { gltf: THREE.GLTFLoader }  // which 3D assets (exts) to check for XR fragments?
    })
    if( !XRF.camera ) throw 'xrfragment: no camera detected, please declare <a-entity camera..> ABOVE entities with xrf-attributes'

    // override the camera-related XR Fragments so the camera-rig is affected
    let camOverride = (xrf,v,opts) => {
      opts.camera = document.querySelector('[camera]').object3D.parent
      xrf(v,opts)
    }

    xrf.pos  = camOverride

    // in order to set the rotation programmatically
    // we need to disable look-controls
    xrf.rot  = (xrf,v,opts) => {
      let {renderer} = opts;
      let look = document.querySelector('[look-controls]')
      if( look ) look.removeAttribute("look-controls")
      camOverride(xrf,v,opts)
      // *TODO* make look-controls compatible, because simply
      // adding the look-controls will revert to the old rotation (cached somehow?)
      //setTimeout( () => look.setAttribute("look-controls",""), 100 )
    }

    // convert portal to a-entity so AFRAME
    // raycaster can find & execute it
    xrf.href = (xrf,v,opts) => {
      camOverride(xrf,v,opts)
      let {mesh,camera} = opts;
      let el = document.createElement("a-entity")
      el.setAttribute("xrf-get",mesh.name )
      el.setAttribute("class","ray")
      el.addEventListener("click", mesh.userData.XRF.href.exec )
      $('a-scene').appendChild(el)
    }

    // cleanup xrf-get objects when resetting scene
    xrf.reset = ((reset) => () => {
      reset()
      console.log("aframe reset")
      let els = [...document.querySelectorAll('[xrf-get]')]
      els.map( (el) => document.querySelector('a-scene').removeChild(el) )
    })(XRF.reset)

    // undo lookup-control shenanigans (which blocks updating camerarig position in VR)
    aScene.addEventListener('enter-vr', () => document.querySelector('[camera]').object3D.parent.matrixAutoUpdate = true )
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
            opacity:0.3
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
window.AFRAME.registerComponent('xrf-get', {
  schema: {
    name: {type: 'string'},
    clone: {type: 'boolean', default:false}
  },

  init: function () {

    var el = this.el;
    var meshname = this.data.name || this.data;

    this.el.addEventListener('update', (evt) => {

      let scene = AFRAME.XRF.scene 
      let mesh = scene.getObjectByName(meshname);
      if (!mesh){
        console.error("mesh with name '"+meshname+"' not found in model")
        return;
      }
      // convert to worldcoordinates
      mesh.getWorldPosition(mesh.position)
      mesh.getWorldScale(mesh.scale)
      mesh.getWorldQuaternion(mesh.quaternion)
      if( !this.data.clone              ) mesh.parent.remove(mesh)
      mesh.isXRF = true // mark for deletion by xrf
      this.el.setObject3D('mesh', mesh );
      if( !this.el.id ) this.el.setAttribute("id",`xrf-${mesh.name}`)

    })

    if( this.el.className == "ray" ) this.el.emit("update")

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
