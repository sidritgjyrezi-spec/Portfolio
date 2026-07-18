document.addEventListener("DOMContentLoaded", () => {


    // ============================================================
    // CUSTOM CURSOR
    // ============================================================

    const cursorDot      = document.getElementById("cursor-dot");
    const cursorFollower = document.getElementById("cursor-follower");

    if (!cursorDot || !cursorFollower) return;

    let targetX = 0, targetY = 0;
    let dotX    = 0, dotY    = 0;
    let followX = 0, followY = 0;

    window.addEventListener("mousemove", (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    function renderCursor() {
        dotX += (targetX - dotX) * 0.2;
        dotY += (targetY - dotY) * 0.2;
        cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

        followX += (targetX - followX) * 0.1;
        followY += (targetY - followY) * 0.1;
        cursorFollower.style.transform = `translate3d(${followX}px, ${followY}px, 0) translate(-50%, -50%)`;

        requestAnimationFrame(renderCursor);
    }

    requestAnimationFrame(renderCursor);

    const hoverTargets = document.querySelectorAll("a, button, .contact-chip, .skill-card, .feature-card, .gallery-btn, .gallery-nav, .gallery-close, .gallery-trigger-thumb");

    hoverTargets.forEach(el => {
        el.addEventListener("mouseenter", () => cursorFollower.classList.add("hovering-link"));
        el.addEventListener("mouseleave", () => cursorFollower.classList.remove("hovering-link"));
    });


    // ============================================================
    // SCROLL REVEAL + PROGRESS BARS
    // ============================================================

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("visible");

            entry.target.querySelectorAll(".bar-fill").forEach(bar => {
                bar.style.width = bar.getAttribute("data-width");
            });
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));


    // ============================================================
    // TEXT SCRAMBLE EFFECT
    // ============================================================

    const scrambleChars = '!<>-_\\/[]{}—=+*^?#________';

    document.querySelectorAll(".scramble").forEach(el => {
        const original = el.getAttribute("data-text") || el.innerText;
        let progress = 0;

        const interval = setInterval(() => {
            el.innerText = original
                .split("")
                .map((char, i) => {
                    if (i < progress) return original[i];
                    return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                })
                .join("");

            if (progress >= original.length) clearInterval(interval);
            progress += 1 / 3;
        }, 30);
    });


    // ============================================================
    // SCROLL PROGRESS BAR
    // ============================================================

    const progressBar = document.getElementById("scrollProgress");

    window.addEventListener("scroll", () => {
        const scrolled   = document.documentElement.scrollTop || document.body.scrollTop;
        const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        if (progressBar) {
            progressBar.style.width = (scrolled / totalHeight * 100) + "%";
        }
    }, { passive: true });


    // ============================================================
    // TRAILER FULLSCREEN ON CLICK
    // ============================================================

    const trailerWrap = document.getElementById("roomx-trailer-wrap");
    const trailerVid  = document.getElementById("roomx-trailer-vid");

    if (trailerWrap && trailerVid) {

        trailerWrap.addEventListener("click", (e) => {
            e.stopPropagation();

            // Try standard fullscreen API, fall back to webkit for Safari
            if (trailerVid.requestFullscreen) {
                trailerVid.requestFullscreen();
            } else if (trailerVid.webkitRequestFullscreen) {
                trailerVid.webkitRequestFullscreen();
            } else if (trailerVid.webkitEnterFullscreen) {
                trailerVid.webkitEnterFullscreen(); // iOS Safari
            }

            trailerVid.muted = false;
            trailerVid.currentTime = 0;
            trailerVid.play();
        });

        // When the user exits fullscreen, go back to silent loop
        const onExitFullscreen = () => {
            const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
            if (!isFullscreen) {
                trailerVid.muted = true;
                trailerVid.play();
            }
        };

        document.addEventListener("fullscreenchange",       onExitFullscreen);
        document.addEventListener("webkitfullscreenchange", onExitFullscreen);
    }


    // ============================================================
    // WHACK-A-MOLE PREVIEW — DOUBLE-CLICK TO FULLSCREEN
    // ============================================================

    const wamVid = document.getElementById("wam-preview-vid");

    if (wamVid) {

        wamVid.addEventListener("dblclick", (e) => {
            e.stopPropagation();

            if (wamVid.requestFullscreen) {
                wamVid.requestFullscreen();
            } else if (wamVid.webkitRequestFullscreen) {
                wamVid.webkitRequestFullscreen();
            } else if (wamVid.webkitEnterFullscreen) {
                wamVid.webkitEnterFullscreen(); // iOS Safari
            }

            wamVid.muted = false;
            wamVid.play();
        });

        const onExitWamFullscreen = () => {
            const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
            if (!isFullscreen) {
                wamVid.muted = true;
                wamVid.play();
            }
        };

        document.addEventListener("fullscreenchange",       onExitWamFullscreen);
        document.addEventListener("webkitfullscreenchange", onExitWamFullscreen);
    }


    // ============================================================
    // PROJECT GALLERIES (Room X, Blender Home, etc.)
    // ============================================================

    const roomxGallery = [
        { src: "Photos/RoomX/gallery/01.svg", caption: "Living room — Blender render" },
        { src: "Photos/RoomX/gallery/02.svg", caption: "Kitchen — Blender render" },
        { src: "Photos/RoomX/gallery/03.svg", caption: "Bedroom — Blender render" },
        { src: "Photos/RoomX/gallery/04.svg", caption: "Top-down floor plan" }
    ];

    const galleryBtn     = document.getElementById("roomx-gallery-btn");
    const galleryModal   = document.getElementById("galleryModal");
    const galleryImage   = document.getElementById("galleryImage");
    const galleryCaption = document.getElementById("galleryCaption");
    const galleryCount   = document.getElementById("galleryCount");
    const galleryClose   = document.getElementById("galleryClose");
    const galleryPrev    = document.getElementById("galleryPrev");
    const galleryNext    = document.getElementById("galleryNext");

    let activeGallery = roomxGallery;
    let galleryIndex  = 0;

    function renderGallerySlide() {
        const slide = activeGallery[galleryIndex];
        galleryImage.src = slide.src;
        galleryImage.alt = slide.caption;
        galleryCaption.textContent = slide.caption;
        galleryCount.textContent = `${galleryIndex + 1} / ${activeGallery.length}`;
    }

    function openGallery(images, startIndex = 0) {
        activeGallery = images;
        galleryIndex = startIndex;
        renderGallerySlide();
        galleryModal.classList.add("open");
        galleryModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeGallery() {
        galleryModal.classList.remove("open");
        galleryModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    function showPrev() {
        galleryIndex = (galleryIndex - 1 + activeGallery.length) % activeGallery.length;
        renderGallerySlide();
    }

    function showNext() {
        galleryIndex = (galleryIndex + 1) % activeGallery.length;
        renderGallerySlide();
    }

    if (galleryModal) {

        if (galleryBtn) {
            galleryBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                openGallery(roomxGallery, 0);
            });
        }

        // Any project thumbnail with a data-gallery attribute opens its own set of images
        document.querySelectorAll(".gallery-trigger-thumb").forEach(thumb => {
            thumb.addEventListener("click", (e) => {
                e.stopPropagation();
                try {
                    const images = JSON.parse(thumb.getAttribute("data-gallery"));
                    if (images && images.length) openGallery(images, 0);
                } catch (err) {
                    console.error("Invalid gallery data:", err);
                }
            });
        });

        galleryClose.addEventListener("click", closeGallery);
        galleryPrev.addEventListener("click", showPrev);
        galleryNext.addEventListener("click", showNext);

        // Click outside the image/caption closes the modal
        galleryModal.addEventListener("click", (e) => {
            if (e.target === galleryModal) closeGallery();
        });

        // Keyboard controls
        document.addEventListener("keydown", (e) => {
            if (!galleryModal.classList.contains("open")) return;
            if (e.key === "Escape")     closeGallery();
            if (e.key === "ArrowLeft")  showPrev();
            if (e.key === "ArrowRight") showNext();
        });
    }


});