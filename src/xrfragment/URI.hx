package xrfragment;

import xrfragment.Parser;

/**
 * <link rel="stylesheet" href="style.css"/>
 * <link href="https://fonts.cdnfonts.com/css/montserrat" rel="stylesheet"/>
 *
 * > version 1.0.0
 *
 * date: $(date +"%Y-%m-%dT%H:%M:%S%z") (generated by \`./make doc\`)<br>
 * [![Actions Status](https://github.com/coderofsalvation/xrfragment/workflows/test/badge.svg)](https://github.com/coderofsalvation/xrfragment/actions)
 *
 * # `://foo.com/my3d.asset#pos=1,0,0&prio=-5`
 *
 * # URI parser
 * > icanhazcode? yes, see [URI.hx](https://github.com/coderofsalvation/xrfragment/blob/main/src/xrfragment/URI.hx)
 */

@:expose                                                                   // <- makes the class reachable from plain JavaScript
@:keep                                                                     // <- avoids accidental removal by dead code elimination
class URI {
    @:keep
    public static function parse(qs:String):haxe.DynamicAccess<Dynamic> {
      var fragment:Array<String>    = qs.split("#");                       //  1. fragment URI starts with `#`
      var splitArray:Array<String>  = fragment[1].split('&');              //  1. fragments are split by `&`
      var resultMap:haxe.DynamicAccess<Dynamic> = {};                      //  1. store key/values into a associative array or dynamic object
        for (i in 0...splitArray.length) {                                 //  1. loop thru each fragment

        var splitByEqual = splitArray[i].split('=');                       //  1. for each fragment split on `=` to separate key/values 
        var regexPlus  = ~/\+/g;                                           //  1. fragment-values are urlencoded (space becomes `+` using `encodeUriComponent` e.g.)
        var key:String = splitByEqual[0];

        if (splitByEqual.length > 1) {
          var value:String = StringTools.urlDecode(regexPlus.split(splitByEqual[1]).join(" "));
          var ok:Bool = Parser.parse(key,value,resultMap);                 //  1. every recognized fragment key/value-pair is added to a central map/associative array/object
        }
      }
      return resultMap;
    }
}
