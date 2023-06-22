// SPDX-License-Identifier: MPL-2.0        
// Copyright (c) 2023 Leon van Kammen/NLNET 
package xrfragment;

//return untyped __js__("window.location.search");

#if js
  var ok:Bool = js.Syntax.code('
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
  ');
#end

@:expose  // <- makes the class reachable from plain JavaScript
@:keep    // <- avoids accidental removal by dead code elimination
class Query {

  private var str:String = "";
  private var q:haxe.DynamicAccess<Dynamic> = {};
  private var isProp:EReg        = ~/^.*:[><=!]?/;
  private var isExclude:EReg     = ~/^-/;
  private var isRoot:EReg        = ~/^[-]?\//;
  private var isClass:EReg       = ~/^[-]?class$/;
  private var isNumber:EReg      = ~/^[0-9\.]+$/;

  public function new(str:String){
    if( str != null  ) this.parse(str);
  }

  public function toObject() : Dynamic {
    return this.q;
  }

  public function expandAliases(token:String) : String {
    // expand '.foo' to 'class:foo'
    var classAlias = ~/^(-)?\./;
    return classAlias.match(token) ? StringTools.replace(token,".","class:") : token;
  }

  public function get() : Dynamic {
    return this.q;
  }

  public function parse(str:String) : Dynamic {

    var token = str.split(" ");
    var q:haxe.DynamicAccess<Dynamic> = {};

    function process(str,prefix = ""){
      str = StringTools.trim(str);
      var k:String = str.split(":")[0];
      var v:String = str.split(":")[1];
      // retrieve existing filter if any
      var filter:haxe.DynamicAccess<Dynamic> = {};
      if( q.get(prefix+k) ) filter = q.get(prefix+k);
      filter['rules'] = filter['rules'] != null ? filter['rules'] : new Array<Dynamic>();

      if( isProp.match(str) ){
        var oper:String = "";
        if( str.indexOf("*")  != -1 ) oper = "*";
        if( str.indexOf(">")  != -1 ) oper = ">";
        if( str.indexOf("<")  != -1 ) oper = "<";
        if( str.indexOf(">=") != -1 ) oper = ">=";
        if( str.indexOf("<=") != -1 ) oper = "<=";
        if( isExclude.match(k) ){
          oper = "!=";
          k = k.substr(1);      // convert "-foo" into "foo" 
        }else v = v.substr(oper.length); // change ">=foo" into "foo" (strip operator)
        if( oper.length == 0 ) oper = "=";
        if( isClass.match(k) ){
          filter[ prefix+ k ] = oper != "!=";
          q.set(v,filter);
        }else{
          var rule:haxe.DynamicAccess<Dynamic> = {};
          if( isNumber.match(v) ) rule[ oper ] = Std.parseFloat(v);
          else rule[oper] = v;
          filter['rules'].push( rule );
          q.set( k, filter );
        }
        return;
      }else{ // id
        filter[ "id"   ] = isExclude.match(str) ? false: true;
        filter[ "root" ] = isRoot.match(str)    ? true:  false;
        if( isExclude.match(str) ) str = str.substr(1); // convert '-foo' into 'foo'
        if( isRoot.match(str)    ) str = str.substr(1); // convert '/foo' into 'foo'
        q.set( str ,filter );
      }
    }
    for( i in 0...token.length ) process( expandAliases(token[i]) );
    return this.q = q;
  }

  @:keep
  public function test( ?obj:Dynamic ):Bool{
    var qualify:Bool = false;
    // first apply includes, then excludes
    for ( k in Reflect.fields(obj) ){
      var v:String = Std.string( Reflect.field(obj,k) );
      if( testProperty( k, v) ) qualify = true;
    }
    for ( k in Reflect.fields(obj) ){
      var v:String = Std.string( Reflect.field(obj,k) );
      if( testProperty( k, v, true) ) qualify = false;
    }
    return qualify;
  }

  @:keep
  public function testProperty( property:String, value:String, ?exclude:Bool ):Bool{
    var conds:Int = 0;
    var fails:Int = 0;
    var qualify:Int  = 0;

    var testprop = function(expr:Bool) : Bool {
      conds+=1;
      fails+= expr ? 0 : 1;
      return expr;
    }

    // class or id
    if( q[value] != null ){
      var v:haxe.DynamicAccess<Dynamic> = q[value];
      if( v.get(property) != null ) return v.get(property);
    }

    // conditional rules
    for ( k in Reflect.fields(q) ){
      var filter:Dynamic = Reflect.field(q,k);
      if( filter.rules == null  ) continue;
      var rules:Array<Dynamic> = filter.rules;

      for( rule in rules ){
        //if( Std.isOfType(value, String) ) contiggnue;
        if( exclude ){
          if( Reflect.field(rule,'!=') != null && testprop( Std.string(value) == Std.string(Reflect.field(rule,'!='))) && exclude ) qualify += 1;
        }else{
          if( Reflect.field(rule,'*')  != null && testprop( Std.parseFloat(value) != null                                   ) ) qualify += 1;
          if( Reflect.field(rule,'>')  != null && testprop( Std.parseFloat(value) >  Std.parseFloat(Reflect.field(rule,'>' )) ) ) qualify += 1;
          if( Reflect.field(rule,'<')  != null && testprop( Std.parseFloat(value) <  Std.parseFloat(Reflect.field(rule,'<' )) ) ) qualify += 1;
          if( Reflect.field(rule,'>=') != null && testprop( Std.parseFloat(value) >= Std.parseFloat(Reflect.field(rule,'>=')) ) ) qualify += 1;
          if( Reflect.field(rule,'<=') != null && testprop( Std.parseFloat(value) <= Std.parseFloat(Reflect.field(rule,'<=')) ) ) qualify += 1;
          if( Reflect.field(rule,'=')  != null && (
            testprop( value == Reflect.field(rule,'='))                   ||
            testprop( Std.parseFloat(value) == Std.parseFloat(Reflect.field(rule,'=')))
          )) qualify += 1;
        }
      }
    }
    return qualify > 0;
  }
}
