# XR Fragment class
# more info: https://xrfragment.org 
# SPDX-License-Identifier: MPL-2.0"
# author: Leon van Kammen
# date: 16-05-2024

extends Node

class_name XRF

var scene: Node
var URI: Dictionary = {}
var history: Array
var animplayer: AnimationPlayer
var isModelLoading = false
var metadata
var _orphans = []
var _regex:RegEx = RegEx.new()				
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
# based on https://gist.github.com/coderofsalvation/b2b111a2631fbdc8e76d6cab3bea8f17
####################################################################################################
func parseURL(url: String) -> Dictionary:
	var URI   = {"domain":"","fragment":"","file":"","URN":""}
	var parts = ["string","protocol","path","query","hash"]
	var urlregex = RegEx.new()
	urlregex.compile("(\\w+:\\/\\/)?([^#\\?]+)?(\\?[^#]+)?(#.*)?")
	var match = urlregex.search(url)
	for i in range(0,parts.size()):
		URI[ parts[i] ] = match.strings[i] if match.strings[i] else ""
	if URI["path"]:
		var pathParts:Array = URI["path"].split("/")
		if pathParts.size() > 1 and (pathParts[0].find(".") != -1 || pathParts[0].find(":") != -1):
			URI["domain"] = pathParts.pop_front()
		URI["path"]   = "/".join(pathParts)
		pathParts = URI["path"].split("/")
		if pathParts[-1].find(".") != -1:
			URI["file"] = pathParts[-1]
		URI["path"]   = "/".join(pathParts)
	URI["protocol"] = URI["protocol"].replace("://","") if URI["protocol"] else ""
	URI["fragment"]	= parseArgs( URI["hash"].substr(1) ) if URI["hash"] else {}
	URI["query"]	= parseArgs( URI["query"].substr(1) ) if URI["query"] else {}
	URI["URN"]      = URI["string"].replace("\\?.*","") if URI["domain"] else ""
	URI["isLocal"]  = true if !URI["domain"] else false
	# make relative URL's absolute
	if URI["isLocal"]:
		URI["domain"]   = self.URI["domain"]
		URI["protocol"] = self.URI["protocol"]
		if URI["path"].match("\\/"):
			URI["path"] = self.URI["path"] + URI["path"]
	return URI

func parseArgs(fragment: String) -> Dictionary:
	var ARG = {}
	var items = fragment.split("&")
	var i = 0
	for item in items:
		var key_value = item.split("=")
		var exclude    = item.begins_with("-")
		if exclude:
			key_value[0] = key_value[0].substr(1)
		ARG[key_value[0]] = guess_type(key_value[1] if key_value.size() > 1 else "")
		ARG[key_value[0]].exclude = exclude
		ARG[key_value[0]].weight = i
		i=i+1
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
# Navigation Related functions
####################################################################################################
	
func back():
	var prev  = self.history.pop_back()
	if prev != null:
		prev.next = self.URI 
		self.to( prev.string, callback )

func forward():
	if self.URI.next != null:
		self.to( self.URI.next.string, callback )
	
# Download model by HTTP and run `downloadModelSuccess` if OK
func to(url, f:Callable ):
	print("navigating to "+url)
	cleanup()
	var URI = self.parseURL(url)
	callback = f
	
	if self.URI.has('domain') && URI.domain == self.URI.domain && URI.path == self.URI.path:
		URI.isLocal = true 
			
	if !URI.isLocal:
		fetchURL(url, downloadModelSuccess )
	if self.URI:
		self.URI.next = null
		self.history.push_back(self.URI )		
	self.URI = URI
	if URI.isLocal && URI.fragment.has('pos'):
		callback.call("teleport", self.posToTransform3D( URI.fragment.pos ) )

####################################################################################################
# Model Related functions
####################################################################################################			

func fetchURL(url:String, f:Callable) -> HTTPRequest:
	var http_request = HTTPRequest.new()
	_orphans.push_back(http_request)
	add_child(http_request)
	http_request.request_completed.connect(f)
	var error = http_request.request(url)
	if error != OK:
		print("could not request "+url)
		push_error("An error occurred in the HTTP request.")
	return http_request
	
func cleanup():
	for orphan in _orphans:
		remove_child(orphan)

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
	traverse( scene, href.init )
	traverse( scene, src.init )
	setPredefinedSceneView()
	callback.call("scene_loaded", scene)

func loadModelFromBufferByGLTFDocument(body):
	var doc = GLTFDocument.new()
	var state = GLTFState.new()
	#state.set_handle_binary_image(GLTFState.HANDLE_BINARY_EMBED_AS_BASISU) # Fixed in new Godot version (4.3 as I see) https://github.com/godotengine/godot/blob/17e7f85c06366b427e5068c5b3e2940e27ff5f1d/scene/resources/portable_compressed_texture.cpp#L116
	var error = doc.append_from_buffer(body, "", state, 8) # 8 = force ENABLE_TANGENTS since it is required for mesh compression since 4.2
	if error == OK:
		scene = doc.generate_scene(state)
		scene.name = "XRFscene"
		metadata = _parseMetadata(state,scene)
		add_child(scene)
		print("model added")
		_addAnimations(state, scene)
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

func _addAnimations( state:GLTFState, scene:Node):
	self.animplayer == null
	for i in scene.get_child_count():
		var animplayer : AnimationPlayer = scene.get_child(i) as AnimationPlayer;
		if animplayer == null:
			continue;
		self.animplayer = animplayer
		print("playing animations")
		print(animplayer.get_animation_library_list())
		var anims = animplayer.get_animation_library_list()
		for j in anims:
			animplayer.play( j )
	
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
		self.URI.fragment = XRF["#"]["fragment"]
		if !self.URI.string.match("#"):
			self.URI.string  += XRF["#"]["string"]
		callback.call("teleport", posToTransform3D(XRF["#"]["fragment"]["pos"]) )		

# info: https://xrfragment.org/doc/RFC_XR_Fragments.html#embedding-xr-content-using-src
func filterModel(XRF,node):
	# spec 3 @ https://xrfragment.org/doc/RFC_XR_Fragments.html#embedding-xr-content-using-src
	for filter in XRF:
		var frag = XRF[filter]
		# spec 4 @ https://xrfragment.org/doc/RFC_XR_Fragments.html#embedding-xr-content-using-src		
		if frag.exclude:
			var hideNode:Node = node.get_node(filter)
			if hideNode:
				hideNode.get_parent().remove_child(hideNode)		
		# spec 3 @ https://xrfragment.org/doc/RFC_XR_Fragments.html#embedding-xr-content-using-src		
		if frag.weight == 0 and !frag.exclude && frag.string == '':
			var newParent:Node = node.get_node(filter)
			if newParent:
				node = newParent 
	return node
		
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

var href = {	
	"click": func init(node:Node):
		if node.has_meta("XRF"):
			var XRF = node.get_meta("XRF")
			if XRF.has('href'):
				print("TELEPORT")
				to(XRF.href.string,callback)
				callback.call("href", node),
								
	"init": func href_init(node:Node):
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
}

				
var src = {
	"extension":{},
	
	"addExtension": func addExtension( extension:String, f:Callable): # flexible way for adding extension handlers
		src.extension[ extension ] = f,
	
	"init": func init(node:Node):
		if node.has_meta("XRF"):
			var XRF = node.get_meta("XRF")
			if XRF.has('src'):
				var mesh = node as MeshInstance3D
				if mesh != null:
					var mat = mesh.get_active_material(0) as BaseMaterial3D
					mat = mat.duplicate()
					mat.transparency = mat.TRANSPARENCY_ALPHA
					mat.albedo = Color(1.0,1.0,1.0, 0.3) # 0.5 sets 50% opacity
					mesh.set_surface_override_material(0,mat)
				for ext in src.extension:
					_regex.compile(ext)
					if _regex.search(XRF.src.path) or _regex.search(XRF.src.string):
						var url:String = XRF.src.protocol+"://"+XRF.src.domain+XRF.src.path						
						print("src: fetching "+url)
						var handler:Callable = src.extension[ext].call(node,ext)
						if handler != null:
							fetchURL(url, handler )
				callback.call("src", {"node":node,"XRF":XRF} ),


	# some builtin content handlers
	
	"model": func audio(node:Node, extension:String) -> Callable:
		var node3D:Node3D = node as Node3D
		var src = node.get_meta("XRF").src
		if src.string.begins_with("#"): # local resource
			var clone:Node3D   = scene.duplicate() as Node3D
			clone.global_scale( node3D.scale )
			if src.fragment:
				clone = filterModel( src.fragment, clone)
			node.add_child(clone as Node)
		return func onFile(result, response_code, headers, body):
			print("JAAAAAA"),

	"audio": func audio(node:Node, extension:String) -> Callable:
		var src = node.get_meta("XRF").src
		return func onFile(result, response_code, headers, body):
			var music = AudioStreamPlayer.new()
			add_child(music)
			var audio_loader = AudioLoader.new()
			music.set_stream( audio_loader.loadfile( src.file, body ) )
			music.volume_db = 1
			music.pitch_scale = 1
			music.play()
			add_child(music)
}
