import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/FBXLoader.js';

let camera, scene, renderer, stats;

			const clock = new THREE.Clock();

			let mixer;
			
			init();
			animate();
			function init() {
				
				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.set(25, 5, 60);

				scene = new THREE.Scene();// Create Scene
			
				const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 ); //Set Lights
				hemiLight.position.set( 0, 200, 0 );
				scene.add( hemiLight );

				const dirLight = new THREE.DirectionalLight( 0xffffff );
				dirLight.position.set( 100, 40, 20 );
				scene.add( dirLight );

				const loader = new FBXLoader(); //Load 3D object
				loader.load( './models/dancing.fbx', function ( object ) {

					mixer = new THREE.AnimationMixer( object );
					
					const action = mixer.clipAction( object.animations[ 0 ] );
					action.play();

					object.traverse( function ( child ) {

						if ( child.isMesh ) {

							child.castShadow = true;
							child.receiveShadow = true;

						}

					} );
					const position = new THREE.Vector3(0, 0, 0);
					scene.position.copy(position);
					scene.add( object );

				} );
				
				renderer = new THREE.WebGLRenderer( { alpha: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.shadowMap.enabled = true;
				document.getElementById("container3D").appendChild(renderer.domElement);
				const controls = new OrbitControls( camera, renderer.domElement );
				controls.target.set( 0, 0, 0 );
				controls.update();
				window.addEventListener( 'resize', onWindowResize );

			
			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );

			}


			function animate() {

				requestAnimationFrame( animate );
				const delta = clock.getDelta();
				if ( mixer ) mixer.update( delta );
				renderer.render( scene, camera );

			}
		
			