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

document.addEventListener("DOMContentLoaded", function(event){
  // your code here
  console.log('DOM Loaded')
  document.getElementById('WebGLContainer').appendChild(star_scene.renderer.domElement);
  console.log(star_scene)
  star_scene.resizeSceneFrame(star_scene);
});

window.addEventListener("resize", function(event) {
   star_scene.resizeSceneFrame(star_scene);
});


star_scene.add(new Cube({
              width: 10,
              height: 10,
              depth: 10
              }));
