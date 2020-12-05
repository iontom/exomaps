class Cube {
  constructor(size) {
    this.geometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
    this.material = new THREE.MeshBasicMaterial({
      color: 0x00ff00
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  update() {
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.0001;
  }

  getMesh() {
    return this.mesh;
  }
}

let star_scene = new WEBSCENE();
star_scene.createScene('starmap', 'WebGLContainer');

star_scene.add(new Cube({
              width: 10,
              height: 10,
              depth: 10
              }));

//
//
//$(document).ready(function(){
//
//});

//function startSTARMAP(){
//    let geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
//    let material = new THREE.MeshBasicMaterial();
//    let mesh = new THREE.Mesh( geometry, material );
//
//    //    cube = drawCube();
//    star_scene.scene.add( mesh );
//    console.log('making the scene')
//}




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
