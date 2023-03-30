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
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
};
var HxOverrides = function() { };
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
var StringTools = function() { };
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
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
};
var xrfragment_Query = function(str) {
	this.isNumber = new EReg("^[0-9\\.]+$","");
	this.isClass = new EReg("^[-]?class$","");
	this.isExclude = new EReg("^-","");
	this.isProp = new EReg("^.*:[><=!]?","");
	this.q = { };
	if(str != null) {
		this.parse(str);
	}
};
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
				var key = _gthis.isExclude.match(str) ? HxOverrides.substr(str,1,null) : str;
				q[key] = filter;
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
};
var xrfragment_Url = $hx_exports["xrfragment"]["Url"] = function() { };
xrfragment_Url.parse = function(qs) {
	var Frag_h = Object.create(null);
	Frag_h["pos"] = xrfragment_Type.isVector;
	Frag_h["prio"] = xrfragment_Type.isInt;
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
			if(Object.prototype.hasOwnProperty.call(Frag_h,key)) {
				if(Frag_h[key].match(value)) {
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
				} else {
					console.log("src/xrfragment/Url.hx:46:","[ i ] fragment '" + key + "' has incompatible value (" + value + ")");
				}
			} else {
				console.log("src/xrfragment/Url.hx:47:","[ i ] fragment '" + key + "' does not exist or has no type defined (yet)");
			}
		}
	}
	return resultMap;
};
xrfragment_Url.guessType = function(v,str) {
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
			v.y = parseFloat(xyz[2]);
		}
	}
	if(xrfragment_Type.isColor.match(str)) {
		v.color = str;
	}
	if(xrfragment_Type.isFloat.match(str)) {
		v.float = parseFloat(str);
	}
	if(xrfragment_Type.isInt.match(str)) {
		v.int = Std.parseInt(str);
	}
};
var xrfragment_Value = function() {
};
var xrfragment_Type = function() { };
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
xrfragment_Url.error = "";
xrfragment_Type.isColor = new EReg("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$","");
xrfragment_Type.isInt = new EReg("^[0-9]+$","");
xrfragment_Type.isFloat = new EReg("^[0-9]+\\.[0-9]+$","");
xrfragment_Type.isVector = new EReg("([,]+|\\w)","");
})({});
var xrfragment = $hx_exports["xrfragment"];
