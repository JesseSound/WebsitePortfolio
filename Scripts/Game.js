import * as THREE from 'three';

// Setup scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 5, 10);
scene.add(light);

// Add spaceship
const spaceShip = new SpaceShipModel(); // ← using your model
scene.add(spaceShip);
spaceShip.position.z = -10;

// Movement logic
const keys = {};
document.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

// Projectiles
const bullets = [];
function shoot() {
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ffff });
    const bullet = new THREE.Mesh(geometry, material);
    bullet.position.copy(spaceShip.position);
    bullets.push(bullet);
    scene.add(bullet);
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
        bullet.position.z -= 0.5;
    }

    renderer.render(scene, camera);
}
animate();
