let star_scene = new WEBSCENE();
star_scene.createScene('starmap', 'WebGLContainer');

//let light = new THREE.PointLight(0xFFFFFF, 0.8); // white light
//light.position.set(0, 500, 200);
//star_scene.scene.add( light );


class Cube {
  constructor(size) {
    this.geometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
    this.material = new THREE.MeshBasicMaterial({
      color: 0x00ff00
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  update() {
//    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.001;
  }

  getMesh() {
    return this.mesh;
  }
}


class Star {
    constructor(size, r, g, b, x, y, z) {
        //Create Sun Model
        this.sphereGeometry = new THREE.SphereGeometry( size, 32, 32 );
        //this.sunTexture = star_scene.load_texture('static/img/sun_basic.jpg');

        this.sunTexture = new THREE.TextureLoader().load('static/img/sun_basic.jpg');
        //this.texture2 = THREE.ImageUtils.loadTexture( 'static/img/sun_basic.jpg' );
        //this.time = cosmosRender.getClock().getElapsedTime();
//
//        var sunMaterial = new THREE.MeshBasicMaterial( {
////            color: 0xffffff,
////            transparent: true,
////            opacity: 0.7,
//            map: this.sunTexture
//        });

        this.sunMaterial = new THREE.MeshBasicMaterial( {
            color: 0xffffff,
            transparent: true,
            opacity: 0.99,
            map: this.sunTexture
        });

        this.sun = new THREE.Mesh( this.sphereGeometry, this.sunMaterial );


        // #TODO move the star
        // sun.position.set(200, 400, -1400);

        this.vertexShaderText = document.getElementById("vertexShaderSun").textContent;
        var fragShaderText = document.getElementById("fragmentShaderSun").textContent;
        this.fragmentShaderText = fragShaderText.replace('r_val', r).replace('g_val', g).replace('b_val', b);

        this.sunGlowMaterial = new THREE.ShaderMaterial( {
            uniforms: {
                viewVector: { type: "v3", value: star_scene.camera.position },
                texture: {
                    type: 't',
                    value: new THREE.TextureLoader().load('static/img/sun_small.jpg')
                 },
                glow: {
                    type: 't',
                    value: new THREE.TextureLoader().load('static/img/sun_glow.jpg')
                }
            },
            vertexShader: this.vertexShaderText,
            fragmentShader: this.fragmentShaderText,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });


        this.time = 0;
        this.uniforms = {
            texture: {
                type: 't',
                value: THREE.ImageUtils.loadTexture('static/img/sun_small.jpg')
            },
            glow: {
                type: 't',
                value: THREE.ImageUtils.loadTexture('static/img/sun_glow.jpg')
            },
            time: {
                type: 'f',
                value: this.time
            }
           };

        this.sunGlowGeom = new THREE.SphereGeometry( size * 1.5, 32, 32);
        this.sunGlow = new THREE.Mesh( this.sunGlowGeom, this.sunGlowMaterial );
        this.sun.add(this.sunGlow);
        this.sun.glow = this.sunGlow;

        this.sun.position.set(x, z, y);
        star_scene.scene.add(this.sun);

        }

      update() {
        //    this.mesh.rotation.x += 0.01;
        //this.time = cosmosRender.getClock().getElapsedTime();
      }

    getMesh() {
        return this.sun;
    }
}




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


//star_scene.add(new Cube({
//              width: 5,
//              height: 5,
//              depth: 5
//              }));

//const geometry = new THREE.CircleGeometry( 15, 32 );
//const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
//const circle = new THREE.Mesh( geometry, material );
//scene.add( circle );
const radius = 200;
const radials = 16;
const circles = 100;
const divisions = 64;

const helper = new THREE.PolarGridHelper( radius, radials, circles, divisions );
star_scene.scene.add( helper );

// 16, 0xffffff
first_star = new Star(0.5, 1, 0.6, 0.4, 0, 0, 0);
first_star = new Star(0.5, 0.8, 0.2, 0.9, 5, 0, -10);

//star_scene.add( first_star, 0, 0, 0);