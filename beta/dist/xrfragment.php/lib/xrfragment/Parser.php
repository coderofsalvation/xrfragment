<?php
/**
 */

namespace xrfragment;

use \php\_Boot\HxAnon;
use \php\Boot;
use \haxe\Log;
use \php\_Boot\HxString;

class Parser {
	/**
	 * @var bool
	 */
	static public $debug = false;
	/**
	 * @var string
	 */
	static public $error = "";

	/**
	 * @param string $key
	 * @param string $value
	 * @param mixed $store
	 * 
	 * @return bool
	 */
	public static function parse ($key, $value, $store) {
		#src/xrfragment/Parser.hx:17: characters 35-57
		$this1 = [];
		$Frag_data = $this1;
		#src/xrfragment/Parser.hx:20: characters 7-68
		$Frag_data["prio"] = XRF::$ASSET | XRF::$T_INT;
		#src/xrfragment/Parser.hx:21: characters 7-68
		$Frag_data["#"] = XRF::$ASSET | XRF::$T_PREDEFINED_VIEW;
		#src/xrfragment/Parser.hx:22: characters 7-68
		$Frag_data["class"] = XRF::$ASSET | XRF::$T_STRING;
		#src/xrfragment/Parser.hx:23: characters 7-68
		$Frag_data["src"] = XRF::$ASSET | XRF::$T_URL;
		#src/xrfragment/Parser.hx:26: characters 7-133
		$Frag_data["pos"] = XRF::$PV_OVERRIDE | XRF::$ROUNDROBIN | XRF::$T_VECTOR3 | XRF::$T_STRING_OBJ | XRF::$EMBEDDED | XRF::$NAVIGATOR;
		#src/xrfragment/Parser.hx:27: characters 7-97
		$Frag_data["href"] = XRF::$ASSET | XRF::$T_URL | XRF::$T_PREDEFINED_VIEW;
		#src/xrfragment/Parser.hx:30: characters 7-98
		$Frag_data["q"] = XRF::$PV_OVERRIDE | XRF::$T_STRING | XRF::$EMBEDDED;
		#src/xrfragment/Parser.hx:31: characters 7-119
		$Frag_data["scale"] = XRF::$QUERY_OPERATOR | XRF::$PV_OVERRIDE | XRF::$ROUNDROBIN | XRF::$T_VECTOR3 | XRF::$EMBEDDED;
		#src/xrfragment/Parser.hx:32: characters 7-135
		$Frag_data["rot"] = XRF::$QUERY_OPERATOR | XRF::$PV_OVERRIDE | XRF::$ROUNDROBIN | XRF::$T_VECTOR3 | XRF::$EMBEDDED | XRF::$NAVIGATOR;
		#src/xrfragment/Parser.hx:33: characters 7-119
		$Frag_data["translate"] = XRF::$QUERY_OPERATOR | XRF::$PV_OVERRIDE | XRF::$ROUNDROBIN | XRF::$T_VECTOR3 | XRF::$EMBEDDED;
		#src/xrfragment/Parser.hx:34: characters 7-119
		$Frag_data["visible"] = XRF::$QUERY_OPERATOR | XRF::$PV_OVERRIDE | XRF::$ROUNDROBIN | XRF::$T_INT | XRF::$EMBEDDED;
		#src/xrfragment/Parser.hx:35: characters 7-92
		$Frag_data["env"] = XRF::$ASSET | XRF::$PV_OVERRIDE | XRF::$T_STRING | XRF::$EMBEDDED;
		#src/xrfragment/Parser.hx:38: characters 7-125
		$Frag_data["t"] = XRF::$ASSET | XRF::$PV_OVERRIDE | XRF::$ROUNDROBIN | XRF::$T_VECTOR2 | XRF::$NAVIGATOR | XRF::$EMBEDDED;
		#src/xrfragment/Parser.hx:39: characters 7-93
		$Frag_data["gravity"] = XRF::$ASSET | XRF::$PV_OVERRIDE | XRF::$T_VECTOR3 | XRF::$EMBEDDED;
		#src/xrfragment/Parser.hx:40: characters 7-93
		$Frag_data["physics"] = XRF::$ASSET | XRF::$PV_OVERRIDE | XRF::$T_VECTOR3 | XRF::$EMBEDDED;
		#src/xrfragment/Parser.hx:43: characters 7-109
		$Frag_data["fov"] = XRF::$ASSET | XRF::$PV_OVERRIDE | XRF::$T_INT | XRF::$NAVIGATOR | XRF::$EMBEDDED;
		#src/xrfragment/Parser.hx:44: characters 7-109
		$Frag_data["clip"] = XRF::$ASSET | XRF::$PV_OVERRIDE | XRF::$T_VECTOR2 | XRF::$NAVIGATOR | XRF::$EMBEDDED;
		#src/xrfragment/Parser.hx:45: characters 7-109
		$Frag_data["fog"] = XRF::$ASSET | XRF::$PV_OVERRIDE | XRF::$T_STRING | XRF::$NAVIGATOR | XRF::$EMBEDDED;
		#src/xrfragment/Parser.hx:48: characters 7-92
		$Frag_data["namespace"] = XRF::$ASSET | XRF::$T_STRING;
		#src/xrfragment/Parser.hx:49: characters 7-92
		$Frag_data["SPDX"] = XRF::$ASSET | XRF::$T_STRING;
		#src/xrfragment/Parser.hx:50: characters 7-92
		$Frag_data["unit"] = XRF::$ASSET | XRF::$T_STRING;
		#src/xrfragment/Parser.hx:51: characters 7-92
		$Frag_data["description"] = XRF::$ASSET | XRF::$T_STRING;
		#src/xrfragment/Parser.hx:54: characters 7-114
		$Frag_data["session"] = XRF::$ASSET | XRF::$T_URL | XRF::$PV_OVERRIDE | XRF::$NAVIGATOR | XRF::$EMBEDDED | XRF::$PROMPT;
		#src/xrfragment/Parser.hx:67: lines 67-72
		if ((mb_strlen($value) === 0) && (mb_strlen($key) > 0) && !\array_key_exists($key, $Frag_data)) {
			#src/xrfragment/Parser.hx:68: characters 5-64
			$v = new XRF($key, XRF::$PV_EXECUTE | XRF::$NAVIGATOR);
			#src/xrfragment/Parser.hx:69: characters 9-24
			$v->validate($key);
			#src/xrfragment/Parser.hx:70: characters 5-23
			\Reflect::setField($store, $key, $v);
			#src/xrfragment/Parser.hx:71: characters 5-16
			return true;
		}
		#src/xrfragment/Parser.hx:73: lines 73-76
		if ((HxString::split($key, ".")->length > 1) && (HxString::split($value, ".")->length > 1)) {
			#src/xrfragment/Parser.hx:74: characters 5-95
			$value1 = new XRF($key, XRF::$ASSET | XRF::$PV_OVERRIDE | XRF::$T_STRING | XRF::$PROP_BIND);
			\Reflect::setField($store, $key, $value1);
			#src/xrfragment/Parser.hx:75: characters 5-16
			return true;
		}
		#src/xrfragment/Parser.hx:79: characters 7-47
		$v = new XRF($key, ($Frag_data[$key] ?? null));
		#src/xrfragment/Parser.hx:80: lines 80-90
		if (\array_key_exists($key, $Frag_data)) {
			#src/xrfragment/Parser.hx:81: lines 81-84
			if (!$v->validate($value)) {
				#src/xrfragment/Parser.hx:82: characters 11-16
				(Log::$trace)("⚠ fragment '" . ($key??'null') . "' has incompatible value (" . ($value??'null') . ")", new _HxAnon_Parser0("src/xrfragment/Parser.hx", 82, "xrfragment.Parser", "parse"));
				#src/xrfragment/Parser.hx:83: characters 11-23
				return false;
			}
			#src/xrfragment/Parser.hx:85: characters 9-27
			\Reflect::setField($store, $key, $v);
			#src/xrfragment/Parser.hx:86: characters 9-50
			if (Parser::$debug) {
				#src/xrfragment/Parser.hx:86: characters 21-26
				(Log::$trace)("✔ " . ($key??'null') . ": " . ($v->string??'null'), new _HxAnon_Parser0("src/xrfragment/Parser.hx", 86, "xrfragment.Parser", "parse"));
			}
		} else {
			#src/xrfragment/Parser.hx:88: characters 9-63
			if (is_string($value)) {
				#src/xrfragment/Parser.hx:88: characters 43-63
				$v->guessType($v, $value);
			}
			#src/xrfragment/Parser.hx:89: characters 9-29
			\Reflect::setField($store, "_" . ($key??'null'), $v);
		}
		#src/xrfragment/Parser.hx:92: characters 7-18
		return true;
	}
}

class _HxAnon_Parser0 extends HxAnon {
	function __construct($fileName, $lineNumber, $className, $methodName) {
		$this->fileName = $fileName;
		$this->lineNumber = $lineNumber;
		$this->className = $className;
		$this->methodName = $methodName;
	}
}

Boot::registerClass(Parser::class, 'xrfragment.Parser');
