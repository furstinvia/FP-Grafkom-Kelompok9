import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Inisialisasi Scene, Kamera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Transparan
document.body.appendChild(renderer.domElement);

// Pencahayaan
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Orbit Controls
// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 1.5, 45); // Posisi kamera lebih jauh
controls.enableZoom = false; // Menonaktifkan zoom
controls.update();


// Variabel untuk model
const loader = new GLTFLoader();
let currentModel;
let currentIndex = 0;
const modelPaths = [
    "model/cow.glb",
    "model/rabbit.glb",
    "model/pig.glb",
    "model/chicken.glb",
    "model/lion.glb",
];
function resetView() {
    camera.position.set(-9, 1.5, 45); // Posisi kamera awal
    controls.target.set(0, 0, 0); // Fokus awal
    controls.update();
}
function loadModel(path) {
    if (currentModel) {
        scene.remove(currentModel);
    }
    loader.load(
        path,
        (gltf) => {
            currentModel = gltf.scene;
            scene.add(currentModel);
            currentModel.position.set(0, -4.5, 0);
            camera.fov = 75; // Perkecil FoV untuk zoom in lebih jauh
            camera.updateProjectionMatrix(); // Terapkan perubahan FoV
            currentModel.scale.set(1.5, 1.5, 1.5); // Sesuaikan skala model
            console.log(`Model ${path} berhasil dimuat.`);
            
            // Reset kamera dan kontrol
            resetView();
            
            // Perlakuan khusus untuk chicken dan lion
            const modelName = path.split("/").pop().split(".")[0];
            if (modelName === "chicken") {
                currentModel.position.y -= -1;
                camera.position.set(-15, 8, 100); // Posisi lebih maju, ke atas, dan ke kiri
                camera.fov = 29; // Perkecil FoV untuk zoom in lebih jauh
                camera.updateProjectionMatrix(); // Terapkan perubahan FoV
                controls.target.set(0, 0, 0);  // Pastikan kontrol tetap fokus ke model
            } else if (modelName === "lion") {
                currentModel.position.y -= -3.04;
                camera.position.set(-1.3, -0.2, 3.5); // Sangat maju
                camera.fov = 73; // Perkecil FoV untuk zoom in lebih jauh
                camera.updateProjectionMatrix(); // Terapkan perubahan FoV
                controls.target.set(0, 0, 0);  // Fokus ke model
                currentModel.rotation.y = Math.PI; // Putar 180 derajat
            } else if (modelName === "cow") {
                currentModel.position.y -= -2.95;
                camera.position.set(-95, -0.2, 64); // Sangat maju
                camera.fov = 2.7; // Perkecil FoV untuk zoom in lebih jauh
                camera.updateProjectionMatrix(); // Terapkan perubahan FoV
                controls.target.set(0, 0, 0);  // Fokus ke model

            } else if (modelName === "rabbit") {
                currentModel.position.y -= 10;
                camera.position.set(-30, -20, 64); // Sangat maju
                camera.fov = 108; // Perkecil FoV untuk zoom in lebih jauh
                camera.updateProjectionMatrix(); // Terapkan perubahan FoV
                controls.target.set(0, 0, 0);  // Fokus ke model
            }
            
            controls.update();
        },
        (xhr) => {
            console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}%`);
        },
        (error) => {
            console.error(`Error saat memuat ${path}:`, error);
        }
    );
}


// Muat model pertama
loadModel(modelPaths[currentIndex]);

// Event Listener untuk Navigasi
document.getElementById("prevBtn").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + modelPaths.length) % modelPaths.length;
    loadModel(modelPaths[currentIndex]);
    document.getElementById("modelSelect").selectedIndex = currentIndex;
});

document.getElementById("nextBtn").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % modelPaths.length;
    loadModel(modelPaths[currentIndex]);
    document.getElementById("modelSelect").selectedIndex = currentIndex;
});

document.getElementById("modelSelect").addEventListener("change", (event) => {
    currentIndex = event.target.selectedIndex;
    loadModel(modelPaths[currentIndex]);
});

// Musik
const backgroundMusic = document.getElementById("backgroundMusic");
const audioToggleButton = document.getElementById("audioToggleButton");
const audioIcon = audioToggleButton.querySelector("i");

window.addEventListener("load", () => {
    backgroundMusic.play();
});

audioToggleButton.addEventListener("click", () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        audioIcon.classList.replace("fa-volume-mute", "fa-volume-up");
    } else {
        backgroundMusic.pause();
        audioIcon.classList.replace("fa-volume-up", "fa-volume-mute");
    }
});

// Modal Popup
const selectButton = document.getElementById("selectBtn");
const popupModal = document.getElementById("popupModal");
const popupMessage = document.getElementById("popupMessage");
const closePopup = document.getElementById("closePopup");

selectButton.addEventListener("click", () => {
    const selectedModelName = modelPaths[currentIndex].split("model/")[1].split(".")[0]; // Ambil bagian setelah 'model/' dan sebelum '.'
    const formattedModelName = selectedModelName.charAt(0).toUpperCase() + selectedModelName.slice(1); // Kapital pertama
    localStorage.setItem("selectedCharacter", formattedModelName);
    popupMessage.textContent = `You have selected: ${formattedModelName}`;
    popupModal.style.display = "flex";
});


closePopup.addEventListener("click", () => {
    popupModal.style.display = "none";
});

// Animasi dan Resize
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
