

// Setup scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.set (0,0,5);

camera.lookAt(0, 0, 0);
// Add light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 5, 10);
scene.add(light);

let clock = new THREE.Clock();



let spaceShip = null;
// Create a loader for GLTF models
const loader = new THREE.GLTFLoader();
let loadedModels = {};
// Load spaceship model
loader.load('Models/Spaceship.glb', function (gltf) {
    spaceShip = gltf.scene; // Get the 3D model from the loader
    scene.add(spaceShip);
    spaceShip.position.z = 0;
    spaceShip.rotation.x = -90;
    // Modify material to wireframe for the spaceship model
    spaceShip.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                wireframe: true
            });
        }
    });
}, undefined, function (error) {
    console.error('Error loading spaceship model:', error);
});






// Movement logic
const keys = {};
document.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

// Projectiles
const bullets = [];
function shoot() {
    if (spaceShip) { // Ensure the spaceship model is loaded before shooting
        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ffff });
        const bullet = new THREE.Mesh(geometry, material);
        bullet.position.copy(spaceShip.position);
        bullets.push(bullet);
        scene.add(bullet);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') shoot();
});



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






// Game loop
function animate() {
    requestAnimationFrame(animate);
    if (Math.random() < 0.5 && cubes.length < 1500) {
        createCube();
    }

    if (spaceShip) {
        // Move spaceship (corrected Y-axis direction)
        if (keys['arrowleft'] || keys['a']) spaceShip.position.x -= 0.1;  // Left
        if (keys['arrowright'] || keys['d']) spaceShip.position.x += 0.1; // Right
        if (keys['arrowup'] || keys['w']) spaceShip.position.y -= 0.1;   // Up (negative Y is up)
        if (keys['arrowdown'] || keys['s']) spaceShip.position.y += 0.1;   // Down (positive Y is down)
    
        // Optional Z-axis movement (forward/backward)
        if (keys['q']) spaceShip.position.z += 0.1; // Move forward (toward the camera)
        if (keys['e']) spaceShip.position.z -= 0.1; // Move backward (away from the camera)
        updateOpacityBasedOnZ(spaceShip);
    }
    
    

    // Move bullets
    for (let bullet of bullets) {
        bullet.position.y += 0.5;
    }

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
animate();
// Handle window resize
function onWindowResize() {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    // Only update if the window size has actually changed
    if (newWidth !== previousWidth || newHeight !== previousHeight) {
        renderer.setSize(newWidth, newHeight);
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

    

        previousWidth = newWidth;
        previousHeight = newHeight;
    }
    camera.updateProjectionMatrix();

}

window.addEventListener("resize", onWindowResize);