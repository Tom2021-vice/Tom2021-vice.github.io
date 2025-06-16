// --- 常量定义 ---
// 定义一个用于 LocalStorage 的键名，避免硬编码。
const STORAGE_KEY = 'tomsDiaryData';

// --- 核心数据处理函数 ---

/**
 * 从表格的 DOM 中读取所有数据，并将其保存到 LocalStorage。
 * 这个函数是连接“页面显示”和“永久存储”的桥梁。
 */

function saveData() {
    const tableBody = document.getElementById('table').getElementsByTagName('tbody')[0];
    const rows = tableBody.rows;
    const dataToSave = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        
        // 在获取文本后，进行替换
        let date = row.cells[0].innerText;
        let event = row.cells[1].innerText;

        // 新增：将内容中的全角逗号替换为半角逗号
        event = event.replace(/，/g, ', ');

        dataToSave.push({ date: date, event: event });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
}

/**
 * 从 LocalStorage 加载数据并渲染到表格中。
 * 如果 LocalStorage 中没有数据（第一次访问），则加载一组默认数据。
 */
function loadData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    let diaryData = [];

    if (savedData) {
        // 如果有保存的数据，则解析它
        diaryData = JSON.parse(savedData);
    } else {
        // 如果没有，则使用初始的默认数据
        diaryData = [
            { date: "2023.7.30", event: "在夕阳下一块回家" },
            { date: "2023.10.1", event: "一块去北京玩" },
            { date: "2023.10.24", event: "第一次王者五排" },
            { date: "2024.9.29", event: "成功推免至中央民族大学" },
            { date: "2024.10.28", event: "小雨也报了同一个学校，希望她也能考上" }
        ];
    }
    
    renderTable(diaryData);
}

/**
 * 根据给定的数据数组，渲染整个表格。
 * @param {Array<Object>} data - 包含日记对象的数组
 */
function renderTable(data) {
    const tableBody = document.getElementById('table').getElementsByTagName('tbody')[0];
    // 清空现有表格内容，防止重复渲染
    tableBody.innerHTML = ''; 

    data.forEach(item => {
        const newRow = tableBody.insertRow();
        newRow.innerHTML = `
            <td>${item.date}</td>
            <td>${item.event}</td>
            <td>
                <button class="btn-edit" onclick="toggleEdit(this)">编辑</button>
                <button class="btn-delete" onclick="deleteRow(this)">删除</button>
            </td>
        `;
    });
}


// --- 用户交互功能函数 (已更新，现在会调用 saveData) ---

/**
 * 新增一行数据到表格末尾，并应用进入动画。
 * 新增后立即保存。
 */
function addRow() {
    const tableBody = document.getElementById('table').getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow(-1);
    newRow.classList.add('row-enter-active');

    const today = new Date();
    const formattedDate = `${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}`;
    
    newRow.innerHTML = `
        <td>${formattedDate}</td>
        <td>在这里记录新的事件...</td>
        <td>
            <button class="btn-edit" onclick="toggleEdit(this)">编辑</button>
            <button class="btn-delete" onclick="deleteRow(this)">删除</button>
        </td>
    `;

    // 新增后立即保存当前所有数据
    saveData();

    newRow.addEventListener('animationend', () => {
        newRow.classList.remove('row-enter-active');
    });
}

/**
 * 删除指定按钮所在的行，并应用退出动画。
 * 删除后立即保存。
 * @param {HTMLButtonElement} btn - 被点击的删除按钮
 */
function deleteRow(btn) {
    const row = btn.closest('tr');
    if (row) {
        row.classList.add('row-exit-active');
        row.addEventListener('animationend', () => {
            row.remove();
            // 动画结束后，再保存数据
            saveData();
        });
    }
}

/**
 * 切换行的编辑/保存状态。
 * 在点击“保存”时，立即在屏幕上更新内容，并持久化数据。
 * @param {HTMLButtonElement} btn - 被点击的编辑/保存按钮
 */
function toggleEdit(btn) {
    const row = btn.closest('tr');
    if (!row) return;

    const dateCell = row.cells[0];
    const eventCell = row.cells[1];
    const isEditing = btn.textContent === '保存';

    if (isEditing) {
        // --- 从编辑状态切换到保存状态的逻辑 ---

        // 1. 获取用户输入的原始文本
        const originalEventText = eventCell.innerText;

        // 2. 进行替换
        const updatedEventText = originalEventText.replace(/，/g, ', ');

        // 3. 【关键步骤】将替换后的文本立即更新回屏幕上的单元格
        eventCell.innerText = updatedEventText;

        // 4. 锁定单元格，使其不可再编辑
        dateCell.contentEditable = false;
        eventCell.contentEditable = false;

        // 5. 恢复按钮为“编辑”状态
        btn.textContent = '编辑';
        btn.classList.remove('is-editing');

        // 6. 最后，保存更新后的数据到 LocalStorage
        saveData();

    } else {
        // --- 从普通状态切换到编辑状态的逻辑 (此部分无变化) ---
        dateCell.contentEditable = true;
        eventCell.contentEditable = true;
        btn.textContent = '保存';
        btn.classList.add('is-editing');
        eventCell.focus();
        document.execCommand('selectAll', false, null);
    }
}


// --- 页面加载入口 ---

// 当整个页面的 HTML 加载和解析完成后，立即执行 loadData 函数
document.addEventListener('DOMContentLoaded', loadData);
