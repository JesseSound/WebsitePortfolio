

// Setup scene
const scene = new THREE.Scene();
const camera =new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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
let touchStartX = 0;
let touchStartY = 0;
let isTouching = false;


let spaceShip = null;
// Create a loader for GLTF models
const loader = new THREE.GLTFLoader();
let loadedModels = {};
// Load spaceship model
loader.load('Models/Spaceship.glb', function (gltf) {
    spaceShip = gltf.scene; // Get the 3D model from the loader
    scene.add(spaceShip);
    spaceShip.position.z = 0;
    spaceShip.rotation.set(Math.PI / 2, 0, 0);
    spaceShip.scale.set(0.80,0.85,0.8);
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
const moveSpeed = 0.861; 

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

    let zPosition = 0;

    

    cube.position.set(
        Math.random() * rangeX - rangeX / 2,
        Math.random() * rangeY - rangeY / 2,
        zPosition
    );
    cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    cube.scale.set(0.5,0.5,0.5);
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


// Create particle effect
function createParticles(position) {
    const particleCount = 100;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    // Set random positions and velocities for each particle
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = position.x + Math.random() * 2 - 1; // x
        positions[i * 3 + 1] = position.y + Math.random() * 2 - 1; // y
        positions[i * 3 + 2] = position.z + Math.random() * 2 - 1; // z

        velocities[i * 3] = (Math.random() - 0.5) * 0.1; // x velocity
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1; // y velocity
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1; // z velocity
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    // Particle material
    const material = new THREE.PointsMaterial({
        color: 0xFF5733,  // Particle color (can change to fit the effect)
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particles, material);
    scene.add(particleSystem);

    // Animate particles
    const animateParticles = () => {
   // Set random velocities for each particle in a wider range
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = position.x + Math.random() * 2 - 1; // x
            positions[i * 3 + 1] = position.y + Math.random() * 2 - 1; // y
            positions[i * 3 + 2] = position.z + Math.random() * 2 - 1; // z

            // Modify velocities to make them more random
            velocities[i * 3] = (Math.random() - 0.5) * 0.2; // x velocity
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.2; // y velocity
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2; // z velocity
        }


        particles.attributes.position.needsUpdate = true;

        // Remove particle system after some time
        setTimeout(() => {
            scene.remove(particleSystem);
        }, 1000);
    };
    
    animateParticles();
}
function onTouchStart(event) {
    if (event.touches.length === 1) {
        const touchX = event.touches[0].clientX;
        const screenMiddle = window.innerWidth / 2;

        if (spaceShip) {
            if (touchX < screenMiddle) {
                // Move left
                spaceShip.position.x = THREE.MathUtils.lerp(spaceShip.position.x, spaceShip.position.x - moveSpeed, 0.2);
            } else {
                // Move right
                spaceShip.position.x = THREE.MathUtils.lerp(spaceShip.position.x, spaceShip.position.x + moveSpeed, 0.2);
            }
        }
    }
}



function onTouchEnd() {
    isTouching = false;
}

// Event listeners for touch controls
window.addEventListener('touchstart', onTouchStart, false);

window.addEventListener('touchend', onTouchEnd, false);
// Game loop

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const maxX = screenWidth / 2 - 50;  // Adjust based on spaceship size
const maxY = screenHeight / 2 - 50; // Adjust based on spaceship size



function animate() {
    requestAnimationFrame(animate);
    if (Math.random() < 0.5 && cubes.length < 100) {
        createCube();
    }

    

    if (spaceShip) {
        if (keys['arrowleft'] || keys['a']) spaceShip.position.x = THREE.MathUtils.lerp(spaceShip.position.x, spaceShip.position.x - moveSpeed, 0.1);
        if(spaceShip.position.x < maxX){
        if (keys['arrowright'] || keys['d']) spaceShip.position.x = THREE.MathUtils.lerp(spaceShip.position.x, spaceShip.position.x + moveSpeed, 0.1);
        }
        if (keys['arrowup'] || keys['w']) spaceShip.position.y = THREE.MathUtils.lerp(spaceShip.position.y, spaceShip.position.y + moveSpeed, 0.1);
        if (keys['arrowdown'] || keys['s']) spaceShip.position.y = THREE.MathUtils.lerp(spaceShip.position.y, spaceShip.position.y - moveSpeed, 0.1);
    }
    
    
    

    // Move bullets
    for (let bullet of bullets) {
        bullet.position.y += 0.55;
    }

    cubes.forEach(cube => {
  
        cube.position.y -= 0.03;
        cube.rotation.x += 0.001;
        cube.rotation.y += 0.001;
        
        if (cube.position.y < -20) {
            cube.position.y = 20;
            cube.position.x = Math.random() * 40 - 20;
            cube.position.z = 0;

            cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        }
    
            updateOpacityBasedOnZ(cube);


            bullets.forEach(bullet => {
                let distance = cube.position.distanceTo(bullet.position);
                if (distance < 1) { // Adjust 1 to control hitbox size
                    
                        console.log("Hit!");
                        createParticles(cube.position); 
                        scene.remove(cube);
                        scene.remove(bullet);
                        cubes.splice(cubes.indexOf(cube), 1);
                        bullets.splice(bullets.indexOf(bullet), 1);
                    
                    
                }



                });
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