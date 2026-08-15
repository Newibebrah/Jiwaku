document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {
    const page = document.body.dataset.page || '';
    const editorialPages = ['poem', 'photography', 'writing'];
    const isEditorial = editorialPages.indexOf(page) !== -1;

    initNavbar();
    initReveal();

    if (!isEditorial) {
        initSpotlightAndParallax();
        initFragment();
    }

    if (page === 'contact') {
        initContact();
    }

    if (page === 'poem') {
        initPoemStanzas();
    }

    if (page === 'photography') {
        initLightbox();
    }
});

function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
        items.forEach(function (el) {
            el.classList.add('is-visible');
        });
        return;
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el) {
        observer.observe(el);
    });
}

function initNavbar() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbar = document.querySelector('.navbar');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarBackdrop = document.querySelector('.navbar-backdrop');

    if (!navbarToggle || !navbar || !navbarCollapse) return;

    const MOBILE_QUERY = window.matchMedia('(max-width: 767px)');

    const isMobile = function () {
        return MOBILE_QUERY.matches;
    };

    const setMenuState = function (isOpen) {
        navbar.classList.toggle('navbar-open', isOpen);
        if (navbarBackdrop) {
            navbarBackdrop.classList.toggle('navbar-backdrop-visible', isOpen);
        }
        navbarToggle.setAttribute('aria-expanded', String(isOpen));
        const icon = navbarToggle.querySelector('i');

        if (icon) {
            icon.classList.toggle('bx-menu', !isOpen);
            icon.classList.toggle('bx-x', isOpen);
        }
    };

    navbarToggle.addEventListener('click', function (event) {
        event.stopPropagation();
        if (!isMobile()) return;
        const isOpen = !navbar.classList.contains('navbar-open');
        setMenuState(isOpen);
    });

    document.addEventListener('click', function (event) {
        if (!navbar.classList.contains('navbar-open')) return;

        const clickInsideNavbar = navbar.contains(event.target);
        if (!clickInsideNavbar) {
            setMenuState(false);
        }
    });

    navbarCollapse.addEventListener('click', function (event) {
        const target = event.target.closest('a');
        if (target) {
            setMenuState(false);
        }
    });

    if (navbarBackdrop) {
        navbarBackdrop.addEventListener('click', function () {
            setMenuState(false);
        });
    }

    const resetOnDesktop = function (event) {
        if (!event.matches) {
            setMenuState(false);
        }
    };

    if (typeof MOBILE_QUERY.addEventListener === 'function') {
        MOBILE_QUERY.addEventListener('change', resetOnDesktop);
    } else {
        window.addEventListener('resize', function () {
            if (!isMobile()) setMenuState(false);
        });
    }
}

function initSpotlightAndParallax() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const root = document.documentElement;
    let frame = null;

    document.addEventListener('mousemove', function (event) {
        if (frame) return;

        frame = requestAnimationFrame(function () {
            const x = (event.clientX / window.innerWidth) * 100;
            const y = (event.clientY / window.innerHeight) * 100;
            const shiftX = ((event.clientX / window.innerWidth) - 0.5) * -3;
            const shiftY = ((event.clientY / window.innerHeight) - 0.5) * -3;

            root.style.setProperty('--mouse-x', x.toFixed(2) + '%');
            root.style.setProperty('--mouse-y', y.toFixed(2) + '%');
            root.style.setProperty('--px', shiftX.toFixed(2) + 'px');
            root.style.setProperty('--py', shiftY.toFixed(2) + 'px');

            frame = null;
        });
    });
}

const FRAGMENT_LINES = [
    'Malam itu hujan tidak pernah reda...',
    'Kau bilang fiksi adalah cara kita kabur...',
    'Kenangan hanyalah bayangan dari cahaya...',
    'Aku menulis agar aku ada.'
];

function initFragment() {
    const fragment = document.querySelector('.fragment p');
    if (!fragment) return;

    let index = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduceMotion ? 0 : 700;

    fragment.textContent = FRAGMENT_LINES[0];

    setInterval(function () {
        index = (index + 1) % FRAGMENT_LINES.length;
        fragment.parentElement.classList.add('is-hidden');

        setTimeout(function () {
            fragment.textContent = FRAGMENT_LINES[index];
            fragment.parentElement.classList.remove('is-hidden');
        }, duration);
    }, 7000);
}

function initPoemStanzas() {
    const stanzas = document.querySelectorAll('.poem-lines p');
    if (!stanzas.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
        stanzas.forEach(function (el) {
            el.classList.add('is-visible');
        });
        return;
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            stanzas.forEach(function (el, i) {
                setTimeout(function () {
                    el.classList.add('is-visible');
                }, i * 150);
            });
            observer.disconnect();
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    observer.observe(document.querySelector('.poem-lines'));
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const img = lightbox.querySelector('.lightbox-img');
    const title = lightbox.querySelector('.lightbox-title');
    const caption = lightbox.querySelector('.lightbox-caption');
    const count = lightbox.querySelector('.lightbox-count');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const tiles = document.querySelectorAll('.photo-tile');

    let batch = [];
    let index = 0;
    let align = 'left';
    let touchX = 0;

    const render = function () {
        if (!batch.length) return;
        img.src = batch[index];
        img.alt = title.textContent;
        count.textContent = (index + 1) + ' / ' + batch.length;
        caption.style.textAlign = align;
    };

    const show = function (step) {
        index = (index + step + batch.length) % batch.length;
        render();
    };

    const openLightbox = function (tile) {
        batch = JSON.parse(tile.getAttribute('data-batch') || '[]');
        index = 0;
        align = tile.getAttribute('data-align') || 'left';
        title.textContent = tile.getAttribute('data-title') || '';
        caption.textContent = tile.getAttribute('data-caption') || '';
        if (!batch.length) return;
        render();
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    };

    const closeLightbox = function () {
        lightbox.hidden = true;
        img.src = '';
        document.body.style.overflow = '';
    };

    tiles.forEach(function (tile) {
        tile.addEventListener('click', function () {
            openLightbox(tile);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', function () { show(-1); });
    nextBtn.addEventListener('click', function () { show(1); });

    lightbox.addEventListener('click', function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    lightbox.addEventListener('touchstart', function (event) {
        touchX = event.touches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (event) {
        const delta = event.changedTouches[0].clientX - touchX;
        if (Math.abs(delta) > 40) {
            show(delta < 0 ? 1 : -1);
        }
    }, { passive: true });

    document.addEventListener('keydown', function (event) {
        if (lightbox.hidden) return;
        if (event.key === 'Escape') closeLightbox();
        if (event.key === 'ArrowLeft') show(-1);
        if (event.key === 'ArrowRight') show(1);
    });
}

function initContact() {
    const form = document.getElementById('contact-form');
    const plane = document.querySelector('.plane');
    const toast = document.getElementById('toast');
    if (!form) return;

    const showToast = function () {
        if (!toast) return;
        toast.classList.add('show');
        setTimeout(function () {
            toast.classList.remove('show');
        }, 3200);
    };

    const launchPlane = function () {
        if (plane) {
            plane.classList.add('fly');
        }
    };

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const endpoint = form.getAttribute('action');

        if (endpoint && endpoint.includes('YOUR_FORM_ID')) {
            launchPlane();
            showToast();
            form.reset();
            return;
        }

        const data = new FormData(form);
        const submitBtn = form.querySelector('[type="submit"]');

        if (submitBtn) {
            submitBtn.disabled = true;
        }

        fetch(endpoint, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        })
            .then(function (response) {
                if (response.ok) {
                    launchPlane();
                    showToast();
                    form.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(function () {
                alert('Maaf, pesanmu gagal terkirim. Coba lagi, ya.');
            })
            .finally(function () {
                if (submitBtn) {
                    submitBtn.disabled = false;
                }
            });
    });
}
