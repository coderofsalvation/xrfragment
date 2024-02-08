// SPDX-License-Identifier: MPL-2.0        
// Copyright (c) 2023 Leon van Kammen/NLNET 
package xrfragment;

import xrfragment.Parser;
import xrfragment.XRF;

/**
 * # Spec
 *
 * > version 1.0.0 [![Actions Status](https://github.com/coderofsalvation/xrfragment/workflows/test/badge.svg)](https://github.com/coderofsalvation/xrfragment/actions) generated by `make doc` @ $(date +"%Y-%m-%dT%H:%M:%S%z")
 * 
 * ### XR Fragment URI Grammar 
 *
 * ```
 *     reserved    = gen-delims / sub-delims
 *     gen-delims  = "#" / "&"                      
 *     sub-delims  = "," /  "="
 * ```
 *
 * In case your programming language has no parser ([check here](https://github.com/coderofsalvation/xrfragment/tree/main/dist)) you can [crosscompile it](https://github.com/coderofsalvation/xrfragment/blob/main/build.hxml), or roll your own `Parser.parse(k,v,store)` using the spec:
 *
 */

@:expose                                                                   // <- makes the class reachable from plain JavaScript
@:keep                                                                     // <- avoids accidental removal by dead code elimination
class URI {
    @:keep
    public static function parse(url:String,filter:Int):haxe.DynamicAccess<Dynamic> {
      var store:haxe.DynamicAccess<Dynamic> = {};                          //  1. store key/values into a associative array or dynamic object
      if( url == null || url.indexOf("#") == -1 ) return store;
      var fragment:Array<String>    = url.split("#");                      //  1. fragment URI starts with `#`
      var splitArray:Array<String>  = fragment[1].split('&');              //  1. fragments are split by `&`
      for (i in 0...splitArray.length) {                                   //  1. loop thru each fragment

        var splitByEqual = splitArray[i].split('=');                       //  1. for each fragment split on `=` to separate key/values 
        var regexPlus  = ~/\+/g;                                           //  1. fragment-values are urlencoded (space becomes `+` using `encodeUriComponent` e.g.)
        var key:String = splitByEqual[0];
				var value:String = "";
        if (splitByEqual.length > 1) {
          value = StringTools.urlDecode(regexPlus.split(splitByEqual[1]).join(" "));
        }
				var ok:Bool = Parser.parse(key,value,store,i);                     //  1. for every recognized fragment key/value-pair call [Parser.parse](#%E2%86%AA%20Parser.parse%28k%2Cv%2Cstore%29)
      }
      if( filter != null && filter != 0 ){
        for (key in store.keys()) {
            var xrf:XRF = store.get(key);
            if( !xrf.is( filter ) ){ 
							store.remove(key);
						}
        }
      }
      return store;
    }

    @keep
    public static function template(uri:String, vars:Dynamic):String {
      var parts = uri.split("#");
      if( parts.length == 1 ) return uri; // we only do level1 fragment expansion
      var frag  = parts[1];
      frag = StringTools.replace(frag,"{","::");
      frag = StringTools.replace(frag,"}","::");
      frag = new haxe.Template(frag).execute(vars);
      frag = StringTools.replace(frag,"null",""); // *TODO* needs regex to check for [#&]null[&]
      parts[1] = frag;
      return parts.join("#");
    }
}

/**
 * > icanhazcode? yes, see [URI.hx](https://github.com/coderofsalvation/xrfragment/blob/main/src/xrfragment/URI.hx)
 *
 * # Tests
 *   
 * the spec is tested with [JSON unittests](./../src/spec) consumed by [Test.hx](./../src/Test.hx) to cross-test all languages.
 */
