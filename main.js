

        //import * as THREE from "./node_modules/three/build/three.module.js";
       
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const loader = new THREE.GLTFLoader(); // Use GLTFLoader from the CDN
        let ABoutMeModel;

        loader.load('/AboutMe.glb', (gltf) => {
            ABoutMeModel = gltf.scene;
            ABoutMeModel.scale.set(1, 1, 1);
            ABoutMeModel.rotation.x = Math.PI / 2; 
            scene.add(ABoutMeModel);
        }, undefined, (error) => {
            console.error(error);
        });


// Create a PointLight
const pointLight = new THREE.PointLight(0xffffff, 10, 100); // color, intensity, distance
pointLight.position.set(10, 5, 10); // Position the light at x=10, y=10, z=10

// Add the light to the scene
scene.add(pointLight);

// Optionally, add a helper to visualize the light's position
const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
scene.add(pointLightHelper);







        let cubes = [];
	
        // Track the previous window size
        let previousWidth = window.innerWidth;
        let previousHeight = window.innerHeight;
		
		function createCube() {
			let geometry = new THREE.BoxGeometry();
			
			let cubeMaterial = new THREE.MeshBasicMaterial({ 
				color: 0xffffff, 
				wireframe: true,
				transparent: true 
			});
		
			let cube = new THREE.Mesh(geometry, cubeMaterial);
		
			let rangeX = window.innerWidth / 2;
			let rangeY = window.innerHeight / 2;
		
			// Ensure the cube spawns at least a certain distance away from the camera
			let minZ = 10;   // Minimum safe distance
			let maxZ = 60;   // Maximum spawn distance
			let zPosition = Math.random() * (maxZ - minZ) + minZ; 
		
			cube.position.set(
				Math.random() * rangeX - rangeX / 2,  
				Math.random() * rangeY - rangeY / 2,  
				zPosition // Ensure it's far enough
			);
			cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
		
			scene.add(cube);
			cubes.push(cube);
		}
		
	
		
        camera.position.z = 5;

     
        

        
		function updateOpacityBasedOnZ(object) {
			const minZ = -10;  // Define the minimum Z value
			const maxZ = 10;   // Define the maximum Z value
		
			// Normalize Z value between 0 and 1
			let normalizedZ = (object.position.z - minZ) / (maxZ - minZ);
			normalizedZ = THREE.MathUtils.clamp(normalizedZ, 0, 1); // Ensure it's between 0 and 1
		
			// Apply to material opacity
			object.material.transparent = true;
			object.material.opacity = normalizedZ;
			object.material.needsUpdate = true;
		}

        let clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            
            // Add a new cube periodically to maintain a constant stream
            if (Math.random() < 0.5) {
                createCube();
            }
              
    let delta = clock.getDelta();
       // Rock the model back and forth
       if (ABoutMeModel) {
        let delta = clock.getDelta();
        // Rock the model back and forth
        ABoutMeModel.rotation.z = Math.sin(clock.getElapsedTime()) * 0.05; // Rock along x-axis
        ABoutMeModel.rotation.y = Math.cos(clock.getElapsedTime()) * 0.05; // Rock along z-axis
    }

       
          
            cubes.forEach(cube => {
                cube.position.y -= 0.03;
                cube.rotation.x += 0.001;
                cube.rotation.y += 0.001;
                if (cube.position.y < -20) {
                    cube.position.y = 20;
                    cube.position.x = Math.random() * 40 - 20;
                    cube.position.z = Math.random() * 40 - 10;
                    cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
                }
				updateOpacityBasedOnZ(cube);

            });

            renderer.render(scene, camera);
            
        }

        // Handle window resize
        function onWindowResize() {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;

            // Only update if the window size has actually changed
            if (newWidth !== previousWidth || newHeight !== previousHeight) {
                // Update renderer and camera
                renderer.setSize(newWidth, newHeight);
                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();

                // Update the previous window size
                previousWidth = newWidth;
                previousHeight = newHeight;
            }
        }

        // Start the animation loop
        animate();

        // Add resize event listener
        window.addEventListener("resize", onWindowResize);
