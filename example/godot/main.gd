extends Node3D

var xr_interface: XRInterface
var xrf
var scene
var player:CharacterBody3D

func _ready():
	xrf = preload("res://xrfragment.gd").new()
	add_child(xrf)
	xrf.to("https://xrfragment.org/other.glb", _onXRF )
	player = find_child("PlayerBody")
	player.enabled = false # optional: turn off gravity

func _onXRF(event:String,data ):
	if event == "scene_loaded":
		scene = data
	if event == 'href':
		print(data)
	if event == 'teleport':
		print("teleport!")
		find_child("XROrigin3D").position = data.origin
		#player.teleport( data )


func _input(event):  		
	var cam = find_child("XRCamera3D")
	if event is InputEventMouseMotion:
		var mouse_sens = 0.2
		cam.rotate_y(deg_to_rad(-event.relative.x*mouse_sens))
	if event is InputEventMouseButton:
		var mouse_pos = get_viewport().get_mouse_position()
		var from = cam.project_ray_origin(mouse_pos)
		var to = from + cam.project_ray_normal(mouse_pos) * 20000 #200
		var space_state = get_world_3d().direct_space_state
		var handle_query = PhysicsRayQueryParameters3D.create(from, to)
		handle_query.collide_with_areas = true
		var mesh_query = PhysicsRayQueryParameters3D.create(from, to)
		mesh_query.collide_with_areas = true
		var intersectMesh   = space_state.intersect_ray(mesh_query)
		var intersectHandle = space_state.intersect_ray(handle_query)
		if intersectMesh.has('collider'):
			xrf.traverse( intersectMesh.collider, xrf.href_click )

		
