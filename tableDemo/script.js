document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const tableContainer = document.querySelector('.table-container');
    const leftFixedColumn = document.querySelector('.left-fixed');
    const rightFixedColumn = document.querySelector('.right-fixed');
    const fixedRowsLeft = document.querySelectorAll('.left-fixed .fixed-body .row');
    const fixedRowsRight = document.querySelectorAll('.right-fixed .fixed-body .row');
    const tableRows = document.querySelectorAll('.table-row');
    const scrollablePart = document.querySelector('.scrollable-part');
    const tableHeader = document.querySelector('.table-header');
    const tableCells = document.querySelectorAll('.cell');
    
    // 确保所有行和单元格都有正确的样式
    function ensureStyles() {
        // 为所有行添加正确的边框和背景
        tableRows.forEach((row, index) => {
            // 确保边框样式正确
            row.style.borderBottom = '1px solid #ddd';
            
            // 确保背景色正确
            if (index % 2 === 0) {
                row.style.backgroundColor = '#fafafa';
            } else {
                row.style.backgroundColor = '#fff';
            }
        });
        
        // 为所有单元格添加正确的边框
        tableCells.forEach(cell => {
            cell.style.borderRight = '1px solid #ddd';
            // 最后一个单元格不需要右边框
            if (cell === cell.parentNode.lastElementChild) {
                cell.style.borderRight = 'none';
            }
        });
    }
    
    // 同步行高
    function syncRowHeights() {
        // 确保行数匹配
        if (fixedRowsLeft.length !== tableRows.length || fixedRowsRight.length !== tableRows.length) {
            console.error('固定列和表格主体行数不匹配');
            return;
        }
        
        // 重置所有行高
        fixedRowsLeft.forEach(row => row.style.height = 'auto');
        fixedRowsRight.forEach(row => row.style.height = 'auto');
        tableRows.forEach(row => row.style.height = 'auto');
        
        // 计算并设置每一行的高度
        for (let i = 0; i < tableRows.length; i++) {
            const leftRowHeight = fixedRowsLeft[i].offsetHeight;
            const rightRowHeight = fixedRowsRight[i].offsetHeight;
            const tableRowHeight = tableRows[i].offsetHeight;
            
            // 取三者的最大值作为行高
            const maxHeight = Math.max(leftRowHeight, rightRowHeight, tableRowHeight);
            
            fixedRowsLeft[i].style.height = `${maxHeight}px`;
            fixedRowsRight[i].style.height = `${maxHeight}px`;
            tableRows[i].style.height = `${maxHeight}px`;
        }
    }
    
    // 监听滚动事件
    scrollablePart.addEventListener('scroll', function() {
        // 1. 同步垂直滚动
        const scrollTop = scrollablePart.scrollTop;
        leftFixedColumn.querySelector('.fixed-body').scrollTop = scrollTop;
        rightFixedColumn.querySelector('.fixed-body').scrollTop = scrollTop;
        
        // 2. 检查水平和垂直滚动位置并添加/移除阴影效果
        updateShadowEffects();
        
        // 3. 确保滚动时样式一致性
        requestAnimationFrame(ensureStyles);
    });
    
    // 更新阴影效果
    function updateShadowEffects() {
        const scrollLeft = scrollablePart.scrollLeft;
        const scrollTop = scrollablePart.scrollTop;
        const maxScrollLeft = scrollablePart.scrollWidth - scrollablePart.clientWidth;
        const maxScrollTop = scrollablePart.scrollHeight - scrollablePart.clientHeight;
        
        // 水平滚动阴影效果
        // 只有当有水平滚动时才显示左侧阴影
        if (scrollLeft > 0) {
            leftFixedColumn.classList.add('left-shadow');
        } else {
            leftFixedColumn.classList.remove('left-shadow');
        }
        
        // 只有当没有滚动到最右侧时才显示右侧阴影
        if (scrollLeft < maxScrollLeft) {
            rightFixedColumn.classList.add('right-shadow');
        } else {
            rightFixedColumn.classList.remove('right-shadow');
        }
        
        // 垂直滚动阴影效果
        // 当有垂直滚动时，给表头添加底部阴影
        if (scrollTop > 0) {
            leftFixedColumn.querySelector('.fixed-header').classList.add('bottom-shadow');
            rightFixedColumn.querySelector('.fixed-header').classList.add('bottom-shadow');
            scrollablePart.querySelector('.table-header-wrapper').classList.add('bottom-shadow');
        } else {
            leftFixedColumn.querySelector('.fixed-header').classList.remove('bottom-shadow');
            rightFixedColumn.querySelector('.fixed-header').classList.remove('bottom-shadow');
            scrollablePart.querySelector('.table-header-wrapper').classList.remove('bottom-shadow');
        }
    }
    
    // 初始同步行高
    syncRowHeights();
    
    // 初始确保样式
    ensureStyles();
    
    // 窗口大小改变时重新同步行高和更新阴影效果
    window.addEventListener('resize', function() {
        syncRowHeights();
        updateShadowEffects();
        ensureStyles();
    });
    
    // 添加悬停效果 - 当鼠标悬停在行上时高亮显示对应的行
    function addHoverEffect() {
        // 表格主体行悬停效果
        tableRows.forEach((row, index) => {
            row.addEventListener('mouseenter', () => {
                row.classList.add('hovered');
                fixedRowsLeft[index].classList.add('hovered');
                fixedRowsRight[index].classList.add('hovered');
            });
            
            row.addEventListener('mouseleave', () => {
                row.classList.remove('hovered');
                fixedRowsLeft[index].classList.remove('hovered');
                fixedRowsRight[index].classList.remove('hovered');
            });
        });
        
        // 左侧固定列行悬停效果
        fixedRowsLeft.forEach((row, index) => {
            row.addEventListener('mouseenter', () => {
                row.classList.add('hovered');
                tableRows[index].classList.add('hovered');
                fixedRowsRight[index].classList.add('hovered');
            });
            
            row.addEventListener('mouseleave', () => {
                row.classList.remove('hovered');
                tableRows[index].classList.remove('hovered');
                fixedRowsRight[index].classList.remove('hovered');
            });
        });
        
        // 右侧固定列行悬停效果
        fixedRowsRight.forEach((row, index) => {
            row.addEventListener('mouseenter', () => {
                row.classList.add('hovered');
                tableRows[index].classList.add('hovered');
                fixedRowsLeft[index].classList.add('hovered');
            });
            
            row.addEventListener('mouseleave', () => {
                row.classList.remove('hovered');
                tableRows[index].classList.remove('hovered');
                fixedRowsLeft[index].classList.remove('hovered');
            });
        });
    }
    
    // 添加触摸设备支持
    function addTouchSupport() {
        let touchStartY = 0;
        let touchStartX = 0;
        let initialScrollTop = 0;
        let initialScrollLeft = 0;
        
        scrollablePart.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            initialScrollTop = scrollablePart.scrollTop;
            initialScrollLeft = scrollablePart.scrollLeft;
        });
        
        scrollablePart.addEventListener('touchmove', function(e) {
            const touchY = e.touches[0].clientY;
            const touchX = e.touches[0].clientX;
            const diffY = touchStartY - touchY;
            const diffX = touchStartX - touchX;
            
            scrollablePart.scrollTop = initialScrollTop + diffY;
            scrollablePart.scrollLeft = initialScrollLeft + diffX;
            
            // 防止页面滚动
            e.preventDefault();
        });
    }
    
    // 初始化
    addHoverEffect();
    addTouchSupport();
    updateShadowEffects(); // 初始化阴影效果
    
    // 在DOM变化时重新同步行高
    const observer = new MutationObserver(function() {
        syncRowHeights();
        updateShadowEffects();
        ensureStyles();
    });
    observer.observe(tableContainer, { childList: true, subtree: true });
}); 