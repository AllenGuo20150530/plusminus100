// 100 以内的加减法
/*
思路：
test
1. getRandomArbitraryIntN()，返回 N 个0-100之间的随机整数
2. quiz(array), 返回一张随机加减的题目表格，
    题目的数字由array中给出，加减有random判断，+1，-0
3. templateTable(array), 将一个包含题目的模板插入到HTML中
    以供显示。
4. addEventRefresh(), Refresh按钮，点击后刷新页面，新题目
5. addEventSubmit(), Submit按钮，点击后检查题目结果，
    标记错题，显示正确率和做题时间
6. addEventBlur()， 使失去焦点时不可编辑
7. addEventEnter(), 回车时失去焦点，并时下一题的输入框获得焦点
8. check(), 函数check检查结果，错误则提示错误
*/
/*
10.17更新
-----将原先JavaScript替换为jQuery
-----习题container添加CSS，使其居中

10.19更新
-----将代码顺序重新布置，更加易读
-----html中加入bootstrap链接, 删掉原先自己的CSS样式。（目前使用不熟练，效果不好）
-----刷新按钮使用bootstrap样式，其余还未改造完。
*/

// 定义自己的log函数
var log = function() {
    console.log.apply(console, arguments)
}
// 产生随机数
var getRandomArbitraryIntN = function(min, max, n = 100) {
    // 返回一个含有n个随机整数的数组，n未指定时为100个
    var numbers = []
    for (var i = 0; i < n; i++) {
        var num = Math.floor(Math.random() * (max - min + 1) + min)
        numbers.push(num)
    }
    return numbers
}
var zeroOne = function() {
    // 返回一个随机的 0 或 1
    return Math.round(Math.random())
}
// 单个习题的cell模板
var templateCell = function(a, b, sign) {
    log('templateCell函数开始！')
    var cell = `
        <div class='cell'>
            <span class='question' id='id-span-first'>${a}</span>
            <span class='question' id='id-span-sign'>${sign}</span>
            <span class='question' id='id-span-second'>${b}</span>
            <span class='question' id='id-span-equal'>=</span>
            <input class='question' type="text" id='id-input-result'>
            <span id='id-span-right' aria-hidden="true"></span>
        </div>
        `
    log('cell模板', cell)
    return cell
}
//insertCell(10, 2, '-')，插入单个习题cell
var insertCell = function(a, b, sign) {
    // 添加到 container 中
    log('insertCell函数开始！')
    var table = $('.table')
    log('取出table', table)
    var cell = templateCell(a, b, sign)
    log('生成cell', cell)
    // 这个方法用来添加元素更加方便, 不需要 createElement
    table.append(cell)
    log('将cell插入table')
}
// 循环插入50道习题
var insertCells = function() {
    // 往table中添加50个加减法的cell
    log('insertCells 开始！')
    var numbers = getRandomArbitraryIntN(0, 100)
    log('length of numbers', numbers.length)
    var sign = '+'
    for (var i = 0; i < numbers.length;) {
        var condition = zeroOne()
        if (!condition) {
            log('condition-->', condition)
            sign = '-'
            log('sign-->', sign)
        }
        insertCell(numbers[i], numbers[i + 1], sign)
        i += 2
    }
}

// 给刷新按钮绑定事件
var bindEventRefresh = function() {
    var refreshButton = $('#id-button-refresh')
    refreshButton.on('click', function(){
        // 刷新时， 先删掉原先的习题
        log('删掉原先的习题')
        var cells = $('.cell')
        cells.each(function(index){
            $(cells[index]).remove()
        })
        // 然后载入新的习题
        log('载入新的习题')
        insertCells()
    })
}
// 输入答案，鼠标离开后失去焦点，判断答案对错，并不可修改
var bindEventBlur = function() {
    $('.table').on('blur', '#id-input-result', function(event){
        log('table blur-->', event)
        var target = $(event.target)
        log('target-->', target)

        // 使结果不可更改
        target.attr('readonly', 'readonly')
        log('target-->', target)
        // 对结果进行比较
        var condition = check(target)
        if(!condition) {
            wrongTip(target)
        }
    })
}
// 回车后下一个输入框获得焦点 jQury
var bindEventEnter = function() {
    var table = $('.table')
    log('table-->', table)
    table.on('keydown','#id-input-result', function(event){
        log('container keydown', event, event.target)
        var target = $(event.target)
        log('target-->', target)
        if(event.key === 'Enter') {
            log('按了回车')
            // 阻止默认行为的发生, 也就是不插入回车
            event.preventDefault()
            // 失去焦点
            target.blur()
            var cell = target.parent()
            log('father-->', cell)
            var cells = $('.cell')
            var currentIndex = cell.index()
            log('current index-->', currentIndex)
            if(currentIndex < 49) {
                var nextIndex = currentIndex + 1
                log('next index-->', nextIndex)
                var nextCell = $(cells[nextIndex])
                log('next cell-->', nextCell)
                var nextInput = nextCell.find('#id-input-result')
                log('nextInput-->', nextInput)
                nextInput.focus()
            }
        }
    })
}
// 调用以上三个绑定事件函数
var bindEvents = function() {
    bindEventRefresh()
    bindEventBlur()
    bindEventEnter()
}
// check() 检查结果是否正确，返回布尔类型
var check = function(target) {
    // 失去焦点时检查结果
    log('check 开始')
    log('target-->', target)
    // 获得当前输入结果的父元素
    var cell = target.parent()
    log('cell-->', cell)
    // 根据父元素，分别取出数值和符号，待用
    var firstNum = Number(cell.find('#id-span-first').text())
    var sign = cell.find('#id-span-sign').text()
    var secondNum = Number(cell.find('#id-span-second').text())
    var result = Number(target.val())
    log(`${firstNum}--'${sign}'--${secondNum}`)
    // 根据sign的值，分别进行加减运算
    if(sign === '-') {
        var answer = firstNum - secondNum
        log('answer-->', answer)
    } else if (sign === '+') {
        var answer = firstNum + secondNum
        log('answer-->', answer)
    }
    log('answer-->', answer)
    // 将结果与输入的值比较，正确返回true，否则false
    if (answer === result) {
        log('比较结果-->', true)
        return true
    }else {
        log('比较结果-->', false)
        return false
    }
}
// 对于错题，提示错误
var wrongTip = function(target) {
    var cell = target.parent()
    var right = cell.find('#id-span-right')
    right.addClass('glyphicon glyphicon-remove')
}

var __main = function(){
    $(document).ready(function(){
        insertCells()
        bindEvents()
    })
}

__main()
