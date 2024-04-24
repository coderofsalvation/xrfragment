#!/bin/bash
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
    which node    && node test/generated/test.js    src/spec/*.json | awk '{ print "js: "$0 } END{ print "\n"}'
    which python3 && python3 test/generated/test.py src/spec/*.json | awk '{ print "py: "$0 } END{ print "\n"}'
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

  aframe(){
    test -d src/3rd/js/aframe/build/aframe || git clone https://github.com/aframevr/aframe src/3rd/js/aframe/build/aframe --depth=1
    curdir=$(pwd)
    cd src/3rd/js/aframe/build && cp three.module.js aframe/src/lib/. # override to add extra loaders like fbx/collada e.g.
    #cd aframe && npm install && npm install troika-three-text && npm run dist
    cd aframe && npm install && npm run dist
    cd "$curdir"
    cp src/3rd/js/aframe/build/aframe/dist/aframe-master.min.js dist/aframe.min.js
    test -f dist/aframe-blink-controls.min.js || {
      wget "https://cdn.jsdelivr.net/npm/aframe-blink-controls/dist/aframe-blink-controls.min.js" -O dist/aframe-blink-controls.min.js
    }
  }

  parser(){
    try rm dist/xrfragment.* 
    haxe build.hxml || exit 1
    sed -i 's|.*nonlocal .*||g' dist/xrfragment.py
    ls -lah dist/*
    echo -e "[OK] parser build\n"
    return $ok
  }

  js(){

    jscat(){ echo "(function(){"; cat "$@"; echo "}).apply({})"; }

    # add js module
    cat dist/xrfragment.js            >> dist/xrfragment.module.js
    echo "export default xrfragment;" >> dist/xrfragment.module.js

    # add THREE 
    cat dist/xrfragment.js                  \
        src/3rd/js/*.js                     \
        src/3rd/js/three/*.js               \
        src/3rd/js/three/xrf/*.js           \
        src/3rd/js/three/util/*.js          \
        src/3rd/js/three/xrf/dynamic/*.js   \
        src/3rd/js/three/xrf/src/*.js    > dist/xrfragment.three.js

    # add THREE module
    cat dist/xrfragment.three.js        > dist/xrfragment.three.module.js
    echo "export default xrf;"  >> dist/xrfragment.three.module.js

    # add AFRAME 
    cat dist/xrfragment.three.js \
        src/3rd/js/aframe/*.js   \
        example/assets/js/qr.js  > dist/xrfragment.aframe.js

    # plugins  
    jscat src/3rd/js/plugin/frontend/{network,\$connections,\$chat}.js           > dist/xrfragment.plugin.network.js
    cp    src/3rd/js/plugin/frontend/\$editor.js                                   dist/xrfragment.plugin.editor.js 

    cp    src/3rd/js/plugin/frontend/css.js                                        dist/xrfragment.plugin.frontend.css.js 
    jscat src/3rd/js/plugin/frontend/{snackbar,accessibility,\$menu,frontend}.js > dist/xrfragment.plugin.frontend.js

    jscat src/3rd/js/plugin/matrix/{matrix-crdt,matrix}.js          > dist/xrfragment.plugin.matrix.js 
    jscat src/3rd/js/plugin/p2p/{trystero-torrent.min,trystero}.js  > dist/xrfragment.plugin.p2p.js 
    
    cat dist/aframe.min.js dist/aframe-blink-controls.min.js dist/xrfragment.aframe.js > dist/xrfragment.aframe.all.js
    
    # add license headers
    for file in dist/xrfragment.{aframe,module,three,three.module,aframe.all}.js; do
      awk 'BEGIN{ 
        print "/*"
        print " * '"$(git tag | head -n1)"' generated at '"$(date)"'"
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

  test -z $1 && { parser && aframe && js; }
  test -z $1 || "$@"
}

repos(){
  release_dir(){
    slug=xrfragment-$1-helloworld
    test -d ../$slug || git clone git@github.com:coderofsalvation/$slug.git ../$slug
    pushd $(pwd)
    cp example/assets/index.glb ../$2/index.glb
    cat example/$1/sandbox/index.html | \
      sed 's|href=".*/assets|href="https://xrfragment.org/example/assets|g'                            | \
      sed 's|"\./.*/dist|"https://xrfragment.org/dist|g'                                               | \
      sed 's|"\./.*/assets|"https://xrfragment.org/example/assets|g' \
      > ../$2/index.html
    test -z $COMMIT || {
      set -x; cd ../$slug ; set +x
      git add index.html
      git commit -m "update index.html to commit $(git log | awk '{ print $1; exit 0; }') from xrfragment-repo"
      git push origin main
      popd
    }
    echo " "
  }

  release_dir aframe xrfragment-aframe-helloworld 
  release_dir three  xrfragment-three-helloworld 
  release_dir aframe xrfragment-helloworld

  # remove aframe reference
  sed -i 's|<script src="https:\/\/aframe.*||g' ../xrfragment-helloworld/index.html
  sed -i 's|<script src=".*extras.*||g'         ../xrfragment-helloworld/index.html
  sed -i 's|<script src=".*blink-controls.*||g' ../xrfragment-helloworld/index.html
  sed -i 's|aframe\.js|aframe.js|g'         ../xrfragment-helloworld/index.html
}

test -z $1 && build 
test -z $1 || "$@"

