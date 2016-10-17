// 100 以内的加减法
/*
思路：
1. getRandomArbitraryIntN()，返回 N 个0-100之间的随机整数
2. quiz(array), 返回一张随机加减的题目表格，
    题目的数字由array中给出，加减有random判断，+1，-0
3. templateTable(array), 将一个包含题目的模板插入到HTML中
    以供显示。
4. addEventRefresh(), Refresh按钮，点击后刷新页面，新题目
5. addEventSubmit(), Submit按钮，点击后检查题目结果，
    标记错题，显示正确率和做题时间
6.



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

var templateCell = function(a, b, sign) {
    log('templateCell函数开始！')
    var cell = `
        <div class='cell'>
            <span class='question' id='id-span-first'>${a}</span>
            <span class='question' id='id-span-sigh'>${sign}</span>
            <span class='question' id='id-span-second'>${b}</span>
            <span class='question' id='id-span-equal'>=</span>
            <input class='question' type="text" id='id-input-result'>
            <span class='right wrong'>错误</span>
        </div>
        `
    log('cell模板', cell)
    return cell
}
//insertCell(10, 2, '-')

var zeroOne = function() {
    // 返回一个随机的 0 或 1
    return Math.round(Math.random())
}

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

// 移除掉所有想移除的元素(已无用，可删除)
var removeCells = function(index) {
    log('removeCells开始！')
    log('index-->', index)
    var cell = $(classNa)
    log('cells-->', cell)
    cell.remove()
    log('removeCells结束！')
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
        target.attr('readonly', 'readonly')
        log('target-->', target)
    })
}
/*
//回车后下一个输入框获得焦点 javaScript
var bindEventEnter = function() {
    var table = document.querySelector('.table')
    log('table-->', table)
    table.addEventListener('keydown', function(event){
        log('container keydown', event, event.target)
        var target = event.target
        if(event.key === 'Enter') {
            log('按了回车')
            // 失去焦点
            target.blur()
            // 阻止默认行为的发生, 也就是不插入回车
            event.preventDefault()
            // 更新 todo
            var currentCell = target.parentElement
            log('current cell-->', currentCell)
            var index = indexOfElement(currentCell)
            log('update index',  index)
            // 把元素在 todoList 中更新
            log('table children-->', table.children)
            var nextCell = table.children[index + 1]
            log('next cell-->', nextCell)
            log('nextCell children-->', nextCell.children)
            var nextInput = nextCell.children[1]
            log('next input-->', nextInput)
            nextInput.focus()
        }
    })
}*/
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


var __main = function(){
    $(document).ready(function(){
        insertCells()
        bindEventRefresh()
        bindEventBlur()
        bindEventEnter()
    })
}

__main()
