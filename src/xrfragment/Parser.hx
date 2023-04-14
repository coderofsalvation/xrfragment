package xrfragment;

import xrfragment.XRF;

@:expose                                                                   // <- makes the class reachable from plain JavaScript
@:keep                                                                     // <- avoids accidental removal by dead code elimination
class Parser {
    public static var error:String = "";

    @:keep
    public static function parse(key:String,value:String,resultMap:haxe.DynamicAccess<Dynamic>):Bool {

      // here we define allowed characteristics & datatypes for each fragment (stored as bitmasked int for performance purposes)
      var Frag:Map<String, Int> = new Map<String, Int>();

      // category: asset loading linking 
      Frag.set("prio",          XRF.ASSET_OBJ | XRF.T_INT             );
      Frag.set("#",             XRF.ASSET     | XRF.T_PREDEFINED_VIEW );
      Frag.set("class",         XRF.ASSET_OBJ | XRF.T_STRING          );
      Frag.set("src",           XRF.ASSET_OBJ | XRF.T_URL             );
      Frag.set("src_audio",     XRF.ASSET_OBJ | XRF.T_URL             );
      Frag.set("src_shader",    XRF.ASSET_OBJ | XRF.T_URL             );
      Frag.set("src_env",       XRF.ASSET     | XRF.T_URL             );
      Frag.set("src_env_audio", XRF.ASSET     | XRF.T_URL             );

      // category: href navigation / portals / teleporting
      Frag.set("pos",           XRF.PV_OVERRIDE | XRF.ROUNDROBIN | XRF.T_VECTOR3 | XRF.T_STRING_OBJ   );
      Frag.set("href",          XRF.ASSET_OBJ | XRF.T_URL | XRF.T_PREDEFINED_VIEW                  );

      // category: query selector | object manipulation
      Frag.set("q",             XRF.PV_OVERRIDE | XRF.T_STRING                                        );
      Frag.set("scale",         XRF.QUERY_OPERATOR | XRF.PV_OVERRIDE | XRF.ROUNDROBIN | XRF.T_INT     );
      Frag.set("rot",           XRF.QUERY_OPERATOR | XRF.PV_OVERRIDE | XRF.ROUNDROBIN | XRF.T_VECTOR3 );
      Frag.set("translate",     XRF.QUERY_OPERATOR | XRF.PV_OVERRIDE | XRF.ROUNDROBIN | XRF.T_VECTOR3 );
      Frag.set("visible",       XRF.QUERY_OPERATOR | XRF.PV_OVERRIDE | XRF.ROUNDROBIN | XRF.T_INT     );

      // category: animation
      Frag.set("t",             XRF.ASSET | XRF.PV_OVERRIDE | XRF.ROUNDROBIN | XRF.T_VECTOR2 | XRF.BROWSER_OVERRIDE );
      Frag.set("gravity",       XRF.ASSET | XRF.PV_OVERRIDE | XRF.T_VECTOR3                  );
      Frag.set("physics",       XRF.ASSET | XRF.PV_OVERRIDE | XRF.T_VECTOR3                  );
      Frag.set("scroll",        XRF.ASSET | XRF.PV_OVERRIDE | XRF.T_STRING                   );

      // category: device / viewport settings
      Frag.set("fov",           XRF.ASSET | XRF.PV_OVERRIDE | XRF.T_INT     | XRF.BROWSER_OVERRIDE );
      Frag.set("clip",          XRF.ASSET | XRF.PV_OVERRIDE | XRF.T_VECTOR2 | XRF.BROWSER_OVERRIDE );
      Frag.set("fog",           XRF.ASSET | XRF.PV_OVERRIDE | XRF.T_STRING  | XRF.BROWSER_OVERRIDE );

      // category: author / metadata
      Frag.set("namespace",     XRF.ASSET | XRF.T_STRING                                  );
      Frag.set("SPFX",          XRF.ASSET | XRF.T_STRING                                  );
      Frag.set("unit",          XRF.ASSET | XRF.T_STRING                                  );
      Frag.set("description",   XRF.ASSET | XRF.T_STRING                                  );

      // category: multiparty
      Frag.set("src_session",   XRF.ASSET | XRF.T_URL | XRF.PV_OVERRIDE | XRF.BROWSER_OVERRIDE | XRF.PROMPT );

      /**
       * # XR Fragments parser
       *
       * > icanhazcode? yes, see [Parser.hx](https://github.com/coderofsalvation/xrfragment/blob/main/src/xrfragment/Parser.hx)
       * the gist of it:
       */
			if( value.length == 0 && !Frag.exists(key) ){
				resultMap.set(key, new XRF(key, XRF.PV_EXECUTE ) );
				return true;
			}
      if( Frag.exists(key) ){                                              //  1. check if param exist
        var v:XRF = new XRF(key, Frag.get(key));
        if( !v.validate(value) ){
          trace("[ i ] fragment '"+key+"' has incompatible value ("+value+")");
          return false;
        }
        resultMap.set(key, v );
      }else{ trace("[ i ] fragment '"+key+"' does not exist or has no type typed (yet)"); return false; }

      return true;
    }

}


/// # Tests
///  
/// the spec is tested with [JSON unittests](./../src/spec) consumed by [Test.hx](./../src/Test.hx) to cross-test all languages.
