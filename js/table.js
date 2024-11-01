//新增数据函数
function addRow() {
    var table = document.getElementById('table');
    // console.log(table);
    var length = table.rows.length;
    // console.log(length);
    var newRow = table.insertRow(length);
    console.log(newRow);
    //
}