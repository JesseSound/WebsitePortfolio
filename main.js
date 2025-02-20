
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
		
        let cubes = [];
        
        // Track the previous window size
        let previousWidth = window.innerWidth;
        let previousHeight = window.innerHeight;

		function createCube() {
			let geometry = new THREE.BoxGeometry();
			
			// Create a new material instance for each cube
			let cubeMaterial = new THREE.MeshBasicMaterial({ 
				color: 0xffffff, 
				wireframe: true,
				transparent: true // Ensure transparency is enabled
			});
		
			let cube = new THREE.Mesh(geometry, cubeMaterial);
		
			// Randomize positions based on the current window size
			let rangeX = window.innerWidth / 2;
			let rangeY = window.innerHeight / 2;
			cube.position.set(
				Math.random() * rangeX - rangeX / 2,  
				Math.random() * rangeY - rangeY / 2,  
				Math.random() * 40 - 20             
			);
			cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
		
			scene.add(cube);
			cubes.push(cube);
		}
		
		const geometry = new THREE.BoxGeometry( 1, 1, 1 );
		const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		const cube2 = new THREE.Mesh( geometry, material );
		scene.add( cube2 );
        camera.position.z = 5;

        let asciiContainer = document.createElement("pre");
        document.body.appendChild(asciiContainer);

        function renderToASCII() {
            // Create a temporary 2D canvas for ASCII rendering
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = renderer.domElement.width;
            tempCanvas.height = renderer.domElement.height;
            const tempCtx = tempCanvas.getContext("2d");

            // Draw the WebGL renderer's output o nto the 2D canvas
            tempCtx.drawImage(renderer.domElement, 0, 0, tempCanvas.width, tempCanvas.height);

            // Get the image data from the 2D canvas
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
            const chars = " .:-=+*%@#";
            let ascii = "";

            // Convert the image data to ASCII
            for (let y = 0; y < tempCanvas.height; y += 10) {
                for (let x = 0; x < tempCanvas.width; x += 5) {
                    const i = (y * tempCanvas.width + x) * 4;
                    const brightness = (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
                    const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
                    ascii += chars[charIndex];
                }
                ascii += "\n";
            }

            // Update the ASCII container
            asciiContainer.textContent = ascii;
        }
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
        function animate() {
            requestAnimationFrame(animate);
            cube2.rotation.x += 0.01;
	        cube2.rotation.y += 0.01
            // Add a new cube periodically to maintain a constant stream
            if (Math.random() < 0.5) {
                createCube();
            }

            cubes.forEach(cube => {
                cube.position.y -= 0.03;
                cube.rotation.x += 0.001;
                cube.rotation.y += 0.001;
                if (cube.position.y < -20) {
                    cube.position.y = 20;
                    cube.position.x = Math.random() * 40 - 20;
                    cube.position.z = Math.random() * 40 - 20;
                    cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
                }
				updateOpacityBasedOnZ(cube);

            });

            renderer.render(scene, camera);
            //renderToASCII();
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
