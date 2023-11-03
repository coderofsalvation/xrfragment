<?php
/**
 */

namespace xrfragment;

use \php\Boot;
use \php\_Boot\HxString;

class XRF {
	/**
	 * @var int
	 */
	static public $ASSET = 1;
	/**
	 * @var int
	 */
	static public $EMBEDDED = 64;
	/**
	 * @var int
	 */
	static public $NAVIGATOR = 32;
	/**
	 * @var int
	 */
	static public $PROMPT = 8;
	/**
	 * @var int
	 */
	static public $PROP_BIND = 2;
	/**
	 * @var int
	 */
	static public $PV_EXECUTE = 256;
	/**
	 * @var int
	 */
	static public $PV_OVERRIDE = 128;
	/**
	 * @var int
	 */
	static public $QUERY_OPERATOR = 4;
	/**
	 * @var int
	 */
	static public $ROUNDROBIN = 16;
	/**
	 * @var int
	 */
	static public $T_COLOR = 8192;
	/**
	 * @var int
	 */
	static public $T_FLOAT = 32768;
	/**
	 * @var int
	 */
	static public $T_INT = 16384;
	/**
	 * @var int
	 */
	static public $T_PREDEFINED_VIEW = 524288;
	/**
	 * @var int
	 */
	static public $T_STRING = 1048576;
	/**
	 * @var int
	 */
	static public $T_STRING_OBJ = 2097152;
	/**
	 * @var int
	 */
	static public $T_STRING_OBJ_PROP = 4194304;
	/**
	 * @var int
	 */
	static public $T_URL = 262144;
	/**
	 * @var int
	 */
	static public $T_VECTOR2 = 65536;
	/**
	 * @var int
	 */
	static public $T_VECTOR3 = 131072;
	/**
	 * @var \EReg
	 */
	static public $isColor;
	/**
	 * @var \EReg
	 */
	static public $isFloat;
	/**
	 * @var \EReg
	 */
	static public $isInt;
	/**
	 * @var \EReg
	 */
	static public $isString;
	/**
	 * @var \EReg
	 */
	static public $isUrl;
	/**
	 * @var \EReg
	 */
	static public $isUrlOrPretypedView;
	/**
	 * @var \EReg
	 */
	static public $isVector;

	/**
	 * @var XRF[]|\Array_hx
	 */
	public $args;
	/**
	 * @var string
	 */
	public $color;
	/**
	 * @var int
	 */
	public $flags;
	/**
	 * @var float
	 */
	public $float;
	/**
	 * @var string
	 */
	public $fragment;
	/**
	 * @var int
	 */
	public $int;
	/**
	 * @var Query
	 */
	public $query;
	/**
	 * @var string
	 */
	public $string;
	/**
	 * @var float
	 */
	public $x;
	/**
	 * @var float
	 */
	public $y;
	/**
	 * @var float
	 */
	public $z;

	/**
	 * @param int $flag
	 * @param int $flags
	 * 
	 * @return int
	 */
	public static function set ($flag, $flags) {
		#src/xrfragment/XRF.hx:70: characters 5-24
		return $flags | $flag;
	}

	/**
	 * @param int $flag
	 * @param int $flags
	 * 
	 * @return int
	 */
	public static function unset ($flag, $flags) {
		#src/xrfragment/XRF.hx:74: characters 5-25
		return $flags & ~$flag;
	}

	/**
	 * @param string $_fragment
	 * @param int $_flags
	 * 
	 * @return void
	 */
	public function __construct ($_fragment, $_flags) {
		#src/xrfragment/XRF.hx:61: characters 5-25
		$this->fragment = $_fragment;
		#src/xrfragment/XRF.hx:62: characters 5-22
		$this->flags = $_flags;
	}

	/**
	 * @param XRF $v
	 * @param string $str
	 * 
	 * @return void
	 */
	public function guessType ($v, $str) {
		#src/xrfragment/XRF.hx:103: characters 5-19
		$v->string = $str;
		#src/xrfragment/XRF.hx:104: lines 104-109
		if (HxString::split($str, ",")->length > 1) {
			#src/xrfragment/XRF.hx:105: characters 7-46
			$xyz = HxString::split($str, ",");
			#src/xrfragment/XRF.hx:106: characters 7-56
			if ($xyz->length > 0) {
				#src/xrfragment/XRF.hx:106: characters 28-56
				$v->x = \Std::parseFloat(($xyz->arr[0] ?? null));
			}
			#src/xrfragment/XRF.hx:107: characters 7-56
			if ($xyz->length > 1) {
				#src/xrfragment/XRF.hx:107: characters 28-56
				$v->y = \Std::parseFloat(($xyz->arr[1] ?? null));
			}
			#src/xrfragment/XRF.hx:108: characters 7-56
			if ($xyz->length > 2) {
				#src/xrfragment/XRF.hx:108: characters 28-56
				$v->z = \Std::parseFloat(($xyz->arr[2] ?? null));
			}
		}
		#src/xrfragment/XRF.hx:111: characters 5-43
		if (XRF::$isColor->match($str)) {
			#src/xrfragment/XRF.hx:111: characters 30-43
			$v->color = $str;
		}
		#src/xrfragment/XRF.hx:112: characters 5-59
		if (XRF::$isFloat->match($str)) {
			#src/xrfragment/XRF.hx:112: characters 30-59
			$v->float = \Std::parseFloat($str);
		}
		#src/xrfragment/XRF.hx:113: characters 5-57
		if (XRF::$isInt->match($str)) {
			#src/xrfragment/XRF.hx:113: characters 30-57
			$v->int = \Std::parseInt($str);
		}
	}

	/**
	 * @param int $flag
	 * 
	 * @return bool
	 */
	public function is ($flag) {
		#src/xrfragment/XRF.hx:66: characters 5-31
		return ($this->flags & $flag) !== 0;
	}

	/**
	 * @param string $value
	 * 
	 * @return bool
	 */
	public function validate ($value) {
		#src/xrfragment/XRF.hx:78: characters 5-27
		$this->guessType($this, $value);
		#src/xrfragment/XRF.hx:80: lines 80-88
		if (HxString::split($value, "|")->length > 1) {
			#src/xrfragment/XRF.hx:81: characters 7-35
			$this->args = new \Array_hx();
			#src/xrfragment/XRF.hx:82: characters 7-49
			$args = HxString::split($value, "|");
			#src/xrfragment/XRF.hx:83: characters 17-21
			$_g = 0;
			#src/xrfragment/XRF.hx:83: characters 21-32
			$_g1 = $args->length;
			#src/xrfragment/XRF.hx:83: lines 83-87
			while ($_g < $_g1) {
				#src/xrfragment/XRF.hx:83: characters 17-32
				$i = $_g++;
				#src/xrfragment/XRF.hx:84: characters 9-45
				$x = new XRF($this->fragment, $this->flags);
				#src/xrfragment/XRF.hx:85: characters 9-30
				$this->guessType($x, ($args->arr[$i] ?? null));
				#src/xrfragment/XRF.hx:86: characters 9-28
				$_this = $this->args;
				$_this->arr[$_this->length++] = $x;
			}
		}
		#src/xrfragment/XRF.hx:90: characters 5-59
		if ($this->fragment === "q") {
			#src/xrfragment/XRF.hx:90: characters 27-59
			$this->query = (new Query($value))->get();
		}
		#src/xrfragment/XRF.hx:92: characters 5-24
		$ok = true;
		#src/xrfragment/XRF.hx:93: lines 93-97
		if (!($this->args instanceof \Array_hx)) {
			#src/xrfragment/XRF.hx:94: characters 7-115
			if ($this->is(XRF::$T_VECTOR3) && !((is_float($this->x) || is_int($this->x)) && (is_float($this->y) || is_int($this->y)) && (is_float($this->z) || is_int($this->z)))) {
				#src/xrfragment/XRF.hx:94: characters 105-115
				$ok = false;
			}
			#src/xrfragment/XRF.hx:95: characters 7-115
			if ($this->is(XRF::$T_VECTOR2) && !((is_float($this->x) || is_int($this->x)) && (is_float($this->y) || is_int($this->y)))) {
				#src/xrfragment/XRF.hx:95: characters 105-115
				$ok = false;
			}
			#src/xrfragment/XRF.hx:96: characters 7-63
			if ($this->is(XRF::$T_INT) && !Boot::isOfType($this->int, Boot::getClass('Int'))) {
				#src/xrfragment/XRF.hx:96: characters 53-63
				$ok = false;
			}
		}
		#src/xrfragment/XRF.hx:98: characters 5-14
		return $ok;
	}

	/**
	 * @internal
	 * @access private
	 */
	static public function __hx__init ()
	{
		static $called = false;
		if ($called) return;
		$called = true;


		self::$isColor = new \EReg("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\$", "");
		self::$isInt = new \EReg("^[0-9]+\$", "");
		self::$isFloat = new \EReg("^[0-9]+\\.[0-9]+\$", "");
		self::$isVector = new \EReg("([,]+|\\w)", "");
		self::$isUrl = new \EReg("(://)?\\..*", "");
		self::$isUrlOrPretypedView = new \EReg("(^#|://)?\\..*", "");
		self::$isString = new \EReg(".*", "");
	}
}

Boot::registerClass(XRF::class, 'xrfragment.XRF');
XRF::__hx__init();
