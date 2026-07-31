import gsap from "gsap";

import {
    disableControls,
    enableControls,
    getYaw,
    getPitch,
    setYaw,
    setPitch
} from "../controls/MuseumControls";

export function moveCamera(camera, nav){

    disableControls();

    // Keep the current view while moving
    gsap.to(camera.position,{

        x: nav.position.x,
        y: nav.position.y,
        z: nav.position.z,

        duration: 1.4,
        ease: "power2.inOut",

        onComplete(){

            let targetYaw = nav.rotation.z;
            let currentYaw = getYaw();
            let delta = targetYaw - currentYaw;
            if (delta > Math.PI) {
            targetYaw -= Math.PI * 2;
            }
            if (delta < -Math.PI) {
            targetYaw += Math.PI * 2;

}
            const targetPitch = nav.rotation.x + Math.PI / 2;

            const values = {

                yaw: getYaw(),
                pitch: getPitch()

            };

            gsap.to(values,{

                yaw: targetYaw,
                pitch: targetPitch,

                duration: 0.8,
                ease: "power2.inOut",

                onUpdate(){

                    setYaw(values.yaw);
                    setPitch(values.pitch);

                    camera.rotation.order = "YXZ";
                    camera.rotation.y = values.yaw;
                    camera.rotation.x = values.pitch;

                },

                onComplete(){

                    enableControls();

                }

            });

        }

    });

}