import * as THREE from 'three';
import { GLTFLoader } from 'gltfloader';
import { MindARThree } from 'mindar-image-three';

const loadGLTF = (path)=>{
    return new Promise((resolve, reject)=>{
        const loader =  new GLTFLoader();
        loader.load(path, (gltf)=>{
            resolve(gltf);
        })
    }) 
}

document.addEventListener('DOMContentLoaded', ()=>{
    const start = async()=>{
        const mindarThree = new MindARThree({
            container:document.body,
            imageTargetSrc:'./markers/markers.mind',
            maxTrack:3,
        })
        const{renderer, scene, camera} = mindarThree;
        const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
        scene.add(light);

        const h2o = await loadGLTF('./models/h2o.glb');
        h2o.scene.scale.set(1, 1, 1);
        h2o.scene.position.set(0, 0, 0);

        const ar18 = await loadGLTF('./models/ar18.glb');
        ar18.scene.scale.set(1, 1, 1);
        ar18.scene.position.set(0, 0, 0);

        const saturn = await loadGLTF('./models/saturn.glb');
        saturn.scene.scale.set(1, 1, 1);
        saturn.scene.position.set(0, 0, 0)

        const sun = await loadGLTF('./models/sun.glb');
        sun.scene.scale.set(1, 1, 1);
        sun.scene.position.set(0, 0, 0);

        const camel = await loadGLTF('./models/camel.glb');
        camel.scene.scale.set(1, 1, 1);
        camel.scene.position.set(0, 0, 0);

        const h20A = mindarThree.addAnchor(0);
        h20A.group.add(h20A.scene);
        const ar18A = mindarThree.addAnchor(1);
        ar18A.group.add(ar18A.scene);
        const saturnA = mindarThree.addAnchor(2);
        saturnA.group.add(saturnA.scene);
        const sunA = mindarThree.addAnchor(3);
        sunA.group.add(sunA.scene);
        const camelA = mindarThree.addAnchor(4);
        camelA.group.add(camelA.scene);

        await mindarThree.start();
        renderer.setAnimationLoop(()=>{
            renderer.render(scene, camera);
        });
    }

    start();
})

/*
const mindarThree = new MindARThree({
	container: document.querySelector("#container"),
	imageTargetSrc: "https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.mind"
      });
      const {renderer, scene, camera} = mindarThree;
      const anchor = mindarThree.addAnchor(0);
      const geometry = new THREE.PlaneGeometry(1, 0.55);
      const material = new THREE.MeshBasicMaterial( {color: 0x00ffff, transparent: true, opacity: 0.5} );
      const plane = new THREE.Mesh( geometry, material );
      anchor.group.add(plane);
      const start = async() => {
	await mindarThree.start();
	renderer.setAnimationLoop(() => {
	  renderer.render(scene, camera);
	});
      }
      const startButton = document.querySelector("#startButton");
      startButton.addEventListener("click", () => {
	start();
      });
      stopButton.addEventListener("click", () => {
	mindarThree.stop();
	mindarThree.renderer.setAnimationLoop(null);
      });
*/