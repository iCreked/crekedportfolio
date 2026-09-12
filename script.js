// 1. Минималистичный курсор-точка с инерцией
const cursorDot = document.querySelector('.cursor-dot');
let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

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

// Увеличение курсора при наведении
const interactiveElements = document.querySelectorAll('a, button, .card, .close-modal');
interactiveElements.forEach(elem => {
    elem.addEventListener('mouseenter', () => { if (cursorDot) cursorDot.classList.add('hovered'); });
    elem.addEventListener('mouseleave', () => { if (cursorDot) cursorDot.classList.remove('hovered'); });
});

// === НОВЫЙ БЛОК: СОРТИРОВКА КАРТОЧЕК ПО ДАТЕ ===
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector('.grid');
    if (grid) {
        // Собираем все карточки видеороликов из HTML
        const cardElements = Array.from(grid.querySelectorAll('.card'));
        
        // Сортируем их: переводим строку даты в формат времени и сравниваем
        cardElements.sort((a, b) => {
            const dateA = new Date(a.getAttribute('data-date') || '1970-01-01');
            const dateB = new Date(b.getAttribute('data-date') || '1970-01-01');
            return dateB - dateA; // Свежие даты идут наверх
        });
        
        // Возвращаем отсортированные карточки обратно в сетку сайта
        cardElements.forEach(card => grid.appendChild(card));
    }
});

// 2. Логика переключения категорий в портфолио
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

// 3. Открытие плеера во всплывающем окне
function initVideoLinks() {
    const currentCards = document.querySelectorAll('.card');
    currentCards.forEach(card => {
        // Убираем старые слушатели перед добавлением новых
        card.onclick = null; 
        card.addEventListener('click', () => {
            const videoUrl = card.getAttribute('data-video');
            videoPlayer.src = videoUrl + "?autoplay=1"; 
            modal.classList.add('active');
        });
    });
}

const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.close-modal');
const videoPlayer = document.getElementById('video-player');

// Запускаем при первой загрузке
initVideoLinks();

closeModal.addEventListener('click', () => { modal.classList.remove('active'); videoPlayer.src = ""; });
modal.addEventListener('click', (e) => { if(e.target === modal) { modal.classList.remove('active'); videoPlayer.src = ""; } });

// 4. Надежный плавный скролл по секциям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 5. АНИМАЦИЯ ПОЯВЛЕНИЯ БЛОКОВ ПРИ СКРОЛЛЕ (ИСПРАВЛЕННАЯ)
const observerOptions = { 
    root: null, 
    rootMargin: '0px', 
    threshold: 0.1 // Блок начнет проявляться, как только 10% его площади войдет на экран
};

const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Срабатывает один раз для плавности
        }
    });
}, observerOptions);

// Запускаем слежку после полной загрузки страницы
document.addEventListener("DOMContentLoaded", () => {
    // Четко перечисляем заголовки, текстовые контейнеры, сетку карточек и футер
    const elementsToAnimate = document.querySelectorAll(
        '.section-title, .bio-text, .portfolio-filters, .grid, footer > *'
    );
    
    elementsToAnimate.forEach(element => {
        element.classList.add('fade-in-section'); // Задаем начальную прозрачность и сдвиг
        scrollObserver.observe(element); // Включаем слежение
    });
});

// 6. ПЕРЕ-ТАСКИВАНИЕ КНОПОК МЫШКОЙ (DRAG-TO-SCROLL) ДЛЯ ПК
const slider = document.querySelector('.portfolio-filters');
let isDown = false;
let startX;
let scrollLeft;

if (slider) {
    // Нажали кнопку мыши на блоке с кнопками
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active-drag');
        // Запоминаем стартовую позицию курсора и скролла
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    // Увели мышь за пределы блока или отпустили кнопку
    slider.addEventListener('mouseleave', () => { isDown = false; });
    document.addEventListener('mouseup', () => { isDown = false; });

    // Двигаем мышь
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return; // Если мышь не зажата, ничего не делаем
        e.preventDefault(); // Блокируем стандартное выделение элементов
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5; // Умножение на 1.5 задает скорость прокрутки
        slider.scrollLeft = scrollLeft - walk;
    });
}
const backToTopBtn = document.getElementById("backToTop");

window.onscroll = function() {
    if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
        backToTopBtn.style.display = "flex";
    } else {
        backToTopBtn.style.display = "none";
    }
};

backToTopBtn.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth" /* Тот самый плавный скролл */
    });
});
