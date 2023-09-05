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
XR Fragments allows us to enrich existing dataformats, by recursive use of existing proven technologies like [URI Fragments](https://en.wikipedia.org/wiki/URI_fragment) and BibTeX notation.<br>

> Almost every idea in this document is demonstrated at [https://xrfragment.org](https://xrfragment.org)

{mainmatter}

# Introduction

How can we add more features to existing text & 3D scenes, without introducing new dataformats?<br>
Historically, there's many attempts to create the ultimate markuplanguage or 3D fileformat.<br>
However, thru the lens of authoring, their lowest common denominator is still: plain text.<br>
XR Fragments allows us to enrich/connect existing dataformats, by recursive use of existing technologies:<br>

1. addressibility and navigation of 3D scenes/objects: [URI Fragments](https://en.wikipedia.org/wiki/URI_fragment) + src/href spatial metadata 
1. hasslefree tagging across text and spatial objects using [BibTeX](https://en.wikipedia.org/wiki/BibTeX) 'tags' as appendix (see [visual-meta](https://visual-meta.info) e.g.)

> NOTE: The chapters in this document are ordered from highlevel to lowlevel (technical) as much as possible

# Core principle

XR Fragments strives to serve (nontechnical/fuzzy) humans first, and machine(implementations) later, by ensuring hasslefree text-vs-thought feedback loops.<br>
This also means that the repair-ability of machine-matters should be human friendly too (not too complex).<br>

> "When a car breaks down, the ones **without** turbosupercharger are easier to fix"

Let's always focus on average humans: the 'fuzzy symbolical mind' must be served first, before serving the greater ['categorized typesafe RDF hive mind'](https://en.wikipedia.org/wiki/Borg)).

> Humans first, machines (AI) later.

# Conventions and Definitions

|definition            | explanation                                                                                                                   |
|----------------------|-------------------------------------------------------------------------------------------------------------------------------|
|human                 | a sentient being who thinks fuzzy, absorbs, and shares thought (by plain text, not markuplanguage)                            |
|scene                 | a (local/remote) 3D scene or 3D file (index.gltf e.g.)                                                                        |
|3D object             | an object inside a scene characterized by vertex-, face- and customproperty data.                                             |
|metadata              | custom properties of text, 3D Scene or Object(nodes), relevant to machines and a human minority (academics/developers)        |
|XR fragment           | URI Fragment with spatial hints like `#pos=0,0,0&t=1,100` e.g.                                                                |
|src                   | (HTML-piggybacked) metadata of a 3D object which instances content                                                            |
|href                  | (HTML-piggybacked) metadata of a 3D object which links to content                                                             |
|query                 | an URI Fragment-operator which queries object(s) from a scene like `#q=cube`                                                  |
|visual-meta           | [visual-meta](https://visual.meta.info) data appended to text/books/papers which is indirectly visible/editable in XR.        |
|requestless metadata  | opposite of networked metadata (RDF/HTML requests can easily fan out into framerate-dropping, hence not used a lot in games). |
|FPS                   | frames per second in spatial experiences (games,VR,AR e.g.), should be as high as possible                                    |
|introspective         | inward sensemaking ("I feel this belongs to that")                                                                            |
|extrospective         | outward sensemaking ("I'm fairly sure John is a person who lives in oklahoma")                                                |
|`◻`                   | ascii representation of an 3D object/mesh                                                                                     |
|(un)obtrusive         | obtrusive: wrapping human text/thought in XML/HTML/JSON obfuscates human text into a salad of machine-symbols and words       |

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
 **replace the current scene** with a new one, like `other.fbx`.

# Embedding 3D content 

Here's an ascii representation of a 3D scene-graph with 3D objects `◻` which embeds remote & local 3D objects `◻` (without) using queries:

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
Resizing will be happen accordingly to its placeholder object `aquariumcube`, see chapter Scaling.<br>


# Text in XR (tagging,linking to spatial objects)

We still think and speak in simple text, not in HTML or RDF.<br>
The most advanced human will probably not shout `<h1>FIRE!</h1>` in case of emergency.<br>
Given the new dawn of (non-keyboard) XR interfaces, keeping text as is (not obscuring with markup) is preferred.<br>
Ideally metadata must come **later with** text, but not **obfuscate** the text, or **in another** file.<br>

> Humans first, machines (AI) later ([core principle](#core-principle)

This way:

1. XR Fragments allows <b id="tagging-text">hasslefree XR text tagging</b>, using BibTeX metadata **at the end of content** (like [visual-meta](https://visual.meta.info)).
1. XR Fragments allows hasslefree <a href="#textual-tag">textual tagging</a>, <a href="#spatial-tag">spatial tagging</a>, and <a href="#supra-tagging">supra tagging</a>, by mapping 3D/text object (class)names using BibTeX 'tags'
3. inline BibTeX 'tags' are the minimum required **requestless metadata**-layer for XR text, RDF/JSON is great (but fits better in the application-layer)
5. Default font (unless specified otherwise) is a modern monospace font, for maximized tabular expressiveness (see [the core principle](#core-principle)).
6. anti-pattern: hardcoupling a mandatory **obtrusive markuplanguage** or framework with an XR browsers (HTML/VRML/Javascript) (see [the core principle](#core-principle))
7. anti-pattern: limiting human introspection, by immediately funneling human thought into typesafe, precise, pre-categorized metadata like RDF (see [the core principle](#core-principle))

This allows recursive connections between text itself, as well as 3D objects and vice versa, using **BibTeX-tags** :

```
  +--------------------------------------------------+
  | My Notes                                         |
  |                                                  |
  | The houses seen here are built in baroque style. |   
  |                                                  |   
  | @house{houses,                                <----- XR Fragment triple/tag: phrase-matching BibTeX 
  |   url  = {#.house}              <------------------- XR Fragment URI
  | }                                                |
  +--------------------------------------------------+
```

This allows instant realtime tagging of objects at various scopes:

| scope                                 | matching algo                                                                                                                                                          |
|---------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <b id="textual-tagging">textual</b>   | text containing 'houses' is now automatically tagged with 'house' (incl. plaintext `src` child nodes)                                                                  |
| <b id="spatial-tagging">spatial</b>   | spatial object(s) with `"class":"house"` (because of `{#.house}`) are now automatically tagged with 'house' (incl. child nodes)                                        |
| <b id="supra-tagging">supra</b>       | text- or spatial-object(s) (non-descendant nodes) elsewhere, named 'house', are automatically tagged with 'house' (current node to root node)                          |
| <b id="omni-tagging">omni</b>         | text- or spatial-object(s) (non-descendant nodes) elsewhere, containing class/name 'house', are automatically tagged with 'house' (too node to all nodes)              |
| <b id="infinite-tagging">infinite</b> | text- or spatial-object(s) (non-descendant nodes) elsewhere, containing class/name 'house' or 'houses', are automatically tagged with 'house' (too node to all nodes)  |

This empowers the enduser spatial expressiveness (see [the core principle](#core-principle)): spatial wires can be rendered, words can be highlighted, spatial objects can be highlighted/moved/scaled, links can be manipulated by the user.<br>
The simplicity of appending BibTeX 'tags' (humans first, machines later) is also demonstrated by [visual-meta](https://visual-meta.info) in greater detail.

1. The XR Browser needs to offer a global setting/control to adjust tag-scope with at least range: `[text, spatial, text+spatial, supra, omni, infinite]`
1. The XR Browser should always allow the human to view/edit the BibTex metadata manually, by clicking 'toggle metadata' on the 'back' (contextmenu e.g.) of any XR text, anywhere anytime.

> NOTE: infinite matches both 'house' and 'houses' in text, as well as spatial objects with `"class":"house"` or name "house". This multiplexing of id/category is deliberate because of [the core principle](#core-principle).

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
To keep XR Fragments a lightweight spec, BibTeX is used for text-spatial object mappings (not a scripting language or RDF e.g.). 

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

> "When a car breaks down, the ones **without** turbosupercharger are easier to fix"

Unlike XML or JSON, the typeless, unnested, everything-is-text nature of BibTeX tags is a great advantage for introspection.<br>
In a way, the RDF project should welcome it as a missing sensemaking precursor to (eventual) extrospective RDF.<br>
BibTeX-appendices are already used in the digital AND physical world (academic books, [visual-meta](https://visual-meta.info)), perhaps due to its terseness & simplicity.<br>
In that sense, it's one step up from the `.ini` fileformat (which has never leaked into the physical book-world):

1. <b id="frictionless-copy-paste">frictionless copy/pasting</b> (by humans) of (unobtrusive) content AND metadata
1. an introspective 'sketchpad' for metadata, which can (optionally) mature into RDF later 

| characteristic                     | UTF8 Plain Text (with BibTeX) | RDF                       |
|------------------------------------|-------------------------------|---------------------------|
| perspective                        | introspective                 | extrospective             |
| structure                          | fuzzy (sensemaking)           | precise                   |
| space/scope                        | local                         | world                     |
| everything is text (string)        | yes                           | no                        |
| leaves (dictated) text intact      | yes                           | no                        |
| markup language                    | just an appendix              | ~4 different              |                 
| polyglot format                    | no                            | yes                       |
| easy to copy/paste content+metadata| yes                           | up to application         |
| easy to write/repair for layman    | yes                           | depends                   |
| easy to (de)serialize              | yes (fits on A4 paper)        | depends                   |
| infrastructure                     | selfcontained (plain text)    | (semi)networked           |
| freeform tagging/annotation        | yes, terse                    | yes, verbose              |
| can be appended to text-content    | yes                           | up to application         |
| copy-paste text preserves metadata | yes                           | up to application         |
| emoji                              | yes                           | depends on encoding       |
| predicates                         | free                          | semi pre-determined       |
| implementation/network overhead    | no                            | depends                   |
| used in (physical) books/PDF       | yes (visual-meta)             | no                        |
| terse non-verb predicates          | yes                           | no                        |
| nested structures                  | no                            | yes                       |

## XR Text (w. BibTeX) example parser

Here's a XR Text (de)multiplexer in javascript (which also consumes start/end-blocks like in visual-meta):

```
xrtext = {
    
  decode: (str) => {
        let meta={}, text='', bibtex = [], cur = meta, section = ''
        regex= {
           bibtex:   /^@/,
           section:  { start: /@{(\S+)-start}/, suffix: /-(start|end)/},
           prop:     { key:   /=.*?{/ ,         stop:   /},/          },
           tag:      { start: /^@\S+[{,}]$/,    stop:   /}/           }           
        }
        let reset = () => { bibtex = []; cur = meta }
        str.split(/\r?\n/).map( (line) => {  
            if( Object.keys(meta).length == 0 && !line.match(regex.bibtex) ) 
                text += line+'\n'
            if( line.match(regex.section.start) ) 
                section = line.match(regex.section.start)
            if( bibtex.length ){
                bibtex.push(line) 
                token = bibtex.join('')
                if( token.match( regex.prop.key ) && token.match(/},/) ){ 
                    value  = token.substr( token.indexOf('{')+1, token.lastIndexOf('}') )
                    key    = token.replace(/=.*/,'').trim()
                    cur[ key ] = value.replace(regex.prop.stop,'').trim()
                    token = token.lastIndexOf('}') == token.length-1 
                            ? ''
                            : token.substr( token.lastIndexOf('},')+2 )
                    bibtex = [ token + ' ']
                }else if( token.match(regex.tag.stop) ) reset()
            }else if( line.trim().match(regex.bibtex) ){
                bibtex = [' ']
                key = line.trim().match(regex.tag.start)[0]
                if( key.match(regex.section.suffix) ) return
                cur = ( cur[ key ] = {} )
                if( section ){
                  cur.section = section[0].replace(regex.section.suffix,'')
                                          .replace(/[@}{]/g,'')                
                }
            }          
        })
        return {text, meta}      
  },
    
  encode: (text,meta) => {
    str = text+"\n"
    for( let i in meta ){
      let item = meta[i]
      str += `${i}\n`
      for( let j in item ) str += `  ${j} = {${item[j]}}\n`
      str += `}\n`
    }
    return str 
  }

}

var {meta,text} = xrtext.decode(str)             // demultiplex text & bibtex tags
meta['@foo{']   = { "note":"note from the user"} // edit metadata
out = xrtext.encode(text,meta)                   // multiplex text & bibtex tags back together 
```

> above can be used as a startingpoint for LLVM's to translate/steelman to a more formal form/language.

1. The XR Fragments spec (de)serializes does not aim to harden the BiBTeX format
2. Dumb, unnested BiBTeX: always deserialize to a flat lookuptable of tags for speed & simplicity ([core principle](#core-principle))
3. multi-line BibTex values should be supported 
4. BibTeX snippets should always start in the beginning of a line (regex: ^@), hence mimetype `text/plain;charset=utf-8;bibtex=^@`
5. Be strict in sending (`encode()`) Dumb Bibtex (start/stop-section becomes a property) (*)
6. Be liberal in receiving, hence a relatively bigger `decode()`  (also supports [visual-meta](https://visual-meta.info) start/stop-sections e.g.)

```
@{references-start}
@misc{emilyHegland/Edgar&Frod,
 author = {Emily Hegland},
 title = {Edgar & Frode Hegland, November 2021},
 year = {2021},
 month = {11},
}
```

The above BibTeX-flavor can be imported, however will be rewritten to Dumb BibTeX, to satisfy rule 2 & 5, as well as the [core principle](#core-principle)

```
@visual-meta{
 version = {1.1},
 generator = {Author 7.6.2 (1064)},
 section = {visual-meta-header}
}
@misc{emilyHegland/Edgar&Frod,
 author = {Emily Hegland},
 title = {Edgar & Frode Hegland, November 2021},
 year = {2021},
 month = {11},
 section = {references}
}
```

# HYPER copy/paste 

The previous example, offers something exciting compared to simple copy/paste of 3D objects or text.
XR Fragment allows HYPER-copy/paste: time, space and text interlinked.
Therefore, the enduser in an XR Fragment-compatible browser can copy/paste/share data in these ways:

1. time/space: 3D object (current animation-loop)
1. text: TeXt object (including BibTeX/visual-meta if any)
1. interlinked: Collected objects by visual-meta tag

# XR Fragment queries

Include, exclude, hide/shows objects using space-separated strings:

* `#q=cube`
* `#q=cube -ball_inside_cube`
* `#q=* -sky`
* `#q=-.language .english`
* `#q=cube&rot=0,90,0`
* `#q=price:>2 price:<5`

It's simple but powerful syntax which allows <b>css</b>-like class/id-selectors with a searchengine prompt-style feeling:

1. queries are showing/hiding objects **only** when defined as `src` value (prevents sharing of scene-tampered URL's).
1. queries are highlighting objects when defined in the top-Level (browser) URL (bar).
1. search words like `cube` and `foo` in `#q=cube foo` are matched against 3D object names or custom metadata-key(values)
1. search words like `cube` and `foo` in `#q=cube foo` are matched against tags (BibTeX) inside plaintext `src` values like `@cube{redcube, ...` e.g.
1. `#` equals `#q=*`
1. words starting with `.` like `.german` match class-metadata of 3D objects like `"class":"german"`
1. words starting with `.` like `.german` match class-metadata of (BibTeX) tags in XR Text objects like `@german{KarlHeinz, ...` e.g. 

> **For example**: `#q=.foo` is a shorthand for `#q=class:foo`, which will select objects with custom property `class`:`foo`. Just a simple `#q=cube` will simply select an object named `cube`.

* see [an example video here](https://coderofsalvation.github.io/xrfragment.media/queries.mp4)

## including/excluding

| operator | info                                                                                                                          |
|----------|-------------------------------------------------------------------------------------------------------------------------------|
| `*`      | select all objects (only useful in `src` custom property)                                                                     |
| `-`      | removes/hides object(s)                                                                                                       |
| `:`      | indicates an object-embedded custom property key/value                                                                        |
| `.`      | alias for `"class" :".foo"` equals `class:foo`                                                                                 |
| `>` `<`  | compare float or int number                                                                                                   |
| `/`      | reference to root-scene.<br>Useful in case of (preventing) showing/hiding objects in nested scenes (instanced by `src`) (*) |

> \* = `#q=-/cube` hides object `cube` only in the root-scene (not nested `cube` objects)<br> `#q=-cube` hides both object `cube` in the root-scene <b>AND</b> nested `skybox` objects |

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
1. finally we add the key/value to the store like `store.foo = {id:false,root:true}` e.g.

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
