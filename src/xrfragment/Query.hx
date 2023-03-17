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
  private var q:Dynamic  = {};
  private var include:Array<String> = new Array();
  private var exclude:Array<String> = new Array();
  private var accept:Bool = false;
  private var preset:String = "";

  public function new(str:String){
    if( str != null  ) this.parse(str);
  }

  public function toObject() : Dynamic {
    return this.q;
  }

  @:keep
  public function selected( nodename:String ): Bool {
    if( this.q.copy_all ) this.accept = true;
    if( this.include.contains(nodename) ) this.accept = true;
    if( this.exclude.contains(nodename) ) this.accept = false;
    return this.accept;
  }

  public function parse(str:String,recurse:Bool = false) : Dynamic {

    var copyAll:Bool       = recurse ? this.q.copy_all : str.substr(0,1) == "-" || str.substr(0,1) == "?" || str == "";
    var isOr:EReg          = ~/^or$/;
    var isProp:EReg        = ~/.*:[><=!]?/;
    var isName:EReg        = ~/[^:\/]/;
    var isExclude:EReg     = ~/^-/;
    var isInclude:EReg     = ~/^\+/;
    var isPreset:EReg      = ~/^\?/;

    var token = str.split(" ");
    var ors   = new Array();
    var q:haxe.DynamicAccess<Dynamic> = {};

    function composeQuery() : Dynamic {
      q = {};
      q.set("object", new Array() );
      q.set("-object", new Array() );
      ors.push(q);
      return q;
    }
    composeQuery();

    function match(str,prefix = ""){
      if( isPreset.match(str) && !recurse ){
        this.preset = str;
        return;
      }
      if( isExclude.match(str) || isInclude.match(str) ){
        var t = str.substr(1);
        match(t, str.substr(0,1) );
        return;
      }
      if( isProp.match(str) ){
        var skip = 0;
        var type = "=";
        if( str.indexOf("*")  != -1 ) type = "*";
        if( str.indexOf(">")  != -1 ) type = ">";
        if( str.indexOf("<")  != -1 ) type = "<";
        if( str.indexOf("!=") != -1 ) type = "!=";
        if( str.indexOf(">=") != -1 ) type = ">=";
        if( str.indexOf("<=") != -1 ) type = "<=";
        if( type != "=" ) skip += type.length;
        var property = str.split(":")[0];
        var value:haxe.DynamicAccess<Dynamic>;
        if( q.get(prefix+property) ) value = q.get(prefix+property);
        else value = {};
        value[ type ] = str.split(":")[1].substr(skip);
        q.set(prefix+property,value);
        return;
      }
      if( isName.match(str) ){
        if( prefix == '-' ){ 
          q["-object"].push(str);
          while( q["object"].contains(str) == true) {
            q["object"].remove(str);
          }
        }else{
          q["object"].push(str);
          while( q["-object"].contains(str) == true ){
            q["-object"].remove(str);
          }
        }
        return;
      }
    }

    for( i in 0...token.length ) {
      if( isOr.match(token[i]) ){ 
        composeQuery();
      }else match(token[i]);
    }
    for ( i in 0...ors.length ) {
      var or:Dynamic = ors[i];
      if( Reflect.field(or,'object')  != null ) this.include = this.include.concat( Reflect.field(or,'object') );
      if( Reflect.field(or,'-object') != null ) this.exclude = this.exclude.concat( Reflect.field(or,'-object') );
    }
    this.q = { or: ors, copy_all: copyAll };
    return this.q;
  }

  @:keep
  public function test( property:String, ?value:Dynamic ):Void{
    if( this.preset == property ){ 
      this.parse( value, true );
    }
    for ( i in 0...this.q.or.length ) {
      var or:Dynamic = this.q.or[i];
      var conds:Int = 0;
      var fails:Int = 0;
      var pass:Int  = 0;

      var when = function(expr:Bool) : Bool {
        conds+=1;
        fails+= expr ? 0 : 1;
        return expr;
      }

      for ( k in Reflect.fields(or) ){
        var orval:Dynamic = Reflect.field(or,k);
        if( k != property ) continue;
        if( Reflect.field(orval,'=')  != null && when( value == Reflect.field(orval,'=')                ) ) pass += 1;
        if( Reflect.field(orval,'*')  != null && when( value != null                                    ) ) pass += 1;
        if( Reflect.field(orval,'>')  != null && when( value >  Std.parseInt(Reflect.field(orval,'>' )) ) ) pass += 1;  
        if( Reflect.field(orval,'<')  != null && when( value <  Std.parseInt(Reflect.field(orval,'<' )) ) ) pass += 1;  
        if( Reflect.field(orval,'>=') != null && when( value >= Std.parseInt(Reflect.field(orval,'>=')) ) ) pass += 1;  
        if( Reflect.field(orval,'<=') != null && when( value >= Std.parseInt(Reflect.field(orval,'<=')) ) ) pass += 1;  
        if( Reflect.field(orval,'!=') != null && when( value != Std.parseInt(Reflect.field(orval,'!=')) ) ) pass += 1;  
      }
      if( this.accept  && conds > 0 && fails  > 0  ) this.accept = false;
      if( conds > 0    && pass  > 0 && fails ==  0 ) this.accept = true; 
    }
  }
}
