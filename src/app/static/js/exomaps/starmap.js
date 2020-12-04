function drawCube(){
	var size = 10.;
	// CUBE
	var geometry = new THREE.CubeGeometry(size, size, size);
	var cubeMaterials = [
		new THREE.MeshBasicMaterial({color:"yellow", side: THREE.DoubleSide}),
		new THREE.MeshBasicMaterial({color:"orange", side: THREE.DoubleSide}),
		new THREE.MeshBasicMaterial({color:"red", side: THREE.DoubleSide}),
		new THREE.MeshBasicMaterial({color:"green", side: THREE.DoubleSide}),
		new THREE.MeshBasicMaterial({color:"blue", side: THREE.DoubleSide}),
		new THREE.MeshBasicMaterial({color:"purple", side: THREE.DoubleSide}),
	];
	// Create a MeshFaceMaterial, which allows the cube to have different materials on each face
	var cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials);
	var cube = new THREE.Mesh(geometry, cubeMaterial);

    return cube;
}

let star_scene = new WEBSCENE('starmap', 'SceneBox');
// star_scene.initScene();

function startSTARMAP(){
    let geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
    let material = new THREE.MeshBasicMaterial();
    let mesh = new THREE.Mesh( geometry, material );

    //    cube = drawCube();
    star_scene.scene.add( mesh );
    console.log('making the scene')
}




//
//// Create the skybox
//function initSkybox(cullDist) {
//    var geometry = new THREE.SphereGeometry(cullDist / 2.0, 60, 40);
//
//    var uniforms = {
//        texture: {
//            type: 't',
//            value: THREE.ImageUtils.loadTexture('img/eso_dark.jpg')
//        }
//    };
//
//    var material = new THREE.ShaderMaterial( {
//        uniforms:       uniforms,
//        vertexShader:   document.getElementById('sky-vertex').textContent,
//        fragmentShader: document.getElementById('sky-fragment').textContent
//    });
//
//    var skybox = new THREE.Mesh(geometry, material);
//    skybox.scale.set(-1, 1, 1);
//    skybox.eulerOrder = 'XZY';
//    skybox.rotation.z = Math.PI/3.0;
//    skybox.rotation.x = Math.PI;
//    skybox.renderDepth = 1000.0;
//    scene.add(skybox);
//}
//
//// Initializes the scene
//function startGUI(){
////define the params object
//	defineInternalParams();
//	defineExternalParams();
//
////initialize everything related to the WebGL scene
//	initScene();
//	internalParams.scene.background = new THREE.Color('black');
//	initSkybox
//
//
////create the UI
//	createGUI();
//
////draw the cube
//	cube = drawCube();
//    internalParams.scene.add( cube );
////begin the animation
//	animateGUI();
//}
//
