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
    max-width: 1000px;
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

  pre{
    line-height: 18px;
    overflow: auto;
    padding: 12px;
  }
  pre + code {
    background:#DDD;
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
  th {
      border-bottom: 1px solid #000;
      text-align: left;
      padding-right:45px;
      padding-left:7px;
      background: #DDD;
  }

  td {
      border-bottom: 1px solid #CCC;
      font-size:13px; 
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

This draft offers a specification for 4D URLs & navigation, to link 3D scenes and text together with- or without a network-connection.<br>
The specification promotes spatial addressibility, sharing, navigation, query-ing and tagging interactive (text)objects across for (XR) Browsers.<br>
XR Fragments allows us to enrich existing dataformats, by recursive use of existing proven technologies like [URI Fragments](https://en.wikipedia.org/wiki/URI_fragment) and [visual-meta](https://visual-meta.info).<br>

{mainmatter}

# Introduction

How can we add more features to existing text & 3D scenes, without introducing new dataformats?<br>
Historically, there's many attempts to create the ultimate markuplanguage or 3D fileformat.<br>
However, thru the lens of authoring their lowest common denominator is still: plain text.<br>
XR Fragments allows us to enrich existing dataformats, by recursive use of existing technologies:<br>

1. addressibility and navigation of 3D scenes/objects: [URI Fragments](https://en.wikipedia.org/wiki/URI_fragment) + src/href spatial metadata 
1. hasslefree tagging across text and spatial objects using BiBTeX ([visual-meta](https://visual-meta.info) e.g.)

> NOTE: The chapters in this document are ordered from highlevel to lowlevel (technical) as much as possible

# Conventions and Definitions

|definition            | explanation                                                                                                               |
|----------------------|---------------------------------------------------------------------------------------------------------------------------|
|human                 | a sentient being who thinks fuzzy, absorbs, and shares thought (by plain text, not markuplanguage)                        |
|scene                 | a (local/remote) 3D scene or 3D file (index.gltf e.g.)                                                                    |
|3D object             | an object inside a scene characterized by vertex-, face- and customproperty data.                                         |
|metadata              | custom properties of text, 3D Scene or Object(nodes), relevant to machines and a human minority (academics/developers)    |
|XR fragment           | URI Fragment with spatial hints (`#pos=0,0,0&t=1,100` e.g.)                                                               |
|src                   | (HTML-piggybacked) metadata of a 3D object which instances content                                                        |
|href                  | (HTML-piggybacked) metadata of a 3D object which links to content                                                         |
|query                 | an URI Fragment-operator which queries object(s) from a scene (`#q=cube`)                                                 |
|visual-meta           | [visual-meta](https://visual.meta.info) data appended to text which is indirectly visible/editable in XR.                 |
|requestless metadata  | opposite of networked metadata (RDF/HTML request-fanouts easily cause framerate-dropping, hence not used a lot in games). |
|FPS                   | frames per second in spatial experiences (games,VR,AR e.g.), should be as high as possible                                |
|introspective         | inward sensemaking ("I feel this belongs to that")                                                                        |
|extrospective         | outward sensemaking ("I'm fairly sure John is a person who lives in oklahoma")                                            |
|`◻`                   | ascii representation of an 3D object/mesh                                                                                 |

# Core principle

XR Fragments strives to serve humans first, machine(implementations) later, by ensuring hasslefree text-to-thought feedback loops.<br>
This also means that the repair-ability of machine-matters should be human friendly too (not too complex).<br>

> "When a car breaks down, the ones without turbosupercharger are easier to fix"

# List of URI Fragments

| fragment     | type     | example           | info                                                              |
|--------------|----------|-------------------|-------------------------------------------------------------------|
| `#pos`       | vector3  | `#pos=0.5,0,0`    | positions camera to xyz-coord 0.5,0,0                             |
| `#rot`       | vector3  | `#rot=0,90,0`     | rotates camera to xyz-coord 0.5,0,0                               |
| `#t`         | vector2  | `#t=500,1000`     | sets animation-loop range between frame 500 and 1000              |
| `#......`    | string   | `#.cubes` `#cube` | object(s) of interest (fragment to object name or class mapping)  |

> xyz coordinates are similar to ones found in SVG Media Fragments

# List of metadata for 3D nodes 

| key          | type     | example (JSON)     | info                                                   |
|--------------|----------|--------------------|--------------------------------------------------------|
| `name`       | string   | `"name": "cube"`   | available in all 3D fileformats & scenes               |
| `class`      | string   | `"class": "cubes"` | available through custom property in 3D fileformats    |
| `href`       | string   | `"href": "b.gltf"` | available through custom property in 3D fileformats    |
| `src`        | string   | `"src": "#q=cube"` | available through custom property in 3D fileformats    |

Popular compatible 3D fileformats: `.gltf`, `.obj`, `.fbx`, `.usdz`, `.json` (THREEjs), `COLLADA` and so on.

> NOTE: XR Fragments are file-agnostic, which means that the metadata exist in programmatic 3D scene(nodes) too.

# Navigating 3D

Here's an ascii representation of a 3D scene-graph which contains 3D objects `◻` and their metadata:

```
  +--------------------------------------------------------+ 
  |                                                        |
  |  index.gltf                                            |
  |    │                                                   |
  |    ├── ◻ buttonA                                       |
  |    │      └ href: #pos=1,0,1&t=100,200                 |
  |    │                                                   |
  |    └── ◻ buttonB                                       |
  |           └ href: other.fbx                            |   <-- file-agnostic (can be .gltf .obj etc)
  |                                                        |
  +--------------------------------------------------------+

```

An XR Fragment-compatible browser viewing this scene, allows the end-user to interact with the `buttonA` and `buttonB`.<br>
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

An XR Fragment-compatible browser viewing this scene, lazy-loads and projects `painting.png` onto the (plane) object called `canvas` (which is copy-instanced in the bed and livingroom).<br>
Also, after lazy-loading `ocean.com/aquarium.gltf`, only the queried objects `bass` and `tuna` will be instanced inside `aquariumcube`.<br>
Resizing will be happen accordingly to its placeholder object (`aquariumcube`), see chapter Scaling.<br>


# Text in XR (tagging,linking to spatial objects)

We still think and speak in simple text, not in HTML or RDF.<br>
It would be funny when people would shout `<h1>FIRE!</h1>` in case of emergency.<br>
Given the myriad of new (non-keyboard) XR interfaces, keeping text as is (not obscuring with markup) is preferred.<br>
Ideally metadata must come **later with** text, but not **obfuscate** the text, or **in another** file.<br>

> Humans first, machines (AI) later.

This way:

1. XR Fragments allows <b id="tagging-text">hasslefree XR text tagging</b>, using BibTeX metadata **at the end of content** (like [visual-meta](https://visual.meta.info)).
1. XR Fragments allows hasslefree <a href="#textual-tag">textual tagging</a>, <a href="#spatial-tag">spatial tagging</a>, and <a href="#supra-tagging">supra tagging</a>, by mapping 3D/text object (class)names to BibTeX
3. inline BibTeX is the minimum required **requestless metadata**-layer for XR text, RDF/JSON is great but optional (and too verbose for the spec-usecases).
5. Default font (unless specified otherwise) is a modern monospace font, for maximized tabular expressiveness (see [the core principle](#core-principle)).
6. anti-pattern: hardcoupling a mandatory **obtrusive markuplanguage** or framework with an XR browsers (HTML/VRML/Javascript) (see [the core principle](#core-principle))
7. anti-pattern: limiting human introspection, by immediately funneling human thought into typesafe, precise, pre-categorized metadata like RDF (see [the core principle](#core-principle))

This allows recursive connections between text itself, as well as 3D objects and vice versa, using **BiBTeX-tags** :

```
  +--------------------------------------------------+
  | My Notes                                         |
  |                                                  |
  | The houses seen here are built in baroque style. |   
  |                                                  |   
  | @house{houses,                                <----- XR Fragment triple/tag: tiny & phrase-matching BiBTeX
  |   url  = {#.house}              <------------------- XR Fragment URI
  | }                                                |
  +--------------------------------------------------+
```

This sets up the following associations in the scene:

1. <b id="textual-tagging">textual tag</b>: text or spatial-occurences named 'houses' is now automatically tagged with 'house' 
1. <b id="spatial-tagging">spatial tag</b>: spatial object(s) with class:house (#.house) is now automatically tagged with 'house'
1. <b id="supra-tagging">supra-tag</b>: text- or spatial-object named 'house' (spatially) elsewhere, is now automatically tagged with 'house' 

Spatial wires can be rendered, words can be highlighted, spatial objects can be highlighted, links can be manipulated by the user.

> The simplicity of appending BibTeX (humans first, machines later) is demonstrated by [visual-meta](https://visual-meta.info) in greater detail, and makes it perfect for GUI's to generate (bib)text later. Humans can still view/edit the metadata manually, by clicking 'toggle metadata' on the 'back' (contextmenu e.g.) of any XR text, anywhere anytime.

## Default Data URI mimetype 

The `src`-values work as expected (respecting mime-types), however:

The XR Fragment specification bumps the traditional default browser-mimetype 

`text/plain;charset=US-ASCII` 

to a green eco-friendly:

`text/plain;charset=utf-8;bibtex=^@`

This indicates that any bibtex metadata starting with `@` will automatically get filtered out and:

* automatically detects textual links between textual and spatial objects 

It's concept is similar to literate programming.
Its implications are that local/remote responses can now:

* (de)multiplex/repair human text and requestless metadata (see [the core principle](#core-principle))
* no separated implementation/network-overhead for metadata (see [the core principle](#core-principle)) 
* ensuring high FPS: HTML/RDF historically is too 'requesty' for game studios
* rich send/receive/copy-paste everywhere by default, metadata being retained (see [the core principle](#core-principle))
* less network requests, therefore less webservices, therefore less servers, and overall better FPS in XR 

> This significantly expands expressiveness and portability of human text, by **postponing machine-concerns to the end of the human text** in contrast to literal interweaving of content and markupsymbols (or extra network requests, webservices e.g.).

For all other purposes, regular mimetypes can be used (but are not required by the spec).<br>
To keep XR Fragments a lightweight spec, BiBTeX is used for text-spatial object mappings (not a scripting language or RDF e.g.). 

> Applications are also free to attach any JSON(LD / RDF) to spatial objects using custom properties (but is not interpreted by this spec).

## URL and Data URI

```
  +--------------------------------------------------------------+  +------------------------+
  |                                                              |  | author.com/article.txt |
  |  index.gltf                                                  |  +------------------------+
  |    │                                                         |  |                        |
  |    ├── ◻ article_canvas                                      |  | Hello friends.         |
  |    │    └ src: ://author.com/article.txt                     |  |                        |
  |    │                                                         |  | @friend{friends        |
  |    └── ◻ note_canvas                                         |  |   ...                  |
  |           └ src:`data:welcome human @...`                    |  | }                      | 
  |                                                              |  +------------------------+
  |                                                              |
  +--------------------------------------------------------------+
```

The enduser will only see `welcome human` and `Hello friends` rendered spatially.
The beauty is that text (AND visual-meta) in Data URI promotes rich copy-paste.
In both cases, the text gets rendered immediately (onto a plane geometry, hence the name '_canvas').
The XR Fragment-compatible browser can let the enduser access visual-meta(data)-fields after interacting with the object (contextmenu e.g.).

The mapping between 3D objects and text (src-data) is simple:

Example:

```
  +------------------------------------------------------------------------------------+ 
  |                                                                                    | 
  |  index.gltf                                                                        | 
  |    │                                                                               | 
  |    └── ◻ rentalhouse                                                               | 
  |           └ class: house                                                           | 
  |           └ ◻ note                                                                 | 
  |                 └ src:`data: todo: call owner                                      |
  |                              @house{owner,                                         |
  |                                url  = {#.house}                                    |
  |                              }`                                                    |
  +------------------------------------------------------------------------------------+
```

Attaching visualmeta as `src` metadata to the (root) scene-node hints the XR Fragment browser.
3D object names and classes map to `name` of visual-meta glossary-entries.
This allows rich interaction and interlinking between text and 3D objects:

1. When the user surfs to https://.../index.gltf#AI the XR Fragments-parser points the enduser to the AI object, and can show contextual info about it.
2. When (partial) remote content is embedded thru XR Fragment queries (see XR Fragment queries), its related visual-meta can be embedded along.

## BibTeX as lowest common denominator for tagging/triples

The everything-is-text focus of BiBTex is a great advantage for introspection, and perhaps a necessary bridge towards RDF (extrospective).
BibTeX-appendices (visual-meta e.g.) are already adopted in the physical world (academic books), perhaps due to its terseness & simplicity:

1. <b id="frictionless-copy-paste">frictionless copy/pasting</b> (by humans) of (unobtrusive) content AND metadata
1. an introspective 'sketchpad' for metadata, which can (optionally) mature into RDF later 

| characteristic                     | Plain Text (with BibTeX)    | RDF                       |
|------------------------------------|-----------------------------|---------------------------|
| perspective                        | introspective               | extrospective             |
| space/scope                        | local                       | world                     |
| everything is text (string)        | yes                         | no                        |
| leaves (dictated) text intact      | yes                         | no                        |
| markup language(s)                 | no (appendix)               | ~4 different              |                 
| polyglot format                    | no                          | yes                       |
| easy to copy/paste content+metadata| yes                         | depends                   |
| easy to write/repair               | yes                         | depends                   |
| easy to parse                      | yes (fits on A4 paper)      | depends                   |
| infrastructure storage             | selfcontained (plain text)  | (semi)networked           |
| tagging                            | yes                         | yes                       |
| freeform tagging/notes             | yes                         | depends                   |     
| specialized file-type              | no                          | yes                       |
| copy-paste preserves metadata      | yes                         | depends                   |
| emoji                              | yes                         | depends                   |
| predicates                         | free                        | pre-determined            |
| implementation/network overhead    | no                          | depends                   |
| used in (physical) books/PDF       | yes (visual-meta)           | no                        |
| terse categoryless predicates      | yes                         | no                        |
| nested structures                  | no                          | yes                       |

> To serve humans first, human 'fuzzy symbolical mind' comes first, and ['categorized typesafe RDF hive mind'](https://en.wikipedia.org/wiki/Borg)) later.

## XR text (BibTeX) example parser

Here's a naive XR Text (de)multiplexer in javascript (which also supports visual-meta start/end-blocks):

```
xrtext = {
    
  decode: {
    text: (str) => {
        let meta={}, text='', last='', data = '';
        str.split(/\r?\n/).map( (line) => {
            if( !data ) data = last === '' && line.match(/^@/) ? line[0] : ''  
            if( data ){
                if( line === '' ){
                    xrtext.decode.bibtex(data.substr(1),meta)
                    data=''
                }else data += `${line}\n`
            }
            text += data ? '' : `${line}\n`
            last=line
        })
        return {text, meta}      
    },
    bibtex: (str,meta) => {
        let st = [meta]
        str
        .split(/\r?\n/ )
        .map( s => s.trim() ).join("\n") // be nice
        .replace( /}@/,  "}\n@"  )       // to authors
        .replace( /},}/, "},\n}" )       // which struggle
        .replace( /^}/,  "\n}"   )       // with writing single-line BiBTeX
        .split(   /\n/           )       //
        .filter( c => c.trim()   )       // actual processing:
        .map( (s) => {
          if( s.match(/(^}|-end})/) && st.length > 1 ) st.shift()
          else if( s.match(/^@/)    ) st.unshift( st[0][ s.replace(/(-start|,)/g,'') ] = {} )
          else s.replace( /(\w+)\s*=\s*{(.*)}(,)?/g, (m,k,v) => st[0][k] = v )
        })
        return meta
    }
  },
    
  encode: (text,meta) => {
    if( text === false ){
        if (typeof meta === "object") {
           return Object.keys(meta).map(k => 
               typeof meta[k] == "string" 
               ? `  ${k} = {${meta[k]}},`
               : `${ k.match(/[}{]$/) ? k.replace('}','-start}') : `${k},` }\n` +
                 `${ xrtext.encode( false, meta[k])}\n`                         +
                 `${  k.match(/}$/) ? k.replace('}','-end}') : '}' }\n`
                 .split("\n").filter( s => s.trim() ).join("\n")
            )
            .join("\n")
        }
        return meta.toString();
    }else return `${text}\n${xrtext.encode(false,meta)}`
  }

}

var {meta,text} = xrtext.decode.text(str)          // demultiplex text & bibtex
meta['@foo{']   = { "note":"note from the user"}   // edit metadata
xrtext.encode(text,meta)                           // multiplex text & bibtex back together 
```

> above can be used as a startingpoint for LLVM's to translate/steelman to any language.

# HYPER copy/paste 

The previous example, offers something exciting compared to simple copy/paste of 3D objects or text.
XR Fragment allows HYPER-copy/paste: time, space and text interlinked.
Therefore, the enduser in an XR Fragment-compatible browser can copy/paste/share data in these ways:

* time/space: 3D object (current animation-loop)
* text: TeXt object (including BiBTeX/visual-meta if any)
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

## including/excluding

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

## XR Fragment URI Grammar 

```
reserved    = gen-delims / sub-delims
gen-delims  = "#" / "&"
sub-delims  = "," / "="
```

> Example: `://foo.com/my3d.gltf#pos=1,0,0&prio=-5&t=0,100`

| Demo                          | Explanation                     |
|-------------------------------|---------------------------------|
| `pos=1,2,3`                   | vector/coordinate argument e.g. |
| `pos=1,2,3&rot=0,90,0&q=.foo` | combinators                     |

# Security Considerations

Since XR Text contains metadata too, the user should be able to set up tagging-rules, so the copy-paste feature can :

* filter out sensitive data when copy/pasting (XR text with `class:secret` e.g.)

# IANA Considerations

This document has no IANA actions.

# Acknowledgments

TODO acknowledge.
