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
var Test = function() { };
Test.__name__ = true;
Test.main = function() {
	console.log("src/Test.hx:7:","starting tests");
	Test.testUrl();
};
Test.testUrl = function() {
	var Url = xrfragment_Url;
	var uri = "http://foo.com?foo=1#bar=flop&a=1,2&b=c|d|1,2,3";
	console.log("src/Test.hx:15:",uri);
	var tmp = Url.parse(uri);
	console.log("src/Test.hx:16:",tmp == null ? "null" : haxe_ds_StringMap.stringify(tmp.h));
};
var haxe_ds_StringMap = function() {
	this.h = Object.create(null);
};
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.stringify = function(h) {
	var s = "{";
	var first = true;
	for (var key in h) {
		if (first) first = false; else s += ',';
		s += key + ' => ' + Std.string(h[key]);
	}
	return s + "}";
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
	this.preset = "";
	this.accept = false;
	this.exclude = [];
	this.include = [];
	this.q = { };
	if(str != null) {
		this.parse(str);
	}
};
xrfragment_Query.__name__ = true;
xrfragment_Query.prototype = {
	qualify: function(nodename) {
		if(this.q.copy_all) {
			this.accept = true;
		}
		if(this.include.indexOf(nodename) != -1) {
			this.accept = true;
		}
		if(this.exclude.indexOf(nodename) != -1) {
			this.accept = false;
		}
		return this.accept;
	}
	,parse: function(str,recurse) {
		if(recurse == null) {
			recurse = false;
		}
		var _gthis = this;
		var copyAll = recurse ? this.q.copy_all : HxOverrides.substr(str,0,1) == "-" || HxOverrides.substr(str,0,1) == "?" || str == "";
		var isOr = new EReg("^or$","");
		var isProp = new EReg(".*:[><=!]?","");
		var isName = new EReg("[^:/]","");
		var isExclude = new EReg("^-","");
		var isInclude = new EReg("^\\+","");
		var isPreset = new EReg("^\\?","");
		var token = str.split(" ");
		var ors = [];
		var q = { };
		var composeQuery = function() {
			q = { };
			var value = [];
			q["object"] = value;
			var value = [];
			q["-object"] = value;
			ors.push(q);
			return q;
		};
		composeQuery();
		var match = null;
		match = function(str,prefix) {
			if(prefix == null) {
				prefix = "";
			}
			if(isPreset.match(str) && !recurse) {
				_gthis.preset = str;
				return;
			}
			if(isExclude.match(str) || isInclude.match(str)) {
				var t = HxOverrides.substr(str,1,null);
				match(t,HxOverrides.substr(str,0,1));
				return;
			}
			if(isProp.match(str)) {
				var skip = 0;
				var type = "=";
				if(str.indexOf("*") != -1) {
					type = "*";
				}
				if(str.indexOf(">") != -1) {
					type = ">";
				}
				if(str.indexOf("<") != -1) {
					type = "<";
				}
				if(str.indexOf("!=") != -1) {
					type = "!=";
				}
				if(str.indexOf(">=") != -1) {
					type = ">=";
				}
				if(str.indexOf("<=") != -1) {
					type = "<=";
				}
				if(type != "=") {
					skip += type.length;
				}
				var property = str.split(":")[0];
				var value;
				if(q[prefix + property]) {
					value = q[prefix + property];
				} else {
					value = { };
				}
				value[type] = HxOverrides.substr(str.split(":")[1],skip,null);
				q[prefix + property] = value;
				return;
			}
			if(isName.match(str)) {
				if(prefix == "-") {
					q["-object"].push(str);
					while(q["object"].contains(str) == true) q["object"].remove(str);
				} else {
					q["object"].push(str);
					while(q["-object"].contains(str) == true) q["-object"].remove(str);
				}
				return;
			}
		};
		var _g = 0;
		var _g1 = token.length;
		while(_g < _g1) {
			var i = _g++;
			if(isOr.match(token[i])) {
				composeQuery();
			} else {
				match(token[i]);
			}
		}
		var _g = 0;
		var _g1 = ors.length;
		while(_g < _g1) {
			var i = _g++;
			var or = ors[i];
			if(Reflect.field(or,"object") != null) {
				this.include = this.include.concat(Reflect.field(or,"object"));
			}
			if(Reflect.field(or,"-object") != null) {
				this.exclude = this.exclude.concat(Reflect.field(or,"-object"));
			}
		}
		this.q = { or : ors, copy_all : copyAll};
		return this.q;
	}
	,test: function(property,value) {
		if(this.preset == property) {
			this.parse(value,true);
		}
		var _g = 0;
		var _g1 = this.q.or.length;
		while(_g < _g1) {
			var i = _g++;
			var or = this.q.or[i];
			var conds = [0];
			var fails = [0];
			var pass = 0;
			var when = (function(fails,conds) {
				return function(expr) {
					conds[0] += 1;
					fails[0] += expr ? 0 : 1;
					return expr;
				};
			})(fails,conds);
			var _g2 = 0;
			var _g3 = Reflect.fields(or);
			while(_g2 < _g3.length) {
				var k = _g3[_g2];
				++_g2;
				var orval = Reflect.field(or,k);
				if(k != property) {
					continue;
				}
				if(Reflect.field(orval,"=") != null && when(value == Reflect.field(orval,"="))) {
					++pass;
				}
				if(Reflect.field(orval,"*") != null && when(value != null)) {
					++pass;
				}
				if(Reflect.field(orval,">") != null && when(value > Std.parseInt(Reflect.field(orval,">")))) {
					++pass;
				}
				if(Reflect.field(orval,"<") != null && when(value < Std.parseInt(Reflect.field(orval,"<")))) {
					++pass;
				}
				if(Reflect.field(orval,">=") != null && when(value >= Std.parseInt(Reflect.field(orval,">=")))) {
					++pass;
				}
				if(Reflect.field(orval,"<=") != null && when(value >= Std.parseInt(Reflect.field(orval,"<=")))) {
					++pass;
				}
				if(Reflect.field(orval,"!=") != null && when(value != Std.parseInt(Reflect.field(orval,"!=")))) {
					++pass;
				}
			}
			if(this.accept && conds[0] > 0 && fails[0] > 0) {
				this.accept = false;
			}
			if(conds[0] > 0 && pass > 0 && fails[0] == 0) {
				this.accept = true;
			}
		}
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
	var resultMap = new haxe_ds_StringMap();
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
			resultMap.h[key] = v;
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
