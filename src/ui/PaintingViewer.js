import * as THREE from "three";
import { disableControls, enableControls } from "../controls/MuseumControls.js";

export function createPaintingViewer(scene, camera, renderer) {
    const overlay = document.createElement("div");
    overlay.id = "paintingViewer";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `
        <div id="paintingViewerFrame">
            <img id="paintingViewerImage" alt="Museum painting close-up">
            <button id="paintingViewerClose" type="button" aria-label="Close painting">&times;</button>
        </div>
    `;
    document.body.appendChild(overlay);

    const image = overlay.querySelector("#paintingViewerImage");
    const closeButton = overlay.querySelector("#paintingViewerClose");
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let isOpen = false;
    let imageRequest = 0;

    function updateViewerSpacing() {
        const menu = document.getElementById("ui");
        const menuBottom = menu?.getBoundingClientRect().bottom ?? 46;
        overlay.style.setProperty("--viewer-top-space", `${menuBottom + 24}px`);
    }

    function close() {
        if (!isOpen) return;
        isOpen = false;
        imageRequest++;
        overlay.classList.remove("active");
        overlay.setAttribute("aria-hidden", "true");
        image.removeAttribute("src");
        enableControls();
    }

    function open(painting) {
        if (!painting.userData.isPainting) return;

        const request = ++imageRequest;
        const imagePath = painting.userData.paintingImage;
        isOpen = true;
        disableControls();
        updateViewerSpacing();
        overlay.classList.add("active");
        overlay.setAttribute("aria-hidden", "false");
        image.onerror = () => {
            if (request !== imageRequest) return;
            console.warn(`Painting close-up image not found: ${imagePath}`);
            close();
        };
        image.src = imagePath;
    }

    renderer.domElement.addEventListener("click", (event) => {
        if (isOpen) return;
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);

        const hits = raycaster.intersectObject(scene, true);
        let painting = hits[0]?.object;
        while (painting && !painting.userData.isPainting) {
            painting = painting.parent;
        }
        if (painting) {
            event.stopImmediatePropagation();
            open(painting);
        }
    });

    closeButton.addEventListener("click", close);
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) close();
    });
    image.addEventListener("click", (event) => event.stopPropagation());
    window.addEventListener("keydown", (event) => {
        if (isOpen && event.key === "Escape") close();
    });
    window.addEventListener("resize", () => {
        if (isOpen) updateViewerSpacing();
    });

    return { open, close };
}
