var $hx_exports = typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this;
(function ($global) { "use strict";
$hx_exports["xrfragment"] = $hx_exports["xrfragment"] || {};
$hx_exports["xrfragment"]["Query"] = $hx_exports["xrfragment"]["Query"] || {};
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
	Test.test([{ fn : "url", expect : { fn : "equal.string", input : "bar", out : "flop"}, data : "http://foo.com?foo=1#bar=flop&a=1,2&b=c|d|1,2,3"},{ fn : "url", expect : { fn : "equal.xy", input : "a", out : "1.22.2"}, label : "a equal.xy", data : "http://foo.com?foo=1#bar=flop&a=1.2,2.2&b=c|d|1,2,3"},{ fn : "url", expect : { fn : "equal.multi", input : "b", out : "c|d|1,2,3"}, label : "b equal.multi", data : "http://foo.com?foo=1#b=c|d|1,2,3"}]);
	Test.test([{ fn : "query", expect : { fn : "test", input : ["class","bar"], out : true}, data : "class:bar"},{ fn : "query", expect : { fn : "test", input : ["class","bar"], out : true}, label : ".bar shorthand", data : ".bar"},{ fn : "query", expect : { fn : "test", input : ["class","foo"], out : false}, data : ".bar -.foo"},{ fn : "query", expect : { fn : "test", input : ["class","foo"], out : true}, data : ".bar -.foo .foo"},{ fn : "query", expect : { fn : "test", input : ["class","bar"], out : true}, data : ".bar -.bar .bar"},{ fn : "query", expect : { fn : "test", input : ["id","foo"], out : true}, label : "id:foo?", data : "foo -foo foo"},{ fn : "query", expect : { fn : "test", input : ["class","foo"], out : true}, label : "class:foo", data : ".foo -.foo .foo"},{ fn : "query", expect : { fn : "test", input : ["class","foo"], out : true}, label : "class:foo", data : ".foo -.foo bar:5 .foo"},{ fn : "query", expect : { fn : "test", input : ["class","foo"], out : true}, label : "class:foo", data : ".foo -.foo bar:>5 .foo"},{ fn : "query", expect : { fn : "test", input : ["class","foo"], out : true}, label : "class:foo", data : ".foo -.foo bar:>5 .foo"},{ fn : "query", expect : { fn : "test", input : ["class","foo"], out : true}, label : "class:foo", data : ".foo -.foo .foo"},{ fn : "query", expect : { fn : "test", input : ["id","foo"], out : false}, label : "!id:foo", data : ".foo -.foo .foo"}]);
	Test.test([{ fn : "query", expect : { fn : "test", input : ["price","10"], out : true}, data : "price:>=5"},{ fn : "query", expect : { fn : "test", input : ["price","10"], out : false}, data : "price:>=15"},{ fn : "query", expect : { fn : "test", input : ["price","4"], out : false}, data : "price:>=5"},{ fn : "query", expect : { fn : "test", input : ["price","0"], out : false}, data : "price:>=5"}]);
};
Test.test = function(spec) {
	var Query = xrfragment_Query;
	var errors = 0;
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
			res = xrfragment_Url.parse(item.data);
		}
		if(item.expect.fn == "test") {
			valid = item.expect.out == q.test(item.expect.input[0],item.expect.input[1]);
		}
		if(item.expect.fn == "equal.string") {
			valid = item.expect.out == res[item.expect.input].string;
		}
		if(item.expect.fn == "equal.xy") {
			valid = item.expect.out == Std.string(res[item.expect.input].x) + Std.string(res[item.expect.input].y);
		}
		if(item.expect.fn == "equal.multi") {
			valid = Test.equalMulti(res,item);
		}
		var ok = valid ? "[ ✔ ] " : "[ ❌] ";
		console.log("src/Test.hx:36:",ok + Std.string(item.fn) + ": '" + Std.string(item.data) + "'" + (item.label ? " <= " + (item.label ? item.label : item.expect.fn) : ""));
		if(!valid) {
			++errors;
		}
	}
	if(errors > 1) {
		console.log("src/Test.hx:39:","\n-----\n[ ❌] " + errors + " errors :/");
	}
};
Test.equalMulti = function(res,item) {
	var target = res[item.expect.input];
	var str = "";
	var _g = 0;
	var _g1 = target.args.length;
	while(_g < _g1) {
		var i = _g++;
		str = str + "|" + target.args[i].string;
	}
	str = HxOverrides.substr(str,1,null);
	return str == item.expect.out;
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
var xrfragment_Query = function(str) {
	this.isExclude = new EReg("^-","");
	this.isProp = new EReg("^.*:[><=!]?","");
	this.q = { };
	if(str != null) {
		this.parse(str);
	}
};
xrfragment_Query.__name__ = true;
xrfragment_Query.prototype = {
	expandAliases: function(token) {
		var classAlias = new EReg("^(-)?\\.","");
		if(classAlias.match(token)) {
			return StringTools.replace(token,".","class:");
		} else {
			return token;
		}
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
			var value = { };
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
				if(str.indexOf("!=") != -1) {
					oper = "!=";
				}
				if(str.indexOf(">=") != -1) {
					oper = ">=";
				}
				if(str.indexOf("<=") != -1) {
					oper = "<=";
				}
				var k = str.split(":")[0];
				var v = str.split(":")[1];
				if(q[prefix + k]) {
					value = q[prefix + k];
				}
				if(oper.length > 0) {
					value[oper] = parseFloat(HxOverrides.substr(v,oper.length,null));
					q[k] = value;
				} else {
					value[prefix + (_gthis.isExclude.match(k) ? HxOverrides.substr(k,1,null) : k)] = _gthis.isExclude.match(k) == false;
					q[v] = value;
				}
				return;
			} else {
				value["id"] = _gthis.isExclude.match(str) ? false : true;
				var key = _gthis.isExclude.match(str) ? HxOverrides.substr(str,1,null) : str;
				q[key] = value;
			}
		};
		var _g = 0;
		var _g1 = token.length;
		while(_g < _g1) {
			var i = _g++;
			process(this.expandAliases(token[i]));
		}
		this.q = q;
		return this.q;
	}
	,test: function(property,value) {
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
			var qval = Reflect.field(this.q,k);
			if(typeof(value) == "string") {
				continue;
			}
			if(Reflect.field(qval,"=") != null && testprop(value == Reflect.field(qval,"="))) {
				++qualify;
			}
			if(Reflect.field(qval,"*") != null && testprop(value != null)) {
				++qualify;
			}
			if(Reflect.field(qval,">") != null && testprop(value > parseFloat(Reflect.field(qval,">")))) {
				++qualify;
			}
			if(Reflect.field(qval,"<") != null && testprop(value < parseFloat(Reflect.field(qval,"<")))) {
				++qualify;
			}
			if(Reflect.field(qval,">=") != null && testprop(value >= parseFloat(Reflect.field(qval,">=")))) {
				++qualify;
			}
			if(Reflect.field(qval,"<=") != null && testprop(value >= parseFloat(Reflect.field(qval,"<=")))) {
				++qualify;
			}
			if(Reflect.field(qval,"!=") != null && testprop(value != parseFloat(Reflect.field(qval,"!=")))) {
				++qualify;
			}
		}
		return qualify > 0;
	}
};
var xrfragment_Value = $hx_exports["xrfragment"]["Value"] = function() {
};
xrfragment_Value.__name__ = true;
var xrfragment_Url = function() { };
xrfragment_Url.__name__ = true;
xrfragment_Url.parse = function(qs) {
	var fragment = qs.split("#");
	var splitArray = fragment[1].split("&");
	var regexPlus = new EReg("\\+","g");
	var resultMap = { };
	var _g = 0;
	var _g1 = splitArray.length;
	while(_g < _g1) {
		var i = _g++;
		var splitByEqual = splitArray[i].split("=");
		var key = splitByEqual[0];
		var v = new xrfragment_Value();
		if(splitByEqual.length > 1) {
			var s = regexPlus.split(splitByEqual[1]).join(" ");
			var value = decodeURIComponent(s.split("+").join(" "));
			xrfragment_Url.guessType(v,value);
			if(value.split("|").length > 1) {
				v.args = [];
				var args = value.split("|");
				var _g2 = 0;
				var _g3 = args.length;
				while(_g2 < _g3) {
					var i1 = _g2++;
					var x = new xrfragment_Value();
					xrfragment_Url.guessType(x,args[i1]);
					v.args.push(x);
				}
			}
			resultMap[key] = v;
		}
	}
	return resultMap;
};
xrfragment_Url.guessType = function(v,str) {
	var isColor = new EReg("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$","");
	var isInt = new EReg("^[0-9]+$","");
	var isFloat = new EReg("^[0-9]+\\.[0-9]+$","");
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
	if(isColor.match(str)) {
		v.color = str;
	}
	if(isFloat.match(str)) {
		v.float = parseFloat(str);
	}
	if(isInt.match(str)) {
		v.int = Std.parseInt(str);
	}
};
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
String.__name__ = true;
Array.__name__ = true;
js_Boot.__toStr = ({ }).toString;
var xrfragment_Query_ok = $hx_exports["xrfragment"]["Query"]["ok"] = 
    // haxe workarounds
    Array.prototype.contains = Array.prototype.includes

    if (typeof Array.prototype.remove !== "function") {
      Array.prototype.remove = function (item) {
        const oldLength = this.length
        let newLength = 0

        for (let i = 0; i < oldLength; i++) {
          const entry = this[i]
          if (entry === item) {
            let newLength = i++

            while (i !== this.length) {
              const entry = this[i]
              if (entry !== item) this[newLength++] = entry
              i++
            }

            this.length = newLength
            for (let i = newLength; i < oldLength; i++) delete this[i]
            return true
          }
        }
        return false
      }
    }
  ;
Test.main();
})({});
var xrfragment = $hx_exports["xrfragment"];
