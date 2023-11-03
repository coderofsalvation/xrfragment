javy compile index.js -o index.wasm
echo '{ "n": 2, "bar": "baz" }' | wasmtime index.wasm
