export let controlsEnabled = true;
let isDragging = false;
let yaw = 0;
let pitch = 0;
let lastTouchX = 0;
let lastTouchY = 0;

export function setCameraRotation(camera){

    camera.rotation.order = "YXZ";

    yaw = camera.rotation.y;
    pitch = camera.rotation.x;

}

export function getYaw() {
    return yaw;
}

export function getPitch() {
    return pitch;
}

export function setYaw(value) {
    yaw = value;
}

export function setPitch(value) {
    pitch = value;
}

export function createMuseumControls(camera, renderer){

    renderer.domElement.addEventListener("mousedown",()=>{

        isDragging = true;

    });

    window.addEventListener("mouseup",()=>{

        isDragging = false;

    });

    window.addEventListener("mousemove",(event)=>{
        if(!controlsEnabled) return;
        if(!isDragging) return;

        yaw += event.movementX * 0.002;
        pitch += event.movementY * 0.002;

        pitch = Math.max(
            -Math.PI/2.2,
            Math.min(Math.PI/2.2,pitch)
        );

        camera.rotation.order = "YXZ";

        camera.rotation.y = yaw;
        camera.rotation.x = pitch;

    });

    // ---------- Mobile Touch Controls ----------

renderer.domElement.addEventListener("touchstart", (event) => {

    if (!controlsEnabled) return;

    isDragging = true;

    lastTouchX = event.touches[0].clientX;
    lastTouchY = event.touches[0].clientY;

}, { passive: true });

renderer.domElement.addEventListener("touchmove", (event) => {

    if (!controlsEnabled) return;
    if (!isDragging) return;

    const touch = event.touches[0];

    const deltaX = touch.clientX - lastTouchX;
    const deltaY = touch.clientY - lastTouchY;

    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;

    yaw += deltaX * 0.0018;
    pitch += deltaY * 0.0018;

    pitch = Math.max(
        -Math.PI / 2.2,
        Math.min(Math.PI / 2.2, pitch)
    );

    camera.rotation.order = "YXZ";

    camera.rotation.y = yaw;
    camera.rotation.x = pitch;

}, { passive: true });

window.addEventListener("touchend", () => {

    isDragging = false;

});

}

export function disableControls() {

    controlsEnabled = false;

}

export function enableControls() {

    controlsEnabled = true;

}