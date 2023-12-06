> Quote: *"if one builds straight on top of web standards it’s going to be durable; tooling is fashionable and comes and goes"* ~ Diego Marcos (AFRAME)

| file                   | info                        |
|------------------------|-----------------------------|
| test                   |                             |
| ├── aframe             |                             |
| │   ├── index.html     | testrunner AFRAME           |
| │   ├── filter.js      | XRF<->THREE filter tests [[run online]](https://coderofsalvation.github.io/test/aframe) |
| │   ├── index.js       |                             |
| │   └── pubsub.js      | XRF promisable-events tests |
| ├── generated          |                              |
| │   ├── test.js        | parser tests (HaXe generated)|
| │   └── test.py        | parser tests (HaXe generated)|
| ├── test.js            | parser test manual          |
| ├── test.lua           | parser test manual          |
| └── test.py            | parser test manual          |

The generated tests use the parser [JSON spec in src/spec](src/spec) as input.<br>
In case of writing your own parser (without HaXe) you can use those JSON spec-files to ensure compatibility.
