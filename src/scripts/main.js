document.addEventListener('DOMContentLoaded', function () {
    const page = document.body.dataset.page || '';

    initNavbar();
    initSpotlightAndParallax();
    initFragment();
    initReveal();

    if (page === 'contact') {
        initContact();
    }

    if (page === 'poem') {
        initPoem();
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

function initPoem() {
    const bars = document.querySelectorAll('.visualizer span');
    if (!bars.length) return;

    bars.forEach(function (bar) {
        const duration = 900 + Math.random() * 800;
        const delay = Math.random() * 600;
        bar.style.animationDuration = duration.toFixed(0) + 'ms';
        bar.style.animationDelay = '-' + delay.toFixed(0) + 'ms';
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
