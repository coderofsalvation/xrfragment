// SPDX-License-Identifier: MPL-2.0        
// Copyright (c) 2023 Leon van Kammen/NLNET 
package xrfragment;

@:expose                                                                   // <- makes the class reachable from plain JavaScript
@:keep                                                                     // <- avoids accidental removal by dead code elimination
class XRF {

  /*
   * this class represents a fragment (value)
   */

  // public static inline readonly ASSET 

	// scope types (powers of 2)
	public static var ASSET:Int               = 1;       // fragment is immutable
	public static var PROP_BIND:Int           = 2;       // fragment binds/controls one property with another 
	public static var QUERY_OPERATOR:Int      = 4;       // fragment will be applied to result of queryselecto
	public static var PROMPT:Int              = 8;       // ask user whether this fragment value can be changed
	public static var ROUNDROBIN:Int          = 16;      // evaluation of this (multi) value can be roundrobined
	public static var NAVIGATOR:Int           = 32;      // fragment can be overridden by (manual) browser URI change
	public static var METADATA:Int            = 64;      // fragment can be overridden by an embedded URL
	public static var PV_OVERRIDE:Int         = 128;     // embedded fragment can be overridden when specified in predefined view value
	public static var PV_EXECUTE:Int          = 256;     // predefined view 

	// high-level value-types (powers of 2)
	public static var T_COLOR:Int             = 8192;
	public static var T_INT:Int               = 16384;
	public static var T_FLOAT:Int             = 32768;
	public static var T_VECTOR2:Int           = 65536;
	public static var T_VECTOR3:Int           = 131072;
	public static var T_URL:Int               = 262144;
	public static var T_PREDEFINED_VIEW:Int   = 524288;
	public static var T_STRING:Int            = 1048576;
	public static var T_STRING_OBJ:Int        = 2097152;
	public static var T_STRING_OBJ_PROP:Int   = 4194304;

  // regexes
  public static var isColor:EReg  = ~/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/; //  1. hex colors are detected using regex `/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/`
  public static var isInt:EReg    = ~/^[0-9]+$/;                           //  1. integers are detected using regex `/^[0-9]+$/`
  public static var isFloat:EReg  = ~/^[0-9]+\.[0-9]+$/;                   //  1. floats are detected using regex `/^[0-9]+\.[0-9]+$/`
  public static var isVector:EReg = ~/([,]+|\w)/;                          //  1. vectors are detected using regex `/[,]/` (but can also be an string referring to an entity-ID in the asset)
  public static var isUrl:EReg    = ~/(:\/\/)?\..*/;                       //  1. url/file */` 
  public static var isUrlOrPretypedView:EReg = ~/(^#|:\/\/)?\..*/;                       //  1. url/file */` 
  public static var isString:EReg = ~/.*/;                                 //  1. anything else is string  `/.*/`

  // value holder(s)                                                       //  |------|------|--------|----------------------------------|
  public var fragment:String;
  public var flags:Int;
  public var x:Float;                                                      //  |vector| x,y,z| comma-separated    | #pos=1,2,3           |
  public var y:Float;
  public var z:Float;
  public var w:Float;
  public var color:String;                                                 //  |string| color| FFFFFF (hex)      | #fog=5m,FFAACC        |
  public var string:String;                                                //  |string|      |                   | #q=-sun               |
  public var int:Int;                                                      //  |int   |      | [-]x[xxxxx]       | #price:>=100          |
  public var float:Float;                                                  //  |float |      | [-]x[.xxxx] (ieee)| #prio=-20             |
  public var args:Array<XRF>;                                              //  |array | mixed| \|-separated      | #pos=0,0,0\|90,0,0    |
  public var query:Query;
  public var noXRF:Bool;
                                                                           //
  public function new(_fragment:String,_flags:Int){
    fragment = _fragment;
    flags    = _flags;
  }

  public function is(flag:Int):Bool {
    return (flags & flag) != 0;
  }

  public static function set(flag:Int, flags:Int):Int {
    return flags | flag;
  }

  public static function unset(flag:Int, flags:Int):Int {
    return flags & ~flag;
  }

  public function validate(value:String) : Bool{
    guessType(this, value);                                             //  1. extract the type
    // process multiple values                              
    if( value.split("|").length > 1 ){                               //  1. use `|` on stringvalues, to split multiple values
      this.args = new Array<XRF>();
      var args:Array<String> = value.split("|");
      for( i in 0...args.length){
        var x:XRF = new XRF(fragment,flags);
        guessType(x, args[i]);                                       //  1. for each multiple value, guess the type
        this.args.push( x );
      }
    }
    // special case: query has its own DSL (*TODO* allow fragments to have custom validators)
    if( fragment == "q" ) query = (new Query(value)).get();
    // validate
    var ok:Bool = true;
    if( !Std.isOfType(args,Array) ){
      if( is(T_VECTOR3) && !(Std.isOfType(x,Float) && Std.isOfType(y,Float) && Std.isOfType(z,Float)) ) ok = false;
      if( is(T_VECTOR2) && !(Std.isOfType(x,Float) && Std.isOfType(y,Float))                          ) ok = false;
      if( is(T_INT)     && !Std.isOfType(int,Int) ) ok = false;
    }
    return ok;
  }

  @:keep
  public function guessType(v:XRF, str:String):Void {
    v.string = str;
    if( str.split(",").length > 1){                                      //  1. `,` assumes 1D/2D/3D vector-values like x[,y[,z]]
      var xyz:Array<String> = str.split(",");                            //  1. parseFloat(..) and parseInt(..) is applied to vector/float and int values 
      if( xyz.length > 0 ) v.x = Std.parseFloat(xyz[0]);                 //  1. anything else will be treated as string-value 
      if( xyz.length > 1 ) v.y = Std.parseFloat(xyz[1]);                 //  1. incompatible value-types will be dropped / not used
      if( xyz.length > 2 ) v.z = Std.parseFloat(xyz[2]);                 //  
      if( xyz.length > 3 ) v.w = Std.parseFloat(xyz[3]);                 //  
    }                                                                    //  > the xrfragment specification should stay simple enough
                                                                         //  > for anyone to write a parser using either regexes or grammar/lexers
    if( isColor.match(str) ) v.color = str;                         //  > therefore expressions/comprehensions are not supported (max wildcard/comparison operators for queries e.g.)
    if( isFloat.match(str) ) v.float = Std.parseFloat(str);
    if( isInt.match(str)   ) v.int   = Std.parseInt(str);
  }

}
