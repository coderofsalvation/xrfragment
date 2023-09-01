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
    text-align: justify;
    font-size: 15px;
    padding: 0% 20%;
    line-height: 30px;
    color:#555;
    background:#F0F0F3
  }
  h1 { margin-top:40px; }
  pre{ line-height:18px; }

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

{mainmatter}

# Introduction

How can we add more features to existing text & 3D scenes, without introducing new dataformats?
Historically, there's many attempts to create the ultimate markuplanguage or 3D fileformat.
However, thru the lens of authoring their lowest common denominator is still: plain text.
XR Fragments allows us to enrich existing dataformats, by recursive use of existing technologies:

* addressibility & navigation of 3D objects: [URI Fragments](https://en.wikipedia.org/wiki/URI_fragment) + (src/href) metadata
* addressibility & navigation of text objects: [visual-meta](https://visual-meta.info)

# Conventions and Definitions

* scene: a (local/remote) 3D scene or 3D file (index.gltf e.g.)
* 3D object: an object inside a scene characterized by vertex-, face- and customproperty data.
* metadata: custom properties defined in 3D Scene or Object(nodes) 
* XR fragment: URI Fragment with spatial hints (`#pos=0,0,0&t=1,100` e.g.)
* src: a (HTML-piggybacked) metadata-attribute of a 3D object which instances content
* href: a (HTML-piggybacked) metadata-attribute of a 3D object which links to content 
* query: an URI Fragment-operator which queries object(s) from a scene (`#q=cube`)

{::boilerplate bcp14-tagged}

# Navigating 3D

Here's an ascii representation of a 3D scene-graph which contains 3D objects (`◻`) and their metadata:

```
 index.gltf
   │
   ├── ◻ buttonA
   │      └ href: #pos=1,0,1&t=100,200
   │
   └── ◻ buttonB
          └ href: other.fbx

```

An XR Fragment-compatible browser viewing this scene, allows the end-user to interact with the `buttonA` and `buttonB`.
In case of `buttonA` the end-user will be teleported to another location and time in the **current loaded scene**, but `buttonB` will
 **replace the current scene** with a new one (`other.fbx`).

# Navigating text

TODO

# Embedding 3D content 

Here's an ascii representation of a 3D scene-graph with 3D objects (`◻`) which embeds remote & local 3D objects (`◻`) (without) using queries:

```
  +------------------------------------------------------------+  +---------------------------+ 
  |                                                            |  |                           |
  |  index.gltf                                                |  | rescue.com/aquarium.gltf  |
  |    │                                                       |  |   │                       |
  |    ├── ◻ canvas                                            |  |   └── ◻ fishbowl          |
  |    │      └ src: painting.png                              |  |         ├─ ◻ bassfish     |
  |    │                                                       |  |         └─ ◻ tuna         |
  |    ├── ◻ aquariumcube                                      |  |                           |       
  |    │      └ src: ://rescue.com/fish.gltf#q=bassfish%20tuna |  +---------------------------+
  |    │                                                       |    
  |    ├── ◻ bedroom                                           |   
  |    │      └ src: #q=canvas                                 |
  |    │                                                       |   
  |    └── ◻ livingroom                                        |      
  |           └ src: #q=canvas                                 |
  |                                                            |
  +------------------------------------------------------------+
```

An XR Fragment-compatible browser viewing this scene, lazy-loads and projects `painting.png` onto the (plane) object called `canvas` (which is copy-instanced in the bed and livingroom).
Also, after lazy-loading `rescue.com/aquarium.gltf`, only the queried objects `bassfish` and `tuna` will be instanced inside `aquariumcube`.
Resizing will be happen accordingly to its placeholder object (`aquariumcube`), see chapter Scaling.

# Embedding text

# List of XR URI Fragments 

# Security Considerations

TODO Security

# IANA Considerations

This document has no IANA actions.

# Acknowledgments

TODO acknowledge.
