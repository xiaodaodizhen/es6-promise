// 1.var 作用域的问题（会污染全局作用域）
// 2.var 的声明问题 （可能重复声明）
// 3.变量提升  预解释
console.log(d);
var d = 1;  // 会预解释，但是不会赋值

console.log(h);
function h(){
    // 函数声明既会预解释也会赋值
}
// 4.常量 不能被改变的量

// let 
// 1.同一个作用域下不能重复声明
// 2.声明的const 和let不会声明到window上
// 3.不会预解释
console.log(z);
console.log(g);
let z = 10;
let g=function(){

}


{
    let a = 1;
}
// {} 可以表示一个作用域



// const 常量 ，一般会用大写来表示，值不能被更改