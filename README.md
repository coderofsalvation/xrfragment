<link rel="stylesheet" href="doc/style.css"/>
<link href="https://fonts.cdnfonts.com/css/montserrat" rel="stylesheet"/>

[![Actions Status](https://github.com/coderofsalvation/xrfragment/workflows/test/badge.svg)](https://github.com/coderofsalvation/xrfragment/actions)

<img src="https://xrfragment.org/example/assets/logo.png" width="200"/>

# Documentation / Website

https://xrfragment.org 

# Getting started

Here are various ways to enhance your 3D assets/scenes with XR Fragments:

| |  difficulty | how | notes |
|-|-|-|-|
| 1 | easiest | the xrfragment.org <a href="https://xrfragment.org/example/aframe/sandbox" target="_blank">Sandbox</a> | open 3D file (fbx/gltf) in <a href="https://blender.org" target="_blank">Blender</a>, add <a href="https://docs.blender.org/manual/en/2.79/data_system/custom_properties.html" target="_blank">custom properties</a>, and load exported files into <a href="/example/aframe/sandbox" target="_blank">the sandbox</a> |
| 2 | easy | hosted sandbox by <a href="https://github.com/coderofsalvation/xrfragment-helloworld" target="_blank">forking xrfragment-helloworld</a> | Basically #1 but it will be hosted for free at your own github URL |
| 3 | developer | fork <a href="https://github.com/coderofsalvation/xrfragment-aframe-helloworld">xfragment-aframe-helloworld</a> | requires javascript- and <a href="https://aframe.io" target="_blank">aframe.io</a> developer-knowledge |
| 4 | developer | fork <a href="https://github.com/coderofsalvation/xrfragment-three-helloworld">xfragment-three-helloworld</a> | requires javascript- and <a href="https://threejs.org" target="_blank">threejs</a> developer-knowledge |
| 5 | developer++ | use a parser-library below | lowlevel approach, more suitable for other scenarios |


# available parser-implementations

* [javascript](dist/xrfragment.js) [(+example)](test/test.js)
* [python](dist/xrfragment.py) [(+example)](test/test.py)
* [lua](dist/xrfragment.lua) [(+example)](test/test.lua)
* [haXe](src/xrfragment) (allows exporting to various programming languages)

See documentation for more info

# development

Pre-build libraries can be found in [/dist folder](dist)<br>
If you really want to build from source:

```
$ nix-shell           # nix-users: drops you into a dev-ready shell 
$ ./make install      # debian-users: install deps via apt-get
$ ./make build && ./make tests
```

> NOTE #1: to rebundle the THREE/AFRAME javascripts during dev run `./make build js`
> NOTE #2: to regenerate the parser in various languages (via haxe), run `./make build parser`

<br>
<a href="https://nlnet.nl" target="_blank">
  <img src="https://nlnet.nl/image/logo_nlnet.svg" width="100"/>
</a>
