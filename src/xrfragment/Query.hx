package xrfragment;

@:expose  // <- makes the class reachable from plain JavaScript
@:keep    // <- avoids accidental removal by dead code elimination
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

class Query {

  private var str:String = "";
  private var q:haxe.DynamicAccess<Dynamic> = {};
  private var isProp:EReg        = ~/^.*:[><=!]?/;
  private var isExclude:EReg     = ~/^-/;

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

  @:keep
  public function parse(str:String,recurse:Bool = false) : Dynamic {

    var token = str.split(" ");
    var q:haxe.DynamicAccess<Dynamic> = {};

    function process(str,prefix = ""){
      str = StringTools.trim(str);
      var value:haxe.DynamicAccess<Dynamic> = {};
      if( isProp.match(str) ){
        var oper:String = "";
        if( str.indexOf("*")  != -1 ) oper = "*";
        if( str.indexOf(">")  != -1 ) oper = ">";
        if( str.indexOf("<")  != -1 ) oper = "<";
        if( str.indexOf("!=") != -1 ) oper = "!=";
        if( str.indexOf(">=") != -1 ) oper = ">=";
        if( str.indexOf("<=") != -1 ) oper = "<=";
        var k:String = str.split(":")[0];
        var v:String = str.split(":")[1];
        if( q.get(prefix+k) ) value = q.get(prefix+k);
        if( oper.length > 0 ){
          value[ oper ] = Std.parseFloat( v.substr(oper.length) );
          q.set( k, value );
        }else{
          value[ prefix+ (isExclude.match(k) ? k.substr(1) : k) ] = isExclude.match(k) == false;
          q.set(v,value);
        }
        return;
      }else{ // id
        value[ "id" ] = isExclude.match(str) ? false: true;
        q.set( (isExclude.match(str) ? str.substr(1) : str ) ,value );
      }
    }
    for( i in 0...token.length ) process( expandAliases(token[i]) );
    this.q = q;
    return this.q;
  }

  @:keep
  public function test( property:String, ?value:Dynamic ):Bool{
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

    // conditional props
    for ( k in Reflect.fields(q) ){
      var qval:Dynamic = Reflect.field(q,k);
      if( Std.isOfType(value, String) ) continue;
      if( Reflect.field(qval,'=')  != null && testprop( value == Reflect.field(qval,'=')                ) ) qualify += 1;
      if( Reflect.field(qval,'*')  != null && testprop( value != null                                   ) ) qualify += 1;
      if( Reflect.field(qval,'>')  != null && testprop( value >  Std.parseFloat(Reflect.field(qval,'>' )) ) ) qualify += 1;
      if( Reflect.field(qval,'<')  != null && testprop( value <  Std.parseFloat(Reflect.field(qval,'<' )) ) ) qualify += 1;
      if( Reflect.field(qval,'>=') != null && testprop( value >= Std.parseFloat(Reflect.field(qval,'>=')) ) ) qualify += 1;
      if( Reflect.field(qval,'<=') != null && testprop( value >= Std.parseFloat(Reflect.field(qval,'<=')) ) ) qualify += 1;
      if( Reflect.field(qval,'!=') != null && testprop( value != Std.parseFloat(Reflect.field(qval,'!=')) ) ) qualify += 1;
    }
    return qualify > 0;
  }
}
