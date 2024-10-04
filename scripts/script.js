let scene, camera, renderer, earth;
const textureLoader = new THREE.TextureLoader();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({canvas: document.getElementById('canvas'), antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);

  const geometry = new THREE.SphereGeometry(5, 64, 64);
  const texture = textureLoader.load('https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Blue_Marble_2002.png/2880px-Blue_Marble_2002.png');
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    bumpMap: textureLoader.load('https://upload.wikimedia.org/wikipedia/commons/7/74/Earthbump1k.jpg'),
    bumpScale: 0.05,
    specularMap: textureLoader.load('https://upload.wikimedia.org/wikipedia/commons/e/e4/Earthspec1k.jpg'),
    specular: new THREE.Color('grey')
  });

  earth = new THREE.Mesh(geometry, material);
  scene.add(earth);

  const ambientLight = new THREE.AmbientLight(0x333333);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);

  camera.position.z = 15;

  addStars();
  setupMouseControls();
}

function addStars() {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];

  for (let i = 0; i < 10000; i++) {
    vertices.push(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  const material = new THREE.PointsMaterial({color: 0xffffff, size: 0.1});
  const stars = new THREE.Points(geometry, material);
  scene.add(stars);
}

let isDragging = false;
let previousMousePosition = {
  x: 0,
  y: 0
};

function setupMouseControls() {
  document.addEventListener('mousedown', onMouseDown, false);
  document.addEventListener('mousemove', onMouseMove, false);
  document.addEventListener('mouseup', onMouseUp, false);
  document.addEventListener('wheel', onMouseWheel, false);
}

function onMouseDown(event) {
  isDragging = true;
}

function onMouseMove(event) {
  if (isDragging) {
    const deltaMove = {
      x: event.clientX - previousMousePosition.x,
      y: event.clientY - previousMousePosition.y
    };

    earth.rotation.y += deltaMove.x * 0.005;
    earth.rotation.x += deltaMove.y * 0.005;
  }

  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  };
}

function onMouseUp(event) {
  isDragging = false;
}

function onMouseWheel(event) {
  camera.position.z += event.deltaY * 0.05;
  camera.position.z = Math.max(8, Math.min(camera.position.z, 30));
}

function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.0005;
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

init();
animate();
