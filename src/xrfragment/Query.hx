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

  /**
   * # Spec 
   *
   * > version 1.0.0 [![Actions Status](https://github.com/coderofsalvation/xrfragment/workflows/test/badge.svg)](https://github.com/coderofsalvation/xrfragment/actions) generated by `make doc` @ $(date +"%Y-%m-%dT%H:%M:%S%z")
   * 
   * In case your programming language has no parser ([check here](https://github.com/coderofsalvation/xrfragment/tree/main/dist)) you can [crosscompile it](https://github.com/coderofsalvation/xrfragment/blob/main/build.hxml), or roll your own `Query.parse(str)` using the spec:
   */

  //  1. requirement: receive arguments: query (string)

  private var str:String = "";
  private var q:haxe.DynamicAccess<Dynamic> = {};                      //  1. create an associative array/object to store query-arguments as objects
  private var isProp:EReg        = ~/^.*:[><=!]?/;      //  1. detect object id's & properties `foo:1` and `foo` (reference regex: `/^.*:[><=!]?/`  )
  private var isExclude:EReg     = ~/^-/;               //  1. detect excluders like `-foo`,`-foo:1`,`-.foo`,`-/foo` (reference regex: `/^-/` )
  private var isRoot:EReg        = ~/^[-]?\//;          //  1. detect root selectors like `/foo` (reference regex: `/^[-]?\//` )
  private var isClass:EReg       = ~/^[-]?class$/;      //  1. detect class selectors like `.foo` (reference regex: `/^[-]?class$/` )
  private var isNumber:EReg      = ~/^[0-9\.]+$/;       //  1. detect number values like `foo:1` (reference regex: `/^[0-9\.]+$/` )

  public function new(str:String){
    if( str != null  ) this.parse(str);
  }

  public function toObject() : Dynamic {
    return this.q;
  }

  public function expandAliases(token:String) : String {
    // expand '.foo' to 'class:foo'
    var classAlias = ~/^(-)?\./;
    return classAlias.match(token) ? StringTools.replace(token,".","class:") : token;  //  1. expand aliases like `.foo` into `class:foo`
  }

  public function get() : Dynamic {
    return this.q;
  }

  public function parse(str:String) : Dynamic {

    var token = str.split(" ");
    var q:haxe.DynamicAccess<Dynamic> = {};

    function process(str,prefix = ""){
      str = StringTools.trim(str);
      var k:String = str.split(":")[0];                                          //  1. for every query token split string on `:`
      var v:String = str.split(":")[1];
      // retrieve existing filter if any
      var filter:haxe.DynamicAccess<Dynamic> = {};
      if( q.get(prefix+k) ) filter = q.get(prefix+k);
      filter['rules'] = filter['rules'] != null ? filter['rules'] : new Array<Dynamic>(); //  1. create an empty array `rules`

      if( isProp.match(str) ){                             // 1. <b>WHEN</b></b> when a `:` key/value is detected: 
        var oper:String = "";
        if( str.indexOf("*")  != -1 ) oper = "*";          // 1. then scan for `*` operator (means include all objects for [src](#src) embedded fragment)
        if( str.indexOf(">")  != -1 ) oper = ">";          // 1. then scan for `>` operator
        if( str.indexOf("<")  != -1 ) oper = "<";          // 1. then scan for `<` operator
        if( str.indexOf(">=") != -1 ) oper = ">=";         // 1. then scan for `>=` operator
        if( str.indexOf("<=") != -1 ) oper = "<=";         // 1. then scan for `<=` operator
        if( isExclude.match(k) ){
          oper = "!=";
          k = k.substr(1);      //  1. then strip key-operator: convert "-foo" into "foo" 
        }else v = v.substr(oper.length); // 1. then strip value operator: change value ">=foo" into "foo" 
        if( oper.length == 0 ) oper = "=";
        if( isClass.match(k) ){
          filter[ prefix+ k ] = oper != "!=";
          q.set(v,filter);
        }else{
          var rule:haxe.DynamicAccess<Dynamic> = {};
          if( isNumber.match(v) ) rule[ oper ] = Std.parseFloat(v);
          else rule[oper] = v;
          filter['rules'].push( rule );                    //  1. add operator and value to rule-array
          q.set( k, filter );
        }
        return;
      }else{ // 1. <b>ELSE </b> we are dealing with an object
        filter[ "id"   ] = isExclude.match(str) ? false: true;  //  1. therefore we we set `id` to `true` or `false` (false=excluder `-`)
        filter[ "root" ] = isRoot.match(str)    ? true:  false; //  1. and we set `root` to `true` or `false` (true=`/` root selector is present)
        if( isExclude.match(str) ) str = str.substr(1); // convert '-foo' into 'foo'
        if( isRoot.match(str)    ) str = str.substr(1); //  1. we convert key '/foo' into 'foo'
        q.set( str ,filter );                           //  1. finally we add the key/value to the store (`store.foo = {id:false,root:true}` e.g.)
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
/**
 * > icanhazcode? yes, see [Parser.hx](https://github.com/coderofsalvation/xrfragment/blob/main/src/xrfragment/Query.hx)
 *
 * # Tests
 *   
 * the spec is tested with [JSON unittests](./../src/spec) consumed by [Test.hx](./../src/Test.hx) to cross-test all languages.
 */
