
# URI Value types

| type | info | format | example                          |
|------|------|--------|----------------------------------|
|vector| x,y,z| comma-separated    | #pos=1,2,3           |
|string| color| FFFFFF (hex)      | #fog=5m,FFAACC        |
|string|      |                   | #q=-sun               |
|int   |      | [-]x[xxxxx]       | #price:>=100          |
|float |      | [-]x[.xxxx] (ieee)| #prio=-20
|array | mixed| \|-separated      | #pos=0,0,0|90,0,0     |

> rule for thumb: type-limitations will piggyback JSON limitations (IEEE floatsize e.g.)

# Url parser (the gist of it)

1. fragment URI starts with `#`
1. fragments are split by `&`
1. fragment-values are urlencoded (` ` becomes `+` and so on)
1. `=` is used to indicate fragmentvalues
1. `|` is used to indicate multiple/fallback values
1. hex colors are detected using regex `/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/`
1. integers are detected using regex `/^[0-9]+$/`
1. floats are detected using regex `/^[0-9]+\.[0-9]+$/`
1. `,` is used to detect vector 1D/2D/3D values like x[,y[,z]]
1. anything else will be treated as string-value 
1. last resort: inappropriate string values will be converted using parseInt/parseFloat
