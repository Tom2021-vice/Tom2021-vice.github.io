//新增数据函数
function addRow() {
    var table = document.getElementById('table');
    // console.log(table);
    var length = table.rows.length;
    // console.log(length);
    //获取插入位置
    var newRow = table.insertRow(length);
    //插入节点对象
    var dataCol = newRow.insertCell(0);
    var eventCol = newRow.insertCell(1);
    var actionCol = newRow.insertCell(2);
    //修改节点文本内容
    dataCol.innerHTML = '1';
    eventCol.innerHTML = '1';
    actionCol.innerHTML = '<button onclick="editRow(this)">编辑</button><button onclick="deleteRow(this)">删除</button>';

}
//删除数据函数
function deleteRow(button){
    var row = button.parentNode.parentNode;
    console.log(row);
    row.parentNode.removeChild(row);
}
//编辑数据函数
function editRow(button){
    var row = button.parentNode.parentNode;
    var data = row.cells[0];
    var event = row.cells[1];
    var inputdata = prompt("请输入名字：");
    var inputevent = prompt("请输入事件：");
    data.innerHTML = inputdata;
    event.innerHTML = inputevent;
}