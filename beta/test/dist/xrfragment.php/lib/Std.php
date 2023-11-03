<?php
/**
 */

use \php\Boot;
use \php\_Boot\HxString;

/**
 * The Std class provides standard methods for manipulating basic types.
 */
class Std {
	/**
	 * Converts a `String` to a `Float`.
	 * The parsing rules for `parseInt` apply here as well, with the exception of invalid input
	 * resulting in a `NaN` value instead of null.
	 * Additionally, decimal notation may contain a single `.` to denote the start of the fractions.
	 * 
	 * @param string $x
	 * 
	 * @return float
	 */
	public static function parseFloat ($x) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:74: characters 3-35
		$result = floatval($x);
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:75: lines 75-76
		if (!Boot::equal($result, 0)) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:76: characters 4-17
			return $result;
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:78: characters 3-22
		$x = ltrim($x);
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:79: characters 3-53
		$firstCharIndex = (mb_substr($x, 0, 1) === "-" ? 1 : 0);
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:80: characters 3-47
		$charCode = HxString::charCodeAt($x, $firstCharIndex);
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:82: lines 82-84
		if ($charCode === 46) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:83: characters 4-47
			$charCode = HxString::charCodeAt($x, $firstCharIndex + 1);
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:86: lines 86-90
		if (($charCode !== null) && ($charCode >= 48) && ($charCode <= 57)) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:87: characters 4-14
			return 0.0;
		} else {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:89: characters 4-20
			return NAN;
		}
	}

	/**
	 * Converts a `String` to an `Int`.
	 * Leading whitespaces are ignored.
	 * If `x` starts with 0x or 0X, hexadecimal notation is recognized where the following digits may
	 * contain 0-9 and A-F.
	 * Otherwise `x` is read as decimal number with 0-9 being allowed characters. `x` may also start with
	 * a - to denote a negative value.
	 * In decimal mode, parsing continues until an invalid character is detected, in which case the
	 * result up to that point is returned. For hexadecimal notation, the effect of invalid characters
	 * is unspecified.
	 * Leading 0s that are not part of the 0x/0X hexadecimal notation are ignored, which means octal
	 * notation is not supported.
	 * If `x` is null, the result is unspecified.
	 * If `x` cannot be parsed as integer, the result is `null`.
	 * 
	 * @param string $x
	 * 
	 * @return int
	 */
	public static function parseInt ($x) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:55: lines 55-70
		if (is_numeric($x)) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:56: characters 4-31
			return intval($x, 10);
		} else {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:58: characters 4-23
			$x = ltrim($x);
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:59: characters 4-54
			$firstCharIndex = (mb_substr($x, 0, 1) === "-" ? 1 : 0);
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:60: characters 4-53
			$firstCharCode = HxString::charCodeAt($x, $firstCharIndex);
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:61: lines 61-63
			if (!(($firstCharCode !== null) && ($firstCharCode >= 48) && ($firstCharCode <= 57))) {
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:62: characters 5-16
				return null;
			}
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:64: characters 21-49
			$index = $firstCharIndex + 1;
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:64: characters 4-50
			$secondChar = ($index < 0 ? "" : mb_substr($x, $index, 1));
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:65: lines 65-69
			if (($secondChar === "x") || ($secondChar === "X")) {
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:66: characters 5-31
				return intval($x, 0);
			} else {
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:68: characters 5-32
				return intval($x, 10);
			}
		}
	}

	/**
	 * Converts any value to a String.
	 * If `s` is of `String`, `Int`, `Float` or `Bool`, its value is returned.
	 * If `s` is an instance of a class and that class or one of its parent classes has
	 * a `toString` method, that method is called. If no such method is present, the result
	 * is unspecified.
	 * If `s` is an enum constructor without argument, the constructor's name is returned. If
	 * arguments exists, the constructor's name followed by the String representations of
	 * the arguments is returned.
	 * If `s` is a structure, the field names along with their values are returned. The field order
	 * and the operator separating field names and values are unspecified.
	 * If s is null, "null" is returned.
	 * 
	 * @param mixed $s
	 * 
	 * @return string
	 */
	public static function string ($s) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Std.hx:47: characters 3-27
		return Boot::stringify($s);
	}
}

Boot::registerClass(Std::class, 'Std');
