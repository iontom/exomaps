// SCENE BUILDER
// import * as THREE from "three";

// Have a single variable class that creates a scene
class WEBSCENE {
    constructor() {
        this.objects = [];
        this.createScene();
    }
    createScene(scene_name, dom_frame_name) {

        // Names the scene, permitting multiple new scenes to be added
        this.scene_name = scene_name;

        // Socket Namespace to use
        this.namespace = '/starmap';

        // Launch the scene object
        this.scene = new THREE.Scene();

        //for frustum
        this.zmax = 5.e10;
        this.zmin = 1;
        this.fov = 45.;

        // build and position the camera
        this.camera = new THREE.PerspectiveCamera( this.fov, this.aspect, this.zmin, this.zmax);
        this.camera.up.set(0, -1, 0);
	    this.camera.position.z = 30;
	    this.scene.add(this.camera);

        // Launch the Renderer
        this.renderer =	new THREE.WebGLRenderer({antialias:true});
        this.renderer.setSize(this.screenWidth, this.screenHeight);
        this.dom_frame = dom_frame_name;
        this.container = document.getElementById(dom_frame_name);

        // Determine Screen Size
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.aspect = this.screenWidth / this.screenHeight;

        // Socket
        this.socket = io.connect(location.protocol + '//' + document.domain
                           + ':' + location.port + this.namespace);

        this.render();
        return this;
    }

    gen_frame(self) {
        //this.container.appendChild(this.render.domElement);
        console.log('page loaded');
        console.log(this);
        document.body.appendChild(this.renderer.domElement);
        return this;
    }

    resizeSceneFrame(self) {
        console.log('Trying to resize - self');
        console.log(self);
        this.container = document.getElementById(this.dom_frame);
        console.log(this.container);
        var w = this.container.offsetWidth;
        var h_dif = window.innerHeight - this.container.offsetHeight;
        var h = Math.min(this.container.offsetHeight, window.innerHeight);
        console.log(w, h);
        this.aspect = ( w / h );
        this.camera.aspect = this.aspect;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( w, h );
        //this.render();
        return this;

    }


    // render the scene - #TODO add args?
    render() {
      requestAnimationFrame(() => {
        this.render();
      });

        this.objects.forEach((object) => {
          object.update();
        });

        this.renderer.render(this.scene, this.camera);
        return this;
      }

      add(mesh) {
        this.objects.push(mesh);
        this.scene.add(mesh.getMesh());
        return this;
      }

}




//
//
////all "global" variables are contained within params object
//var externalParams;
//function defineExternalParams(){
//	externalParams = new function() {
//
//		//for sphere
//		this.radius = 5.;
//		this.widthSegments = 32;
//		this.heightSegments = 32;
//		this.phiStart = 0;
//		this.phiLength = 2.*Math.PI;
//		this.thetaStart = 0;
//		this.thetaLength = Math.PI;
//
//
//	};
//
//
//}
//
//var internalParams;
//function defineInternalParams(){
//	internalParams = new function() {
//
//		this.container = null;
//		this.renderer = null;
//		this.scene = null;
//
//		//for frustum
//		this.zmax = 5.e10;
//		this.zmin = 1;
//		this.fov = 45.
//
//		//for gui
//		this.gui = null;
//
//		//for sphere
//		this.sphere;
//		this.material = null;
//
//		// Use a "/test" namespace.
//		// An application can open a connection on multiple namespaces, and
//		// Socket.IO will multiplex all those connections on a single
//		// physical channel. If you don't care about multiple channels, you
//		// can set the namespace to an empty string.
//		this.namespace = '/test';
//		// Connect to the Socket.IO server.
//		// The connection URL has the following format:
//		//     http[s]://<domain>:<port>[/<namespace>]
//		this.socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + this.namespace);
//	};
//}
//
////https://html-online.com/articles/get-url-parameters-javascript/
//function getURLvars() {
//	var vars = {};
//	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
//		vars[key] = value;
//	});
//	return vars;
//}
//
//function setParamsFromURL(){
//	var vars = getURLvars();
//	var keys = Object.keys(vars);
//	keys.forEach(function(k){
//		externalParams[k] = parseFloat(vars[k])
//	});
//}
//
////this initializes everything needed for the scene
//function initScene(){
//
//	var screenWidth = window.innerWidth;
//	var screenHeight = window.innerHeight;
//	var aspect = screenWidth / screenHeight;
//
//	// renderer
//	internalParams.renderer = new THREE.WebGLRenderer( {
//		antialias:true,
//	} );
//	internalParams.renderer.setSize(screenWidth, screenHeight);
//
//	internalParams.container = document.getElementById('WebGLContainer');
//	internalParams.container.appendChild( internalParams.renderer.domElement );
//
//	// scene
//	internalParams.scene = new THREE.Scene();
//
//	// camera
//	internalParams.camera = new THREE.PerspectiveCamera( internalParams.fov, aspect, internalParams.zmin, internalParams.zmax);
//	internalParams.camera.up.set(0, -1, 0);
//	internalParams.camera.position.z = 30;
//	internalParams.scene.add(internalParams.camera);
//
//	// events
//	THREEx.WindowResize(internalParams.renderer, internalParams.camera);
//
//	//controls
//	internalParams.controls = new THREE.TrackballControls( internalParams.camera, internalParams.renderer.domElement );
//
//
//}
//
//function setURLvars(){
//	var keys = Object.keys(externalParams);
//	var vars = "/gui?" //this needs to be the same as what is in flask
//	keys.forEach(function(k) {
//		if (k != "gui"){
//			vars += k+"="+externalParams[k]+"&";
//		}
//	});
//	window.history.pushState("externalParams", "updated", vars);
//}
//

