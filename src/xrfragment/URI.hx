package xrfragment;

import xrfragment.Parser;

@:expose                                                                   // <- makes the class reachable from plain JavaScript
@:keep                                                                     // <- avoids accidental removal by dead code elimination
                                                                           //  
                                                                           //  example URI: `://domain.com/some3d.asset#pos=1,0,0&prio=-5
class URI {
    @:keep                                                                 //  # URI parser
    public static function parse(qs:String):haxe.DynamicAccess<Dynamic> {  //  
      var fragment:Array<String>    = qs.split("#");                       //  > icanhazcode? yes, see [URI.hx](./../src/xrfragment/URI.hx)
      var splitArray:Array<String>  = fragment[1].split('&');              //  
      var resultMap:haxe.DynamicAccess<Dynamic> = {};                      //  1. fragment URI starts with `#`
        for (i in 0...splitArray.length) {                                 //  1. fragments are split by `&`

        var splitByEqual = splitArray[i].split('=');                       //  1. `=` is used to split fragment key/values 
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
