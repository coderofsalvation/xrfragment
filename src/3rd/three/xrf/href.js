xrfragment.xrf.href = function(v, opts){
  let { mesh, model, camera, scene, renderer, THREE} = opts
  return

	// Create a shader material that treats the texture as an equirectangular map
	mesh.texture = mesh.material.map // backup texture
	const equirectShader = THREE.ShaderLib[ 'equirect' ];
	const equirectMaterial = new THREE.ShaderMaterial( {
		  uniforms: THREE.UniformsUtils.merge([
				THREE.UniformsLib.equirect,
				equirectShader.uniforms,
			]),
			vertexShader: equirectShader.vertexShader,
			fragmentShader: equirectShader.fragmentShader,
			side: THREE.DoubleSide //THREE.FrontSide //THREE.DoubleSide //THREE.BackSide
	} );
	equirectMaterial.uniforms[ 'tEquirect' ].value = mesh.texture
	// Define the tEquirectInvProjection uniform
	equirectMaterial.uniforms.tEquirectInvProjection = {
		value: new THREE.Matrix4(),
	};
	// Assign the new material to the mesh
	mesh.material = equirectMaterial; 
	console.dir(mesh.material)
  mesh.texture.wrapS = THREE.RepeatWrapping;

  // patch custom model renderloop
	model.render = ((render) => (scene,camera) => {

		// Store the original projection matrix of the camera
		const originalProjectionMatrix = camera.projectionMatrix.clone();
		// Calculate the current camera view matrix
		const aspectRatio = mesh.texture.image.width / mesh.texture.image.height;
		camera.projectionMatrix.makePerspective(camera.fov, aspectRatio, camera.near, camera.far);

		const viewMatrix = camera.matrixWorldInverse;
		const worldMatrix = mesh.matrixWorld;

		const equirectInvProjection = new THREE.Matrix4();
		equirectInvProjection.copy(camera.projectionMatrix).multiply(viewMatrix).invert();

		// Update the equirectangular material's tEquirect uniform
		equirectMaterial.uniforms.tEquirect.value = mesh.texture;
		equirectMaterial.uniforms.tEquirectInvProjection.value.copy(
			equirectInvProjection
		);

		// Reset the camera projection matrix
		camera.projectionMatrix.copy(originalProjectionMatrix);


		render(scene,camera)

	})(model.render)	

  console.dir(mesh)
}
