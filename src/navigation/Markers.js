import * as THREE from "three";
import { moveCamera } from "./MoveCamera";
export const markers = [];
import gsap from "gsap";
export function createMarkers(navigationPoints, scene) {

    for (const id in navigationPoints) {

        const nav = navigationPoints[id];

        const marker = new THREE.Mesh(

    new THREE.RingGeometry(
        0.13,
        0.18,
        64
    ),

    new THREE.MeshBasicMaterial({

        color:0xffffff,

        transparent:true,

        opacity:0.35,

        side:THREE.DoubleSide

    })
    

);

const hitbox = new THREE.Mesh(

    new THREE.CircleGeometry(0.4,32),

    new THREE.MeshBasicMaterial({

        transparent:true,

        opacity:0

    })

);

        // Lay it flat
        marker.rotation.x = -Math.PI / 2;
        

        // Position it
        marker.position.set(
        nav.position.x,
        0.2,
        nav.position.z
        );

        hitbox.rotation.x = -Math.PI / 2;

        hitbox.position.copy(marker.position);
        // Store which Nav this marker belongs to
        hitbox.userData.nav = nav;

        scene.add(marker);
        scene.add(hitbox);

markers.push(hitbox);
        gsap.to(marker.scale,{

    x:1.08,
    y:1.08,
    z:1.08,

    duration:1.2,

    repeat:-1,

    yoyo:true,

    ease:"sine.inOut"

});



    }

    console.log(markers);

}

export function enableMarkerClicks(camera, renderer){

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener("click",(event)=>{

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse,camera);

        const hits = raycaster.intersectObjects(markers);

        if(hits.length){

            moveCamera(
                camera,
                hits[0].object.userData.nav
            );

        }

    });

}
