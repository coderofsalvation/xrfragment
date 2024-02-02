import xrfragment.Filter;
import xrfragment.URI;
import xrfragment.XRF;

class Spec {
  macro public static function load(path : String) {
    var value = sys.io.File.getContent(path),
        json = haxe.Json.parse(value);
    return macro $v{json};
  }
}

class Test {

  static var errors:Int = 0;

  static public function main():Void {
    test( "url.json",         Spec.load("src/spec/url.json") );
    test( "pos.json",         Spec.load("src/spec/pos.json") );
    test( "t.json",           Spec.load("src/spec/t.json") );
    test( "xywh.json",           Spec.load("src/spec/xywh.json") );
    test( "speed.json",           Spec.load("src/spec/speed.json") );
    test( "filter.selectors.json", Spec.load("src/spec/filter.selectors.json") );
    //test( Spec.load("src/spec/tmp.json") );
		if( errors > 1 ) trace("\n-----\n[ ❌] "+errors+" errors :/");
  }

  static public function test( topic:String, spec:Array<Dynamic>):Void {
    trace("\n[.] running "+topic);
    var Filter = xrfragment.Filter;
    for( i in 0...spec.length ){
      var f:Filter      = null;
      var res:haxe.DynamicAccess<Dynamic>  = null;
      var valid:Bool     = false;
      var item:Dynamic = spec[i];
      f   = new Filter(item.data);
      res = URI.parse(item.data,null);
      if( item.expect.fn == "test"                  ) valid = item.expect.out == f.test( item.expect.input[0] );
      if( item.expect.fn == "testProperty"          ) valid = item.expect.out == f.testProperty( item.expect.input[0], item.expect.input[1] );
      if( item.expect.fn == "testPropertyInt"       ) valid = item.expect.out == f.testProperty( item.expect.input[0], item.expect.input[1] );
      if( item.expect.fn == "testPropertyExclude"   ) valid = item.expect.out == f.testProperty( item.expect.input[0], item.expect.input[1], true );
      if( item.expect.fn == "testParsed"            ) valid = item.expect.out == res.exists(item.expect.input);
      if( item.expect.fn == "testPredefinedView"    ) valid = res.exists(item.expect.input) && item.expect.out == res.get(item.expect.input).is( XRF.PV_EXECUTE) ;
      if( item.expect.fn == "testPropertyAssign"    ) valid = res.exists(item.expect.input) && item.expect.out == res.get(item.expect.input).is( XRF.PROP_BIND) ;
      if( item.expect.fn == "testBrowserOverride"   ) valid = item.expect.out == (URI.parse(item.data,XRF.NAVIGATOR)).exists(item.expect.input);
      if( item.expect.fn == "testEmbedOverride"     ) valid = item.expect.out == (URI.parse(item.data,XRF.METADATA)).exists(item.expect.input);
      if( item.expect.fn == "equal.string"          ) valid = res.get(item.expect.input) && item.expect.out == res.get(item.expect.input).string;
      if( item.expect.fn == "equal.x"               ) valid = equalX(res,item);
      if( item.expect.fn == "equal.xy"              ) valid = equalXY(res,item);
      if( item.expect.fn == "equal.xyz"             ) valid = equalXYZ(res,item);
      if( item.expect.fn == "equal.mediafragmentT"   ) valid = equalMediaFragment(res,item,"t");
      if( item.expect.fn == "equal.mediafragmentXYWH") valid = equalMediaFragment(res,item,"xywh");
      if( item.expect.fn == "equal.mediafragmentSpeed") valid = equalMediaFragment(res,item,"speed");
      if( item.expect.fn == "testFilterRoot"        ) valid = res.exists(item.expect.input[0]) && res.get(item.expect.input[0]).filter.get().root == item.expect.out;
      if( item.expect.fn == "testFilterDeep"        ) valid = res.exists(item.expect.input[0]) && res.get(item.expect.input[0]).filter.get().deep == item.expect.out;
      var ok:String = valid ? "[ ✔ ] " : "[ ❌] ";
      trace( ok + item.fn + ": '" + item.data + "'" + (item.label ? "    (" + (item.label?item.label:item.expect.fn) +")" : ""));
			if( !valid ) errors += 1;
    }
  }

  static public function equalX(res:haxe.DynamicAccess<Dynamic>, item:Dynamic):Bool {
    if( !item.expect.out && !res.get(item.expect.input) ) return true;
    else return res.get(item.expect.input) && item.expect.out == (Std.string(res.get(item.expect.input).x) );
  }

	static public function equalXY(res:haxe.DynamicAccess<Dynamic>, item:Dynamic):Bool {
    if( !item.expect.out && !res.get(item.expect.input) ) return true;
    else return res.get(item.expect.input) && item.expect.out == (Std.string(res.get(item.expect.input).x) +","+ Std.string(res.get(item.expect.input).y) );
  }

	static public function equalXYZ(res:haxe.DynamicAccess<Dynamic>, item:Dynamic):Bool {
    if( !item.expect.out && !res.get(item.expect.input) ) return true;
    else return res.get(item.expect.input) && item.expect.out == (Std.string(res.get(item.expect.input).x) +","+ Std.string(res.get(item.expect.input).y)+","+ Std.string(res.get(item.expect.input).z));
  }

	static public function equalMediaFragment(res:haxe.DynamicAccess<Dynamic>, item:Dynamic, key:String):Bool {
    if( !item.expect.out && !res.get(item.expect.input) ) return true;
    else return res.get( key ).floats[ Std.parseInt(item.expect.input) ] == Std.parseFloat(item.expect.out);
  }

  static public function testUrl():Void {
    var Uri   = xrfragment.URI;
    var url:String = "http://foo.com?foo=1#bar=flop&a=1,2&b=c|d|1,2,3";
    trace(url);
    trace( Uri.parse(url,0) );
  }

  static public function testFilter():Void {
    var Filter = xrfragment.Filter;

    trace( (new Filter("foo or bar")).toObject() );
    trace( (new Filter("class:fopoer or bar foo:bar")).toObject().or[0] );
    trace( (new Filter("-skybox class:foo")).toObject().or[0] );
    trace( (new Filter("foo/flop moo or bar")).toObject().or[0] );
    trace( (new Filter("-foo/flop moo or bar")).toObject().or[0] );
    trace( (new Filter("price:>4 moo or bar")).toObject().or[0] );
    trace( (new Filter("price:>=4 moo or bar")).toObject().or[0] );
    trace( (new Filter("price:<=4 moo or bar")).toObject().or[0] );
    trace( (new Filter("price:!=4 moo or bar")).toObject().or[0] );

    trace("all tests passed");
  }
}
