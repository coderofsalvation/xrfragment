import xrfragment.Query;
import xrfragment.Url;

class Spec {
  macro public static function load(path : String) {
    var value = sys.io.File.getContent(path),
        json = haxe.Json.parse(value);
    return macro $v{json};
  }
}

class Test {

  static public function main():Void {
    test( Spec.load("src/spec/url.json") );
    test( Spec.load("src/spec/query.class.json") );
    test( Spec.load("src/spec/query.conditional.json") );
    //test( Spec.load("src/spec/tmp.json") );
  }

  static public function test(spec:Array<Dynamic>):Void {
    var Query = xrfragment.Query;
		var errors:Int = 0;
    for( i in 0...spec.length ){
      var q:Query      = null;
      var res:haxe.DynamicAccess<Dynamic>  = null;
      var valid:Bool     = false;
      var item:Dynamic = spec[i];
      if( item.fn == "query"       ) q   = new Query(item.data);
      if( item.fn == "url"         ) res = Url.parse(item.data);
      if( item.expect.fn == "test"         ) valid = item.expect.out == q.test( item.expect.input[0], item.expect.input[1] );
      if( item.expect.fn == "equal.string" ) valid = item.expect.out == res.get(item.expect.input).string;
      if( item.expect.fn == "equal.xy"     ) valid = item.expect.out == (Std.string(res.get(item.expect.input).x) + Std.string(res.get(item.expect.input).y) );
      if( item.expect.fn == "equal.multi"  ) valid = equalMulti(res, item);
      var ok:String = valid ? "[ ✔ ] " : "[ ❌] ";
      trace( ok + item.fn + ": '" + item.data + "'" + (item.label ? " <= " + (item.label?item.label:item.expect.fn) : ""));
			if( !valid ) errors += 1;
    }
		if( errors > 1 ) trace("\n-----\n[ ❌] "+errors+" errors :/");
  }

	static public function equalMulti(res:haxe.DynamicAccess<Dynamic>, item:Dynamic):Bool {
    var target:Dynamic = res.get(item.expect.input);
    var str:String     = "";
		for( i in 0...target.args.length ){
			str = str + "|" + target.args[i].string;
		}
		str = str.substr(1);
    return str == item.expect.out;
	}

  static public function testUrl():Void {
    var Url   = xrfragment.Url;
    var uri:String = "http://foo.com?foo=1#bar=flop&a=1,2&b=c|d|1,2,3";
    trace(uri);
    trace( Url.parse(uri) );
  }

  static public function testQuery():Void {
    var Query = xrfragment.Query;

    trace( (new Query("foo or bar")).toObject() );
    trace( (new Query("class:fopoer or bar foo:bar")).toObject().or[0] );
    trace( (new Query("-skybox class:foo")).toObject().or[0] );
    trace( (new Query("foo/flop moo or bar")).toObject().or[0] );
    trace( (new Query("-foo/flop moo or bar")).toObject().or[0] );
    trace( (new Query("price:>4 moo or bar")).toObject().or[0] );
    trace( (new Query("price:>=4 moo or bar")).toObject().or[0] );
    trace( (new Query("price:<=4 moo or bar")).toObject().or[0] );
    trace( (new Query("price:!=4 moo or bar")).toObject().or[0] );

    var q:Dynamic = new Query("price:!=4 moo or bar");
    var obj:Dynamic = q.toObject();
    q.test( "price", 4);
    var ok = !q.selected("slkklskdf");
    if( !ok ) throw 'node should not be allowed';

    q = new Query("price:!=3 moo or bar");
    var obj:Dynamic = q.toObject();
    q.test( "price", 4);
    var ok = q.selected("slkklskdf");
    if( !ok ) throw 'non-mentioned node should be allowed';

    q = new Query("moo or bar");
    var obj:Dynamic = q.toObject();
    var ok = !q.selected("slkklskdf");
    if( !ok ) throw 'node should not be allowed';
    obj = q.toObject();
    var ok = q.selected("moo");
    if( !ok ) throw 'moo should be allowed';
    var ok = q.selected("bar");
    if( !ok ) throw 'bar should be allowed';

    q = new Query("price:>3 moo or bar");
    var obj:Dynamic = q.toObject();
    q.test( "price", 4);
    var ok = q.selected("foo");
    if( !ok ) throw 'node should be allowed';
    var ok = q.selected("bar");
    if( !ok ) throw 'node should be allowed';
    var ok = q.selected("moo");
    if( !ok ) throw 'node should be allowed';

    q = new Query("price:>3 price:<10 -bar");
    var obj:Dynamic = q.toObject();
    q.test( "price", 4);
    var ok = q.selected("foo");
    if( !ok ) throw 'node should be allowed';
    var ok = !q.selected("bar");
    if( !ok ) throw 'bar should not be allowed';
    q.test("price", 20);
    var ok = !q.selected("foo");
    if( !ok ) throw 'price 20 should not be allowed';

    q = new Query("-bar");
    var obj:Dynamic = q.toObject();
    var ok = q.selected("foo");
    if( !ok ) throw 'node should be allowed';
    var ok = !q.selected("bar");
    if( !ok ) throw 'bar should not be allowed';

    q = new Query("title:*");
    var obj:Dynamic = q.toObject();
    var ok = !q.selected("foo");
    if( !ok ) throw 'node should not be allowed';
    q.test("foo","bar");
    var ok = !q.selected("foo");
    if( !ok ) throw 'node should not be allowed';
    q.test("title","bar");
    var ok = q.selected("foo");
    if( !ok ) throw 'node should be allowed';

    q = new Query("-bar +bar");
    var obj:Dynamic = q.toObject();
    var ok = q.selected("foo");
    if( !ok ) throw 'node should be allowed';
    var ok = q.selected("bar");
    if( !ok ) throw 'bar should be allowed';

    q = new Query("?discount");
    var obj:Dynamic = q.toObject();
    q.test("?discount","-foo");
    var ok = !q.selected("foo");
    if( !ok ) throw 'foo should not be allowed';

    q = new Query("?");
    q.test("?","-foo");
    var ok = !q.selected("foo");
    if( !ok ) throw 'foo should not be allowed';

    q = new Query("?");
    var ok = q.selected("foo");
    if( !ok ) throw 'foo should not be allowed';

    q = new Query("?discount");
    q.test("?discount","-foo");
    var ok = !q.selected("foo");
    if( !ok ) throw 'foo should not be allowed';

    q = new Query("?discount +foo");
    var obj:Dynamic = q.toObject();
    q.test("?discount","-foo");
    var ok = !q.selected("foo");
    if( !ok ) throw 'foo should not be allowed';
    var ok = !q.selected("foo");
    if( !ok ) throw 'foo should not be allowed';

    trace("all tests passed");
  }
}
