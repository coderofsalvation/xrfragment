package xrfragment;

@:expose  // <- makes the class reachable from plain JavaScript
@:keep    // <- avoids accidental removal by dead code elimination

                                //  # URI Value types
                                //  
                                //  | type | info | format | example                          |
class Value {                   //  |------|------|--------|----------------------------------|
  public var x:Float;           //  |vector| x,y,z| comma-separated    | #pos=1,2,3           |
  public var y:Float;           // 
  public var z:Float;           //
  public var color:String;      //  |string| color| FFFFFF (hex)      | #fog=5m,FFAACC        |
  public var string:String;     //  |string|      |                   | #q=-sun               |
  public var int:Int;           //  |int   |      | [-]x[xxxxx]       | #price:>=100          |
  public var float:Float;       //  |float |      | [-]x[.xxxx] (ieee)| #prio=-20
  public var args:Array<Value>; //  |array | mixed| \|-separated      | #pos=0,0,0|90,0,0     |
  public function new(){}       //  
                                //  > rule for thumb: type-limitations will piggyback JSON limitations (IEEE floatsize e.g.)
}

class Url {

    @:keep                                                                 //  # Url parser (the gist of it)
    public static function parse(qs:String):haxe.DynamicAccess<Dynamic> {  //  
       var fragment:Array<String>    = qs.split("#");                      //  1. fragment URI starts with `#`
        var splitArray:Array<String>  = fragment[1].split('&');            //  1. fragments are split by `&`
        var regexPlus  = ~/\+/g;                                           //  1. fragment-values are urlencoded (` ` becomes `+` and so on)
        var resultMap:haxe.DynamicAccess<Dynamic> = {};
        for (i in 0...splitArray.length) {
          var splitByEqual = splitArray[i].split('=');                     //  1. `=` is used to indicate fragmentvalues
          var key:String = splitByEqual[0];
          var v:Value = new Value();

          if (splitByEqual.length > 1) {
            var value:String = StringTools.urlDecode(regexPlus.split(splitByEqual[1]).join(" "));
            guessType(v, value);

            // multiple/fallback values
            if( value.split("|").length > 1 ){                             //  1. `|` is used to indicate multiple/fallback values
              v.args = new Array<Value>();
              var args:Array<String> = value.split("|");
              for( i in 0...args.length){
                var x:Value = new Value();
                guessType(x, args[i]);
                v.args.push( x );
              }
            }
            resultMap.set(key, v );
          }
        }
        return resultMap;
    }

    @:keep
    public static function guessType(v:Value, str:String):Void {
      var isColor:EReg  = ~/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;          //  1. hex colors are detected using regex `/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/`
      var isInt:EReg    = ~/^[0-9]+$/;                                    //  1. integers are detected using regex `/^[0-9]+$/`
      var isFloat:EReg  = ~/^[0-9]+\.[0-9]+$/;                            //  1. floats are detected using regex `/^[0-9]+\.[0-9]+$/`
      v.string = str;
      if( str.split(",").length > 1){                                     //  1. `,` is used to detect vector 1D/2D/3D values like x[,y[,z]]
        var xyz:Array<String> = str.split(",");                           //  1. anything else will be treated as string-value 
        if( xyz.length > 0 ) v.x = Std.parseFloat(xyz[0]);                //  1. last resort: inappropriate string values will be converted using parseInt/parseFloat
        if( xyz.length > 1 ) v.y = Std.parseFloat(xyz[1]);
        if( xyz.length > 2 ) v.z = Std.parseFloat(xyz[2]);
      }
      if( isColor.match(str) ) v.color = str;
      if( isFloat.match(str) ) v.float = Std.parseFloat(str);
      if( isInt.match(str)   ) v.int   = Std.parseInt(str);
    }

}
