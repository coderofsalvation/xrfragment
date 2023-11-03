<?php
/**
 */

namespace haxe;

use \php\Boot;

/**
 * Base class for exceptions.
 * If this class (or derivatives) is used to catch an exception, then
 * `haxe.CallStack.exceptionStack()` will not return a stack for the exception
 * caught. Use `haxe.Exception.stack` property instead:
 * ```haxe
 * try {
 * throwSomething();
 * } catch(e:Exception) {
 * trace(e.stack);
 * }
 * ```
 * Custom exceptions should extend this class:
 * ```haxe
 * class MyException extends haxe.Exception {}
 * //...
 * throw new MyException('terrible exception');
 * ```
 * `haxe.Exception` is also a wildcard type to catch any exception:
 * ```haxe
 * try {
 * throw 'Catch me!';
 * } catch(e:haxe.Exception) {
 * trace(e.message); // Output: Catch me!
 * }
 * ```
 * To rethrow an exception just throw it again.
 * Haxe will try to rethrow an original native exception whenever possible.
 * ```haxe
 * try {
 * var a:Array<Int> = null;
 * a.push(1); // generates target-specific null-pointer exception
 * } catch(e:haxe.Exception) {
 * throw e; // rethrows native exception instead of haxe.Exception
 * }
 * ```
 */
class Exception extends \Exception {
	/**
	 * @var \Throwable
	 */
	public $__nativeException;
	/**
	 * @var Exception
	 */
	public $__previousException;
	/**
	 * @var int
	 */
	public $__skipStack;

	/**
	 * @param mixed $value
	 * 
	 * @return mixed
	 */
	public static function thrown ($value) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/haxe/Exception.hx:30: lines 30-38
		if (($value instanceof Exception)) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/haxe/Exception.hx:31: characters 4-35
			return $value->get_native();
		} else if (($value instanceof \Throwable)) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/haxe/Exception.hx:33: characters 4-16
			return $value;
		} else {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/haxe/Exception.hx:35: characters 4-38
			$e = new ValueException($value);
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/haxe/Exception.hx:36: characters 4-21
			$e->__skipStack = 1;
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/haxe/Exception.hx:37: characters 4-12
			return $e;
		}
	}

	/**
	 * Create a new Exception instance.
	 * The `previous` argument could be used for exception chaining.
	 * The `native` argument is for internal usage only.
	 * There is no need to provide `native` argument manually and no need to keep it
	 * upon extending `haxe.Exception` unless you know what you're doing.
	 * 
	 * @param string $message
	 * @param Exception $previous
	 * @param mixed $native
	 * 
	 * @return void
	 */
	public function __construct ($message, $previous = null, $native = null) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/haxe/Exception.hx:16: characters 39-40
		$this->__skipStack = 0;
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/haxe/Exception.hx:42: characters 3-30
		parent::__construct($message, 0, $previous);
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/haxe/Exception.hx:43: characters 3-38
		$this->__previousException = $previous;
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/haxe/Exception.hx:44: lines 44-48
		if (($native !== null) && ($native instanceof \Throwable)) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/haxe/Exception.hx:45: characters 4-30
			$this->__nativeException = $native;
		} else {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/haxe/Exception.hx:47: characters 4-33
			$this->__nativeException = $this;
		}
	}

	/**
	 * @return mixed
	 */
	final public function get_native () {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/haxe/Exception.hx:72: characters 3-27
		return $this->__nativeException;
	}
}

Boot::registerClass(Exception::class, 'haxe.Exception');
Boot::registerGetters('haxe\\Exception', [
	'native' => true
]);
