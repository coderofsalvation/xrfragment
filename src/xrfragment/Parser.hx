package xrfragment;

import xrfragment.XRF;

@:expose                                                                   // <- makes the class reachable from plain JavaScript
@:keep                                                                     // <- avoids accidental removal by dead code elimination
class Parser {
    public static var error:String = "";
    public static var debug:Bool = false;

    @:keep
    public static function parse(key:String,value:String,resultMap:haxe.DynamicAccess<Dynamic>):Bool {

      // here we define allowed characteristics & datatypes for each fragment (stored as bitmasked int for performance purposes)
      var Frag:Map<String, Int> = new Map<String, Int>();

      // category: asset loading linking 
      Frag.set("prio",          XRF.ASSET | XRF.T_INT             );
      Frag.set("#",             XRF.ASSET | XRF.T_PREDEFINED_VIEW );
      Frag.set("class",         XRF.ASSET | XRF.T_STRING          );
      Frag.set("src",           XRF.ASSET | XRF.T_URL             );

      // category: href navigation / portals / teleporting
      Frag.set("pos",           XRF.PV_OVERRIDE | XRF.ROUNDROBIN | XRF.T_VECTOR3 | XRF.T_STRING_OBJ | XRF.EMBEDDED | XRF.NAVIGATOR );
      Frag.set("href",          XRF.ASSET | XRF.T_URL | XRF.T_PREDEFINED_VIEW                  );

      // category: query selector / object manipulation
      Frag.set("q",             XRF.PV_OVERRIDE | XRF.T_STRING | XRF.EMBEDDED                   );
      Frag.set("scale",         XRF.QUERY_OPERATOR | XRF.PV_OVERRIDE | XRF.ROUNDROBIN | XRF.T_VECTOR3 | XRF.EMBEDDED );
      Frag.set("rot",           XRF.QUERY_OPERATOR | XRF.PV_OVERRIDE | XRF.ROUNDROBIN | XRF.T_VECTOR3 | XRF.EMBEDDED | XRF.NAVIGATOR );
      Frag.set("translate",     XRF.QUERY_OPERATOR | XRF.PV_OVERRIDE | XRF.ROUNDROBIN | XRF.T_VECTOR3 | XRF.EMBEDDED );
      Frag.set("visible",       XRF.QUERY_OPERATOR | XRF.PV_OVERRIDE | XRF.ROUNDROBIN | XRF.T_INT     | XRF.EMBEDDED );
      Frag.set("env",           XRF.ASSET | XRF.PV_OVERRIDE | XRF.T_STRING | XRF.EMBEDDED );

      // category: animation
      Frag.set("t",             XRF.ASSET | XRF.PV_OVERRIDE | XRF.ROUNDROBIN | XRF.T_VECTOR2 | XRF.NAVIGATOR | XRF.EMBEDDED);
      Frag.set("gravity",       XRF.ASSET | XRF.PV_OVERRIDE | XRF.T_VECTOR3 | XRF.EMBEDDED );
      Frag.set("physics",       XRF.ASSET | XRF.PV_OVERRIDE | XRF.T_VECTOR3 | XRF.EMBEDDED );

      // category: device / viewport settings
      Frag.set("fov",           XRF.ASSET | XRF.PV_OVERRIDE | XRF.T_INT     | XRF.NAVIGATOR | XRF.EMBEDDED );
      Frag.set("clip",          XRF.ASSET | XRF.PV_OVERRIDE | XRF.T_VECTOR2 | XRF.NAVIGATOR | XRF.EMBEDDED );
      Frag.set("fog",           XRF.ASSET | XRF.PV_OVERRIDE | XRF.T_STRING  | XRF.NAVIGATOR | XRF.EMBEDDED );

      // category: author / metadata
      Frag.set("namespace",     XRF.ASSET | XRF.T_STRING                                  );
      Frag.set("SPDX",          XRF.ASSET | XRF.T_STRING                                  );
      Frag.set("unit",          XRF.ASSET | XRF.T_STRING                                  );
      Frag.set("description",   XRF.ASSET | XRF.T_STRING                                  );

      // category: multiparty
      Frag.set("session",   XRF.ASSET | XRF.T_URL | XRF.PV_OVERRIDE | XRF.NAVIGATOR | XRF.EMBEDDED | XRF.PROMPT );

      /**
       * # XR Fragments parser
       *
       * > icanhazcode? yes, see [Parser.hx](https://github.com/coderofsalvation/xrfragment/blob/main/src/xrfragment/Parser.hx)
       * the gist of it:
       */

			// dynamic fragments cases: predefined views & assign/binds
			if( value.length == 0 && !Frag.exists(key) ){
				resultMap.set(key, new XRF(key, XRF.PV_EXECUTE | XRF.NAVIGATOR ) );
				return true;
			}
			if( key.split(".").length > 1 && value.split(".").length > 1 ){
				resultMap.set(key, new XRF(key, XRF.ASSET | XRF.PV_OVERRIDE | XRF.T_STRING | XRF.PROP_BIND ) );
				return true;
			}

			// regular fragments:
      if( Frag.exists(key) ){                                              //  1. check if param exist
        var v:XRF = new XRF(key, Frag.get(key));
        if( !v.validate(value) ){
          trace("⚠ fragment '"+key+"' has incompatible value ("+value+")");
          return false;
        }
        if( debug ) trace("✔ "+key+": "+v.string);
        resultMap.set(key, v );
      }

      return true;
    }

}


/// # Tests
///  
/// the spec is tested with [JSON unittests](./../src/spec) consumed by [Test.hx](./../src/Test.hx) to cross-test all languages.
