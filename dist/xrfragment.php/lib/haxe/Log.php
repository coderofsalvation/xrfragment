<?php
/**
 */

namespace haxe;

use \php\Boot;

/**
 * Log primarily provides the `trace()` method, which is invoked upon a call to
 * `trace()` in Haxe code.
 */
class Log {
	/**
	 * @var \Closure
	 * Outputs `v` in a platform-dependent way.
	 * The second parameter `infos` is injected by the compiler and contains
	 * information about the position where the `trace()` call was made.
	 * This method can be rebound to a custom function:
	 * var oldTrace = haxe.Log.trace; // store old function
	 * haxe.Log.trace = function(v, ?infos) {
	 * // handle trace
	 * }
	 * ...
	 * haxe.Log.trace = oldTrace;
	 * If it is bound to null, subsequent calls to `trace()` will cause an
	 * exception.
	 */
	static public $trace;

	/**
	 * Format the output of `trace` before printing it.
	 * 
	 * @param mixed $v
	 * @param object $infos
	 * 
	 * @return string
	 */
	public static function formatOutput ($v, $infos) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/haxe/Log.hx:34: characters 3-27
		$str = \Std::string($v);
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/haxe/Log.hx:35: lines 35-36
		if ($infos === null) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/haxe/Log.hx:36: characters 4-14
			return $str;
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/haxe/Log.hx:37: characters 3-54
		$pstr = ($infos->fileName??'null') . ":" . ($infos->lineNumber??'null');
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/haxe/Log.hx:38: lines 38-40
		if ($infos->customParams !== null) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/haxe/Log.hx:39: lines 39-40
			$_g = 0;
			$_g1 = $infos->customParams;
			while ($_g < $_g1->length) {
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/haxe/Log.hx:39: characters 9-10
				$v = ($_g1->arr[$_g] ?? null);
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/haxe/Log.hx:39: lines 39-40
				++$_g;
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/haxe/Log.hx:40: characters 5-32
				$str = ($str??'null') . ", " . \Std::string($v);
			}
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/haxe/Log.hx:41: characters 3-27
		return ($pstr??'null') . ": " . ($str??'null');
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


		self::$trace = function ($v, $infos = null) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/haxe/Log.hx:63: characters 3-36
			$str = Log::formatOutput($v, $infos);
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/haxe/Log.hx:70: characters 3-19
			echo(\Std::string($str) . \PHP_EOL);
		};
	}
}

Boot::registerClass(Log::class, 'haxe.Log');
Log::__hx__init();
