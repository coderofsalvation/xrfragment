<?php
/**
 */

use \php\Boot;
use \php\_Boot\HxClass;

/**
 * The Reflect API is a way to manipulate values dynamically through an
 * abstract interface in an untyped manner. Use with care.
 * @see https://haxe.org/manual/std-reflection.html
 */
class Reflect {
	/**
	 * Removes the field named `field` from structure `o`.
	 * This method is only guaranteed to work on anonymous structures.
	 * If `o` or `field` are null, the result is unspecified.
	 * 
	 * @param mixed $o
	 * @param string $field
	 * 
	 * @return bool
	 */
	public static function deleteField ($o, $field) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:158: lines 158-163
		if (Reflect::hasField($o, $field)) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:159: characters 4-40
			unset($o->{$field});
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:160: characters 4-15
			return true;
		} else {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:162: characters 4-16
			return false;
		}
	}

	/**
	 * Returns the value of the field named `field` on object `o`.
	 * If `o` is not an object or has no field named `field`, the result is
	 * null.
	 * If the field is defined as a property, its accessors are ignored. Refer
	 * to `Reflect.getProperty` for a function supporting property accessors.
	 * If `field` is null, the result is unspecified.
	 * 
	 * @param mixed $o
	 * @param string $field
	 * 
	 * @return mixed
	 */
	public static function field ($o, $field) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:50: lines 50-52
		if (is_string($o)) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:51: characters 24-45
			$tmp = Boot::dynamicString($o);
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:51: characters 4-53
			return $tmp->{$field};
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:53: lines 53-54
		if (!is_object($o)) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:54: characters 4-15
			return null;
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:56: lines 56-58
		if (($field === "") && (PHP_VERSION_ID < 70100)) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:57: characters 4-56
			return (((array)($o))[$field] ?? null);
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:60: lines 60-62
		if (property_exists($o, $field)) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:61: characters 4-33
			return $o->{$field};
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:63: lines 63-65
		if (method_exists($o, $field)) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:64: characters 4-44
			return Boot::getInstanceClosure($o, $field);
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:67: lines 67-78
		if (($o instanceof HxClass)) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:68: characters 4-54
			$phpClassName = $o->phpClassName;
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:69: lines 69-71
			if (defined("" . ($phpClassName??'null') . "::" . ($field??'null'))) {
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:70: characters 5-52
				return constant("" . ($phpClassName??'null') . "::" . ($field??'null'));
			}
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:72: lines 72-74
			if (property_exists($phpClassName, $field)) {
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:73: characters 5-34
				return $o->{$field};
			}
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:75: lines 75-77
			if (method_exists($phpClassName, $field)) {
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:76: characters 5-54
				return Boot::getStaticClosure($phpClassName, $field);
			}
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:80: characters 3-14
		return null;
	}

	/**
	 * Returns the fields of structure `o`.
	 * This method is only guaranteed to work on anonymous structures. Refer to
	 * `Type.getInstanceFields` for a function supporting class instances.
	 * If `o` is null, the result is unspecified.
	 * 
	 * @param mixed $o
	 * 
	 * @return string[]|\Array_hx
	 */
	public static function fields ($o) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:117: lines 117-119
		if (is_object($o)) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:118: characters 4-77
			return \Array_hx::wrap(array_keys(get_object_vars($o)));
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:120: characters 3-12
		return new \Array_hx();
	}

	/**
	 * Tells if structure `o` has a field named `field`.
	 * This is only guaranteed to work for anonymous structures. Refer to
	 * `Type.getInstanceFields` for a function supporting class instances.
	 * If `o` or `field` are null, the result is unspecified.
	 * 
	 * @param mixed $o
	 * @param string $field
	 * 
	 * @return bool
	 */
	public static function hasField ($o, $field) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:34: lines 34-35
		if (!is_object($o)) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:35: characters 4-16
			return false;
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:36: lines 36-37
		if (property_exists($o, $field)) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:37: characters 4-15
			return true;
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:39: lines 39-44
		if (($o instanceof HxClass)) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:40: characters 4-54
			$phpClassName = $o->phpClassName;
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:41: lines 41-43
			if (!(property_exists($phpClassName, $field) || method_exists($phpClassName, $field))) {
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:43: characters 8-47
				return defined("" . ($phpClassName??'null') . "::" . ($field??'null'));
			} else {
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:41: lines 41-43
				return true;
			}
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:46: characters 3-15
		return false;
	}

	/**
	 * Sets the field named `field` of object `o` to value `value`.
	 * If `o` has no field named `field`, this function is only guaranteed to
	 * work for anonymous structures.
	 * If `o` or `field` are null, the result is unspecified.
	 * 
	 * @param mixed $o
	 * @param string $field
	 * @param mixed $value
	 * 
	 * @return void
	 */
	public static function setField ($o, $field, $value) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Reflect.hx:84: characters 3-35
		$o->{$field} = $value;
	}
}

Boot::registerClass(Reflect::class, 'Reflect');
