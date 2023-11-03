<?php
/**
 */

use \haxe\iterators\ArrayIterator as IteratorsArrayIterator;
use \php\Boot;
use \php\_Boot\HxClosure;
use \haxe\iterators\ArrayKeyValueIterator;

final class Array_hx implements \JsonSerializable, \Countable, \IteratorAggregate, \ArrayAccess {
	/**
	 * @var mixed[]
	 */
	public $arr;
	/**
	 * @var int
	 * The length of `this` Array.
	 */
	public $length;

	/**
	 * @param mixed[] $arr
	 * 
	 * @return mixed[]|Array_hx
	 */
	public static function wrap ($arr) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:267: characters 3-23
		$a = new Array_hx();
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:268: characters 3-14
		$a->arr = $arr;
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:269: characters 3-31
		$a->length = count($arr);
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:270: characters 3-11
		return $a;
	}

	/**
	 * Creates a new Array.
	 * 
	 * @return void
	 */
	public function __construct () {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:37: characters 9-36
		$this1 = [];
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:37: characters 3-36
		$this->arr = $this1;
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:38: characters 3-13
		$this->length = 0;
	}

	/**
	 * Returns a new Array by appending the elements of `a` to the elements of
	 * `this` Array.
	 * This operation does not modify `this` Array.
	 * If `a` is the empty Array `[]`, a copy of `this` Array is returned.
	 * The length of the returned Array is equal to the sum of `this.length`
	 * and `a.length`.
	 * If `a` is `null`, the result is unspecified.
	 * 
	 * @param mixed[]|Array_hx $a
	 * 
	 * @return mixed[]|Array_hx
	 */
	public function concat ($a) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:42: characters 3-46
		return Array_hx::wrap(array_merge($this->arr, $a->arr));
	}

	/**
	 * Returns whether `this` Array contains `x`.
	 * If `x` is found by checking standard equality, the function returns `true`, otherwise
	 * the function returns `false`.
	 * 
	 * @param mixed $x
	 * 
	 * @return bool
	 */
	public function contains ($x) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:60: characters 3-26
		return $this->indexOf($x) !== -1;
	}

	/**
	 * Returns a shallow copy of `this` Array.
	 * The elements are not copied and retain their identity, so
	 * `a[i] == a.copy()[i]` is true for any valid `i`. However,
	 * `a == a.copy()` is always false.
	 * 
	 * @return mixed[]|Array_hx
	 */
	public function copy () {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:46: characters 3-28
		return (clone $this);
	}

	/**
	 * @return int
	 */
	#[\ReturnTypeWillChange]
	public function count () {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:257: characters 3-16
		return $this->length;
	}

	/**
	 * Returns an Array containing those elements of `this` for which `f`
	 * returned true.
	 * The individual elements are not duplicated and retain their identity.
	 * If `f` is null, the result is unspecified.
	 * 
	 * @param \Closure $f
	 * 
	 * @return mixed[]|Array_hx
	 */
	public function filter ($f) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:50: characters 3-35
		$result = [];
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:51: characters 15-18
		$data = $this->arr;
		$_g_current = 0;
		$_g_length = count($data);
		$_g_data = $data;
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:51: lines 51-55
		while ($_g_current < $_g_length) {
			$item = $_g_data[$_g_current++];
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:52: lines 52-54
			if ($f($item)) {
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:53: characters 5-22
				$result[] = $item;
			}
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:56: characters 3-22
		return Array_hx::wrap($result);
	}

	/**
	 * @return \Traversable
	 */
	#[\ReturnTypeWillChange]
	public function getIterator () {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:250: characters 3-38
		return new \ArrayIterator($this->arr);
	}

	/**
	 * Returns position of the first occurrence of `x` in `this` Array, searching front to back.
	 * If `x` is found by checking standard equality, the function returns its index.
	 * If `x` is not found, the function returns -1.
	 * If `fromIndex` is specified, it will be used as the starting index to search from,
	 * otherwise search starts with zero index. If it is negative, it will be taken as the
	 * offset from the end of `this` Array to compute the starting index. If given or computed
	 * starting index is less than 0, the whole array will be searched, if it is greater than
	 * or equal to the length of `this` Array, the function returns -1.
	 * 
	 * @param mixed $x
	 * @param int $fromIndex
	 * 
	 * @return int
	 */
	public function indexOf ($x, $fromIndex = null) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:64: characters 7-69
		$tmp = null;
		if (($fromIndex === null) && !($x instanceof HxClosure)) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:64: characters 53-69
			$value = $x;
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:64: characters 7-69
			$tmp = !(is_int($value) || is_float($value));
		} else {
			$tmp = false;
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:64: lines 64-71
		if ($tmp) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:65: characters 4-50
			$index = array_search($x, $this->arr, true);
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:66: lines 66-70
			if ($index === false) {
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:67: characters 5-14
				return -1;
			} else {
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:69: characters 5-17
				return $index;
			}
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:72: lines 72-79
		if ($fromIndex === null) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:73: characters 4-17
			$fromIndex = 0;
		} else {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:75: lines 75-76
			if ($fromIndex < 0) {
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:76: characters 5-24
				$fromIndex += $this->length;
			}
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:77: lines 77-78
			if ($fromIndex < 0) {
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:78: characters 5-18
				$fromIndex = 0;
			}
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:80: lines 80-84
		while ($fromIndex < $this->length) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:81: lines 81-82
			if (Boot::equal($this->arr[$fromIndex], $x)) {
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:82: characters 5-21
				return $fromIndex;
			}
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:83: characters 4-15
			++$fromIndex;
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:85: characters 3-12
		return -1;
	}

	/**
	 * Inserts the element `x` at the position `pos`.
	 * This operation modifies `this` Array in place.
	 * The offset is calculated like so:
	 * - If `pos` exceeds `this.length`, the offset is `this.length`.
	 * - If `pos` is negative, the offset is calculated from the end of `this`
	 * Array, i.e. `this.length + pos`. If this yields a negative value, the
	 * offset is 0.
	 * - Otherwise, the offset is `pos`.
	 * If the resulting offset does not exceed `this.length`, all elements from
	 * and including that offset to the end of `this` Array are moved one index
	 * ahead.
	 * 
	 * @param int $pos
	 * @param mixed $x
	 * 
	 * @return void
	 */
	public function insert ($pos, $x) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:89: characters 3-11
		$this->length++;
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:90: characters 3-56
		array_splice($this->arr, $pos, 0, [$x]);
	}

	/**
	 * Returns an iterator of the Array values.
	 * 
	 * @return IteratorsArrayIterator
	 */
	public function iterator () {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:95: characters 3-48
		return new IteratorsArrayIterator($this);
	}

	/**
	 * Returns a string representation of `this` Array, with `sep` separating
	 * each element.
	 * The result of this operation is equal to `Std.string(this[0]) + sep +
	 * Std.string(this[1]) + sep + ... + sep + Std.string(this[this.length-1])`
	 * If `this` is the empty Array `[]`, the result is the empty String `""`.
	 * If `this` has exactly one element, the result is equal to a call to
	 * `Std.string(this[0])`.
	 * If `sep` is null, the result is unspecified.
	 * 
	 * @param string $sep
	 * 
	 * @return string
	 */
	public function join ($sep) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:104: characters 3-98
		return implode($sep, array_map((Boot::class??'null') . "::stringify", $this->arr));
	}

	/**
	 * @return mixed[]
	 */
	#[\ReturnTypeWillChange]
	public function jsonSerialize () {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:263: characters 3-13
		return $this->arr;
	}

	/**
	 * Returns an iterator of the Array indices and values.
	 * 
	 * @return ArrayKeyValueIterator
	 */
	public function keyValueIterator () {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:100: characters 3-41
		return new ArrayKeyValueIterator($this);
	}

	/**
	 * Returns position of the last occurrence of `x` in `this` Array, searching back to front.
	 * If `x` is found by checking standard equality, the function returns its index.
	 * If `x` is not found, the function returns -1.
	 * If `fromIndex` is specified, it will be used as the starting index to search from,
	 * otherwise search starts with the last element index. If it is negative, it will be
	 * taken as the offset from the end of `this` Array to compute the starting index. If
	 * given or computed starting index is greater than or equal to the length of `this` Array,
	 * the whole array will be searched, if it is less than 0, the function returns -1.
	 * 
	 * @param mixed $x
	 * @param int $fromIndex
	 * 
	 * @return int
	 */
	public function lastIndexOf ($x, $fromIndex = null) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:108: lines 108-109
		if (($fromIndex === null) || ($fromIndex >= $this->length)) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:109: characters 4-26
			$fromIndex = $this->length - 1;
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:110: lines 110-111
		if ($fromIndex < 0) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:111: characters 4-23
			$fromIndex += $this->length;
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:112: lines 112-116
		while ($fromIndex >= 0) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:113: lines 113-114
			if (Boot::equal($this->arr[$fromIndex], $x)) {
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:114: characters 5-21
				return $fromIndex;
			}
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:115: characters 4-15
			--$fromIndex;
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:117: characters 3-12
		return -1;
	}

	/**
	 * Creates a new Array by applying function `f` to all elements of `this`.
	 * The order of elements is preserved.
	 * If `f` is null, the result is unspecified.
	 * 
	 * @param \Closure $f
	 * 
	 * @return mixed[]|Array_hx
	 */
	public function map ($f) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:121: characters 3-35
		$result = [];
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:122: characters 15-18
		$data = $this->arr;
		$_g_current = 0;
		$_g_length = count($data);
		$_g_data = $data;
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:122: lines 122-124
		while ($_g_current < $_g_length) {
			$item = $_g_data[$_g_current++];
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:123: characters 4-24
			$result[] = $f($item);
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:125: characters 3-22
		return Array_hx::wrap($result);
	}

	/**
	 * @param int $offset
	 * 
	 * @return bool
	 */
	#[\ReturnTypeWillChange]
	public function offsetExists ($offset) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:212: characters 3-25
		return $offset < $this->length;
	}

	/**
	 * @param int $offset
	 * 
	 * @return mixed
	 */
	#[\ReturnTypeWillChange]
	public function &offsetGet ($offset) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:218: lines 218-222
		try {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:219: characters 4-22
			return $this->arr[$offset];
		} catch(\Throwable $_g) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:221: characters 4-15
			return null;
		}
	}

	/**
	 * @param int $offset
	 * @param mixed $value
	 * 
	 * @return void
	 */
	#[\ReturnTypeWillChange]
	public function offsetSet ($offset, $value) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:228: lines 228-233
		if ($this->length <= $offset) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:229: characters 13-19
			$_g = $this->length;
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:229: characters 22-32
			$_g1 = $offset + 1;
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:229: lines 229-231
			while ($_g < $_g1) {
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:229: characters 13-32
				$i = $_g++;
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:230: characters 5-18
				$this->arr[$i] = null;
			}
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:232: characters 4-23
			$this->length = $offset + 1;
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:234: characters 3-22
		$this->arr[$offset] = $value;
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:235: characters 3-35
		return $value;
	}

	/**
	 * @param int $offset
	 * 
	 * @return void
	 */
	#[\ReturnTypeWillChange]
	public function offsetUnset ($offset) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:241: lines 241-244
		if (($offset >= 0) && ($offset < $this->length)) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:242: characters 4-39
			array_splice($this->arr, $offset, 1);
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:243: characters 4-12
			--$this->length;
		}
	}

	/**
	 * Removes the last element of `this` Array and returns it.
	 * This operation modifies `this` Array in place.
	 * If `this` has at least one element, `this.length` will decrease by 1.
	 * If `this` is the empty Array `[]`, null is returned and the length
	 * remains 0.
	 * 
	 * @return mixed
	 */
	public function pop () {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:129: lines 129-130
		if ($this->length > 0) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:130: characters 4-12
			$this->length--;
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:131: characters 3-31
		return array_pop($this->arr);
	}

	/**
	 * Adds the element `x` at the end of `this` Array and returns the new
	 * length of `this` Array.
	 * This operation modifies `this` Array in place.
	 * `this.length` increases by 1.
	 * 
	 * @param mixed $x
	 * 
	 * @return int
	 */
	public function push ($x) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:135: characters 3-20
		$this->arr[$this->length++] = $x;
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:136: characters 3-16
		return $this->length;
	}

	/**
	 * Removes the first occurrence of `x` in `this` Array.
	 * This operation modifies `this` Array in place.
	 * If `x` is found by checking standard equality, it is removed from `this`
	 * Array and all following elements are reindexed accordingly. The function
	 * then returns true.
	 * If `x` is not found, `this` Array is not changed and the function
	 * returns false.
	 * 
	 * @param mixed $x
	 * 
	 * @return bool
	 */
	public function remove ($x) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:140: characters 3-22
		$result = false;
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:141: characters 16-20
		$_g = 0;
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:141: characters 20-26
		$_g1 = $this->length;
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:141: lines 141-148
		while ($_g < $_g1) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:141: characters 16-26
			$index = $_g++;
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:142: lines 142-147
			if (Boot::equal($this->arr[$index], $x)) {
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:143: characters 5-39
				array_splice($this->arr, $index, 1);
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:144: characters 5-13
				$this->length--;
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:145: characters 5-18
				$result = true;
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:146: characters 5-10
				break;
			}
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:149: characters 3-16
		return $result;
	}

	/**
	 * Set the length of the Array.
	 * If `len` is shorter than the array's current size, the last
	 * `length - len` elements will be removed. If `len` is longer, the Array
	 * will be extended, with new elements set to a target-specific default
	 * value:
	 * - always null on dynamic targets
	 * - 0, 0.0 or false for Int, Float and Bool respectively on static targets
	 * - null for other types on static targets
	 * 
	 * @param int $len
	 * 
	 * @return void
	 */
	public function resize ($len) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:201: lines 201-205
		if ($this->length < $len) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:202: characters 4-42
			$this->arr = array_pad($this->arr, $len, null);
		} else if ($this->length > $len) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:204: characters 4-47
			array_splice($this->arr, $len, $this->length - $len);
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:206: characters 3-15
		$this->length = $len;
	}

	/**
	 * Reverse the order of elements of `this` Array.
	 * This operation modifies `this` Array in place.
	 * If `this.length < 2`, `this` remains unchanged.
	 * 
	 * @return void
	 */
	public function reverse () {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:153: characters 3-34
		$this->arr = array_reverse($this->arr);
	}

	/**
	 * Removes the first element of `this` Array and returns it.
	 * This operation modifies `this` Array in place.
	 * If `this` has at least one element, `this`.length and the index of each
	 * remaining element is decreased by 1.
	 * If `this` is the empty Array `[]`, `null` is returned and the length
	 * remains 0.
	 * 
	 * @return mixed
	 */
	public function shift () {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:157: lines 157-158
		if ($this->length > 0) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:158: characters 4-12
			$this->length--;
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:159: characters 3-33
		return array_shift($this->arr);
	}

	/**
	 * Creates a shallow copy of the range of `this` Array, starting at and
	 * including `pos`, up to but not including `end`.
	 * This operation does not modify `this` Array.
	 * The elements are not copied and retain their identity.
	 * If `end` is omitted or exceeds `this.length`, it defaults to the end of
	 * `this` Array.
	 * If `pos` or `end` are negative, their offsets are calculated from the
	 * end of `this` Array by `this.length + pos` and `this.length + end`
	 * respectively. If this yields a negative value, 0 is used instead.
	 * If `pos` exceeds `this.length` or if `end` is less than or equals
	 * `pos`, the result is `[]`.
	 * 
	 * @param int $pos
	 * @param int $end
	 * 
	 * @return mixed[]|Array_hx
	 */
	public function slice ($pos, $end = null) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:163: lines 163-164
		if ($pos < 0) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:164: characters 4-17
			$pos += $this->length;
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:165: lines 165-166
		if ($pos < 0) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:166: characters 4-11
			$pos = 0;
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:167: lines 167-177
		if ($end === null) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:168: characters 4-45
			return Array_hx::wrap(array_slice($this->arr, $pos));
		} else {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:170: lines 170-171
			if ($end < 0) {
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:171: characters 5-18
				$end += $this->length;
			}
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:172: lines 172-176
			if ($end <= $pos) {
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:173: characters 5-14
				return new Array_hx();
			} else {
				#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:175: characters 5-57
				return Array_hx::wrap(array_slice($this->arr, $pos, $end - $pos));
			}
		}
	}

	/**
	 * Sorts `this` Array according to the comparison function `f`, where
	 * `f(x,y)` returns 0 if x == y, a positive Int if x > y and a
	 * negative Int if x < y.
	 * This operation modifies `this` Array in place.
	 * The sort operation is not guaranteed to be stable, which means that the
	 * order of equal elements may not be retained. For a stable Array sorting
	 * algorithm, `haxe.ds.ArraySort.sort()` can be used instead.
	 * If `f` is null, the result is unspecified.
	 * 
	 * @param \Closure $f
	 * 
	 * @return void
	 */
	public function sort ($f) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:181: characters 3-15
		usort($this->arr, $f);
	}

	/**
	 * Removes `len` elements from `this` Array, starting at and including
	 * `pos`, an returns them.
	 * This operation modifies `this` Array in place.
	 * If `len` is < 0 or `pos` exceeds `this`.length, an empty Array [] is
	 * returned and `this` Array is unchanged.
	 * If `pos` is negative, its value is calculated from the end	of `this`
	 * Array by `this.length + pos`. If this yields a negative value, 0 is
	 * used instead.
	 * If the sum of the resulting values for `len` and `pos` exceed
	 * `this.length`, this operation will affect the elements from `pos` to the
	 * end of `this` Array.
	 * The length of the returned Array is equal to the new length of `this`
	 * Array subtracted from the original length of `this` Array. In other
	 * words, each element of the original `this` Array either remains in
	 * `this` Array or becomes an element of the returned Array.
	 * 
	 * @param int $pos
	 * @param int $len
	 * 
	 * @return mixed[]|Array_hx
	 */
	public function splice ($pos, $len) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:185: lines 185-186
		if ($len < 0) {
			#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:186: characters 4-13
			return new Array_hx();
		}
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:187: characters 3-57
		$result = Array_hx::wrap(array_splice($this->arr, $pos, $len));
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:188: characters 3-26
		$this->length -= $result->length;
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:189: characters 3-16
		return $result;
	}

	/**
	 * Returns a string representation of `this` Array.
	 * The result will include the individual elements' String representations
	 * separated by comma. The enclosing [ ] may be missing on some platforms,
	 * use `Std.string()` to get a String representation that is consistent
	 * across platforms.
	 * 
	 * @return string
	 */
	public function toString () {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:197: characters 10-54
		$arr = $this->arr;
		$strings = [];
		foreach ($arr as $key => $value) {
			$strings[$key] = Boot::stringify($value, 9);
		}
		return "[" . (implode(",", $strings)??'null') . "]";
	}

	/**
	 * Adds the element `x` at the start of `this` Array.
	 * This operation modifies `this` Array in place.
	 * `this.length` and the index of each Array element increases by 1.
	 * 
	 * @param mixed $x
	 * 
	 * @return void
	 */
	public function unshift ($x) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/php/_std/Array.hx:193: characters 3-40
		$this->length = array_unshift($this->arr, $x);
	}

	public function __toString() {
		return $this->toString();
	}
}

Boot::registerClass(Array_hx::class, 'Array');
