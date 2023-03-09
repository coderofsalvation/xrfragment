package xrfragment;

class Url {

    private static var map:Map<String, String>;

    private static function parseQueryMap(qs:String):Map<String, String> {
        var splitArray:Array<String>  = qs.split('&');
        var regexPlus  = ~/\+/g;  // Regex for replacing addition symbol with a space
        var resultMap = new Map<String,String>();
        for (i in 0...splitArray.length) {
            var splitByEqual = splitArray[i].split('=');
            var key:String = splitByEqual[0];

            if (splitByEqual.length == 1) {
                // ..&a=&b.. (right side blank)
                resultMap.set(key, "");
            } else {
                var value:String = StringTools.urlDecode(regexPlus.split(splitByEqual[1]).join(" "));
                resultMap.set(key, value);
            }
        }
        return resultMap;
    }

}
