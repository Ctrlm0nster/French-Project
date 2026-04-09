/**
 * Premium Mouse Hovering and Cursor Effects
 */
document.addEventListener("DOMContentLoaded", function () {
    // Only enable on devices with a mouse
    if (window.matchMedia("(pointer: fine)").matches) {
        initCustomCursor();
        initMagneticElements();
        initTiltCards();
    }

    function initCustomCursor() {
        const cursor = document.createElement("div");
        cursor.className = "custom-cursor";
        const follower = document.createElement("div");
        follower.className = "custom-cursor-follower";
        document.body.appendChild(cursor);
        document.body.appendChild(follower);

        let posX = 0, posY = 0;
        let mouseX = 0, mouseY = 0;

        // Smooth follower animation
        function animate() {
            posX += (mouseX - posX) * 0.1;
            posY += (mouseY - posY) * 0.1;

            cursor.style.left = mouseX + "px";
            cursor.style.top = mouseY + "px";

            follower.style.left = posX + "px";
            follower.style.top = posY + "px";

            requestAnimationFrame(animate);
        }
        animate();

        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Hover detections
        const hoverables = "a, button, input, .trend-tab, #spotlight-prev, #spotlight-next, .immortals-card";
        document.body.addEventListener("mouseover", (e) => {
            if (e.target.closest(hoverables)) {
                cursor.classList.add("hover");
                follower.classList.add("hover");
            }
        });

        document.body.addEventListener("mouseout", (e) => {
            if (e.target.closest(hoverables)) {
                cursor.classList.remove("hover");
                follower.classList.remove("hover");
            }
        });

        // Handle mousedown/up
        document.addEventListener("mousedown", () => cursor.style.transform = "translate(-50%, -50%) scale(0.8)");
        document.addEventListener("mouseup", () => cursor.style.transform = "translate(-50%, -50%) scale(1)");
    }

    function initMagneticElements() {
        // Use event delegation for magnetic effect
        document.body.addEventListener("mousemove", (e) => {
            const el = e.target.closest(".magnetic");
            if (el) {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            }
        });

        document.body.addEventListener("mouseout", (e) => {
            const el = e.target.closest(".magnetic");
            if (el && (!e.relatedTarget || !el.contains(e.relatedTarget))) {
                el.style.transform = "translate(0px, 0px)";
            }
        });
    }

    function initTiltCards() {
        // Use event delegation for tilt effect
        document.body.addEventListener("mousemove", (e) => {
            const card = e.target.closest(".hover-tilt");
            if (card) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            }
        });

        document.body.addEventListener("mouseout", (e) => {
            const card = e.target.closest(".hover-tilt");
            if (card && (!e.relatedTarget || !card.contains(e.relatedTarget))) {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            }
        });
    }
});
