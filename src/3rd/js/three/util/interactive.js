// wrapper to collect interactive raycastable objects 

xrf.interactiveGroup = function(THREE,renderer,camera){

  let {
    Group,
    Matrix4,
    Raycaster,
    Vector2
  } = THREE 

  const _pointer = new Vector2();
  const _event = { type: '', data: _pointer };
  let object   = {selected:false}

  class interactive extends Group {

    constructor( renderer, camera ) {

      super();

      if( !renderer || !camera ) return 

      // extract camera when camera-rig is passed
      camera.traverse( (n) =>  String(n.type).match(/Camera/) ? camera = n : null )

      const scope = this;
      scope.objects = []
      scope.raycastAll = false


      const raycaster = new Raycaster();
      const tempMatrix = new Matrix4();

      // Pointer Events
      const element = renderer.domElement;

      const getAllMeshes = (scene) => {
        let objects = []
        xrf.scene.traverse( (n) => {
          if( !n.material || n.type != 'Mesh' ) return
          objects.push(n)
        })
        return objects
      }

      function onPointerEvent( event ) {

        //event.stopPropagation();

        const rect = renderer.domElement.getBoundingClientRect();

        _pointer.x = ( event.clientX - rect.left ) / rect.width * 2 - 1;
        _pointer.y = - ( event.clientY - rect.top ) / rect.height * 2 + 1;

        raycaster.setFromCamera( _pointer, camera );

        let objects = scope.raycastAll ? getAllMeshes(xrf.scene) : scope.objects 
        const intersects = raycaster.intersectObjects( objects, false )

        if ( intersects.length > 0 ) {

          const intersection = intersects[ 0 ];

          object = intersection.object;
          const uv = intersection.uv;

          _event.type = event.type;
          if( uv ) _event.data.set( uv.x, 1 - uv.y );
          object.dispatchEvent( _event );

        }else{
          if( object.selected ) {
            _event.type = 'mouseleave'
            object.dispatchEvent( _event)
          }
        }

      }

      element.addEventListener( 'pointerdown', onPointerEvent );
      element.addEventListener( 'pointerup', onPointerEvent );
      element.addEventListener( 'pointermove', onPointerEvent );
      element.addEventListener( 'mousedown', onPointerEvent );
      element.addEventListener( 'mousemove', onPointerEvent );
      element.addEventListener( 'click', onPointerEvent );
      element.addEventListener( 'mouseup', onPointerEvent );

      // WebXR Controller Events
      // TODO: Dispatch pointerevents too

      const eventsMapper = {
        'move': 'mousemove',
        'select': 'click',
        'selectstart': 'mousedown',
        'selectend': 'mouseup'
      };

      function onXRControllerEvent( event ) {

        const controller = event.target;

        tempMatrix.identity().extractRotation( controller.matrixWorld );

        raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
        raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );

        let objects = scope.raycastAll ? getAllMeshes(xrf.scene) : scope.objects 
        const intersects = raycaster.intersectObjects( objects, false )

        if ( intersects.length > 0 ) {


          const intersection = intersects[ 0 ];

          object = intersection.object;
          const uv = intersection.uv;

          _event.type = eventsMapper[ event.type ];
          console.log( (new Date()).getTime()+" "+event.type+":"+_event.type+" "+object.name)
          if( uv ) _event.data.set( uv.x, 1 - uv.y );

          object.dispatchEvent( _event );

        }else{
          if( object.selected ) {
            _event.type = 'mouseleave'
            object.dispatchEvent(_event)
          }
        }

      }

      const controller1 = renderer.xr.getController( 0 );
      controller1.addEventListener( 'move', onXRControllerEvent );
      controller1.addEventListener( 'select', onXRControllerEvent );
      controller1.addEventListener( 'selectstart', onXRControllerEvent );
      controller1.addEventListener( 'selectend', onXRControllerEvent );

      const controller2 = renderer.xr.getController( 1 );
      controller2.addEventListener( 'move', onXRControllerEvent );
      controller2.addEventListener( 'select', onXRControllerEvent );
      controller2.addEventListener( 'selectstart', onXRControllerEvent );
      controller2.addEventListener( 'selectend', onXRControllerEvent );

    }

    // we create our own add to avoid unnecessary unparenting of buffergeometries from 
    // their 3D model (which breaks animations)
    add(obj, unparent){
      if( unparent ) Group.prototype.add.call( this, obj )
      this.objects.push(obj)
    }

    clear(){
      while( this.children[0] != undefined ) this.children[0].remove()
      this.objects = [] 
    }

  }

  return new interactive(renderer,camera)
}
