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
XR Fragments allows us to enrich existing dataformats, by recursive use of existing proven technologies like [URI Fragments](https://en.wikipedia.org/wiki/URI_fragment) and BibTags notation.<br>

> Almost every idea in this document is demonstrated at [https://xrfragment.org](https://xrfragment.org)

{mainmatter}

# Introduction

How can we add more features to existing text & 3D scenes, without introducing new dataformats?<br>
Historically, there's many attempts to create the ultimate markuplanguage or 3D fileformat.<br>
Their lowest common denominator is: (co)authoring using plain text.<br>
XR Fragments allows us to enrich/connect existing dataformats, by recursive use of existing technologies:<br>

1. addressibility and navigation of 3D scenes/objects: [URI Fragments](https://en.wikipedia.org/wiki/URI_fragment) + src/href spatial metadata 
1. hasslefree tagging across text and spatial objects using [bibs](https://github.com/coderofsalvation/tagbibs) / [BibTags](https://en.wikipedia.org/wiki/BibTeX) appendices (see [visual-meta](https://visual-meta.info) e.g.)

> NOTE: The chapters in this document are ordered from highlevel to lowlevel (technical) as much as possible

# Core principle

XR Fragments strives to serve (nontechnical/fuzzy) humans first, and machine(implementations) later, by ensuring hasslefree text-vs-thought feedback loops.<br>
This also means that the repair-ability of machine-matters should be human friendly too (not too complex).<br>

> "When a car breaks down, the ones **without** turbosupercharger are easier to fix"

Let's always focus on average humans: our fuzzy symbolical mind must be served first, before serving a greater [categorized typesafe RDF hive mind](https://en.wikipedia.org/wiki/Borg)).

> Humans first, machines (AI) later.

Thererfore, XR Fragments does not look at XR (or the web) thru the lens of HTML.<br>
XR Fragments itself is HTML-agnostic, though pseudo-XR Fragment browsers **can** be implemented on top of HTML/Javascript. 

# Conventions and Definitions

See appendix below in case certain terms are not clear.

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

Popular compatible 3D fileformats: `.gltf`, `.obj`, `.fbx`, `.usdz`, `.json` (THREE.js), `.dae` and so on.

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

Here's an ascii representation of a 3D scene-graph with 3D objects `◻` which embeds remote & local 3D objects `◻` with/out using queries:

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


# Text in XR (tagging,linking to spatial objects)

We still think and speak in simple text, not in HTML or RDF.<br>
The most advanced human will probably not shout `<h1>FIRE!</h1>` in case of emergency.<br>
Given the new dawn of (non-keyboard) XR interfaces, keeping text as is (not obscuring with markup) is preferred.<br>
Ideally metadata must come **with** text, but not **obfuscate** the text, or **spawning another request** to fetch it.<br>

```
Spectrum of speak/scan/write/listen/keyboard-friendly 'tagging' notations:

         (just # and @)    (string only)       (obuscated text)     (type-aware text)
                                 
       <---- Bibs ---------- BibTeX ---------- XML / HTML --------- JSON / YAML / RDF -------->

```

Hence:

1. XR Fragments promotes the importance of hasslefree plain text and string-based patternmatching
2. XR Fragments allows <b id="tagging-text">hasslefree spatial tagging</b>, by detecting metadata **at the end of content** of text (see default mimetype & Data URI)
3. XR Fragments allows <b id="tagging-objects">hasslefree spatial tagging</b>, by treating 3D object name/class-pairs as BibTeX tags.
4. XR Fragments promotes hasslefree <a href="#textual-tag">textual tagging</a>, <a href="#spatial-tag">spatial tagging</a>, and <a href="#supra-tagging">supra tagging</a>, by mapping 3D/text object (class)names to (tag)text-occurences.
5. XR Fragments supports **requestless metadata** when found in plain text data (of `src` metadata), for adding/describing relationships spatially.
6. **requestless metadata** should be string-only and typeless, and should be easy to edit/add by humans (using text).
7. Therefore, BibTeX and [Bib's](https://github.com/coderofsalvation/hashtagbibs) are first class citizens for XR text (HTML/RDF/JSON is great, but fits better in the application-layer)
8. Opening tags for metadata (`#`, `@`, `{`, or `<`) should always start at the beginning of the line.

This allows recursive connections between text itself, as well as 3D objects and vice versa.<br>

Here's an example by expanding polyglot metadata to **BibTeX** associations:

```
  http://y.io/z.fbx                                                           | Derived BibTex / 'wires' & tags    
  ----------------------------------------------------------------------------+--------------------------------------
                                                                              | @house{castle,
  +-[src: data:.....]----------------------+   +-[3D mesh]-+                  |   url = {https://y.io/z.fbx#castle}
  | Chapter one                            |   |    / \    |                  | }
  |                                        |   |   /   \   |                  | @baroque{castle,
  | John built houses in baroque style.    |   |  /     \  |                  |   url = {https://y.io/z.fbx#castle}
  |                                        |   |  |_____|  |                  | }
  | #john@baroque                          |   +-----│-----+                  | @baroque{john}
  |                                        |         │                        |
  |                                        |         ├─ name: castle          | 
  |                                        |         └─ class: house baroque  | 
  +----------------------------------------+                                  |
                                               [3D mesh ]                     |
  +-[remotestorage.io / localstorage]------+   |    O   + name: john          |                           
  | #contactjohn@todo@house                |   |   /|\  |                     |
  | ...                                    |   |   / \  |                     |
  +----------------------------------------+   +--------+                     |
```  

A (rare) example of polyglot tags:

```
  http://y.io/z.fbx                                                           | Derived BibTex / 'wires' & tags    
  ----------------------------------------------------------------------------+--------------------------------------
                                                                              | @house{castle,
  +-[src: data:.....]----------------------+   +-[3D mesh]-+                  |   url = {https://y.io/z.fbx#castle}
  | Chapter one                            |   |    / \    |                  | }
  |                                        |   |   /   \   |                  | @baroque{castle,
  | John built houses in baroque style.    |   |  /     \  |                  |   url = {https://y.io/z.fbx#castle}
  |                                        |   |  |_____|  |                  | }
  | #john@baroque                          |   +-----│-----+                  | @baroque{john}
  | @house{baroque, info = {classic}, }    |         │                        | @house{baroque,
  | { "tag":"john", "match":"john"}        |         ├─ name: castle          |   info = {classic}
  | <tag name="john" match="john"/>        |         └─ class: house baroque  | }
  +----------------------------------------+                                  | @house{contactjohn}
                                               [3D mesh ]                     |   
  +-[remotestorage.io / localstorage]------+   |    O   + name: john          | @todo{contactjohn}
  | #contactjohn@todo@house                |   |   /|\  |                     | 
  | ...                                    |   |   / \  |                     | john{john}
  +----------------------------------------+   +--------+                     | 
```  

As seen above, we can extract tags/associations between text & 3D objects, by converting all scene metadata to (in this case) BibTeX, by expanding [hashtagbibs](https://github.com/coderofsalvation/hashtagbibs) and interpreting its polyglot tag-notation.<br>
One huge advantage of polyglot tags is authoring and copy-paste **by humans**, which will be discussed later in this spec.<br>

> [hashtagbibs](https://github.com/coderofsalvation/hashtagbibs) also allows the enduser to annotate text/objects by **speaking/typing/scanning associations**, which the XR Browser saves to remotestorage (or localStorage per toplevel URL). As well as, referencing BibTags per URI later on: `https://y.io/z.fbx#@baroque@todo` e.g.

The Evaluated BiBTeX allows XR Browsers to show/hide relationships in realtime at various levels:

| scope                                 | tag-matching algo                                                                                                                                                          |
|---------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <b id="textual-tagging">textual</b>   | text containing 'baroque' is now automatically tagged with 'house' (incl. plaintext `src` child nodes)                                                                 |
| <b id="spatial-tagging">spatial</b>   | spatial object(s) with name `baroque` or `"class":"house"` are now automatically tagged with 'house' (incl. child nodes)                                               |
| <b id="supra-tagging">supra</b>       | text- or spatial-object(s) (non-descendant nodes) elsewhere, (class)named 'baroque' or 'house', are automatically tagged with 'house' (current node to root nodes)     |
| <b id="omni-tagging">omni</b>         | text- or spatial-object(s) (non-descendant nodes) elsewhere, (class)named 'baroque' or 'house', are automatically tagged with 'house' (root node to all nodes)         |
| <b id="infinite-tagging">infinite</b> | text- or spatial-object(s) (non-descendant nodes) elsewhere, (class)named 'baroque' or 'house', are automatically tagged with 'house' (root node to all nodes )         |

This allows the enduser to adjust different levels of associations (see [the core principle](#core-principle)): spatial wires can be rendered, words/objects can be highlighted/scaled etc.<br>

> NOTE: infinite matches both 'baroque' and 'house'-occurences in text, as well as spatial objects with `"class":"house"` or name "baroque". This multiplexing of id/category is deliberate, in order to support [the core principle](#core-principle).

9. When moving/copying/pasting metadata, always prefer converting to string-only microformats (BibTex/Bibs)
10. respect multi-line metadata because of [the core principle](#core-principle)
11. Default font (unless specified otherwise) is a modern monospace font, for maximized tabular expressiveness (see [the core principle](#core-principle)).
12. anti-pattern: hardcoupling a mandatory **obtrusive markup/scripting-language** or with an XR browser (HTML/VRML/Javascript) (see [the core principle](#core-principle))
13. anti-pattern: limiting human introspection, by abandoning plain text as first class citizen.
14. The XR Browser needs to adjust tag-scope based on the endusers needs/focus (infinite tagging only makes sense when environment is scaled down significantly)
15. The XR Browser should always allow the human to view/edit the metadata, by clicking 'toggle metadata' on the 'back' (contextmenu e.g.) of any XR text, anywhere anytime.

> The simplicity of appending metadata (and leveling the metadata-playfield between humans and machines) is also demonstrated by [visual-meta](https://visual-meta.info) in greater detail.

## Default Data URI mimetype 

The `src`-values work as expected (respecting mime-types), however:

The XR Fragment specification bumps the traditional default browser-mimetype 

`text/plain;charset=US-ASCII` 

to a hashtagbib(tex)-friendly one:

`text/plain;charset=utf-8;bib=^@`

This indicates that:

* utf-8 is supported by default
* lines beginning with `@` will not be rendered verbatim by default (=Bibs/BibTex)
* bibs occurring in text (`#contactjohn@todo@important` e.g.) should expand to BibTeX

By doing so, the XR Browser (applications-layer) can interpret microformats ([visual-meta](https://visual-meta.info) 
to connect text further with its environment ( setup links between textual/spatial objects automatically e.g.).

> for more info on this mimetype see [bibs](https://github.com/coderofsalvation/hashtagbibs)

Advantages: 

* auto-expanding of [hashtagbibs](https://github.com/coderofsalvation/hashtagbibs) associations
* out-of-the-box (de)multiplex human text and metadata in one go (see [the core principle](#core-principle))
* no network-overhead for metadata (see [the core principle](#core-principle)) 
* ensuring high FPS: HTML/RDF historically is too 'requesty'/'parsy' for game studios
* rich send/receive/copy-paste everywhere by default, metadata being retained (see [the core principle](#core-principle))
* netto result: less webservices, therefore less servers, and overall better FPS in XR 

> This significantly expands expressiveness and portability of human tagged text, by **postponing machine-concerns to the end of the human text** in contrast to literal interweaving of content and markupsymbols (or extra network requests, webservices e.g.).

For all other purposes, regular mimetypes can be used (but are not required by the spec).<br>

## URL and Data URI

```
  +--------------------------------------------------------------+  +------------------------+
  |                                                              |  | author.com/article.txt |
  |  index.gltf                                                  |  +------------------------+
  |    │                                                         |  |                        |
  |    ├── ◻ article_canvas                                      |  | Hello friends.         |
  |    │    └ src: ://author.com/article.txt                     |  |                        |
  |    │                                                         |  | {                      |
  |    └── ◻ note_canvas                                         |  |   ...                  |
  |           └ src:`data:welcome human\n{...`                   |  | }                      | 
  |                                                              |  +------------------------+
  |                                                              |
  +--------------------------------------------------------------+
```

The enduser will only see `welcome human` and `Hello friends` rendered spatially (see mimetype).
The beauty is that text in Data URI automatically promotes rich copy-paste (retaining metadata).
In both cases, the text gets rendered immediately (onto a plane geometry, hence the name '_canvas').
The XR Fragment-compatible browser can let the enduser access visual-meta(data)-fields after interacting with the object (contextmenu e.g.).

> additional tagging using [bibs](https://github.com/coderofsalvation/hashtagbibs): to tag spatial object `note_canvas` with 'todo', the enduser can type or speak `@note_canvas@todo`

## XR Text example parser

Here's an example XR Text (de)multiplexer in javascript, which supports inline bibs & bibtex:

```
xrtext = {

  expandBibs: (text) => { 
    let bibs   = { regex: /(#[a-zA-Z0-9_+@\-]+(#)?)/g, tags: {}}
    text.replace( bibs.regex , (m,k,v) => {
       tok   = m.substr(1).split("@")
       match = tok.shift()
       if( tok.length ) tok.map( (t) => bibs.tags[t] = `@${t}{${match},\n}` )
       else if( match.substr(-1) == '#' ) 
          bibs.tags[match] = `@{${match.replace(/#/,'')}}`
       else bibs.tags[match] = `@${match}{${match},\n}`
    })
    return text.replace( bibs.regex, '') + Object.values(bibs.tags).join('\n')
  },
    
  decode: (str) => {
    // bibtex:     ↓@   ↓<tag|tag{phrase,|{ruler}>  ↓property  ↓end
    let pat    = [ /@/, /^\S+[,{}]/,                /},/,      /}/ ]
    let tags   = [], text='', i=0, prop=''
    let lines  = xrtext.expandBibs(str).replace(/\r?\n/g,'\n').split(/\n/)
    for( let i = 0; i < lines.length && !String(lines[i]).match( /^@/ ); i++ ) 
        text += lines[i]+'\n'

    bibtex = lines.join('\n').substr( text.length )
    bibtex.split( pat[0] ).map( (t) => {
        try{
           let v = {}
           if( !(t = t.trim())         ) return
           if( tag = t.match( pat[1] ) ) tag = tag[0]
           if( tag.match( /^{.*}$/ )   ) return tags.push({ruler:tag})
           if( tag.match( /}$/ )       ) return tags.push({k: tag.replace(/}$/,''), v: {}})
           t = t.substr( tag.length )
           t.split( pat[2] )
           .map( kv => {
             if( !(kv = kv.trim()) || kv == "}" ) return
             v[ kv.match(/\s?(\S+)\s?=/)[1] ] = kv.substr( kv.indexOf("{")+1 )
           })
           tags.push( { k:tag, v } )
        }catch(e){ console.error(e) }
    })
    return {text, tags}
  },

  encode: (text,tags) => {
    let str = text+"\n"
    for( let i in tags ){
      let item = tags[i]
      if( item.ruler ){
          str += `@${item.ruler}\n`
          continue;
      }
      str += `@${item.k}\n`
      for( let j in item.v ) str += `  ${j} = {${item.v[j]}}\n`
      str += `}\n`
    }
    return str
  }
}
```

The above functions (de)multiplexe text/metadata, expands bibs, (de)serialize bibtex (and all fits more or less on one A4 paper)

> above can be used as a startingpoint for LLVM's to translate/steelman to a more formal form/language.

```
str = `
hello world
here are some hashtagbibs followed by bibtex:

#world
#hello@greeting
#another-section#

@{some-section}
@flap{
  asdf = {23423}
}`

var {tags,text} = xrtext.decode(str)          // demultiplex text & bibtex
tags.find( (t) => t.k == 'flap{' ).v.asdf = 1 // edit tag
tags.push({ k:'bar{', v:{abc:123} })          // add tag
console.log( xrtext.encode(text,tags) )       // multiplex text & bibtex back together 
```
This expands to the following (hidden by default) BibTex appendix:

```
hello world
here are some hashtagbibs followed by bibtex:

@{some-section}
@flap{
  asdf = {1}
}
@world{world,
}
@greeting{hello,
}
@{another-section}
@bar{
  abc = {123}
}
```

> when an XR browser updates the human text, a quick scan for nonmatching tags (`@book{nonmatchingbook` e.g.) should be performed and prompt the enduser for deleting them.

# HYPER copy/paste 

The previous example, offers something exciting compared to simple copy/paste of 3D objects or text.
XR Text according to the XR Fragment spec, allows HYPER-copy/paste: time, space and text interlinked.
Therefore, the enduser in an XR Fragment-compatible browser can copy/paste/share data in these ways:

1. time/space: 3D object (current animation-loop)
1. text: TeXt object (including BibTeX/visual-meta if any)
1. interlinked: Collected objects by visual-meta tag

# Security Considerations

Since XR Text contains metadata too, the user should be able to set up tagging-rules, so the copy-paste feature can :

* filter out sensitive data when copy/pasting (XR text with `class:secret` e.g.)

# IANA Considerations

This document has no IANA actions.

# Acknowledgments

* [NLNET](https://nlnet.nl)
* [Future of Text](https://futureoftext.org)
* [visual-meta.info](https://visual-meta.info)

# Appendix: Definitions 

|definition            | explanation                                                                                                                          |
|----------------------|--------------------------------------------------------------------------------------------------------------------------------------|
|human                 | a sentient being who thinks fuzzy, absorbs, and shares thought (by plain text, not markuplanguage)                                   |
|scene                 | a (local/remote) 3D scene or 3D file (index.gltf e.g.)                                                                               |
|3D object             | an object inside a scene characterized by vertex-, face- and customproperty data.                                                    |
|metadata              | custom properties of text, 3D Scene or Object(nodes), relevant to machines and a human minority (academics/developers)               |
|XR fragment           | URI Fragment with spatial hints like `#pos=0,0,0&t=1,100` e.g.                                                                       |
|src                   | (HTML-piggybacked) metadata of a 3D object which instances content                                                                   |
|href                  | (HTML-piggybacked) metadata of a 3D object which links to content                                                                    |
|query                 | an URI Fragment-operator which queries object(s) from a scene like `#q=cube`                                                         |
|visual-meta           | [visual-meta](https://visual.meta.info) data appended to text/books/papers which is indirectly visible/editable in XR.               |
|requestless metadata  | metadata which never spawns new requests (unlike RDF/HTML, which can cause framerate-dropping, hence not used a lot in games)        |
|FPS                   | frames per second in spatial experiences (games,VR,AR e.g.), should be as high as possible                                           |
|introspective         | inward sensemaking ("I feel this belongs to that")                                                                                   |
|extrospective         | outward sensemaking ("I'm fairly sure John is a person who lives in oklahoma")                                                       |
|`◻`                   | ascii representation of an 3D object/mesh                                                                                            |
|(un)obtrusive         | obtrusive: wrapping human text/thought in XML/HTML/JSON obfuscates human text into a salad of machine-symbols and words              |
|BibTeX                | simple tagging/citing/referencing standard for plaintext                                                                             |
|BibTag                | a BibTeX tag                                                                                                                         |
|(hashtag)bibs         | an easy to speak/type/scan tagging SDL ([see here](https://github.com/coderofsalvation/hashtagbibs) which expands to BibTex/JSON/XML |

