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
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
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

    // --- Reservation form ---
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(reservationForm);
            const data = Object.fromEntries(formData);

            // Show success
            const btn = reservationForm.querySelector('.btn');
            const originalText = btn.textContent;
            btn.textContent = 'Odeslano! Budeme Vas kontaktovat.';
            btn.style.background = '#27AE60';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
                reservationForm.reset();
            }, 4000);
        });
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