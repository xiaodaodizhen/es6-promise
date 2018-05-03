// gennerator 生成器  函数用* 来标识，yield(暂停 产出)
// 它会将函数分割出多个部分，调用一次next就会继续向下执行
// 返回结果是一个迭代器，  迭代器有一个next方法
// yield 后面跟着的是value的值
// yield 等号前面的是我们当前调用next传进来的值
// 第一次next传值是无效的
function* read(c) {
    console.log(c);
    console.log(1);
    let a = yield "小测试";
    console.log(a);
    let b = yield "第二次";
    console.log(b);
    return b;
}

let obj = read(3);//可传值
console.log(obj.next());//第一次使用next 不可传值，传值无效  {value:'小测试',done:false}
console.log(obj.next('123'));//{value:'第二次',done:false}
console.log(obj.next('打印b'));//{value:"打印b",done:true}


// 异步 generator 主要和promise搭配使用
let bluebird = require('bluebird');
let fs = require('fs');
let read = bluebird.promisify(fs.readFile);
function* r() {
    let con1 = yield read('1.txt', "utf8");// read()返回的是promise对象，{value:read()返回的promise对象,done:false}
    let con2 = yield read(con1);
    return con2;
}

let it = r();
it.next().value.then(function (data) {
    it.next(data).value.then(function (data) {
        console.log(it.next(data).value);
    });
});

// 以上代码写得太痛苦，所以安装co库，配合generator使用  --  npm install co----co库可以自动的将generator进行迭代
let co = require('co');
// 源码实现co
function co(it) {
    return new Promise(function (resolve, reject) {
        function next1(d) {
            let { value, done } = it.next(d); // 此处用到了对象解构，
            if (!done) {
                value.then(function (data) {
                    next1(data);
                }, reject);
            } else {
                resolve(value);
            }
        }
        next1();
    });
}

co(r()).then(function (data) {  // co 返回的也是promise对象
    console.log(data);  // 直接拿到return con2的结果，自动进行迭代（自己进行了多次next()）
});