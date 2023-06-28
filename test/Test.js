module.exports  = function(opts){
    this.node   = typeof process != undefined && typeof process != "undefined"
    this.tests  = this.tests || []
    this.errors = 0
    this.error  = (msg) => { this.errors += 1; console.error("> error: "+msg) }
    this.add    = (description, cb) => this.tests.push({ description, cb })
    this.done   = (ready) => { console.log("\n> tests : "+this.tests.length+"\n> errors: "+this.errors); if( this.node ) process.exit( this.errors == 0 ? 0 : 1); ready(this) }
    this.run    = (ready) => {
        var p = Promise.resolve()
        var runTest = (i) => {
            return new Promise( (resolve, reject) => {
                var test = this.tests[i]
                if( !test ) return this.done(ready)
                var onError = (err) => { console.log("[ X ] "+test.description+"\n"); this.error(err); this.done(ready) }
                var _next   = () => { console.log("[ ✓ ] "+test.description); p.then(runTest(i+1)) }
                try { test.cb(_next, onError ) } catch (e) { onError(e) }
            })
        }
        p.then( runTest(0) )
    }
    return this
}
