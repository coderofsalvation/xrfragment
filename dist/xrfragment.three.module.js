/*
 * v0.5.1 generated at Thu Feb 29 01:43:17 PM UTC 2024
 * https://xrfragment.org
 * SPDX-License-Identifier: MPL-2.0
 */
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
	Frag_h["loop"] = xrfragment_XRF.PV_OVERRIDE;
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
// the core project uses #vanillajs #proxies #clean #noframework
var $      = typeof $   != 'undefined' ? $  : (s) => document.querySelector(s)            // respect jquery
var $$     = typeof $$  != 'undefined' ? $$ : (s) => [...document.querySelectorAll(s)]    // zepto etc.

var $el = (html,tag) => {
  let el = document.createElement('div')
  el.innerHTML = html
  return el.children[0]
}
// SPDX-License-Identifier: MPL-2.0        
// Copyright (c) 2023 Leon van Kammen/NLNET 

var xrf = {}

xrf.init = function(opts){
  opts      = opts || {}

  xrf.debug = document.location.hostname.match(/^(localhost|[0-9])/) ? 0 : false
  if( !xrf.debug ){
    console.log("add #debug=[0-9] to URL to see XR Fragment debuglog")
    xrf.debug = parseInt( ( document.location.hash.match(/debug=([0-9])/) || [0,'0'] )[1] )
  }

  xrf.Parser.debug = xrf.debug 
  xrf.detectCameraRig(opts)
  for ( let i in opts    ) xrf[i] = opts[i]
  xrf.emit('init',opts)
  return xrf
}

xrf.query = function(){
  // framework implementations can override this function, see src/3rd/js/three/index.sj 
  alert("queries are not implemented (yet) for this particular framework")
}

xrf.detectCameraRig = function(opts){
  if( opts.camera ){ // detect rig (if any)
    let getCam  = ((cam) => () => cam)(opts.camera)
    let offsetY = 0 
    while( opts.camera.parent.type != "Scene" ){
      offsetY += opts.camera.position.y
      opts.camera = opts.camera.parent
      opts.camera.getCam = getCam
      opts.camera.updateProjectionMatrix = () => opts.camera.getCam().updateProjectionMatrix()
    }
    opts.camera.offsetY = offsetY
  }
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

xrf.stats = () => {
  // bookmarklet from https://github.com/zlgenuine/threejs_stats
  (function(){
    for( let i = 0; i < 4; i++ ){
      var script=document.createElement('script');script.onload=function(){var stats=new Stats();stats.showPanel( i ); 
        stats.dom.style.marginTop = `${i*48}px`;  document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);
    }
  })()
}

xrf.hasTag = (tag,tags) => String(tags).match( new RegExp(`(^| )${tag}( |$)`,`g`) )

// map library functions to xrf
for ( let i in xrfragment ) xrf[i] = xrfragment[i] 
/* 
 * (promise-able) EVENTS (optionally continue after listeners are finished using .then)
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

xrf.addEventListener = function(eventName, callback, opts) {
  if( !this._listeners ) this._listeners = []
  callback.opts = opts || {weight: this._listeners.length}
  if (!this._listeners[eventName]) {
      // create a new array for this event name if it doesn't exist yet
      this._listeners[eventName] = [];
  }
  // add the callback to the listeners array for this event name
  this._listeners[eventName].push(callback);
  // sort
  this._listeners[eventName] = this._listeners[eventName].sort( (a,b) => a.opts.weight > b.opts.weight )
  callback.unlisten = () => {
    this._listeners[eventName] = this._listeners[eventName].filter( (c) => c != callback )
  }
  return callback.unlisten
};

xrf.emit = function(eventName, data){
  if( typeof data != 'object' ) throw 'emit() requires passing objects'
  if( xrf.debug && xrf.debug > 1 && ( !eventName.match(/^render/) || xrf.debug == eventName ) ){
    let label = String(`xrf.emit('${eventName}')`).padEnd(35," ");
    label +=  data.mesh && data.mesh.name ? '#'+data.mesh.name : ''
    console.groupCollapsed(label)
    console.info(data)
    console.groupEnd(label)
    if( xrf.debug > 1 ) debugger
  }
  return xrf.emit.promise(eventName,data)
}

xrf.emit.normal = function(eventName, data) {
    if( !xrf._listeners ) xrf._listeners = []
    var callbacks = xrf._listeners[eventName]
    if (callbacks) {
        for (var i = 0; i < callbacks.length; i++) {
          try{
            callbacks[i](data);
          }catch(e){ console.error(e) }
        }
    }
};

xrf.emit.promise = function(e, opts){ 
  return new Promise( (resolve, reject) => {
    opts.promise = () => {
      opts.promises = opts.promises || []
      opts.promises.push(0)
      return { 
        resolve: ((index) => () => {
          opts.promises[index] = 1 
          let succesful = opts.promises.reduce( (a,b) => a+b )
          if( succesful == opts.promises.length ) resolve(opts)
        })(opts.promises.length-1),
        reject: console.error
      }
    }
    xrf.emit.normal(e, opts)     
    if( !opts.promises ) resolve(opts)
    delete opts.promise
  })
}

xrf.addEventListener('reset', () => {
  let events = ['renderPost']
  events.map( (e) => {
    if( xrf._listeners[e] ) xrf._listeners[e].map( (r) => r.unlisten && r.unlisten() )
  })
})
/*! rasterizeHTML.js - v1.3.1 - 2023-07-06
* http://www.github.com/cburgmer/rasterizeHTML.js
* Copyright (c) 2023 Christoph Burgmer; Licensed MIT */

!function(o,i){void 0===o&&void 0!==window&&(o=window),"function"==typeof define&&define.amd?define(["url","xmlserializer","sane-domparser-error","inlineresources"],function(e,t,n,r){return o.rasterizeHTML=i(e,t,n,r)}):"object"==typeof module&&module.exports?module.exports=i(require("url"),require("xmlserializer"),require("sane-domparser-error"),require("inlineresources")):o.rasterizeHTML=i(o.url,o.xmlserializer,o.sanedomparsererror,o.inlineresources)}(this,function(e,t,n,r){var o=function(n){"use strict";var o={},t=[];o.joinUrl=function(e,t){return e?n.resolve(e,t):t},o.getConstantUniqueIdFor=function(e){return t.indexOf(e)<0&&t.push(e),t.indexOf(e)},o.clone=function(e){var t,n={};for(t in e)e.hasOwnProperty(t)&&(n[t]=e[t]);return n};return o.parseOptionalParameters=function(e){var t,n,r={canvas:null,options:{}};return null==e[0]||(t=e[0],"object"==typeof(n=t)&&null!==n&&Object.prototype.toString.apply(t).match(/\[object (Canvas|HTMLCanvasElement)\]/i))?(r.canvas=e[0]||null,r.options=o.clone(e[1])):r.options=o.clone(e[0]),r},o}(e),i=function(i){"use strict";function u(e,t,n){var r=e[t];return e[t]=function(){var e=Array.prototype.slice.call(arguments);return n.apply(this,[e,r])},r}var e={};return e.baseUrlRespectingXhr=function(t,o){return function(){var e=new t;return u(e,"open",function(e,t){var n=e.shift(),r=e.shift(),r=i.joinUrl(o,r);return t.apply(this,[n,r].concat(e))}),e}},e.finishNotifyingXhr=function(t){function e(){var e=new t;return u(e,"send",function(e,t){return r+=1,t.apply(this,arguments)}),e.addEventListener("load",function(){o+=1,n()}),e}var n,r=0,o=0,i=!1,c=new Promise(function(e){n=function(){r-o<=0&&i&&e({totalCount:r})}});return e.waitForRequestsToFinish=function(){return i=!0,n(),c},e},e}(o),e=function(i){"use strict";function r(e){return Array.prototype.slice.call(e)}var e={},c={active:!0,hover:!0,focus:!1,target:!1};return e.fakeUserAction=function(e,t,n){var r=e.querySelector(t),o=":"+n,t="rasterizehtml"+n;r&&(c[n]?i.addClassNameRecursively(r,t):i.addClassName(r,t),i.rewriteCssSelectorWith(e,o,"."+t))},e.persistInputValues=function(e){function t(e){return"checkbox"===e.type||"radio"===e.type}var n=e.querySelectorAll("input"),e=e.querySelectorAll("textarea");r(n).filter(t).forEach(function(e){e.checked?e.setAttribute("checked",""):e.removeAttribute("checked")}),r(n).filter(function(e){return!t(e)}).forEach(function(e){e.setAttribute("value",e.value)}),r(e).forEach(function(e){e.textContent=e.value})},e.rewriteTagNameSelectorsToLowerCase=function(e){i.lowercaseCssTypeSelectors(e,i.findHtmlOnlyNodeNames(e))},e}(function(){"use strict";function c(e){return Array.prototype.slice.call(e)}var n={};n.addClassName=function(e,t){e.className+=" "+t},n.addClassNameRecursively=function(e,t){n.addClassName(e,t),e.parentNode!==e.ownerDocument&&n.addClassNameRecursively(e.parentNode,t)};function r(e,t,o){var i="((?:^|[^.#:\\w])|(?=\\W))("+t.join("|")+")(?=\\W|$)";c(e.querySelectorAll("style")).forEach(function(e){var t,n;void 0===e.sheet&&(t=e,n=document.implementation.createHTMLDocument(""),(r=document.createElement("style")).textContent=t.textContent,n.body.appendChild(r),t.sheet=r.sheet);var r=c(e.sheet.cssRules).filter(function(e){return e.selectorText&&new RegExp(i,"i").test(e.selectorText)});r.length&&(r.forEach(function(e){var t,n=e.selectorText.replace(new RegExp(i,"gi"),function(e,t,n){return t+o(n)});n!==e.selectorText&&(t=n,e=(n=e).cssText.replace(/^[^\{]+/,""),u(n,t+" "+e))}),e.textContent=a(e.sheet.cssRules))})}var u=function(e,t){var n=e.parentStyleSheet,e=c(n.cssRules).indexOf(e);n.insertRule(t,e+1),n.deleteRule(e)},a=function(e){return c(e).reduce(function(e,t){return e+t.cssText},"")};return n.rewriteCssSelectorWith=function(e,t,n){r(e,[t],function(){return n})},n.lowercaseCssTypeSelectors=function(e,t){r(e,t,function(e){return e.toLowerCase()})},n.findHtmlOnlyNodeNames=function(e){for(var t,n=e.ownerDocument.createTreeWalker(e,NodeFilter.SHOW_ELEMENT),r={},o={};t=n.currentNode.tagName.toLowerCase(),"http://www.w3.org/1999/xhtml"===n.currentNode.namespaceURI?r[t]=!0:o[t]=!0,n.nextNode(););return Object.keys(r).filter(function(e){return!o[e]})},n}()),i=function(a,f,t,m){"use strict";var e={};e.executeJavascript=function(s,l){return new Promise(function(t){function n(){m.document.getElementsByTagName("body")[0].removeChild(r)}function e(){var e=r.contentDocument;t({document:e,errors:i,cleanUp:n})}var r=function(e,t,n,r){t=e.createElement(t);return t.style.visibility="hidden",t.style.width=n+"px",t.style.height=r+"px",t.style.position="absolute",t.style.top=-1e4-r+"px",t.style.left=-1e4-n+"px",e.getElementsByTagName("body")[0].appendChild(t),t}(m.document,"iframe",l.width,l.height),o=s.outerHTML,i=[],c=l.executeJsTimeout||0,u=r.contentWindow.XMLHttpRequest,a=f.finishNotifyingXhr(u),u=f.baseUrlRespectingXhr(a,l.baseUrl);r.onload=function(){var t;(0<(t=c)?new Promise(function(e){setTimeout(e,t)}):Promise.resolve()).then(a.waitForRequestsToFinish).then(e)},r.contentDocument.open(),r.contentWindow.XMLHttpRequest=u,r.contentWindow.onerror=function(e){i.push({resourceType:"scriptExecution",msg:e})},r.contentDocument.write("<!DOCTYPE html>"),r.contentDocument.write(o),r.contentDocument.close()})};function s(e,t,n,r,o){var i,c,u,a=Math.max(e.scrollWidth,e.clientWidth),s=Math.max(e.scrollHeight,e.clientHeight),l=t?(i=(l=function(e,t){var n=e.querySelector(t);if(n)return n;if(e.ownerDocument.querySelector(t)===e)return e;throw{message:"Clipping selector not found"}}(e,t).getBoundingClientRect()).top,c=l.left,u=l.width,l.height):(c=i=0,u=a,s);return l={width:u,height:l},r=r,o=o,r={width:Math.max(l.width*o,n),height:Math.max(l.height*o,r)},e=m.getComputedStyle(e.ownerDocument.documentElement).fontSize,{left:c,top:i,width:r.width,height:r.height,viewportWidth:a,viewportHeight:s,rootFontSize:e}}e.calculateDocumentContentSize=function(c,u){return new Promise(function(n,r){var e,t,o=u.zoom||1,i=function(e,t,n){e=Math.floor(e/n),n=Math.floor(t/n);return function(e,t,n){e=e.createElement("iframe");return e.style.width=t+"px",e.style.height=n+"px",e.style.visibility="hidden",e.style.position="absolute",e.style.top=-1e4-n+"px",e.style.left=-1e4-t+"px",e.style.borderWidth=0,e.sandbox="allow-same-origin",e.scrolling="no",e}(m.document,e,n)}(u.width,u.height,o);m.document.getElementsByTagName("body")[0].appendChild(i),i.onload=function(){var e,t=i.contentDocument;try{e=s(function(e,t){e=e.tagName;return t.querySelector(e)}(c,t),u.clip,u.width,u.height,o),n(e)}catch(e){r(e)}finally{m.document.getElementsByTagName("body")[0].removeChild(i)}},i.contentDocument.open(),i.contentDocument.write("<!DOCTYPE html>"),i.contentDocument.write("html"===(t=(e=c).tagName.toLowerCase())||"body"===t?e.outerHTML:'<body style="margin: 0;">'+e.outerHTML+"</body>"),i.contentDocument.close()})},e.parseHtmlFragment=function(e){var t=m.document.implementation.createHTMLDocument("");t.documentElement.innerHTML=e;t=t.querySelector("body").firstChild;if(!t)throw"Invalid source";return t};e.parseHTML=function(e){var t=m.document.implementation.createHTMLDocument("");return t.documentElement.innerHTML=e,function(e,t){var n,r,o,i=/<html((?:\s+[^>]*)?)>/im.exec(t),t=m.document.implementation.createHTMLDocument("");if(i)for(i="<div"+i[1]+"></div>",t.documentElement.innerHTML=i,r=t.querySelector("div"),n=0;n<r.attributes.length;n++)o=r.attributes[n],e.documentElement.setAttribute(o.name,o.value)}(t,e),t};function n(e){try{return t.failOnParseError(e)}catch(e){throw{message:"Invalid source",originalError:e}}}e.validateXHTML=function(e){e=(new DOMParser).parseFromString(e,"application/xml");n(e)};function r(c,u){return new Promise(function(e,t){function n(e){t({message:"Unable to load page",originalError:e})}var r=new window.XMLHttpRequest,o=a.joinUrl(u.baseUrl,c),i=(i=o,"none"===(o=u.cache)||"repeated"===o?i+"?_="+(l=null===l||"repeated"!==o?Date.now():l):i);r.addEventListener("load",function(){200===r.status||0===r.status?e(r.responseXML):n(r.statusText)},!1),r.addEventListener("error",function(e){n(e)},!1);try{r.open("GET",i,!0),r.responseType="document",r.send(null)}catch(e){n(e)}})}var l=null;return e.loadDocument=function(e,t){return r(e,t).then(n)},e}(o,i,n,window),n=function(r){"use strict";function o(e,t){return t?URL.createObjectURL(new Blob([e],{type:"image/svg+xml"})):"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(e)}function c(e){e instanceof Blob&&URL.revokeObjectURL(e)}function i(o){return new Promise(function(t,e){var n=document.createElement("canvas"),r=new Image;r.onload=function(){var e=n.getContext("2d");try{e.drawImage(r,0,0),n.toDataURL("image/png"),t(!0)}catch(e){t(!1)}},r.onerror=e,r.src=o})}function u(t){return(e=void 0===e?n():e).then(function(e){return o(t,e)})}var e,t={},a='<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><foreignObject></foreignObject></svg>',n=function(){return new Promise(function(t,e){var n;(function(){if(r.Blob)try{return new Blob(["<b></b>"],{type:"text/xml"}),!0}catch(e){}return!1})()&&r.URL?(n=o(a,!0),i(n).then(function(e){return c(n),!e&&i(o(a,!1)).then(function(e){return e})},function(){return!1}).then(function(e){t(!e)},function(){e()})):t(!1)})};return t.renderSvg=function(i){return new Promise(function(e,t){function n(){r&&c(r)}var r,o=new Image;o.onload=function(){o.onload=null,o.onerror=null,n(),e(o)},o.onerror=function(){n(),t()},u(i).then(function(e){r=e,o.src=r},t)})},t}(window);return function(o,i,c){"use strict";var u={};u.drawDocument=function(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1),n=o.parseOptionalParameters(t),r=e.documentElement||e;return c.rasterize(r,n.canvas,(e=(t=n).canvas,r=t.options,n=e?e.width:300,e=e?e.height:200,e={width:void 0!==r.width?r.width:n,height:void 0!==r.height?r.height:e},(t=o.clone(t.options)).width=e.width,t.height=e.height,t))};u.drawHTML=function(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1),t=o.parseOptionalParameters(t);return function(e,t,n){e=i.parseHTML(e);return u.drawDocument(e,t,n)}(e,t.canvas,t.options)};function n(t,n,r){return i.loadDocument(t,r).then(function(e){e=function(e,t,n){var r=document.implementation.createHTMLDocument("");r.replaceChild(e.documentElement,r.documentElement);e=n?o.clone(n):{};return n.baseUrl||(e.baseUrl=t),{document:r,options:e}}(e,t,r);return u.drawDocument(e.document,n,e.options)})}return u.drawURL=function(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1),t=o.parseOptionalParameters(t);return n(e,t.canvas,t.options)},u}(o,i,function(o,i,c,r,e,u){"use strict";function a(t){return e.renderSvg(t).then(function(e){return{image:e,svg:t}},function(e){throw l(e)})}function s(e,t,n){return r.drawDocumentAsSvg(e,n).then(a).then(function(e){return t&&function(e,t){try{t.getContext("2d").drawImage(e,0,0)}catch(e){throw l(e)}}(e.image,t),e})}var t={},l=function(e){return{message:"Error rendering page",originalError:e}};return t.rasterize=function(e,n,r){var t=o.clone(r);return t.inlineScripts=!0===r.executeJs,u.inlineReferences(e,t).then(function(t){return r.executeJs?i.executeJavascript(e,r).then(function(e){var t=e.document;return c.persistInputValues(t),{document:t,errors:e.errors,cleanUp:e.cleanUp}}).then(function(e){return{element:e.document.documentElement,errors:t.concat(e.errors),cleanUp:e.cleanUp}}):{element:e,errors:t,cleanUp:function(){}}}).then(function(t){return s(t.element,n,r).then(function(e){return t.cleanUp(),{image:e.image,svg:e.svg,errors:t.errors}})})},t}(o,i,e,function(c,r,u){"use strict";function a(t){var e=Object.keys(t);return e.length?" "+e.map(function(e){return e+'="'+t[e]+'"'}).join(" "):""}function o(e,t,n){var r,o,i=u.serializeToString(e);return c.validateXHTML(i),(e=(r=t,o=Math.round(r.viewportWidth),e=Math.round(r.viewportHeight),{x:-r.left,y:-r.top,width:o,height:e})).style=(e.style||"")+"float: left;",e.externalResourcesRequired=!0,'<svg xmlns="http://www.w3.org/2000/svg"'+a(function(e,t){t=t||1,e={width:e.width,height:e.height,"font-size":e.rootFontSize};return 1!==t&&(e.style="transform:scale("+t+"); transform-origin: 0 0;"),e}(t,n))+'><style scoped="">html::-webkit-scrollbar { display: none; }</style><foreignObject'+a(e)+">"+i+"</foreignObject></svg>"}var i={};return i.getSvgForDocument=function(e,t,n){return r.rewriteTagNameSelectorsToLowerCase(e),o(e,t,n)},i.drawDocumentAsSvg=function(t,n){return["hover","active","focus","target"].forEach(function(e){n[e]&&r.fakeUserAction(t,n[e],e)}),c.calculateDocumentContentSize(t,n).then(function(e){return i.getSvgForDocument(t,e,n.zoom)})},i}(i,e,t),n,r))});
// the XRWG (XR WordGraph)is mentioned in the spec 
//
// it collects metadata-keys ('foo' e.g.), names and tags across 3D scene-nodes (.userData.foo e.g.) 

let XRWG = xrf.XRWG = []

XRWG.word = (key) => XRWG.find( (w) => w.word == word )

XRWG.cleankey = (word) => String(word).replace(/[^0-9\.a-zA-Z_]/g,'')
                                      .toLowerCase()
                                      .replace(/.*:\/\//,'')
XRWG.get = (v,k) => XRWG.find( (x) => x[ k || 'word'] == v )

XRWG.match = (str,types,level) => {
  if( XRWG.length == 0 ) XRWG.generate(xrf)
  level = level == undefined ? 1000 : level
  types = types || []
  let res = XRWG.filter( (n) => {
    types.map( (type) => n[type] ? n = false : false )
    return n
  })
  str = str.toLowerCase()
           .replace(/[!-\*]/g,'') // remove excludes and wildcards
  if( level  <10   ) res = res.filter( (n) => n.key    == str )
  if( level >=10   ) res = res.filter( (n) => n.word   == str   || n.key == str )
  if( level  >30   ) res = res.filter( (n) => n.word.match(str) || n.key == str )
  if( level  >40   ) res = res.filter( (n) => n.word.match(str) || n.key == str || String(n.value||'').match(str) )
  if( level  >999  ) res = res.filter( (n) => n.word.match(str) != null || n.key.match(str) != null || String(n.value||'').match(str) != null)
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
      node.types.push(type)
      node.nodes.push(spatialNode)
    }else{
      node = { word: XRWG.cleankey(key), key, nodes:[spatialNode], types:[] }
      if( spatialNode.userData[key] ) node.value = spatialNode.userData[key]
      node.types.push(type)
      xrf.emit('XRWGnode',node)
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
  xrf.emit('XRWG',XRWG)
}

XRWG.deepApplyMatch = function(match,v,cb){
  match.map( (m) => {
    for( let i in m.types ){
      let type = m.types[i]
      let node = m.nodes[i]
      if (type == 'name' || type == 'tag'){
        cb(match,v,node,type)
        if( v.filter.q.deep ) node.traverse( (c) => cb(match,v,c,t) )
      }
    }
  })
}

// the hashbus (QueryString eventBus) is mentioned in the spec 
//
// it allows metadata-keys ('foo' e.g.) of 3D scene-nodes (.userData.foo e.g.) to 
// react by executing code 

let pub = function( url, node_or_model, flags ){  // evaluate fragments in url
  if( !url ) return 
  if( !url.match(/#/) ) url = `#${url}`
  let { THREE, camera } = xrf
  let frag     = xrf.URI.parse( url, flags )
  let fromNode = node_or_model != xrf.model
  let isNode   = node_or_model && node_or_model.children

  let opts = {
    frag, 
    mesh:  fromNode ? node_or_model : xrf.camera, 
    model: xrf.model,
    camera: xrf.camera, 
    scene: isNode ? node_or_model : xrf.scene, 
    renderer: xrf.renderer,
    THREE: xrf.THREE, 
    hashbus: xrf.hashbus 
  }
  xrf.emit('hashbus',opts)
  .then( () => {
    for ( let k in frag ){
      let nodeAlias       = fromNode && opts.mesh && opts.mesh.userData && opts.mesh.userData[k] && opts.mesh.userData[k][0] == '#'
      if( nodeAlias ) pub(opts.mesh.userData[k], opts.mesh) // evaluate node alias
      else pub.fragment(k,opts)
    }
  })
  return frag
}

pub.fragment = (k, opts ) => { // evaluate one fragment
  let frag = opts.frag[k];

  let isPVorMediaFrag = frag.is( xrf.XRF.PV_EXECUTE ) || frag.is( xrf.XRF.T_MEDIAFRAG)
  if( !opts.skipXRWG && isPVorMediaFrag ) pub.XRWG(k,opts)

  // call native function (xrf/env.js e.g.), or pass it to user decorator
  xrf.emit(k,opts)
  .then( () => {
    let func = xrf.frag[k] || function(){} 
    if( typeof xrf[k] == 'function' ) xrf[k]( func, frag, opts)
    else func( frag, opts)
  })
}

pub.XRWG = (word,opts) => {
  let {frag,scene,model,renderer} = opts 

  // if this query was triggered by an src-value, lets filter it
  const isSRC = opts.embedded && opts.embedded.fragment == 'src'
  if( !isSRC ){                             // spec : https://xrfragment.org/#src

    let triggeredByMesh = opts.model != opts.mesh

    let v      = frag[word]
    let id     = v.is( xrf.XRF.T_DYNAMICKEY ) ? word : v.string || word 

    if( id == '#' || !id ) return
    let match = xrf.XRWG.match(id)

    if( !triggeredByMesh && (v.is( xrf.XRF.PV_EXECUTE ) || v.is( xrf.XRF.T_DYNAMIC)) && !v.is( xrf.XRF.T_DYNAMICKEYVALUE ) ){
      // evaluate global aliases or tag/objectnames
      match.map( (w) => {
        if( w.key == `#${id}` ){
          if(  w.value && w.value[0] == '#' ){
            // if value is alias, execute fragment value 
            xrf.hashbus.pub( w.value, xrf.model, xrf.XRF.METADATA | xrf.XRF.PV_OVERRIDE | xrf.XRF.NAVIGATOR )
          }
        }
      })
      xrf.emit('dynamicKey',{ ...opts,v,frag,id,match,scene })
    }else if( v.string ){
      // evaluate global aliases 
      xrf.emit('dynamicKeyValue',{ ...opts,v,frag,id,match,scene })
    }else{
      xrf.emit('dynamicKey',{ ...opts,v,frag,id,match,scene })
    }
  }
}


xrf.hashbus = { pub }
xrf.frag   = {dynamic:{}}
xrf.model  = {}
xrf.mixers = []

xrf.init = ((init) => function(opts){
  let scene = new opts.THREE.Group()
  opts.scene.add(scene)
  opts.scene = scene
  init(opts)
  //if( opts.loaders ) Object.values(opts.loaders).map( xrf.patchLoader )

  xrf.patchRenderer(opts)
  xrf.navigator.init()
  // return xrfragment lib as 'xrf' query functor (like jquery)
  for ( let i in xrf ) xrf.query[i] = xrf[i] 

  if( xrf.debug ) xrf.stats()

  return xrf.query
})(xrf.init)

xrf.patchRenderer = function(opts){
  let {renderer,camera} = opts
  renderer.xr.addEventListener( 'sessionstart', () => xrf.baseReferenceSpace = renderer.xr.getReferenceSpace() );
  renderer.xr.enabled = true;
  xrf.clock = new xrf.THREE.Clock()
  renderer.render = ((render) => function(scene,camera){
    // update clock
    let time = xrf.clock.delta = xrf.clock.getDelta()
    xrf.emit('render',{scene,camera,time,render}) // allow fragments to do something at renderframe
    render(scene,camera)
    xrf.emit('renderPost',{scene,camera,time,render,renderer}) // allow fragments to do something after renderframe
  })(renderer.render.bind(renderer))

}

xrf.getFile = (url) => url.split("/").pop().replace(/#.*/,'')

// parseModel event is essential for src.js to hook into embedded loaded models
xrf.parseModel = function(model,url){
  let file               = xrf.getFile(url)
  model.file             = file
  model.isXRF            = true
  model.scene.traverse( (n) => n.isXRF = true ) // mark for deletion during reset()

  xrf.emit('parseModel',{model,url,file})
}

xrf.parseModel.metadataInMesh =  (mesh,model) => { 
  if( mesh.userData ){
    let frag = {}
    for( let k in mesh.userData ) xrf.Parser.parse( k, mesh.userData[k], frag )
    for( let k in frag ){
      let opts = {frag, mesh, model, camera: xrf.camera, scene: model.scene, renderer: xrf.renderer, THREE: xrf.THREE, hashbus: xrf.hashbus }
      mesh.userData.XRF = frag // allow fragment impl to access XRF obj already
      xrf.emit('frag2mesh',opts)
      .then( () => {
        xrf.hashbus.pub.fragment(k, {...opts, skipXRWG:true}) 
      })
    }
  }
}


xrf.getLastModel = ()           => xrf.model.last 

xrf.reset = () => {

  // allow others to reset certain events 
  xrf.emit('reset',{})

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
  xrf.scene.traverse( (child) => child.isXRF && (nodes.push(child)) )
  nodes.map( disposeObject ) // leave non-XRF objects intact
  xrf.interactive = xrf.interactiveGroup( xrf.THREE, xrf.renderer, xrf.camera)
  xrf.add( xrf.interactive )
  xrf.layers = 0
}

xrf.parseUrl = (url) => {
  let urlExHash = url.replace(/#.*/,'')
  let urlObj,file
  let   store = {}
  try{
    urlObj = new URL( urlExHash.match(/:\/\//) ? urlExHash : String(`https://fake.com/${url}`).replace(/\/\//,'/') )
    file = urlObj.pathname.substring(urlObj.pathname.lastIndexOf('/') + 1);
    let   search = urlObj.search.substr(1).split("&")
    for( let i in search )  store[  (search[i].split("=")[0])  ]  = search[i].split("=")[1] || ''
  }catch(e){ }
  let   hashmap = url.match("#") ? url.replace(/.*#/,'').split("&") : []
  for( let i in hashmap ) store[  (hashmap[i].split("=")[0]) ]  = hashmap[i].split("=")[1] || ''
  let   dir  = url.substring(0, url.lastIndexOf('/') + 1)
  const hash = url.match(/#/) ? url.replace(/.*#/,'') : ''
  const ext  = file.split('.').pop()
  return {urlObj,dir,file,hash,ext,store}
}

xrf.add = (object) => {
  object.isXRF = true // mark for easy deletion when replacing scene
  xrf.scene.add(object)
}

xrf.hasNoMaterial = (mesh) => {
  const hasTexture        = mesh.material && mesh.material.map 
  const hasMaterialName   = mesh.material && mesh.material.name.length > 0 
  return mesh.geometry && !hasMaterialName && !hasTexture
}
xrf.navigator = {}

xrf.navigator.to = (url,flags,loader,data) => {
  if( !url ) throw 'xrf.navigator.to(..) no url given'
  let {urlObj,dir,file,hash,ext} = xrf.navigator.origin = xrf.parseUrl(url)
  let hashChange = (!file && hash) || !data && xrf.model.file == file
  let hasPos     = String(hash).match(/pos=/)


  let hashbus = xrf.hashbus

  return new Promise( (resolve,reject) => {
    xrf
    .emit('navigate', {url,loader,data})
    .then( () => {

      if( ext && !loader ){  
        const Loader = xrf.loaders[ext]
        if( !Loader ) return resolve()
        loader = loader || new Loader().setPath( dir )
      }

      if( !hash && !file && !ext ) return resolve(xrf.model) // nothing we can do here

      if( hashChange && !hasPos ){
        hashbus.pub( url, xrf.model, flags )     // eval local URI XR fragments 
        xrf.navigator.updateHash(hash)           // which don't require 
        return resolve(xrf.model)                // positional navigation
      }

      xrf
      .emit('navigateLoading', {url,loader,data})
      .then( () => {
        if( hashChange && hasPos ){                 // we're already loaded
          hashbus.pub( url, xrf.model, flags )     // and eval local URI XR fragments 
          xrf.navigator.updateHash(hash)
          xrf.emit('navigateLoaded',{url})
          return resolve(xrf.model) 
        }
          
        // clear xrf objects from scene
        if( xrf.model && xrf.model.scene ) xrf.model.scene.visible = false
        xrf.reset() 

        // force relative path for files which dont include protocol or relative path
        if( dir ) dir = dir[0] == '.' || dir.match("://") ? dir : `.${dir}`
        url = url.replace(dir,"")
        loader = loader || new Loader().setPath( dir )
        const onLoad = (model) => {

          model.file = file
          // only change url when loading *another* file
          if( xrf.model ) xrf.navigator.pushState( `${dir}${file}`, hash )
          xrf.model = model 

          if( !model.isXRF ) xrf.parseModel(model,url) // this marks the model as an XRF model

          if(xrf.debug ) model.animations.map( (a) => console.log("anim: "+a.name) )

          // spec: 1. generate the XRWG
          xrf.XRWG.generate({model,scene:model.scene})

          // spec: 2. init metadata inside model for non-SRC data
          if( !model.isSRC ){ 
            model.scene.traverse( (mesh) => xrf.parseModel.metadataInMesh(mesh,model) )
          }

          // spec: 1. execute the default predefined view '#' (if exist) (https://xrfragment.org/#predefined_view)
          xrf.frag.defaultPredefinedViews({model,scene:model.scene})
          // spec: predefined view(s) & objects-of-interest-in-XRWG from URL (https://xrfragment.org/#predefined_view)
          let frag = xrf.hashbus.pub( url, model) // and eval URI XR fragments 

          xrf.add( model.scene )
          if( hash ) xrf.navigator.updateHash(hash)
          xrf.emit('navigateLoaded',{url,model})
          resolve(model)
        }
  
        if( data ){  // file upload
          loader.parse(data, "", onLoad )
        }else{
          try{
            loader.load(url, onLoad )
          }catch(e){ 
            console.error(e)
            xrf.emit('navigateError',{url})
          }
        }
      })
    })
  })
}

xrf.navigator.init = () => {
  if( xrf.navigator.init.inited ) return

  window.addEventListener('popstate', function (event){
    if( !xrf.navigator.updateHash.active ){ // ignore programmatic hash updates (causes infinite recursion)
      xrf.navigator.to( document.location.search.substr(1) + document.location.hash )
    }
  })
  
  window.addEventListener('hashchange', function (e){
    xrf.emit('hash', {hash: document.location.hash })
  })

  xrf.navigator.setupNavigateFallbacks()

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

xrf.navigator.setupNavigateFallbacks = () => {

  xrf.addEventListener('navigate', (opts) => {
    let {url} = opts
    let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)

    // handle http links
    if( url.match(/^http/) && !xrf.loaders[ext] ){
      let inIframe
      try { inIframe = window.self !== window.top; } catch (e) { inIframe = true; }
      return inIframe ? window.parent.postMessage({ url }, '*') : window.open( url, '_blank')
      // in case you're running in an iframe, then use this in the parent page:
      //
      // window.addEventListener("message", (e) => {
      //   if (e.data && e.data.url){
      //     window.open( e.data.url, '_blank')
      //   }
      // },
      //   false,
      // );
    }
  })

}

xrf.navigator.updateHash = (hash,opts) => {
  if( hash.replace(/^#/,'') == document.location.hash.substr(1) || hash.match(/\|/) ) return  // skip unnecesary pushState triggers
  console.log(`URL: ${document.location.search.substr(1)}#${hash}`)
  xrf.navigator.updateHash.active = true  // important to prevent recursion
  document.location.hash = hash
  xrf.navigator.updateHash.active = false
}

xrf.navigator.pushState = (file,hash) => {
  if( file == document.location.search.substr(1) ) return // page is in its default state
  window.history.pushState({},`${file}#${hash}`, document.location.pathname + `?${file}#${hash}` )
  xrf.emit('pushState', {file, hash} )
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
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts

  if( mesh.userData.XRF.href.exec ) return // mesh already initialized

  let click = mesh.userData.XRF.href.exec = (e) => {

    if( !mesh.material.visible ) return // ignore invisible nodes

    // bubble up!
    mesh.traverseAncestors( (n) => n.userData && n.userData.href && n.dispatchEvent({type:e.type,data:{}}) )

    let lastPos   = `pos=${camera.position.x.toFixed(2)},${camera.position.y.toFixed(2)},${camera.position.z.toFixed(2)}`
    xrf
    .emit('href',{click:true,mesh,xrf:v}) // let all listeners agree
    .then( () => {

      let {urlObj,dir,file,hash,ext} = xrf.parseUrl(v.string)
      const isLocal = v.string[0] == '#'
      const hasPos  = isLocal && v.string.match(/pos=/)
      const flags   = isLocal ? xrf.XRF.PV_OVERRIDE : undefined

      //let toFrag = xrf.URI.parse( v.string, xrf.XRF.NAVIGATOR | xrf.XRF.PV_OVERRIDE | xrf.XRF.METADATA )
      if( v.xrfScheme ){
        xrf.hashbus.pub(v.string)
      } else xrf.navigator.to(v.string)    // let's surf
    }) 
    .catch( console.error )
  }

  let selected = mesh.userData.XRF.href.selected = (state) => () => {
    if( !mesh.material.visible && !mesh.isSRC ) return // ignore invisible nodes
    if( mesh.selected == state ) return // nothing changed 

    xrf.interactive.objects.map( (o) => {
      let newState = o.name == mesh.name ? state : false
      if( o.material ){
        if( o.material.uniforms && o.material.uniforms.selected ) o.material.uniforms.selected.value = newState 
        //if( o.material.emissive ) o.material.emissive.r = o.material.emissive.g = o.material.emissive.b = newState ? 2.0 : 1.0
        if( o.material.emissive ){ 
          if( !o.material.emissive.original ) o.material.emissive.original = o.material.emissive.clone()
          o.material.emissive.r = o.material.emissive.g = o.material.emissive.b = 
            newState ? o.material.emissive.original.r + 0.5 : o.material.emissive.original.r
        }
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
  mesh.addEventListener('mouseenter', selected(true) )
  mesh.addEventListener('mouseleave', selected(false) )

  if( mesh.material ) mesh.material = mesh.material.clone() // clone, so we can individually highlight meshes

  // lazy add mesh (because we're inside a recursive traverse)
  setTimeout( (mesh) => {
    xrf.interactive.add(mesh)
    xrf.emit('interactionReady', {mesh,xrf:v,clickHandler: mesh.userData.XRF.href.exec })
  }, 0, mesh )
}

xrf.addEventListener('audioInited', function(opts){
  let {THREE,listener} = opts
  opts.audio = opts.audio || {}
  opts.audio.click    = opts.audio.click || '/example/assets/audio/click.wav'
  opts.audio.hover    = opts.audio.hover || '/example/assets/audio/hover.wav'
  opts.audio.teleport = opts.audio.teleport || '/example/assets/audio/teleport.wav'

  let audio = xrf.frag.href.audio = {}

  actions = ['click','hover','teleport']
  actions.map( (action) => {
    const audioLoader = new THREE.AudioLoader();
    audio[action] = new THREE.Audio( xrf.camera.listener )
    audioLoader.load( opts.audio[action], function( buffer ) {
      audio[action].setBuffer( buffer );
    })
  });

  xrf.addEventListener('href', (opts) => {
    let v = opts.xrf
    if( opts.selected ){
      xrf.frag.href.audio.hover.stop() 
      xrf.frag.href.audio.hover.play() 
      return
    }
    if( opts.click ){
      xrf.frag.href.audio.click.stop() 
      xrf.frag.href.audio.click.play() 
      return
    }
  })

  xrf.addEventListener('navigateLoading', (e) => {
      xrf.frag.href.audio.click.stop() 
      xrf.frag.href.audio.teleport.stop() 
      xrf.frag.href.audio.teleport.play() 
  })


})

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
// this is called by navigator.js rather than by a URL e.g.

xrf.frag.defaultPredefinedViews = (opts) => {
  let {scene,model} = opts;
  scene.traverse( (n) => {
    if( n.userData && n.userData['#'] ){
      xrf.hashbus.pub( n.userData['#'], n )   // evaluate default XR fragments without affecting URL
    }
  })
}
xrf.frag.loop = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts

  // handle object media players
  if( mesh && mesh.media ){
    for( let i in mesh.media ) mesh.media[i].set("loop",v)
    return
  }

  // otherwise handle global 3D animations
  xrf.mixers.map ( (mixer) => {
    // update loop
    mixer.loop.enabled  = v.loop 

  })

}
xrf.frag.pos = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts

  let pos = v

  // spec: indirect coordinate using objectname: https://xrfragment.org/#navigating%203D
  if( pos.x == undefined ){
    let obj = scene.getObjectByName(v.string)
    if( !obj ) return 
    pos = obj.position.clone()
    obj.getWorldPosition(pos)
    camera.position.copy(pos)
  }else{ 
    // spec: direct coordinate: https://xrfragment.org/#navigating%203D
    camera.position.x = pos.x
    camera.position.y = pos.y
    camera.position.z = pos.z
  }

  if( xrf.debug ) console.log(`#pos.js: setting camera to position ${pos.x},${pos.y},${pos.z}`)

  xrf.frag.pos.last = pos // remember

  camera.updateMatrixWorld()
}

xrf.addEventListener('reset', (opts) => {
  // set the player to position 0,0,0
  xrf.camera.position.set(0,0,0)
})
xrf.frag.rot = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  if( xrf.debug ) console.log("#rot.js: setting camera rotation to "+v.string)
  if( !model.isSRC ){
    camera.rotation.set( 
      v.x * Math.PI / 180,
      v.y * Math.PI / 180,
      v.z * Math.PI / 180
    )
    camera.rotation.offset = camera.rotation.clone() // remember
    //camera.updateProjectionMatrix()
  }else{
    obj = model.scene.isReparented ? model.scene.children[0] : model.scene
    obj.rotation.set( 
      v.x * Math.PI / 180,
      v.y * Math.PI / 180,
      v.z * Math.PI / 180
    )
  }
}
xrf.frag.s = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts

  // handle object media players
  if( mesh && mesh.media ){
    for( let i in mesh.media ) mesh.media[i].set("s",v)
    return
  }

  // otherwise handle global 3D animations
  xrf.mixers.map ( (mixer) => {
    mixer.s = v
    
    // update speed
    mixer.timeScale     = v.x || 1.0 
    mixer.loop.speed    = v.x || 1.0
    mixer.loop.speedAbs = Math.abs( v.x )

  })

}
// *TODO* use webgl instancing

xrf.frag.src = function(v, opts){
  opts.embedded = v // indicate embedded XR fragment
  let { mesh, model, camera, scene, renderer, THREE, hashbus, frag} = opts

  if( mesh.isSRC ) return // only embed src once 

  let url       = xrf.frag.src.expandURI( mesh, v.string )
  let srcFrag   = opts.srcFrag = xrfragment.URI.parse(url)
  opts.isLocal  = v.string[0] == '#'
  opts.isPortal = xrf.frag.src.renderAsPortal(mesh)
  opts.isSRC    = mesh.isSRC = true 

  if(xrf.debug) console.log(`src.js: instancing ${opts.isLocal?'local':'remote'} object ${url}`)

  if( opts.isLocal ){
    xrf.frag.src.localSRC(url,srcFrag,opts)         // local
  }else xrf.frag.src.externalSRC(url,srcFrag,opts)  // external file

  xrf.hashbus.pub( url.replace(/.*#/,''), mesh)     // eval src-url fragments
}

xrf.frag.src.expandURI = function(mesh,uri){
  if( uri ) mesh.userData.srcTemplate = uri
  mesh.userData.src = xrf.URI.template( mesh.userData.srcTemplate, xrf.URI.vars.__object )
  return mesh.userData.src
}

xrf.frag.src.addModel = (model,url,frag,opts) => {
  let {mesh} = opts
  let scene = model.scene
  scene = xrf.frag.src.filterScene(scene,{...opts,frag})         // get filtered scene
  if( mesh.material && mesh.userData.src ) mesh.material.visible = false  // hide placeholder object

  if( opts.isPortal ){
    // only add remote objects, because 
    // local scene-objects are already added to scene
    xrf.portalNonEuclidian({...opts,model,scene:model.scene})
    if( !opts.isLocal ) xrf.scene.add(scene) 
  }else{
    xrf.frag.src.scale( scene, opts, url )           // scale scene
    mesh.add(scene)
  }
  xrf.frag.src.enableSourcePortation({scene,mesh,url,model})
  // flag everything isSRC & isXRF
  mesh.traverse( (n) => { n.isSRC = n.isXRF = n[ opts.isLocal ? 'isSRCLocal' : 'isSRCExternal' ] = true })
  
  xrf.emit('parseModel', {...opts, isSRC:true, mesh, model}) // this will execute all embedded metadata/fragments e.g.
}

xrf.frag.src.renderAsPortal = (mesh) => {
  // *TODO* should support better isFlat(mesh) check
  const isPlane           = mesh.geometry && mesh.geometry.attributes.uv && mesh.geometry.attributes.uv.count == 4 
  return xrf.hasNoMaterial(mesh) && isPlane
}

xrf.frag.src.enableSourcePortation = (opts) => {
  let {scene,mesh,url,model} = opts
  if( url[0] == '#' ) return

  url = url.replace(/(&)?[-][\w-+\.]+(&)?/g,'&') // remove negative selectors to refer to original scene

  if( !mesh.userData.href ){ 
    // show sourceportation clickable sphere for non-portals
    let scale = new THREE.Vector3()
    let size  = new THREE.Vector3()
    scene.getWorldScale(scale)
    new THREE.Box3().setFromObject(scene).getSize(size)
    const geo    = new THREE.SphereGeometry( Math.max(size.x, size.y, size.z) * scale.x * 0.33, 10, 10 )
    const mat    = new THREE.MeshBasicMaterial()
    mat.visible = false // we just use this for collisions
    const sphere = new THREE.Mesh( geo, mat )
    sphere.isXRF = true
    // reparent scene to sphere
    let children = mesh.children
    mesh.children = []
    mesh.add(sphere)
    children.map( (c) => sphere.add(c) )
    // make sphere clickable/hoverable
    let frag = {}
    xrf.Parser.parse("href", url, frag)
    sphere.userData = scene.userData  // allow rich href notifications/hovers
    sphere.userData.href = url.replace(/(&)?[-][\w-+\.]+(&)?/g,'&') // remove negative selectors to refer to original scene
    sphere.userData.XRF  = frag
    xrf.hashbus.pub.fragment("href", {...opts, mesh:sphere, frag, skipXRWG:true, renderer:xrf.renderer, camera:xrf.camera }) 
  }
  for ( let i in scene.userData ) {
    if( !mesh.userData[i] ) mesh.userData[i] = scene.userData[i] // allow rich href notifications/hovers
  }
}

xrf.frag.src.externalSRC = (url,frag,opts) => {
  fetch(url, { method: 'HEAD' })
  .then( (res) => {
    let mimetype = res.headers.get('Content-type')
    if(xrf.debug != undefined ) console.log("HEAD "+url+" => "+mimetype)
    if( url.replace(/#.*/,'').match(/\.(gltf|glb)$/)     ) mimetype = 'gltf'
    if( url.replace(/#.*/,'').match(/\.(frag|fs|glsl)$/) ) mimetype = 'x-shader/x-fragment'
    if( url.replace(/#.*/,'').match(/\.(vert|vs)$/)      ) mimetype = 'x-shader/x-fragment'
    //if( url.match(/\.(fbx|stl|obj)$/) ) mimetype = 
    opts = { ...opts, frag, mimetype }
    return xrf.frag.src.type[ mimetype ] ? xrf.frag.src.type[ mimetype ](url,opts) : xrf.frag.src.type.unknown(url,opts)
  })
  .then( (model) => {
    if( model && model.scene ) xrf.frag.src.addModel(model, url, frag, opts )
  })
  .finally( () => { })
  .catch( console.error )
  return xrf.frag.src
}

xrf.frag.src.localSRC = (url,frag,opts) => {
  let {model,mesh,scene} = opts
  //setTimeout( (mesh,scene) => {
    if( mesh.material ) mesh.material = mesh.material.clone() // clone, so we can individually highlight meshes
    let _model = {
      animations: model.animations,
      scene: scene.clone()
    }
    _model.scene.traverse( (n) => n.isXRF = true )  // make sure they respond to xrf.reset()
    _model.scenes = [_model.scene]
    xrf.frag.src.addModel(_model,url,frag, opts)    // current file 
  //},1000,mesh,scene )
}

// scale embedded XR fragments https://xrfragment.org/#scaling%20of%20instanced%20objects
xrf.frag.src.scale = function(scene, opts, url){
    let { mesh, model, camera, renderer, THREE} = opts

    // remove invisible objects (hidden by selectors) which might corrupt boundingbox size-detection 
    let cleanScene = scene.clone()
    let remove = []
    const notVisible = (n) => !n.visible || (n.material && !n.material.visible)
    cleanScene.traverse( (n) => notVisible(n) && n.children.length == 0 && (remove.push(n)) )
    remove.map( (n) => n.removeFromParent() )

    let restrictTo3DBoundingBox = mesh.geometry
    if( restrictTo3DBoundingBox ){ 
      // spec 3 of https://xrfragment.org/#src
      // spec 1 of https://xrfragment.org/#scaling%20of%20instanced%20objects  
      // normalize instanced objectsize to boundingbox
      let sizeFrom  = new THREE.Vector3()
      let sizeTo    = new THREE.Vector3()
      let empty = new THREE.Object3D()
      new THREE.Box3().setFromObject(mesh).getSize(sizeTo)
      new THREE.Box3().setFromObject(cleanScene).getSize(sizeFrom)
      let ratio = sizeFrom.divide(sizeTo)
      scene.scale.multiplyScalar( 1.0 / Math.max(ratio.x, ratio.y, ratio.z));
    }else{
      // spec 4 of https://xrfragment.org/#src
      // spec 2 of https://xrfragment.org/#scaling%20of%20instanced%20objects
      scene.scale.multiply( mesh.scale ) 
    }
}

xrf.frag.src.filterScene = (scene,opts) => {
  let { mesh, model, camera, renderer, THREE, hashbus, frag} = opts

  scene = xrf.filter.scene({scene,frag,reparent:true}) //,copyScene: opts.isPortal})

  if( !opts.isLocal ){
    scene.traverse( (m) => {
      if( m.userData && (m.userData.src || m.userData.href) ) return ; // prevent infinite recursion 
      xrf.parseModel.metadataInMesh(m,{scene,recursive:true})
    })
  }
  return scene
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
    reject(`${url} mimetype '${opts.mimetype}' not found or supported (yet)`)
  })
}
// this ns the global #t mediafragment handler (which affects the 3D animation)

xrf.frag.t = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts

  // handle object media players
  if( mesh && mesh.media ){
    for( let i in mesh.media ) mesh.media[i].set("t",v)
    return
  }
 
  // otherwise handle global 3D animations
  if( !model.mixer ) return 
  if( !model.animations || model.animations[0] == undefined ){
    console.warn('no animations found in model')
    return xrf.emit( v.x == 0 ? 'stop' : 'play',{isPlaying: v.x != 0 })
  }
    
  xrf.mixers.map ( (mixer) => {
    
    mixer.t = v
    
    // update speed
    mixer.timeScale     = mixer.loop.speed
    mixer.loop.speedAbs = Math.abs( mixer.timeScale )

    mixer.updateLoop( v )

    // play animations
    mixer.play( v )
  })
}

xrf.frag.t.default = {
  x:0,  // (play from) offset (in seconds)  
  y:0   // optional: (stop at) offset (in seconds)
}

// setup animation mixer for global scene & src scenes
xrf.addEventListener('parseModel', (opts) => {
  let {model} = opts
  let mixer   = model.mixer = new xrf.THREE.AnimationMixer(model.scene)
  mixer.model = model
  mixer.loop      = {timeStart:0,timeStop:0,speed:1.0}
  mixer.i         = xrf.mixers.length
  mixer.actions   = []

  model.animations.map( (anim) => { 
    anim.optimize()
    if( xrf.debug ) console.log("action: "+anim.name)
    mixer.actions.push( mixer.clipAction( anim, model.scene ) )
  })

  mixer.play  = (t) => {
    mixer.isPlaying = t.x !== undefined && t.x != t.y 
    mixer.updateLoop(t)
    xrf.emit( mixer.isPlaying === false ? 'stop' : 'play',{isPlaying: mixer.isPlaying})
  }

  mixer.stop = () => {
    mixer.play(false)
  }

  mixer.updateLoop = (t) => {
    if( t ){
      mixer.loop.timeStart = t.x != undefined ? t.x : mixer.loop.timeStart
      mixer.loop.timeStop  = t.y != undefined ? t.y : mixer.duration
    }
    mixer.actions.map( (action) => { 
      if( mixer.loop.timeStart != undefined ){
        action.time = mixer.loop.timeStart
        action.setLoop( xrf.THREE.LoopOnce, )
        action.timeScale = mixer.timeScale
        action.enabled = true
        if( t && t.x != undefined ) action.play() 
      }
    })
    mixer.setTime(mixer.loop.timeStart)
    mixer.time = Math.abs( mixer.loop.timeStart )
    mixer.update(0)
  }

  // monkeypatch: update loop when needed 
  if( !mixer.update.patched ){

    let update = mixer.update
    mixer.update = function(time){
      mixer.time = Math.abs(mixer.time)
      if( time == 0 ) return update.call(this,time)

      // loop jump
      if( mixer.loop.timeStop > 0 && mixer.time > mixer.loop.timeStop ){ 
        if( mixer.loop.enabled ){
          setTimeout( () => mixer.updateLoop(), 0 ) // prevent recursion
        }else mixer.stop()
      }
      return update.call( this, time )
    }
    mixer.update.patched = true
  }

  // calculate total duration/frame based on longest animation
  mixer.duration  = 0
  if( model.animations.length ){
    model.animations.map( (a) => mixer.duration = ( a.duration > mixer.duration ) ? a.duration : mixer.duration )
  }

  xrf.mixers.push(mixer)
})

if( document.location.hash.match(/t=/) ){
  let url = document.location.href
  let playAfterUserGesture = () => {
    xrf.hashbus.pub(url) // re-post t fragment on the hashbus again
    window.removeEventListener('click',playAfterUserGesture)
    window.removeEventListener('touchstart',playAfterUserGesture)
  }
  window.addEventListener('click', playAfterUserGesture )
  window.addEventListener('touchstart', playAfterUserGesture )
}

xrf.addEventListener('render', (opts) => {
  let model = xrf.model
  let {time} = opts
  if( !model ) return 
  if( xrf.mixers.length ){
    xrf.mixers.map( (m) => m.isPlaying && (m.update( time )) )

    // update active camera in case selected by dynamicKey in URI 
    if( xrf.model.camera && xrf.model.camera.length && model.mixer.isPlaying ){

      let cam = xrf.camera.getCam() 
      // cam.fov = model.cameras[0].fov (why is blender not exporting radians?)
      cam.far = model.cameras[0].far
      cam.near = model.cameras[0].near

      let rig = xrf.camera
      rig.position.copy( model.cameras[0].position )
      rig.position.y -= rig.offsetY // VR/AR compensate camera rig
      //rig.rotation.copy( model.cameras[0].rotation )

      rig.updateProjectionMatrix()
    }
  }
})

// remove mixers and stop mixers when loading another scene
xrf.addEventListener('reset', (opts) => {
  xrf.mixers.map( (m) => m.stop())
  xrf.mixers = []
})
xrf.frag.uv = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts

  if( !mesh.geometry ) return // nothing to do here
  if( v.floats.length != 4 ) return console.warn('xrfragment.js: got less than 4 uv values ')

  xrf.frag.uv.init(mesh)
  mesh.uv.u      = v.floats[0]
  mesh.uv.v      = v.floats[1]
  mesh.uv.uspeed = v.floats[2] || 1.0
  mesh.uv.vspeed = v.floats[3] || 1.0
  mesh.uv.ushift = v.shift[0]  || v.floats[0] < 0  // negative u is always relative 
  mesh.uv.vshift = v.shift[1]  || v.floats[1] < 0  // negative v is always relative
  mesh.uv.uloop  = v.shift[2]  || false
  mesh.uv.vloop  = v.shift[3]  || false

  mesh.onBeforeRender = xrf.frag.uv.scroll
}

xrf.frag.uv.init = function(mesh){
  if( !mesh.uv  ) mesh.uv   = {u:0, v:0, uspeed:1, vspeed:1, uloop:false, vloop:false, uv:false}

  let uv    = mesh.geometry.getAttribute("uv")
  if( !uv.old ) uv.old = mesh.geometry.getAttribute("uv").clone()
}

xrf.frag.uv.scroll = function(){

  let diffU  = 0.0 // distance to end-state (non-looping mode)
  let diffV  = 0.0 // distance to end-state (non-looping mode)
  let uv     = this.geometry.getAttribute("uv")

  // translate!
  for( let i = 0; i < uv.count; i++ ){

    if( this.uv.uspeed == 1.0 ) uv.setX(i, this.uv.ushift ? uv.getX(i) + this.uv.u : uv.old.getX(i) + this.uv.u )
    if( this.uv.vspeed == 1.0 ) uv.setY(i, this.uv.vshift ? uv.getY(i) + this.uv.v : uv.old.getY(i) + this.uv.v )

    if( this.uv.uspeed != 1.0 || this.uv.vspeed != 1.0 ){
      let u         = uv.getX(i)     
      let v         = uv.getY(i)     
      let uTarget   = this.uv.ushift ? uv.getX(i) + this.uv.u : uv.old.getX(i) + this.uv.u
      let vTarget   = this.uv.vshift ? uv.getY(i) + this.uv.v : uv.old.getY(i) + this.uv.v

      // scroll U
      if( this.uv.uloop ){
        u += this.uv.uspeed * xrf.clock.delta
      }else{
        // *TODO* tween to offset
        //// recover from super-high uv-values due to looped scrolling
        //if( Math.abs(u-uTarget) > 10.0 ) u = uv.old.getX(i)
        //u = u > uTarget ?  u + (this.uv.uspeed * -xrf.clock.delta)
        //                :  u + (this.uv.uspeed *  xrf.clock.delta) 
        //diffU += Math.abs( u - uTarget )  // are we done yet? (non-looping mode)
      } 

      // scroll V
      if( this.uv.vloop ){
        v += this.uv.vspeed * xrf.clock.delta
      }else{
        // *TODO* tween to offset
        //// recover from super-high uv-values due to looped scrolling
        //// recover from super-high uv-values due to looped scrolling
        //if( Math.abs(v-vTarget) > 10.0 ) v = uv.old.getY(i)
        //v = v > vTarget ?  v + (this.uv.vspeed * -xrf.clock.delta)
        //                :  v + (this.uv.vspeed *  xrf.clock.delta) 
        //diffV += Math.abs( v - vTarget )
      }
      uv.setXY(i,u,v)
    }

  }
  uv.needsUpdate = true

  if( (!this.uv.uloop && diffU < 0.05) &&
      (!this.uv.vloop && diffV < 0.05)
  ){ // stop animating if done
    this.onBeforeRender = function(){}
  }
}
xrf.getCollisionMeshes = () => {
  let meshes = []
  xrf.scene.traverse( (n) => {
    if( n.type == 'Mesh' && !n.userData.href && !n.userData.src && xrf.hasNoMaterial(n) ){
      meshes.push(n)
    }
  })
  return meshes
}
// wrapper to survive in/outside modules

xrf.interactiveGroup = function(THREE,renderer,camera){

  let {
    Group,
    Matrix4,
    Raycaster,
    Vector2
  } = THREE 

  const _pointer = new Vector2();
  const _event = { type: '', data: _pointer };
  let object   = {selected:false}

  class interactive extends Group {

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
            object.dispatchEvent( _event)
          }
        }

      }

      element.addEventListener( 'pointerdown', onPointerEvent );
      element.addEventListener( 'pointerup', onPointerEvent );
      element.addEventListener( 'pointermove', onPointerEvent );
      element.addEventListener( 'mousedown', onPointerEvent );
      element.addEventListener( 'mousemove', onPointerEvent );
      element.addEventListener( 'click', onPointerEvent );
      element.addEventListener( 'mouseup', onPointerEvent );

      // WebXR Controller Events
      // TODO: Dispatch pointerevents too

      const eventsMapper = {
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

          console.log(object.name)

          const intersection = intersections[ 0 ];

          object = intersection.object;
          const uv = intersection.uv;

          _event.type = eventsMapper[ event.type ];
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

    add(obj, unparent){
      if( unparent ) Group.prototype.add.call( this, obj )
      this.objects.push(obj)
    }

  }

  return new interactive(renderer,camera)
}
xrf.optimize = (opts) => {
  opts.animatedObjects = []

  xrf.optimize
  .checkAnimations(opts)
  .freezeUnAnimatedObjects(opts)
  .disableShadows(opts)
  .disableEmbeddedLights(opts)
  .removeDuplicateLights()
}

  // check unused animations
xrf.optimize.checkAnimations = (opts) => {
  if( xrf.debug ) console.log("TODO: fix freezeUnAnimatedObjects for SRC's")
  return xrf.optimize

  let {model} = opts
  model.animations.map( (anim) => {  
    // collect zombie animations and warn user
    let zombies = anim.tracks.map( (t) => {
      let name = t.name.replace(/\..*/,'')
      let obj  = model.scene.getObjectByName(name)
      if( !model.scene.getObjectByName(name) ) return {anim:anim.name,obj:name}
      else opts.animatedObjects.push(name)
      return undefined
    })
    if( zombies.length > 0 ){ // only warn for zombies in main scene (because src-scenes might be filtered anyways)
      zombies
      .filter( (z) => z ) // filter out undefined
      .map( (z) => console.warn(`gltf: object '${z.obj}' not found (anim: '${z.anim}'`) )
      console.warn(`TIP: remove dots in objectnames in blender (which adds dots when duplicating)`)
    } 
  })
  return xrf.optimize
}

xrf.optimize.freezeUnAnimatedObjects = (opts) => {
  if( xrf.todo ) console.log("TODO: fix freezeUnAnimatedObjects for SRC's")
  return xrf.optimize

  let {model}  = opts
  let scene = model.scene
  // increase performance by freezing all objects
  scene.traverse( (n) => n.matrixAutoUpdate = false )
  // except animated objects and children
  scene.traverse( (n) => {
    if( ~opts.animatedObjects.indexOf(n.name) ){
      n.matrixAutoUpdate = true 
      n.traverse( (m) => m.matrixAutoUpdate = true )
    }
  })
  return xrf.optimize
}

xrf.optimize.disableShadows = (opts) => {
  opts.model.scene.traverse( (n) => {
    if( n.castShadow !== undefined ) n.castShadow = false
  })
  return xrf.optimize
}

xrf.optimize.disableEmbeddedLights = (opts) => {
  if( !opts.isSRC ) return xrf.optimize
  // remove lights from SRC's
  opts.model.scene.traverse( (n) => {
    if( n.type.match(/light/i) ) n.remove()
  })
  return xrf.optimize
}

xrf.optimize.removeDuplicateLights = () => {
  // local/extern src's can cause duplicate lights which tax performance 
  let lights = {}
  xrf.scene.traverse( (n) => {
    if( n.type.match(/light/i) ){
      if( !lights[n.name] ) lights[n.name] = true 
      else n.remove()
    }
  })
  return xrf.optimize
}

xrf.addEventListener('parseModel', (opts) => {
  xrf.optimize(opts)
})
// switch camera when multiple cameras for url #mycameraname

xrf.addEventListener('dynamicKey', (opts) => {
  // select active camera if any
  let {id,match,v} = opts
  match.map( (w) => {
    w.nodes.map( (node) => {
      if( node.isCamera ){ 
        console.log("switching camera to cam: "+node.name)
        xrf.model.camera = node 
      }
    })
  })
})

const doFilter = (opts) => {
  let {scene,id,match,v} = opts
  if( v.filter ){
    let frags = {}
    frags[ v.filter.key ] = v
    xrf.filter.scene({frag:frags,scene})
  }
}

xrf.addEventListener('dynamicKey', doFilter )
xrf.addEventListener('dynamicKeyValue', (opts) => {
  if( xrf.debug ) console.log("*TODO* filter integers only")
  // doFilter(opts)
})

// spec: https://xrfragment.org/#filters
xrf.filter = function(query, cb){
  let result = []
  if( !query     ) return result
  if( query[0] != '#' ) query = '#'+query
  // *TODO* jquery like utility func
  return result
}

xrf.filter.scene = function(opts){
  let {scene,frag} = opts

  scene = xrf.filter 
  .sort(frag)               // get (sorted) filters from XR Fragments
  .process(frag,scene,opts) // show/hide things

  scene.visible = true   // always enable scene

  return scene
}

xrf.filter.sort = function(frag){
  // get all filters from XR Fragments
  frag.filters = Object.values(frag)
                      .filter( (v) => v.filter ? v : null )
                      .sort( (a,b) => a.index > b.index )
  return xrf.filter
}

// opts = {copyScene:true} in case you want a copy of the scene (not filter the current scene inplace)
xrf.filter.process = function(frag,scene,opts){
  const cleanupKey   = (k) => k.replace(/[-\*\/]/g,'')
  let firstFilter    = frag.filters.length ? frag.filters[0].filter.get() : false 
  const hasName      = (m,name,filter)        => m.name == name 
  const hasNameOrTag = (m,name_or_tag,filter) => hasName(m,name_or_tag) || 
                                                 String(m.userData['tag']).match( new RegExp("(^| )"+name_or_tag) )

  // utility functions
  const getOrCloneMaterial = (o) => {
    if( o.material ){
      if( o.material.isXRF ) return o.material
      o.material = o.material.clone()
      o.material.isXRF = true
      return o.material
    }
    return {}
  }
  const setVisible = (n,visible,filter,processed) => {
    if( processed && processed[n.uuid] ) return 
    getOrCloneMaterial(n).visible = visible
    if( filter.deep ) n.traverse( (m) => getOrCloneMaterial(m).visible = visible )
    if( processed ) processed[n.uuid] == true 
  }

  // spec 2: https://xrfragment.org/doc/RFC_XR_Macros.html#embedding-xr-content-using-src
  // reparent scene based on objectname in case it matches a (non-negating) selector 
  if( opts.reparent && firstFilter && !firstFilter.value && firstFilter.show === true ){
    let obj 
    frag.target = firstFilter
    scene.traverse( (n) => hasName(n, firstFilter.key,firstFilter) && (obj = n) )
    if( xrf.debug ) console.log("reparent "+firstFilter.key+" "+((opts.copyScene)?"copy":"inplace"))
    if(obj ){
      obj.position.set(0,0,0)
      if( opts.copyScene ) {
        opts.copyScene = new xrf.THREE.Scene()
        opts.copyScene.children[0] = obj  // we dont use .add() as that reparents it from the original scene
      }else{
        // empty current scene and add obj
        while( scene.children.length > 0 ) scene.children[0].removeFromParent()
        scene.add( obj )
      }
    }else{
      console.warn("could not reparent scene to object "+firstFilter.key+" (not found)")
      opts.copyScene = new xrf.THREE.Scene() // return empty scene
    } 
    if( opts.copyScene ) scene = opts.copyScene
    if( obj ) obj.isReparented = true
  }

  // then show/hide things based on secondary selectors
  // we don't use the XRWG (everything) because we process only the given (sub)scene
  frag.filters.map( (v) => {
    const filter  = v.filter.get()
    const name_or_tag = cleanupKey(v.fragment)
    let processed = {}
    let extembeds = {}

    // hide external objects temporarely (prevent them getting filtered too)
    scene.traverse( (m) => {
      if( m.isSRCExternal ){
        m.traverse( (n) => (extembeds[ n.uuid ] = m) && (m.visible = false) )
      }
    })

    scene.traverseVisible( (m) => {
      // filter on value(expression) #foo=>3 e.g. *TODO* do this in XRWG
      if( filter.value && m.userData[filter.key] ){
        const visible = v.filter.testProperty(filter.key, m.userData[filter.key], filter.show === false )
        setVisible(m,visible,filter,processed)
        return
      }
      if( hasNameOrTag(m,name_or_tag,filter ) ){
        setVisible(m,filter.show,filter)
      }
    })

    // show external objects again 
    for ( let i in extembeds ) extembeds[i].visible = true
  })

  return scene 
}

xrf.frag.dynamic.material = function(v,opts){
  let {match} = opts

  // update material in case of <tag_or_object>[*]=<materialname>
  let material
  xrf.scene.traverse( (n) => n.material && (n.material.name == v.string) && (material = n.material) )
  if( !material && !v.reset ) return // nothing to do

  xrf.XRWG.deepApplyMatch(match, v, (match,v,node,type) => {
    if( node.material ) xrf.frag.dynamic.material.set( node, material, v.reset )
  })
}

xrf.frag.dynamic.material.set = function(mesh,material,reset){
  if( !mesh.materialOriginal ) mesh.materialOriginal = mesh.material
  let visible = mesh.material.visible //remember
  if( reset ){
    mesh.material = mesh.materialOriginal
  }else mesh.material = material
  mesh.material.visible = visible
}

// for reset calls like href: xrf://!myobject e.g.
xrf.addEventListener('dynamicKey', (opts) => {

  let {v,match} = opts

  if( v.reset ){
    xrf.XRWG.deepApplyMatch(match,v, (match,v,node,type) => {
      if( node.material ) xrf.frag.dynamic.material.set( node, null, v.reset )
    })
  } 

})

// this holds all the URI Template variables (https://www.rfc-editor.org/rfc/rfc6570)

xrf.addEventListener('parseModel', (opts) => {
  let {model,url,file} = opts
  if( model.isSRC || opts.isSRC ) return // ignore SRC models

  xrf.URI.vars = new Proxy({},{
    set(me,k,v){ 
      if( k.match(/^(name)$/) ) return
      me[k] = v 
    },
    get(me,k  ){ 
      if( k == '__object' ){
        let obj = {}
        for( let i in xrf.URI.vars ) obj[i] = xrf.URI.vars[i]()
        return obj
      }
      return me[k] 
    },
  })

  model.scene.traverse( (n) => {
    const variables = /{([a-zA-Z0-9-]+)}/g

    if( n.userData ){
      for( let i in n.userData ){
        if( i[0] == '#' || i.match(/^(href|tag)$/) ) continue // ignore XR Fragment aliases
        if( i == 'src' ){
          // lets declare empty variables found in src-values ('https://foo.com/video.mp4#{somevar}') e.g.
          if( n.userData[i].match(variables) ){
            let vars = [].concat( n.userData[i].match(variables) )
            const strip = (v) => v.replace(/[{}]/g,'')
            vars.map( (v) => xrf.URI.vars[ strip(v) ] = () => '' )
          }
        }else xrf.URI.vars[i] = () => n.userData[i] // declare variables with values
      }
    }
  })

})


xrf.addEventListener('dynamicKeyValue', (opts) => {
  // select active camera if any
  let {id,match,v} = opts

  if( !v.is( xrf.XRF.CUSTOMFRAG) ) return // only process custom frags from here
  if( v.string.match(/(<|>)/) )    return // ignore filter values
   
  if( match.length > 0 ){
    xrf.frag.dynamic.material(v,opts) // check if fragment is an objectname
  }
  
  if( !xrf.URI.vars[ v.string ] )           return console.error(`'${v.string}' metadata-key not found in scene`)        
  //if( xrf.URI.vars[ id ] && !match.length ) return console.error(`'${id}'       object/tag/metadata-key not found in scene`)

  if( xrf.debug ) console.log(`URI.vars[${id}]='${v.string}'`)

  if( xrf.URI.vars[id] ){
    xrf.URI.vars[ id ] = xrf.URI.vars[ v.string ]     // update var
    xrf.scene.traverse( (n) => {                      
      // re-expand src-values which use the updated URI Template var 
      if( n.userData && n.userData.src && n.userData.srcTemplate && n.userData.srcTemplate.match(`{${id}}`) ){
        let srcNewFragments = xrf.frag.src.expandURI( n ).replace(/.*#/,'')
        console.log(`URI.vars[${id}] => updating ${n.name} => ${srcNewFragments}`)
        let frag = xrf.hashbus.pub( srcNewFragments, n )
      }
    })
  }else{
    xrf.XRWG.deepApplyMatch(match, v, (match,v,node,type) => {
      console.log(v.string)
      if( node.geometry ) xrf.hashbus.pub( xrf.URI.vars[ v.string ](), node) // apply fragment mesh(es)
    })
  }

})
xrf.addEventListener('dynamicKey', (opts) => {
  let {scene,id,match,v} = opts
  if( !scene ) return 
  let remove = []

  // erase previous lines
  xrf.focusLine.lines.map( (line) => line.parent && (line.parent.remove(line))  )
  xrf.focusLine.points = []
  xrf.focusLine.lines  = []

  // drawlines
  match.map( (w) => {
    w.nodes.map( (mesh) => xrf.drawLineToMesh({ ...opts, mesh}) )
  })
})

xrf.drawLineToMesh = (opts) => {
  let {scene,mesh,frag,id} = opts
  const THREE = xrf.THREE
  let oldSelection
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

      let cam = xrf.camera.getCam ? xrf.camera.getCam() : xrf.camera // *FIXME* camerarig/rig are conflicting
      cam.updateMatrixWorld(true); // always keeps me diving into the docs :]
      cam.getWorldPosition(from)
      from.y = 0.5 // originate from the heart chakra! :p
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

xrf.addEventListener('render', (opts) => {
  // update focusline 
  let {time,model} = opts
  if( !xrf.clock ) return 
  xrf.focusLine.material.color.r  = (1.0 + Math.sin( xrf.clock.getElapsedTime()*10  ))/2
  xrf.focusLine.material.dashSize = 0.2 + 0.02*Math.sin( xrf.clock.getElapsedTime()  )
  xrf.focusLine.material.gapSize  = 0.1 + 0.02*Math.sin( xrf.clock.getElapsedTime() *3  )
  xrf.focusLine.material.opacity  = (0.25 + 0.15*Math.sin( xrf.clock.getElapsedTime() * 3 )) * xrf.focusLine.opacity;
  if( xrf.focusLine.opacity > 0.0 ) xrf.focusLine.opacity -= time*0.2
  if( xrf.focusLine.opacity < 0.0 ) xrf.focusLine.opacity = 0
})
/*
 * mimetype: audio/aac 
 * mimetype: audio/mpeg 
 * mimetype: audio/ogg 
 * mimetype: audio/weba 
 * mimetype: audio/wav 
 */

let loadAudio = (mimetype) => function(url,opts){
  let {mesh,src,camera,THREE} = opts
  let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)
  let frag = xrf.URI.parse( url )

  xrf.init.audio()
  let isPositionalAudio = !(mesh.position.x == 0 && mesh.position.y == 0 && mesh.position.z == 0)
  const audioLoader = new THREE.AudioLoader();
  let sound = isPositionalAudio ? new THREE.PositionalAudio( camera.listener) 
                                : new THREE.Audio( camera.listener )

  mesh.media = mesh.media || {}
  mesh.media.audio = { set: (mediafragment,v) => mesh.media.audio[mediafragment] = v }

  let finalUrl = url.replace(/#.*/,'')
  if( xrf.debug != undefined ) console.log("GET "+finalUrl)
  audioLoader.load( finalUrl, function( buffer ) {

    sound.setBuffer( buffer );
    sound.setLoop(false);
    sound.setVolume( 1.0 )
    if( isPositionalAudio ){
      sound.setRefDistance( mesh.scale.x);
      sound.setRolloffFactor(20.0)
      //sound.setDirectionalCone( 360, 360, 0.01 );
    }else sound.setVolume( mesh.scale.x )

    mesh.add(sound)

    sound.set = (mediafragment,v) => {
      try{
        sound[mediafragment] = v 

        if( mediafragment == 't'){

          if( sound.isPlaying && v.y != undefined && v.x == v.y ){
            sound.offset = v.x * buffer.sampleRate ;
            sound.pause()
            return 
          }else sound.stop()

          // apply embedded audio/video samplerate/fps or global mixer fps
          sound.setLoopStart(v.x);
          sound.setLoopEnd(v.y || buffer.duration);
          sound.offset = v.x;
          sound.play()
        }

        if( mediafragment == 's'){
          // *TODO* https://stackoverflow.com/questions/12484052/how-can-i-reverse-playback-in-web-audio-api-but-keep-a-forward-version-as-well 
          sound.pause()
          sound.setPlaybackRate( Math.abs(v.x) ) // WebAudio does not support negative playback
          sound.play()
        }

        if( mediafragment == 'loop'){
          sound.pause()
          sound.setLoop( v.loop )
          sound.play()
        }
      }catch(e){ console.warn(e) }
    }

    let lazySet = {}
    let mediaFragments = ['loop','s','t']
    mediaFragments.map( (f) => mesh.media.audio[f] && (lazySet[f] = mesh.media.audio[f]) )
    mesh.media.audio = sound

    // autoplay if user already requested play (before the sound was loaded)
    mediaFragments.map( (f) => {
      if( lazySet[f] ) mesh.media.audio.set(f, lazySet[f] )
    })

  });

  // apply Media fragments from URL 
  (['t','loop','s']).map( (f) => { 
    if( frag[f] ){
      mesh.media.audio.set( f, frag[f] )
    }
  })

}

xrf.init.audio = (opts) => {
  let camera = xrf.camera
  /* WebAudio: setup context via THREEjs */
  if( !camera.listener ){
    camera.listener = new THREE.AudioListener();
    // *FIXME* camera vs camerarig conflict
    (camera.getCam ? camera.getCam() : camera).add( camera.listener );
    xrf.emit('audioInited',{listener:camera.listener, ...opts})
  }
}
xrf.addEventListener('init', xrf.init.audio )

// stop playing audio when loading another scene
xrf.addEventListener('reset', () => {
  xrf.scene.traverse( (n)  => {
    if( n.media && n.media.audio ){
      if( n.media.audio.stop ) n.media.audio.stop()
      if( n.media.audio.remove ) n.media.audio.remove()
    }
  })
})



let audioMimeTypes = [
  'audio/x-wav',
  'audio/wav',
  'audio/mpeg',
  'audio/mp3',
  'audio/weba',
  'audio/aac',
  'application/ogg'
]
audioMimeTypes.map( (mimetype) =>  xrf.frag.src.type[ mimetype ] = loadAudio(mimetype) )
/*
 * mimetype: model/gltf+json
 */

xrf.frag.src.type['fbx'] = function( url, opts ){
  return new Promise( async (resolve,reject) => {
    let {mesh,src} = opts
    let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)
    let loader

    let {THREE}        = await import('https://unpkg.com/three@0.161.0/build/three.module.js')
    let  { FBXLoader } = await import('three/addons/loaders/FBXLoader.js')
    debugger

    //const Loader = xrf.loaders[ext]
    //if( !Loader ) throw 'xrfragment: no loader passed to xrfragment for extension .'+ext 
    //if( !dir.match("://") ){ // force relative path 
    //  dir = dir[0] == './' ? dir : `./${dir}`
    //  loader = new Loader().setPath( dir )
    //}else loader = new Loader()

    //loader.load(url, (model) => {
    //  model.isSRC = true
    //  resolve(model)
    //})
  })
}

/* 
 * extensions: .frag/.fs/.vs/.vert
 */

xrf.frag.src.type['x-shader/x-fragment'] = function(url,opts){
  let {mesh,THREE} = opts

  let isFragmentShader = /\.(fs|frag|glsl)$/
  let isVertexShader   = /\.(vs|vert)$/

  let shaderReqs = []
  let shaderCode = {}
  let shader   = {
    fragment: { code: '', url: url.match( isFragmentShader ) ? url : '' },
    vertex:   { code: '', url: url.match( isVertexShader   ) ? url : '' }
  }
  
  var onShaderLoaded = ((args) => (type, status, code) => {
    shader[type].status = status 
    shader[type].code   = code 
    if( shader.fragment.code && shader.vertex.code ){
      
      let oldMaterial = mesh.material
      mesh.material = new THREE.RawShaderMaterial({
        uniforms: {
          time: { value: 1.0 },
          resolution: { value: new THREE.Vector2(1.0,1.0) }
        },
        // basic shaders include following common vars/funcs: https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderChunk/common.glsl.js
        fragmentShader: shader.fragment.status == 200 ? shader.fragment.code : THREE.ShaderChunk.meshbasic_frag,
        vertexShader:   shader.vertex.status   == 200 ? shader.vertex.code   : THREE.ShaderChunk.meshbasic_vert,

      });

      mesh.material.needsUpdate = true 
      mesh.needsUpdate          = true

      mesh.onBeforeRender = () => {
        if( !mesh.material || !mesh.material.uniforms ) return mesh.onBeforeRender = function(){}
        mesh.material.uniforms.time.value = xrf.clock.elapsedTime
      }

    }

  })({})

  // sidecar-load vertex shader file
  if( shader.fragment.url && !shader.vertex.url ){  
    shader.vertex.url = shader.fragment.url.replace(/\.fs$/,   '.vs')
                                           .replace(/\.frag$/, '.vert')
  }
   
  if( shader.fragment.url ){
    fetch(shader.fragment.url)
    .then( (res) => res.text().then( (code) => onShaderLoaded('fragment',res.status,code) ) )
  }

  if( shader.vertex.url ){
    fetch(shader.vertex.url)
    .then( (res) => res.text().then( (code) => onShaderLoaded('vertex',res.status,code) ) )
  }

}

xrf.frag.src.type['x-shader/x-vertex']   = xrf.frag.src.type['x-shader/x-fragment']

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
      dir = dir.substr(0,2) == './' ? dir : `./${dir}`
      loader = new Loader().setPath( dir )
    }else{
      loader = new Loader() 
    }

    loader.load(url, (model) => {
      model.isSRC = true
      resolve(model)
    })
  })
}


let loadHTML = (mimetype) => function(url,opts){
  let {mesh,src,camera} = opts
  let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)
  let frag = xrf.URI.parse( url )
  console.warn("todo: html viewer for src not implemented")
}

let htmlMimeTypes = [
  'text/html'
]
htmlMimeTypes.map( (mimetype) =>  xrf.frag.src.type[ mimetype ] = loadHTML(mimetype) )
/*
 * mimetype: image/png 
 * mimetype: image/jpg 
 * mimetype: image/gif 
 */

xrf.frag.src.type['image/png'] = function(url,opts){
  let {mesh,THREE} = opts
  let restrictTo3DBoundingBox = mesh.geometry

  mesh.material = new xrf.THREE.MeshBasicMaterial({ 
    map: null, 
    transparent: url.match(/\.(png|gif)/) ? true : false,
    side: THREE.DoubleSide,
    color: 0xFFFFFF,
    opacity:1
  });

  let renderImage = (texture) => {
    let img = {w: texture.source.data.width, h: texture.source.data.height}

    // stretch image by pinning uv-coordinates to corners 
    if( mesh.geometry ){
      if( mesh.geometry.attributes.uv ){ // buffergeometries 
        let uv = mesh.geometry.attributes.uv;
      }else {
        console.warn("xrfragment: uv's of ${url} might be off for non-buffer-geometries *TODO*")
        //if( geometry.faceVertexUvs ){
        // *TODO* force uv's of dynamically created geometries (in threejs)
        //}
      }
    }
    mesh.material.map = texture
    mesh.material.needsUpdate = true 
    mesh.needsUpdate = true

    //// *TODO* update clones in portals or dont clone scene of portals..
    //xrf.scene.traverse( (n) => {
    //  if( n.userData.src == mesh.userData.src && mesh.uuid != n.uuid ){
    //    n.material = mesh.material
    //    n.material.needsUpdate = true
    //  }
    //})
  } 

  let onLoad = (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    renderImage(texture)
  }

  new THREE.TextureLoader().load( url, onLoad, null, console.error );

}

xrf.frag.src.type['image/gif'] = xrf.frag.src.type['image/png']
xrf.frag.src.type['image/jpeg'] = xrf.frag.src.type['image/png']

// spec 8: https://xrfragment.org/doc/RFC_XR_Macros.html#embedding-xr-content-using-src

xrf.portalNonEuclidian = function(opts){
  let { frag, mesh, model, camera, scene, renderer} = opts

  mesh.portal = {
    pos: mesh.position.clone(),
    posWorld: new xrf.THREE.Vector3(),
    posWorldCamera: new xrf.THREE.Vector3(),
    stencilRef: xrf.portalNonEuclidian.stencilRef,
    needUpdate: false,
    stencilObject: false,
    cameraDirection: new xrf.THREE.Vector3(),
    cameraPosition: new xrf.THREE.Vector3(),
    raycaster: new xrf.THREE.Raycaster(),
    isLocal: opts.isLocal,
    isLens: false,
    isInside: false,
    setStencil:  (stencilRef) => mesh.portal.stencilObjects.traverse( (n) => showPortal(n, stencilRef == 0) && n.stencil && n.stencil(stencilRef) ),
    positionObjectsIfNeeded: (pos,scale)  => !mesh.portal.isLens &&  mesh.portal.stencilObjects.traverse( (n) =>  n.positionAtStencil && (n.positionAtStencil(pos,scale)) )
  }

  // allow objects to flip between original and stencil position (which puts them behind stencilplane)
  const addStencilFeature = (n) => { 
    if( n.stencil ) return n // run once

    n.stencil = (sRef ) => xrf.portalNonEuclidian.selectStencil(n, sRef )
    n.positionAtStencil = (pos,scale) => (newPos,newScale) => {
      n.position.copy( newPos || pos )
      n.scale.copy( scale )
      n.updateMatrixWorld(true)
    }
    // curry function 
    n.positionAtStencil = n.positionAtStencil( n.position.clone(), n.scale.clone() )
    return n
  }

  this.setupStencilObjects = (scene,opts) => {
    // collect related objects to render inside stencilplane
    let stencilObject         = scene 
    if( opts.srcFrag.target ){
      stencilObject = scene.getObjectByName( opts.srcFrag.target.key ) 
      // spec: if src-object is child of portal (then portal is lens, and should include all children )
      mesh.traverse( (n) => n.name == opts.srcFrag.target.key && (stencilObject = n) && (mesh.portal.isLens = true) ) 
    }

    if( !stencilObject ) return console.warn(`no objects were found (src:${mesh.userData.src}) for (portal)object name '${mesh.name}'`)
    mesh.portal.stencilObject = stencilObject 

    // spec: if src points to child, act as lens
    if( !mesh.portal.isLocal || mesh.portal.isLens )  stencilObject.visible = false 

    let stencilObjects = [stencilObject]
    stencilObjects = stencilObjects
                     .filter( (n) => !n.portal ) // filter out (self)references to portals (prevent recursion)
                     .map(addStencilFeature)

    // put it into a scene (without .add() because it reparents objects) so we can render it separately
    mesh.portal.stencilObjects = new xrf.THREE.Scene()
    mesh.portal.stencilObjects.children = stencilObjects 
    mesh.portal.stencilObjects.isXRF = true 

    xrf.portalNonEuclidian.stencilRef += 1 // each portal has unique stencil id
    if( xrf.debug ) console.log(`enabling portal for object '${mesh.name}' (stencilRef:${mesh.portal.stencilRef})`)
  
    return this
  }

  // enable the stencil-material of the stencil objects to prevent stackoverflow (portal in portal rendering)
  const showPortal = (n,show) => {
    if( n.portal ) n.visible = show
    return true
  }

  this.setupListeners = () => {

    // below is a somewhat weird tapdance to render the portals **after** the scene 
    // is rendered (otherwise it messes up occlusion)

    mesh.onAfterRender = function(renderer, scene, camera, geometry, material, group ){
      mesh.portal.needUpdate = true
    }

    xrf.addEventListener('renderPost', (opts) => {
      let {scene,camera,time,render,renderer} = opts

      if( mesh.portal.needUpdate && mesh.portal && mesh.portal.stencilObjects ){  
        let cameraDirection            = mesh.portal.cameraDirection
        let cameraPosition             = mesh.portal.cameraPosition
        let stencilRef                 = mesh.portal.stencilRef
        let newPos                     = mesh.portal.posWorld
        let stencilObject              = mesh.portal.stencilObject
        let newScale                   = mesh.scale 
        let raycaster                  = mesh.portal.raycaster

        let cam = xrf.camera.getCam ? xrf.camera.getCam() : camera
        cam.getWorldPosition(cameraPosition)
        cam.getWorldDirection(cameraDirection)
        if( cameraPosition.distanceTo(newPos) > 15.0 ) return // dont render far portals 

        // init
        if( !mesh.portal.isLocal || mesh.portal.isLens ) stencilObject.visible = true 
        mesh.portal.setStencil(stencilRef)
        renderer.autoClear             = false 
        renderer.autoClearDepth        = false 
        renderer.autoClearColor        = false 
        renderer.autoClearStencil      = false 
        // render
        render( mesh.portal.stencilObjects, camera )
        // de-init 
        renderer.autoClear             = true 
        renderer.autoClearDepth        = true 
        renderer.autoClearColor        = true 
        renderer.autoClearStencil      = true 
        mesh.portal.setStencil(0)
        if( !mesh.portal.isLocal || mesh.portal.isLens ) stencilObject.visible = false 


        // trigger href upon camera collide
        if( mesh.userData.XRF.href ){
          raycaster.far = 0.35
          raycaster.set(cameraPosition, cameraDirection )
          intersects = raycaster.intersectObjects([mesh], false)
          if (intersects.length > 0 && !mesh.portal.teleporting ){
            mesh.portal.teleporting = true
            mesh.userData.XRF.href.exec({nocommit:true})
            setTimeout( () => mesh.portal.teleporting = false, 500) // dont flip back and forth
          }
        }
      }
      mesh.portal.needUpdate = false
    })



    return this
  }

  // turn mesh into stencilplane 
  xrf
  .portalNonEuclidian
  .setMaterial(mesh)
  .getWorldPosition(mesh.portal.posWorld)

  this
  .setupListeners()
  .setupStencilObjects(scene,opts)

  // move portal objects to portalposition
  if( mesh.portal.stencilObjects ) mesh.portal.positionObjectsIfNeeded(mesh.portal.posWorld, mesh.scale)
}

xrf.portalNonEuclidian.selectStencil = (n, stencilRef, nested) => {
  if( n.material ){
    n.material.stencilRef   = stencilRef 
    n.material.stencilWrite = stencilRef > 0 
    n.material.stencilFunc  = xrf.THREE.EqualStencilFunc;
  }
  if( n.children && !nested ) n.traverse( (m) => !m.portal && (xrf.portalNonEuclidian.selectStencil(m,stencilRef,true)) )
}
  
xrf.portalNonEuclidian.setMaterial = function(mesh){
  mesh.material = new xrf.THREE.MeshBasicMaterial({ color: 'orange' });
  mesh.material.depthWrite   = false;
  mesh.material.colorWrite   = false;
  mesh.material.stencilWrite = true;
  mesh.material.stencilRef   = xrf.portalNonEuclidian.stencilRef;
  mesh.material.stencilFunc  = xrf.THREE.AlwaysStencilFunc;
  mesh.material.stencilZPass = xrf.THREE.ReplaceStencilOp;
  mesh.material.stencilZFail = xrf.THREE.ReplaceStencilOp;
  return mesh
}

xrf.addEventListener('parseModel',(opts) => {
  const scene = opts.model.scene
})


// (re)set portalObjects when entering/leaving a portal 
let updatePortals = (opts) => {
  xrf.scene.traverse( (n) => {
    if( !n.portal ) return 
    // move objects back to the portal 
    if( n.portal.isInside ) n.portal.positionObjectsIfNeeded( n.portal.posWorld, n.scale )
    n.portal.isInside = false
  })
  if( opts.mesh && opts.mesh.portal && opts.click ){
    opts.mesh.portal.isInside = true
    opts.mesh.portal.positionObjectsIfNeeded() // move objects back to original pos (since we are teleporting there)
  }
}

xrf.addEventListener('href', (opts) => opts.click && updatePortals(opts) )
xrf.addEventListener('navigate', updatePortals )

xrf.portalNonEuclidian.stencilRef = 1

let loadVideo = (mimetype) => function(url,opts){
  let {mesh,src,camera} = opts
  let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)
  const THREE = xrf.THREE
  let frag = xrf.URI.parse( url )

  mesh.media = mesh.media || {}

  let video = mesh.media.video = document.createElement('video')
  video.setAttribute("crossOrigin","anonymous")
  video.setAttribute("playsinline",'')
  video.addEventListener('loadedmetadata', function(){
    let texture = new THREE.VideoTexture( video );
    texture.colorSpace = THREE.SRGBColorSpace;
    let mat     = new xrf.THREE.MeshBasicMaterial()
    mat.map = texture
    mesh.material = mat
    // set range
    video.addEventListener('timeupdate', function timeupdate() {
      if (video.t && video.t.y !== undefined && video.t.y > video.t.x && Math.abs(video.currentTime) >= video.t.y ){
        if( video.looping ) video.currentTime = video.t.x // speed means loop
        else video.pause()
      }
    },false)
  })

  video.src = url
  video.speed = 1.0
  video.looping = false
  video.set = (mediafragment,v) => {
    video[mediafragment] = v

    if( mediafragment == 't'){
      video.pause()
      if( v.x !== undefined && v.x == v.y ) return // stop paused
      else{
        video.currentTime = v.x
        video.time = v.x
        video.play()
      }
    }
    if( mediafragment == 's' ){
      video.playbackRate = Math.abs( v.x ) // html5 video does not support reverseplay :/
    }
    if( mediafragment == 'loop' ){
      video.looping = true 
    }
  }
}

// stop playing audio when loading another scene
xrf.addEventListener('reset', () => {
  xrf.scene.traverse( (n)  => n.media && n.media.video && (n.media.video.pause()) && (n.media.video.remove()) )
})

let videoMimeTypes = [
  'video/ogg',
  'video/mp4'
]
videoMimeTypes.map( (mimetype) =>  xrf.frag.src.type[ mimetype ] = loadVideo(mimetype) )
export default xrf;
