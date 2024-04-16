<link rel="stylesheet" href="doc/style.css"/>
<link href="https://fonts.cdnfonts.com/css/montserrat" rel="stylesheet"/>

[![Actions Status](https://github.com/coderofsalvation/xrfragment/workflows/test/badge.svg)](https://github.com/coderofsalvation/xrfragment/actions)

<img src="https://xrfragment.org/example/assets/logo.png" width="200"/>

A tiny specification for viewing 3D models as linkable AR/VR websites.<br>
Address and Control anything inside a 3D model with [W3C Media Fragments](https://www.w3.org/TR/media-frags/) and [URI Templates](https://www.rfc-editor.org/rfc/rfc6570).<br>
<br>

![](https://coderofsalvation.github.io/xrfragment.media/images/metadata.jpg)

<br>
Simply SURF a 3D file-verse and design for a Spatial Open Internet with the highest degree of interoperability ❤

# Documentation / Website 

https://xrfragment.org 

![](https://coderofsalvation.github.io/xrfragment.media/images/nocode.jpg)

# Getting started

![](https://coderofsalvation.github.io/xrfragment.media/gettingstarted2024.mp4)

https://xrfragmenorg 

# available parser-implementations

* [javascript](dist/xrfragment.js) [(+example)](test/test.js)
* [javascript module](dist/xrfragment.module.js) 
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

# Credits

<br>
<a href="https://nlnet.nl" target="_blank">
  <img src="https://nlnet.nl/image/logo_nlnet.svg" width="100"/>
</a>
