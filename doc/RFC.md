
<link rel="stylesheet" href="style.css"/>
<link href="https://fonts.cdnfonts.com/css/montserrat" rel="stylesheet"/>

> version 1.0.0

date: 2023-04-27T22:44:39+0200<br>
[![Actions Status](https://github.com/coderofsalvation/xrfragment/workflows/test/badge.svg)](https://github.com/coderofsalvation/xrfragment/actions)

# XRFragment Grammar 

```
    reserved    = gen-delims / sub-delims
    gen-delims  = "#" / "&"                      
    sub-delims  = "," / "|" / "="
```
<br>

> Example: `://foo.com/my3d.asset#pos=1,0,0&prio=-5&t=0,100|100,200`

<br>

| Explanation | |
|-|-|
| `x=1,2,3` | vector/coordinate argument e.g. |
| `x=foo\|bar|1,2,3|1.0` | the `\|` character is used for:<br>1.specifying `n` arguments for xrfragment `x`<br>2. roundrobin of values (in case provided arguments exceeds `n` of `x` for #1) when triggered by browser URI (clicking `href` e.g.)|
| `https://x.co/1.gltf||xyz://x.co/1.gltf` | multi-protocol/fallback urls  |
| `.mygroup` | query-alias for `class:mygroup` |

> Focus: hasslefree 3D vector-data (`,`), multi-protocol/fallback-linking & dynamic values (`|`), and CSS-piggybacking (`.mygroup`) 

# URI parser
> icanhazcode? yes, see [URI.hx](https://github.com/coderofsalvation/xrfragment/blob/main/src/xrfragment/URI.hx)

1. fragment URI starts with `#`
1. fragments are split by `&`
1. store key/values into a associative array or dynamic object
1. loop thru each fragment
1. for each fragment split on `=` to separate key/values 
1. fragment-values are urlencoded (space becomes `+` using `encodeUriComponent` e.g.)
1. every recognized fragment key/value-pair is added to a central map/associative array/object

# XR Fragments parser

> icanhazcode? yes, see [Parser.hx](https://github.com/coderofsalvation/xrfragment/blob/main/src/xrfragment/Parser.hx)
the gist of it:

1. check if param exist

