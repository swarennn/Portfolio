import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
    findNavigationPoints,
    navigationPoints
} from "../navigation/NavigationManager.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
const dracoLoader = new DRACOLoader();

dracoLoader.setDecoderPath(
    "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
);
const loader = new GLTFLoader();

loader.setDRACOLoader(dracoLoader);

export function loadMuseum(scene, onLoaded){

    loader.load(

        "/models/museum.glb",

        (gltf)=>{

            scene.add(gltf.scene);
            console.log(gltf);
            findNavigationPoints(gltf.scene);

            if(onLoaded) onLoaded();

            const loading = document.getElementById("loading-screen");

setTimeout(()=>{

    loading.style.opacity = "0";

    setTimeout(()=>{

        loading.remove();

    },700);

});

            console.log("Museum Loaded!");

        },

        (xhr)=>{

    const percent = xhr.total
    ? Math.round((xhr.loaded / xhr.total) * 100)
    : 0;

    document.getElementById("loading-progress").style.width =
        percent + "%";

    document.getElementById("loading-text").innerHTML =
        "Loading Museum... " + percent + "%";

},

        (error)=>{

            console.error(error);

        }

    );

}