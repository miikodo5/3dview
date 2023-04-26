import * as THREE from 'three';

import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
    RGBELoader
} from 'three/examples/jsm/loaders/RGBELoader.js';
import {
    KTX2Loader
} from 'three/examples/jsm/loaders/KTX2Loader.js';
import {
    DRACOLoader
} from 'three/examples/jsm/loaders/DRACOLoader.js';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer;

init();

function init() {

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x999999);

    scene.add(new THREE.AmbientLight(0x999999));

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1e-5, 1e10);

    // Z is up for objects intended to be 3D printed.

    // camera.up.set(0, 0, 1);
    // camera.position.set(0, -9, 6);

    // camera.add(new THREE.PointLight(0xffffff, 0.8));

    scene.add(camera);


    const light = new THREE.HemisphereLight(0xffffff, 0x080808, 1.5);
    light.position.set(-1.25, 1, 1.25);
    scene.add(light);
    scene.add(new THREE.AxesHelper(20));


    //https://threejs.org/docs/#api/en/renderers/WebGLRenderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true
    });
    renderer.setClearColor(0x222222);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    // renderer.outputEncoding = THREE.sRGBEncoding;

    document.body.appendChild(renderer.domElement);

    /* const loader = new AMFLoader();
        loader.load('rook.amf', function (amfobject) {
        scene.add(amfobject);
        render();

     });*/
    //https://threejs.org/docs/#examples/en/loaders/DRACOLoader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('./node_modules/three/examples/jsm/libs/draco/gltf/');
    //https://threejs.org/docs/#examples/en/loaders/GLTFLoader
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.setKTX2Loader(new KTX2Loader().setTranscoderPath('./node_modules/three/examples/js/libs/basis/').detectSupport(renderer));

    var cameraPos = new THREE.Vector3(-0.2, 0.4, 1.4);
    var orbitControls = new OrbitControls(camera, renderer.domElement);


    loader.load('./objs/test_23.gltf', function (gltf) { //./objs/test_7.gltf

        const object = gltf.scene;

        object.updateMatrixWorld();
        var boundingBox = new THREE.Box3().setFromObject(object);
        var modelSizeVec3 = new THREE.Vector3();
        boundingBox.getSize(modelSizeVec3);
        var modelSize = modelSizeVec3.length();
        var modelCenter = new THREE.Vector3();
        boundingBox.getCenter(modelCenter);



        // Set up mouse orbit controls.
        orbitControls.reset();
        orbitControls.maxDistance = modelSize * 50;
        orbitControls.enableDamping = true;
        orbitControls.dampingFactor = 0.07;
        orbitControls.rotateSpeed = 1.25;
        orbitControls.panSpeed = 1.25;
        orbitControls.screenSpacePanning = true;

        // Position the camera accordingly.
        object.position.x = -modelCenter.x;
        object.position.y = -modelCenter.y;
        object.position.z = -modelCenter.z;
        camera.position.copy(modelCenter);
        camera.position.x += modelSize * cameraPos.x;
        camera.position.y += modelSize * cameraPos.y;
        camera.position.z += modelSize * cameraPos.z;
        camera.near = modelSize / 100;
        camera.far = modelSize * 100;
        camera.updateProjectionMatrix();
        camera.lookAt(modelCenter);

        console.log(modelCenter);
        console.log(modelSize);
        console.log(camera.position);

        scene.add(object);

        render();

    }, undefined, function (e) {

        console.error(e);

    });


    // const controls = new OrbitControls(camera, renderer.domElement);
    orbitControls.addEventListener('change', render);
    // orbitControls.target.set(0, 0, 2);
    orbitControls.update();

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();

}

function render() {
    // orbitControls.update();
    renderer.render(scene, camera);

}