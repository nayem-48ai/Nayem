/* ===================================================================
 * @Tnayem48 - Main JS
 *
 * ------------------------------------------------------------------- */

(function(html) {

    "use strict";

    html.className = html.className.replace(/\bno-js\b/g, '') + ' js ';

    /* Animations
     * -------------------------------------------------- */
    const tl = anime.timeline({
        easing: 'easeInOutCubic',
        duration: 800,
        autoplay: false
    })
    .add({
        targets: '#loader',
        opacity: 0,
        duration: 1000,
        begin: function(anim) {
            window.scrollTo(0, 0);
        }
    })
    .add({
        targets: '#preloader',
        opacity: 0,
        complete: function(anim) {
            document.querySelector("#preloader").style.visibility = "hidden";
            document.querySelector("#preloader").style.display = "none";
        }
    })
    .add({
        targets: '.s-header',
        translateY: [-100, 0],
        opacity: [0, 1]
    }, '-=200')
    .add({
        targets: ['.s-intro .text-pretitle', '.s-intro .text-huge-title'],
        translateX: [100, 0],
        opacity: [0, 1],
        delay: anime.stagger(400)
    })
    .add({
        targets: '.circles span',
        keyframes: [
            { opacity: [0, .3] },
            { opacity: [.3, .1], delay: anime.stagger(100, { direction: 'reverse' }) }
        ],
        delay: anime.stagger(100, { direction: 'reverse' })
    })
    .add({
        targets: '.intro-social li',
        translateX: [-50, 0],
        opacity: [0, 1],
        delay: anime.stagger(100, { direction: 'reverse' })
    })
    .add({
        targets: '.intro-scrolldown',
        translateY: [100, 0],
        opacity: [0, 1]
    }, '-=800');


    /* Preloader
     * -------------------------------------------------- */
    const ssPreloader = function() {
        const preloader = document.querySelector('#preloader');
        if (!preloader) return;
        
        window.addEventListener('load', function() {
            document.querySelector('html').classList.remove('ss-preload');
            document.querySelector('html').classList.add('ss-loaded');

            document.querySelectorAll('.ss-animated').forEach(function(item) {
                item.classList.remove('ss-animated');
            });

            tl.play();
        });
    };


    /* Mobile Menu
     * ---------------------------------------------------- */
    const ssMobileMenu = function() {
        const toggleButton = document.querySelector('.mobile-menu-toggle');
        const mainNavWrap = document.querySelector('.main-nav-wrap');
        const siteBody = document.querySelector("body");

        if (!(toggleButton && mainNavWrap)) return;

        toggleButton.addEventListener('click', function(event) {
            event.preventDefault();
            toggleButton.classList.toggle('is-clicked');
            siteBody.classList.toggle('menu-is-open');
        });

        mainNavWrap.querySelectorAll('.main-nav a').forEach(function(link) {
            link.addEventListener("click", function(event) {
                if (window.matchMedia('(max-width: 800px)').matches) {
                    toggleButton.classList.toggle('is-clicked');
                    siteBody.classList.toggle('menu-is-open');
                }
            });
        });

        window.addEventListener('resize', function() {
            if (window.matchMedia('(min-width: 801px)').matches) {
                if (siteBody.classList.contains('menu-is-open')) siteBody.classList.remove('menu-is-open');
                if (toggleButton.classList.contains("is-clicked")) toggleButton.classList.remove("is-clicked");
            }
        });
    };


    /* Highlight active menu link on pagescroll
     * ------------------------------------------------------ */
    const ssScrollSpy = function() {
        const sections = document.querySelectorAll(".target-section");
        window.addEventListener("scroll", navHighlight);

        function navHighlight() {
            let scrollY = window.pageYOffset;
            sections.forEach(function(current) {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 50;
                const sectionId = current.getAttribute("id");
            
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector(".main-nav a[href*=" + sectionId + "]").parentNode.classList.add("current");
                } else {
                    document.querySelector(".main-nav a[href*=" + sectionId + "]").parentNode.classList.remove("current");
                }
            });
        }
    };


    /* Animate elements if in viewport
     * ------------------------------------------------------ */
    const ssViewAnimate = function() {
        const blocks = document.querySelectorAll("[data-animate-block]");
        window.addEventListener("scroll", viewportAnimation);

        function viewportAnimation() {
            let scrollY = window.pageYOffset;
            blocks.forEach(function(current) {
                const viewportHeight = window.innerHeight;
                const triggerTop = (current.offsetTop + (viewportHeight * .2)) - viewportHeight;
                const blockHeight = current.offsetHeight;
                const blockSpace = triggerTop + blockHeight;
                const inView = scrollY > triggerTop && scrollY <= blockSpace;
                const isAnimated = current.classList.contains("ss-animated");

                if (inView && (!isAnimated)) {
                    anime({
                        targets: current.querySelectorAll("[data-animate-el]"),
                        opacity: [0, 1],
                        translateY: [100, 0],
                        delay: anime.stagger(400, { start: 200 }),
                        duration: 800,
                        easing: 'easeInOutCubic',
                        begin: function(anim) {
                            current.classList.add("ss-animated");
                        }
                    });
                }
            });
        }
    };


    /* Swiper
     * ------------------------------------------------------ */
    const ssSwiper = function() {
        const testimonialSwiper = new Swiper('.testimonial-slider', {
            slidesPerView: 1,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                401: { slidesPerView: 1, spaceBetween: 20 },
                801: { slidesPerView: 2, spaceBetween: 32 },
                1201: { slidesPerView: 2, spaceBetween: 80 }
            }
        });
    };


    /* Lightbox
     * ------------------------------------------------------ */
    const ssLightbox = function() {
        const folioLinks = document.querySelectorAll('.folio-list__item-link');
        const modals = [];

        folioLinks.forEach(function(link) {
            let modalbox = link.getAttribute('href');
            let modalContent = document.querySelector(modalbox);

            if (modalContent) {
                let instance = basicLightbox.create(modalContent, {
                    onShow: function(instance) {
                        document.addEventListener("keydown", function(event) {
                            if (event.key === "Escape") {
                                instance.close();
                            }
                        });
                    }
                });
                modals.push({ link: link, instance: instance });
            }
        });

        modals.forEach(function(modal) {
            modal.link.addEventListener("click", function(event) {
                event.preventDefault();
                modal.instance.show();
            });
        });
    };


    /* Alert boxes
     * ------------------------------------------------------ */
    const ssAlertBoxes = function() {
        const boxes = document.querySelectorAll('.alert-box');
        boxes.forEach(function(box) {
            box.addEventListener('click', function(event) {
                if (event.target.matches(".alert-box__close")) {
                    event.stopPropagation();
                    event.target.parentElement.classList.add("hideit");
                    setTimeout(function() {
                        box.style.display = "none";
                    }, 500);
                }
            });
        });
    };

    /* Smoothscroll
     * ------------------------------------------------------ */
    const ssMoveTo = function() {
        const easeFunctions = {
            easeInOutCubic: function(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t * t + b;
                t -= 2;
                return c / 2 * (t * t * t + 2) + b;
            }
        };
        const triggers = document.querySelectorAll('.smoothscroll');
        const moveTo = new MoveTo({
            tolerance: 0,
            duration: 1200,
            easing: 'easeInOutCubic',
            container: window
        }, easeFunctions);
        triggers.forEach(function(trigger) {
            moveTo.registerTrigger(trigger);
        });
    };


    /* Lazy Load Gallery
     * ------------------------------------------------------ */
    const ssLazyLoadGallery = function() {
        const loadGalleryBtn = document.getElementById('load-gallery-btn');
        const galleryContainer = document.getElementById('gallery-content-container');

        if (!loadGalleryBtn || !galleryContainer) return;

        loadGalleryBtn.addEventListener('click', function() {
            const button = this;
            button.textContent = 'লোড হচ্ছে...';
            button.disabled = true;

            fetch('gallery-content.html')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok: ' + response.statusText);
                    }
                    return response.text();
                })
                .then(html => {
                    galleryContainer.innerHTML = html;
                    // বাটনটি কন্টেইনারের ভিতরে থাকায়, innerHTML পরিবর্তন করার পর বাটনটি চলে যাবে।
                    
                    // এখন Swiper এবং Lightbox চালু করুন কারণ গ্যালারির HTML এখন পেজে লোড হয়েছে
                    ssSwiper(); // testimonial slider-এর জন্য
                    ssLightbox();

                    // নতুন লোড হওয়া কনটেন্টের জন্য অ্যানিমেশন আবার চালু করুন
                    const newAnimatedElements = galleryContainer.querySelectorAll("[data-animate-el]");
                    anime({
                        targets: newAnimatedElements,
                        opacity: [0, 1],
                        translateY: [100, 0],
                        delay: anime.stagger(100),
                        duration: 800,
                        easing: 'easeInOutCubic'
                    });
                })
                .catch(error => {
                    console.error('Error loading gallery:', error);
                    galleryContainer.innerHTML = '<p style="color: white; text-align: center;">দুঃখিত, গ্যালারি লোড করা সম্ভব হয়নি।</p>';
                });
        });
    };


    /* Initialize
     * ------------------------------------------------------ */
    (function ssInit() {
        ssPreloader();
        ssMobileMenu();
        ssScrollSpy();
        ssViewAnimate();
        ssSwiper(); // Testimonial slider-এর জন্য এটি পেজ লোডেই চালু থাকবে
        ssAlertBoxes();
        ssMoveTo();

        // শুধুমাত্র গ্যালারি লোড করার জন্য event listener সেট আপ করুন
        ssLazyLoadGallery();
    })();

})(document.documentElement);


/* contact copied
 * ------------------------------------------------------ */
function copyText(element) {
    const textToCopy = element.textContent;

    // আধুনিক ব্রাউজারের জন্য navigator.clipboard ব্যবহার করা ভালো
    if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(function() {
            alert(`UID "${textToCopy}" সফলভাবে কপি করা হয়েছে!`);
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
            alert("দুঃখিত, কপি করা সম্ভব হয়নি।");
        });
    } else {
        // পুরোনো ব্রাউজারের জন্য ফলব্যাক
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            alert(`UID "${textToCopy}" সফলভাবে কপি করা হয়েছে!`);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            alert("দুঃখিত, কপি করা সম্ভব হয়নি।");
        }
        document.body.removeChild(textArea);
    }
}