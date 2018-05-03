// 函数
function fn(params) {

}

// 默认参数
function mr(url = "ddd") {
    console.log(url);
}
mr();

// 箭头函数 （高阶函数 偏函数  函数柯里化）
// 没有 function 关键字  ,函数参数和函数体用箭头连在一起，   如果参数只有一个，可以省略包裹参数的() ,函数体中如果省略return则可以不写{}(箭头后面就是返回值)
// 没有arguments，没有this指向
let a = b => b;
console.log(a("你好"));
