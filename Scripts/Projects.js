// Initial scene setup
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const renderer2D = new THREE.CSS2DRenderer();
renderer2D.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer2D.domElement);



const planes =[];

const textureLoader = new THREE.TextureLoader();
const backgroundTexture = textureLoader.load('textures/textBackground.png');


// Create a plane with the transparent image texture
const planeGeometry = new THREE.PlaneGeometry(10, 6); // Adjust size as needed
const planeMaterial = new THREE.MeshBasicMaterial({
  map: backgroundTexture,
  transparent: true, // Ensures transparency is respected
  opacity: 0.5, // You can adjust the opacity
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, 16, -5); // Position it behind the text
plane.scale.x =window.innerWidth;
planes.push(plane);



const myFaceTexture = textureLoader.load('textures/myFace.png');
const faceGeometry = new THREE.PlaneGeometry(10, 6); // Adjust size as needed
const myFaceMaterial = new THREE.MeshBasicMaterial({
  map: myFaceTexture,
  transparent: true, // Ensures transparency is respected
  opacity: 0.8, // You can adjust the opacity
});
const facePlane = new THREE.Mesh(faceGeometry, myFaceMaterial);
facePlane.position.set(1,0,-5);
planes.push(facePlane);



const bassTexture = textureLoader.load("textures/bass.jpg");
const bassGeometry = new THREE.PlaneGeometry(10, 6); // Adjust size as needed
const bassMaterial = new THREE.MeshBasicMaterial({
  map:bassTexture,
  transparent: true, // Ensures transparency is respected
  opacity: 0.8, // You can adjust the opacity
});
const bassPlane = new THREE.Mesh(bassGeometry, bassMaterial);
bassPlane.position.set(-3,0,-5);
bassPlane.scale.set(.5, 1, 1);
planes.push(bassPlane);







let models =[];
const loader = new THREE.GLTFLoader(); // Use GLTFLoader from the CDN
let BackModel;
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


// Create a div element for the text overlay
let textOverlay = document.createElement('div');
textOverlay.style.position = 'absolute'; // Change to absolute to position relative to the document
textOverlay.style.top = '50%';  // Start at the center vertically (or any value you want)
textOverlay.style.left = '20px'; // Position on the left side
textOverlay.style.transform = 'translateY(-0%)'; // Center vertically
textOverlay.style.color = 'white';
textOverlay.style.fontSize = '24px';
textOverlay.style.overflowY = 'auto';  // Allow scrolling
textOverlay.style.maxHeight = '80%';  // Limit the height, adjust as needed

document.body.appendChild(textOverlay);


// Handle mouse wheel scroll to scroll the text overlay
document.addEventListener('wheel', function (event) {
    //event.preventDefault(); // Prevent default scrolling behavior for text overlay

    // Scroll the text overlay
    if (event.deltaY > 0) {
        textOverlay.scrollTop += 20; // Scroll down
    } else {
        textOverlay.scrollTop -= 20; // Scroll up
    }
}, { passive: false });




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
//loadModel('BackModel', 'Models/Back.glb', [0, camera.position.y - 4, 0], [0.5, 0.5, 0.5], [Math.PI / 2, 0, 0]);


// Update layout when screen size changes
window.addEventListener('resize', updateLayout);

// Initial layout adjustment
updateLayout();








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
// Animation loop
// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Add a new cube periodically to maintain a constant stream
    if (Math.random() < 0.5 && cubes.length < 1500) {
        createCube();
    }

    let delta = clock.getDelta();

    // Rotate models in the 3D space if necessary
    for(let i = 0; i <= models.length - 1; i++) {
        if(!isRotating) {
            models[i].rotation.z = Math.sin(clock.getElapsedTime()) * 0.05;
            models[i].rotation.y = Math.cos(clock.getElapsedTime()) * 0.05;
        }
    }

    // Update the plane's position to follow the camera (3D)
    plane.position.set(camera.position.x, camera.position.y + 3, camera.position.z - 5);

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
    
    // Render the 3D scene
    renderer.render(scene, camera);
    // Render the 2D UI (text)
    renderer2D.render(scene, camera);
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
        if (BackModel) {
            BackModel.position.y -= 6; 
            BackModel.position.z = 0 ; 
        }

        
          // Adjust the plane size to scale with 1/3rd of the screen height
          const planeHeight = newHeight / 3; // 1/3rd of screen height
         
          
          plane.scale.y = planeHeight ; // Divide by initial scale of plane (10 and 6 from PlaneGeometry)
          
        
        previousWidth = newWidth;
        previousHeight = newHeight;
    }

    
}



// Start the animation loop
animate();

// Add resize event listener
window.addEventListener("resize", onWindowResize);











