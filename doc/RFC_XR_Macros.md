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
Therefore, XR Macros allows us to enrich/connect existing dataformats, by offering a polyglot notation based on existing notations:<br>

1. getting/setting common used 3D properties using querystring- or JSON-notation 

> NOTE: The chapters in this document are ordered from highlevel to lowlevel (technical) as much as possible

# Core principle

1. XR Macros use querystrings, but are HTML-agnostic (though pseudo-XR Fragment browsers **can** be implemented on top of HTML/Javascript). 
1. XR Macros represents setting/getting common used properties found in all popular 3D frameworks/(game)editors/internet browsers.

# Conventions and Definitions

See appendix below in case certain terms are not clear.

# List of XR Macros 

(XR) Macros can be embedded in 3D assets/scenes.<br></br
Macros allow a limited logic-layer, by recursive (economic) use of the querystring syntax (which the XR Fragment parser already uses).<br>
The only addition is the `|` symbol to roundrobin variable values.<br>
Macros also act as events, so more serious scripting languages can react to them as well.<br>

| custom property | value                    | assign (rr) variable ? | execute opcode? | show contextmenu?                         |
|-----------------|--------------------------|------------------------|-----------------|-------------------------------------------|
| &#33;clickme    | day&#124;noon&#124;night | yes                    | not yet         | only when multiple props start with &#33; |
| day             | bg=1,1,1                 | no                     | yes             | no                                        |
| noon            | bg=0.5,0.5,0.5           | yes                    | yes             | no                                        |
| night           | bg=0,0,0&foo=2           | yes                    | yes             | no                                        |

---

| custom property    | value                    | assign (rr) variable ? | execute opcode? | show contextmenu?           |
|--------------------|--------------------------|------------------------|-----------------|-----------------------------|
| &#33;turnofflights | night                    | no                     | yes             | yes because of &#33;clickme |
| &#33;clickme       | day&#124;noon&#124;night | yes                    | not yet         | yes because of &#33;clickme |
| day                | bg=1,1,1                 | no                     | yes             | no                          |
| noon               | bg=0.5,0.5,0.5           | yes                    | yes             | no                          |
| night              | bg=0,0,0&foo=2           | yes                    | yes             | no                          |


lazy evaluation:

| custom property | value                    | copy verbatim to URL? | (rr) variable [assingment]? |
|-----------------|--------------------------|-----------------------|-----------------------------|
| href            | #cyclepreset             | yes                   | no                          |
| cyclepreset     | day&#124;noon&#124;night | no                    | (yes) yes                   |
| day             | bg=1,1,1                 | no                    | yes [yes]                   |
| noon            | bg=0.5,0.5,0.5           | no                    | yes [yes]                   |
| night           | bg=0,0,0&foo=2           | no                    | yes [yes]                   |


# Security Considerations


# IANA Considerations

This document has no IANA actions.

# Acknowledgments

* [NLNET](https://nlnet.nl)
* [Future of Text](https://futureoftext.org)
* [visual-meta.info](https://visual-meta.info)

# Appendix: Definitions 

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
|requestless metadata  | metadata which never spawns new requests (unlike RDF/HTML, which can cause framerate-dropping, hence not used a lot in games) |
|FPS                   | frames per second in spatial experiences (games,VR,AR e.g.), should be as high as possible                                    |
|introspective         | inward sensemaking ("I feel this belongs to that")                                                                            |
|extrospective         | outward sensemaking ("I'm fairly sure John is a person who lives in oklahoma")                                                |
|`◻`                   | ascii representation of an 3D object/mesh                                                                                     |
|(un)obtrusive         | obtrusive: wrapping human text/thought in XML/HTML/JSON obfuscates human text into a salad of machine-symbols and words       |
|BibTeX                | simple tagging/citing/referencing standard for plaintext                                                                      |
|BibTag                | a BibTeX tag                                                                                                                  |

