// Initial scene setup
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load models
const loader = new THREE.GLTFLoader(); // Use GLTFLoader from the CDN
let ABoutMeModel;
loader.load('/AboutMe.glb', (gltf) => {
    ABoutMeModel = gltf.scene;
    ABoutMeModel.scale.set(1, 1, 1);
    ABoutMeModel.rotation.x = Math.PI / 2;
    ABoutMeModel.position.set(0, 2, 0); // Position AboutMeModel at the center of the screen
    scene.add(ABoutMeModel);
}, undefined, (error) => {
    console.error(error);
});

let OtherModel;
loader.load('/AboutMe.glb', (gltf) => {
    OtherModel = gltf.scene;
    OtherModel.scale.set(1, 1, 1);
    OtherModel.rotation.x = Math.PI / 2;
    OtherModel.position.set(0, -2, 0); // Position OtherModel higher than ABoutMeModel (Y-axis offset)
    scene.add(OtherModel);
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

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Add a new cube periodically to maintain a constant stream
    if (Math.random() < 0.5) {
        createCube();
    }

    let delta = clock.getDelta();

    // Rock the model back and forth
    if (ABoutMeModel) {
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

// Scroll event handler to update camera position
document.addEventListener('wheel', function (event) {
    if (event.deltaY > 0) {
        console.log('Mouse wheel scrolled down');
        camera.position.y += 0.55;
    } else if (event.deltaY < 0) {
        console.log('Mouse wheel scrolled up');
        camera.position.y -= 0.5;
    }
});

// Start the animation loop
animate();

// Add resize event listener
window.addEventListener("resize", onWindowResize);
