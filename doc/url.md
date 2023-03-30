# URI Value types

| type | info | format | example                          |
|------|------|--------|----------------------------------|
|vector| x,y,z| comma-separated    | #pos=1,2,3           |
|string| color| FFFFFF (hex)      | #fog=5m,FFAACC        |
|string|      |                   | #q=-sun               |
|int   |      | [-]x[xxxxx]       | #price:>=100          |
|float |      | [-]x[.xxxx] (ieee)| #prio=-20
|array | mixed| \|-separated      | #pos=0,0,0|90,0,0     |

> in general type-limitations will piggyback JSON limitations (IEEE floatsize e.g.)
