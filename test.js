const wmath = require('./index'); 
wmath.init(); 
wmath.Scalar.precision = 1e-8; 

function rangeComplex2d(m, n) {
    var _array = []; 
    for (var i = 0; i < m; i++) {
        _array.push([]); 
        for (var j = 0; j < n; j++)
            _array[i].push(new wmath.Complex(Math.random() * 100, Math.random() * 100)); 
    }
    return _array; 
}

var a = new wmath.Matrix(rangeComplex2d(100, 100)); 
var b = new wmath.Matrix(rangeComplex2d(100, 100)); 
var c = wmath.Matrix.non_homogeneous_linear_equations(a, b); 
console.log(c[1][0].latex()); 