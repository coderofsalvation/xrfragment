#!/bin/sh
set -e

try(){ set +e; "$@" 2>/dev/null; set -e; }

install(){
  which haxe || { 
    echo -e "installing haxe..if this fails:\n\n"
    echo " 1. install haxe from haxe.org"
    echo "[2.] download neko for cpp output"
    echo "[3.] install mono openjdk14 for csharp + java output"
    which apt-get && {
      sudo apt-get update -y
      sudo apt-get install neko haxe -y
    }
  }
  mkdir ~/.haxe
  haxelib setup ~/.haxe
  haxelib install hxcpp
  haxelib install hxjava
  haxelib install hxcs
  haxelib install hscript
}

tests(){
	{
		which python3 && python3 test/generated/test.py src/spec/*.json | awk '{ print "py: "$0 } END{ print "\n"}'
		which node    && node test/generated/test.js    src/spec/*.json | awk '{ print "js: "$0 } END{ print "\n"}'
	} | tee /tmp/log.txt
  grep error /tmp/log.txt && exit 1 || exit 0
}

doc(){
    extract(){ cat $1 | awk '/\/\/  / { gsub(".*//  ","",$0); gsub("# ","\n# ",$0);print $0; }'; }
  extract src/xrfragment/Url.hx > doc/url.md
}

test -z $1 && { try rm dist/* ; haxe build.hxml; exit $?; }
test -z $1 || "$@"
