
//THREE.Object3D.DefaultUp.set(0.0, -1.0, 0.0);
let star_scene = new WEBSCENE();
star_scene.createScene('starmap', 'WebGLContainer');
//star_scene.scene.rotation.x = -90 * Math.PI/180;


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

function rotateCoord(vec) {
    var axis = new THREE.Vector3( 1, 0, 0 );
    var angle = Math.PI / 2;
    return vec.applyAxisAngle( axis, angle );
}

// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r)
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();
}

"use strict"
class NameText {
    constructor(text, x, y, z) {
        this.solDiv = document.createElement( 'div' );
        this.solDiv.id = 'star-'+text;
        this.solDiv.className = 'starlabel';
        this.solDiv.textContent = text;
        //console.log(this.solDiv);
        //this.w = this.solDiv.element.style.width;
        //this.solDiv.style.width = this.w;
        this.solDiv.style.height = '0.7px';
        this.solDiv.style.fontSize = '0.5px';

        this.solLabel = new THREE.CSS3DObject( this.solDiv );
        //solLabel.position.set(rotateCoord(new THREE.Vector3( x, y, z + 10.)));
        var v = rotateCoord(new THREE.Vector3( x, y, z))
        this.solLabel.position.set(v.x, v.y, v.z);
        this.solLabel.quaternion.copy( star_scene.camera.quaternion );
        star_scene.scene.add(this.solLabel);
        //return this.solLabel;
    }
    get label() {
        return this.solLabel;
    }

    update(){
        this.solLabel.quaternion.copy( star_scene.camera.quaternion );
    }

}


class Star {
    constructor(size, r, g, b, x, y, z) {
        //
        console.log('size: ' + size);
        console.log('r: ' + r);
        console.log('g: ' + g);
        console.log('b: ' + b);
        console.log('x: ' + x);
        console.log('y: ' + y);
        console.log('z: ' + z);
        //console.log('args received: ' + size);
        // 0.34,1,0.9583,0.8512,-10.17,-7.88,1.97undefinedundefinedundefinedundefinedundefinedundefined
        //Create Sun Model
        this.sphereGeometry = new THREE.SphereGeometry( size*0.5, 16, 16 );
        this.sunTexture = new THREE.TextureLoader().load('static/img/sun_basic.jpg');

        this.sunMaterial = new THREE.MeshBasicMaterial( {
            color: rgbToHex(r, g, b),//0xffffff,
            transparent: true,
            opacity: 0.8,
            map: this.sunTexture
        });

        this.sun = new THREE.Mesh( this.sphereGeometry, this.sunMaterial );


        // #TODO move the star
        // sun.position.set(200, 400, -1400);

        this.vertexShaderText = document.getElementById("vertexshader").textContent;
        var fragShaderText = document.getElementById("fragmentshader").textContent;
        this.fragmentShaderText = fragShaderText.replace('r_val', r).replace('g_val', g).replace('b_val', b);


        this.time = 0;


        var vector = new THREE.Vector3( x, y, z);

//        var axis = new THREE.Vector3( 1, 0, 0 );
//        var angle = Math.PI / 2;
//        this.v = vector.applyAxisAngle( axis, angle );
        this.v = rotateCoord(vector);

        this.xP = this.v.x;
        this.yP = this.v.y;
        this.zP = this.v.z;

        // var yp = (-1. * Math.sign(z) * y);
//        this.sun.position.set(x, y, z);
        this.sun.position.set(vector.x, vector.y, vector.z);
        star_scene.scene.add(this.sun);

        return this;
        }

    update() {
        //    this.mesh.rotation.x += 0.01;
        //this.time = cosmosRender.getClock().getElapsedTime();
    }

    getCoord() {

    }

    getMesh() {
        return this.sun;
    }
}



document.addEventListener("DOMContentLoaded", function(event){
  // your code here
  //console.log('DOM Loaded');
  document.getElementById('WebGLContainer').appendChild(star_scene.renderer.domElement);
  document.getElementById('WebGLContainer').appendChild(star_scene.labelRenderer.domElement);
  //console.log(star_scene)
  star_scene.resizeSceneFrame(star_scene);
});

window.addEventListener("resize", function(event) {
   star_scene.resizeSceneFrame(star_scene);
});


const radius = 200;
const radials = 16;
const circles = 50;
const divisions = 64;

const axesHelper = new THREE.AxesHelper( 5 );
star_scene.scene.add( axesHelper );


const radialgrid = new THREE.PolarGridHelper( radius, radials, circles, divisions );

var geometry = new THREE.CylinderBufferGeometry(10, 10, 20, 16, 4, true);
geometry.computeBoundingBox();

var bbox = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: "blue" } ) );
//star_scene.scene.add(bbox);

radialgrid.material = new THREE.ShaderMaterial({
  uniforms: {
    color1: {
      value: new THREE.Color("blue")
    },
    color2: {
      value: new THREE.Color("black")
    },
    resolution: { type: "v2", value: new THREE.Vector2() },
    time: { type: "f", value: 70 }
//    bboxMin: {
//      value: geometry.boundingBox.min
//    },
//    bboxMax: {
//      value: geometry.boundingBox.max
//    }
  },
  vertexShader: document.getElementById("gridVshader").textContent,
  fragmentShader: document.getElementById("gridFshader").textContent,
//
//          this.vertexShaderText = document.getElementById("vertexshader").textContent;
//        var fragShaderText = document.getElementById("fragmentshader").textContent;
//
  wireframe: false,
  transparent: true
});

star_scene.scene.add( radialgrid );

//star_scene.darken(helper);
//const bloomPass = new THREE.UnrealBloomPass(this.aspect_vec, 1.5, 0.4, 0.85);

// Axes Helper


// Create THE SUN
sol = new Star(0.5, 1, 0.6, 0.4, 0, 0, 0);
//sol_text = add_star_text('SOL', 0, 0, 0);

const solLabel = new NameText('SOL', 0, 0, 0.5*0.8);
star_scene.addAny(solLabel);


// And galactic center
// -183.02454255340342	350.49518611376936	306.0312750916018
// 350                  0                   0
// #TODO - rotate ALL STARS BASED ON THIS ROTATION
// 499.62 distance
gal_center = new Star(100, 0.1, 0.5, 0.5, -183, 350, 306);
gal_center_aligned = new Star(100, 0.2, 0.2, 0.2, 350, 0, 0);


let stars = [];


namespace = '/starmap';
var socket = io.connect('http://localhost:5000');
var io_msg = io('http://localhost:5000/starmap');

socket.on('connect', function() {
    io_msg.send('connected');
});

socket.on('from_server', function(msg) {
    console.log('from_server: ' + msg);
});


io_msg.on('from_flask', function(msg) {
    console.log('from_flask: ' + msg);
});


let star_params_arr = [];
let star_arr = [];
let label_arr = [];

io_msg.on('make_star', function(args) {
    console.log('Creating Star w/ params: ' + args);

    star_arr.push(new Star(
                 args[1],args[2],args[3],args[4],args[5],args[6],args[7]
                ));
    newLabel = new NameText(args[0], args[5],args[6],args[7]+args[1]);
    label_arr.push(newLabel);
    star_scene.addAny(newLabel);
});