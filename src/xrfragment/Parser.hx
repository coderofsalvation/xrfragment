// SPDX-License-Identifier: MPL-2.0        
// Copyright (c) 2023 Leon van Kammen/NLNET 
package xrfragment;

import xrfragment.XRF;

@:expose                                                                   // <- makes the class reachable from plain JavaScript
@:keep                                                                     // <- avoids accidental removal by dead code elimination
class Parser {
    public static var error:String  = "";
    public static var debug:Bool    = false;

    @:keep
    public static function parse(key:String,value:String,store:haxe.DynamicAccess<Dynamic>,?index:Int):Bool {
      // here we define allowed characteristics & datatypes for each fragment (stored as bitmasked int for performance purposes)
      var Frag:Map<String, Int> = new Map<String, Int>();

      Frag.set("#",             XRF.ASSET | XRF.T_PREDEFINED_VIEW | XRF.PV_EXECUTE );
      Frag.set("src",           XRF.ASSET | XRF.T_URL             );
      Frag.set("href",          XRF.ASSET | XRF.T_URL | XRF.T_PREDEFINED_VIEW                  );
      Frag.set("tag",           XRF.ASSET | XRF.T_STRING          );

      // spatial category: query selector / object manipulation
      Frag.set("pos",           XRF.PV_OVERRIDE    | XRF.T_VECTOR3 | XRF.T_STRING | XRF.METADATA | XRF.NAVIGATOR );
      Frag.set("rot",           XRF.QUERY_OPERATOR | XRF.PV_OVERRIDE  | XRF.T_VECTOR3 | XRF.METADATA | XRF.NAVIGATOR );

      // category: media fragments
      Frag.set("t",             XRF.ASSET | XRF.PV_OVERRIDE | XRF.T_FLOAT | XRF.T_VECTOR2 | XRF.T_MEDIAFRAG  | XRF.NAVIGATOR | XRF.METADATA);
      Frag.set("xywh",          XRF.ASSET | XRF.PV_OVERRIDE | XRF.T_FLOAT | XRF.T_VECTOR2 | XRF.T_MEDIAFRAG  | XRF.NAVIGATOR | XRF.METADATA);

      // category: author / metadata
      Frag.set("namespace",     XRF.ASSET | XRF.T_STRING                                  );
      Frag.set("SPDX",          XRF.ASSET | XRF.T_STRING                                  );
      Frag.set("unit",          XRF.ASSET | XRF.T_STRING                                  );
      Frag.set("description",   XRF.ASSET | XRF.T_STRING                                  );

      // category: multiparty
      Frag.set("session",       XRF.ASSET | XRF.T_URL | XRF.PV_OVERRIDE | XRF.NAVIGATOR | XRF.METADATA | XRF.PROMPT );

      /**
       * # Spec 
       *
       * > version 1.0.0 [![Actions Status](https://github.com/coderofsalvation/xrfragment/workflows/test/badge.svg)](https://github.com/coderofsalvation/xrfragment/actions) generated by `make doc` @ $(date +"%Y-%m-%dT%H:%M:%S%z")
       * 
       * In case your programming language has no parser ([check here](https://github.com/coderofsalvation/xrfragment/tree/main/dist)) you can [crosscompile it](https://github.com/coderofsalvation/xrfragment/blob/main/build.hxml), or roll your own `Parser.parse(k,v,store)` using the spec:
       */

      //  1. requirement: receive arguments: key (string), value (string), store (writable associative array/object)

      var keyStripped:String = XRF.operators.replace( key, '' );

			// dynamic fragments cases: predefined views & assign/binds
      var isPVDynamic:Bool = key.length > 0 && !Frag.exists(key);
      var isPVDefault:Bool = value.length == 0 && key.length > 0 && key == "#";
			if( isPVDynamic ){ //|| isPVDefault ){      //  1. add keys without values to store as [predefined view](predefined_view)
				var v:XRF  = new XRF(key, XRF.PV_EXECUTE | XRF.NAVIGATOR, index );
        v.validate(value); // ignore failures (empty values are allowed)
        v.flags = XRF.set( XRF.T_DYNAMIC, v.flags );
				store.set( keyStripped, v );
				return true;
			}

			// regular fragments:
      var v:XRF = new XRF(key, Frag.get(key), index);
      if( Frag.exists(key) ){                                              //  1. check if fragment is official XR Fragment
        if( !v.validate(value) ){                                          //  1. guess the type of the value (string,int,float,x,y,z,color,args,query)
          trace("⚠ fragment '"+key+"' has incompatible value ("+value+")");//  1. don't add to store if value-type is incorrect
          return false;
        }
        store.set( keyStripped, v);                                                //  1. if valid, add to store
        if( debug ) trace("✔ "+key+": "+v.string);
      }else{                                                               //  1. expose (but mark) non-offical fragments too 
        if( Std.isOfType(value, String) ) v.guessType(v,value);
        v.noXRF = true;
        store.set( keyStripped ,v);
      }
      return true;
    }

}

/**
 * > icanhazcode? yes, see [Parser.hx](https://github.com/coderofsalvation/xrfragment/blob/main/src/xrfragment/Parser.hx)
 *
 * # Tests
 *   
 * the spec is tested with [JSON unittests](./../src/spec) consumed by [Test.hx](./../src/Test.hx) to cross-test all languages.
 */

