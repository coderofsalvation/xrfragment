extends Node3D

var xr_interface: XRInterface
var xrf
var scene
var player:CharacterBody3D

func _ready():
	xrf = preload("res://xrfragment.gd").new()
	add_child(xrf)
	xrf.to("https://xrfragment.org/index.glb", _onXRF )
	player = find_child("PlayerBody")
	player.enabled = false # optional: turn off gravity

func _onXRF(event:String,data ):
	if event == "scene_loaded":
		scene = data
		setPredefinedSceneView()

func _input(event):  		
	if event is InputEventMouseMotion:
		var mouse_sens = 0.2
		var cam = find_child("XRCamera3D")
		cam.rotate_y(deg_to_rad(-event.relative.x*mouse_sens))

# info: https://xrfragment.org/#predefined_view
# spec: 6-8 @ https://xrfragment.org/doc/RFC_XR_Fragments.html#navigating-3d
func setPredefinedSceneView():
	var XRF = scene.get_meta("XRF")
	if XRF && XRF.has("#") && XRF["#"]["fragment"]["pos"]:
		player.teleport( xrf.posToTransform3D(XRF["#"]["fragment"]["pos"]) )
		
