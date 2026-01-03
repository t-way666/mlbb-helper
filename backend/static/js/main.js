// Общие функции для всех страниц
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всплывающих подсказок Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // Инициализация выпадающих меню Bootstrap
    var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
    var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
        return new bootstrap.Dropdown(dropdownToggleEl)
    });

    // Мобильная навигация
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const sidebarCollapseOpen = document.getElementById('sidebarCollapseOpen');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');

    // Обработчик открытия меню
    if (sidebarCollapseOpen) {
        sidebarCollapseOpen.addEventListener('click', () => {
            sidebar.classList.add('active');
            // Блокируем прокрутку body
            document.body.style.overflow = 'hidden';
        });
    }

    // Обработчик закрытия меню
    if (sidebarCollapse) {
        sidebarCollapse.addEventListener('click', () => {
            sidebar.classList.remove('active');
            // Возвращаем прокрутку
            document.body.style.overflow = '';
        });
    }

    // Закрытие меню при клике вне его области на мобильных устройствах
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            const isClickInsideSidebar = sidebar.contains(e.target);
            const isClickOnToggle = sidebarCollapseOpen.contains(e.target);
            
            if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Автоматическое скрытие уведомлений
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
});