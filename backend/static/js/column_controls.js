document.addEventListener('DOMContentLoaded', function() {
    const columnControls = document.querySelectorAll('.column-control');
    const table = document.querySelector('table');
    
    if (!columnControls.length || !table) return;

    // Загрузка сохраненных настроек видимости колонок
    const savedColumnStates = JSON.parse(localStorage.getItem('columnStates') || '{}');

    // Создаем глобальный объект для управления колонками
    window.columnController = {
        visibleColumns: new Set(),
        
        getVisibleColumns() {
            return Array.from(this.visibleColumns);
        },
        
        updateColumnVisibility() {
            columnControls.forEach(control => {
                const columnName = control.dataset.column;
                const isVisible = control.classList.contains('active');
                
                if (isVisible) {
                    this.visibleColumns.add(columnName);
                } else {
                    this.visibleColumns.delete(columnName);
                }
                
                this.toggleColumnVisibility(columnName, isVisible);
            });
        },

        toggleColumnVisibility(columnName, show) {
            const columnClass = `column-${columnName}`;
            const columnCells = table.querySelectorAll(`.${columnClass}`);
            columnCells.forEach(cell => {
                if (show) {
                    cell.classList.remove('d-none');
                } else {
                    cell.classList.add('d-none');
                }
            });
        }
    };

    // Инициализация состояния колонок
    columnControls.forEach(control => {
        const columnName = control.dataset.column;
        // По умолчанию показываем все колонки, если нет сохраненных настроек
        const isVisible = savedColumnStates[columnName] !== false;
        
        control.classList.toggle('active', isVisible);
        if (isVisible) {
            window.columnController.visibleColumns.add(columnName);
        }
        
        window.columnController.toggleColumnVisibility(columnName, isVisible);

        // Обработчик клика
        control.addEventListener('click', () => {
            const newState = !control.classList.contains('active');
            control.classList.toggle('active', newState);
            
            if (newState) {
                window.columnController.visibleColumns.add(columnName);
            } else {
                window.columnController.visibleColumns.delete(columnName);
            }
            
            window.columnController.toggleColumnVisibility(columnName, newState);
            
            // Сохранение состояния
            savedColumnStates[columnName] = newState;
            localStorage.setItem('columnStates', JSON.stringify(savedColumnStates));
        });
    });
});