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

This draft is a specification for 4D URLs & navigation, which links together space, time & text together, for hypermedia browsers with- or without a network-connection.<br> 
The specification promotes spatial addressibility, sharing, navigation, query-ing and annotating interactive (text)objects across for (XR) Browsers.<br>
XR Fragments allows us to enrich existing dataformats, by recursive use of existing proven technologies like [URI Fragments](https://en.wikipedia.org/wiki/URI_fragment) and BibTags notation.<br>

> Almost every idea in this document is demonstrated at [https://xrfragment.org](https://xrfragment.org)

{mainmatter}

# Introduction

How can we add more features to existing text & 3D scenes, without introducing new dataformats?<br>
Historically, there's many attempts to create the ultimate markuplanguage or 3D fileformat.<br>
Their lowest common denominator is: (co)authoring using plain text.<br>
XR Fragments allows us to enrich/connect existing dataformats, by recursive use of existing technologies:<br>

1. addressibility and navigation of 3D scenes/objects: [URI Fragments](https://en.wikipedia.org/wiki/URI_fragment) + src/href spatial metadata 
1. Interlinking text/& 3D by collapsing space into a Word Graph (XRWG) (and augmenting text with [bibs](https://github.com/coderofsalvation/tagbibs) / [BibTags](https://en.wikipedia.org/wiki/BibTeX) appendices (see [visual-meta](https://visual-meta.info) e.g.)
1. extend the hashtag-to-browser-viewport paradigm beyond 2D documents (XR documents)

> NOTE: The chapters in this document are ordered from highlevel to lowlevel (technical) as much as possible

# Core principle

XR Fragments strives to serve (nontechnical/fuzzy) humans first, and machine(implementations) later, by ensuring hasslefree text-vs-thought feedback loops.<br>
This also means that the repair-ability of machine-matters should be human friendly too (not too complex).<br>
XR Fragments tries to seek to connect the world of text (semantical web / RDF), and the world of pixels.<br>
Instead of combining them (in a game-editor e.g.), XR Fragments is opting for a more integrated path **towards** them, by describing how to make browsers **4D URL-ready**:

| principle            | XR 4D URL                                    | HTML 2D URL                           |
|----------------------|----------------------------------------------|---------------------------------------|
| the XRWG             | wordgraph (collapses 3D scene to tags)       | Ctrl-F (find)                         |
| the hashbus          | hashtags map to camera/scene-projections     | hashtags map to document positions    |
| spacetime hashtags   | positions camera, triggers scene-preset/time | jumps/scrolls to chapter              |

> XR Fragments does not look at XR (or the web) thru the lens of HTML.<br>But approaches things from a higherlevel browser-perspective:

```
 +----------------------------------------------------------------------------------------------+
 |                                                                                              |
 |   the soul of any URL:       ://macro        /meso            ?micro      #nano              |
 |                                                                                              |
 |                2D URL:       ://library.com  /document        ?search     #chapter           |
 |                                                                                              |
 |                4D URL:       ://park.com     /4Dscene.fbx --> ?search --> #view ---> hashbus |
 |                                                │                                      |      |
 |                                               XRWG <---------------------<------------+      |
 |                                                │                                      |      |
 |                                                ├─ objects --------------->------------|      |
 |                                                └─ text    --------------->------------+      |
 |                                                                                              |
 |                                                                                              |
 +----------------------------------------------------------------------------------------------+

```
 
Traditional webbrowsers can become 4D document-ready by:

* loading 3D assets (gltf/fbx e.g.) natively (not thru HTML).
* allowing assets to publish hashtags to themselves (the scene) using the hashbus (like hashtags controlling the scrollbar).
* collapsing the 3D scene to an wordgraph (for essential navigation purposes) controllable thru a hash(tag)bus

XR Fragments itself is HTML-agnostic, though pseudo-XR Fragment browsers **can** be implemented on top of HTML/Javascript. 

# Conventions and Definitions

See appendix below in case certain terms are not clear.

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

> this is already implemented in all browsers

# List of URI Fragments

| fragment     | type     | example           | info                                                                |
|--------------|----------|-------------------|---------------------------------------------------------------------|
| `#pos`       | vector3  | `#pos=0.5,0,0`    | positions camera to xyz-coord 0.5,0,0                               |
| `#rot`       | vector3  | `#rot=0,90,0`     | rotates camera to xyz-coord 0.5,0,0                                 |
| `#t`         | vector2  | `#t=500,1000`     | sets animation-loop range between frame 500 and 1000                |
| `#......`    | string   | `#.cubes` `#cube` | object(s) of interest (fragment-to-object-or-tagname)             |

> xyz coordinates are similar to ones found in SVG Media Fragments

# List of metadata for 3D nodes 

| key          | type     | example (JSON)         | info                                                   |
|--------------|----------|------------------------|--------------------------------------------------------|
| `name`       | string   | `"name": "cube"`       | available in all 3D fileformats & scenes               |
| `tag`        | string   | `"tag": "cubes geo"`   | available through custom property in 3D fileformats    |
| `href`       | string   | `"href": "b.gltf"`     | available through custom property in 3D fileformats    |
| `src`        | string   | `"src": "#cube"`       | available through custom property in 3D fileformats    |

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
  |    │      └ src: ://rescue.com/fish.gltf#bass%20tuna   |  +-------------------------+
  |    │                                                   |    
  |    ├── ◻ bedroom                                       |   
  |    │      └ src: #canvas                               |
  |    │                                                   |   
  |    └── ◻ livingroom                                    |      
  |           └ src: #canvas                               |
  |                                                        |
  +--------------------------------------------------------+
```

An XR Fragment-compatible browser viewing this scene, lazy-loads and projects `painting.png` onto the (plane) object called `canvas` (which is copy-instanced in the bed and livingroom).<br>
Also, after lazy-loading `ocean.com/aquarium.gltf`, only the queried objects `bass` and `tuna` will be instanced inside `aquariumcube`.<br>
Resizing will be happen accordingly to its placeholder object `aquariumcube`, see chapter Scaling.<br>

> Instead of cherrypicking objects with `#bass&tuna` thru `src`, queries can be used to import the whole scene (and filter out certain objects). See next chapter below.

# XR Fragment queries

Include, exclude, hide/shows objects using space-separated strings:

| example                          | outcome                                                                            |
|----------------------------------|------------------------------------------------------------------------------------|
|  `#q=-sky`                       | show everything except object named `sky`                                          |
|  `#q=-.language .english`        | hide everything with tag `language`, but show all tag `english` objects        |
|  `#q=price:>2 price:<5`          | of all objects with property `price`, show only objects with value between 2 and 5 |

It's simple but powerful syntax which allows <b>css</b>-like tag/id-selectors with a searchengine prompt-style feeling:

1. queries are a way to traverse a scene, and filter objects based on their tag- or property-values.
1. words starting with `.` like `.german` match tag-metadata of 3D objects like `"tag":"german"`
1. words starting with `.` like `.german` match tag-metadata of (BibTeX) tags in XR Text objects like `@german{KarlHeinz, ...` e.g. 

> **For example**: `#q=.foo` is a shorthand for `#q=tag:foo`, which will select objects with custom property `tag`:`foo`. Just a simple `#q=cube` will simply select an object named `cube`.

* see [an example video here](https://coderofsalvation.github.io/xrfragment.media/queries.mp4)

## including/excluding

| operator | info                                                                                                                          |
|----------|-------------------------------------------------------------------------------------------------------------------------------|
| `-`      | removes/hides object(s)                                                                                                       |
| `:`      | indicates an object-embedded custom property key/value                                                                        |
| `.`      | alias for `"tag" :".foo"` equals `tag:foo`                                                                                 |
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
1. detect tag selectors like `.foo` (reference regex: `/^[-]?tag$/` )
1. detect number values like `foo:1` (reference regex: `/^[0-9\.]+$/` )
1. expand aliases like `.foo` into `tag:foo`
1. for every query token split string on `:`
1. create an empty array `rules`
1. then strip key-operator: convert "-foo" into "foo" 
1. add operator and value to rule-array
1. therefore we we set `id` to `true` or `false` (false=excluder `-`)
1. and we set `root` to `true` or `false` (true=`/` root selector is present)
1. we convert key '/foo' into 'foo'
1. finally we add the key/value to the store like `store.foo = {id:false,root:true}` e.g.

> An example query-parser (which compiles to many languages) can be [found here](https://github.com/coderofsalvation/xrfragment/blob/main/src/xrfragment/Query.hx)

# Embedding local/remote content (instancing)

`src` is the 3D version of the <a target="_blank" href="https://www.w3.org/html/wiki/Elements/iframe">iframe</a>.<br>
It instances content (in objects) in the current scene/asset.

| fragment | type | example value |
|----------|------|---------------|
|`src`| string (uri or [[predefined view|predefined_view]] or [[query|queries]]) | `#cube`<br>`#q=-ball_inside_cube`<br>`#q=-/sky -rain`<br>`#q=-.language .english`<br>`#q=price:>2 price:<5`<br>`https://linux.org/penguin.png`<br>`https://linux.world/distrowatch.gltf#t=1,100`<br>`linuxapp://conference/nixworkshop/apply.gltf#q=flyer`<br>`androidapp://page1?tutorial#pos=0,0,1&t1,100`|


1. local/remote content is instanced by the `src` (query) value (and attaches it to the placeholder mesh containing the `src` property) 
1. <b>local</b> `src` values (URL **starting** with `#`, like `#cube&foo`) means **only** the mentioned objectnames will be copied to the instanced scene (from the current scene) while preserving their names (to support recursive selectors). [[(example code)|https://github.com/coderofsalvation/xrfragment/blob/main/src/3rd/js/three/xrf/src.js]] 
1. <b>local</b> `src` values indicating a query (`#q=`), means that all included objects (from the current scene) will be copied to the instanced scene (before applying the query) while preserving their names (to support recursive selectors). [[(example code)|https://github.com/coderofsalvation/xrfragment/blob/main/src/3rd/js/three/xrf/src.js]] 
1. the instanced scene (from a `src` value) should be <b>scaled accordingly</b> to its placeholder object or <b>scaled relatively</b> based on the scale-property (of a geometry-less placeholder, an 'empty'-object in blender e.g.). For more info see Chapter Scaling.
1. <b>external</b> `src` (file) values should be served with appropriate mimetype (so the XR Fragment-compatible browser will now how to render it). The bare minimum supported mimetypes are:
1. when only one object was cherrypicked (`#cube` e.g.), set its position to `0,0,0`

* `model/gltf+json`
* `image/png`
* `image/jpg`
* `text/plain;charset=utf-8;bib=^@`

## Scaling instanced content



# Text in XR (tagging,linking to spatial objects)

How does XR Fragments interlink text with objects?

> The XR Fragments does this by collapsing space into a **Word Graph** (the **XRWG**), augmented by Bib(s)Tex.

Instead of just throwing together all kinds media types into one experience (games), what about the intrinsic connections between them?<br>
Why is HTML adopted less in games outside the browser?
Through the lens of game-making, ideally metadata must come **with** that text, but not **obfuscate** the text, or **spawning another request** to fetch it.<br>
XR Fragments does this by detecting Bib(s)Tex, without introducing a new language or fileformat<br>

> Why Bib(s)Tex? Because its seems to be the lowest common denominator for an human-curated XRWG (extendable by speech/scanner/writing/typing e.g, see [further motivation here](https://github.com/coderofsalvation/hashtagbibs#bibs--bibtex-combo-lowest-common-denominator-for-linking-data))

Hence:

1. XR Fragments promotes (de)serializing a scene to the XRWG 
2. XR Fragments primes the XRWG, by collecting words from the `tag` and name-property of 3D objects.
3. XR Fragments primes the XRWG, by collecting words from **optional** metadata **at the end of content** of text (see default mimetype & Data URI)
4. [Bib's](https://github.com/coderofsalvation/hashtagbibs) and BibTex are first tag citizens for priming the XRWG with words (from XR text)
5. Like Bibs, XR Fragments generalizes the BibTex author/title-semantics (`author{title}`) into **this** points to **that** (`this{that}`)
6. The XRWG should be recalculated when textvalues (in `src`) change 
7. HTML/RDF/JSON is still great, but is beyond the XRWG-scope (they fit better in the application-layer)
8. Applications don't have to be able to access the XRWG programmatically, as they can easily generate one themselves by traversing the scene-nodes.
9. The XR Fragment focuses on fast and easy-to-generate end-user controllable word graphs (instead of complex implementations that try to defeat word ambiguity)

Example:

```
  http://y.io/z.fbx                                                           | Derived XRWG (shown as BibTex)
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
  |                                        |         └─ tag: house baroque    | 
  +----------------------------------------+                                  |
                                               [3D mesh ]                     |
                                               |    O   ├─ name: john         |                           
                                               |   /|\  |                     |
                                               |   / \  |                     |
                                               +--------+                     |
```  

> the `#john@baroque`-bib associates both text `John` and objectname `john`, with tag `baroque`

```

Another example:

```
  http://y.io/z.fbx                                                           | Derived XRWG (printed as BibTex)
  ----------------------------------------------------------------------------+--------------------------------------
                                                                              | 
  +-[src: data:.....]----------------------+   +-[3D mesh]-+                  | @house{castle,
  | Chapter one                            |   |    / \    |                  |   url = {https://y.io/z.fbx#castle}
  |                                        |   |   /   \   |                  | }
  | John built houses in baroque style.    |   |  /     \  |                  | @baroque{castle,
  |                                        |   |  |_____|  |                  |   url = {https://y.io/z.fbx#castle}
  | #john@baroque                          |   +-----│-----+                  | }
  | @baroque{john}                         |         │                        | @baroque{john}
  |                                        |         ├─ name: castle          | 
  |                                        |         └─ tag: house baroque    | 
  +----------------------------------------+                                  | @house{baroque}
                                               [3D mesh ]                     | @todo{baroque}
  +-[remotestorage.io / localstorage]------+   |    O   + name: john          | 
  | #baroque@todo@house                    |   |   /|\  |                     | 
  | ...                                    |   |   / \  |                     | 
  +----------------------------------------+   +--------+                     | 
```  

> both `#john@baroque`-bib and BibTex `@baroque{john}` result in the same XRWG, however on top of that 2 tages (`house` and `todo`) are now associated with text/objectname/tag 'baroque'.

As seen above, the XRWG can expand [bibs](https://github.com/coderofsalvation/hashtagbibs) (and the whole scene) to BibTeX.<br>
This allows hasslefree authoring and copy-paste of associations **for and by humans**, but also makes these URLs possible:

| URL example                           | Result                                                                    |
|---------------------------------------|---------------------------------------------------------------------------|
| `https://my.com/foo.gltf#.baroque`    | highlights mesh `john`, 3D mesh `castle`, text `John built(..)`           |
| `https://my.com/foo.gltf#john`        | highlights mesh `john`, and the text `John built (..)`                    |
| `https://my.com/foo.gltf#house`       | highlights mesh `castle`, and other objects with tag `house` or `todo`  |

> [hashtagbibs](https://github.com/coderofsalvation/hashtagbibs) potentially allow the enduser to annotate text/objects by **speaking/typing/scanning associations**, which the XR Browser saves to remotestorage (or localStorage per toplevel URL). As well as, referencing BibTags per URI later on: `https://y.io/z.fbx#@baroque@todo` e.g.

The XRWG allows XR Browsers to show/hide relationships in realtime at various levels:

* wordmatch **inside** `src` text 
* wordmatch **inside** `href` text
* wordmatch object-names 
* wordmatch object-tagnames 

Spatial wires can be rendered, words/objects can be highlighted/scaled etc.<br>
Some pointers for good UX (but not necessary to be XR Fragment compatible):

9. The XR Browser needs to adjust tag-scope based on the endusers needs/focus (infinite tagging only makes sense when environment is scaled down significantly)
10. The XR Browser should always allow the human to view/edit the metadata, by clicking 'toggle metadata' on the 'back' (contextmenu e.g.) of any XR text, anywhere anytime.
12. respect multi-line BiBTeX metadata in text because of [the core principle](#core-principle)
13. Default font (unless specified otherwise) is a modern monospace font, for maximized tabular expressiveness (see [the core principle](#core-principle)).
14. anti-pattern: hardcoupling an XR Browser with a mandatory **markup/scripting-language** which departs from onubtrusive plain text (HTML/VRML/Javascript) (see [the core principle](#core-principle))
15. anti-pattern: limiting human introspection, by abandoning plain text as first tag citizen.

> The simplicity of appending metadata (and leveling the metadata-playfield between humans and machines) is also demonstrated by [visual-meta](https://visual-meta.info) in greater detail.

Fictional chat:

```
<John> Hey what about this: https://my.com/station.gltf#pos=0,0,1&rot=90,2,0&t=500,1000
<Sarah> I'm checking it right now 
<Sarah> I don't see everything..where's our text from yesterday?
<John> Ah wait, that's tagged with tag 'draft' (and hidden)..hold on, try this:
<John> https://my.com/station.gltf#.draft&pos=0,0,1&rot=90,2,0&t=500,1000
<Sarah> how about we link the draft to the upcoming YELLO-event?
<John> ok I'm adding #draft@YELLO 
<Sarah> Yesterday I also came up with other usefull assocations between other texts in the scene:
#event#YELLO
#2025@YELLO
<John> thanks, added.
<Sarah> Btw. I stumbled upon this spatial book which references station.gltf in some chapters:
<Sarah> https://thecommunity.org/forum/foo/mytrainstory.txt
<John> interesting, I'm importing mytrainstory.txt into station.gltf 
<John> ah yes, chapter three points to trainterminal_2A in the scene, cool
```

## Default Data URI mimetype 

The `src`-values work as expected (respecting mime-types), however:

The XR Fragment specification bumps the traditional default browser-mimetype 

`text/plain;charset=US-ASCII` 

to a hashtagbib(tex)-friendly one:

`text/plain;charset=utf-8;bib=^@`

This indicates that:

* utf-8 is supported by default
* lines beginning with `@` will not be rendered verbatim by default ([read more](https://github.com/coderofsalvation/hashtagbibs#hashtagbib-mimetypes))
* the XRWG should expand bibs to BibTex occurring in text (`#contactjohn@todo@important` e.g.) 

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
  |    │                                                         |  | @book{greatgatsby      |
  |    └── ◻ note_canvas                                         |  |   ...                  |
  |           └ src:`data:welcome human\n@book{sunday...}`       |  | }                      | 
  |                                                              |  +------------------------+
  |                                                              |
  +--------------------------------------------------------------+
```

The enduser will only see `welcome human` and `Hello friends` rendered verbatim (see mimetype).
The beauty is that text in Data URI automatically promotes rich copy-paste (retaining metadata).
In both cases, the text gets rendered immediately (onto a plane geometry, hence the name '_canvas').
The XR Fragment-compatible browser can let the enduser access visual-meta(data)-fields after interacting with the object (contextmenu e.g.).

> additional tagging using [bibs](https://github.com/coderofsalvation/hashtagbibs): to tag spatial object `note_canvas` with 'todo', the enduser can type or speak `#note_canvas@todo`

## XR Text example parser 

To prime the XRWG with text from plain text `src`-values, here's an example XR Text (de)multiplexer in javascript (which supports inline bibs & bibtex):

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

The above functions (de)multiplexe text/metadata, expands bibs, (de)serialize bibtex and vice versa

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

# Security Considerations

Since XR Text contains metadata too, the user should be able to set up tagging-rules, so the copy-paste feature can :

* filter out sensitive data when copy/pasting (XR text with `tag:secret` e.g.)

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
|the XRWG              | wordgraph (collapses 3D scene to tags)       |
|the hashbus           | hashtags map to camera/scene-projections     |
|spacetime hashtags    | positions camera, triggers scene-preset/time |
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

