
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

export function setupConsole(el){
  if( !el ) return setTimeout( () => setupConsole( $('.lil-gui') ),200 )
  let $console = document.createElement('textarea')
  $console.style.position = 'absolute'
  $console.style.display = 'block'
  $console.style.zIndex   = 2000;
  $console.style.background = "transparent !important"
  $console.style.pointerEvents = 'none'
  $console.style.top = '70px'
  $console.style.padding = '10px'
  $console.style.margin = '10px'
  $console.style.background = '#000'
  $console.style.left = $console.style.right = $console.style.bottom = 0;
  $console.style.color = '#A6F';
  $console.style.fontSize = '10px';
  $console.style.fontFamily = 'Courier'
  $console.style.border = '0'
  $console.innerHTML = "XRFRAGMENT CONSOLE OUTPUT:\n" 

  el.appendChild($console)

  console.log = ( (log) => function(){
    let s = new Date().toISOString().substr(11).substr(0,8) + " " + ([...arguments]).join(" ").replace(/.*[0-9]: /,"")
    log(s)
    let lines = String($console.innerHTML + "\n"+s).split("\n")
    while( lines.length > 200 ) lines.shift()
    $console.innerHTML = lines.join("\n")
    $console.scrollTop = $console.scrollHeight;
  })(console.log.bind(console))
}

export function setupUrlBar(el){

  var isIframe = (window === window.parent || window.opener) ? false : true;
  if( isIframe ){
    // show internal URL bar to test XR fragments interactively 
    el.style.display = 'block'
    let nav = window.AFRAME.XRF.navigator

    AFRAME.XRF.navigator.to = ((to) => (url,e) => {
      to(url,e)
      reflectUrl(url)
    })(AFRAME.XRF.navigator.to)

    const reflectUrl = (url) => el.value = url || document.location.search.substr(1) + document.location.hash
    reflectUrl()
  }
}
