function Promise(executor) {
    let self = this;
    self.status = "pending";
    self.value = undefined;
    self.reason = undefined;
    self.onResolvedCallbacks = [];// then 成功的回调函数数组
    self.onRejectedCallbacks = [];//then 失败的回调函数数组
    function resolve(value) {
        if (self.status == "pending") {
            self.status = "resolved";
            self.value = value;
            self.onResolvedCallbacks.forEach(function (fn) {
                fn();
            });
        }
    }
    function reject(reason) {
        if (self.status == "pending") {
            self.status = "rejected";
            self.reason = reason;
            self.onRejectedCallbacks.forEach(function (fn) {
                fn();
            });
        }
    }

    try {
        executor(resolve, reject);
    } catch (e) {  // 捕获的时候发生异常，就执行失败
        reject(e);
    }
}

function resolvePromise(p2, x, resolve, reject) {
    // x可能是别人的promise
    if (p2 === x) {
        return reject(new TypeError("循环引用了--类型错误"));
    }
    let called;//表示是否调用过成功或失败
    // 判断x是不是promise--promise应该是一个对象
    if (x !== null || (typeof x === "object") || (typeof x === "function")) {
        //可能是promise的情况，看这个对象中是否有then方法，如果有就认为是promise对象
        try {
            let then = x.then;
            if (typeof then == "function") {
                then.call(x, function (y) {
                    if (called) return;
                    called = true;
                    //y可能还是一个promise，再去解析，直到返回的是一个普通值
                    resolvePromise(p2, y, resolve, reject);
                }, function (err) {
                    if (called) return;
                    called = true;
                    reject(err);
                });
            } else { // 这里是一个值    例如这种{then:1}
                resolve(x);
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        }
    } else {// 是一个普通值
        resolve(x);//表示成功
    }

}
Promise.prototype.then = function (onFulfilled, onRejected) {
    // 成功和失败不传，给默认值
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : function (value) {
        return value;
    }
    onRejected = typeof onRejected === "function" ? onRejected : function (err) {
        throw err;// 只有抛出错误才会走下一个then的失败函数
        // return err; 不能这么写的原因是错误函数只要有返回值，就会走下一个then的成功函数
    }
    let self = this;
    let promise2;// 返回的promise
    if (self.status == "resolved") {
        promise2 = new Promise(function (resolve, reject) {
            // x 可能是一个promise也有可能是一个普通值，
            setTimeout(function () { //promise 规范中要求，所有的onFuiled和onRjected都需要异步执行（例如：setTimeout 可以使代码异步）
                try {
                    let x = onFulfilled(self.value);
                } catch (e) {
                    reject(e);
                }
            });
            //x也可能是别人的promise，所以写一个方法统一处理
            resolvePromise(promise2, x, resolve, reject);
        });
    }
    if (self.status == "rejected") {
        promise2 = new Promise(function (resolve, reject) {
            setTimeout(function () { //promise 规范中要求，所有的onFuiled和onRjected都需要异步执行（例如：setTimeout 可以使代码异步）
                try {
                    let x = onRejected(self.reason);
                } catch (e) {
                    reject(e);
                }
            });
            resolvePromise(promise2, x, resolve, reject);
        });
    }
    if (self.status == "pending") {
        promise2 = new Promise(function (resolve, reject) {
            self.onResolvedCallbacks.push(function () {
                setTimeout(function () { //promise 规范中要求，所有的onFuiled和onRjected都需要异步执行（例如：setTimeout 可以使代码异步）
                    try {
                        let x = onFulfilled(self.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
            self.onRejectedCallbacks.push(function () {
                setTimeout(function () { //promise 规范中要求，所有的onFuiled和onRjected都需要异步执行（例如：setTimeout 可以使代码异步）
                    try {
                        let x = onRejected(self.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        });
    }
    return promise2;
};



Promise.defer = Promise.deferred = function () {
    let dfd = {};
    dfd.promise = new Promise(function (resolve, reject) {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}


module.exports = Promise;

// mjs导出导入(与es6使用规则一样)  node最新版本（9.8）支持   export Promise 