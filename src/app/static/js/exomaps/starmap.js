//https://blog.miguelgrinberg.com/post/easy-websockets-with-flask-and-gevent
//https://github.com/miguelgrinberg/Flask-SocketIO
//function connectSocketOutput(){
//	//$(document).ready(function() {
//	document.addEventListener("DOMContentLoaded", function(event) {
//		// Event handler for new connections.
//		// The callback function is invoked when a connection with the
//		// server is established.
//		internalParams.socket.on('connect', function() {
//			internalParams.socket.emit('connection_test', {data: 'I\'m connected!'});
//			//request data from server
//			internalParams.socket.emit('input_data_request', {data: 'requesting data'});
//		});
//		internalParams.socket.on('connection_response', function(msg) {
//			console.log(msg);
//		});
//		// Event handler for server sent data.
//		// The callback function is invoked whenever the server emits data
//		// to the client. The data is then displayed in the "Received"
//		// section of the page.
//		internalParams.socket.on('/starmap', function(msg) {
//			//console.log(msg);
//		});
//		internalParams.socket.on('input_data_response', function(msg) {
//			console.log("data received", msg);
//		});
//	});
//}
//
//connectSocketOutput();


//THREE.Object3D.DefaultUp.set(0.0, -1.0, 0.0);
let star_scene = new WEBSCENE();
star_scene.createScene('starmap', 'WebGLContainer');
//star_scene.scene.rotation.x = -90 * Math.PI/180;

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
            color: rgbToHex(r, g, b),//0xffffff,
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

        this.sunGlowGeom = new THREE.SphereGeometry( size * 1.5 * 0.5, 16, 16);
        this.sunGlow = new THREE.Mesh( this.sunGlowGeom, this.sunGlowMaterial );
        this.sun.add(this.sunGlow);
        this.sun.glow = this.sunGlow;

        var vector = new THREE.Vector3( x, y, z);
        var axis = new THREE.Vector3( 1, 0, 0 );
        var angle = Math.PI / 2;





        this.v = vector.applyAxisAngle( axis, angle );
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
  //console.log(star_scene)
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


const axesHelper = new THREE.AxesHelper( 5 );
star_scene.scene.add( axesHelper );

const helper = new THREE.PolarGridHelper( radius, radials, circles, divisions );
star_scene.scene.add( helper );

// Axes Helper


// Create THE SUN
first_star = new Star(0.5, 1, 0.6, 0.4, 0, 0, 0);

// And galactic center
// -183.02454255340342	350.49518611376936	306.0312750916018
// -1830.245425534034	3504.9518611376934	3060.3127509160176

// 499.62 distance
gal_center = new Star(100, 0.5, 0.5, 0.5, -183, 350, 306);
gal_center_aligned = new Star(100, 1, 1, 1, 350, 0, 0);


let stars = [];
//stars.push(new Star(0.9, 0.8,    0.2,     0.9,     5,     5,     5));
// stars.push(new Star(0.48,   1, 0.9502,  0.8352, -26.79,-13.92,5.97));
//second_star = new Star(0.9, 0.8,    0.2,     0.9,     5,     5,     5);
//third_star = new Star(0.49,   1, 0.7643,  0.7055, -5.61, -6.95, 31.63);
//                    0.48,   1, 0.9502,  0.8352, -26.79,-13.92,5.97

// console.log(second_star);

//star_scene.add( first_star, 0, 0, 0);
//Line(star_scene.scene, first_star, second_star);


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

io_msg.on('make_star', function(args) {
    console.log('Creating Star w/ params: ' + args);

    star_arr.push(new Star(
                 args[0],args[1],args[2],args[3],args[4],args[5],args[6]
                ));

});


//
//let run_buffer = [];
//
//
//io_msg.on('run_buffer', function(msg) {
//    run_buffer.push(msg);
//});
//
//
//function make_star(args) {
//   console.log('generating star: ' + args)
//   star_arr.push(new Star(
//    args[0],args[1],args[2],args[3],args[4],args[5],args[6]
//   ));
//}
//
//
//// Run a check if buffer reset
//setInterval(function(){
//    //code goes here that will be run every half second.
//    if (run_buffer.includes('stars') == true) {
//        console.log('Running the buffer for stars');
//        console.log(star_params_arr);
//        star_params_arr.forEach(make_star);
//    }
//    // Reset the buffer
//    run_buffer = [];
//}, 500);
//



//
//io_msg.on('render_stars', function(msg) {
//    console.log(msg);
//    console.log(star_params_arr);
//
//});



//socket.onmessage = ({ data }) => {
//    console.log('Message from server ', data);
//};
//
//socket.send('CAN YOU READ ME CAPTAIN?');
