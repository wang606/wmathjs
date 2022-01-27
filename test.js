const wmath = require('./index'); 
wmath.init(); 
wmath.Scalar.precision = 1e-8; 
function rangeArray(m, type) {
    var _array = []; 
    for (var i = 0; i < m; i++) _array.push((type == Number) ? Math.random() * 100 : new type(Math.random() * 100, Math.random() * 100)); 
    return _array; 
}
var a = new wmath.Polynomial(rangeArray(50, wmath.Complex)); 
a.coefficient.forEach((x) => { console.log(x.latex() + ', '); })
var b = a.roots(); 
b.forEach((x) => console.log(a.value(x))); 
// console.log(Math.atan(0 / 0)); 