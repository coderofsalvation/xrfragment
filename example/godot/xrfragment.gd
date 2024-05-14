# https://xrfragment.org"
# SPDX-License-Identifier: MPL-2.0"

extends Node

class_name XRF

var scene: Node3D
var URI: Dictionary
var isModelLoading = false
var metadata
var callback: Callable;
var Type = {
	"isColor":  "^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$",
	"isInt":    "^[0-9]+$",
	"isFloat":  "^[0-9]+%.[0-9]+$",
	"isVector": "([,]+|%w)"
}

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
	var URI = {"string":url}
	
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
	URI['isLocal'] = url[0] == '#'
	return URI

func parseArgs(fragment: String) -> Dictionary:
	var ARG = {}
	
	# Split fragment by '&' to separate items
	var items = fragment.split("&")
	
	for item in items:
		# Split item by '=' to separate key and value
		var key_value = item.split("=")
		if key_value.size() > 1:
			ARG[key_value[0]] = guess_type(key_value[1])
		else:
			ARG[key_value[0]] = ""
	
	return ARG

func guess_type(str: String) -> Dictionary:
	var v = { 
		"string": str,
		"x": null,
		"y": null,
		"color":null,
		"float": null,
		"int": null
	}
	var parts = str.split(",")
	if parts.size() > 1:
		v.x = parts[0].to_int()
		v.y = parts[1].to_int()
		if parts.size() > 2:
			v.z = parts[2].to_int()
	if str.match(Type.isColor):
		v.color = str
	if str.match(Type.isFloat):
		v.float = str.to_float()
	if str.match(Type.isInt):
		v.int = str.to_int()	
	return v
	
####################################################################################################
# Model Related functions
####################################################################################################
	
# Download model by HTTP and run `downloadModelSuccess` if OK
func to(url, f:Callable ):
	print("navigating to "+url)
	var URI = self.parseURL(url)
	callback = f
	
	if !URI.isLocal:
		var http_request = HTTPRequest.new()
		add_child(http_request)
		http_request.request_completed.connect(downloadModelSuccess)
		var error = http_request.request(url)
		if error != OK:
			push_error("An error occurred in the HTTP request.")
			
	self.URI = URI
	if URI.isLocal && URI.fragment.has('pos'):
		print(URI.fragment.pos)
		callback.call("teleport", self.posToTransform3D( URI.fragment.pos ) )
			

func downloadModelSuccess(result, response_code, headers, body):
	# TODO: here different parsing functions should be called
	#       based on the filetype (glb,gltf,ade,obj e.g.)
	loadModelFromBufferByGLTFDocument(body)
	if scene == null:
		print('could not load GLTF from HTTP response')
		return
	_parseXRFMetadata(scene)
	traverse( scene, _parseXRFMetadata )
	# setup actions & embeds
	traverse( scene, href_init )
	traverse( scene, src_init )
	setPredefinedSceneView()
	callback.call("scene_loaded", scene)

func loadModelFromBufferByGLTFDocument(body):
	print("loadModelFromBuffer")
	var doc = GLTFDocument.new()
	var state = GLTFState.new()
	#state.set_handle_binary_image(GLTFState.HANDLE_BINARY_EMBED_AS_BASISU) # Fixed in new Godot version (4.3 as I see) https://github.com/godotengine/godot/blob/17e7f85c06366b427e5068c5b3e2940e27ff5f1d/scene/resources/portable_compressed_texture.cpp#L116
	var error = doc.append_from_buffer(body, "", state)
	if error == OK:
		scene = doc.generate_scene(state)
		scene.name = "XRFscene"
		_addAnimations(state, scene)
		metadata = _parseMetadata(state,scene)
		add_child(scene)
		print("model added")
	else:
		print("Couldn't load glTF scene (error code: %s). Are you connected to internet?" % error_string(error))	

func _parseXRFMetadata(node:Node):
	if node.has_meta("extras"):
		var extras = node.get_meta("extras")
		var XRF = {}
		for i in extras:
			if typeof(extras[i]) == TYPE_STRING:
				XRF[ i ] = parseURL( extras[i] )
		node.set_meta("XRF", XRF)

func _addAnimations( state:GLTFState, scene):
	for i in state.get_animation_players_count(0):
		print(i) #add_child( state.get_animation_player(i) )
		
func traverse(node, f:Callable ):
	for N in node.get_children():
		if N.get_child_count() > 0:
			f.call(N)
			self.traverse(N,f)
		else:
			f.call(N)

func _parseMetadata(state: GLTFState, scene: Node) -> Error:
	#var meta = new Dictionary()
	
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
	
	# Add metadata to scene
	var scenes_json : Array = state.json.get("scenes", [])
	if scenes_json[0].has("extras"):
		scene.set_meta("extras", scenes_json[0]["extras"])	
		
	# Add metadata to nodes
	var nodes_json : Array = state.json.get("nodes", [])
	for i in nodes_json.size():
		if nodes_json[i].has("extras"):
			var name = nodes_json[i]["name"].replace(".","_")
			var node = scene.find_child(name) #state.get_scene_node(i)
			if node:
				node.set_meta( "extras", nodes_json[i]["extras"] )
			else:
				print(name+" could not be found")
	return OK
	
func posToTransform3D(v:Dictionary):
	var transform : Transform3D
	if !v.x:
		var node:Node3D = scene.find_child(v.string)
		if node:
			transform = node.global_transform
	else:
		var pos = Vector3()
		pos.x = v.x
		pos.y = v.y
		pos.z = v.z
		transform = Transform3D()
		transform.origin = pos
	return transform
	

####################################################################################################
# The XR Fragments
# spec: https://xrfragment.org/doc/RFC_XR_Fragments.html
####################################################################################################

# info: https://xrfragment.org/#predefined_view
# spec: 6-8 @ https://xrfragment.org/doc/RFC_XR_Fragments.html#navigating-3d
func setPredefinedSceneView():
	var XRF = scene.get_meta("XRF")
	if XRF && XRF.has("#") && XRF["#"]["fragment"]["pos"]:
		callback.call("teleport", posToTransform3D(XRF["#"]["fragment"]["pos"]) )		

func href_init(node:Node):
	if node.has_meta("XRF"):
		var XRF = node.get_meta("XRF")
		if XRF.has('href'):
			var parent = node.get_parent()
			var area3D = Area3D.new()
			var col3D  = CollisionShape3D.new()
			var group  = MeshInstance3D.new()
			parent.remove_child(node)
			area3D.add_child(node)
			area3D.add_child(col3D)
			col3D.make_convex_from_siblings() # generate collision from MeshInstance3D siblings	
			parent.add_child(area3D)

func href_click(node:Node):
	if node.has_meta("XRF"):
		var XRF = node.get_meta("XRF")
		if XRF.has('href'):
			to(XRF.href.string,callback)
			callback.call("href", node)
				
func src_init(node:Node):
	if node.has_meta("XRF"):
		var XRF = node.get_meta("XRF")
		if (XRF.has('src') || (XRF.has('href') && XRF.has('src'))) && node is MeshInstance3D:
			var mesh = node as MeshInstance3D
			var mat = mesh.get_active_material(0) as BaseMaterial3D
			mat = mat.duplicate()
			mat.transparency = mat.TRANSPARENCY_ALPHA
			mat.albedo = Color(1.0,1.0,1.0, 0.3) # 0.5 sets 50% opacity
			mesh.set_surface_override_material(0,mat)
		
