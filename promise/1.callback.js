// 异步发展流程
// node支持异步
// callback->promise->generator+co->async+await(语法糖)

// callback 异步不支持try/catch只是支持同步代码
// callback 不持支并行，无法在同一时刻合并两节异步的结果，异步方案不支持return
let fs = require("fs");
fs.readFile('./promise/1.txt', function (err, data) {
    //return   异步方法不支持
});
fs.read("./promise/2.txt", function (err, data) {
    // 不能将并行的读取1.txt和2.txt的方法合并，
});

// 高阶函数----函数可以作为参数，还可以作为返回值
// 1. 批量生成函数
function isType(type) { // 偏函数
    return function (con) {
        return Object.prototype.toString.call(con) === `[object ${type}]`;
    }
}

let isString = isType('String');
console.log(isString('你好'));

//2.预置函数作为参数  loadsh _.atfer

let fs = require("fs");
function after(times, callback) { // 可以缓存函数，当条件达到时---本函数缓存了times的值
    let arr = [];
    return function (data) {
        arr.push(data);
        if (--times === 0) {
            callback(arr);
        }
    }
}

let out = after(2,function(arr){
    console.log(arr);
});

fs.readFile('./2.txt','utf8',function(err,data){out(data)});
fs.readFile('./2.txt','utf8',function(err,data){out(data)});


//----------promise 解决的问题
//1.解决多次回调问题，不会导致难以维护，
//2.解决同步异步的返回结果，可以按照执行循序获取结果。