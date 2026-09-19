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
            
            // Если у карточки прописан исходник data-before — создаем кнопки
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
                const customCursor = document.querySelector('.cursor-dot'); // Находим курсор
                
                // РАСШИРЕНИЕ КУРСOРА ДЛЯ КНОПОК ПОРТФОЛИО
                if (btnBefore && btnAfter && customCursor) {
                    btnBefore.addEventListener('mouseenter', () => customCursor.classList.add('hovered'));
                    btnBefore.addEventListener('mouseleave', () => customCursor.classList.remove('hovered'));
                    btnAfter.addEventListener('mouseenter', () => customCursor.classList.add('hovered'));
                    btnAfter.addEventListener('mouseleave', () => customCursor.classList.remove('hovered'));
                }
                
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
const elementsToAnimate = document.querySelectorAll('.section-title, .bio-text, .portfolio-filters, .grid, .reviews-grid, footer > *');
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
// 11. ИНТЕРАКТИВНЫЕ КНОПКИ РАБОТ ВНУТРИ ОТЗЫВОВ (С ПОДДЕРЖКОЙ КНОПОК ДО / ПОСЛЕ В ПЛЕЕРЕ)
document.addEventListener("DOMContentLoaded", () => {
    const reviewCards = document.querySelectorAll('.review-card');
    const videoModal = document.querySelector('.modal');
    const mainVideoIframe = document.getElementById('video-player');
    const modalButtonsWrapper = document.getElementById('modalToggleWrapper');
    const customCursor = document.querySelector('.cursor-dot');

    reviewCards.forEach(card => {
        const videoUrl = card.getAttribute('data-review-video');
        const beforeUrl = card.getAttribute('data-review-before'); // Подхватываем исходник для отзыва
        const isPrivate = card.getAttribute('data-private') === 'true';
        const holder = card.querySelector('.review-video-link-holder');
        const isEnPage = window.location.href.includes('index_en.html');

        if (holder) {
            // Вариант 1: Конфиденциальный отзыв
            if (isPrivate) {
                const privateText = isEnPage ? "Confidential / NDA 🔒" : "Конфиденциально 🔒";
                holder.innerHTML = `<span class="review-work-btn is-private">${privateText}</span>`;
            } 
            // Вариант 2: Отзыв со ссылкой на видео (обычное или со сравнением)
            else if (videoUrl) {
                const btnText = isEnPage ? "Watch project ▶" : "Смотреть работу ▶";
                holder.innerHTML = `<span class="review-work-btn">${btnText}</span>`;

                const btn = holder.querySelector('.review-work-btn');
                
                btn.addEventListener('mouseenter', () => { if (customCursor) customCursor.classList.add('hovered'); });
                btn.addEventListener('mouseleave', () => { if (customCursor) customCursor.classList.remove('hovered'); });

                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (!mainVideoIframe || !videoModal || !modalButtonsWrapper) return;
                    
                    // Полностью очищаем панель переключателей перед открытием
                    modalButtonsWrapper.innerHTML = "";
                    
                    // Загружаем основное видео по умолчанию
                    mainVideoIframe.src = videoUrl + "?autoplay=1";
                    videoModal.classList.add('active');

                    // ЕСЛИ У ОТЗЫВА ЕСТЬ ИСХОДНИК — СОЗДАЕМ КНОПКИ В ПЛЕЕРЕ
                    if (beforeUrl) {
                        const txtBefore = isEnPage ? "Before" : "До монтажа";
                        const txtAfter = isEnPage ? "After" : "После монтажа";

                        modalButtonsWrapper.innerHTML = `
                            <button class="toggle-video-btn btn-before" data-src="${beforeUrl}">${txtBefore}</button>
                            <button class="toggle-video-btn btn-after active" data-src="${videoUrl}">${txtAfter}</button>
                        `;
                        
                        const btnBefore = modalButtonsWrapper.querySelector('.btn-before');
                        const btnAfter = modalButtonsWrapper.querySelector('.btn-after');
                        
                        // РАСШИРЕНИЕ КУРСOРА ДЛЯ КНОПОК В ОТЗЫВАХ
                        if (btnBefore && btnAfter && customCursor) {
                            btnBefore.addEventListener('mouseenter', () => customCursor.classList.add('hovered'));
                            btnBefore.addEventListener('mouseleave', () => customCursor.classList.remove('hovered'));
                            btnAfter.addEventListener('mouseenter', () => customCursor.classList.add('hovered'));
                            btnAfter.addEventListener('mouseleave', () => customCursor.classList.remove('hovered'));
                        }
                        
                        btnBefore.addEventListener('click', (ev) => {
                            ev.stopPropagation();
                            btnAfter.classList.remove('active');
                            btnBefore.classList.add('active');
                            mainVideoIframe.src = beforeUrl + "?autoplay=1";
                        });
                        
                        btnAfter.addEventListener('click', (ev) => {
                            ev.stopPropagation();
                            btnBefore.classList.remove('active');
                            btnAfter.classList.add('active');
                            mainVideoIframe.src = videoUrl + "?autoplay=1";
                        });
                    }
                });
            }
        }
    });
});
// 12. АНИМАЦИЯ ПЛАВНОГО НАРАСТАНИЯ ЦИФР СТАТИСТИКИ ПРИ СКРОЛЛЕ
document.addEventListener("DOMContentLoaded", () => {
    const statsSection = document.querySelector('.stats-section');
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    if (statsSection && counters.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        
                        // Защита для нуля (дедлайны)
                        if (target === 0) {
                            counter.innerText = "0%";
                            return;
                        }

                        const speed = target > 30 ? 30 : 1;
                        
                        const updateCount = () => {
                            const count = +counter.innerText.replace('+', '').replace('%', '');
                            const inc = Math.ceil(target / speed);

                            if (count < target) {
                                let displayValue = count + inc;
                                if (displayValue > target) displayValue = target;
                                
                                if (target === 3) counter.innerText = displayValue + "+";
                                else if (target === 100) counter.innerText = displayValue + "%";
                                else counter.innerText = displayValue;
                                
                                setTimeout(updateCount, 40);
                            } else {
                                if (target === 3) counter.innerText = target + "+";
                                else if (target === 100) counter.innerText = target + "%";
                                else counter.innerText = target;
                            }
                        };
                        updateCount();
                    });
                    
                    statsObserver.unobserve(statsSection);
                }
            });
        }, { threshold: 0.2 });

        statsObserver.observe(statsSection);
    }
});
// ==========================================================================
// ОБЪЕДИНЕННАЯ СИСТЕМА УМНОЙ ФИЛЬТРАЦИИ И ДВУХСТОРОННЕГО РАСКРЫТИЯ ПОРТФОЛИО
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const portfolioSection = document.getElementById('portfolio');
    const customCursor = document.querySelector('.cursor-dot');
    const isEn = window.location.href.includes('index_en.html');

    let isExpanded = false; // Флаг: развернул ли пользователь вкладку "all" вручную
    let currentFilter = 'all'; // Текущий активный фильтр

    // Маркируем все скрытые по умолчанию карточки (с 9 по 13), чтобы скрипт их запомнил
    const initialHiddenCards = document.querySelectorAll('.card.initial-hide');
    initialHiddenCards.forEach(card => card.setAttribute('data-dynamic-hide', 'true'));

    // Функция обновления сетки в зависимости от фильтра и состояния кнопки
    function updatePortfolioGrid() {
        const cards = document.querySelectorAll('.card');

        cards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const isDynamicHide = card.getAttribute('data-dynamic-hide') === 'true';

            // Условие 1: Подходит ли карточка под выбранный фильтр категорий?
            const matchesFilter = (currentFilter === 'all' || cardCategory === currentFilter);

            // Условие 2: Должна ли карточка быть скрыта лимитом (если фильтр "all" и кнопка не нажата)
            const shouldHideByLimit = (currentFilter === 'all' && isDynamicHide && !isExpanded);

            if (matchesFilter && !shouldHideByLimit) {
                // Плавно показываем карточку
                card.classList.remove('initial-hide');
                if (customCursor) {
                    card.addEventListener('mouseenter', () => customCursor.classList.add('hovered'));
                    card.addEventListener('mouseleave', () => customCursor.classList.remove('hovered'));
                }
            } else {
                // Плавно скрываем карточку
                card.classList.add('initial-hide');
            }
        });

        // Управляем отображением и текстом кнопки "Показать все работы"
        if (loadMoreBtn) {
            if (currentFilter !== 'all') {
                // Если выбран конкретный подканал монтажа, прячем кнопку (все работы уже на экране)
                loadMoreBtn.parentElement.style.display = 'none';
            } else {
                // Если мы на вкладке "Последние работы", возвращаем кнопку на место
                loadMoreBtn.parentElement.style.display = 'flex';
                loadMoreBtn.innerText = isExpanded 
                    ? (isEn ? "Hide projects ↖" : "Скрыть работы ↖") 
                    : (isEn ? "Show all projects ↘" : "Показать все работы ↘");
            }
        }

        // Переинициализируем плееры для всех видимых на данный момент карточек
        if (typeof initVideoLinks === 'function') {
            initVideoLinks();
        }
    }

    // ЛОГИКА КЛИКА ПО КНОПКАМ ФИЛЬТРОВ КАТЕГОРИЙ (С ФИКСАЦИЕЙ ВЫСОТЫ БЕЗ СКАЧКОВ)
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const grid = document.querySelector('.grid');
            const portfolioContainer = document.querySelector('.portfolio-container');
            
            if (button.classList.contains('active')) return;

            // 1. Измеряем и жестко фиксируем текущую высоту контейнера, чтобы нижние блоки не прыгали
            if (portfolioContainer) {
                portfolioContainer.style.minHeight = portfolioContainer.offsetHeight + 'px';
            }

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            currentFilter = button.getAttribute('data-filter');
            
            if (grid) {
                // ФАЗА 1: Плавно гасим сетку
                grid.style.opacity = '0';
                
                // ФАЗА 2: Пока всё скрыто (через 250мс)
                setTimeout(() => {
                    // Пересчитываем карточки за кулисами
                    updatePortfolioGrid();
                    
                    // ФАЗА 3: Зажигаем сетку обратно
                    grid.style.opacity = '1';
                    
                    // ФАЗА 4: После того как сетка проявилась (еще через 250мс), мягко отпускаем высоту под новые карты
                    setTimeout(() => {
                        if (portfolioContainer) {
                            portfolioContainer.style.transition = 'min-height 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
                            portfolioContainer.style.minHeight = '0px'; // Возвращаем в авто-режим
                        }
                    }, 250);
                }, 250);
            } else {
                updatePortfolioGrid();
            }
        });
    });

    // ЛОГИКА КЛИКА ПО КНОПКЕ "ПОКАЗАТЬ ВСЕ / СКРЫТЬ РАБОТЫ" (БАРХАТНАЯ АНИМАЦИЯ)
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            if (!isExpanded) {
                // РЕЖИМ: Разворачиваем вкладку "all" (тут всё отлично и плавно)
                isExpanded = true;
                updatePortfolioGrid();
            } else {
                // РЕЖИМ: БАРХАТНОЕ СВЕРНУТЬ РАБОТЫ (БЕЗ ЕДИНОГО РЫВКА)
                isExpanded = false;

                // 1. Сначала плавно и мягко запускаем скролл наверх к заголовку
                if (portfolioSection) {
                    portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

                // 2. Даем экрану 150мс, чтобы уйти наверх, и только тогда незаметно для глаз схлопываем карточки снизу
                setTimeout(() => {
                    updatePortfolioGrid();
                }, 150);
            }
        });
    }

});
