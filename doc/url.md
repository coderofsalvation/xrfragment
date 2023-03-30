> version 1.0.0


# Fragment (values)
 
| param   | type          | category                | example          |
|---------|---------------|-------------------------|------------------|
| pos     | 3D vector     | HREF navigation/portals | `#pos=1,0,1` or `#pos=foo` |
| prio    | int (-10..1)  | Asset linking           | `#prio=-5` |


# Url parser (the gist of it)

1. fragment URI starts with `#`
1. fragments are split by `&`
1. fragment-values are urlencoded (space becomes `+` using `encodeUriComponent` e.g.)
1. `=` is used to split fragment key/values 
1. `|` is used to split multiple/fallback values
1. `,` assumes 1D/2D/3D vector-values like x[,y[,z]]
1. parseFloat(..) and parseInt(..) is applied to vector/float and int values 
1. anything else will be treated as string-value 
1. incompatible value-types will be dropped / not used

> the xrfragment specification should stay simple enough
> for anyone to write a parser using either regexes or grammar/lexers
> therefore expressions/comprehensions are not supported (max wildcard/comparison operators for queries e.g.)

# Value types

| type | info | format | example                          |
|------|------|--------|----------------------------------|
|vector| x,y,z| comma-separated    | #pos=1,2,3           |
|string| color| FFFFFF (hex)      | #fog=5m,FFAACC        |
|string|      |                   | #q=-sun               |
|int   |      | [-]x[xxxxx]       | #price:>=100          |
|float |      | [-]x[.xxxx] (ieee)| #prio=-20
|array | mixed| \|-separated      | #pos=0,0,0|90,0,0     |

> rule for thumb: type-limitations will piggyback JSON limitations (IEEE floatsize e.g.)

1. hex colors are detected using regex `/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/`
1. integers are detected using regex `/^[0-9]+$/`
1. floats are detected using regex `/^[0-9]+\.[0-9]+$/`
1. vectors are detected using regex `/[,]/` (but can also be an string referring to an entity-ID in the asset)
