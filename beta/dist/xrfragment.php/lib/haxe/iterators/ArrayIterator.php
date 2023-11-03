<?php
/**
 */

namespace haxe\iterators;

use \php\Boot;

/**
 * This iterator is used only when `Array<T>` is passed to `Iterable<T>`
 */
class ArrayIterator {
	/**
	 * @var mixed[]|\Array_hx
	 */
	public $array;
	/**
	 * @var int
	 */
	public $current;

	/**
	 * Create a new `ArrayIterator`.
	 * 
	 * @param mixed[]|\Array_hx $array
	 * 
	 * @return void
	 */
	public function __construct ($array) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/haxe/iterators/ArrayIterator.hx:30: characters 20-21
		$this->current = 0;
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/haxe/iterators/ArrayIterator.hx:37: characters 3-21
		$this->array = $array;
	}

	/**
	 * See `Iterator.hasNext`
	 * 
	 * @return bool
	 */
	public function hasNext () {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/haxe/iterators/ArrayIterator.hx:45: characters 3-32
		return $this->current < $this->array->length;
	}

	/**
	 * See `Iterator.next`
	 * 
	 * @return mixed
	 */
	public function next () {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/haxe/iterators/ArrayIterator.hx:53: characters 3-26
		return ($this->array->arr[$this->current++] ?? null);
	}
}

Boot::registerClass(ArrayIterator::class, 'haxe.iterators.ArrayIterator');
