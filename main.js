// Initial scene setup
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load models
let models =[];
const loader = new THREE.GLTFLoader(); // Use GLTFLoader from the CDN
let ABoutMeModel;


let OtherModel;
// Store original positions of models on load (not on click)
const originalPositions = new Map();

loader.load('/AboutMe.glb', (gltf) => {
    ABoutMeModel = gltf.scene;
    ABoutMeModel.scale.set(1, 1, 1);
    ABoutMeModel.rotation.x = Math.PI / 2;
    ABoutMeModel.position.set(0, 2, 0); // Position AboutMeModel at the center of the screen
    scene.add(ABoutMeModel);
    models.push(ABoutMeModel);

    // Store the original position of the model
    originalPositions.set(ABoutMeModel, {
        position: ABoutMeModel.position.clone(),
        scale: ABoutMeModel.scale.clone()
    });
}, undefined, (error) => {
    console.error(error);
});

loader.load('/AboutMe.glb', (gltf) => {
    OtherModel = gltf.scene;
    OtherModel.scale.set(1, 1, 1);
    OtherModel.rotation.x = Math.PI / 2;
    OtherModel.position.set(0, -2, 0); // Position OtherModel higher than ABoutMeModel (Y-axis offset)
    scene.add(OtherModel);
    models.push(OtherModel);

    // Store the original position of the model
    originalPositions.set(OtherModel, {
        position: OtherModel.position.clone(),
        scale: OtherModel.scale.clone()
    });
}, undefined, (error) => {
    console.error(error);
});
// Create a PointLight
const pointLight = new THREE.PointLight(0xffffff, 10, 100); // color, intensity, distance
pointLight.position.set(10, 5, 10); // Position the light at x=10, y=10, z=10
scene.add(pointLight);

// Optionally, add a helper to visualize the light's position
const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
scene.add(pointLightHelper);

let cubes = [];

// Track the previous window size
let previousWidth = window.innerWidth;
let previousHeight = window.innerHeight;

// Create a cube
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

    let minZ = -35;  // Furthest in front of the camera
    let maxZ = 1;   // Closest in front of the camera
    let zPosition = Math.random() * (maxZ - minZ) + minZ; // Ensure cubes spawn in front of the camera

    cube.position.set(
        Math.random() * rangeX - rangeX / 2,
        Math.random() * rangeY - rangeY / 2,
        zPosition
    );
    cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

    scene.add(cube);
    cubes.push(cube);
}



camera.position.z = 5;
camera.position.y = 0;

// Update opacity based on Z position
function updateOpacityBasedOnZ(object) {
    const minZ = -10;  // Define the minimum Z value
    const maxZ = 10;   // Define the maximum Z value

    let normalizedZ = (object.position.z - minZ) / (maxZ - minZ);
    normalizedZ = THREE.MathUtils.clamp(normalizedZ, 0, 1);

    object.material.transparent = true;
    object.material.opacity = normalizedZ;
    object.material.needsUpdate = true;
}

let clock = new THREE.Clock();
let isRotating = false;  // Flag to check if the rotation animation is running
// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Add a new cube periodically to maintain a constant stream
    if (Math.random() < 0.5 && cubes.length < 1500) {
        createCube();
    }

    let delta = clock.getDelta();

    // Rock the model back and forth
    if (ABoutMeModel && !isRotating ) {
        ABoutMeModel.rotation.z = Math.sin(clock.getElapsedTime()) * 0.05; // Rock along x-axis
        ABoutMeModel.rotation.y = Math.cos(clock.getElapsedTime()) * 0.05; // Rock along z-axis
        OtherModel.rotation.z = Math.sin(clock.getElapsedTime()) * 0.05; 
        OtherModel.rotation.y = Math.cos(clock.getElapsedTime()) * 0.05; 
    }
 // Rock the model back and forth
 if (OtherModel && !isRotating ) {
    
    OtherModel.rotation.z = Math.sin(clock.getElapsedTime()) * 0.05; 
    OtherModel.rotation.y = Math.cos(clock.getElapsedTime()) * 0.05; 
}
    // Ensure cubes reset within the correct range (Z = -35 to -5)
cubes.forEach(cube => {
  
    cube.position.y -= 0.03;
    cube.rotation.x += 0.001;
    cube.rotation.y += 0.001;
    
    if (cube.position.y < -20) {
        cube.position.y = 20;
        cube.position.x = Math.random() * 40 - 20;
        cube.position.z = Math.random() * (-5 + 30) - 30; // Keep cube in front of the camera
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
        renderer.setSize(newWidth, newHeight);
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        // Adjust models and cubes positions based on new size
        if (ABoutMeModel) {
            ABoutMeModel.position.set(0, 2, 0); // Ensure ABoutMeModel remains centered
        }

        if (OtherModel) {
            OtherModel.position.set(0, -2, 0); // Ensure OtherModel remains centered
        }

        previousWidth = newWidth;
        previousHeight = newHeight;
    }
}

document.addEventListener('wheel', function (event) {
    event.preventDefault(); // Prevent default scrolling behavior

    if (event.deltaY > 0) {
        console.log('Mouse wheel scrolled down');
        if (camera.position.y - 0.55 >= -4) { // Ensure it stays within limits
            camera.position.y -= 0.55;
        } else {
            camera.position.y = -4; // Snap to limit if overshooting
        }
    } else if (event.deltaY < 0) {
        console.log('Mouse wheel scrolled up');
        if (camera.position.y + 0.5 <= 5) { // Ensure it stays within limits
            camera.position.y += 0.5;
        } else {
            camera.position.y = 5; // Snap to limit if overshooting
        }
    }
});



// Start the animation loop
animate();

// Add resize event listener
window.addEventListener("resize", onWindowResize);
// Raycaster and mouse vector for click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();





let previousClickedModel = null;

// In the onMouseClick function, ensure the original positions are applied when models are moved
function onMouseClick(event) {
    if (isRotating) return;  // Prevent starting a new rotation while one is ongoing

    // Normalize mouse coordinates (-1 to 1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update raycaster
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with models
    const models = [];
    if (ABoutMeModel) models.push(ABoutMeModel);
    if (OtherModel) models.push(OtherModel);

    const intersects = raycaster.intersectObjects(models, true); // 'true' checks children too

    if (intersects.length > 0) {
        let clickedMesh = intersects[0].object;

        // Find top-level parent (entire model)
        while (clickedMesh.parent && clickedMesh.parent !== scene) {
            clickedMesh = clickedMesh.parent;
        }

        // If a new model is clicked, move the old model out of the way and reset positions
        if (previousClickedModel !== clickedMesh) {
            // Restore previous model's position before applying the offset
            if (previousClickedModel) {
                let prevPos = originalPositions.get(previousClickedModel);
                if (prevPos) {
                    previousClickedModel.position.copy(prevPos.position);
                    previousClickedModel.scale.set(1, 1, 1);  // Restore the size to its original scale
                }
            }

            // Store the original position of the new clicked model
            if (!originalPositions.has(clickedMesh)) {
                originalPositions.set(clickedMesh, {
                    position: clickedMesh.position.clone(),
                    scale: clickedMesh.scale.clone()
                });
            }

            // Update the current clicked model
            previousClickedModel = clickedMesh;

            camera.position.y = clickedMesh.position.y;


            // Animate rotation of the clicked model
            isRotating = true;  // Set the flag to prevent new rotations during animation

            let startRotation = clickedMesh.rotation.z;
            let targetRotation = startRotation + Math.PI * 2; // 360° rotation
            let duration = 500; // Animation duration in ms
            let startTime = performance.now();

            // Adjust the clicked model's properties (scale, position, etc.)
            if (clickedMesh.scale.z <= 1) {
                clickedMesh.scale.z += 1;
            }

            function animateRotation(time) {
                let elapsed = time - startTime;
                let progress = Math.min(elapsed / duration, 1); // Ensure we don't exceed 100%

                clickedMesh.rotation.z = startRotation + progress * (targetRotation - startRotation);

                // Scaling effect
                clickedMesh.scale.z = 1 + progress;
                clickedMesh.scale.x = 1 + .2;
                if (progress < 1) {
                    requestAnimationFrame(animateRotation);
                } else {
                    // Reset the rotation flag after the animation completes
                    isRotating = false;
                }
            }

            // Start the rotation animation
            animateRotation(performance.now());
        }

        // Move models based on their relative position to the clicked model
        models.forEach(model => {
            if (model !== clickedMesh) {
                let originalPos = originalPositions.get(model);
                if (originalPos) {
                    // Snap back to original position before applying the offset
                    model.position.copy(originalPos.position);

                    // Apply the offset based on the y-axis position
                    if (model.position.y > clickedMesh.position.y) {
                        model.position.y += 1; // Move models above upwards
                    } else if (model.position.y < clickedMesh.position.y) {
                        model.position.y -= 1; // Move models below downwards
                    }
                }
            }
        });
    }
}


// Mobile smooth scrolling and reverse behavior
let isScrolling = false;
let scrollSpeed = 0.55; // Adjust scroll speed here

function smoothScroll(deltaY) {
    // Reverse the direction for mobile: scrolling down moves the camera up, scrolling up moves the camera down
    let movement = deltaY < 0 ? scrollSpeed : -scrollSpeed;

    // Apply smooth camera movement
    camera.position.y += movement;

    // Ensure the camera stays within bounds
    camera.position.y = Math.max(Math.min(camera.position.y, 5), -4);
}

let lastTouchY = 0;  // For mobile touch events

// Handle mouse wheel and touchmove events
function onScroll(event) {
    event.preventDefault(); // Prevent default scrolling behavior

    let deltaY = 0;
    if (event.type === "wheel") {
        deltaY = event.deltaY;
    } else if (event.type === "touchmove") {
        if (event.touches.length < 2) { // Ignore pinch-zoom
            deltaY = event.touches[0].clientY - lastTouchY;
            lastTouchY = event.touches[0].clientY;
        }
    }

    if (!isScrolling) {
        isScrolling = true;
        smoothScroll(deltaY);
        setTimeout(() => {
            isScrolling = false;
        }, 40); // This timeout controls how fast the smooth scroll updates
    }
}
function onTouchStart(event) {
    if (event.touches.length < 2) { // Only track the first touch
        lastTouchY = event.touches[0].clientY;
    }
}
// Add event listeners for both desktop and mobile scroll
document.addEventListener("wheel", onScroll);
document.addEventListener("touchmove", onScroll);




document.addEventListener('wheel', onScroll, { passive: false });

document.addEventListener('touchmove', onScroll, { passive: false });
document.addEventListener('touchstart', (e) => { lastTouchY = e.touches[0].clientY; }, { passive: false });
// Add click event listener for both desktop and mobile
document.addEventListener('click', onMouseClick);
document.addEventListener('touchend', onMouseClick); // Support touch clicks


