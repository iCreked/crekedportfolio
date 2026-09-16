// 1. ИСПРАВЛЕННЫЙ КУРСОР-ТРЕКЕР (ЛЕТАЕТ НАД ВСЕМИ СЛОЯМИ)
const cursorDot = document.querySelector('.cursor-dot');
let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}, { passive: true });

function animateCursor() {
    if (cursorDot) {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursorDot.style.left = cursorX + 'px';
        cursorDot.style.top = cursorY + 'px';
    }
    requestAnimationFrame(animateCursor);
}
animateCursor();

const interactiveElements = document.querySelectorAll('a, button, .card, .close-modal, .menu-toggle');
interactiveElements.forEach(elem => {
    elem.addEventListener('mouseenter', () => { if (cursorDot) cursorDot.classList.add('hovered'); });
    elem.addEventListener('mouseleave', () => { if (cursorDot) cursorDot.classList.remove('hovered'); });
});

// 2. АВТОМАТИЧЕСКАЯ СОРТИРОВКА КАРТОЧЕК ПО ДАТЕ ИЗ HTML
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector('.grid');
    if (grid) {
        const cardElements = Array.from(grid.querySelectorAll('.card'));
        cardElements.sort((a, b) => {
            const dateA = new Date(a.getAttribute('data-date') || '1970-01-01');
            const dateB = new Date(b.getAttribute('data-date') || '1970-01-01');
            return dateB - dateA; 
        });
        cardElements.forEach(card => grid.appendChild(card));
    }
});

// 3. ЛОГИКА ПЕРЕКЛЮЧЕНИЯ КАТЕГОРИЙ ПОРТФОЛИО (ВКЛАДКИ)
const filterButtons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const filterValue = button.getAttribute('data-filter');

        const currentCards = document.querySelectorAll('.card');
        currentCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (filterValue === 'all' || filterValue === cardCategory) {
                card.classList.remove('hide');
            } else {
                card.classList.add('hide');
            }
        });
    });
});
// 4. УМНЫЙ ПЛЕЕР С АВТО-КНОПКАМИ "ДО / ПОСЛЕ" (СТАБИЛЬНЫЙ)
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.close-modal');
const videoPlayer = document.getElementById('video-player');
const toggleWrapper = document.getElementById('modalToggleWrapper');

function initVideoLinks() {
    const currentCards = document.querySelectorAll('.card');
    currentCards.forEach(card => {
        card.onclick = null;
        card.addEventListener('click', () => {
            const mainVideo = card.getAttribute('data-video');
            const beforeVideo = card.getAttribute('data-before');
            
            if (!videoPlayer || !toggleWrapper) return;
            
            toggleWrapper.innerHTML = "";
            videoPlayer.src = mainVideo + "?autoplay=1";
            if (modal) modal.classList.add('active');
            
            if (beforeVideo) {
                const isEn = window.location.href.includes('index_en.html');
                const txtBefore = isEn ? "Before" : "До монтажа";
                const txtAfter = isEn ? "After" : "После монтажа";

                toggleWrapper.innerHTML = `
                    <button class="toggle-video-btn btn-before" data-src="${beforeVideo}">${txtBefore}</button>
                    <button class="toggle-video-btn btn-after active" data-src="${mainVideo}">${txtAfter}</button>
                `;
                
                const btnBefore = toggleWrapper.querySelector('.btn-before');
                const btnAfter = toggleWrapper.querySelector('.btn-after');
                
                btnBefore.addEventListener('click', (e) => {
                    e.stopPropagation();
                    btnAfter.classList.remove('active');
                    btnBefore.classList.add('active');
                    videoPlayer.src = beforeVideo + "?autoplay=1";
                });
                
                btnAfter.addEventListener('click', (e) => {
                    e.stopPropagation();
                    btnBefore.classList.remove('active');
                    btnAfter.classList.add('active');
                    videoPlayer.src = mainVideo + "?autoplay=1";
                });
            }
        });
    });
}
initVideoLinks();

if (closeModal && modal && videoPlayer && toggleWrapper) {
    closeModal.addEventListener('click', () => { modal.classList.remove('active'); videoPlayer.src = ""; toggleWrapper.innerHTML = ""; });
}
if (modal && videoPlayer && toggleWrapper) {
    modal.addEventListener('click', (e) => { if(e.target === modal) { modal.classList.remove('active'); videoPlayer.src = ""; toggleWrapper.innerHTML = ""; } });
}

// 5. НАДЕЖНЫЙ ПЛАВНЫЙ СКРОЛЛ ПО СЕКЦИЯМ
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// 6. АНИМАЦИЯ КИНЕМАТОГРАФИЧНОГО ПОЯВЛЕНИЯ БЛОКОВ ПРИ СКРОЛЛЕ
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
    const elementsToAnimate = document.querySelectorAll('.section-title, .bio-text, .portfolio-filters, .grid, footer > *');
    elementsToAnimate.forEach(element => {
        element.classList.add('fade-in-section');
        scrollObserver.observe(element);
    });
});

// 7. ПЕРЕТАСКИВАНИЕ КНОПОК МЫШКОЙ (DRAG-TO-SCROLL) ДЛЯ ПК
const slider = document.querySelector('.portfolio-filters');
let isDown = false, startX, scrollLeft;

if (slider) {
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => { isDown = false; });
    document.addEventListener('mouseup', () => { isDown = false; });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5; 
        slider.scrollLeft = scrollLeft - walk;
    });
}

// 8. УПРАВЛЕНИЕ МОБИЛЬНЫМ ГАМБУРГЕР-МЕНЮ (ТРИ ПОЛОСКИ)
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById('mobile-menu');
    const navWrapper = document.querySelector('.nav-links-wrapper');
    const navItems = document.querySelectorAll('.nav-item, .lang-switch-box');

    if (menuToggle && navWrapper) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navWrapper.classList.toggle('active');
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navWrapper.classList.remove('active');
            });
        });
    }
});

// 9. ЛОГИКА РАБОТЫ КНОПКИ "НАВЕРХ"
document.addEventListener("DOMContentLoaded", () => {
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                scrollTopBtn.classList.add('is-visible');
            } else {
                scrollTopBtn.classList.remove('is-visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
