%%%
Title = "XR Fragments"
area = "Internet"
workgroup = "Internet Engineering Task Force"

[seriesInfo]
name = "XR-Fragments"
value = "draft-XRFRAGMENTS-leonvankammen-00"
stream = "IETF"
status = "informational"

date = 2023-04-12T00:00:00Z

[[author]]
initials="L.R."
surname="van Kammen"
fullname="L.R. van Kammen"

%%%

<!-- for annotated version see: https://raw.githubusercontent.com/ietf-tools/rfcxml-templates-and-schemas/main/draft-rfcxml-general-template-annotated-00.xml -->

<!--{

  <style type="text/css">
  body{
    font-family: monospace;
    max-width: 900px;
    font-size: 15px;
    padding: 0% 20%;
    line-height: 30px;
    color:#555;
    background:#F0F0F3
  }
  h1 { margin-top:40px; }
  pre{ line-height:18px; }
  a,a:visited,a:active{ color: #70f; }
  code{
    border: 1px solid #AAA;
    border-radius: 3px;
    padding: 0px 5px 2px 5px;
  }
  pre>code{
    border:none;
    border-radius:0px;
    padding:0;
  }
  blockquote{
    padding-left: 30px;
    margin: 0;
    border-left: 5px solid #CCC;
  }

  </style>

<br>
<h1>XR Fragments</h1>
<br>

<pre>
stream:    IETF
area:      Internet
status:    informational
author:    Leon van Kammen
date:      2023-04-12T00:00:00Z
workgroup: Internet Engineering Task Force
value:     draft-XRFRAGMENTS-leonvankammen-00
</pre>  


}-->

.# Abstract

This draft offers a specification for 4D URLs & navigation, to link 3D scenes and text together with- or without a network-connection.
The specification promotes spatial addressibility, sharing, navigation, query-ing and interactive text across for (XR) Browsers.
XR Fragments allows us to enrich existing dataformats, by recursive use of existing technologies like [URI Fragments](https://en.wikipedia.org/wiki/URI_fragment) & [visual-meta](https://visual-meta.info).

# Introduction

How can we add more features to existing text & 3D scenes, without introducing new dataformats?
Historically, there's many attempts to create the ultimate markuplanguage or 3D fileformat.
However, thru the lens of authoring their lowest common denominator is still: plain text.
XR Fragments allows us to enrich existing dataformats, by recursive use of existing technologies:

* addressibility & navigation of 3D objects: [URI Fragments](https://en.wikipedia.org/wiki/URI_fragment) + (src/href) metadata
* bi-directional links between text and spatial objects: [visual-meta](https://visual-meta.info)

# Conventions and Definitions

* scene: a (local/remote) 3D scene or 3D file (index.gltf e.g.)
* 3D object: an object inside a scene characterized by vertex-, face- and customproperty data.
* metadata: custom properties defined in 3D Scene or Object(nodes) 
* XR fragment: URI Fragment with spatial hints (`#pos=0,0,0&t=1,100` e.g.)
* src: a (HTML-piggybacked) metadata-attribute of a 3D object which instances content
* href: a (HTML-piggybacked) metadata-attribute of a 3D object which links to content 
* query: an URI Fragment-operator which queries object(s) from a scene (`#q=cube`)
* [visual-meta](https://visual.meta.info): metadata appended to text which is only indirectly visible/editable in XR.

{::boilerplate bcp14-tagged}

# List of URI Fragments

| fragment     | type     | example       | info                                                 |
|--------------|----------|---------------|------------------------------------------------------|
| #pos         | vector3  | #pos=0.5,0,0  | positions camera to xyz-coord 0.5,0,0                |
| #rot         | vector3  | #rot=0,90,0   | rotates camera to xyz-coord 0.5,0,0                  |
| #t           | vector2  | #t=500,1000   | sets animation-loop range between frame 500 and 1000 |

# List of metadata for 3D nodes 

| key          | type     | example         | info                                                   |
|--------------|----------|-----------------|--------------------------------------------------------|
| name         | string   | name: "cube"    | already available in all 3D fileformats & scenes       |
| class        | string   | class: "cubes"  | supported through custom property in 3D fileformats    |
| href         | string   | href: "b.gltf"  | supported through custom property in 3D fileformats    |
| src          | string   | src: "#q=cube"  | supported through custom property in 3D fileformats    |

# Navigating 3D

Here's an ascii representation of a 3D scene-graph which contains 3D objects (`◻`) and their metadata:

```
  +--------------------------------------------------------+ 
  |                                                        |
  |  index.gltf                                            |
  |    │                                                   |
  |    ├── ◻ buttonA                                       |
  |    │      └ href: #pos=1,0,1&t=100,200                 |
  |    │                                                   |
  |    └── ◻ buttonB                                       |
  |           └ href: other.fbx                            |
  |                                                        |
  +--------------------------------------------------------+

```

An XR Fragment-compatible browser viewing this scene, allows the end-user to interact with the `buttonA` and `buttonB`.
In case of `buttonA` the end-user will be teleported to another location and time in the **current loaded scene**, but `buttonB` will
 **replace the current scene** with a new one (`other.fbx`).

# Embedding 3D content 

Here's an ascii representation of a 3D scene-graph with 3D objects (`◻`) which embeds remote & local 3D objects (`◻`) (without) using queries:

```
  +--------------------------------------------------------+  +-------------------------+ 
  |                                                        |  |                         |
  |  index.gltf                                            |  | ocean.com/aquarium.fbx  |
  |    │                                                   |  |   │                     |
  |    ├── ◻ canvas                                        |  |   └── ◻ fishbowl        |
  |    │      └ src: painting.png                          |  |         ├─ ◻ bass       |
  |    │                                                   |  |         └─ ◻ tuna       |
  |    ├── ◻ aquariumcube                                  |  |                         |       
  |    │      └ src: ://rescue.com/fish.gltf#q=bass%20tuna |  +-------------------------+
  |    │                                                   |    
  |    ├── ◻ bedroom                                       |   
  |    │      └ src: #q=canvas                             |
  |    │                                                   |   
  |    └── ◻ livingroom                                    |      
  |           └ src: #q=canvas                             |
  |                                                        |
  +--------------------------------------------------------+
```

An XR Fragment-compatible browser viewing this scene, lazy-loads and projects `painting.png` onto the (plane) object called `canvas` (which is copy-instanced in the bed and livingroom).
Also, after lazy-loading `ocean.com/aquarium.gltf`, only the queried objects `bass` and `tuna` will be instanced inside `aquariumcube`.
Resizing will be happen accordingly to its placeholder object (`aquariumcube`), see chapter Scaling.


# Embedding text

Text in XR has to be unobtrusive, for readers as well as authors.
We think and speak in simple text, and given the new paradigm of XR interfaces, logically (spoken) text must be enriched *afterwards* (lazy metadata).
Therefore, **yet-another-markuplanguage** is not going to get us very far.
What will get us far, is when XR interfaces always guarantee direct feedbackloops between plainttext and humans.
Humans need to be always served first, and machines later.

In the next chapter you can see how XR Fragments enjoys hasslefree rich text, by adding [visual-meta](https://visual.meta.info)(data) support to plain text.

## Default Data URI mimetype 

The XR Fragment specification bumps the traditional default browser-mimetype 

`text/plain;charset=US-ASCII` 

to:

`text/plain;charset=utf-8;visual-meta=1`

This means that [visual-meta](https://visual.meta.info)(data) can be appended to plain text without being displayed.

### URL and Data URI

```
  +--------------------------------------------------------------+  +------------------------+
  |                                                              |  | author.com/article.txt |
  |  index.gltf                                                  |  +------------------------+
  |    │                                                         |  |                        |
  |    ├── ◻ article_canvas                                      |  | Hello friends.         |
  |    │    └ src: ://author.com/article.txt                     |  |                        |
  |    │                                                         |  | @{visual-meta-start}   |
  |    └── ◻ note_canvas                                         |  | ...                    |
  |           └ src:`data:welcome human @{visual-meta-start}...` |  +------------------------+ 
  |                                                              | 
  |                                                              |
  +--------------------------------------------------------------+
```

The enduser will only see `welcome human` rendered spatially.
The beauty is that text (AND visual-meta) in Data URI is saved into the scene, which also promotes rich copy-paste.
In both cases will the text get rendered immediately (onto a plane geometry, hence the name '_canvas').
The XR Fragment-compatible browser can let the enduser access visual-meta(data)-fields after interacting with the object (contextmenu e.g.).

> NOTE: this is not to say that XR Browsers should not load HTML/PDF/etc-URLs thru `src`, it is just that `text/plain;charset=utf-8;visual-meta=1` is the default.

The mapping between 3D objects and text (src-data) is simple:

Example:

```
  +------------------------------------------------------------------------------------+ 
  |                                                                                    | 
  |  index.gltf                                                                        | 
  |    │                                                                               | 
  |    ├── ◻ AI                                                                        | 
  |    │    └ class: tech                                                              | 
  |    │                                                                               | 
  |    └ src:`data:@{visual-meta-start}                                                | 
  |                @{glossary-start}                                                   |
  |                @entry{                                                             |
  |                    name="AI",                                                      |
  |                    alt-name1 = "Artificial Intelligence",                          |
  |                    description="Artificial intelligence",                          |
  |                    url = "https://en.wikipedia.org/wiki/Artificial_intelligence",  |
  |                }                                                                   |
  |                @entry{                                                             |
  |                    name="tech"                                                     |
  |                    alt-name1="technology"                                          |
  |                    description="when monkeys start to play with things"            |
  |                }`                                                                  |
  +------------------------------------------------------------------------------------+
```

Attaching visualmeta as `src` metadata to the (root) scene-node hints the XR Fragment browser.
3D object names and classes map to `name` of visual-meta glossary-entries.
This allows rich interaction and interlinking between text and 3D objects:

1. When the user surfs to https://.../index.gltf#AI the XR Fragments-parser points the enduser to the AI object, and can show contextual info about it.
2. When (partial) remote content is embedded thru XR Fragment queries (see XR Fragment queries), its related visual-meta can be embedded along.

# HYPER copy/paste 

The previous example, offers something exciting compared to simple copy/paste of 3D objects or text.
XR Fragment allows HYPER-copy/paste: time, space and text interlinked.
Therefore, the enduser in an XR Fragment-compatible browser can copy/paste/share data in these ways:

* time/space: 3D object (current animation-loop)
* text: Text object (including visual-meta if any)
* interlinked: Collected objects by visual-meta tag

# XR Fragment queries

Include, exclude, hide/shows objects using space-separated strings:

* `#q=cube`
* `#q=cube -ball_inside_cube`
* `#q=* -sky`
* `#q=-.language .english`
* `#q=cube&rot=0,90,0`
* `#q=price:>2 price:<5`

It's simple but powerful syntax which allows <b>css</b>-like class/id-selectors with a searchengine prompt-style feeling:

1. queries are only executed when <b>embedded</b> in the asset/scene (thru `src`). This is to prevent sharing of scene-tampered URL's.
2. search words are matched against 3D object names or metadata-key(values)
3. `#` equals `#q=*`
4. words starting with `.` (`.language`) indicate class-properties 

> *(*For example**: `#q=.foo` is a shorthand for `#q=class:foo`, which will select objects with custom property `class`:`foo`. Just a simple `#q=cube` will simply select an object named `cube`.

* see [an example video here](https://coderofsalvation.github.io/xrfragment.media/queries.mp4)

### including/excluding

|''operator''  | ''info'' |
|`*` | select all objects (only allowed in `src` custom property) in the <b>current</b> scene (<b>after</b> the default [[predefined_view|predefined_view]] `#` was executed)|
|`-` | removes/hides object(s) |
|`:` | indicates an object-embedded custom property key/value |
|`.` | alias for `class:` (`.foo` equals `class:foo` |
|`>` `<`| compare float or int number|
|`/` | reference to root-scene.<br>Useful in case of (preventing) showing/hiding objects in nested scenes (instanced by [[src]])<br>`#q=-/cube` hides object `cube` only in the root-scene (not nested `cube` objects)<br> `#q=-cube` hides both object `cube` in the root-scene <b>AND</b> nested `skybox` objects |

[» example implementation](https://github.com/coderofsalvation/xrfragment/blob/main/src/3rd/js/three/xrf/q.js)
[» example 3D asset](https://github.com/coderofsalvation/xrfragment/blob/main/example/assets/query.gltf#L192)
[» discussion](https://github.com/coderofsalvation/xrfragment/issues/3)

## Query Parser 

Here's how to write a query parser:

1. create an associative array/object to store query-arguments as objects
1. detect object id's & properties `foo:1` and `foo` (reference regex: `/^.*:[><=!]?/`  )
1. detect excluders like `-foo`,`-foo:1`,`-.foo`,`-/foo` (reference regex: `/^-/` )
1. detect root selectors like `/foo` (reference regex: `/^[-]?\//` )
1. detect class selectors like `.foo` (reference regex: `/^[-]?class$/` )
1. detect number values like `foo:1` (reference regex: `/^[0-9\.]+$/` )
1. expand aliases like `.foo` into `class:foo`
1. for every query token split string on `:`
1. create an empty array `rules`
1. then strip key-operator: convert "-foo" into "foo" 
1. add operator and value to rule-array
1. therefore we we set `id` to `true` or `false` (false=excluder `-`)
1. and we set `root` to `true` or `false` (true=`/` root selector is present)
1. we convert key '/foo' into 'foo'
1. finally we add the key/value to the store (`store.foo = {id:false,root:true}` e.g.)

> An example query-parser (which compiles to many languages) can be [found here](https://github.com/coderofsalvation/xrfragment/blob/main/src/xrfragment/Query.hx)

# List of XR URI Fragments 

# Security Considerations

TODO Security

# IANA Considerations

This document has no IANA actions.

# Acknowledgments

TODO acknowledge.
