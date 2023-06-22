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
var Test = function() { };
Test.__name__ = true;
Test.main = function() {
	Test.test([{ fn : "url", expect : { fn : "equal.xyz", input : "pos", out : false}, label : "equal.xyz: should trigger incompatible type)", data : "http://foo.com?foo=1#pos=1.2,2.2"},{ fn : "url", expect : { fn : "equal.xyz", input : "pos", out : "1.2,2.2,3"}, label : "equal.xyz", data : "http://foo.com?foo=1#pos=1.2,2.2,3"},{ fn : "url", expect : { fn : "equal.xy", input : "t", out : "1,100"}, label : "a equal.xy", data : "http://foo.com?foo=1#t=1,100"},{ fn : "url", expect : { fn : "testParsed", input : "prio", out : false}, label : "should trigger incompatible type", data : "http://foo.com?foo=1#prio=foo"},{ fn : "url", expect : { fn : "equal.multi", input : "pos", out : "c|d|1,2,3"}, label : "b equal.multi", data : "http://foo.com?foo=1#pos=c|d|1,2,3"},{ fn : "url", expect : { fn : "testBrowserOverride", input : "t", out : true}, label : "browser URI can override t (defined in asset)", data : "http://foo.com?foo=1#t=2,500"},{ fn : "url", expect : { fn : "testBrowserOverride", input : "q", out : false}, label : "browser URI cannot override q (defined in asset)", data : "http://foo.com?foo=1#q=-bar"},{ fn : "url", expect : { fn : "testBrowserOverride", input : "scale", out : false}, label : "scale does not have NAVIGATOR set", data : "http://foo.com?foo=1#scale=2,2,2"},{ fn : "url", expect : { fn : "testEmbedOverride", input : "scale", out : true}, label : "embedded (src) URI can override scale", data : "http://foo.com?foo=1#scale=2,2,2"},{ fn : "url", expect : { fn : "testPredefinedView", input : "mypredefinedview", out : true}, label : "test predefined view executed", data : "http://foo.com?foo=1#mypredefinedview"},{ fn : "url", expect : { fn : "testPredefinedView", input : "another", out : true}, label : "test predefined view executed (multiple)", data : "http://foo.com?foo=1#mypredefinedview&another"},{ fn : "url", expect : { fn : "testPredefinedView", input : "mypredefinedview", out : true}, label : "test predefined view executed (multiple)", data : "http://foo.com?foo=1#mypredefinedview&another"},{ fn : "url", expect : { fn : "testPropertyAssign", input : "cube.position.x", out : true}, label : "test data assign", data : "#cube.position.x=music.position.x"},{ fn : "url", expect : { fn : "testPropertyAssign", input : "cube.position.x", out : true}, label : "test one-way data bind", data : "#cube.position.x=@music.position.x"}]);
	Test.test([{ fn : "query", expect : { fn : "testProperty", input : ["class","bar"], out : true}, data : "class:bar"},{ fn : "query", expect : { fn : "testProperty", input : ["class","bar"], out : true}, label : ".bar shorthand", data : ".bar"},{ fn : "query", expect : { fn : "testProperty", input : ["class","foo"], out : false}, data : ".bar -.foo"},{ fn : "query", expect : { fn : "testProperty", input : ["class","foo"], out : true}, data : ".bar -.foo .foo"},{ fn : "query", expect : { fn : "testProperty", input : ["class","bar"], out : true}, data : ".bar -.bar .bar"},{ fn : "query", expect : { fn : "testProperty", input : ["class","foo"], out : true}, label : "class:foo", data : ".foo -.foo .foo"},{ fn : "query", expect : { fn : "testProperty", input : ["class","foo"], out : true}, label : "class:foo", data : ".foo -.foo bar:5 .foo"},{ fn : "query", expect : { fn : "testProperty", input : ["class","foo"], out : true}, label : "class:foo", data : ".foo -.foo bar:>5 .foo"},{ fn : "query", expect : { fn : "testProperty", input : ["class","foo"], out : true}, label : "class:foo", data : ".foo -.foo bar:>5 .foo"},{ fn : "query", expect : { fn : "testProperty", input : ["class","foo"], out : true}, label : "class:foo", data : ".foo -.foo .foo"},{ fn : "query", expect : { fn : "testProperty", input : ["id","foo"], out : false}, label : "!id:foo", data : ".foo -.foo .foo"},{ fn : "query", expect : { fn : "testProperty", input : ["id","foo"], out : true}, label : "id:foo?", data : "foo -foo foo"},{ fn : "query", expect : { fn : "testQueryRoot", input : ["foo"], out : true}, label : "foo should be root-only", data : "/foo"},{ fn : "query", expect : { fn : "testQueryRoot", input : ["foo"], out : false}, label : "foo should recursively selected", data : "/foo foo"}]);
	Test.test([]);
	Test.test([{ fn : "query", expect : { fn : "testProperty", input : ["price","10"], out : true}, data : "price:>=5"},{ fn : "query", expect : { fn : "testProperty", input : ["price","10"], out : false}, data : "price:>=15"},{ fn : "query", expect : { fn : "testProperty", input : ["price","4"], out : false}, data : "price:>=5"},{ fn : "query", expect : { fn : "testProperty", input : ["price","0"], out : false}, data : "price:>=5"},{ fn : "query", expect : { fn : "testProperty", input : ["price","2"], out : true}, data : "price:>=2"},{ fn : "query", expect : { fn : "testProperty", input : ["price","1"], out : false}, label : "price=1", data : "price:>=5 price:0"},{ fn : "query", expect : { fn : "testProperty", input : ["price","0"], out : true}, label : "price=0", data : "price:>=5 price:0"},{ fn : "query", expect : { fn : "testProperty", input : ["price","6"], out : true}, label : "price=6", data : "price:>=5 price:0"},{ fn : "query", expect : { fn : "testProperty", input : ["tag","foo"], out : true}, data : "tag:foo"},{ fn : "query", expect : { fn : "testProperty", input : ["tag","foo"], out : false}, data : "-tag:foo"},{ fn : "query", expect : { fn : "testPropertyExclude", input : ["tag","foo"], out : true}, label : "testExclude", data : "-tag:foo"},{ fn : "query", expect : { fn : "test", input : [{ price : 5}], out : true}, data : ".foo price:5 -tag:foo"},{ fn : "query", expect : { fn : "test", input : [{ tag : "foo", price : 5}], out : false}, data : ".foo price:5 -tag:foo"}]);
	if(Test.errors > 1) {
		console.log("src/Test.hx:23:","\n-----\n[ ❌] " + Test.errors + " errors :/");
	}
};
Test.test = function(spec) {
	var Query = xrfragment_Query;
	var _g = 0;
	var _g1 = spec.length;
	while(_g < _g1) {
		var i = _g++;
		var q = null;
		var res = null;
		var valid = false;
		var item = spec[i];
		if(item.fn == "query") {
			q = new xrfragment_Query(item.data);
		}
		if(item.fn == "url") {
			res = xrfragment_URI.parse(item.data,0);
		}
		if(item.expect.fn == "test") {
			valid = item.expect.out == q.test(item.expect.input[0]);
		}
		if(item.expect.fn == "testProperty") {
			valid = item.expect.out == q.testProperty(item.expect.input[0],item.expect.input[1]);
		}
		if(item.expect.fn == "testPropertyExclude") {
			valid = item.expect.out == q.testProperty(item.expect.input[0],item.expect.input[1],true);
		}
		if(item.expect.fn == "testParsed") {
			valid = item.expect.out == Object.prototype.hasOwnProperty.call(res,item.expect.input);
		}
		if(item.expect.fn == "testPredefinedView") {
			valid = Object.prototype.hasOwnProperty.call(res,item.expect.input) && item.expect.out == res[item.expect.input].is(xrfragment_XRF.PV_EXECUTE);
		}
		if(item.expect.fn == "testPropertyAssign") {
			valid = Object.prototype.hasOwnProperty.call(res,item.expect.input) && item.expect.out == res[item.expect.input].is(xrfragment_XRF.PROP_BIND);
		}
		if(item.expect.fn == "testBrowserOverride") {
			var item1 = item.expect.out;
			var this1 = xrfragment_URI.parse(item.data,xrfragment_XRF.NAVIGATOR);
			valid = item1 == Object.prototype.hasOwnProperty.call(this1,item.expect.input);
		}
		if(item.expect.fn == "testEmbedOverride") {
			var item2 = item.expect.out;
			var this2 = xrfragment_URI.parse(item.data,xrfragment_XRF.EMBEDDED);
			valid = item2 == Object.prototype.hasOwnProperty.call(this2,item.expect.input);
		}
		if(item.expect.fn == "equal.string") {
			valid = res[item.expect.input] && item.expect.out == res[item.expect.input].string;
		}
		if(item.expect.fn == "equal.xy") {
			valid = Test.equalXY(res,item);
		}
		if(item.expect.fn == "equal.xyz") {
			valid = Test.equalXYZ(res,item);
		}
		if(item.expect.fn == "equal.multi") {
			valid = Test.equalMulti(res,item);
		}
		if(item.expect.fn == "testQueryRoot") {
			valid = item.expect.out == q.get()[item.expect.input[0]].root;
		}
		var ok = valid ? "[ ✔ ] " : "[ ❌] ";
		console.log("src/Test.hx:49:",ok + Std.string(item.fn) + ": '" + Std.string(item.data) + "'" + (item.label ? "    (" + (item.label ? item.label : item.expect.fn) + ")" : ""));
		if(!valid) {
			Test.errors += 1;
		}
	}
};
Test.equalXY = function(res,item) {
	if(!item.expect.out && !res[item.expect.input]) {
		return true;
	} else if(res[item.expect.input]) {
		return item.expect.out == Std.string(res[item.expect.input].x) + "," + Std.string(res[item.expect.input].y);
	} else {
		return false;
	}
};
Test.equalXYZ = function(res,item) {
	if(!item.expect.out && !res[item.expect.input]) {
		return true;
	} else if(res[item.expect.input]) {
		return item.expect.out == Std.string(res[item.expect.input].x) + "," + Std.string(res[item.expect.input].y) + "," + Std.string(res[item.expect.input].z);
	} else {
		return false;
	}
};
Test.equalMulti = function(res,item) {
	var target = res[item.expect.input];
	var str = "";
	if(!target) {
		return false;
	}
	var _g = 0;
	var _g1 = target.args.length;
	while(_g < _g1) {
		var i = _g++;
		str = str + "|" + target.args[i].string;
	}
	str = HxOverrides.substr(str,1,null);
	if(item.expect.out) {
		return str == item.expect.out;
	} else {
		return false;
	}
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
xrfragment_Parser.parse = function(key,value,resultMap) {
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
		resultMap[key] = v;
		return true;
	}
	if(key.split(".").length > 1 && value.split(".").length > 1) {
		resultMap[key] = new xrfragment_XRF(key,xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_STRING | xrfragment_XRF.PROP_BIND);
		return true;
	}
	if(Object.prototype.hasOwnProperty.call(Frag_h,key)) {
		var v = new xrfragment_XRF(key,Frag_h[key]);
		if(!v.validate(value)) {
			console.log("src/xrfragment/Parser.hx:79:","⚠ fragment '" + key + "' has incompatible value (" + value + ")");
			return false;
		}
		if(xrfragment_Parser.debug) {
			console.log("src/xrfragment/Parser.hx:82:","✔ " + key + ": " + v.string);
		}
		resultMap[key] = v;
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
	,parse: function(str,recurse) {
		if(recurse == null) {
			recurse = false;
		}
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
Test.errors = 0;
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
Test.main();
})({});
var xrfragment = $hx_exports["xrfragment"];
