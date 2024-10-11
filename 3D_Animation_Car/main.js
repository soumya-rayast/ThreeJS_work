import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import TWEEN from "https://cdnjs.cloudflare.com/ajax/libs/tween.js/25.0.0/tween.esm.js";

let canvasForm = document.getElementById('canvas');
let width = canvasForm.offsetWidth;
let height = canvasForm.offsetHeight;

// create a threeJs Scene

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)

let object;
// orbit control 
let controls;

let Loader = new GLTFLoader();

Loader.load(
  'ferrari_f1_2019/scene.gltf',
  function (gltf) {
    object = gltf.scene;
    scene.add(object);
  }
)
// allow background transparent with alpha = true
let renderer = new THREE.WebGLRenderer({
  alpha: true,
});
renderer.setSize(width, height);

// Add the rendered to DOM Html
document.getElementById('canvas').appendChild(renderer.domElement);

// set camera 
camera.position.set(5, 0, 1); //(x,y,z)
controls = new OrbitControls(camera, renderer.domElement);

// add light in 3d Model 
let ambientLight = new THREE.AmbientLight(0x404040, 2.5);
scene.add(ambientLight);

let directionLight = new THREE.DirectionalLight(0xffffff, 2);
directionLight.position.set(0, 1, 0);
scene.add(directionLight);

let light = new THREE.PointLight(0xFFFFFF, 3);
light.position.set(0, 0, 500);
scene.add(light);

let light2 = new THREE.PointLight(0xFFFFFF, 3);
light2.position.set(500, 100, 0);
scene.add(light2);

let light3 = new THREE.PointLight(0xFFFFFF, 3);
light3.position.set(0, 100, -500);
scene.add(light3);

let light4 = new THREE.PointLight(0xFFFFFF, 3);
light4.position.set(-500, 300, 500);
scene.add(light4);

// add spotlight
let spotlight = new THREE.SpotLight(0xfffff, 2.5);
spotlight.position.set(0, 100, 300);
spotlight.angle = Math.PI / 4;
spotlight.penumbra = 0.5;
spotlight.castShadow = true;
scene.add(spotlight)
// Render scene 

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  TWEEN.update();
}
animate()



// slider 
let slider = document.querySelector('.slider');
let btnShowMore = document.getElementById('showMore');

let statusContent = 'contentOne';
// create function animation change position camera 
function runCamera(x, y, z) {
  let targetPosition = new THREE.Vector3(x, y, z);
  // let duration (time run animation)
  let duration = 1000; //ms

  let tween = new TWEEN.Tween(camera.position)
    .to(targetPosition, duration)
    .easing(TWEEN.Easing.Quadratic.Inout)
    .onUpdate(() => {
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    })
    .start();
}

btnShowMore.onclick = () => {
  slider.classList.remove('contentOneAction');
  slider.classList.remove('contentTwoAction');
  switch (statusContent) {
    case 'contentOne':
      runCamera(3, 0, 1)
      slider.classList.add(`contentTwoAction`);
      statusContent = 'contentTwo';
      break;
    case 'contentTwo':
      runCamera(2, 3, 1)
      statusContent = 'fullScreen';
      break;
    case 'fullScreen':
      runCamera(5, 0, 1)
      statusContent = 'contentOne';
      slider.classList.add('contentOneAction');
      break;
    default:
      break;
  }
}

// add event listen to resize 
window.addEventListener('resize', () => {
  width = canvasForm.offsetWidth;
  height = canvasForm.offsetHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height)
})