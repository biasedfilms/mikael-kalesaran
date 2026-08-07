history.scrollRestoration = "manual";
window.scrollTo(0, 0);


/* =========================
   Reveal Animation
========================= */

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            const delay =
                entry.target.dataset.delay || 0;

            setTimeout(()=>{

                entry.target.classList.add("show");

            }, delay);

            observer.unobserve(entry.target);
        }

    });

},{
    threshold:.15
});

reveals.forEach(el=>observer.observe(el));


/* =========================
   Active Navigation
========================= */

const sections = document.querySelectorAll("section[id]");

const navLinks = document.querySelectorAll(".navbar a");

const navObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(!entry.isIntersecting) return;

        const id = entry.target.getAttribute("id");

        navLinks.forEach(link=>{

            link.classList.remove("active");

            if(link.getAttribute("href") === `#${id}`){

                link.classList.add("active");

            }

        });

    });

},{
    rootMargin:"-35% 0px -55% 0px"
});

sections.forEach(section=>{

    navObserver.observe(section);

});

/* =========================
   Smooth Navigation
========================= */

function smoothScroll(targetY, duration = 800) {

    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const startTime = performance.now();

    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animate(currentTime) {

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        window.scrollTo(
            0,
            startY + distance * easeInOutCubic(progress)
        );

        if (progress < 1)
            requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

document.querySelectorAll(".navbar a").forEach(link => {

    link.addEventListener("click", e => {

        e.preventDefault();

        const target = document.querySelector(link.getAttribute("href"));

        smoothScroll(target.offsetTop - 110,);

    });

});

window.addEventListener("load", () => {

    setTimeout(() => {
        document
            .querySelector(".hero-name")
            .classList.add("show");
    }, 500);

});

document.querySelectorAll(".reveal").forEach((el,index)=>{

    setTimeout(()=>{

        el.classList.add("show");

    },index*120);

});