// Object.setPrototype(one,two);  
// __proto__ 每一个对象都有这个东西，如果自己加找不到会通过这个链向上找
// 1. 方法一
let one = { name: 'dd', age: 19 };
let two = { name: 'sd' };

let ages = Object.setPrototypeOf(one, two);
console.log(ages.age);

// 2.方法二
let one = { name: 'dd', age: 19 };
let two = {
    name: 'sd',
    __proto__: one, // 将two的原型链指向one对象，就会具备one对象的属性
    getAge() {
        return super.name;  //super在子对象中对应的是 __proto__对应的内容
    }
};

console.log(two.getAge(), two.age);