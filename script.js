document.addEventListener('DOMContentLoaded', () => {
    const goTopBtn = document.getElementById('goTopBtn');

    const updateGoTopVisibility = () => {
        if (!goTopBtn) return;
        const showButton = window.scrollY > 300;
        goTopBtn.classList.toggle('show', showButton);
    };

    if (goTopBtn) {
        goTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    window.addEventListener('scroll', updateGoTopVisibility, { passive: true });
    updateGoTopVisibility();

    const nav = document.querySelector('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    const closeNavMenu = () => {
        if (!nav || !navToggle) return;
        nav.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
    };

    const toggleNavMenu = () => {
        if (!nav || !navToggle) return;
        const isOpen = nav.classList.toggle('nav-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
        navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    };

    if (navToggle) {
        navToggle.addEventListener('click', toggleNavMenu);
    }

    document.addEventListener('click', (e) => {
        if (!nav || !navMenu || !navToggle || window.innerWidth > 820) return;
        if (!nav.contains(e.target)) closeNavMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 820) closeNavMenu();
    });

    const smoothScrollTo = (selector) => {
        const el = document.querySelector(selector);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const navAnchors = document.querySelectorAll('.nav-links a, .nav-cta a[href^="#"]');
    navAnchors.forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const target = anchor.getAttribute('href');

            if (!target) return;

            if (target === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                closeNavMenu();
                return;
            }

            if (target.startsWith('#') && document.querySelector(target)) {
                e.preventDefault();
                smoothScrollTo(target);
                closeNavMenu();
            }
        });
    });

    const sourceCodeButtons = document.querySelectorAll('.project-btn-secondary');
    const sourceCodePopup = document.getElementById('sourceCodePopup');
    const closePopupButton = document.getElementById('closePopup');

    if (sourceCodePopup) {
        const openPopup = () => {
            sourceCodePopup.classList.add('show');
            sourceCodePopup.setAttribute('aria-hidden', 'false');
        };

        const closePopup = () => {
            sourceCodePopup.classList.remove('show');
            sourceCodePopup.setAttribute('aria-hidden', 'true');
        };

        sourceCodeButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                openPopup();
            });
        });

        if (closePopupButton) {
            closePopupButton.addEventListener('click', closePopup);
        }

        sourceCodePopup.addEventListener('click', (e) => {
            if (e.target === sourceCodePopup) closePopup();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sourceCodePopup.classList.contains('show')) {
                closePopup();
            }
        });
    }

    const experienceItems = document.querySelectorAll('.experience-item');
    const experienceTitle = document.querySelector('.experience-detail h3');
    const experienceRole = document.querySelector('.experience-role');
    const experienceSummary = document.querySelector('.experience-summary');

    if (experienceItems.length && experienceTitle && experienceRole && experienceSummary) {
        const setActiveExperience = (item) => {
            experienceItems.forEach((entry) => entry.classList.remove('active'));
            item.classList.add('active');

            experienceTitle.textContent = item.dataset.title || '';
            experienceRole.textContent = item.dataset.role || '';
            experienceSummary.textContent = item.dataset.summary || '';
        };

        experienceItems.forEach((item) => {
            item.addEventListener('click', () => setActiveExperience(item));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveExperience(item);
                }
            });
        });
    }

    const contactForm = document.querySelector('.contact-form');
    const contactStatus = document.getElementById('contactStatus');

    if (contactForm && contactStatus) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const defaultButtonText = submitButton ? submitButton.textContent : 'Send Message';

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!submitButton) return;

            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            contactStatus.classList.remove('success', 'error');
            contactStatus.textContent = 'Submitting your message...';

            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: new FormData(contactForm),
                    headers: {
                        Accept: 'application/json'
                    }
                });

                if (response.ok) {
                    contactStatus.classList.add('success');
                    contactStatus.textContent = 'Message sent successfully. Thank you!';
                    contactForm.reset();
                } else {
                    contactStatus.classList.add('error');
                    contactStatus.textContent = 'Could not send right now. Please try again in a moment.';
                }
            } catch (error) {
                contactStatus.classList.add('error');
                contactStatus.textContent = 'Network error. Please check your connection and try again.';
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = defaultButtonText;
            }
        });
    }

    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach((el) => io.observe(el));
});
