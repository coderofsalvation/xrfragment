#!/bin/sh
set -e

try(){ set +e; "$@" 2>/dev/null; set -e; }
trace(){ set -x; "$@"; set +x; }

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
  which javac && haxelib install hxjava 4.2.0
  which mono  && haxelib install hxcs 4.2.0
}

tests(){
  {
    which python3 && python3 test/generated/test.py src/spec/*.json | awk '{ print "py: "$0 } END{ print "\n"}'
    which node    && node test/generated/test.js    src/spec/*.json | awk '{ print "js: "$0 } END{ print "\n"}'
  } | awk '$2 ~ /src/ { $2=sprintf("%-30s",$2); print $0; next; } 1' | tee /tmp/log.txt
  grep error /tmp/log.txt && exit 1 || exit 0
}

doc(){
  set -x
  awk -f doc/generate.awk src/xrfragment/URI.hx 
  read -p "press enter after copy/pasting into wiki" a
  awk -f doc/generate.awk src/xrfragment/Parser.hx 
  read -p "press enter after copy/pasting into wiki" a
  awk -f doc/generate.awk src/xrfragment/Query.hx 
  read -p "press enter after copy/pasting into wiki" a
}

server(){
  dir=$(pwd)
  cd /tmp
  test -f redbean.com || wget https://redbean.dev/redbean-2.2.com -O redbean.com && chmod 755 redbean.com
  test -f cert.pem    || openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
  ./redbean.com -c 0 -C cert.pem -K key.pem -D $dir
}

build(){

  parser(){
    try rm dist/* 
    trace haxe build.hxml
    ok=$?
    sed -i 's|.*nonlocal .*||g' dist/xrfragment.py
    ls -lah dist/*
    echo -e "[OK] parser build\n"
    return $ok
  }

  js(){
    # add js module
    cat dist/xrfragment.js            >> dist/xrfragment.module.js
    echo "export default xrfragment;" >> dist/xrfragment.module.js
    # add THREE 
    cat dist/xrfragment.js                  \
        src/3rd/js/*.js                     \
        src/3rd/js/three/*.js               \
        src/3rd/js/three/xrmacro/env.js     \
        src/3rd/js/three/xrf/*.js           \
        src/3rd/js/three/util/*.js          \
        src/3rd/js/three/xrf/dynamic/*.js   \
        src/3rd/js/three/xrf/src/*.js    > dist/xrfragment.three.js
    # add THREE module
    cat dist/xrfragment.three.js        > dist/xrfragment.three.module.js
    echo "export default xrf;"  >> dist/xrfragment.three.module.js
    # add AFRAME 
    cat dist/xrfragment.three.js \
        src/3rd/js/aframe/*.js          > dist/xrfragment.aframe.js
    # convert ESM to normal browser js
    sed 's/export //g' example/assets/js/utils.js > dist/utils.js
    # add license headers
    for file in dist/xrfragment.{aframe,module,three,three.module}.js; do
      awk 'BEGIN{ 
        print "/*"
        print " * generated at $(date)"
        print " * https://xrfragment.org"
        print " * SPDX-License-Identifier: MPL-2.0"
        print " */"
        system("cat '$file'")
      }' > /tmp/tmp.js 
      mv /tmp/tmp.js $file
    done
    ls -la dist | grep js 
    return $ok
  }

  test -z $1 && { parser && js; }
  test -z $1 || "$@"
}

test -z $1 && build 
test -z $1 || "$@"
