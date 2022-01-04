const wmath = require('./index'); 
wmath.init(); 
wmath.Scalar.precision = 1e-12; 
var a = [], b = []; 
for (var i = 0; i < 100; i++) {
    a.push(new wmath.Fraction(Math.random() * 100)); 
    b.push(new wmath.Complex(Math.random() * 100)); 
    // a.push(Math.random()); 
    // b.push(Math.random()); 
}
a = new wmath.Polynomial(a); 
b = new wmath.Polynomial(b); 
console.time('i'); 
var c = wmath.Polynomial.greatest_common_divisor_with_coefficient_in_polynomial(a, b); 
console.log(a.latex(), b.latex()); 
console.log(c[0].latex(), c[1].latex(), c[2].latex()); 
var d = c[1].mul(a).add(c[2].mul(b)).sub(c[0]); 
wmath.Scalar.precision = 1e-8; 
console.log(wmath.Vector.similarZero(d)); 
console.timeEnd('i'); 

