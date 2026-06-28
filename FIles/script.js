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

    const hoverTargets = document.querySelectorAll("a, button, .contact-chip, .skill-card, .feature-card");

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


});