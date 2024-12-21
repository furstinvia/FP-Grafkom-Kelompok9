
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

const loader = new THREE.GLTFLoader();
const models = [];
let currentIndex = 0;

camera.position.set(0, 0, 5);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI;
controls.minPolarAngle = 0;
const backgroundMusic = document.getElementById('backgroundMusic');
const audioToggleButton = document.getElementById('audioToggleButton');
const audioIcon = audioToggleButton.querySelector('i');

window.addEventListener('load', () => {
    backgroundMusic.play();
});

audioToggleButton.addEventListener('click', () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        audioIcon.classList.remove('fa-volume-mute');
        audioIcon.classList.add('fa-volume-up');
    } else {
        backgroundMusic.pause();
        audioIcon.classList.remove('fa-volume-up');
        audioIcon.classList.add('fa-volume-mute');
    }
});
function updateModelDisplay() {
    for (let model of models) {
        scene.remove(model);
    }
    const modelToDisplay = models[currentIndex];
    if (modelToDisplay) {
        scene.add(modelToDisplay);
    }
    modelSelect.selectedIndex = currentIndex;
    console.log(`Current model: ${modelSelect.options[currentIndex].text}`);
}

document.getElementById('prevBtn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + modelSelect.options.length) % modelSelect.options.length;
    updateModelDisplay();
});

document.getElementById('nextBtn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % modelSelect.options.length;
    updateModelDisplay();
});

const selectButton = document.getElementById('selectBtn');
const modelSelect = document.getElementById('modelSelect');
const popupModal = document.getElementById('popupModal');
const popupMessage = document.getElementById('popupMessage');
const closePopup = document.getElementById('closePopup');

modelSelect.addEventListener('change', function() {
    currentIndex = parseInt(this.value, 10);
    updateModelDisplay();
});

selectButton.addEventListener('click', function() {
    const selectedModelName = modelSelect.options[modelSelect.selectedIndex].text;
    localStorage.setItem('selectedCharacter', selectedModelName);
    popupMessage.textContent = `You have selected: ${selectedModelName}`;
    popupModal.style.display = 'flex';
});

closePopup.addEventListener('click', function() {
    popupModal.style.display = 'none';
});

document.getElementById('playBtn').addEventListener('click', () => {
    window.location.href = '../Game/index.html';
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
