<?php
/**
 */

namespace haxe\iterators;

use \php\Boot;

class ArrayKeyValueIterator {
	/**
	 * @var mixed[]|\Array_hx
	 */
	public $array;

	/**
	 * @param mixed[]|\Array_hx $array
	 * 
	 * @return void
	 */
	public function __construct ($array) {
		#/nix/store/ljakxdz94hcvn9b4k9y292dn5lhh20iy-haxe-4.2.5/lib/haxe/std/haxe/iterators/ArrayKeyValueIterator.hx:32: characters 3-21
		$this->array = $array;
	}
}

Boot::registerClass(ArrayKeyValueIterator::class, 'haxe.iterators.ArrayKeyValueIterator');
