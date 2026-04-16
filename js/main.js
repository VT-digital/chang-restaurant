/* ========================================
   Chang Restaurant - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- Hero background ken burns ---
    const heroBg = document.getElementById('heroBg');
    if (heroBg) {
        setTimeout(() => heroBg.classList.add('loaded'), 100);
    }

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('loaded');
                setTimeout(() => preloader.remove(), 600);
            }, 1800);
        });
        // Fallback
        setTimeout(() => {
            preloader.classList.add('loaded');
            setTimeout(() => preloader.remove(), 600);
        }, 3000);
    }

    // --- AOS Init ---
    const aosConfig = { duration: 800, easing: 'ease-out-cubic', once: true, offset: 50 };
    if (typeof AOS !== 'undefined') {
        AOS.init(aosConfig);
    } else {
        // AOS CDN se ještě nenačetlo — počkáme na window.load
        window.addEventListener('load', () => {
            if (typeof AOS !== 'undefined') AOS.init(aosConfig);
        });
    }

    // --- Navbar scroll ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const handleScroll = () => {
            if (window.scrollY > 80) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // --- Mobile menu ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('open');
            });
        });
    }

    // --- Menu page category filter ---
    const categoryBtns = document.querySelectorAll('.menu-category-btn');
    const menuSections = document.querySelectorAll('.menu-section');

    if (categoryBtns.length > 0 && menuSections.length > 0) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const cat = btn.dataset.category;

                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                menuSections.forEach(section => {
                    if (cat === 'all' || section.dataset.category === cat) {
                        section.style.display = 'block';
                        section.style.animation = 'fadeIn 0.4s ease';
                    } else {
                        section.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- Form submission handler (reservation + contact) ---
    function handleFormSubmit(form, successMessage) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // TODO: Napojit na backend (API endpoint pro odesílání e-mailů / ukládání rezervací)
            // fetch('/api/reservation', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })

            const btn = form.querySelector('.btn[type="submit"], .btn');
            const originalText = btn.textContent;
            btn.textContent = successMessage;
            btn.style.background = '#27AE60';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 4000);
        });
    }

    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        handleFormSubmit(reservationForm, 'Odesláno! Budeme Vás kontaktovat.');
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        handleFormSubmit(contactForm, 'Zpráva odeslána! Děkujeme.');
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// Fade in animation for menu filter
const style = document.createElement('style');
style.textContent = '@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }';
document.head.appendChild(style);

/* ========================================
   Copy Protection (preview verze)
   ======================================== */
(function() {
    if (!document.body.classList.contains('has-preview-banner')) return;

    // Console warning
    const consoleStyle = 'color: #C9A84C; font-size: 18px; font-weight: bold; padding: 10px;';
    const subStyle = 'color: #999; font-size: 12px;';
    console.log('%c⚠ AUTORSKÉ PRÁVO', consoleStyle);
    console.log('%cTento web je preview verze ve vlastnictví VT-DIGITAL.CZ.\nNeoprávněné kopírování, úprava nebo redistribuce obsahu jsou zakázány.\nKontakt: https://vt-digital.cz', subStyle);

    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable image dragging
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // Block keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // F12 — DevTools
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }

        // Ctrl+U / Cmd+U — View source
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            return false;
        }

        // Ctrl+S / Cmd+S — Save page
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+I/J/C / Cmd+Opt+I/J/C — DevTools
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+P / Cmd+P — Print
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            return false;
        }
    });

    // Disable text selection via JS as additional layer
    document.addEventListener('selectstart', function(e) {
        const tag = e.target.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
            e.preventDefault();
            return false;
        }
    });
})();