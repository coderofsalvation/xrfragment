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
Reflect.copy = function(o) {
	if(o == null) {
		return null;
	}
	var o2 = { };
	var _g = 0;
	var _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
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
var Test = function() { };
Test.__name__ = true;
Test.main = function() {
	Test.test("url.json",[{ fn : "url", expect : { fn : "testPredefinedView", input : "mypredefinedview", out : true}, label : "test predefined view executed", data : "http://foo.com?foo=1#mypredefinedview"},{ fn : "url", expect : { fn : "testPredefinedView", input : "another", out : true}, label : "test predefined view executed (multiple)", data : "http://foo.com?foo=1#mypredefinedview&another"},{ fn : "url", expect : { fn : "testPredefinedView", input : "mypredefinedview", out : true}, label : "test predefined view executed (multiple)", data : "http://foo.com?foo=1#mypredefinedview&another"},{ fn : "url", expect : { fn : "testParsed", input : "mycustom", out : true}, label : "test custom property", data : "http://foo.com?foo=1#mycustom=foo"}]);
	Test.test("pos.json",[{ fn : "url", expect : { fn : "equal.string", input : "pos", out : "1.2,2.2"}, label : "equal.string", data : "http://foo.com?foo=1#pos=1.2,2.2"},{ fn : "url", expect : { fn : "equal.xyz", input : "pos", out : "1.2,2.2,3"}, label : "equal.xyz", data : "http://foo.com?foo=1#pos=1.2,2.2,3"},{ fn : "url", expect : { fn : "equal.xyz", input : "pos", out : "1,2,3"}, label : "pos equal.xyz", data : "http://foo.com?foo=1#pos=1,2,3"},{ fn : "url", expect : { fn : "equal.string", input : "pos", out : "world2"}, label : "pos equal.xyz", data : "http://foo.com?foo=1#pos=world2"}]);
	Test.test("t.json",[{ fn : "url", expect : { fn : "equal.x", input : "t", out : "1"}, label : "a equal.x", data : "http://foo.com?foo=1#t=1"},{ fn : "url", expect : { fn : "equal.x", input : "t", out : "-1"}, label : "a equal.x", data : "http://foo.com?foo=1#t=-1"},{ fn : "url", expect : { fn : "equal.x", input : "t", out : "-1.02"}, label : "a equal.x", data : "http://foo.com?foo=1#t=-1.02"},{ fn : "url", expect : { fn : "equal.xy", input : "t", out : "1,2"}, label : "a equal.xy", data : "http://foo.com?foo=1#t=1,2,3"},{ fn : "url", expect : { fn : "equal.xyz", input : "t", out : "1,2,3"}, label : "a equal.xyz", data : "http://foo.com?foo=1#t=1,2,3"},{ fn : "url", expect : { fn : "equal.xyz", input : "t", out : "1,-2,3"}, label : "a equal.xyz", data : "http://foo.com?foo=1#t=1,-2,3"},{ fn : "url", expect : { fn : "equal.xy", input : "t", out : "1,100"}, label : "a equal.xy", data : "http://foo.com?foo=1#t=1,100"},{ fn : "url", expect : { fn : "testBrowserOverride", input : "t", out : true}, label : "browser URI can override t (defined in asset)", data : "http://foo.com?foo=1#t=2,500"},{ fn : "url", expect : { fn : "equal.mediafragmentT", input : "3", out : "500"}, label : "a equal.mediafragment", data : "http://foo.com?foo=1#t=1,100,400,500*1.2,2.3"},{ fn : "url", expect : { fn : "equal.mediafragmentTSpd", input : "1", out : "2.3"}, label : "a equal.mediafragmentSpeed", data : "http://foo.com?foo=1#t=1,100,400,500*1.2,2.3"}]);
	Test.test("xywh.json",[{ fn : "url", expect : { fn : "equal.mediafragmentXYWH", input : "2", out : "1"}, label : "xywh", data : "http://foo.com?foo=1#xywh=0,0,1,1"},{ fn : "url", expect : { fn : "equal.mediafragmentXYWH", input : "3", out : "500"}, label : "a equal.mediafragment", data : "http://foo.com?foo=1#xywh=1,100,400,500*1.2,2.3"},{ fn : "url", expect : { fn : "equal.mediafragmentXYWHSpd", input : "1", out : "2.3"}, label : "a equal.mediafragmentSpeed", data : "http://foo.com?foo=1#xywh=1,100,400,500*1.2,2.3"}]);
	Test.test("filter.selectors.json",[{ fn : "url", expect : { fn : "testParsed", input : "myid", out : true}, label : "myid exists", data : "http://foo.com?foo=1#foo*&-sometag&-someid&myid"},{ fn : "url", expect : { fn : "testParsed", input : "tag", out : true}, label : "tag exists", data : "http://foo.com?foo=1#tag=bar"},{ fn : "url", expect : { fn : "testParsed", input : "tag", out : true}, label : "tag exists", data : "http://foo.com?foo=1#-tag=bar"},{ fn : "url", expect : { fn : "testParsed", input : "price", out : true}, label : "filter test", data : "http://foo.com?foo=1#price=>2"},{ fn : "filter", expect : { fn : "testProperty", input : ["tag","bar"], out : true}, data : "tag=bar"},{ fn : "filter", expect : { fn : "testProperty", input : ["tag","foo"], out : false}, data : "-tag=foo"},{ fn : "filter", expect : { fn : "testProperty", input : ["tag","foo"], out : false}, data : "-tag*=foo"},{ fn : "filter", expect : { fn : "testProperty", input : ["tag","3"], out : false}, data : "-tag=>2"},{ fn : "filter", expect : { fn : "testProperty", input : ["price","1"], out : false}, data : "price=>2"},{ fn : "filter", expect : { fn : "testProperty", input : ["price","5"], out : false}, data : "price=<2"},{ fn : "filter", expect : { fn : "testProperty", input : ["price","1"], out : true}, data : "price=<2"},{ fn : "url", expect : { fn : "testFilterDeep", input : ["foo"], out : 1}, label : "foo should be deep", data : "#foo*"},{ fn : "url", expect : { fn : "testFilterDeep", input : ["foo"], out : 2}, label : "foo should be deep incl. embeds", data : "#foo**"}]);
	if(Test.errors > 1) {
		console.log("src/Test.hx:24:","\n-----\n[ ❌] " + Test.errors + " errors :/");
	}
};
Test.test = function(topic,spec) {
	console.log("src/Test.hx:28:","\n[.] running " + topic);
	var Filter = xrfragment_Filter;
	var _g = 0;
	var _g1 = spec.length;
	while(_g < _g1) {
		var i = _g++;
		var f = null;
		var res = null;
		var valid = false;
		var item = spec[i];
		f = new xrfragment_Filter(item.data);
		res = xrfragment_URI.parse(item.data,null);
		if(item.expect.fn == "test") {
			valid = item.expect.out == f.test(item.expect.input[0]);
		}
		if(item.expect.fn == "testProperty") {
			valid = item.expect.out == f.testProperty(item.expect.input[0],item.expect.input[1]);
		}
		if(item.expect.fn == "testPropertyInt") {
			valid = item.expect.out == f.testProperty(item.expect.input[0],item.expect.input[1]);
		}
		if(item.expect.fn == "testPropertyExclude") {
			valid = item.expect.out == f.testProperty(item.expect.input[0],item.expect.input[1],true);
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
			var this2 = xrfragment_URI.parse(item.data,xrfragment_XRF.METADATA);
			valid = item2 == Object.prototype.hasOwnProperty.call(this2,item.expect.input);
		}
		if(item.expect.fn == "equal.string") {
			valid = res[item.expect.input] && item.expect.out == res[item.expect.input].string;
		}
		if(item.expect.fn == "equal.x") {
			valid = Test.equalX(res,item);
		}
		if(item.expect.fn == "equal.xy") {
			valid = Test.equalXY(res,item);
		}
		if(item.expect.fn == "equal.xyz") {
			valid = Test.equalXYZ(res,item);
		}
		if(item.expect.fn == "equal.mediafragmentT") {
			valid = Test.equalMediaFragment(res,item,"t");
		}
		if(item.expect.fn == "equal.mediafragmentXYWH") {
			valid = Test.equalMediaFragment(res,item,"xywh");
		}
		if(item.expect.fn == "equal.mediafragmentTSpd") {
			valid = Test.equalMediaFragmentSpd(res,item,"t");
		}
		if(item.expect.fn == "equal.mediafragmentXYWHSpd") {
			valid = Test.equalMediaFragmentSpd(res,item,"xywh");
		}
		if(item.expect.fn == "testFilterRoot") {
			valid = Object.prototype.hasOwnProperty.call(res,item.expect.input[0]) && res[item.expect.input[0]].filter.get().root == item.expect.out;
		}
		if(item.expect.fn == "testFilterDeep") {
			valid = Object.prototype.hasOwnProperty.call(res,item.expect.input[0]) && res[item.expect.input[0]].filter.get().deep == item.expect.out;
		}
		var ok = valid ? "[ ✔ ] " : "[ ❌] ";
		console.log("src/Test.hx:57:",ok + Std.string(item.fn) + ": '" + Std.string(item.data) + "'" + (item.label ? "    (" + (item.label ? item.label : item.expect.fn) + ")" : ""));
		if(!valid) {
			Test.errors += 1;
		}
	}
};
Test.equalX = function(res,item) {
	if(!item.expect.out && !res[item.expect.input]) {
		return true;
	} else if(res[item.expect.input]) {
		return item.expect.out == Std.string(res[item.expect.input].x);
	} else {
		return false;
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
Test.equalMediaFragment = function(res,item,key) {
	if(!item.expect.out && !res[item.expect.input]) {
		return true;
	} else {
		return res[key].floats[Std.parseInt(item.expect.input)] == Std.parseInt(item.expect.out);
	}
};
Test.equalMediaFragmentSpd = function(res,item,key) {
	if(!item.expect.out && !res[item.expect.input]) {
		return true;
	} else {
		return res[key].speed[Std.parseInt(item.expect.input)] == parseFloat(item.expect.out);
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
var xrfragment_Filter = $hx_exports["xrfragment"]["Filter"] = function(str) {
	this.q = { };
	this.str = "";
	if(str != null) {
		this.parse(str);
	}
};
xrfragment_Filter.__name__ = true;
xrfragment_Filter.prototype = {
	toObject: function() {
		return Reflect.copy(this.q);
	}
	,get: function() {
		return Reflect.copy(this.q);
	}
	,parse: function(str) {
		var token = str.split(" ");
		var q = { };
		var process = function(str,prefix) {
			if(prefix == null) {
				prefix = "";
			}
			str = StringTools.trim(str);
			var k = str.split("=")[0];
			var v = str.split("=")[1];
			var filter = { };
			if(q[prefix + k]) {
				filter = q[prefix + k];
			}
			if(xrfragment_XRF.isProp.match(str)) {
				var oper = "";
				if(str.indexOf(">") != -1) {
					oper = ">";
				}
				if(str.indexOf("<") != -1) {
					oper = "<";
				}
				if(xrfragment_XRF.isExclude.match(k)) {
					k = HxOverrides.substr(k,1,null);
				}
				v = HxOverrides.substr(v,oper.length,null);
				if(oper.length == 0) {
					oper = "=";
				}
				var rule = { };
				if(xrfragment_XRF.isNumber.match(v)) {
					rule[oper] = parseFloat(v);
				} else {
					rule[oper] = v;
				}
				q["expr"] = rule;
			}
			var value = xrfragment_XRF.isDeep.match(str) ? k.split("*").length - 1 : 0;
			q["deep"] = value;
			var value = xrfragment_XRF.isExclude.match(str) ? false : true;
			q["show"] = value;
			var value = k.replace(xrfragment_XRF.operators.r,"");
			q["key"] = value;
			q["value"] = v;
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
		if(Reflect.field(this.q,"expr")) {
			var f = Reflect.field(this.q,"expr");
			if(!Reflect.field(this.q,"show")) {
				if(Reflect.field(f,"!=") != null && testprop((value == null ? "null" : "" + value) == Std.string(Reflect.field(f,"!="))) && exclude) {
					++qualify;
				}
			} else {
				if(Reflect.field(f,"*") != null && testprop(parseFloat(value) != null)) {
					++qualify;
				}
				if(Reflect.field(f,">") != null && testprop(parseFloat(value) >= parseFloat(Reflect.field(f,">")))) {
					++qualify;
				}
				if(Reflect.field(f,"<") != null && testprop(parseFloat(value) <= parseFloat(Reflect.field(f,"<")))) {
					++qualify;
				}
				if(Reflect.field(f,"=") != null && (testprop(value == Reflect.field(f,"=")) || testprop(parseFloat(value) == parseFloat(Reflect.field(f,"="))))) {
					++qualify;
				}
			}
		}
		return qualify > 0;
	}
};
var xrfragment_Parser = $hx_exports["xrfragment"]["Parser"] = function() { };
xrfragment_Parser.__name__ = true;
xrfragment_Parser.parse = function(key,value,store,index) {
	var Frag_h = Object.create(null);
	Frag_h["#"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_PREDEFINED_VIEW | xrfragment_XRF.PV_EXECUTE;
	Frag_h["src"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_URL;
	Frag_h["href"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_URL | xrfragment_XRF.T_PREDEFINED_VIEW;
	Frag_h["tag"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_STRING;
	Frag_h["pos"] = xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_VECTOR3 | xrfragment_XRF.T_STRING | xrfragment_XRF.METADATA | xrfragment_XRF.NAVIGATOR;
	Frag_h["rot"] = xrfragment_XRF.QUERY_OPERATOR | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_VECTOR3 | xrfragment_XRF.METADATA | xrfragment_XRF.NAVIGATOR;
	Frag_h["t"] = xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_FLOAT | xrfragment_XRF.T_VECTOR2 | xrfragment_XRF.T_MEDIAFRAG | xrfragment_XRF.NAVIGATOR | xrfragment_XRF.METADATA;
	Frag_h["xywh"] = xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_FLOAT | xrfragment_XRF.T_VECTOR2 | xrfragment_XRF.T_MEDIAFRAG | xrfragment_XRF.NAVIGATOR | xrfragment_XRF.METADATA;
	Frag_h["namespace"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_STRING;
	Frag_h["SPDX"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_STRING;
	Frag_h["unit"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_STRING;
	Frag_h["description"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_STRING;
	Frag_h["session"] = xrfragment_XRF.ASSET | xrfragment_XRF.T_URL | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.NAVIGATOR | xrfragment_XRF.METADATA | xrfragment_XRF.PROMPT;
	var keyStripped = key.replace(xrfragment_XRF.operators.r,"");
	var isPVDynamic = key.length > 0 && !Object.prototype.hasOwnProperty.call(Frag_h,key);
	var isPVDefault = value.length == 0 && key.length > 0 && key == "#";
	if(isPVDynamic) {
		var v = new xrfragment_XRF(key,xrfragment_XRF.PV_EXECUTE | xrfragment_XRF.NAVIGATOR,index);
		v.validate(value);
		v.flags = xrfragment_XRF.set(xrfragment_XRF.T_DYNAMIC,v.flags);
		store[keyStripped] = v;
		return true;
	}
	var v = new xrfragment_XRF(key,Frag_h[key],index);
	if(Object.prototype.hasOwnProperty.call(Frag_h,key)) {
		if(!v.validate(value)) {
			console.log("src/xrfragment/Parser.hx:67:","⚠ fragment '" + key + "' has incompatible value (" + value + ")");
			return false;
		}
		store[keyStripped] = v;
		if(xrfragment_Parser.debug) {
			console.log("src/xrfragment/Parser.hx:71:","✔ " + key + ": " + v.string);
		}
	} else {
		if(typeof(value) == "string") {
			v.guessType(v,value);
		}
		v.noXRF = true;
		store[keyStripped] = v;
	}
	return true;
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
		var ok = xrfragment_Parser.parse(key,value,store,i);
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
var xrfragment_XRF = $hx_exports["xrfragment"]["XRF"] = function(_fragment,_flags,_index) {
	this.speed = [];
	this.floats = [];
	this.fragment = _fragment;
	this.flags = _flags;
	this.index = _index;
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
		var v = this.flags;
		if(!(typeof(v) == "number" && ((v | 0) === v))) {
			this.flags = 0;
		}
		return (this.flags & flag) != 0;
	}
	,validate: function(value) {
		this.guessType(this,value);
		var ok = true;
		if(!this.is(xrfragment_XRF.T_FLOAT) && this.is(xrfragment_XRF.T_VECTOR2) && !(typeof(this.x) == "number" && typeof(this.y) == "number")) {
			ok = false;
		}
		if(!(this.is(xrfragment_XRF.T_VECTOR2) || this.is(xrfragment_XRF.T_STRING)) && this.is(xrfragment_XRF.T_VECTOR3) && !(typeof(this.x) == "number" && typeof(this.y) == "number" && typeof(this.z) == "number")) {
			ok = false;
		}
		return ok;
	}
	,guessType: function(v,str) {
		v.string = str;
		if(typeof(str) != "string") {
			return;
		}
		if(str.length > 0) {
			if(str.split(",").length > 1) {
				var xyzn = str.split(",");
				if(xyzn.length > 0) {
					v.x = parseFloat(xyzn[0]);
				}
				if(xyzn.length > 1) {
					v.y = parseFloat(xyzn[1]);
				}
				if(xyzn.length > 2) {
					v.z = parseFloat(xyzn[2]);
				}
				var _g = 0;
				var _g1 = xyzn.length;
				while(_g < _g1) {
					var i = _g++;
					v.floats.push(parseFloat(xyzn[i]));
				}
			}
			if(xrfragment_XRF.isColor.match(str)) {
				v.color = str;
			}
			if(xrfragment_XRF.isFloat.match(str)) {
				v.x = parseFloat(str);
				v.float = v.x;
			}
			if(xrfragment_XRF.isInt.match(str)) {
				v.int = Std.parseInt(str);
				v.x = v.int;
			}
			if(xrfragment_XRF.isMediaFrag.match(str)) {
				var speed = str.split("*");
				v.speed = [];
				if(speed.length > 1) {
					var values = speed[1].split(",");
					var _g = 0;
					var _g1 = values.length;
					while(_g < _g1) {
						var i = _g++;
						v.speed.push(parseFloat(values[i]));
					}
				}
			}
			v.filter = new xrfragment_Filter(v.fragment + "=" + v.string);
		} else {
			v.filter = new xrfragment_Filter(v.fragment);
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
xrfragment_XRF.T_MEDIAFRAG = 2097152;
xrfragment_XRF.T_DYNAMIC = 4194304;
xrfragment_XRF.isColor = new EReg("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$","");
xrfragment_XRF.isInt = new EReg("^[-0-9]+$","");
xrfragment_XRF.isFloat = new EReg("^[-0-9]+\\.[0-9]+$","");
xrfragment_XRF.isVector = new EReg("([,]+|\\w)","");
xrfragment_XRF.isUrl = new EReg("(://)?\\..*","");
xrfragment_XRF.isUrlOrPretypedView = new EReg("(^#|://)?\\..*","");
xrfragment_XRF.isString = new EReg(".*","");
xrfragment_XRF.operators = new EReg("(^-|[\\*]+)","");
xrfragment_XRF.isProp = new EReg("^.*=[><=]?","");
xrfragment_XRF.isExclude = new EReg("^-","");
xrfragment_XRF.isDeep = new EReg("\\*","");
xrfragment_XRF.isNumber = new EReg("^[0-9\\.]+$","");
xrfragment_XRF.isMediaFrag = new EReg("^[0-9\\.,\\*]+$","");
Test.main();
})({});
var xrfragment = $hx_exports["xrfragment"];
