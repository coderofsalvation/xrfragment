%%%
Title = "XR Macros"
area = "Internet"
workgroup = "Internet Engineering Task Force"

[seriesInfo]
name = "XR-Macros"
value = "draft-XRMACROS-leonvankammen-00"
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
<h1>XR Macros</h1>
<br>

<pre>
stream:    IETF
area:      Internet
status:    informational
author:    Leon van Kammen
date:      2023-04-12T00:00:00Z
workgroup: Internet Engineering Task Force
value:     draft-XRMACROS-leonvankammen-00
</pre>  


}-->

.# Abstract

This draft offers a specification for embedding macros in existing 3D scenes/assets, to offer simple interactions and configure the renderer further.<br>
Together with URI Fragments, it allows for rich immersive experiences without the need of a complicated sandboxed scripting languages.

> Almost every idea in this document is demonstrated at [https://xrfragment.org](https://xrfragment.org), as this spec was created during the [XR Fragments](https://xrfragment.org) spec.

{mainmatter}

# Introduction

How can we add more features to existing text & 3D scenes, without introducing new dataformats?<br>
Historically, there's many attempts to create the ultimate markuplanguage or 3D fileformat.<br>
Their lowest common denominator is: (co)authoring using plain text.<br>
Therefore, XR Macros allows us to enrich/connect existing dataformats, by offering a polyglot notation based on existing notations:<br>

1. getting/setting common used 3D properties using querystring- or JSON-notation 
1. querying 3D properties using the lightweight searchengine notation used in [XR Fragments](https://xrfragment.org)

> NOTE: The chapters in this document are ordered from highlevel to lowlevel (technical) as much as possible

# Core principle

1. XR Macros use querystrings, but are HTML-agnostic (though pseudo-XR Fragment browsers **can** be implemented on top of HTML/Javascript). 
1. XR Macros represents setting/getting common used properties found in all popular 3D frameworks/(game)editors/internet browsers.
1. XR Macros acts as simple eventhandlers for URI Fragments

# Conventions and Definitions

See appendix below in case certain terms are not clear.

# List of XR Macros 

(XR) Macros can be embedded in 3D assets/scenes.<br>
Macros enrich existing spatial content with a lowcode, limited logic-layer, by recursive (economic) use of the querystring syntax (which search engines and [XR Fragments](https://xrfragment.org) already uses.<br>
This is done by allowing string/integer variables, and the `|` symbol to roundrobin variable values.<br>
Macros also act as events, so more serious scripting languages can react to them as well.<br>

## Usecase: click object

| custom property | value                    | trigger when           |
|-----------------|--------------------------|------------------------|
| !clickme        | bg=1,1,1&foo=2           | object clicked         |

## Usecase: conditional click object

| custom property | value                    | trigger when                |
|-----------------|--------------------------|-----------------------------|
| #               | foo=1                    | scene                       |
| !clickme        | q=foo>2&bg=1,1,1         | object clicked and foo > 2  |

> when a user clicks an object with the custom properties above, it should set the backgroundcolor to `1,1,1` when `foo` is greater than `2` (see previous example)

## Usecase: click object (roundrobin)

| custom property | value                    | trigger when           |
|-----------------|--------------------------|------------------------|
| !clickme        | day&#124;noon&#124;night | object clicked         |
| day             | bg=1,1,1                 | roundrobin             |
| noon            | bg=0.5,0.5,0.5           | roundrobin             |
| night           | bg=0,0,0&foo=2           | roundrobin             |

> when a user clicks an object with the custom properties above, it should trigger either `day` `noon` or `night` in roundrobin fashion.

## Usecase: click object, URI fragment and scene load

| custom property | value                    | trigger when           |
|-----------------|--------------------------|------------------------|
| #               | random                   | scene loaded           |
| #random         | random                   | URL contains #random   |
| !random         | day&#124;noon&#124;night | #random, # or click    |
| day             | bg=1,1,1                 | roundrobin             |
| noon            | bg=0.5,0.5,0.5           | roundrobin             |
| night           | bg=0,0,0&foo=2           | roundrobin             |

## Usecase: present context menu with options

| custom property | value                    | trigger when           |
|-----------------|--------------------------|------------------------|
| !random         | day|noon|night           | clicked in contextmenu |
| !day            | bg=1,1,1                 | clicked in contextmenu |
| !noon           | bg=0.5,0.5,0.5           | clicked in contextmenu |
| !night          | bg=0,0,0&foo=2           | clicked in contextmenu |

> The XR Browser should offer a contextmenu with these options when more than one `!`-macro is present on an object.

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
|scene                 | a (local/remote) 3D scene or 3D file (index.gltf e.g.)                                                                        |
|3D object             | an object inside a scene characterized by vertex-, face- and customproperty data.                                             |
|XR fragments          | URI Fragment with spatial hints like `#pos=0,0,0&t=1,100` e.g.                                                                |
|query                 | an URI Fragment-operator which queries object(s) from a scene like `#q=cube`                                                  |
|FPS                   | frames per second in spatial experiences (games,VR,AR e.g.), should be as high as possible                                    |
|`◻`                   | ascii representation of an 3D object/mesh                                                                                     |
|(un)obtrusive         | obtrusive: wrapping human text/thought in XML/HTML/JSON obfuscates human text into a salad of machine-symbols and words       |
