var $hx_exports = typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this;
(function ($global) { "use strict";
$hx_exports["xrfragment"] = $hx_exports["xrfragment"] || {};
var $estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
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
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) {
			return this.r.m[n];
		} else {
			throw haxe_Exception.thrown("EReg::matched");
		}
	}
	,matchedRight: function() {
		if(this.r.m == null) {
			throw haxe_Exception.thrown("No string matched");
		}
		var sz = this.r.m.index + this.r.m[0].length;
		return HxOverrides.substr(this.r.s,sz,this.r.s.length - sz);
	}
	,matchedPos: function() {
		if(this.r.m == null) {
			throw haxe_Exception.thrown("No string matched");
		}
		return { pos : this.r.m.index, len : this.r.m[0].length};
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
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) {
		return null;
	} else {
		var tmp1;
		if(o.__properties__) {
			tmp = o.__properties__["get_" + field];
			tmp1 = tmp;
		} else {
			tmp1 = false;
		}
		if(tmp1) {
			return o[tmp]();
		} else {
			return o[field];
		}
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
Reflect.isObject = function(v) {
	if(v == null) {
		return false;
	}
	var t = typeof(v);
	if(!(t == "string" || t == "object" && v.__enum__ == null)) {
		if(t == "function") {
			return (v.__name__ || v.__ename__) != null;
		} else {
			return false;
		}
	} else {
		return true;
	}
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
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
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
var haxe_Exception = function(message,previous,native) {
	Error.call(this,message);
	this.message = message;
	this.__previousException = previous;
	this.__nativeException = native != null ? native : this;
};
haxe_Exception.__name__ = true;
haxe_Exception.caught = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value;
	} else if(((value) instanceof Error)) {
		return new haxe_Exception(value.message,null,value);
	} else {
		return new haxe_ValueException(value,null,value);
	}
};
haxe_Exception.thrown = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value.get_native();
	} else if(((value) instanceof Error)) {
		return value;
	} else {
		var e = new haxe_ValueException(value);
		return e;
	}
};
haxe_Exception.__super__ = Error;
haxe_Exception.prototype = $extend(Error.prototype,{
	unwrap: function() {
		return this.__nativeException;
	}
	,get_native: function() {
		return this.__nativeException;
	}
	,__properties__: {get_native:"get_native"}
});
var haxe__$Template_TemplateExpr = $hxEnums["haxe._Template.TemplateExpr"] = { __ename__:true,__constructs__:null
	,OpVar: ($_=function(v) { return {_hx_index:0,v:v,__enum__:"haxe._Template.TemplateExpr",toString:$estr}; },$_._hx_name="OpVar",$_.__params__ = ["v"],$_)
	,OpExpr: ($_=function(expr) { return {_hx_index:1,expr:expr,__enum__:"haxe._Template.TemplateExpr",toString:$estr}; },$_._hx_name="OpExpr",$_.__params__ = ["expr"],$_)
	,OpIf: ($_=function(expr,eif,eelse) { return {_hx_index:2,expr:expr,eif:eif,eelse:eelse,__enum__:"haxe._Template.TemplateExpr",toString:$estr}; },$_._hx_name="OpIf",$_.__params__ = ["expr","eif","eelse"],$_)
	,OpStr: ($_=function(str) { return {_hx_index:3,str:str,__enum__:"haxe._Template.TemplateExpr",toString:$estr}; },$_._hx_name="OpStr",$_.__params__ = ["str"],$_)
	,OpBlock: ($_=function(l) { return {_hx_index:4,l:l,__enum__:"haxe._Template.TemplateExpr",toString:$estr}; },$_._hx_name="OpBlock",$_.__params__ = ["l"],$_)
	,OpForeach: ($_=function(expr,loop) { return {_hx_index:5,expr:expr,loop:loop,__enum__:"haxe._Template.TemplateExpr",toString:$estr}; },$_._hx_name="OpForeach",$_.__params__ = ["expr","loop"],$_)
	,OpMacro: ($_=function(name,params) { return {_hx_index:6,name:name,params:params,__enum__:"haxe._Template.TemplateExpr",toString:$estr}; },$_._hx_name="OpMacro",$_.__params__ = ["name","params"],$_)
};
haxe__$Template_TemplateExpr.__constructs__ = [haxe__$Template_TemplateExpr.OpVar,haxe__$Template_TemplateExpr.OpExpr,haxe__$Template_TemplateExpr.OpIf,haxe__$Template_TemplateExpr.OpStr,haxe__$Template_TemplateExpr.OpBlock,haxe__$Template_TemplateExpr.OpForeach,haxe__$Template_TemplateExpr.OpMacro];
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
var haxe_Template = function(str) {
	var tokens = this.parseTokens(str);
	this.expr = this.parseBlock(tokens);
	if(!tokens.isEmpty()) {
		throw haxe_Exception.thrown("Unexpected '" + Std.string(tokens.first().s) + "'");
	}
};
haxe_Template.__name__ = true;
haxe_Template.prototype = {
	execute: function(context,macros) {
		this.macros = macros == null ? { } : macros;
		this.context = context;
		this.stack = new haxe_ds_List();
		this.buf = new StringBuf();
		this.run(this.expr);
		return this.buf.b;
	}
	,resolve: function(v) {
		if(v == "__current__") {
			return this.context;
		}
		if(Reflect.isObject(this.context)) {
			var value = Reflect.getProperty(this.context,v);
			if(value != null || Object.prototype.hasOwnProperty.call(this.context,v)) {
				return value;
			}
		}
		var _g_head = this.stack.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var ctx = val;
			var value = Reflect.getProperty(ctx,v);
			if(value != null || Object.prototype.hasOwnProperty.call(ctx,v)) {
				return value;
			}
		}
		return Reflect.field(haxe_Template.globals,v);
	}
	,parseTokens: function(data) {
		var tokens = new haxe_ds_List();
		while(haxe_Template.splitter.match(data)) {
			var p = haxe_Template.splitter.matchedPos();
			if(p.pos > 0) {
				tokens.add({ p : HxOverrides.substr(data,0,p.pos), s : true, l : null});
			}
			if(HxOverrides.cca(data,p.pos) == 58) {
				tokens.add({ p : HxOverrides.substr(data,p.pos + 2,p.len - 4), s : false, l : null});
				data = haxe_Template.splitter.matchedRight();
				continue;
			}
			var parp = p.pos + p.len;
			var npar = 1;
			var params = [];
			var part = "";
			while(true) {
				var c = HxOverrides.cca(data,parp);
				++parp;
				if(c == 40) {
					++npar;
				} else if(c == 41) {
					--npar;
					if(npar <= 0) {
						break;
					}
				} else if(c == null) {
					throw haxe_Exception.thrown("Unclosed macro parenthesis");
				}
				if(c == 44 && npar == 1) {
					params.push(part);
					part = "";
				} else {
					part += String.fromCodePoint(c);
				}
			}
			params.push(part);
			tokens.add({ p : haxe_Template.splitter.matched(2), s : false, l : params});
			data = HxOverrides.substr(data,parp,data.length - parp);
		}
		if(data.length > 0) {
			tokens.add({ p : data, s : true, l : null});
		}
		return tokens;
	}
	,parseBlock: function(tokens) {
		var l = new haxe_ds_List();
		while(true) {
			var t = tokens.first();
			if(t == null) {
				break;
			}
			if(!t.s && (t.p == "end" || t.p == "else" || HxOverrides.substr(t.p,0,7) == "elseif ")) {
				break;
			}
			l.add(this.parse(tokens));
		}
		if(l.length == 1) {
			return l.first();
		}
		return haxe__$Template_TemplateExpr.OpBlock(l);
	}
	,parse: function(tokens) {
		var t = tokens.pop();
		var p = t.p;
		if(t.s) {
			return haxe__$Template_TemplateExpr.OpStr(p);
		}
		if(t.l != null) {
			var pe = new haxe_ds_List();
			var _g = 0;
			var _g1 = t.l;
			while(_g < _g1.length) {
				var p1 = _g1[_g];
				++_g;
				pe.add(this.parseBlock(this.parseTokens(p1)));
			}
			return haxe__$Template_TemplateExpr.OpMacro(p,pe);
		}
		var kwdEnd = function(kwd) {
			var pos = -1;
			var length = kwd.length;
			if(HxOverrides.substr(p,0,length) == kwd) {
				pos = length;
				var _g_offset = 0;
				var _g_s = HxOverrides.substr(p,length,null);
				while(_g_offset < _g_s.length) {
					var c = _g_s.charCodeAt(_g_offset++);
					if(c == 32) {
						++pos;
					} else {
						break;
					}
				}
			}
			return pos;
		};
		var pos = kwdEnd("if");
		if(pos > 0) {
			p = HxOverrides.substr(p,pos,p.length - pos);
			var e = this.parseExpr(p);
			var eif = this.parseBlock(tokens);
			var t = tokens.first();
			var eelse;
			if(t == null) {
				throw haxe_Exception.thrown("Unclosed 'if'");
			}
			if(t.p == "end") {
				tokens.pop();
				eelse = null;
			} else if(t.p == "else") {
				tokens.pop();
				eelse = this.parseBlock(tokens);
				t = tokens.pop();
				if(t == null || t.p != "end") {
					throw haxe_Exception.thrown("Unclosed 'else'");
				}
			} else {
				t.p = HxOverrides.substr(t.p,4,t.p.length - 4);
				eelse = this.parse(tokens);
			}
			return haxe__$Template_TemplateExpr.OpIf(e,eif,eelse);
		}
		var pos = kwdEnd("foreach");
		if(pos >= 0) {
			p = HxOverrides.substr(p,pos,p.length - pos);
			var e = this.parseExpr(p);
			var efor = this.parseBlock(tokens);
			var t = tokens.pop();
			if(t == null || t.p != "end") {
				throw haxe_Exception.thrown("Unclosed 'foreach'");
			}
			return haxe__$Template_TemplateExpr.OpForeach(e,efor);
		}
		if(haxe_Template.expr_splitter.match(p)) {
			return haxe__$Template_TemplateExpr.OpExpr(this.parseExpr(p));
		}
		return haxe__$Template_TemplateExpr.OpVar(p);
	}
	,parseExpr: function(data) {
		var l = new haxe_ds_List();
		var expr = data;
		while(haxe_Template.expr_splitter.match(data)) {
			var p = haxe_Template.expr_splitter.matchedPos();
			var k = p.pos + p.len;
			if(p.pos != 0) {
				l.add({ p : HxOverrides.substr(data,0,p.pos), s : true});
			}
			var p1 = haxe_Template.expr_splitter.matched(0);
			l.add({ p : p1, s : p1.indexOf("\"") >= 0});
			data = haxe_Template.expr_splitter.matchedRight();
		}
		if(data.length != 0) {
			var _g_offset = 0;
			var _g_s = data;
			while(_g_offset < _g_s.length) {
				var _g1_key = _g_offset;
				var _g1_value = _g_s.charCodeAt(_g_offset++);
				var i = _g1_key;
				var c = _g1_value;
				if(c != 32) {
					l.add({ p : HxOverrides.substr(data,i,null), s : true});
					break;
				}
			}
		}
		var e;
		try {
			e = this.makeExpr(l);
			if(!l.isEmpty()) {
				throw haxe_Exception.thrown(l.first().p);
			}
		} catch( _g ) {
			var _g1 = haxe_Exception.caught(_g).unwrap();
			if(typeof(_g1) == "string") {
				var s = _g1;
				throw haxe_Exception.thrown("Unexpected '" + s + "' in " + expr);
			} else {
				throw _g;
			}
		}
		return function() {
			try {
				return e();
			} catch( _g ) {
				var exc = haxe_Exception.caught(_g).unwrap();
				throw haxe_Exception.thrown("Error : " + Std.string(exc) + " in " + expr);
			}
		};
	}
	,makeConst: function(v) {
		haxe_Template.expr_trim.match(v);
		v = haxe_Template.expr_trim.matched(1);
		if(HxOverrides.cca(v,0) == 34) {
			var str = HxOverrides.substr(v,1,v.length - 2);
			return function() {
				return str;
			};
		}
		if(haxe_Template.expr_int.match(v)) {
			var i = Std.parseInt(v);
			return function() {
				return i;
			};
		}
		if(haxe_Template.expr_float.match(v)) {
			var f = parseFloat(v);
			return function() {
				return f;
			};
		}
		var me = this;
		return function() {
			return me.resolve(v);
		};
	}
	,makePath: function(e,l) {
		var p = l.first();
		if(p == null || p.p != ".") {
			return e;
		}
		l.pop();
		var field = l.pop();
		if(field == null || !field.s) {
			throw haxe_Exception.thrown(field.p);
		}
		var f = field.p;
		haxe_Template.expr_trim.match(f);
		f = haxe_Template.expr_trim.matched(1);
		return this.makePath(function() {
			return Reflect.field(e(),f);
		},l);
	}
	,makeExpr: function(l) {
		return this.makePath(this.makeExpr2(l),l);
	}
	,skipSpaces: function(l) {
		var p = l.first();
		while(p != null) {
			var _g_offset = 0;
			var _g_s = p.p;
			while(_g_offset < _g_s.length) {
				var c = _g_s.charCodeAt(_g_offset++);
				if(c != 32) {
					return;
				}
			}
			l.pop();
			p = l.first();
		}
	}
	,makeExpr2: function(l) {
		this.skipSpaces(l);
		var p = l.pop();
		this.skipSpaces(l);
		if(p == null) {
			throw haxe_Exception.thrown("<eof>");
		}
		if(p.s) {
			return this.makeConst(p.p);
		}
		switch(p.p) {
		case "!":
			var e = this.makeExpr(l);
			return function() {
				var v = e();
				if(v != null) {
					return v == false;
				} else {
					return true;
				}
			};
		case "(":
			this.skipSpaces(l);
			var e1 = this.makeExpr(l);
			this.skipSpaces(l);
			var p1 = l.pop();
			if(p1 == null || p1.s) {
				throw haxe_Exception.thrown(p1);
			}
			if(p1.p == ")") {
				return e1;
			}
			this.skipSpaces(l);
			var e2 = this.makeExpr(l);
			this.skipSpaces(l);
			var p2 = l.pop();
			this.skipSpaces(l);
			if(p2 == null || p2.p != ")") {
				throw haxe_Exception.thrown(p2);
			}
			switch(p1.p) {
			case "!=":
				return function() {
					return e1() != e2();
				};
			case "&&":
				return function() {
					return e1() && e2();
				};
			case "*":
				return function() {
					return e1() * e2();
				};
			case "+":
				return function() {
					return e1() + e2();
				};
			case "-":
				return function() {
					return e1() - e2();
				};
			case "/":
				return function() {
					return e1() / e2();
				};
			case "<":
				return function() {
					return e1() < e2();
				};
			case "<=":
				return function() {
					return e1() <= e2();
				};
			case "==":
				return function() {
					return e1() == e2();
				};
			case ">":
				return function() {
					return e1() > e2();
				};
			case ">=":
				return function() {
					return e1() >= e2();
				};
			case "||":
				return function() {
					return e1() || e2();
				};
			default:
				throw haxe_Exception.thrown("Unknown operation " + p1.p);
			}
			break;
		case "-":
			var e3 = this.makeExpr(l);
			return function() {
				return -e3();
			};
		}
		throw haxe_Exception.thrown(p.p);
	}
	,run: function(e) {
		switch(e._hx_index) {
		case 0:
			var v = e.v;
			var _this = this.buf;
			var x = Std.string(this.resolve(v));
			_this.b += Std.string(x);
			break;
		case 1:
			var e1 = e.expr;
			var _this = this.buf;
			var x = Std.string(e1());
			_this.b += Std.string(x);
			break;
		case 2:
			var e1 = e.expr;
			var eif = e.eif;
			var eelse = e.eelse;
			var v = e1();
			if(v == null || v == false) {
				if(eelse != null) {
					this.run(eelse);
				}
			} else {
				this.run(eif);
			}
			break;
		case 3:
			var str = e.str;
			this.buf.b += str == null ? "null" : "" + str;
			break;
		case 4:
			var l = e.l;
			var _g_head = l.h;
			while(_g_head != null) {
				var val = _g_head.item;
				_g_head = _g_head.next;
				var e1 = val;
				this.run(e1);
			}
			break;
		case 5:
			var e1 = e.expr;
			var loop = e.loop;
			var v = e1();
			try {
				var x = $getIterator(v);
				if(x.hasNext == null) {
					throw haxe_Exception.thrown(null);
				}
				v = x;
			} catch( _g ) {
				try {
					if(v.hasNext == null) {
						throw haxe_Exception.thrown(null);
					}
				} catch( _g1 ) {
					throw haxe_Exception.thrown("Cannot iter on " + Std.string(v));
				}
			}
			this.stack.push(this.context);
			var v1 = v;
			var ctx = v1;
			while(ctx.hasNext()) {
				var ctx1 = ctx.next();
				this.context = ctx1;
				this.run(loop);
			}
			this.context = this.stack.pop();
			break;
		case 6:
			var m = e.name;
			var params = e.params;
			var v = Reflect.field(this.macros,m);
			var pl = [];
			var old = this.buf;
			pl.push($bind(this,this.resolve));
			var _g_head = params.h;
			while(_g_head != null) {
				var val = _g_head.item;
				_g_head = _g_head.next;
				var p = val;
				if(p._hx_index == 0) {
					var v1 = p.v;
					pl.push(this.resolve(v1));
				} else {
					this.buf = new StringBuf();
					this.run(p);
					pl.push(this.buf.b);
				}
			}
			this.buf = old;
			try {
				var _this = this.buf;
				var x = Std.string(v.apply(this.macros,pl));
				_this.b += Std.string(x);
			} catch( _g ) {
				var e = haxe_Exception.caught(_g).unwrap();
				var plstr;
				try {
					plstr = pl.join(",");
				} catch( _g1 ) {
					plstr = "???";
				}
				var msg = "Macro call " + m + "(" + plstr + ") failed (" + Std.string(e) + ")";
				throw haxe_Exception.thrown(msg);
			}
			break;
		}
	}
};
var haxe_ValueException = function(value,previous,native) {
	haxe_Exception.call(this,String(value),previous,native);
	this.value = value;
};
haxe_ValueException.__name__ = true;
haxe_ValueException.__super__ = haxe_Exception;
haxe_ValueException.prototype = $extend(haxe_Exception.prototype,{
	unwrap: function() {
		return this.value;
	}
});
var haxe_ds_List = function() {
	this.length = 0;
};
haxe_ds_List.__name__ = true;
haxe_ds_List.prototype = {
	add: function(item) {
		var x = new haxe_ds__$List_ListNode(item,null);
		if(this.h == null) {
			this.h = x;
		} else {
			this.q.next = x;
		}
		this.q = x;
		this.length++;
	}
	,push: function(item) {
		var x = new haxe_ds__$List_ListNode(item,this.h);
		this.h = x;
		if(this.q == null) {
			this.q = x;
		}
		this.length++;
	}
	,first: function() {
		if(this.h == null) {
			return null;
		} else {
			return this.h.item;
		}
	}
	,pop: function() {
		if(this.h == null) {
			return null;
		}
		var x = this.h.item;
		this.h = this.h.next;
		if(this.h == null) {
			this.q = null;
		}
		this.length--;
		return x;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,toString: function() {
		var s_b = "";
		var first = true;
		var l = this.h;
		s_b += "{";
		while(l != null) {
			if(first) {
				first = false;
			} else {
				s_b += ", ";
			}
			s_b += Std.string(Std.string(l.item));
			l = l.next;
		}
		s_b += "}";
		return s_b;
	}
};
var haxe_ds__$List_ListNode = function(item,next) {
	this.item = item;
	this.next = next;
};
haxe_ds__$List_ListNode.__name__ = true;
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
		if(o.__enum__) {
			var e = $hxEnums[o.__enum__];
			var con = e.__constructs__[o._hx_index];
			var n = con._hx_name;
			if(con.__params__) {
				s = s + "\t";
				return n + "(" + ((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						var _g2 = con.__params__;
						while(true) {
							if(!(_g1 < _g2.length)) {
								break;
							}
							var p = _g2[_g1];
							_g1 = _g1 + 1;
							_g.push(js_Boot.__string_rec(o[p],s));
						}
					}
					$r = _g;
					return $r;
				}(this))).join(",") + ")";
			} else {
				return n;
			}
		}
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
	Frag_h["#"] = xrfragment_XRF.IMMUTABLE | xrfragment_XRF.T_PREDEFINED_VIEW | xrfragment_XRF.PV_EXECUTE;
	Frag_h["src"] = xrfragment_XRF.T_URL;
	Frag_h["href"] = xrfragment_XRF.T_URL | xrfragment_XRF.T_PREDEFINED_VIEW;
	Frag_h["tag"] = xrfragment_XRF.IMMUTABLE | xrfragment_XRF.T_STRING;
	Frag_h["pos"] = xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_VECTOR3 | xrfragment_XRF.T_STRING | xrfragment_XRF.METADATA | xrfragment_XRF.NAVIGATOR;
	Frag_h["rot"] = xrfragment_XRF.QUERY_OPERATOR | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_VECTOR3 | xrfragment_XRF.METADATA | xrfragment_XRF.NAVIGATOR;
	Frag_h["t"] = xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_FLOAT | xrfragment_XRF.T_VECTOR2 | xrfragment_XRF.NAVIGATOR | xrfragment_XRF.METADATA;
	Frag_h["s"] = xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_MEDIAFRAG;
	Frag_h["loop"] = xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_PREDEFINED_VIEW;
	Frag_h["uv"] = xrfragment_XRF.T_VECTOR2 | xrfragment_XRF.T_MEDIAFRAG;
	Frag_h["namespace"] = xrfragment_XRF.IMMUTABLE | xrfragment_XRF.T_STRING;
	Frag_h["SPDX"] = xrfragment_XRF.IMMUTABLE | xrfragment_XRF.T_STRING;
	Frag_h["unit"] = xrfragment_XRF.IMMUTABLE | xrfragment_XRF.T_STRING;
	Frag_h["description"] = xrfragment_XRF.IMMUTABLE | xrfragment_XRF.T_STRING;
	var keyStripped = key.replace(xrfragment_XRF.operators.r,"");
	var isPVDynamic = key.length > 0 && !Object.prototype.hasOwnProperty.call(Frag_h,key);
	if(isPVDynamic) {
		var v = new xrfragment_XRF(key,xrfragment_XRF.PV_EXECUTE | xrfragment_XRF.NAVIGATOR,index);
		v.validate(value);
		v.flags = xrfragment_XRF.set(xrfragment_XRF.T_DYNAMICKEY,v.flags);
		if(!Object.prototype.hasOwnProperty.call(Frag_h,key)) {
			v.flags = xrfragment_XRF.set(xrfragment_XRF.CUSTOMFRAG,v.flags);
		}
		if(value.length == 0) {
			v.flags = xrfragment_XRF.set(xrfragment_XRF.T_DYNAMICKEYVALUE,v.flags);
		}
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
		v.flags = xrfragment_XRF.set(xrfragment_XRF.CUSTOMFRAG,v.flags);
		store[keyStripped] = v;
	}
	return true;
};
xrfragment_Parser.getMetaData = function() {
	var meta = { title : ["title","og:title","dc.title"], description : ["aria-description","og:description","dc.description"], author : ["author","dc.creator"], publisher : ["publisher","dc.publisher"], website : ["og:site_name","og:url","dc.publisher"], license : ["SPDX","dc.rights"]};
	return meta;
};
var xrfragment_URI = $hx_exports["xrfragment"]["URI"] = function() {
	this.XRF = { };
	this.hash = { };
	this.fragment = "";
};
xrfragment_URI.__name__ = true;
xrfragment_URI.parseFragment = function(url,filter) {
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
			if(xrfragment_XRF.isVector.match(splitByEqual[1])) {
				value = splitByEqual[1];
			} else {
				var s = regexPlus.split(splitByEqual[1]).join(" ");
				value = decodeURIComponent(s.split("+").join(" "));
			}
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
xrfragment_URI.template = function(uri,vars) {
	var parts = uri.split("#");
	if(parts.length == 1) {
		return uri;
	}
	var frag = parts[1];
	frag = StringTools.replace(frag,"{","::");
	frag = StringTools.replace(frag,"}","::");
	frag = new haxe_Template(frag).execute(vars);
	frag = StringTools.replace(frag,"null","");
	parts[1] = frag;
	return parts.join("#");
};
xrfragment_URI.parse = function(stringUrl,flags) {
	var r = new EReg("^(?:(?![^:@]+:[^:@/]*@)([^:/?#.]+):)?(?://)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:/?#]*)(?::(\\d*))?)(((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[?#]|$)))*/?)?([^?#/]*))(?:\\?([^#]*))?(?:#(.*))?)","");
	if(stringUrl.indexOf("://") == -1 && stringUrl.charAt(0) != "/") {
		stringUrl = "/" + stringUrl;
	}
	r.match(stringUrl);
	var url = new xrfragment_URI();
	var _g = 0;
	var _g1 = xrfragment_URI._parts.length;
	while(_g < _g1) {
		var i = _g++;
		url[xrfragment_URI._parts[i]] = r.matched(i);
	}
	if(xrfragment_URI.isRelative(url) == true) {
		if(url.directory == null && url.host != null) {
			url.file = url.host;
		}
		url.host = "";
	}
	url.hash = { };
	if(url.fragment != null && url.fragment.length > 0) {
		url.XRF = xrfragment_URI.parseFragment("#" + url.fragment,flags);
		var key;
		var _g = 0;
		var _g1 = Reflect.fields(url.XRF);
		while(_g < _g1.length) {
			var key = _g1[_g];
			++_g;
			var v = url.XRF[key];
			url.hash[key] = v["string"];
		}
	}
	xrfragment_URI.computeVars(url);
	return url;
};
xrfragment_URI.computeVars = function(url) {
	var r_r = new RegExp("//","g".split("u").join(""));
	if(url.directory != null && url.directory.indexOf("//") != -1) {
		url.directory = url.directory.replace(r_r,"/");
	}
	if(url.path != null && url.path.indexOf("//") != -1) {
		url.path = url.path.replace(r_r,"/");
	}
	if(url.file != null && url.file.indexOf("//") != -1) {
		url.file = url.file.replace(r_r,"/");
	}
	url.URN = url.scheme + "://" + url.host;
	if(url.port != null) {
		url.URN += ":" + url.port;
	}
	url.URN += url.directory;
	if(url.file != null) {
		var parts = url.file.split(".");
		if(parts.length > 1) {
			url.fileExt = parts.pop();
		}
	}
};
xrfragment_URI.toString = function(url) {
	var result = "";
	if(url.scheme != null) {
		result += url.scheme + "://";
	}
	if(url.user != null) {
		result += url.user + ":";
	}
	if(url.password != null) {
		result += url.password + "@";
	}
	if(url.host != null) {
		result += url.host;
	}
	if(url.port != null) {
		result += ":" + url.port;
	}
	if(url.directory != null) {
		result += url.directory;
	}
	if(url.file != null) {
		result += url.file;
	}
	if(url.query != null) {
		result += "?" + url.query;
	}
	if(url.fragment != null) {
		result += "#" + url.fragment;
	}
	return result;
};
xrfragment_URI.appendURI = function(url,appendedURI) {
	if(xrfragment_URI.isRelative(url) == true) {
		return xrfragment_URI.appendToRelativeURI(url,appendedURI);
	} else {
		return xrfragment_URI.appendToAbsoluteURI(url,appendedURI);
	}
};
xrfragment_URI.isRelative = function(url) {
	return url.scheme == null;
};
xrfragment_URI.appendToRelativeURI = function(url,appendedURI) {
	if(url.directory == null || url.host == null) {
		return xrfragment_URI.cloneURI(appendedURI);
	}
	var resultURI = new xrfragment_URI();
	resultURI.host = url.host;
	resultURI.directory = url.directory;
	if(appendedURI.host != null) {
		resultURI.directory += appendedURI.host;
	}
	if(appendedURI.directory != null) {
		var directory = appendedURI.directory;
		if(appendedURI.host == null) {
			resultURI.directory += HxOverrides.substr(directory,1,null);
		} else {
			resultURI.directory += directory;
		}
	}
	if(appendedURI.file != null) {
		resultURI.file = appendedURI.file;
	}
	resultURI.path = resultURI.directory + resultURI.file;
	if(appendedURI.query != null) {
		resultURI.query = appendedURI.query;
	}
	if(appendedURI.fragment != null) {
		resultURI.fragment = appendedURI.fragment;
	}
	return resultURI;
};
xrfragment_URI.appendToAbsoluteURI = function(url,appendedURI) {
	var resultURI = new xrfragment_URI();
	if(url.scheme != null) {
		resultURI.scheme = url.scheme;
	}
	if(url.host != null) {
		resultURI.host = url.host;
	}
	var directory = "";
	if(url.directory != null) {
		directory = url.directory;
	}
	if(appendedURI.host != null) {
		appendedURI.directory += appendedURI.host;
	}
	if(appendedURI.directory != null) {
		directory += appendedURI.directory;
	}
	resultURI.directory = directory;
	if(appendedURI.file != null) {
		resultURI.file = appendedURI.file;
	}
	resultURI.path = resultURI.directory + resultURI.file;
	if(appendedURI.query != null) {
		resultURI.query = appendedURI.query;
	}
	if(appendedURI.fragment != null) {
		resultURI.fragment = appendedURI.fragment;
	}
	return resultURI;
};
xrfragment_URI.toAbsolute = function(url,newUrl) {
	var newURI = xrfragment_URI.parse(newUrl,0);
	var resultURI = new xrfragment_URI();
	resultURI.port = url.port;
	resultURI.source = newUrl;
	if(newURI.scheme != null) {
		resultURI.scheme = newURI.scheme;
	} else {
		resultURI.scheme = url.scheme;
	}
	if(newURI.host != null && newURI.host.length > 0) {
		resultURI.host = newURI.host;
		resultURI.port = null;
		resultURI.fragment = null;
		resultURI.hash = { };
		resultURI.XRF = { };
		if(newURI.port != null) {
			resultURI.port = newURI.port;
		}
	} else {
		resultURI.host = url.host;
	}
	var directory = "";
	if(url.directory != null) {
		directory = url.directory;
	}
	if(newURI.directory != null) {
		if(newUrl.charAt(0) != "/" && newUrl.indexOf("://") == -1) {
			directory += newURI.directory;
		} else {
			directory = newURI.directory;
		}
	}
	resultURI.directory = directory;
	if(newURI.file != null) {
		resultURI.file = newURI.file;
	} else {
		resultURI.file = url.file;
	}
	resultURI.path = resultURI.directory + resultURI.file;
	if(newURI.query != null) {
		resultURI.query = newURI.query;
	}
	if(newURI.fragment != null) {
		resultURI.fragment = newURI.fragment;
	}
	resultURI.hash = newURI.hash;
	resultURI.XRF = newURI.XRF;
	xrfragment_URI.computeVars(resultURI);
	return resultURI;
};
xrfragment_URI.cloneURI = function(url) {
	var clonedURI = new xrfragment_URI();
	clonedURI.url = url.url;
	clonedURI.source = url.source;
	clonedURI.scheme = url.scheme;
	clonedURI.authority = url.authority;
	clonedURI.userInfo = url.userInfo;
	clonedURI.password = url.password;
	clonedURI.host = url.host;
	clonedURI.port = url.port;
	clonedURI.relative = url.relative;
	clonedURI.path = url.path;
	clonedURI.directory = url.directory;
	clonedURI.file = url.file;
	clonedURI.query = url.query;
	clonedURI.fragment = url.fragment;
	return clonedURI;
};
var xrfragment_XRF = $hx_exports["xrfragment"]["XRF"] = function(_fragment,_flags,_index) {
	this.floats = [];
	this.shift = [];
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
		if(value.length == 0 && !this.is(xrfragment_XRF.T_PREDEFINED_VIEW)) {
			ok = false;
		}
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
		if(xrfragment_XRF.isReset.match(v.fragment)) {
			v.reset = true;
		}
		if(v.fragment == "loop") {
			v.loop = true;
		}
		if(typeof(str) != "string") {
			return;
		}
		if(str.length > 0) {
			if(xrfragment_XRF.isXRFScheme.match(str)) {
				v.xrfScheme = true;
				str = str.replace(xrfragment_XRF.isXRFScheme.r,"");
				v.string = str;
			}
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
					v.shift.push(xrfragment_XRF.isShift.match(xyzn[i]));
					v.floats.push(parseFloat(xyzn[i].replace(xrfragment_XRF.isShift.r,"")));
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
				v.floats.push(v.x);
			}
			v.filter = new xrfragment_Filter(v.fragment + "=" + v.string);
		} else {
			v.filter = new xrfragment_Filter(v.fragment);
		}
	}
};
function $getIterator(o) { if( o instanceof Array ) return new haxe_iterators_ArrayIterator(o); else return o.iterator(); }
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $global.$haxeUID++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = m.bind(o); o.hx__closures__[m.__id__] = f; } return f; }
$global.$haxeUID |= 0;
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
if( String.fromCodePoint == null ) String.fromCodePoint = function(c) { return c < 0x10000 ? String.fromCharCode(c) : String.fromCharCode((c>>10)+0xD7C0)+String.fromCharCode((c&0x3FF)+0xDC00); }
String.__name__ = true;
Array.__name__ = true;
js_Boot.__toStr = ({ }).toString;
haxe_Template.splitter = new EReg("(::[A-Za-z0-9_ ()&|!+=/><*.\"-]+::|\\$\\$([A-Za-z0-9_-]+)\\()","");
haxe_Template.expr_splitter = new EReg("(\\(|\\)|[ \r\n\t]*\"[^\"]*\"[ \r\n\t]*|[!+=/><*.&|-]+)","");
haxe_Template.expr_trim = new EReg("^[ ]*([^ ]+)[ ]*$","");
haxe_Template.expr_int = new EReg("^[0-9]+$","");
haxe_Template.expr_float = new EReg("^([+-]?)(?=\\d|,\\d)\\d*(,\\d*)?([Ee]([+-]?\\d+))?$","");
haxe_Template.globals = { };
haxe_Template.hxKeepArrayIterator = new haxe_iterators_ArrayIterator([]);
xrfragment_Parser.error = "";
xrfragment_Parser.debug = false;
xrfragment_URI.__meta__ = { statics : { template : { keep : null}}};
xrfragment_URI._parts = ["source","scheme","authority","userInfo","user","password","host","port","relative","path","directory","file","query","fragment"];
xrfragment_XRF.IMMUTABLE = 1;
xrfragment_XRF.PROP_BIND = 2;
xrfragment_XRF.QUERY_OPERATOR = 4;
xrfragment_XRF.PROMPT = 8;
xrfragment_XRF.CUSTOMFRAG = 16;
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
xrfragment_XRF.T_DYNAMICKEY = 4194304;
xrfragment_XRF.T_DYNAMICKEYVALUE = 8388608;
xrfragment_XRF.isColor = new EReg("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$","");
xrfragment_XRF.isInt = new EReg("^[-0-9]+$","");
xrfragment_XRF.isFloat = new EReg("^[-0-9]+\\.[0-9]+$","");
xrfragment_XRF.isVector = new EReg("([,]+|\\w)","");
xrfragment_XRF.isUrl = new EReg("(://)?\\..*","");
xrfragment_XRF.isUrlOrPretypedView = new EReg("(^#|://)?\\..*","");
xrfragment_XRF.isString = new EReg(".*","");
xrfragment_XRF.operators = new EReg("(^[-]|^[!]|[\\*]$)","g");
xrfragment_XRF.isProp = new EReg("^.*=[><=]?","");
xrfragment_XRF.isExclude = new EReg("^-","");
xrfragment_XRF.isDeep = new EReg("\\*","");
xrfragment_XRF.isNumber = new EReg("^[0-9\\.]+$","");
xrfragment_XRF.isMediaFrag = new EReg("^([0-9\\.,\\*+-]+)$","");
xrfragment_XRF.isReset = new EReg("^!","");
xrfragment_XRF.isShift = new EReg("^(\\+|--)","");
xrfragment_XRF.isXRFScheme = new EReg("^xrf://","");
})(typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
var xrfragment = $hx_exports["xrfragment"];
