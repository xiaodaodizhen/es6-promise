// 类以前就是构造函数
function Parent() {
    this.wo = function (params) {
        console.log(2);
    }
}
Parent.fns = function () {
    console.log("静态属性3,私有");
}
function Child() {
    this.one = function () {
        console.log("私有属性");
    }
}

console.log(Child.__proto__); // 每个类（方法或对象）都含有__proto__属性

function create(parentProto, params) { // Object.create方法的实现源码
    function Fn() { // 构建了一个类，类的原型链指向了父类的原型

    }
    Fn.prototype = parentProto; // Fn的原型指向 参数传进来的原型，所以能拿到parentProto上的公共属性和方法
    let obj = new Fn; // 实例中会含有prototype上的constructor，也可以更改其值（换类），这样可以获取到其他类的私有属性和方法
    //obj.constructor = params.constructor.value; // 手动更改constructor的指向,将obj的constructor指向为参数Child，所以能拿到Child的私有属性和方法
    return obj;
}
Child.prototype = create(Parent.prototype, { constructor: { value: Child } }); // Object.create(Parent.prototype);
let child = new Child;
Child.__proto__ = Parent;// 通过本方法，继承Parent 的静态属性
Child.fns();// 使用静态属性不需要实例化类
child.one();
// 定义属性的一种方法
let obj = {};
Object.defineProperty(obj, "a", {
    enumerable: true,// 默认情况下false定义属性是不可枚举的(就是console.log()为没有该属性)，
    configurable: true,// 是否可配置 (进行删除该属性或其他动作)
    // writable: true,// 是否可重写，（重新赋值） 不能与set()  get()同时使用
    // value: "新增属性"      不能与set()  get()同时使用
    set(val) { console.log(val); }, // 重新设置值
    get() { console.log(obj.a); }  // 取值
});
obj.a = 100;// 重写属性
//delete obj.a;// 配置属性
console.log(obj); // 如果enumerable 为true会打印出新增属性

let objte = {};
objte.name = "dd";
console.log(objte.name);


//  es6 的类和继承   extends 可以继承私有属性、公有属性、静态属性
class Parent {
    constructor(data) {
        this.name = data.name;
    }
    static fn() {  // 静态属性通过类进行调用  Parent.fn()  而不是new Parent().fn()  ，而且可以继承
        return 100;
    };
}

class Child extends Parent {
    constructor(data) {
        super(data); // 子类有构造函数，必须使用super  === Parent.call(this,data)
        this.age = data.age;
    }
}
let child = new Child({ age: 9, name: "真假" });
console.log(child.name, child.age);
console.log(Parent.fn());