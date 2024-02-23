import * as SUPER_THREE from 'super-three';
import { DRACOLoader } from 'super-three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'super-three/examples/jsm/loaders/GLTFLoader';
import { KTX2Loader } from 'super-three/examples/jsm/loaders/KTX2Loader';
import { OBB } from 'super-three/addons/math/OBB.js';
import { OBJLoader } from 'super-three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'super-three/examples/jsm/loaders/FBXLoader';
import { USDZLoader } from 'super-three/examples/jsm/loaders/USDZLoader';
import { ColladaLoader } from 'super-three/examples/jsm/loaders/ColladaLoader';
import { MTLLoader } from 'super-three/examples/jsm/loaders/MTLLoader';
import * as BufferGeometryUtils from 'super-three/examples/jsm/utils/BufferGeometryUtils';
import { LightProbeGenerator } from 'super-three/examples/jsm/lights/LightProbeGenerator';

var THREE = window.THREE = SUPER_THREE;

// TODO: Eventually include these only if they are needed by a component.
require('../../vendor/DeviceOrientationControls'); // THREE.DeviceOrientationControls
THREE.DRACOLoader = DRACOLoader;
THREE.GLTFLoader = GLTFLoader;
THREE.KTX2Loader = KTX2Loader;
THREE.OBJLoader = OBJLoader;
THREE.MTLLoader = MTLLoader;
THREE.FBXLoader = FBXLoader;
THREE.USDZLoader = USDZLoader;
THREE.ColladaLoader = ColladaLoader;
THREE.OBB = OBB;
THREE.BufferGeometryUtils = BufferGeometryUtils;
THREE.LightProbeGenerator = LightProbeGenerator;

export default THREE;
