import * as THREE from 'three';
import { GLTFLoader } from 'gltfloader';
import { MindARThree } from 'mindar-image-three';

const loadGLTF = (path) => {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        console.log(`Attempting to load: ${path}`); 
        loader.load(path, (gltf) => {
            console.log(`Loaded: ${path}`);
            resolve(gltf);
        }, undefined, (error) => {
            reject(`Failed to load model: ${path}`);
        });
    })
}

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.querySelector("#startButton");
    const stopButton = document.querySelector("#stopButton");
    const container = document.querySelector("#container");

    let mindarThree = null;

    const start = async () => {
        startButton.innerText = "Loading...";
        startButton.disabled = true;

        try {
            console.log("Initializing MindAR...");
            
            // 1. Initialize MindAR
            mindarThree = new MindARThree({
                container: container,
                imageTargetSrc: './markers/markers.mind', // CHECK THIS PATH CAREFULLY
                maxTrack: 5, 
            });

            const { renderer, scene, camera } = mindarThree;

            // 2. Add Light
            const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
            scene.add(light);

            // 3. Test Object (Simple Box - No heavy models)
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshNormalMaterial();
            const box = new THREE.Mesh(geometry, material);
            
            // We only attach to Anchor 0 for this test
            const anchor = mindarThree.addAnchor(0);
            anchor.group.add(box);

            // 4. Start AR Engine
            console.log("Starting AR Engine...");
            await mindarThree.start(); 
            
            renderer.setAnimationLoop(() => {
                renderer.render(scene, camera);
            });

            startButton.innerText = "AR Running";

        } catch (err) {
            console.error("CRITICAL FAILURE:", err);
            
            let errorMessage = "Unknown Error";
            
            if (typeof err === 'string') {
                errorMessage = err;
            } else if (err.message) {
                errorMessage = err.message;
            } else if (err.target && err.target.error) {
                // This usually means the .mind file is missing or blocked
                errorMessage = "File Loading Error: Could not load 'markers.mind'. Check path and .nojekyll";
            } else {
                try {
                    errorMessage = JSON.stringify(err);
                } catch (e) {
                    errorMessage = "Object (Check Console)";
                }
            }

            // Remove loading spinner so you can see the alert
            const loader = document.querySelector('.mindar-ui-loading');
            if (loader) loader.remove();

            alert("CRASH REPORT:\n" + errorMessage);
            
            startButton.innerText = "Start AR";
            startButton.disabled = false;
        }
    }

    const stop = () => {
        if (mindarThree) {
            mindarThree.stop();
            mindarThree.renderer.setAnimationLoop(null);
            container.innerHTML = ""; 
        }
    }

    startButton.addEventListener("click", () => {
        start();
    });

    stopButton.addEventListener("click", () => {
        stop();
    });
});
