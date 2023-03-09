var $hx_exports = typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this;
(function ($global) { "use strict";
$hx_exports["xrfragment"] = $hx_exports["xrfragment"] || {};
$hx_exports["xrfragment"]["Query"] = $hx_exports["xrfragment"]["Query"] || {};
var EReg = function(r,opt) {
	this.r = new RegExp(r,opt.split("u").join(""));
};
EReg.prototype = {
	match: function(s) {
		if(this.r.global) {
			this.r.lastIndex = 0;
		}
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
};
var HxOverrides = function() { };
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
var Reflect = function() { };
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
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
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
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
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
})({});
var xrfragment = $hx_exports["xrfragment"];
