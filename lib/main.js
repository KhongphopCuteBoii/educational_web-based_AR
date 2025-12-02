import * as THREE from 'three';
import { GLTFLoader } from 'gltfloader';
import { MindARThree } from 'mindar-image-three';

const loadGLTF = (path) => {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(path, (gltf) => {
            resolve(gltf);
        }, undefined, (error) => {
            console.error("Error loading model:", path, error);
            reject(error);
        });
    })
}

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Get references to elements
    const startButton = document.querySelector("#startButton");
    const stopButton = document.querySelector("#stopButton");
    const container = document.querySelector("#container");

    let mindarThree = null;

    const start = async () => {
        // Initialize MindAR
        mindarThree = new MindARThree({
            container: container,
            imageTargetSrc: './markers/markers.mind', // Ensure this file exists!
            maxTrack: 3, // Ensure your mind file has at least 5 images if you use index 4 below
        });

        const { renderer, scene, camera } = mindarThree;

        // Add Light
        const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
        scene.add(light);

        // 2. Load Models (Wait for them to load)
        // Note: If a file path is wrong, the code will stop here. Check console for errors.
        const h2o = await loadGLTF('./models/h2o.glb');
        h2o.scene.scale.set(0.5, 0.5, 0.5); // Adjusted scale to be safe

        const ar18 = await loadGLTF('./models/ar18.glb');
        ar18.scene.scale.set(0.5, 0.5, 0.5);

        const saturn = await loadGLTF('./models/saturn.glb');
        saturn.scene.scale.set(0.5, 0.5, 0.5);

        const sun = await loadGLTF('./models/sun.glb');
        sun.scene.scale.set(0.5, 0.5, 0.5);

        const camel = await loadGLTF('./models/camel.glb');
        camel.scene.scale.set(0.5, 0.5, 0.5);

        // 3. Create Anchors
        const h20A = mindarThree.addAnchor(0);
        // FIX: Add the model (h2o.scene) to the anchor group, NOT the anchor to itself
        h20A.group.add(h2o.scene); 

        const ar18A = mindarThree.addAnchor(1);
        ar18A.group.add(ar18.scene);

        const saturnA = mindarThree.addAnchor(2);
        saturnA.group.add(saturn.scene);

        const sunA = mindarThree.addAnchor(3);
        sunA.group.add(sun.scene);

        const camelA = mindarThree.addAnchor(4);
        camelA.group.add(camel.scene);

        // 4. Start the engine
        await mindarThree.start();
        
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });
    }

    const stop = () => {
        if (mindarThree) {
            mindarThree.stop();
            mindarThree.renderer.setAnimationLoop(null);
        }
    }

    // 5. Connect Buttons
    startButton.addEventListener("click", () => {
        console.log("Start clicked");
        start();
    });

    stopButton.addEventListener("click", () => {
        console.log("Stop clicked");
        stop();
    });
});
