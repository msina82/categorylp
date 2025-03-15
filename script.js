/**
 * منوی هاور و ریسپانسیو Dedsec Shop
 * طراحی شده با قابلیت‌های مدرن و بهینه‌سازی شده
 */

// بارگذاری مطمئن اسکریپت - تنها اجرا می‌شود وقتی DOM به طور کامل آماده است
document.addEventListener('DOMContentLoaded', function() {
    // تنظیمات تم روشن/تاریک
    setupThemeToggle();
    
    // راه‌اندازی منوی اصلی
    setupMainMenu();
    
    // تنظیم دسترسی‌پذیری
    setupAccessibility();
    
    // بهینه‌سازی تصاویر
    setupLazyLoading();
    
    // اضافه کردن کلاس loaded به body برای انیمیشن‌های پس از لود
    document.body.classList.add('loaded');
});

/**
 * تنظیم حالت روشن/تاریک
 */
function setupThemeToggle() {
    const themeToggle = document.getElementById('input');
    const html = document.documentElement;
    
    if (!themeToggle) return;

    // بررسی تنظیمات ذخیره شده یا پیش‌فرض سیستم
    const savedTheme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    // اعمال تم اولیه
    html.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'dark';

    // تغییر تم
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // پاسخگویی به تغییرات تم سیستم
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            themeToggle.checked = newTheme === 'dark';
        }
    });
}

/**
 * راه‌اندازی منوی اصلی
 */
function setupMainMenu() {
    // متغیرهای منو
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navItems = document.querySelectorAll('.nav-item');
    const megaMenu = document.querySelector('.mega-menu');
    
    if (!mobileMenuBtn || !navMenu) return;

    // تشخیص حالت موبایل
    const isMobile = () => window.innerWidth <= 768;
    
    // تنظیم مقادیر موقعیت برای megaMenu تا در مرکز قرار گیرد
    function centerMegaMenu() {
        if (!isMobile() && megaMenu) {
            const navContainer = navMenu.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const megaMenuWidth = Math.min(1200, windowWidth - 40); // محدود کردن عرض به 1200px یا عرض صفحه منهای پدینگ
            
            megaMenu.style.width = `${megaMenuWidth}px`;
            const leftOffset = (windowWidth - megaMenuWidth) / 2;
            megaMenu.style.left = `${leftOffset}px`;
        } else if (megaMenu) {
            megaMenu.style.width = '';
            megaMenu.style.left = '';
        }
    }
    
    // اجرای تابع centerMegaMenu در هنگام بارگذاری و تغییر اندازه صفحه
    centerMegaMenu();
    
    // باز/بسته کردن منو در حالت موبایل
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isExpanded = navMenu.classList.contains('active');
        mobileMenuBtn.setAttribute('aria-expanded', isExpanded.toString());
    });
    
    // مدیریت منوهای کشویی در موبایل
    navItems.forEach(item => {
        const link = item.querySelector('a');
        
        if (link) {
            link.addEventListener('click', function(e) {
                if (isMobile() && (item.querySelector('.dropdown-menu') || item.querySelector('.mega-menu'))) {
                    e.preventDefault();
                    // فقط در حالت موبایل کلیک فعال می‌شود
                    toggleDropdown(item);
                }
            });
            
            // تنظیم aria-attributes برای دسترسی‌پذیری
            if (item.querySelector('.dropdown-menu') || item.querySelector('.mega-menu')) {
                link.setAttribute('aria-haspopup', 'true');
                link.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // مدیریت بخش‌های داخلی مگامنو در موبایل
    const laptopBrandCols = document.querySelectorAll('.laptop-brand-col');
    const categoryColumns = document.querySelectorAll('.category-column');
    
    function setupCollapsibleSections(sections) {
        sections.forEach(section => {
            const title = section.querySelector('.laptop-brand-title, .category-title');
            if (title) {
                title.addEventListener('click', () => {
                    if (isMobile()) {
                        section.classList.toggle('active');
                    }
                });
                
                // دسترسی‌پذیری با کیبورد
                title.setAttribute('tabindex', '0');
                title.setAttribute('role', 'button');
                title.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (isMobile()) {
                            section.classList.toggle('active');
                        }
                    }
                });
            }
        });
    }
    
    setupCollapsibleSections(laptopBrandCols);
    setupCollapsibleSections(categoryColumns);
    
    // تابع باز/بسته کردن منوهای کشویی
    function toggleDropdown(item) {
        // بستن همه منوهای دیگر
        navItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
                const otherLink = otherItem.querySelector('a');
                if (otherLink) {
                    otherLink.setAttribute('aria-expanded', 'false');
                }
            }
        });
        
        // تغییر وضعیت منوی فعلی
        const isActive = item.classList.contains('active');
        item.classList.toggle('active');
        const link = item.querySelector('a');
        if (link) {
            link.setAttribute('aria-expanded', (!isActive).toString());
        }
    }
    
    // بستن منوها هنگام کلیک خارج از آنها
    document.addEventListener('click', function(e) {
        if (isMobile() && !e.target.closest('.nav-item') && !e.target.closest('.mobile-menu-btn')) {
            navItems.forEach(item => {
                item.classList.remove('active');
                const link = item.querySelector('a');
                if (link) {
                    link.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });
    
    // بستن منو در موبایل وقتی سایز صفحه تغییر می‌کند
    window.addEventListener('resize', debounce(function() {
        centerMegaMenu();
        
        if (!isMobile() && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            
            // ریست کردن منوهای کشویی باز
            navItems.forEach(item => {
                item.classList.remove('active');
                const link = item.querySelector('a');
                if (link) {
                    link.setAttribute('aria-expanded', 'false');
                }
            });
            
            // ریست کردن بخش‌های باز در مگامنو
            laptopBrandCols.forEach(col => col.classList.remove('active'));
            categoryColumns.forEach(col => col.classList.remove('active'));
        }
    }, 100));
    
    // اضافه کردن پشتیبانی از کلید Escape برای بستن منوها
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            navItems.forEach(item => {
                item.classList.remove('active');
                const link = item.querySelector('a');
                if (link) {
                    link.setAttribute('aria-expanded', 'false');
                }
            });
            
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

/**
 * بهینه‌سازی عملکرد با تاخیر در اجرای توابع سنگین
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

/**
 * تنظیم دسترسی‌پذیری
 */
function setupAccessibility() {
    // دسترسی‌پذیری برای صفحه‌کلید
    const focusableElements = document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])');
    focusableElements.forEach(element => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                if (element.tagName.toLowerCase() !== 'input') {
                    e.preventDefault();
                    element.click();
                }
            }
        });
    });
    
    // تنظیم فوکوس اولیه برای دسترسی‌پذیری
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'sr-only';
    skipLink.textContent = 'رفتن به محتوای اصلی';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '-40px';
    skipLink.style.left = '0';
    skipLink.style.padding = '8px';
    skipLink.style.zIndex = '9999';
    skipLink.style.backgroundColor = '#fff';
    skipLink.style.color = '#000';
    skipLink.style.textDecoration = 'none';
    skipLink.style.transition = 'top 0.3s';
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * بهینه‌سازی لود تصاویر
 */
function setupLazyLoading() {
    // مدیریت lazy loading تصاویر
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('[data-src]');
        lazyImages.forEach(img => {
            imgObserver.observe(img);
        });
    } else {
        // فالبک برای مرورگرهای قدیمی که از IntersectionObserver پشتیبانی نمی‌کنند
        const lazyLoad = () => {
            const lazyImages = document.querySelectorAll('[data-src]');
            lazyImages.forEach(img => {
                if (isInViewport(img)) {
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                    }
                }
            });
        };
        
        // هلپر برای بررسی اینکه آیا المان در ویوپورت قرار دارد
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.bottom >= 0 &&
                rect.right >= 0 &&
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.left <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
        
        // اجرای لود تصاویر در رویدادهای مختلف
        window.addEventListener('scroll', debounce(lazyLoad, 200));
        window.addEventListener('resize', debounce(lazyLoad, 200));
        window.addEventListener('orientationchange', debounce(lazyLoad, 200));
        lazyLoad(); // اجرای اولیه
    }
    
    // preload تصاویر منوها
    function preloadFeaturedImages() {
        const featuredImg = document.querySelector('.featured-img');
        if (featuredImg && featuredImg.src && !featuredImg.hasAttribute('data-src')) {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            preloadLink.href = featuredImg.src;
            document.head.appendChild(preloadLink);
        }
    }
    
    // اجرای preload وقتی صفحه کاملا لود شد
    window.addEventListener('load', preloadFeaturedImages);
    
    // تشخیص موبایل با تاچ
    window.addEventListener('touchstart', function onFirstTouch() {
        document.body.classList.add('has-touch');
        window.removeEventListener('touchstart', onFirstTouch);
    }, { passive: true });
}