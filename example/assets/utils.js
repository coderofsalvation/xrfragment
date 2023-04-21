
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
