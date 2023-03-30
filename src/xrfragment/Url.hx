package xrfragment;

@:expose  // <- makes the class reachable from plain JavaScript
@:keep    // <- avoids accidental removal by dead code elimination

                                //  # URI Value types
                                //  
                                //  | type | info | format | example                          |
class Value {                   //  |------|------|-------------------------------------------|
  public var x:Float;           //  |vector| x,y,z| comma-separated    | #pos=1,2,3           |
  public var y:Float;           // 
  public var z:Float;           //
  public var color:String;      //  |string| color| FFFFFF (hex)      | #fog=5m,FFAACC        |
  public var string:String;     //  |string|      |                   | #q=-sun               |
  public var int:Int;           //  |int   |      | [-]x[xxxxx]       | #price:>=100          |
  public var float:Float;       //  |float |      | [-]x[.xxxx] (ieee)| #prio=-20
  public var args:Array<Value>; //  |array | mixed| \|-separated      | #pos=0,0,0|90,0,0     |
  public function new(){}       //  
                                //  > in general type-limitations will piggyback JSON limitations (IEEE floatsize e.g.)
}

class Url {

    @:keep
    public static function parse(qs:String):haxe.DynamicAccess<Dynamic> {
       var fragment:Array<String>    = qs.split("#");
        var splitArray:Array<String>  = fragment[1].split('&');
        var regexPlus  = ~/\+/g;  // Regex for replacing addition symbol with a space
        var resultMap:haxe.DynamicAccess<Dynamic> = {};
        for (i in 0...splitArray.length) {
          var splitByEqual = splitArray[i].split('=');
          var key:String = splitByEqual[0];
          var v:Value = new Value();

          if (splitByEqual.length > 1) {
            var value:String = StringTools.urlDecode(regexPlus.split(splitByEqual[1]).join(" "));
            guessType(v, value);

            // multiple/fallthrough values
            if( value.split("|").length > 1 ){
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
      var isColor:EReg  = ~/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      var isInt:EReg    = ~/^[0-9]+$/;
      var isFloat:EReg  = ~/^[0-9]+\.[0-9]+$/;
      v.string = str;
      if( str.split(",").length > 1){
        var xyz:Array<String> = str.split(",");
        if( xyz.length > 0 ) v.x = Std.parseFloat(xyz[0]);
        if( xyz.length > 1 ) v.y = Std.parseFloat(xyz[1]);
        if( xyz.length > 2 ) v.z = Std.parseFloat(xyz[2]);
      }
      if( isColor.match(str) ) v.color = str;
      if( isFloat.match(str) ) v.float = Std.parseFloat(str);
      if( isInt.match(str)   ) v.int   = Std.parseInt(str);
    }

}
