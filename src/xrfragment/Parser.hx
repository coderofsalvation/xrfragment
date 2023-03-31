package xrfragment;

@:expose                                                                   // <- makes the class reachable from plain JavaScript
@:keep                                                                     // <- avoids accidental removal by dead code elimination

class Parser {                                                             //  # XR Fragments (key/value params)
    public static var error:String = "";                                   //   
                                                                           //  ```
                                                                           //  ⛁  = fragment in 3D asset-file (custom property)
                                                                           //  ⚂  = fragment in navigator URI (`document.location.href` e.g.)
    @:keep                                                                 //  ```
    public static function parse(key:String,value:String,resultMap:haxe.DynamicAccess<Dynamic>):Bool {
      var Frag:Map<String, EReg> = new Map<String, EReg>();                //  | param   | type          | scope | navigator override |category                | notes                   |
                                                                           //  |---------|---------------|-------|--------------------|-------------------------|
      Frag.set("prio", Type.isInt);                                        //  | prio    | int (-10..1)  | ⛁ | Asset loading / linking | #include doc/notes/prio.md |

      Frag.set("pos",  Type.isVector);                                     //  | pos     | 3D vector     | HREF navigation/portals |  |
                                                                           //  
                                                                           //  # XR Fragments parser
      if( Frag.exists(key) ){                                              //  note: community parsers will prolly outperform this initial parser :)
        if( Frag.get(key).match(value) ){                                  //  > icanhazcode? yes, see [Parser.hx](./../src/xrfragment/Parser.hx)
          var v:Value = new Value();                                       //  
          guessType(v, value);                                             //  the gist of it:
          // process multiple/fallback values                              //  1. each key has a regex to validate its value-type (see regexes) 
          if( value.split("|").length > 1 ){                               //  1. `|` is used to split multiple/fallback values
            v.args = new Array<Value>();
            var args:Array<String> = value.split("|");
            for( i in 0...args.length){
              var x:Value = new Value();
              guessType(x, args[i]);
              v.args.push( x );
            }
          }
          resultMap.set(key, v );
        }else { trace("[ i ] fragment '"+key+"' has incompatible value ("+value+")");          return false; }
      }else   { trace("[ i ] fragment '"+key+"' does not exist or has no type defined (yet)"); return false; }

      return true;
    }

    @:keep
    public static function guessType(v:Value, str:String):Void {
      v.string = str;
      if( str.split(",").length > 1){                                     //  1. `,` assumes 1D/2D/3D vector-values like x[,y[,z]]
        var xyz:Array<String> = str.split(",");                           //  1. parseFloat(..) and parseInt(..) is applied to vector/float and int values 
        if( xyz.length > 0 ) v.x = Std.parseFloat(xyz[0]);                //  1. anything else will be treated as string-value 
        if( xyz.length > 1 ) v.y = Std.parseFloat(xyz[1]);                //  1. incompatible value-types will be dropped / not used
        if( xyz.length > 2 ) v.y = Std.parseFloat(xyz[2]);                //  
      }                                                                    //  > the xrfragment specification should stay simple enough
                                                                          //  > for anyone to write a parser using either regexes or grammar/lexers
      if( Type.isColor.match(str) ) v.color = str;                        //  > therefore expressions/comprehensions are not supported (max wildcard/comparison operators for queries e.g.)
      if( Type.isFloat.match(str) ) v.float = Std.parseFloat(str);
      if( Type.isInt.match(str)   ) v.int   = Std.parseInt(str);
    }

}
                                                                           //  # Parser Value types
                                                                           //  
                                                                           //  | type | info | format | example                          |
class Value {                                                              //  |------|------|--------|----------------------------------|
  public var x:Float;                                                      //  |vector| x,y,z| comma-separated    | #pos=1,2,3           |
  public var y:Float;                                                      // 
  public var z:Float;                                                      //
  public var color:String;                                                 //  |string| color| FFFFFF (hex)      | #fog=5m,FFAACC        |
  public var string:String;                                                //  |string|      |                   | #q=-sun               |
  public var int:Int;                                                      //  |int   |      | [-]x[xxxxx]       | #price:>=100          |
  public var float:Float;                                                  //  |float |      | [-]x[.xxxx] (ieee)| #prio=-20
  public var args:Array<Value>;                                            //  |array | mixed| \|-separated      | #pos=0,0,0|90,0,0     |
  public function new(){}                                                  //  
                                                                           //  > rule for thumb: type-limitations will piggyback JSON limitations (IEEE floatsize e.g.)
}
                                                                           // Regexes:
class Type {                                                               //  
  static public var isColor:EReg  = ~/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/; //  1. hex colors are detected using regex `/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/`
  static public var isInt:EReg    = ~/^[0-9]+$/;                           //  1. integers are detected using regex `/^[0-9]+$/`
  static public var isFloat:EReg  = ~/^[0-9]+\.[0-9]+$/;                   //  1. floats are detected using regex `/^[0-9]+\.[0-9]+$/`
  static public var isVector:EReg = ~/([,]+|\w)/;                          //  1. vectors are detected using regex `/[,]/` (but can also be an string referring to an entity-ID in the asset)
}

//  # Tests
//   
//  the spec is tested with [JSON unittests](./../src/spec) consumed by [Test.hx](./../src/Test.hx) to cross-test all languages.
