import './style.css';
import * as THREE from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

// Background
const skyboxGeometry = new THREE.SphereGeometry(500, 60, 40);
skyboxGeometry.scale(-1, 1, 1);
const loader = new EXRLoader();
loader.load('dikhololo_night_4k.exr', function (texture) {
    const skyboxMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
    });
    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    scene.add(skybox);
});


// Environment map for chrome reflection
const envTexture = new THREE.CubeTextureLoader().load([
  'path_to_px.jpg', 'path_to_nx.jpg',
  'path_to_py.jpg', 'path_to_ny.jpg',
  'path_to_pz.jpg', 'path_to_nz.jpg'
]);

// Torus with chrome material
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const chromeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 1.0,
  roughness: 0.0,
  envMap: envTexture
});
const torus = new THREE.Mesh(geometry, chromeMaterial);
scene.add(torus);



// Sun (Bright Yellow Sphere)
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00, wireframe: true });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(50, 50, -100);
scene.add(sun);


// Sun's Light
const sunLight = new THREE.PointLight(0xFFFF00, 1, 500);
sunLight.position.set(50, 50, -100);
scene.add(sunLight);

// Static light
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(20, 20, 20);
scene.add(pointLight);

// Light that follows the camera
const cameraLight = new THREE.PointLight(0xffffff, 0.3);
camera.add(cameraLight);

// Ambient light for general illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);

// Avatar
const Texture = new THREE.TextureLoader().load('rafa.png');
const rafa = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: Texture }));
scene.add(rafa);

// Moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);
scene.add(moon);
moon.position.z = 30;
moon.position.setX(-10);
rafa.position.z = -5;
rafa.position.x = 2;

// Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;
  rafa.rotation.y += 0.01;
  rafa.rotation.z += 0.01;
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
  cameraLight.position.set(camera.position.x, camera.position.y, camera.position.z + 10);
}
document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  rafa.rotation.x += 0.01;
  renderer.render(scene, camera);
}
animate();
