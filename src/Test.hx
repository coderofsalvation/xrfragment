import xrfragment.Query;
import xrfragment.Url;

class Test {

  static public function main():Void {
    trace("starting tests");
    testUrl();
    //testQuery();
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
    var ok = !q.qualify("slkklskdf");
    if( !ok ) throw 'node should not be allowed';

    q = new Query("price:!=3 moo or bar");
    var obj:Dynamic = q.toObject();
    q.test( "price", 4);
    var ok = q.qualify("slkklskdf");
    if( !ok ) throw 'non-mentioned node should be allowed';

    q = new Query("moo or bar");
    var obj:Dynamic = q.toObject();
    var ok = !q.qualify("slkklskdf");
    if( !ok ) throw 'node should not be allowed';
    obj = q.toObject();
    var ok = q.qualify("moo");
    if( !ok ) throw 'moo should be allowed';
    var ok = q.qualify("bar");
    if( !ok ) throw 'bar should be allowed';

    q = new Query("price:>3 moo or bar");
    var obj:Dynamic = q.toObject();
    q.test( "price", 4);
    var ok = q.qualify("foo");
    if( !ok ) throw 'node should be allowed';
    var ok = q.qualify("bar");
    if( !ok ) throw 'node should be allowed';
    var ok = q.qualify("moo");
    if( !ok ) throw 'node should be allowed';

    q = new Query("price:>3 price:<10 -bar");
    var obj:Dynamic = q.toObject();
    q.test( "price", 4);
    var ok = q.qualify("foo");
    if( !ok ) throw 'node should be allowed';
    var ok = !q.qualify("bar");
    if( !ok ) throw 'bar should not be allowed';
    q.test("price", 20);
    var ok = !q.qualify("foo");
    if( !ok ) throw 'price 20 should not be allowed';

    q = new Query("-bar");
    var obj:Dynamic = q.toObject();
    var ok = q.qualify("foo");
    if( !ok ) throw 'node should be allowed';
    var ok = !q.qualify("bar");
    if( !ok ) throw 'bar should not be allowed';

    q = new Query("title:*");
    var obj:Dynamic = q.toObject();
    var ok = !q.qualify("foo");
    if( !ok ) throw 'node should not be allowed';
    q.test("foo","bar");
    var ok = !q.qualify("foo");
    if( !ok ) throw 'node should not be allowed';
    q.test("title","bar");
    var ok = q.qualify("foo");
    if( !ok ) throw 'node should be allowed';

    q = new Query("-bar +bar");
    var obj:Dynamic = q.toObject();
    var ok = q.qualify("foo");
    if( !ok ) throw 'node should be allowed';
    var ok = q.qualify("bar");
    if( !ok ) throw 'bar should be allowed';

    q = new Query("?discount");
    var obj:Dynamic = q.toObject();
    q.test("?discount","-foo");
    var ok = !q.qualify("foo");
    if( !ok ) throw 'foo should not be allowed';

    q = new Query("?");
    q.test("?","-foo");
    var ok = !q.qualify("foo");
    if( !ok ) throw 'foo should not be allowed';

    q = new Query("?");
    var ok = q.qualify("foo");
    if( !ok ) throw 'foo should not be allowed';

    q = new Query("?discount");
    q.test("?discount","-foo");
    var ok = !q.qualify("foo");
    if( !ok ) throw 'foo should not be allowed';

    q = new Query("?discount +foo");
    var obj:Dynamic = q.toObject();
    q.test("?discount","-foo");
    var ok = !q.qualify("foo");
    if( !ok ) throw 'foo should not be allowed';
    var ok = !q.qualify("foo");
    if( !ok ) throw 'foo should not be allowed';

    trace("all tests passed");
  }
}
