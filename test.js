const wmath = require('./index'); 
wmath.init(); 
var a = []; 
for (var i = 0; i < 10; i++) {
    a.push([]); 
    for (var j = 0; j < 5; j++) {
        // var _ = []; 
        // for (var k = 0; k < 10; k++)
        //     _.push(Math.random())
        // a[i].push(new wmath.Polynomial(_)); 
        // a[i].push(new wmath.Fraction(Math.random() * 100)); 
        a[i].push(new wmath.Complex(Math.random() * 100, Math.random() * 100)); 
    }
    for (var j = 0; j < 5; j++) {
        a[i].push(new wmath.Fraction(Math.random() * 100)); 
    }
}
a = new wmath.Matrix(a); 
var b = a.inverse(); 
console.log(a.mul(b).latex()); 