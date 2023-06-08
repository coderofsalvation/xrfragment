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
  } | awk '$2 ~ /src/ { $2=sprintf("%-30s",$2); print $0; next; } 1' | tee /tmp/log.txt
  grep error /tmp/log.txt && exit 1 || exit 0
}

doc(){
  awk -f doc/generate.awk src/xrfragment/URI.hx \
                          src/xrfragment/Parser.hx > doc/RFC.md
}

server(){
  test -f cert.pem || openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
  http-server -c-1 -S -C cert.pem .
}

build(){
  try rm dist/* 
  haxe build.hxml
  ok=$?
  sed -i 's|.*nonlocal .*||g' dist/xrfragment.py
  echo build OK
  build_js
}

build_js(){
  # add js module
  cat dist/xrfragment.js             > dist/xrfragment.module.js
  echo "export default xrfragment;" >> dist/xrfragment.module.js
  # add THREE 
  cat dist/xrfragment.js       \
      src/3rd/js/*.js          \
      src/3rd/js/three/*.js    \
      src/3rd/js/three/xrf/*.js       > dist/xrfragment.three.js
  # add THREE module
  cat dist/xrfragment.three.js        > dist/xrfragment.three.module.js
  echo "export default xrf;"  >> dist/xrfragment.three.module.js
  # add AFRAME 
  cat dist/xrfragment.three.js \
      src/3rd/js/aframe/*.js          > dist/xrfragment.aframe.js
  ls -la dist | grep js
  exit $ok
}

test -z $1 && build 
test -z $1 || "$@"
