extends Node

class_name XRF

var rootScene
var isModelLoading = false

# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

####################################################################################################
# URI Related functions
####################################################################################################

func parseURL(url: String) -> Dictionary:
	var URI = {}
	
	# Split URL by '://' to get protocol and the rest of the URL
	var parts = url.split("://")
	if parts.size() > 1:
		URI["protocol"] = parts[0]
		url = parts[1]
	else:
		URI["protocol"] = "http" # Default to http if protocol is missing
	
	# Split URL by '/' to separate domain, path, and file
	parts = url.split("/")
	URI["domain"] = parts[0]
	if parts.size() > 1:
		var path_and_file = parts[1]
		var path_and_file_parts = path_and_file.split("/")
		if path_and_file_parts.size() > 1:
			URI["path"] = path_and_file_parts
			var file = path_and_file_parts.pop_back()
			URI["path"] = path_and_file_parts.join("/")
		else:
			URI["path"] = path_and_file
	
	# Check if there's a query string
	if url.find("?") != -1:
		parts = url.split("?")
		URI["path"] = parts[0]
		var args = parts[1]
		if args.find("#"):
			args = args.split("#")[0]
		URI["query"] = parseArgs(args)
	else:
		URI["query"] = {}
	
	# Check if there's a fragment
	if url.find("#") != -1:
		parts = url.split("#")
		URI["fragment"] = parseArgs(parts[1])
	else:
		URI["fragment"] = {}
	
	return URI

func parseArgs(fragment: String) -> Dictionary:
	var ARG = {}
	
	# Split fragment by '&' to separate items
	var items = fragment.split("&")
	
	for item in items:
		# Split item by '=' to separate key and value
		var key_value = item.split("=")
		if key_value.size() > 1:
			ARG[key_value[0]] = key_value[1]
		else:
			ARG[key_value[0]] = ""
	
	return ARG
	
####################################################################################################
# Model Related functions
####################################################################################################
	
# Download model by HTTP and run `downloadModelSuccess` if OK
func load(url):
	print("loading "+url)
	var http_request = HTTPRequest.new()
	add_child(http_request)
	http_request.request_completed.connect(downloadModelSuccess)
	
	var error = http_request.request(url)
	if error != OK:
		push_error("An error occurred in the HTTP request.")
		
	

func placeModelToEditorScene(model):
	add_child(model)
	#model.translate(Vector3(0.0, 0.0, -1.0))
	print("model added")
	
func downloadModelSuccess(result, response_code, headers, body):
	# TODO: here different parsing functions should be called
	#       based on the filetype (glb,gltf,ade,obj e.g.)
	loadModelFromBufferByGLTFDocument(body)

func loadModelFromBufferByGLTFDocument(body):
	print("loadModelFromBuffer")
	var doc = GLTFDocument.new()
	var state = GLTFState.new()
	#state.set_handle_binary_image(GLTFState.HANDLE_BINARY_EMBED_AS_BASISU) # Fixed in new Godot version (4.3 as I see) https://github.com/godotengine/godot/blob/17e7f85c06366b427e5068c5b3e2940e27ff5f1d/scene/resources/portable_compressed_texture.cpp#L116
	
	var error = doc.append_from_buffer(body, "", state)
	if error == OK:
		#var glb_importer_model: GLTFMesh = state.get_meshes()[0]
		#var glb_importer_model_mesh: ImporterMesh = glb_importer_model.get_mesh()
		var scene = doc.generate_scene(state)
		scene.set_meta("json",state.json)
		#var ok:Error = _parseExtras(state)
		traverse(scene, evalNode)
		self.placeModelToEditorScene(scene)
			
	else:
		print("Couldn't load glTF scene (error code: %s)." % error_string(error))	

func evalNode(node:Node):
	print(node.name)
	#if node.has_meta("extras"):
	#	print(node.get_meta("extras",""))
		
func traverse(node, f:Callable ):
	for N in node.get_children():
		if N.get_child_count() > 0:
			f.call(N)
			self.traverse(N,f)
		else:
			f.call(N)

func _parseExtras(state: GLTFState) -> Error:
	print( state.json.keys() )

	# Add metadata to materials
	var materials_json : Array = state.json.get("materials", [])
	var materials : Array[Material] = state.get_materials()
	for i in materials_json.size():
		if materials_json[i].has("extras"):
			materials[i].set_meta("extras", materials_json[i]["extras"])
		
	# Add metadata to ImporterMeshes
	var meshes_json : Array = state.json.get("meshes", [])
	var meshes : Array[GLTFMesh] = state.get_meshes()
	for i in meshes_json.size():
		if meshes_json[i].has("extras"):
			meshes[i].mesh.set_meta("extras", meshes_json[i]["extras"])
	
	# Add metadata to nodes
	var nodes_json : Array = state.json.get("nodes", [])
	for i in nodes_json.size():
		var node = state.get_scene_node(i)
		if !node:
			continue
		if nodes_json[i].has("extras"):
			# Handle special case
			if node is ImporterMeshInstance3D:
				# ImporterMeshInstance3D nodes will be converted later to either
				# MeshInstance3D or StaticBody3D and metadata will be lost
				# A sibling is created preserving the metadata. It can be later 
				# merged back in using a EditorScenePostImport script
				var metadata_node = Node.new()
				metadata_node.set_meta("extras", nodes_json[i]["extras"])
				
				# Meshes are also ImporterMeshes that will be later converted either
				# to ArrayMesh or some form of collision shape. 
				# We'll save it as another metadata item. If the mesh is reused we'll 
				# have duplicated info but at least it will always be accurate
				if node.mesh and node.mesh.has_meta("extras"):
					metadata_node.set_meta("mesh_extras", node.mesh.get_meta("extras"))
				
				# Well add it as sibling so metadata node always follows the actual metadata owner
				node.add_sibling(metadata_node)
				# Make sure owner is set otherwise it won't get serialized to disk
				metadata_node.owner = node.owner
				# Add a suffix to the generated name so it's easy to find
				metadata_node.name += "_meta"
			# In all other cases just set_meta
			else:
				node.set_meta("extras", nodes_json[i]["extras"])
	
	## now we merge extras to the scene
	#var verbose_output = []
	#var nodes : Array[Node] = scene.find_children("*" + "_meta", "Node")
	#verbose_output.append_array(["Metadata nodes:",  nodes])
	#for node in nodes:
		#var extras = node.get_meta("extras")
		#if !extras:
			#verbose_output.append("Node %s contains no 'extras' metadata" % node)
			#continue
		#var parent = node.get_parent()
		#if !parent:
			#verbose_output.append("Node %s has no parent" % node)
			#continue
		#var idx_original = node.get_index() - 1
		#if idx_original < 0 or parent.get_child_count() <= idx_original:
			#verbose_output.append("Original node index %s is out of bounds. Parent child count: %s" % [idx_original, parent.get_child_count()])
			#continue
		#var original = node.get_parent().get_child(idx_original)
		#if original:
			#verbose_output.append("Setting extras metadata for %s" % original)
			#original.set_meta("extras", extras)
			#if node.has_meta("mesh_extras"):
				#if original is MeshInstance3D and original.mesh:
					#verbose_output.append("Setting extras metadata for mesh %s" % original.mesh)
					#original.mesh.set_meta("extras", node.get_meta("mesh_extras"))
				#else:
					#verbose_output.append("Metadata node %s has 'mesh_extras' but original %s has no mesh, preserving as 'mesh_extras'" % [node, original])
					#original.set_meta("mesh_extras", node.get_meta("mesh_extras"))
		#else:
			#verbose_output.append("Original node not found for %s" % node)
		#node.queue_free()
	return OK
