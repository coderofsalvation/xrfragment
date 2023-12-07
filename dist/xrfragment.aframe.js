/*
 * v0.5.1 generated at Thu Dec  7 09:39:28 AM CET 2023
 * https://xrfragment.org
 * SPDX-License-Identifier: MPL-2.0
 */
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
	Frag_h["pos"] = xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_VECTOR3 | xrfragment_XRF.T_STRING | xrfragment_XRF.T_STRING_OBJ | xrfragment_XRF.METADATA | xrfragment_XRF.NAVIGATOR;
	Frag_h["rot"] = xrfragment_XRF.QUERY_OPERATOR | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_VECTOR3 | xrfragment_XRF.METADATA | xrfragment_XRF.NAVIGATOR;
	Frag_h["t"] = xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_FLOAT | xrfragment_XRF.T_VECTOR2 | xrfragment_XRF.T_STRING | xrfragment_XRF.NAVIGATOR | xrfragment_XRF.METADATA;
	Frag_h["tv"] = xrfragment_XRF.ASSET | xrfragment_XRF.PV_OVERRIDE | xrfragment_XRF.T_FLOAT | xrfragment_XRF.T_VECTOR2 | xrfragment_XRF.T_VECTOR3 | xrfragment_XRF.NAVIGATOR | xrfragment_XRF.METADATA;
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
		store[keyStripped] = v;
		return true;
	}
	var v = new xrfragment_XRF(key,Frag_h[key],index);
	if(Object.prototype.hasOwnProperty.call(Frag_h,key)) {
		if(!v.validate(value)) {
			console.log("src/xrfragment/Parser.hx:66:","⚠ fragment '" + key + "' has incompatible value (" + value + ")");
			return false;
		}
		store[keyStripped] = v;
		if(xrfragment_Parser.debug) {
			console.log("src/xrfragment/Parser.hx:70:","✔ " + key + ": " + v.string);
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
				var xyzw = str.split(",");
				if(xyzw.length > 0) {
					v.x = parseFloat(xyzw[0]);
				}
				if(xyzw.length > 1) {
					v.y = parseFloat(xyzw[1]);
				}
				if(xyzw.length > 2) {
					v.z = parseFloat(xyzw[2]);
				}
				if(xyzw.length > 3) {
					v.w = parseFloat(xyzw[3]);
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
})({});
var xrfragment = $hx_exports["xrfragment"];
// SPDX-License-Identifier: MPL-2.0        
// Copyright (c) 2023 Leon van Kammen/NLNET 

var xrf = {}

xrf.init = function(opts){
  opts      = opts || {}
  xrf.debug = parseInt( ( document.location.hash.match(/debug=([0-9])/) || [0,'0'] )[1] )
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

xrf.addEventListener = function(eventName, callback, scene) {
  if( !this._listeners ) this._listeners = []
  if (!this._listeners[eventName]) {
      // create a new array for this event name if it doesn't exist yet
      this._listeners[eventName] = [];
  }
  if( scene ) callback.scene = scene
  // add the callback to the listeners array for this event name
  this._listeners[eventName].push(callback);
  return () => {
    this._listeners[eventName] = this._listeners[eventName].filter( (c) => c != callback )
  }
};

xrf.emit = function(eventName, data){
  if( typeof data != 'object' ) throw 'emit() requires passing objects'
  if( xrf.debug && ( eventName != "render" || xrf.debug == eventName ) ){
    let label = String(`xrf.emit('${eventName}')`).padEnd(35," ");
    label +=  data.mesh && data.mesh.name ? '#'+data.mesh.name : ''
    console.groupCollapsed(label)
    console.info(data)
    console.groupEnd(label)
    if( xrf.debug > 1 ) debugger
  }
  // forward to THREEjs eventbus if any
  if( data.scene ) data.scene.dispatchEvent( eventName, data )
  if( data.mesh  ) data.mesh.dispatchEvent( eventName, data )
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
// *TODO* do this nicely
//  xrf._listeners['renderPost'] = []
//  xrf._listeners['render'] = []
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
      node.nodes.push(spatialNode)
    }else{
      node = { word: XRWG.cleankey(key), key, nodes:[spatialNode] }
      if( spatialNode.userData[key] ) node.value = spatialNode.userData[key]
      node[type] = true
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
// the hashbus (QueryString eventBus) is mentioned in the spec 
//
// it allows metadata-keys ('foo' e.g.) of 3D scene-nodes (.userData.foo e.g.) to 
// react by executing code 

let pub = function( url, model, flags ){  // evaluate fragments in url
  if( !url ) return 
  if( !url.match(/#/) ) url = `#${url}`
  model = model || xrf.model
  let { THREE, camera } = xrf
  let frag = xrf.URI.parse( url, flags )
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
      xrf.emit('frag2mesh',opts)
      .then( () => pub.fragment(k,opts) )
    }
  }
}

pub.fragment = (k, opts ) => { // evaluate one fragment
  let frag = opts.frag[k];

  if( frag.is( xrf.XRF.PV_EXECUTE ) ) pub.XRWG({...opts,frag})

  // call native function (xrf/env.js e.g.), or pass it to user decorator
  xrf.emit(k,opts)
  .then( () => {
    let func = xrf.frag[k] || function(){} 
    if( typeof xrf[k] == 'function' ) xrf[k]( func, frag, opts)
    else func( frag, opts)
  })
}

pub.XRWG = (opts) => {
  let {frag,scene,model,renderer} = opts 

  // if this query was triggered by an src-value, lets filter it
  const isSRC = opts.embedded && opts.embedded.fragment == 'src'
  if( !isSRC ){                             // spec : https://xrfragment.org/#src
    for ( let i in frag  ) {
      let v = frag[i]
      let id = v.string || v.fragment
      if( id == '#' || !id ) return
      let match = xrf.XRWG.match(id)

      if( v.is( xrf.XRF.PV_EXECUTE ) ){
        scene.XRF_PV_ORIGIN = v.string
        // evaluate aliases 
        match.map( (w) => {
          if( w.key == `#${id}` ){
            if(  w.value && w.value[0] == '#' ){
              // if value is alias, execute fragment value 
              xrf.hashbus.pub( w.value, xrf.model, xrf.XRF.METADATA | xrf.XRF.PV_OVERRIDE | xrf.XRF.NAVIGATOR )
            }
          }
        })
        xrf.emit('dynamicKey',{ ...opts,v,frag,id,match,scene })
      }else{
        xrf.emit('dynamicKeyValue',{ ...opts,v,frag,id,match,scene })
      }
    }
  }
}


xrf.hashbus = { pub }
xrf.frag   = {}
xrf.model  = {}
xrf.mixers = []

xrf.init = ((init) => function(opts){
  console.log("add #debug to URL to see XR Fragment debuglog")
  let scene = new opts.THREE.Group()
  opts.scene.add(scene)
  opts.scene = scene
  init(opts)
  if( opts.loaders ) Object.values(opts.loaders).map( xrf.patchLoader )

  xrf.patchRenderer(opts)
  xrf.navigator.init()
  // return xrfragment lib as 'xrf' query functor (like jquery)
  for ( let i in xrf ) xrf.query[i] = xrf[i] 
  return xrf.query
})(xrf.init)

xrf.patchRenderer = function(opts){
  let {renderer,camera} = opts
  renderer.xr.addEventListener( 'sessionstart', () => xrf.baseReferenceSpace = renderer.xr.getReferenceSpace() );
  renderer.xr.enabled = true;
  xrf.clock = new xrf.THREE.Clock()
  renderer.render = ((render) => function(scene,camera){
    // update clock
    let time = xrf.clock.getDelta()
    xrf.emit('render',{scene,camera,time,render}) // allow fragments to do something at renderframe
    render(scene,camera)
    xrf.emit('renderPost',{scene,camera,time,render,renderer}) // allow fragments to do something after renderframe
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
  model.scene.traverse( (mesh) => {
    xrf.hashbus.pub.mesh(mesh,model) 
  })
  model.animations.map( (a) => console.log("anim: "+a.name) )
  xrf.emit('parseModel',{model,url,file})
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
  xrf.scene.traverse( (n)     => n.audio && (n.audio.remove()) )
  xrf.scene.traverse( (child) => child.isXRF && (nodes.push(child)) )
  nodes.map( disposeObject ) // leave non-XRF objects intact
  xrf.interactive = xrf.interactiveGroup( xrf.THREE, xrf.renderer, xrf.camera)
  xrf.add( xrf.interactive )
  xrf.layers = 0

  // reset certain events 
  xrf.emit('reset',{})
  // remove mixers
  xrf.mixers.map( (m) => m.stop())
  xrf.mixers = []
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

xrf.hasNoMaterial = (mesh) => {
  const hasTexture        = mesh.material && mesh.material.map 
  const hasMaterialName   = mesh.material && mesh.material.name.length > 0 
  return mesh.geometry && !hasMaterialName && !hasTexture
}
xrf.navigator = {}

xrf.navigator.to = (url,flags,loader,data) => {
  if( !url ) throw 'xrf.navigator.to(..) no url given'

  let hashbus = xrf.hashbus
  xrf.emit('navigate', {url,loader,data})

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

    // force relative path for files which dont include protocol or relative path
    if( dir ) dir = dir[0] == '.' || dir.match("://") ? dir : `.${dir}`
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
      xrf.frag.defaultPredefinedViews({model,scene:model.scene})
      // spec: 2. init metadata
      // spec: predefined view(s) from URL (https://xrfragment.org/#predefined_view)
      let frag = hashbus.pub( url, model) // and eval URI XR fragments 
      hashbus.pub.XRWG({model,scene:model.scene,frag})

      xrf.add( model.scene )
      xrf.navigator.updateHash(hash)
      xrf.emit('navigateLoaded',{url,model})
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
xrf.addEventListener('env', (opts) => {
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  if( frag.env && !scene.environment ){
    //let env = scene.getObjectByName(frag.env.string)
    //if( !env ) env = xrf.scene.getObjectByName(frag.env.string) // repurpose from parent scene
    //if( !env ) return console.warn("xrf.env "+frag.env.string+" not found")
    //env.material.map.mapping = THREE.EquirectangularReflectionMapping;
    //scene.environment = env.material.map
    //scene.texture = env.material.map    
 //   renderer.toneMapping = THREE.ACESFilmicToneMapping;
 //   renderer.toneMappingExposure = 2;
    console.log(`   └ applied image '${frag.env.string}' as environment map`)
  }

})
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

    let lastPos   = `pos=${camera.position.x.toFixed(2)},${camera.position.y.toFixed(2)},${camera.position.z.toFixed(2)}`
    xrf
    .emit('href',{click:true,mesh,xrf:v}) // let all listeners agree
    .then( () => {
      let {urlObj,dir,file,hash,ext} = xrf.parseUrl(v.string)
      //if( !file.match(/\./) || file.match(/\.html/) ){
      //  debugger
      //  let inIframe
      //  try { inIframe = window.self !== window.top; } catch (e) { inIframe = true; }
      //  return inIframe ? window.parent.postMessage({ url: v.string }, '*') : window.open( v.string, '_blank')
      //}
      const flags = v.string[0] == '#' ? xrf.XRF.PV_OVERRIDE : undefined
      let toFrag = xrf.URI.parse( v.string, xrf.XRF.NAVIGATOR | xrf.XRF.PV_OVERRIDE | xrf.XRF.METADATA )
      // always commit current location (keep a trail of last positions before we navigate)
      if( !e.nocommit && !document.location.hash.match(lastPos) ) xrf.navigator.to(`#${lastPos}`)
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


  // spec: indirect coordinate using objectname: https://xrfragment.org/#navigating%203D
  if( v.x == undefined ){
    let obj = scene.getObjectByName(v.string)
    if( !obj ) return 
    let pos = obj.position.clone()
    obj.getWorldPosition(pos)
    camera.position.copy(pos)
  }else{ 
    // spec: direct coordinate: https://xrfragment.org/#navigating%203D
    camera.position.x = v.x
    camera.position.y = v.y
    camera.position.z = v.z
  }
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

  let url      = v.string
  let srcFrag  = opts.srcFrag = xrfragment.URI.parse(url)
  opts.isLocal = v.string[0] == '#'
  opts.isPortal = xrf.frag.src.renderAsPortal(mesh)

  if( opts.isLocal ){
        xrf.frag.src.localSRC(url,srcFrag,opts)     // local
  }else xrf.frag.src.externalSRC(url,srcFrag,opts)  // external file
}

xrf.frag.src.addModel = (model,url,frag,opts) => {
  let {mesh} = opts
  let scene = model.scene
  scene = xrf.frag.src.filterScene(scene,{...opts,frag})         // get filtered scene
  if( mesh.material && !mesh.userData.src ) mesh.material.visible = false  // hide placeholder object
  //enableSourcePortation(scene)
  if( xrf.frag.src.renderAsPortal(mesh) ){
    // only add remote objects, because 
    // local scene-objects are already added to scene
    xrf.portalNonEuclidian({...opts,model,scene:model.scene})
    if( !opts.isLocal ) xrf.scene.add(scene) 
  }else{
    xrf.frag.src.scale( scene, opts, url )           // scale scene
    mesh.add(scene)
    xrf.emit('parseModel', {...opts, scene, model}) 
  }
  // flag everything isSRC & isXRF
  mesh.traverse( (n) => { n.isSRC = n.isXRF = n[ opts.isLocal ? 'isSRCLocal' : 'isSRCExternal' ] = true })
}

xrf.frag.src.renderAsPortal = (mesh) => {
  // *TODO* should support better isFlat(mesh) check
  const isPlane           = mesh.geometry && mesh.geometry.attributes.uv && mesh.geometry.attributes.uv.count == 4 
  return xrf.hasNoMaterial(mesh) && isPlane
}

xrf.frag.src.enableSourcePortation = (src) => {
  // show sourceportation clickable plane
  if( srcFrag.href || v.string[0] == '#' ) return
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
  return xrf.frag.src
}

xrf.frag.src.externalSRC = (url,frag,opts) => {
  fetch(url, { method: 'HEAD' })
  .then( (res) => {
    console.log(`loading src ${url}`)
    let mimetype = res.headers.get('Content-type')
    if( url.replace(/#.*/,'').match(/\.(gltf|glb)$/)    ) mimetype = 'gltf'
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
  setTimeout( () => {
    if( mesh.material ) mesh.material = mesh.material.clone() // clone, so we can individually highlight meshes
    let _model = {
      animations: model.animations,
      scene: scene.clone() // *TODO* opts.isPortal ? scene : scene.clone()
    }
    _model.scenes = [_model.scene]
    xrf.frag.src.addModel(_model,url,frag, opts)    // current file 
  },500 )
}

// scale embedded XR fragments https://xrfragment.org/#scaling%20of%20instanced%20objects
xrf.frag.src.scale = function(scene, opts, url){
    let { mesh, model, camera, renderer, THREE} = opts

    // remove invisible objects (hidden by selectors) which might corrupt boundingbox size-detection 
    let cleanScene = scene.clone()
    if( !cleanScene ) debugger
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
    scene.isXRF = model.scene.isSRC = true
}

xrf.frag.src.filterScene = (scene,opts) => {
  let { mesh, model, camera, renderer, THREE, hashbus, frag} = opts

  scene = xrf.filter.scene({scene,frag,reparent:true}) // *TODO* ,copyScene: opts.isPortal})

  if( !opts.isLocal ){
    scene.traverse( (m) => {
      if( m.userData && (m.userData.src || m.userData.href) ) return ; // prevent infinite recursion 
      hashbus.pub.mesh(m,{scene,recursive:true})                       // cool idea: recursion-depth based distance between face & src
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
xrf.frag.t = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  if( !model.mixer ) return 
  if( !model.animations || model.animations[0] == undefined ) return console.warn('no animation in scene')

  xrf.mixers.map ( (mixer) => {
    
    mixer.t = v
    
    // update speed
    mixer.timeScale     = mixer.loop.speed = v.x
    mixer.loop.speedAbs = Math.abs(v.x)

    if( v.y != undefined || v.z != undefined ) mixer.updateLoop( v )

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
  mixer.loop      = {timeStart:0,timeStop:0}
  mixer.i         = xrf.mixers.length
  mixer.actions   = []

  model.animations.map( (anim) => { 
    anim.optimize()
    console.log("action: "+anim.name)
    mixer.actions.push( mixer.clipAction( anim, model.scene ) )
  })


  mixer.checkZombies = (animations) => {
    if( mixer.zombieCheck ) return // fire only once
    animations.map( (anim) => {  
      // collect zombie animations and warn user
      let zombies = anim.tracks.map( (t) => {
        let name = t.name.replace(/\..*/,'')
        let obj  = model.scene.getObjectByName(name)
        return !model.scene.getObjectByName(name) ? {anim:anim.name,obj:name} : undefined 
      })
      if( zombies.length > 0 && mixer.i == 0 ){ // only warn for zombies in main scene (because src-scenes might be filtered anyways)
        zombies
        .filter( (z) => z ) // filter out undefined
        .map( (z) => console.warn(`gltf: object '${z.obj}' not found (anim: '${z.anim}'`) )
        console.warn(`TIP: remove dots in objectnames in blender (which adds dots when duplicating)`)
      } 
    })
    mixer.zombieCheck = true
  }

  mixer.play  = (t) => {
    mixer.isPlaying = t.x != 0
    mixer.updateLoop(t)
    xrf.emit( mixer.isPlaying === false ? 'stop' : 'play',{isPlaying: mixer.isPlaying})
  }

  mixer.stop = () => {
    mixer.play(false)
  }

  mixer.updateLoop = (t) => {
    mixer.loop.timeStart = t.y != undefined ? t.y : mixer.loop.timeStart
    mixer.loop.timeStop  = t.z != undefined ? t.z : mixer.loop.timeStop
    mixer.actions.map( (action) => { 
      if( mixer.loop.timeStart != undefined ){
        action.time = mixer.loop.timeStart
        action.setLoop( xrf.THREE.LoopOnce, )
        action.timeScale = mixer.timeScale
        action.enabled = true
        if( t.x != 0 ){ 
          action.play() 
        }
      }
    })
    mixer.setTime(mixer.loop.timeStart)
    mixer.time = Math.abs( mixer.loop.timeStart )
    mixer.update(0)
    mixer.checkZombies( model.animations)
  }

  // update loop when needed 
  if( !mixer.update.patched ){
    let update = mixer.update
    mixer.update = function(time){
      mixer.time = Math.abs(mixer.time)
      if( time == 0 ) return update.call(this,time)

      // loop jump
      if( mixer.loop.speed > 0.0 && (mixer.loop.timeStop > 0 && mixer.time > mixer.loop.timeStop) ){ 
        setTimeout( (time,anims) => mixer.updateLoop(time), 0, mixer.loop.timeStart ) // prevent recursion
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
    if( xrf.model.camera && model.mixer.isPlaying ){

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

xrf.addEventListener('dynamicKey', (opts) => {
  // select active camera if any
  let {id,match,v} = opts
  match.map( (w) => {
    w.nodes.map( (node) => {
      if( node.isCamera ){ 
        console.log("setting camera to "+node.name)
        xrf.model.camera = node 
      }
    })
  })
})
xrf.getCollisionMeshes = () => {
  let meshes = []
  xrf.scene.traverse( (n) => {
    if( !n.userData.href && !n.userData.src && xrf.hasNoMaterial(n) ){
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
            object.dispatchEvent(_event)
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

    add(obj, unparent){
      if( unparent ) Group.prototype.add.call( this, obj )
      this.objects.push(obj)
    }

  }

  return new interactive(renderer,camera)
}
/* 
 * TODO: refactor/fix this (queries are being refactored to filters)
 */


xrf.addEventListener('dynamicKey', (opts) => {
  let {scene,id,match,v} = opts
  if( v.filter ){
    let frags = {}
    frags[ v.filter.key ] = v
    xrf.filter.scene({frag:frags,scene})
  }
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
    console.log("reparent "+firstFilter.key+" "+((opts.copyScene)?"copy":"inplace"))
    if(obj ){
      obj.position.set(0,0,0)
      if( opts.copyScene ){
        opts.copyScene = new xrf.THREE.Scene()
        opts.copyScene.children[0] = obj 
        scene = opts.copyScene
      }else{
        // empty current scene and add obj
        while( scene.children.length > 0 ) scene.children[0].removeFromParent()
        scene.add( obj )
      }
    }
  }

  // then show/hide things based on secondary selectors
  // we don't use the XRWG (everything) because we process only the given (sub)scene
  frag.filters.map( (v) => {
    const filter  = v.filter.get()
    const name_or_tag = cleanupKey(v.fragment)
    let processed = {}
    let extembeds = {}

    // hide external objects temporarely
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

xrf.frag.defaultPredefinedViews = (opts) => {
  let {scene,model} = opts;
  scene.traverse( (n) => {
    if( n.userData && n.userData['#'] ){
      let frag = xrf.URI.parse( n.userData['#'] )
      xrf.hashbus.pub( n.userData['#'] )          // evaluate static XR fragments
      xrf.hashbus.pub.XRWG({frag,model,scene})    // evaluate dynamic XR fragment using XRWG (see spec)
    }
  })
}

// react to enduser typing url
xrf.addEventListener('hash', (opts) => {
  let frag = xrf.URI.parse( opts.hash )
  xrf.hashbus.pub.XRWG({frag,scene:xrf.scene})
}) 

// clicking href url with predefined view 
xrf.addEventListener('href', (opts) => {
  if( !opts.click || opts.xrf.string[0] != '#' ) return 
  let frag = xrf.URI.parse( opts.xrf.string, xrf.XRF.NAVIGATOR | xrf.XRF.PV_OVERRIDE | xrf.XRF.METADATA )
  xrf.hashbus.pub.XRWG({frag,scene:xrf.scene,href:opts.xrf})
}) 
xrf.addEventListener('dynamicKeyValue', (opts) => {
  let {scene,match,v} = opts
  let objname         = v.fragment
  let autoscroll      = v.z > 0 || v.w > 0 

  scene.traverse( (mesh) => {
    if( mesh.name == objname ){
      if( !mesh.geometry ) return console.warn(`mesh '${objname}' has no uvcoordinates to offset`)
      let uv = mesh.geometry.getAttribute("uv")
      if( !uv.old ) uv.old = uv.clone()

      for( let i = 0; i < uv.count; i++ ){
        uv.setXY(i, uv.old.getX(i) + v.x, uv.old.getY(i) + v.y )
      }

      if( autoscroll ){
        if( mesh.removeUVListener ) mesh.removeUVListener()
        mesh.removeUVListener = xrf.addEventListener('render', (opts) => {
          let {time} = opts
          for( let i = 0; i < uv.count; i++ ){
            uv.setXY(i, uv.getX(i) + v.z * time, uv.getY(i) + v.w * time)
          }
          uv.needsUpdate = true
        })
      }
      
      uv.needsUpdate = true
    }
  })
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

  /* WebAudio: setup context via THREEjs */
  if( !camera.listener ){
    camera.listener = new THREE.AudioListener();
    // *FIXME* camera vs camerarig conflict
    (camera.getCam ? camera.getCam() : camera).add( camera.listener );
  }

  let isPositionalAudio = !(mesh.position.x == 0 && mesh.position.y == 0 && mesh.position.z == 0)
  const audioLoader = new THREE.AudioLoader();
  let sound = isPositionalAudio ? new THREE.PositionalAudio( camera.listener) 
                                : new THREE.Audio( camera.listener )

  audioLoader.load( url.replace(/#.*/,''), function( buffer ) {

    sound.setBuffer( buffer );
    sound.setLoop(false);
    sound.setVolume(1.0);
    if( isPositionalAudio ){
      sound.setRefDistance( mesh.scale.x);
      sound.setRolloffFactor(20.0)
      //sound.setDirectionalCone( 360, 360, 0.01 );
    }

    sound.playXRF = (t) => {
      mesh.add(sound)
      try{
        if( sound.isPlaying && t.y != undefined ) sound.stop()
        if( sound.isPlaying && t.y == undefined ) sound.pause()

        let hardcodedLoop = frag.t != undefined
        t = hardcodedLoop ? { ...frag.t, x: t.x} : t // override with hardcoded metadata except playstate (x)
        if( t && t.x != 0 ){
          // *TODO* https://stackoverflow.com/questions/12484052/how-can-i-reverse-playback-in-web-audio-api-but-keep-a-forward-version-as-well 
          t.x = Math.abs(t.x)
          sound.setPlaybackRate( t.x ) // WebAudio does not support negative playback
          // setting loop
          if( t.z ) sound.setLoop( true )
          // apply embedded audio/video samplerate/fps or global mixer fps
          let loopStart = hardcodedLoop ? t.y : t.y * buffer.sampleRate;
          let loopEnd   = hardcodedLoop ? t.z : t.z * buffer.sampleRate;
          let timeStart = loopStart > 0 ? loopStart : (t.y == undefined ? xrf.model.mixer.time : t.y)

          if( t.z > 0 ) sound.setLoopEnd(   loopEnd   )
          if( t.y != undefined ){ 
            sound.setLoopStart( loopStart )
            sound.offset = loopStart 
          }
          sound.play()
        }
      }catch(e){ console.warn(e) }
    }
    mesh.audio = sound
  });
}

let audioMimeTypes = [
  'audio/wav',
  'audio/mpeg',
  'audio/mp3',
  'audio/weba',
  'audio/aac',
  'application/ogg'
]
audioMimeTypes.map( (mimetype) =>  xrf.frag.src.type[ mimetype ] = loadAudio(mimetype) )

// listen to t XR fragment changes
xrf.addEventListener('t', (opts) => {
  let t = opts.frag.t
  xrf.scene.traverse( (n) => n.audio && n.audio.playXRF && (n.audio.playXRF(t)) )
})
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
    transparent: url.match(/(png|gif)/) ? true : false,
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
    mesh.needsUpdate = true
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

    xrf.portalNonEuclidian.stencilRef += 1 // each portal has unique stencil id
    console.log(`enabling portal for object '${mesh.name}' (stencilRef:${mesh.portal.stencilRef})`)
  
    return this
  }

  // enable the stencil-material of the stencil objects to prevent stackoverflow (portal in portal rendering)
  const showPortal = (n,show) => {
    if( n.portal ) n.visible = show
    return true
  }

  this.setupListeners = () => {

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
        if( cameraPosition.distanceTo(newPos) > 20.0 ) return // dont render far portals 

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
 // mesh.renderOrder           = 0;//xrf.portalNonEuclidian.stencilRef;
  mesh.material.stencilFunc  = xrf.THREE.AlwaysStencilFunc;
  mesh.material.stencilZPass = xrf.THREE.ReplaceStencilOp;
  mesh.material.stencilZFail = xrf.THREE.ReplaceStencilOp;
    //n.material.depthFunc    = stencilRef > 0 ? xrf.THREE.AlwaysDepth : xrf.THREE.LessEqualDepth
  //mesh.material.depthTest    = false;
  return mesh
}

xrf.addEventListener('parseModel',(opts) => {
  const scene = opts.model.scene
  //for( let i in scene.children ) scene.children[i].renderOrder = 10 // render outer layers last (worldspheres e.g.)
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

  let video = mesh.video = document.createElement('video')
  video.setAttribute("crossOrigin","anonymous")
  video.setAttribute("playsinline",'')
  video.addEventListener('loadedmetadata', function(){
    let texture = new THREE.VideoTexture( video );
    texture.colorSpace = THREE.SRGBColorSpace;
    let mat     = new xrf.THREE.MeshBasicMaterial()
    mat.map = texture
    mesh.material = mat
    // set range
    //video.addEventListener('timeupdate', function timeupdate() {
    //  if (frag.t && video.currentTime < frag.t.y || video.currentTime >= frag.t.z ) {
    //      video.currentTime = frag.t.y
    //  }
    //},false)
  })

  video.src = url
  video.playXRF = (t) => {
    video.t = t
    if( t.x == 0 ) video.pause()
    else{
      video.playbackRate = Math.abs( t.x ) // html5 video does not support reverseplay :/
      video.play()
    }
    if( t.y != undefined ) video.time = t.y 
  }
}

let videoMimeTypes = [
  'video/ogg',
  'video/mp4'
]
videoMimeTypes.map( (mimetype) =>  xrf.frag.src.type[ mimetype ] = loadVideo(mimetype) )

// listen to t XR fragment changes
xrf.addEventListener('t', (opts) => {
  let t = opts.frag.t
  xrf.scene.traverse( (n) => n.video && (n.video.playXRF(t)) )
})

// contentLoaders = {".gltf" : () => .....} and so on

function loadFile(contentLoaders, multiple){
  return () => {
    window.notify("if you're on Meta browser, file-uploads might be disabled")
    let input = document.createElement('input');
    input.type = 'file';
    input.multiple = multiple;
    input.accept = Object.keys(contentLoaders).join(",");
    input.onchange = () => {
        let files = Array.from(input.files);
        let file = files.slice ? files[0] : files 
        for( var i in contentLoaders ){
          let r = new RegExp('\\'+i+'$')
          if( file.name.match(r) ) return contentLoaders[i](file)
        }
        alert(file.name+" is not supported")
    };
    input.click();
  }
}

function setupConsole(el){
  if( !el ) return setTimeout( () => setupConsole( $('.lil-gui') ),200 )
  let $console = document.createElement('textarea')
  $console.style.position = 'absolute'
  $console.style.display = 'block'
  $console.style.zIndex   = 2000;
  $console.style.background = "transparent !important"
  $console.style.pointerEvents = 'none'
  $console.style.top = '70px'
  $console.style.padding = '10px'
  $console.style.margin = '10px'
  $console.style.background = '#000'
  $console.style.left = $console.style.right = $console.style.bottom = 0;
  $console.style.color = '#A6F';
  $console.style.fontSize = '10px';
  $console.style.fontFamily = 'Courier'
  $console.style.border = '0'
  $console.innerHTML = "XRFRAGMENT CONSOLE OUTPUT:\n" 

  el.appendChild($console)

  console.log = ( (log) => function(){
    let str = ([...arguments]).join(" ")
    let s = str;
    log(s)
    let lines = String($console.innerHTML + "\n"+s).split("\n")
    while( lines.length > 200 ) lines.shift()
    $console.innerHTML = lines.join("\n")
    $console.scrollTop = $console.scrollHeight;
  })(console.log.bind(console))
}

function setupUrlBar(el,XRF){
  let inIframe = window.location !== window.parent.location
  let ids = ['#overlay','a#embed','a#source','a#model','#qrcode']
  let showButtons = () => {
    ids.map( (i) => $(i).style.display = 'block' ) 
    $('a#more').style.display = 'none' 
    if( inIframe ) $('#uri').style.display = 'block'
  }
  $('a#more').addEventListener('click', () => showButtons() )

  XRF.addEventListener('hash', () => reflectUrl() )
  const reflectUrl = window.reflectUrl = (url) => {
    el.value = url || document.location.search.substr(1) + document.location.hash
    let QR = window.QR
    QR.canvas = document.getElementById('qrcode')
    QR.draw( document.location.href, QR.canvas )
  }
  reflectUrl()
}

function SnackBar(userOptions) {
    var snackbar = this || (window.snackbar = {});
    var _Interval;
    var _Message;
    var _Element;
    var _Container;
    
    var _OptionDefaults = {
        message: "Operation performed successfully.",
        dismissible: true,
        timeout: 7000,
        status: ""
    }
    var _Options = _OptionDefaults;

    function _Create() {
        let _Containers = [ ...document.querySelectorAll(".js-snackbar-container") ]
        _Containers.map( (c) => c.remove() )
        _Container = null

        if (!_Container) {
            // need to create a new container for notifications
            _Container = document.createElement("div");
            _Container.classList.add("js-snackbar-container");

            document.body.appendChild(_Container);
        }
        _Container.innerHTML = ''
        _Element = document.createElement("div");
        _Element.classList.add("js-snackbar__wrapper");

        let innerSnack = document.createElement("div");
        innerSnack.classList.add("js-snackbar", "js-snackbar--show");
    
        if (_Options.status) {
            _Options.status = _Options.status.toLowerCase().trim();

            let status = document.createElement("span");
            status.classList.add("js-snackbar__status");


            if (_Options.status === "success" || _Options.status === "green") {
                status.classList.add("js-snackbar--success");
            }
            else if (_Options.status === "warning" || _Options.status === "alert" || _Options.status === "orange") {
                status.classList.add("js-snackbar--warning");
            }
            else if (_Options.status === "danger" || _Options.status === "error" || _Options.status === "red") {
                status.classList.add("js-snackbar--danger");
            }
            else {
                status.classList.add("js-snackbar--info");
            }

            innerSnack.appendChild(status);
        }
        
        _Message = document.createElement("span");
        _Message.classList.add("js-snackbar__message");
        _Message.innerHTML = _Options.message;

        innerSnack.appendChild(_Message);

        if (_Options.dismissible) {
            let closeBtn = document.createElement("span");
            closeBtn.classList.add("js-snackbar__close");
            closeBtn.innerText = "\u00D7";

            closeBtn.onclick = snackbar.Close;

            innerSnack.appendChild(closeBtn);
        }

        _Element.style.height = "0px";
        _Element.style.opacity = "0";
        _Element.style.marginTop = "0px";
        _Element.style.marginBottom = "0px";

        _Element.appendChild(innerSnack);
        _Container.appendChild(_Element);

        if (_Options.timeout !== false) {
            _Interval = setTimeout(snackbar.Close, _Options.timeout);
        }
    }

    var _ConfigureDefaults = function() {
        // if no options given, revert to default
        if (userOptions === undefined) {
            return;
        }

        if (userOptions.message !== undefined) {
            _Options.message = userOptions.message;
        }

        if (userOptions.dismissible !== undefined) {
            if (typeof (userOptions.dismissible) === "string") {
                _Options.dismissible = (userOptions.dismissible === "true");
            }
            else if (typeof (userOptions.dismissible) === "boolean") {
                _Options.dismissible = userOptions.dismissible;
            }
            else {
                console.debug("Invalid option provided for 'dismissable' [" + userOptions.dismissible + "] is of type " + (typeof userOptions.dismissible));
            }
        }


        if (userOptions.timeout !== undefined) {
            if (typeof (userOptions.timeout) === "boolean" && userOptions.timeout === false) {
                _Options.timeout = false;
            }
            else if (typeof (userOptions.timeout) === "string") {
                _Options.timeout = parseInt(userOptions.timeout);
            }


            if (typeof (userOptions.timeout) === "number") {
                if (userOptions.timeout === Infinity) {
                    _Options.timeout = false;
                }
                else if (userOptions.timeout >= 0) {
                    _Options.timeout = userOptions.timeout;
                }
                else {
                    console.debug("Invalid timeout entered. Must be greater than or equal to 0.");
                }

                _Options.timeout = userOptions.timeout;
            }

            
        }

        if (userOptions.status !== undefined) {
            _Options.status = userOptions.status;
        }
    }

    snackbar.Open = function() {
        let contentHeight = _Element.firstElementChild.scrollHeight; // get the height of the content

        _Element.style.height = contentHeight + "px";
        _Element.style.opacity = 1;
        _Element.style.marginTop = "5px";
        _Element.style.marginBottom = "5px";

        _Element.addEventListener("transitioned", function() {
            _Element.removeEventListener("transitioned", arguments.callee);
            _Element.style.height = null;
        })
    }

    snackbar.Close = function () {
        if (_Interval)
            clearInterval(_Interval);

        let snackbarHeight = _Element.scrollHeight; // get the auto height as a px value
        let snackbarTransitions = _Element.style.transition;
        _Element.style.transition = "";

        requestAnimationFrame(function() {
            _Element.style.height = snackbarHeight + "px"; // set the auto height to the px height
            _Element.style.opacity = 1;
            _Element.style.marginTop = "0px";
            _Element.style.marginBottom = "0px";
            _Element.style.transition = snackbarTransitions

            requestAnimationFrame(function() {
                _Element.style.height = "0px";
                _Element.style.opacity = 0;
            })
        });

        setTimeout(function() {
            try { _Container.removeChild(_Element); } catch (e) { }
        }, 1000);
    };

    _ConfigureDefaults();
    _Create();
    snackbar.Open();
}

function notify(scope){
  return function notify(str,opts){
    str  = String(str)
    opts = opts || {}        
    if( !opts.status ){      
      opts.status = "info"   
      if( str.match(/error/g)   ) opts.status = "danger"
      if( str.match(/warning/g) ) opts.status = "warning"
    }
    opts = Object.assign({ message: str , status, timeout:4000 },opts)
    SnackBar( opts )
  }
}

function download(){
  function fetchAndDownload(dataurl, filename) {
    var a = document.createElement("a");
    a.href = dataurl;
    a.setAttribute("download", filename);
    a.click();
    return false;
  }
  let file = document.location.search.replace(/\?/,'')
  fetchAndDownload( file, file )
}

function embed(){
  // *TODO* this should be part of the XRF Threejs framework
  if( typeof THREE == 'undefined' ) THREE = xrf.THREE 
  let radToDeg  = THREE.MathUtils.radToDeg
  let toDeg     = (x) => x / (Math.PI / 180)
  let camera    = document.querySelector('[camera]').object3D.parent // *TODO* fix for threejs

  // *TODO* add camera direction
  let direction = new xrf.THREE.Vector3()
  camera.getWorldDirection(direction)
  const pitch   = Math.asin(direction.y);
  const yaw     = Math.atan2(direction.x, direction.z);
  const pitchInDegrees = pitch * 180 / Math.PI;
  const yawInDegrees = yaw * 180 / Math.PI;

  let lastPos = `pos=${camera.position.x.toFixed(2)},${camera.position.y.toFixed(2)},${camera.position.z.toFixed(2)}`
  let newHash = document.location.hash.replace(/[&]?(pos|rot)=[0-9\.-]+,[0-9\.-]+,[0-9\.-]+/,'')
  newHash += `&${lastPos}`
  document.location.hash = newHash.replace(/&&/,'&')
                                  .replace(/#&/,'')
  // copy url to clipboard 
  var dummy = document.createElement('input'),
      text = window.location.href;
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy); 
  // End of *TODO* 
  window.notify(`<b>Link copied to clipboard!</b> ❤️<br>ps. to embed this experience in your website,<br>copy/paste the following into your HTML:<br><input type="text" value="&lt;iframe src='${document.location.href}'&gt;<br>&lt;/iframe&gt;" id="share"/>`,{timeout:10000})
}
window.AFRAME.registerComponent('xrf', {
  schema: {
  },
  init: function () {
    if( !AFRAME.XRF ){

      let camera = document.querySelector('[camera]')
      // start with black
      camera.setAttribute('xrf-fade','')
      AFRAME.fade = camera.components['xrf-fade']

      if( document.location.host.match(/localhost/) ) document.querySelector('a-scene').setAttribute("stats",'')

      document.querySelector('a-scene').addEventListener('loaded', () => {

        // enable XR fragments
        let aScene = document.querySelector('a-scene')
        let XRF = AFRAME.XRF = xrf.init({
          THREE,
          camera:    aScene.camera,
          scene:     aScene.object3D,
          renderer:  aScene.renderer,
          loaders: { 
            gltf: THREE.GLTFLoader, // which 3D assets (exts) to check for XR fragments?
            glb: THREE.GLTFLoader
          }
        })
        if( !XRF.camera ) throw 'xrfragment: no camera detected, please declare <a-entity camera..> ABOVE entities with xrf-attributes'

        xrf.addEventListener('navigateLoaded', () => {
          setTimeout( () => AFRAME.fade.out(),500) 

          // *TODO* this does not really belong here perhaps
          let blinkControls = document.querySelector('[blink-controls]')
          if( blinkControls ){
            let els       = xrf.getCollisionMeshes()
            let invisible = false
            els.map( (mesh) => {
              if( !invisible ){
                invisible = mesh.material.clone()
                invisible.visible = false
              }
              mesh.material = invisible 
              let el = document.createElement("a-entity")
              el.setAttribute("xrf-get", mesh.name )
              el.setAttribute("class","floor")
              $('a-scene').appendChild(el)
            })
            blinkControls.components['blink-controls'].update({collisionEntities:true})
          }
        })

        xrf.addEventListener('href', (opts) => {
          if( opts.click){ 
            let p       = opts.promise()
            let url     = opts.xrf.string
            let isLocal = url.match(/^#/)
            let hasPos  = url.match(/pos=/)
            if( isLocal && hasPos ){
              // local teleports only
              let fastFadeMs = 200
              AFRAME.fade.in(fastFadeMs)
              setTimeout( () => {
                p.resolve()
                AFRAME.fade.out(fastFadeMs)
              }, fastFadeMs)
            }else if( !isLocal ){
              AFRAME.fade.in()
              setTimeout( () => {
                p.resolve()
                setTimeout( () => AFRAME.fade.out(), 1000 ) // allow one second to load textures e.g.
              }, AFRAME.fade.data.fadetime )
            }else p.resolve()
          }
        })

        // patch wasd-controls to affect camera-rig
        if( camera.components['wasd-controls'] ){
          camera.components['wasd-controls'].tick = function(time,delta){
            var data = this.data;
            var el = this.el;
            var velocity = this.velocity;
            function isEmptyObject(keys) {
              var key;
              for (key in keys) { return false; }
              return true;
            }

            if (!velocity[data.adAxis] && !velocity[data.wsAxis] &&
                isEmptyObject(this.keys)) { return; }

            // Update velocity.
            delta = delta / 1000;
            this.updateVelocity(delta);

            if (!velocity[data.adAxis] && !velocity[data.wsAxis]) { return; }


            // Transform direction relative to heading.
            let directionVector = this.getMovementVector(delta)
            var rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');
            rotationEuler.set(THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(xrf.camera.rotation.y + 45), 0);
            directionVector.applyEuler(rotationEuler);
            // Get movement vector and translate position to camera-rig (not camera)
            xrf.camera.position.add(directionVector);
          }.bind( camera.components['wasd-controls'] )        
        }

        // convert href's to a-entity's so AFRAME
        // raycaster can find & execute it
        AFRAME.XRF.clickableMeshToEntity = (opts) => {
          let {mesh,clickHandler} = opts;
          let el = document.createElement("a-entity")
          el.setAttribute("xrf-get",mesh.name )  // turn into AFRAME entity
          el.setAttribute("class","ray")         // expose to raycaster 
          el.setAttribute("pressable", '')       // detect hand-controller click
          // respond to cursor via laser-controls (https://aframe.io/docs/1.4.0/components/laser-controls.html)
          el.addEventListener("click",          clickHandler )
          el.addEventListener("mouseenter", mesh.userData.XRF.href.selected(true) )
          el.addEventListener("mouseleave", mesh.userData.XRF.href.selected(false) )
          el.addEventListener("pressedstarted", clickHandler )
          $('a-scene').appendChild(el)
        }
        xrf.addEventListener('interactionReady', AFRAME.XRF.clickableMeshToEntity )

        // cleanup xrf-get objects when resetting scene
        xrf.addEventListener('reset', (opts) => {
          let els = [...document.querySelectorAll('[xrf-get]')]
          els.map( (el) => document.querySelector('a-scene').removeChild(el) )
        })

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
AFRAME.registerComponent('xrf-fade', {
  schema:{
    fadetime:{type:"number", default: 1000}, 
    color:{type:"color", default:"black"}, 
    opacity:{type:"float",default:1.0}
  },
  init: function(){
    let fb = this.fb = document.createElement("a-box")
    fb.setAttribute("scale", "1 1 1")
    fb.setAttribute("material", `color: ${this.data.color}; transparent: true; side: back; shader: flat; opacity:1`)
    this.el.appendChild(fb)
  }, 
  out: function(fadetime){
    if( fadetime != undefined ) this.data.fadetime = fadetime 
    if( this.data.opacity == 0 ) return 
    this.data.opacity = 0.0
    this.fb.setAttribute("animation", `property: components.material.material.opacity; dur: ${this.data.fadetime}; from: 1; to: ${this.data.opacity}`)
    setTimeout( () => this.fb.object3D.visible = false, this.data.fadetime )
  }, 
  "in": function(fadetime){
    if( fadetime != undefined ) this.data.fadetime = fadetime 
    if( this.data.opacity == 1 ) return 
    this.data.opacity = 1.0
    this.fb.object3D.visible = true 
    this.fb.setAttribute("animation", `property: components.material.material.opacity; dur: ${this.data.fadetime}; from: 0; to: ${this.data.opacity}`)
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
      if( document.querySelector('[cursor]') ) {
        document.querySelector('[cursor]').setAttribute("visible",false)
      }
    }
  }, 
  init:function(data){
    this.log = ""
    let enabled    = () AFRAME.utils.device.isMobile()
    let setVisible = (state) => {
      if( enabled() ) this.setGazer(state)
    }

    setVisible(false);

    document.querySelector("a-scene").addEventListener('exit-vr', () => setVisible(false) )
    document.querySelector("a-scene").addEventListener('enter-vr', () => setVisible(true) )
    document.querySelector("a-scene").addEventListener('exit-ar', () => setVisible(false) )
    document.querySelector("a-scene").addEventListener('enter-ar', () => setVisible(true) )

    let highlightMesh = (state) => (e) => {
      if( !e.target.object3D ) return 
      let obj = e.target.object3D.children[0]
      if( obj && obj.userData && obj.userData.XRF && obj.userData.XRF.href )
        obj.userData.XRF.href.selected( state )()
    }
    this.el.addEventListener("mouseenter", highlightMesh(true) )
    this.el.addEventListener("mouseleave", highlightMesh(false ) )
  }
});
window.AFRAME.registerComponent('xrf-get', {
  schema: {
    name: {type: 'string'},
    clone: {type: 'boolean', default:false},
    reparent: {type: 'boolean', default:false}
  },

  init: function () {

    var el = this.el;
    var meshname = this.data.name || this.data;

    this.el.addEventListener('update', (evt) => {

      setTimeout( () => {

        if( !this.mesh ){
          let scene = AFRAME.XRF.scene 
          let mesh = this.mesh = scene.getObjectByName(meshname);
          if( !this.el.className.match(/ray/) ) this.el.className += " ray"
          if (!mesh){
            console.error("mesh with name '"+meshname+"' not found in model")
            return;
          }
          // we don't want to re-parent gltf-meshes
          mesh.isXRF = true    // mark for deletion by xrf
          if( this.data.reparent ){ 
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
          }else{
            // add() will reparent the mesh so lets create a dummy
            this.el.object3D.add = (a) => a 
          }
          this.el.setObject3D('mesh',mesh)
          if( !this.el.id ) this.el.setAttribute("id",`xrf-${mesh.name}`)
        }else console.warn("xrf-get ignore: "+JSON.stringify(this.data))
      }, evt && evt.timeout ? evt.timeout: 500)

    })

    this.el.emit("update",{timeout:0})

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
// https://github.com/yyx990803/QR.js
//
window.QR = (function () {

    // alignment pattern
    adelta = [
      0, 11, 15, 19, 23, 27, 31, // force 1 pat
      16, 18, 20, 22, 24, 26, 28, 20, 22, 24, 24, 26, 28, 28, 22, 24, 24,
      26, 26, 28, 28, 24, 24, 26, 26, 26, 28, 28, 24, 26, 26, 26, 28, 28
      ];

    // version block
    vpat = [
        0xc94, 0x5bc, 0xa99, 0x4d3, 0xbf6, 0x762, 0x847, 0x60d,
        0x928, 0xb78, 0x45d, 0xa17, 0x532, 0x9a6, 0x683, 0x8c9,
        0x7ec, 0xec4, 0x1e1, 0xfab, 0x08e, 0xc1a, 0x33f, 0xd75,
        0x250, 0x9d5, 0x6f0, 0x8ba, 0x79f, 0xb0b, 0x42e, 0xa64,
        0x541, 0xc69
    ];

    // final format bits with mask: level << 3 | mask
    fmtword = [
        0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976,    //L
        0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0,    //M
        0x355f, 0x3068, 0x3f31, 0x3a06, 0x24b4, 0x2183, 0x2eda, 0x2bed,    //Q
        0x1689, 0x13be, 0x1ce7, 0x19d0, 0x0762, 0x0255, 0x0d0c, 0x083b    //H
    ];

    // 4 per version: number of blocks 1,2; data width; ecc width
    eccblocks = [
        1, 0, 19, 7, 1, 0, 16, 10, 1, 0, 13, 13, 1, 0, 9, 17,
        1, 0, 34, 10, 1, 0, 28, 16, 1, 0, 22, 22, 1, 0, 16, 28,
        1, 0, 55, 15, 1, 0, 44, 26, 2, 0, 17, 18, 2, 0, 13, 22,
        1, 0, 80, 20, 2, 0, 32, 18, 2, 0, 24, 26, 4, 0, 9, 16,
        1, 0, 108, 26, 2, 0, 43, 24, 2, 2, 15, 18, 2, 2, 11, 22,
        2, 0, 68, 18, 4, 0, 27, 16, 4, 0, 19, 24, 4, 0, 15, 28,
        2, 0, 78, 20, 4, 0, 31, 18, 2, 4, 14, 18, 4, 1, 13, 26,
        2, 0, 97, 24, 2, 2, 38, 22, 4, 2, 18, 22, 4, 2, 14, 26,
        2, 0, 116, 30, 3, 2, 36, 22, 4, 4, 16, 20, 4, 4, 12, 24,
        2, 2, 68, 18, 4, 1, 43, 26, 6, 2, 19, 24, 6, 2, 15, 28,
        4, 0, 81, 20, 1, 4, 50, 30, 4, 4, 22, 28, 3, 8, 12, 24,
        2, 2, 92, 24, 6, 2, 36, 22, 4, 6, 20, 26, 7, 4, 14, 28,
        4, 0, 107, 26, 8, 1, 37, 22, 8, 4, 20, 24, 12, 4, 11, 22,
        3, 1, 115, 30, 4, 5, 40, 24, 11, 5, 16, 20, 11, 5, 12, 24,
        5, 1, 87, 22, 5, 5, 41, 24, 5, 7, 24, 30, 11, 7, 12, 24,
        5, 1, 98, 24, 7, 3, 45, 28, 15, 2, 19, 24, 3, 13, 15, 30,
        1, 5, 107, 28, 10, 1, 46, 28, 1, 15, 22, 28, 2, 17, 14, 28,
        5, 1, 120, 30, 9, 4, 43, 26, 17, 1, 22, 28, 2, 19, 14, 28,
        3, 4, 113, 28, 3, 11, 44, 26, 17, 4, 21, 26, 9, 16, 13, 26,
        3, 5, 107, 28, 3, 13, 41, 26, 15, 5, 24, 30, 15, 10, 15, 28,
        4, 4, 116, 28, 17, 0, 42, 26, 17, 6, 22, 28, 19, 6, 16, 30,
        2, 7, 111, 28, 17, 0, 46, 28, 7, 16, 24, 30, 34, 0, 13, 24,
        4, 5, 121, 30, 4, 14, 47, 28, 11, 14, 24, 30, 16, 14, 15, 30,
        6, 4, 117, 30, 6, 14, 45, 28, 11, 16, 24, 30, 30, 2, 16, 30,
        8, 4, 106, 26, 8, 13, 47, 28, 7, 22, 24, 30, 22, 13, 15, 30,
        10, 2, 114, 28, 19, 4, 46, 28, 28, 6, 22, 28, 33, 4, 16, 30,
        8, 4, 122, 30, 22, 3, 45, 28, 8, 26, 23, 30, 12, 28, 15, 30,
        3, 10, 117, 30, 3, 23, 45, 28, 4, 31, 24, 30, 11, 31, 15, 30,
        7, 7, 116, 30, 21, 7, 45, 28, 1, 37, 23, 30, 19, 26, 15, 30,
        5, 10, 115, 30, 19, 10, 47, 28, 15, 25, 24, 30, 23, 25, 15, 30,
        13, 3, 115, 30, 2, 29, 46, 28, 42, 1, 24, 30, 23, 28, 15, 30,
        17, 0, 115, 30, 10, 23, 46, 28, 10, 35, 24, 30, 19, 35, 15, 30,
        17, 1, 115, 30, 14, 21, 46, 28, 29, 19, 24, 30, 11, 46, 15, 30,
        13, 6, 115, 30, 14, 23, 46, 28, 44, 7, 24, 30, 59, 1, 16, 30,
        12, 7, 121, 30, 12, 26, 47, 28, 39, 14, 24, 30, 22, 41, 15, 30,
        6, 14, 121, 30, 6, 34, 47, 28, 46, 10, 24, 30, 2, 64, 15, 30,
        17, 4, 122, 30, 29, 14, 46, 28, 49, 10, 24, 30, 24, 46, 15, 30,
        4, 18, 122, 30, 13, 32, 46, 28, 48, 14, 24, 30, 42, 32, 15, 30,
        20, 4, 117, 30, 40, 7, 47, 28, 43, 22, 24, 30, 10, 67, 15, 30,
        19, 6, 118, 30, 18, 31, 47, 28, 34, 34, 24, 30, 20, 61, 15, 30
    ];

    // Galois field log table
    glog = [
        0xff, 0x00, 0x01, 0x19, 0x02, 0x32, 0x1a, 0xc6, 0x03, 0xdf, 0x33, 0xee, 0x1b, 0x68, 0xc7, 0x4b,
        0x04, 0x64, 0xe0, 0x0e, 0x34, 0x8d, 0xef, 0x81, 0x1c, 0xc1, 0x69, 0xf8, 0xc8, 0x08, 0x4c, 0x71,
        0x05, 0x8a, 0x65, 0x2f, 0xe1, 0x24, 0x0f, 0x21, 0x35, 0x93, 0x8e, 0xda, 0xf0, 0x12, 0x82, 0x45,
        0x1d, 0xb5, 0xc2, 0x7d, 0x6a, 0x27, 0xf9, 0xb9, 0xc9, 0x9a, 0x09, 0x78, 0x4d, 0xe4, 0x72, 0xa6,
        0x06, 0xbf, 0x8b, 0x62, 0x66, 0xdd, 0x30, 0xfd, 0xe2, 0x98, 0x25, 0xb3, 0x10, 0x91, 0x22, 0x88,
        0x36, 0xd0, 0x94, 0xce, 0x8f, 0x96, 0xdb, 0xbd, 0xf1, 0xd2, 0x13, 0x5c, 0x83, 0x38, 0x46, 0x40,
        0x1e, 0x42, 0xb6, 0xa3, 0xc3, 0x48, 0x7e, 0x6e, 0x6b, 0x3a, 0x28, 0x54, 0xfa, 0x85, 0xba, 0x3d,
        0xca, 0x5e, 0x9b, 0x9f, 0x0a, 0x15, 0x79, 0x2b, 0x4e, 0xd4, 0xe5, 0xac, 0x73, 0xf3, 0xa7, 0x57,
        0x07, 0x70, 0xc0, 0xf7, 0x8c, 0x80, 0x63, 0x0d, 0x67, 0x4a, 0xde, 0xed, 0x31, 0xc5, 0xfe, 0x18,
        0xe3, 0xa5, 0x99, 0x77, 0x26, 0xb8, 0xb4, 0x7c, 0x11, 0x44, 0x92, 0xd9, 0x23, 0x20, 0x89, 0x2e,
        0x37, 0x3f, 0xd1, 0x5b, 0x95, 0xbc, 0xcf, 0xcd, 0x90, 0x87, 0x97, 0xb2, 0xdc, 0xfc, 0xbe, 0x61,
        0xf2, 0x56, 0xd3, 0xab, 0x14, 0x2a, 0x5d, 0x9e, 0x84, 0x3c, 0x39, 0x53, 0x47, 0x6d, 0x41, 0xa2,
        0x1f, 0x2d, 0x43, 0xd8, 0xb7, 0x7b, 0xa4, 0x76, 0xc4, 0x17, 0x49, 0xec, 0x7f, 0x0c, 0x6f, 0xf6,
        0x6c, 0xa1, 0x3b, 0x52, 0x29, 0x9d, 0x55, 0xaa, 0xfb, 0x60, 0x86, 0xb1, 0xbb, 0xcc, 0x3e, 0x5a,
        0xcb, 0x59, 0x5f, 0xb0, 0x9c, 0xa9, 0xa0, 0x51, 0x0b, 0xf5, 0x16, 0xeb, 0x7a, 0x75, 0x2c, 0xd7,
        0x4f, 0xae, 0xd5, 0xe9, 0xe6, 0xe7, 0xad, 0xe8, 0x74, 0xd6, 0xf4, 0xea, 0xa8, 0x50, 0x58, 0xaf
    ];

    // Galios field exponent table
    gexp = [
        0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1d, 0x3a, 0x74, 0xe8, 0xcd, 0x87, 0x13, 0x26,
        0x4c, 0x98, 0x2d, 0x5a, 0xb4, 0x75, 0xea, 0xc9, 0x8f, 0x03, 0x06, 0x0c, 0x18, 0x30, 0x60, 0xc0,
        0x9d, 0x27, 0x4e, 0x9c, 0x25, 0x4a, 0x94, 0x35, 0x6a, 0xd4, 0xb5, 0x77, 0xee, 0xc1, 0x9f, 0x23,
        0x46, 0x8c, 0x05, 0x0a, 0x14, 0x28, 0x50, 0xa0, 0x5d, 0xba, 0x69, 0xd2, 0xb9, 0x6f, 0xde, 0xa1,
        0x5f, 0xbe, 0x61, 0xc2, 0x99, 0x2f, 0x5e, 0xbc, 0x65, 0xca, 0x89, 0x0f, 0x1e, 0x3c, 0x78, 0xf0,
        0xfd, 0xe7, 0xd3, 0xbb, 0x6b, 0xd6, 0xb1, 0x7f, 0xfe, 0xe1, 0xdf, 0xa3, 0x5b, 0xb6, 0x71, 0xe2,
        0xd9, 0xaf, 0x43, 0x86, 0x11, 0x22, 0x44, 0x88, 0x0d, 0x1a, 0x34, 0x68, 0xd0, 0xbd, 0x67, 0xce,
        0x81, 0x1f, 0x3e, 0x7c, 0xf8, 0xed, 0xc7, 0x93, 0x3b, 0x76, 0xec, 0xc5, 0x97, 0x33, 0x66, 0xcc,
        0x85, 0x17, 0x2e, 0x5c, 0xb8, 0x6d, 0xda, 0xa9, 0x4f, 0x9e, 0x21, 0x42, 0x84, 0x15, 0x2a, 0x54,
        0xa8, 0x4d, 0x9a, 0x29, 0x52, 0xa4, 0x55, 0xaa, 0x49, 0x92, 0x39, 0x72, 0xe4, 0xd5, 0xb7, 0x73,
        0xe6, 0xd1, 0xbf, 0x63, 0xc6, 0x91, 0x3f, 0x7e, 0xfc, 0xe5, 0xd7, 0xb3, 0x7b, 0xf6, 0xf1, 0xff,
        0xe3, 0xdb, 0xab, 0x4b, 0x96, 0x31, 0x62, 0xc4, 0x95, 0x37, 0x6e, 0xdc, 0xa5, 0x57, 0xae, 0x41,
        0x82, 0x19, 0x32, 0x64, 0xc8, 0x8d, 0x07, 0x0e, 0x1c, 0x38, 0x70, 0xe0, 0xdd, 0xa7, 0x53, 0xa6,
        0x51, 0xa2, 0x59, 0xb2, 0x79, 0xf2, 0xf9, 0xef, 0xc3, 0x9b, 0x2b, 0x56, 0xac, 0x45, 0x8a, 0x09,
        0x12, 0x24, 0x48, 0x90, 0x3d, 0x7a, 0xf4, 0xf5, 0xf7, 0xf3, 0xfb, 0xeb, 0xcb, 0x8b, 0x0b, 0x16,
        0x2c, 0x58, 0xb0, 0x7d, 0xfa, 0xe9, 0xcf, 0x83, 0x1b, 0x36, 0x6c, 0xd8, 0xad, 0x47, 0x8e, 0x00
    ];

    // Working buffers:
    // data input and ecc append, image working buffer, fixed part of image, run lengths for badness
    var strinbuf=[], eccbuf=[], qrframe=[], framask=[], rlens=[]; 
    // Control values - width is based on version, last 4 are from table.
    var version, width, neccblk1, neccblk2, datablkw, eccblkwid;
    var ecclevel = 2;
    // set bit to indicate cell in qrframe is immutable.  symmetric around diagonal
    function setmask(x, y)
    {
        var bt;
        if (x > y) {
            bt = x;
            x = y;
            y = bt;
        }
        // y*y = 1+3+5...
        bt = y;
        bt *= y;
        bt += y;
        bt >>= 1;
        bt += x;
        framask[bt] = 1;
    }

    // enter alignment pattern - black to qrframe, white to mask (later black frame merged to mask)
    function putalign(x, y)
    {
        var j;

        qrframe[x + width * y] = 1;
        for (j = -2; j < 2; j++) {
            qrframe[(x + j) + width * (y - 2)] = 1;
            qrframe[(x - 2) + width * (y + j + 1)] = 1;
            qrframe[(x + 2) + width * (y + j)] = 1;
            qrframe[(x + j + 1) + width * (y + 2)] = 1;
        }
        for (j = 0; j < 2; j++) {
            setmask(x - 1, y + j);
            setmask(x + 1, y - j);
            setmask(x - j, y - 1);
            setmask(x + j, y + 1);
        }
    }

    //========================================================================
    // Reed Solomon error correction
    // exponentiation mod N
    function modnn(x)
    {
        while (x >= 255) {
            x -= 255;
            x = (x >> 8) + (x & 255);
        }
        return x;
    }

    var genpoly = [];

    // Calculate and append ECC data to data block.  Block is in strinbuf, indexes to buffers given.
    function appendrs(data, dlen, ecbuf, eclen)
    {
        var i, j, fb;

        for (i = 0; i < eclen; i++)
            strinbuf[ecbuf + i] = 0;
        for (i = 0; i < dlen; i++) {
            fb = glog[strinbuf[data + i] ^ strinbuf[ecbuf]];
            if (fb != 255)     /* fb term is non-zero */
                for (j = 1; j < eclen; j++)
                    strinbuf[ecbuf + j - 1] = strinbuf[ecbuf + j] ^ gexp[modnn(fb + genpoly[eclen - j])];
            else
                for( j = ecbuf ; j < ecbuf + eclen; j++ )
                    strinbuf[j] = strinbuf[j + 1];
            strinbuf[ ecbuf + eclen - 1] = fb == 255 ? 0 : gexp[modnn(fb + genpoly[0])];
        }
    }

    //========================================================================
    // Frame data insert following the path rules

    // check mask - since symmetrical use half.
    function ismasked(x, y)
    {
        var bt;
        if (x > y) {
            bt = x;
            x = y;
            y = bt;
        }
        bt = y;
        bt += y * y;
        bt >>= 1;
        bt += x;
        return framask[bt];
    }

    //========================================================================
    //  Apply the selected mask out of the 8.
    function  applymask(m)
    {
        var x, y, r3x, r3y;

        switch (m) {
        case 0:
            for (y = 0; y < width; y++)
                for (x = 0; x < width; x++)
                    if (!((x + y) & 1) && !ismasked(x, y))
                        qrframe[x + y * width] ^= 1;
            break;
        case 1:
            for (y = 0; y < width; y++)
                for (x = 0; x < width; x++)
                    if (!(y & 1) && !ismasked(x, y))
                        qrframe[x + y * width] ^= 1;
            break;
        case 2:
            for (y = 0; y < width; y++)
                for (r3x = 0, x = 0; x < width; x++, r3x++) {
                    if (r3x == 3)
                        r3x = 0;
                    if (!r3x && !ismasked(x, y))
                        qrframe[x + y * width] ^= 1;
                }
            break;
        case 3:
            for (r3y = 0, y = 0; y < width; y++, r3y++) {
                if (r3y == 3)
                    r3y = 0;
                for (r3x = r3y, x = 0; x < width; x++, r3x++) {
                    if (r3x == 3)
                        r3x = 0;
                    if (!r3x && !ismasked(x, y))
                        qrframe[x + y * width] ^= 1;
                }
            }
            break;
        case 4:
            for (y = 0; y < width; y++)
                for (r3x = 0, r3y = ((y >> 1) & 1), x = 0; x < width; x++, r3x++) {
                    if (r3x == 3) {
                        r3x = 0;
                        r3y = !r3y;
                    }
                    if (!r3y && !ismasked(x, y))
                        qrframe[x + y * width] ^= 1;
                }
            break;
        case 5:
            for (r3y = 0, y = 0; y < width; y++, r3y++) {
                if (r3y == 3)
                    r3y = 0;
                for (r3x = 0, x = 0; x < width; x++, r3x++) {
                    if (r3x == 3)
                        r3x = 0;
                    if (!((x & y & 1) + !(!r3x | !r3y)) && !ismasked(x, y))
                        qrframe[x + y * width] ^= 1;
                }
            }
            break;
        case 6:
            for (r3y = 0, y = 0; y < width; y++, r3y++) {
                if (r3y == 3)
                    r3y = 0;
                for (r3x = 0, x = 0; x < width; x++, r3x++) {
                    if (r3x == 3)
                        r3x = 0;
                    if (!(((x & y & 1) + (r3x && (r3x == r3y))) & 1) && !ismasked(x, y))
                        qrframe[x + y * width] ^= 1;
                }
            }
            break;
        case 7:
            for (r3y = 0, y = 0; y < width; y++, r3y++) {
                if (r3y == 3)
                    r3y = 0;
                for (r3x = 0, x = 0; x < width; x++, r3x++) {
                    if (r3x == 3)
                        r3x = 0;
                    if (!(((r3x && (r3x == r3y)) + ((x + y) & 1)) & 1) && !ismasked(x, y))
                        qrframe[x + y * width] ^= 1;
                }
            }
            break;
        }
        return;
    }

    // Badness coefficients.
    var N1 = 3, N2 = 3, N3 = 40, N4 = 10;

    // Using the table of the length of each run, calculate the amount of bad image 
    // - long runs or those that look like finders; called twice, once each for X and Y
    function badruns(length)
    {
        var i;
        var runsbad = 0;
        for (i = 0; i <= length; i++)
            if (rlens[i] >= 5)
                runsbad += N1 + rlens[i] - 5;
        // BwBBBwB as in finder
        for (i = 3; i < length - 1; i += 2)
            if (rlens[i - 2] == rlens[i + 2]
                && rlens[i + 2] == rlens[i - 1]
                && rlens[i - 1] == rlens[i + 1]
                && rlens[i - 1] * 3 == rlens[i]
                // white around the black pattern? Not part of spec
                && (rlens[i - 3] == 0 // beginning
                    || i + 3 > length  // end
                    || rlens[i - 3] * 3 >= rlens[i] * 4 || rlens[i + 3] * 3 >= rlens[i] * 4)
               )
                runsbad += N3;
        return runsbad;
    }

    // Calculate how bad the masked image is - blocks, imbalance, runs, or finders.
    function badcheck()
    {
        var x, y, h, b, b1;
        var thisbad = 0;
        var bw = 0;

        // blocks of same color.
        for (y = 0; y < width - 1; y++)
            for (x = 0; x < width - 1; x++)
                if ((qrframe[x + width * y] && qrframe[(x + 1) + width * y]
                     && qrframe[x + width * (y + 1)] && qrframe[(x + 1) + width * (y + 1)]) // all black
                    || !(qrframe[x + width * y] || qrframe[(x + 1) + width * y]
                         || qrframe[x + width * (y + 1)] || qrframe[(x + 1) + width * (y + 1)])) // all white
                    thisbad += N2;

        // X runs
        for (y = 0; y < width; y++) {
            rlens[0] = 0;
            for (h = b = x = 0; x < width; x++) {
                if ((b1 = qrframe[x + width * y]) == b)
                    rlens[h]++;
                else
                    rlens[++h] = 1;
                b = b1;
                bw += b ? 1 : -1;
            }
            thisbad += badruns(h);
        }

        // black/white imbalance
        if (bw < 0)
            bw = -bw;

        var big = bw;
        count = 0;
        big += big << 2;
        big <<= 1;
        while (big > width * width)
            big -= width * width, count++;
        thisbad += count * N4;

        // Y runs
        for (x = 0; x < width; x++) {
            rlens[0] = 0;
            for (h = b = y = 0; y < width; y++) {
                if ((b1 = qrframe[x + width * y]) == b)
                    rlens[h]++;
                else
                    rlens[++h] = 1;
                b = b1;
            }
            thisbad += badruns(h);
        }
        return thisbad;
    }

    function genframe(instring)
    {
        var x, y, k, t, v, i, j, m;

        instring = instring || ''

    // find the smallest version that fits the string
        t = instring.length;
        version = 0;
        do {
            version++;
            k = (ecclevel - 1) * 4 + (version - 1) * 16;
            neccblk1 = eccblocks[k++];
            neccblk2 = eccblocks[k++];
            datablkw = eccblocks[k++];
            eccblkwid = eccblocks[k];
            k = datablkw * (neccblk1 + neccblk2) + neccblk2 - 3 + (version <= 9);
            if (t <= k)
                break;
        } while (version < 40);

    // FIXME - insure that it fits insted of being truncated
        width = 17 + 4 * version;

    // allocate, clear and setup data structures
        v = datablkw + (datablkw + eccblkwid) * (neccblk1 + neccblk2) + neccblk2;
        for( t = 0; t < v; t++ )
            eccbuf[t] = 0;
        strinbuf = instring.slice(0);

        for( t = 0; t < width * width; t++ )
            qrframe[t] = 0;

        for( t = 0 ; t < (width * (width + 1) + 1) / 2; t++)
            framask[t] = 0;

    // insert finders - black to frame, white to mask
        for (t = 0; t < 3; t++) {
            k = 0;
            y = 0;
            if (t == 1)
                k = (width - 7);
            if (t == 2)
                y = (width - 7);
            qrframe[(y + 3) + width * (k + 3)] = 1;
            for (x = 0; x < 6; x++) {
                qrframe[(y + x) + width * k] = 1;
                qrframe[y + width * (k + x + 1)] = 1;
                qrframe[(y + 6) + width * (k + x)] = 1;
                qrframe[(y + x + 1) + width * (k + 6)] = 1;
            }
            for (x = 1; x < 5; x++) {
                setmask(y + x, k + 1);
                setmask(y + 1, k + x + 1);
                setmask(y + 5, k + x);
                setmask(y + x + 1, k + 5);
            }
            for (x = 2; x < 4; x++) {
                qrframe[(y + x) + width * (k + 2)] = 1;
                qrframe[(y + 2) + width * (k + x + 1)] = 1;
                qrframe[(y + 4) + width * (k + x)] = 1;
                qrframe[(y + x + 1) + width * (k + 4)] = 1;
            }
        }

    // alignment blocks
        if (version > 1) {
            t = adelta[version];
            y = width - 7;
            for (;;) {
                x = width - 7;
                while (x > t - 3) {
                    putalign(x, y);
                    if (x < t)
                        break;
                    x -= t;
                }
                if (y <= t + 9)
                    break;
                y -= t;
                putalign(6, y);
                putalign(y, 6);
            }
        }

    // single black
        qrframe[8 + width * (width - 8)] = 1;

    // timing gap - mask only
        for (y = 0; y < 7; y++) {
            setmask(7, y);
            setmask(width - 8, y);
            setmask(7, y + width - 7);
        }
        for (x = 0; x < 8; x++) {
            setmask(x, 7);
            setmask(x + width - 8, 7);
            setmask(x, width - 8);
        }

    // reserve mask-format area
        for (x = 0; x < 9; x++)
            setmask(x, 8);
        for (x = 0; x < 8; x++) {
            setmask(x + width - 8, 8);
            setmask(8, x);
        }
        for (y = 0; y < 7; y++)
            setmask(8, y + width - 7);

    // timing row/col
        for (x = 0; x < width - 14; x++)
            if (x & 1) {
                setmask(8 + x, 6);
                setmask(6, 8 + x);
            }
            else {
                qrframe[(8 + x) + width * 6] = 1;
                qrframe[6 + width * (8 + x)] = 1;
            }

    // version block
        if (version > 6) {
            t = vpat[version - 7];
            k = 17;
            for (x = 0; x < 6; x++)
                for (y = 0; y < 3; y++, k--)
                    if (1 & (k > 11 ? version >> (k - 12) : t >> k)) {
                        qrframe[(5 - x) + width * (2 - y + width - 11)] = 1;
                        qrframe[(2 - y + width - 11) + width * (5 - x)] = 1;
                    }
            else {
                setmask(5 - x, 2 - y + width - 11);
                setmask(2 - y + width - 11, 5 - x);
            }
        }

    // sync mask bits - only set above for white spaces, so add in black bits
        for (y = 0; y < width; y++)
            for (x = 0; x <= y; x++)
                if (qrframe[x + width * y])
                    setmask(x, y);

    // convert string to bitstream
    // 8 bit data to QR-coded 8 bit data (numeric or alphanum, or kanji not supported)
        v = strinbuf.length;

    // string to array
        for( i = 0 ; i < v; i++ )
            eccbuf[i] = strinbuf.charCodeAt(i);
        strinbuf = eccbuf.slice(0);

    // calculate max string length
        x = datablkw * (neccblk1 + neccblk2) + neccblk2;
        if (v >= x - 2) {
            v = x - 2;
            if (version > 9)
                v--;
        }

    // shift and repack to insert length prefix
        i = v;
        if (version > 9) {
            strinbuf[i + 2] = 0;
            strinbuf[i + 3] = 0;
            while (i--) {
                t = strinbuf[i];
                strinbuf[i + 3] |= 255 & (t << 4);
                strinbuf[i + 2] = t >> 4;
            }
            strinbuf[2] |= 255 & (v << 4);
            strinbuf[1] = v >> 4;
            strinbuf[0] = 0x40 | (v >> 12);
        }
        else {
            strinbuf[i + 1] = 0;
            strinbuf[i + 2] = 0;
            while (i--) {
                t = strinbuf[i];
                strinbuf[i + 2] |= 255 & (t << 4);
                strinbuf[i + 1] = t >> 4;
            }
            strinbuf[1] |= 255 & (v << 4);
            strinbuf[0] = 0x40 | (v >> 4);
        }
    // fill to end with pad pattern
        i = v + 3 - (version < 10);
        while (i < x) {
            strinbuf[i++] = 0xec;
            // buffer has room    if (i == x)      break;
            strinbuf[i++] = 0x11;
        }

    // calculate and append ECC

    // calculate generator polynomial
        genpoly[0] = 1;
        for (i = 0; i < eccblkwid; i++) {
            genpoly[i + 1] = 1;
            for (j = i; j > 0; j--)
                genpoly[j] = genpoly[j]
                ? genpoly[j - 1] ^ gexp[modnn(glog[genpoly[j]] + i)] : genpoly[j - 1];
            genpoly[0] = gexp[modnn(glog[genpoly[0]] + i)];
        }
        for (i = 0; i <= eccblkwid; i++)
            genpoly[i] = glog[genpoly[i]]; // use logs for genpoly[] to save calc step

    // append ecc to data buffer
        k = x;
        y = 0;
        for (i = 0; i < neccblk1; i++) {
            appendrs(y, datablkw, k, eccblkwid);
            y += datablkw;
            k += eccblkwid;
        }
        for (i = 0; i < neccblk2; i++) {
            appendrs(y, datablkw + 1, k, eccblkwid);
            y += datablkw + 1;
            k += eccblkwid;
        }
    // interleave blocks
        y = 0;
        for (i = 0; i < datablkw; i++) {
            for (j = 0; j < neccblk1; j++)
                eccbuf[y++] = strinbuf[i + j * datablkw];
            for (j = 0; j < neccblk2; j++)
                eccbuf[y++] = strinbuf[(neccblk1 * datablkw) + i + (j * (datablkw + 1))];
        }
        for (j = 0; j < neccblk2; j++)
            eccbuf[y++] = strinbuf[(neccblk1 * datablkw) + i + (j * (datablkw + 1))];
        for (i = 0; i < eccblkwid; i++)
            for (j = 0; j < neccblk1 + neccblk2; j++)
                eccbuf[y++] = strinbuf[x + i + j * eccblkwid];
        strinbuf = eccbuf;

    // pack bits into frame avoiding masked area.
        x = y = width - 1;
        k = v = 1;         // up, minus
        /* inteleaved data and ecc codes */
        m = (datablkw + eccblkwid) * (neccblk1 + neccblk2) + neccblk2;
        for (i = 0; i < m; i++) {
            t = strinbuf[i];
            for (j = 0; j < 8; j++, t <<= 1) {
                if (0x80 & t)
                    qrframe[x + width * y] = 1;
                do {        // find next fill position
                    if (v)
                        x--;
                    else {
                        x++;
                        if (k) {
                            if (y != 0)
                                y--;
                            else {
                                x -= 2;
                                k = !k;
                                if (x == 6) {
                                    x--;
                                    y = 9;
                                }
                            }
                        }
                        else {
                            if (y != width - 1)
                                y++;
                            else {
                                x -= 2;
                                k = !k;
                                if (x == 6) {
                                    x--;
                                    y -= 8;
                                }
                            }
                        }
                    }
                    v = !v;
                } while (ismasked(x, y));
            }
        }

    // save pre-mask copy of frame
        strinbuf = qrframe.slice(0);
        t = 0;           // best
        y = 30000;         // demerit
    // for instead of while since in original arduino code
    // if an early mask was "good enough" it wouldn't try for a better one
    // since they get more complex and take longer.
        for (k = 0; k < 8; k++) {
            applymask(k);      // returns black-white imbalance
            x = badcheck();
            if (x < y) { // current mask better than previous best?
                y = x;
                t = k;
            }
            if (t == 7)
                break;       // don't increment i to a void redoing mask
            qrframe = strinbuf.slice(0); // reset for next pass
        }
        if (t != k)         // redo best mask - none good enough, last wasn't t
            applymask(t);

    // add in final mask/ecclevel bytes
        y = fmtword[t + ((ecclevel - 1) << 3)];
        // low byte
        for (k = 0; k < 8; k++, y >>= 1)
            if (y & 1) {
                qrframe[(width - 1 - k) + width * 8] = 1;
                if (k < 6)
                    qrframe[8 + width * k] = 1;
                else
                    qrframe[8 + width * (k + 1)] = 1;
            }
        // high byte
        for (k = 0; k < 7; k++, y >>= 1)
            if (y & 1) {
                qrframe[8 + width * (width - 7 + k)] = 1;
                if (k)
                    qrframe[(6 - k) + width * 8] = 1;
                else
                    qrframe[7 + width * 8] = 1;
            }

    // return image
        return qrframe;
    }

    var _canvas = null,
        _size = null;

    var api = {

        get ecclevel () {
            return ecclevel;
        },

        set ecclevel (val) {
            ecclevel = val;
        },

        get size () {
            return _size;
        },

        set size (val) {
            _size = val
        },

        get canvas () {
            return _canvas;
        },

        set canvas (el) {
            _canvas = el;
        },

        getFrame: function (string) {
            return genframe(string);
        },

        draw: function (string, canvas, size, ecc) {
            
            ecclevel = ecc || ecclevel;
            canvas = canvas || _canvas;

            if (!canvas) {
                console.warn('No canvas provided to draw QR code in!')
                return;
            }

            size = size || _size || Math.min(canvas.width, canvas.height);

            var frame = genframe(string),
                ctx = canvas.getContext('2d'),
                px = Math.round(size / (width + 8));

            var roundedSize = px * (width + 8),
                offset = Math.floor((size - roundedSize) / 2);

            size = roundedSize;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, size, size);
            ctx.fillStyle = '#000';
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < width; j++) {
                    if (frame[j * width + i]) {
                        ctx.fillRect(px * (4 + i) + offset, px * (4 + j) + offset, px, px);
                    }
                }
            }

        },

        toDataURL: function (string, size, ecc) {
            var canvas = document.createElement('canvas');
            canvas.width = size || _size || 300;
            canvas.height = canvas.width;
            api.draw(string, canvas, canvas.width, ecc);
            return canvas.toDataURL();
        },

        makeImage: function (string, size, ecc) {
            var img = new Image();
            img.src = api.toDataURL(string, size, ecc);

            return img;
        }
    }

    return api;

})()
