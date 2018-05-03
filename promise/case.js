let Promise = require('./Promise');
let p = new Promise(function (resolve, reject) {
    // setTimeout(function () {// 模仿异步
    //     resolve(23);
    // }, 2000)
    // resolve(100);
    //    throw new Error("程序出错");
    reject(10);
});
// p.then(function (data) {
//     console.log(`data:${data}`);
// }, function (err) {
//     console.log(`err:${err}`);
// });


// p.then(function (data) {
//     console.log(`data2:${data}`);
// }, function (err) {
//     console.log(`err2:${err}`);
// });

// 1.Promise 实例可以多次then，当成功后会将then中的方法按顺序执行，我们可以先将then中的成功的回调和失败的回调存到数组内，当成功/失败的时候调用成功/失败的数组即可
// 2.链式调用jquery,jquery能实现链式调用靠的是返回this，promise不能返回this,promise 实现链式调用靠的是返回一个新的promise 
// p.then(function (data) {
//     console.log(`data:${data}`);
//     return '返回数据';
// }, function (err) {
//     console.log(`err:${err}`);
//     return '返回失败，也会进入下一个then的成功态';
// }).then(function (data) {
//     console.log(`data链式:${data}`);
// }, function (err) {
//     console.log(`err链式:${err}`);
// });





//3.如果then中无论是成功的回调还是失败的回调只要返回了结果就会走下一个then的成功，如果有错误（throw new Error("抛出错误")）走下一个then的失败；
//4.如果第一个promise返回一个普通值，会进到下一次then的成功的回调，如果第一个promise返回了一个promise，需要等待返回的promise执行后的结果传递给下一次then
//5.resolvePromise 
// 1）返回的结果和promise是同一个那么永远不会执行成功和失败
// 2)判断x是不是promise，如果x是对象，并且x的then方法是函数我们就认为他是一个promise

//7. 有些人写的promise可能既会成功又会调用失败，如果两个都调用，先调用谁另一个就忽略

//8. then方法中可以什么都不传，---promise中的值穿透

p.then().then().then(function (data) {
    console.log("then的穿透效果");
}, function (err) {
    console.log(`dd` + err);
})

//9.promise 规范中要求，所有的onFuiled和onRjected都需要异步执行（例如：setTimeout 可以使代码异步）

//10. Promise.defer 语法糖
//  ----原始写法
function read() {
    return new Promise(function (resolve, reject) {
        require('fs').readFile('./1.txt', "utf8", function (err, data) {
            if (err) reject(err);
            resolve(data);
        });
    });
}
read().then(function (data) {
    console.log(data);
});
// 使用defer语法糖写法
let Promise = require('./Promise');
function read() {
    let defer = Promise.defer();
    require('fs').readFile('./1.txt', "utf8", function (err, data) {
        if (err) defer.reject(err);
        defer.resolve(data);
    });
    return defer.promise;
}
read().then(function (data) {
    console.log(data);
},function(err){
    console.log(err+"ss");
});

// 下载一个Promise的测试库，promises-aplus-tests库------npm install -g promises-aplus-tests