// Initial scene setup
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load models
let models =[];
const loader = new THREE.GLTFLoader(); // Use GLTFLoader from the CDN
let AboutMeModel;
let TestimonialsModel;
let RepoModel;
let ProjectsModel;
let SocialsModel;
let SpaceShipModel;
// Store original positions of models on load (not on click)
const originalPositions = new Map();

// Store all models in an object for easy access
const loadedModels = {};

function loadModel(name, path, position, scale, rotation) {
    loader.load(path, (gltf) => {
        const model = gltf.scene;
        model.name = name;
        model.scale.set(...scale);
        model.rotation.set(...rotation);
        model.position.set(...position);
        scene.add(model);

        models.push(model);
        loadedModels[name] = model;
        // Store the original position of the model
        originalPositions.set(model, {
            position: model.position.clone(),
            scale: model.scale.clone()
        });
    }, undefined, (error) => {
        console.error(error);
    });
}

// Function to update model layout based on screen size
function updateLayout() {
    const isMobile = window.innerWidth <= 768; // Consider screen width 768px and below as mobile

    const positions = [
        [0, 2, 0],    // AboutMeModel
        [0, -2, 0],   // TestimonialsModel
        [5, 2, 0],    // RepoModel
        [-5, 2, 0],   // ProjectsModel
        [-5, -2, 0]   // SocialsModel
    ];

    // Adjust Y values based on screen size
    if (isMobile) {
        
        const verticalSpacing = 4;  // Increased vertical spacing between models
        for (let i = 0; i < models.length; i++) {
            models[i].position.set(0, i * -verticalSpacing, 0);  // Stack models vertically with more space
        }
    } else {
        // For large screens (2x3 layout)
        for (let i = 0; i < models.length; i++) {
            models[i].position.set(positions[i][0], positions[i][1], positions[i][2]);  // Set to grid positions
        }
    }
}

// Load models and apply layout based on screen size
loadModel('AboutMeModel', 'Models/AboutMe.glb', [0, 2, 0], [1, 0.5, 1], [Math.PI / 2, 0, 0]);
loadModel('TestimonialsModel', 'Models/Testimonials.glb', [0, -2, 0], [1, 0.5, 1], [Math.PI / 2, 0, 0]);
loadModel('RepoModel', 'Models/repos.glb', [5, 2, 0], [1, 0.5, 1], [Math.PI / 2, 0, 0]);
loadModel('ProjectsModel', 'Models/Projects.glb', [-5, 2, 0], [1, 0.5, 1], [Math.PI / 2, 0, 0]);
loadModel('SocialsModel', 'Models/Socials.glb', [-5, -2, 0], [1, 0.5, 1], [Math.PI / 2, 0, 0]);
loadModel('SpaceShipModel', 'Models/Spaceship.glb', [-5, -2, 0], [1, 0.5, 1], [Math.PI / 2, 0, 0]);









// Create a PointLight
const pointLight = new THREE.PointLight(0xffffff, 8, 200); // color, intensity, distance
pointLight.position.set(10, 12, 10); // Position the light at x=10, y=10, z=10
scene.add(pointLight);
const pointLight2 = new THREE.PointLight(0xffffff, 8, 200); // color, intensity, distance
pointLight2.position.set(-10, 12, 10); // Position the light at x=10, y=10, z=10
scene.add(pointLight2);

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
// Initial layout adjustment
updateLayout();
    // Add a new cube periodically to maintain a constant stream
    if (Math.random() < 0.5 && cubes.length < 1500) {
        createCube();
    }

    let delta = clock.getDelta();



        for(let i = 0; i <= models.length -1; i++ ){
            if(!isRotating){
            models[i].rotation.z = Math.sin(clock.getElapsedTime()) * 0.05; 
            models[i].rotation.y = Math.cos(clock.getElapsedTime()) * 0.05; 
            }
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
        if (AboutMeModel) {
            AboutMeModel.position.set(0, 2, 0); // Ensure ABoutMeModel remains centered
        }

        if (TestimonialsModel) {
            TestimonialsModel.position.set(0, -2, 0); // Ensure OtherModel remains centered
        }

        previousWidth = newWidth;
        previousHeight = newHeight;
    }
}

document.addEventListener('wheel', function (event) {
    event.preventDefault(); // Prevent default scrolling behavior

    if (event.deltaY > 0) {
        console.log('Mouse wheel scrolled down');
        if (camera.position.y - 0.55 >= -15) { // Change -4 to -10 or any other value
            camera.position.y -= 0.55;
        } else {
            camera.position.y = -15; // Adjust the lower limit as needed
        }
    } else if (event.deltaY < 0) {
        console.log('Mouse wheel scrolled up');
        if (camera.position.y + 0.5 <= 5) { // Upper limit remains the same
            camera.position.y += 0.5;
        } else {
            camera.position.y = 5;
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

function onMouseClick(event) {
    if (isRotating) return;  

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Get all loaded models
    const models = Object.values(loadedModels);

    const intersects = raycaster.intersectObjects(models, true); 

    if (intersects.length > 0) {
        let clickedMesh = intersects[0].object;

        while (clickedMesh.parent && clickedMesh.parent !== scene) {
            clickedMesh = clickedMesh.parent;
        }


      

        if (previousClickedModel !== clickedMesh) {
            if (previousClickedModel) {
                let prevPos = originalPositions.get(previousClickedModel);
                if (prevPos) {
                    previousClickedModel.position.copy(prevPos.position);
                    previousClickedModel.scale.set(1, 0.5, 1);
                }
            }

            if (!originalPositions.has(clickedMesh)) {
                originalPositions.set(clickedMesh, {
                    position: clickedMesh.position.clone(),
                    scale: clickedMesh.scale.clone()
                });
            }

            previousClickedModel = clickedMesh;
            //camera.position.y = clickedMesh.position.y;

            isRotating = true;

            let startRotation = clickedMesh.rotation.z;
            let targetRotation = startRotation + Math.PI * 2;
            let duration = 500;
            let startTime = performance.now();

            function animateRotation(time) {
                let elapsed = time - startTime;
                let progress = Math.min(elapsed / duration, 1);

                clickedMesh.rotation.z = startRotation + progress * (targetRotation - startRotation);

                if (progress < 1) {
                    requestAnimationFrame(animateRotation);
                } else {
                    isRotating = false;
                    switch (clickedMesh) {
                        case loadedModels['RepoModel']:
                            window.open("https://github.com/jessesound", "_blank");
                            return;
                        case loadedModels['AboutMeModel']:
                            window.location.href = "AboutMe.html";
                            return;
                        case loadedModels['TestimonialsModel']:
                            window.location.href = "Testimonials.html";
                            return;
                        case loadedModels['SocialsModel']:
                            window.location.href = "Socials.html";
                            return;
                        case loadedModels['ProjectsModel']:
                            window.location.href = "Projects.html";
                            return;
                            case loadedModels['SpaceShipModel']:
                            window.location.href = "Projects.html";
                            return;
                        default:
                            
                            break;
                    }
                    
                }
            }

            animateRotation(performance.now());
        }
    }
}



// Mobile smooth scrolling and reverse behavior
let isScrolling = false;
let scrollSpeed = 1; // Adjust scroll speed here

function smoothScroll(deltaY) {
    // Reverse the direction: scrolling down (positive deltaY) moves camera up (negative Y)
    let movement = -deltaY * scrollSpeed * 0.05; // Tune 0.05 as needed

    camera.position.y += movement;

    // Clamp camera position
    camera.position.y = Math.max(Math.min(camera.position.y, 15), -18);

    console.log(camera.position.y);  // Debug
}


let lastTouchY = 0;


function onScroll(event) {
    event.preventDefault(); // Prevent default scrolling behavior

    let deltaY = 0;
    if (event.type === "wheel") {
        deltaY = event.deltaY;
    } else if (event.type === "touchmove") {
        if (event.touches.length < 2) {
            const currentY = event.touches[0].clientY;
            deltaY = lastTouchY - currentY; // Inverted for natural scrolling
            lastTouchY = currentY;
        }
    }

    if (!isScrolling) {
        isScrolling = true;
        smoothScroll(deltaY);
        setTimeout(() => {
            isScrolling = false;
        }, 40);
    }
}

function onTouchStart(event) {
    if (event.touches.length < 2) {
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


onWindowResize();
// Update layout when screen size changes
window.addEventListener('resize', updateLayout);

// Initial layout adjustment
updateLayout();