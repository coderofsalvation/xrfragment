#
# This is a convenient way to convert the scene to lowpoly
# (by adding decimate-modifiers)
# and then exporting a gltf to to <blenderdocument>.glb
# 
# All this is done automatically when saving the blender file
#
import bpy
import os
from bpy_extras.io_utils import ImportHelper

# uncomment below in case you want to hardcode the exported filename
data = {
 #gltf_file="/some/path/foo.index.glb"
}

def notify(message = "", title = "Message Box", icon = 'INFO'):
    def draw(self, context):
        self.layout.label(text=message)
    bpy.context.window_manager.popup_menu(draw, title = title, icon = icon)

# redirect print to all consoles
def print(data):
    for window in bpy.context.window_manager.windows:
        screen = window.screen
        for area in screen.areas:
            if area.type == 'CONSOLE':
                override = {'window': window, 'screen': screen, 'area': area}
                bpy.ops.console.scrollback_append(override, text=str(data), type="OUTPUT")
                

# Function to add Decimate Modifier to objects without one (except those in the exclusion list)
def add_decimate_modifier_to_objects():
    for obj in bpy.data.objects:
        print(obj.type)
        if obj is not None and (obj.type == 'FONT' or (obj.type == 'MESH' and len(obj.data.polygons) > 8)):
            if not obj.modifiers.get("Decimate"):
                #if obj.name not in exclusion_list and "Decimate" not in obj.modifiers:
                print("adding decimate-modifier to:"+obj.name)
                bpy.context.view_layer.objects.active = obj
                bpy.data.objects[obj.name].select_set(True)

                # Add Decimate Modifier with ratio 0.5
                bpy.ops.object.modifier_add(type='DECIMATE')
                bpy.context.object.modifiers["Decimate"].ratio = 0.5

# Function to be called on file save
def on_save_handler(blenderdoc):
    if 'gltf_file' not in data:
        gltf_file = bpy.data.filepath.replace('.blend','.glb')
    else:
        gltf_file = data['gltf_file']
    
    add_decimate_modifier_to_objects()
    
    # Export to glTF with specified settings and apply modifiers
    bpy.ops.export_scene.gltf(
        filepath=gltf_file,
        export_format='GLB',
        export_extras=True,
        export_lights=True,
        export_apply=True,
        export_force_sampling=False,
    )
    notify(os.path.basename(gltf_file),"﻿OK export")

# Register the handler
bpy.app.handlers.save_post.clear()
bpy.app.handlers.save_post.append(on_save_handler)
print("sourced gltf_export_on_save")
