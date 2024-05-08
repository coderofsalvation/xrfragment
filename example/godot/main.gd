extends Node3D

var xr_interface: XRInterface

func _ready():
		# Import MyClass
	const XRF = preload("res://xrfragment.gd")
	var xrf = XRF.new() 
	add_child(xrf)
	print( xrf.parseURL("https://foo.com/?foo#flop=bar&fap=fop") )
	print( xrf.parseURL("https://foo.com/flop.html?foo#flop=bar&fap=fop") )
	xrf.load("https://xrfragment.org/index.glb")
	

