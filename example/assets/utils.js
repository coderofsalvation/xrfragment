
// contentLoaders = {".gltf" : () => .....} and so on

export function loadFile(contentLoaders, multiple){
  return () => {
    let input = document.createElement('input');
    input.type = 'file';
    input.multiple = multiple;
    input.accept = Object.keys(contentLoaders).join(",");
    input.onchange = () => {
        let files = Array.from(input.files);
        let file = files.slice ? files[0] : files 
        for( var i in contentLoaders ){
          let r = new RegExp('\\'+i+'$')
          if( file.name.match(r) ) return contentLoaders[i](file)
        }
        alert(file.name+" is not supported")
    };
    input.click();
  }
}

export function setupConsole($console){
  $console.style.position = 'absolute'
  $console.style.display = 'block'
  $console.style.zIndex   = 1000;
  $console.style.background = "transparent !important"
  $console.style.pointerEvents = 'none'
  $console.style.top = '70px'
  $console.style.padding = '5px 20px 25px 25px'
  $console.style.left = $console.style.right = $console.style.bottom = 0;
  $console.style.color = '#0008';
  $console.style.fontSize = '12px';
  $console.style.fontFamily = 'Courier'
  $console.style.border = '0'
  $console.innerHTML = "XRFRAGMENT CONSOLE OUTPUT:\n" 

  console.log = ( (log) => function(){
    let s = new Date().toISOString().substr(11).substr(0,8) + " " + ([...arguments]).join(" ").replace(/.*[0-9]: /,"")
    log(s)
    let lines = String($console.innerHTML + "\n"+s).split("\n")
    while( lines.length > 200 ) lines.shift()
    $console.innerHTML = lines.join("\n")
    $console.scrollTop = $console.scrollHeight;
  })(console.log.bind(console))
}
