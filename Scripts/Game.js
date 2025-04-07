

// Setup scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(200, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 5, 10);
scene.add(light);

let spaceShip = null;
// Create a loader for GLTF models
const loader = new THREE.GLTFLoader();
let loadedModels = {};
// Load spaceship model
loader.load('Models/Spaceship.glb', function (gltf) {
    spaceShip = gltf.scene; // Get the 3D model from the loader
    scene.add(spaceShip);
    spaceShip.position.z = -10;
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

// Game loop
function animate() {
    requestAnimationFrame(animate);

    // Move spaceship
    if (keys['arrowleft'] || keys['a']) spaceShip.position.x -= 0.1;
    if (keys['arrowright'] || keys['d']) spaceShip.position.x += 0.1;
    if (keys['arrowup'] || keys['w']) spaceShip.position.y += 0.1;
    if (keys['arrowdown'] || keys['s']) spaceShip.position.y -= 0.1;

    // Move bullets
    for (let bullet of bullets) {
        bullet.position.y += 0.5;
    }

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

        // Adjust models and cubes positions based on new size
        if (AboutMeModel) {a
            AboutMeModel.position.set(0, 2, 0); // Ensure ABoutMeModel remains centered
        }

        if (TestimonialsModel) {
            TestimonialsModel.position.set(0, -2, 0); // Ensure OtherModel remains centered
        }

        previousWidth = newWidth;
        previousHeight = newHeight;
    }
}

window.addEventListener("resize", onWindowResize);