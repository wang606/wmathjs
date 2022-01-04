const nt = require('./number_theory'); 
const Scalar = require('./scalar'); 
const Complex = require('./complex'); 
const Fraction = require('./fraction'); 
const Vector = require('./vector'); 
const Polynomial = require('./polynomial'); 
const Matrix = require('./matrix'); 

function init() {

{/* Scalar */
Scalar.precision = 1e-10; 
{/* Scalar static properties */
Scalar.equal_ = {}; 
Scalar.to_ = {}; 
Scalar.add_ = {}; 
Scalar.sub_ = {}; 
Scalar.mul_ = {}; 
Scalar.div_ = {}; 
Scalar.pow_ = {}; 
Scalar.deepcopy_ = {}; 
Scalar.abs_ = {}; 
Scalar.positive_ = {}; 
Scalar.negative_ = {}; 
Scalar.reciprocal_ = {}; 
Scalar.conjugate_ = {}; 
Scalar.log_ = {}; 
Scalar.one_ = {}; 
Scalar.zero_ = {}; 
Scalar.similarOne_ = {}; 
Scalar.similarZero_ = {}; 
Scalar.equalOne_ = {}; 
Scalar.equalZero_ = {}; 
Scalar.latex_ = {}; 
}
{/* Scalar static methods */
Scalar.isNumber = (a) => { return (typeof(a) == "number" || a instanceof Number); }
Scalar.isInt = (a) => { return ((typeof(a) == "number" || a instanceof Number) && a % 1 == 0); }
Scalar.isScalar = (a) => { return (typeof(a) == "number" || a instanceof Number || a instanceof Scalar); }
Scalar.typeof = (a) => {
    if (typeof(a) == "number" || a instanceof Number || a == Number) return "Number"; 
    if (a.typeName) return a.typeName(); 
    throw "it isn't a Scalar !"; 
}
Scalar.equal = (a, b) => {
    if (Scalar.typeof(a) != Scalar.typeof(b))
        return false; 
    else
        return Scalar.equal_[Scalar.typeof(a)](a, b); 
}
Scalar.to = (a, b) => { return Scalar.to_[Scalar.typeof(a) + "0to0" + Scalar.typeof(b)](a, b); }
Scalar.add = (a, b) => { return Scalar.add_[Scalar.typeof(a) + "0add0" + Scalar.typeof(b)](a, b); }
Scalar.sub = (a, b) => { return Scalar.sub_[Scalar.typeof(a) + "0sub0" + Scalar.typeof(b)](a, b); }
Scalar.mul = (a, b) => { return Scalar.mul_[Scalar.typeof(a) + "0mul0" + Scalar.typeof(b)](a, b); }
Scalar.div = (a, b) => { return Scalar.div_[Scalar.typeof(a) + "0div0" + Scalar.typeof(b)](a, b); }
Scalar.pow = (a, b) => { return Scalar.pow_[Scalar.typeof(a) + "0pow0" + Scalar.typeof(b)](a, b); }
Scalar.deepcopy = (a) => { return Scalar.deepcopy_[Scalar.typeof(a)](a); }
Scalar.abs = (a) => { return Scalar.abs_[Scalar.typeof(a)](a); }
Scalar.positive = (a) => { return Scalar.positive_[Scalar.typeof(a)](a); }
Scalar.negative = (a) => { return Scalar.negative_[Scalar.typeof(a)](a); }
Scalar.reciprocal = (a) => { return Scalar.reciprocal_[Scalar.typeof(a)](a); }
Scalar.conjugate = (a) => { return Scalar.conjugate_[Scalar.typeof(a)](a); }
Scalar.log = (a) => { return Scalar.log_[Scalar.typeof(a)](a); }
Scalar.one = (a) => { return Scalar.one_[Scalar.typeof(a)](a); }
Scalar.zero = (a) => { return Scalar.zero_[Scalar.typeof(a)](a); }
Scalar.similarOne = (a, precision=Scalar.precision) => { return Scalar.similarOne_[Scalar.typeof(a)](a, precision); }
Scalar.similarZero = (a, precision=Scalar.precision) => { return Scalar.similarZero_[Scalar.typeof(a)](a, precision); }
Scalar.equalOne = (a) => { return Scalar.equalOne_[Scalar.typeof(a)](a); }
Scalar.equalZero = (a) => { return Scalar.equalZero_[Scalar.typeof(a)](a); }
Scalar.latex = (a) => { return Scalar.latex_[Scalar.typeof(a)](a); }
}
{/* Scalar child methods */
Scalar.equal_.Number = (a, b) => { return a == b; }
Scalar.equal_.Fraction = (a, b) => { return a.equal(b); }
Scalar.equal_.Complex = (a, b) => { return a.equal(b); }

Scalar.to_.Number0to0Number = (a, b) => { return a; }
Scalar.to_.Number0to0Fraction = (a, b) => { return new Fraction(a); }
Scalar.to_.Number0to0Complex = (a, b) => { return new Complex(a, 0); }
Scalar.to_.Fraction0to0Number = (a, b) => { return a.toNumber(); }
Scalar.to_.Fraction0to0Fraction = (a, b) => { return a; }
Scalar.to_.Fraction0to0Complex = (a, b) => { return new Complex(a.toNumber(), 0); }
Scalar.to_.Complex0to0Number = (a, b) => { if (a.imag == 0) return a.real; else throw "can't convert complex to real number. "; }
Scalar.to_.Complex0to0Fraction = (a, b) => { if (a.imag == 0) return new Fraction(a.real); else throw "can't convert complex to real number. "; }
Scalar.to_.Complex0to0Complex = (a, b) => { return a; }

Scalar.add_.Number0add0Number = (a, b) => { return a + b; }
Scalar.add_.Number0add0Fraction = (a, b) => { return Scalar.add(new Fraction(a), b); }
Scalar.add_.Number0add0Complex = (a, b) => { return new Complex(a + b.real, b.imag); }
Scalar.add_.Fraction0add0Number = (a, b) => { return Scalar.add(a, new Fraction(b)); }
Scalar.add_.Fraction0add0Fraction = (a, b) => { return a.add(b); }
Scalar.add_.Fraction0add0Complex = (a, b) => { return new Complex(a.toNumber() + b.real, b.imag); }
Scalar.add_.Complex0add0Number = (a, b) => { return new Complex(a.real + b, a.imag); }
Scalar.add_.Complex0add0Fraction = (a, b) => { return new Complex(a.real + b.toNumber(), a.imag); }
Scalar.add_.Complex0add0Complex = (a, b) => { return a.add(b); }

Scalar.sub_.Number0sub0Number = (a, b) => { return a - b; }
Scalar.sub_.Number0sub0Fraction = (a, b) => { return Scalar.sub(new Fraction(a), b); }
Scalar.sub_.Number0sub0Complex = (a, b) => { return new Complex(a - b.real, -b.imag); }
Scalar.sub_.Fraction0sub0Number = (a, b) => { return Scalar.sub(a, new Fraction(b)); }
Scalar.sub_.Fraction0sub0Fraction = (a, b) => { return a.sub(b); }
Scalar.sub_.Fraction0sub0Complex = (a, b) => { return new Complex(a.toNumber() - b.real, -b.imag); }
Scalar.sub_.Complex0sub0Number = (a, b) => { return new Complex(a.real - b, a.imag); }
Scalar.sub_.Complex0sub0Fraction = (a, b) => { return new Complex(a.real - b.toNumber(), a.imag); }
Scalar.sub_.Complex0sub0Complex = (a, b) => { return a.sub(b); }

Scalar.mul_.Number0mul0Number = (a, b) => { return a * b; }
Scalar.mul_.Number0mul0Fraction = (a, b) => { return Scalar.mul(new Fraction(a), b); }
Scalar.mul_.Number0mul0Complex = (a, b) => { return new Complex(a * b.real, a * b.imag); }
Scalar.mul_.Fraction0mul0Number = (a, b) => { return Scalar.mul(a, new Fraction(b)); }
Scalar.mul_.Fraction0mul0Fraction = (a, b) => { return a.mul(b); }
Scalar.mul_.Fraction0mul0Complex = (a, b) => { return new Complex(a.toNumber() * b.real, a.toNumber() * b.imag); }
Scalar.mul_.Complex0mul0Number = (a, b) => { return new Complex(a.real * b, a.imag * b); }
Scalar.mul_.Complex0mul0Fraction = (a, b) => { return new Complex(a.real * b.toNumber(), a.imag * b.toNumber()); }
Scalar.mul_.Complex0mul0Complex = (a, b) => { return a.mul(b); }

Scalar.div_.Number0div0Number = (a, b) => { return a / b; }
Scalar.div_.Number0div0Fraction = (a, b) => { return Scalar.div(new Fraction(a), b); }
Scalar.div_.Number0div0Complex = (a, b) => { return Scalar.div(new Complex(a, 0), b); }
Scalar.div_.Fraction0div0Number = (a, b) => { return Scalar.div(a, new Fraction(b)); }
Scalar.div_.Fraction0div0Fraction = (a, b) => { return a.div(b); }
Scalar.div_.Fraction0div0Complex = (a, b) => { return Scalar.div(new Complex(a.toNumber(), 0), b); }
Scalar.div_.Complex0div0Number = (a, b) => { return new Complex(a.real / b, a.imag / b); }
Scalar.div_.Complex0div0Fraction = (a, b) => { return new Complex(a.real / b.toNumber(), a.imag / b.toNumber()); }
Scalar.div_.Complex0div0Complex = (a, b) => { return a.div(b); }

Scalar.pow_.Number0pow0Number = (a, b) => { return Math.pow(a, b); }
Scalar.pow_.Number0pow0Fraction = (a, b) => { return Math.pow(a, b.toNumber()); }
Scalar.pow_.Number0pow0Complex = (a, b) => { return b.pow_left(a); }
Scalar.pow_.Fraction0pow0Number = (a, b) => { return (b % 1 == 0) ? a.pow(b) : Math.pow(a.toNumber(), b); }
Scalar.pow_.Fraction0pow0Fraction = (a, b) => { return Math.pow(a.toNumber(), b.toNumber()); }
Scalar.pow_.Fraction0pow0Complex = (a, b) => { return b.pow_left(a.toNumber()); }
Scalar.pow_.Complex0pow0Number = (a, b) => { return a.pow(b); }
Scalar.pow_.Complex0pow0Fraction = (a, b) => { return a.pow(b.toNumber()); }
Scalar.pow_.Complex0pow0Complex = (a, b) => { return a.pow_complex(b); }

Scalar.deepcopy_.Number = (a) => { return a; }
Scalar.deepcopy_.Fraction = (a) => { return a.deepcopy(); }
Scalar.deepcopy_.Complex = (a) => { return a.deepcopy(); }

Scalar.abs_.Number = (a) => { return Math.abs(a); }
Scalar.abs_.Fraction = (a) => { return a.abs(); }
Scalar.abs_.Complex = (a) => { return a.abs(); }

Scalar.positive_.Number = (a) => { return a; }
Scalar.positive_.Fraction = (a) => { return a.positive(); }
Scalar.positive_.Complex = (a) => { return a.positive(); }

Scalar.negative_.Number = (a) => { return -a; }
Scalar.negative_.Fraction = (a) => { return a.negative(); }
Scalar.negative_.Complex = (a) => { return a.negative(); }

Scalar.reciprocal_.Number = (a) => { return 1 / a; }
Scalar.reciprocal_.Fraction = (a) => { return a.reciprocal(); }
Scalar.reciprocal_.Complex = (a) => { return a.reciprocal(); }

Scalar.conjugate_.Number = (a) => { return a; }
Scalar.conjugate_.Fraction = (a) => { return a.conjugate(); }
Scalar.conjugate_.Complex = (a) => { return a.conjugate(); }

Scalar.log_.Number = (a) => { return Math.log(a); }
Scalar.log_.Fraction = (a) => { return Math.log(a.toNumber()); }
Scalar.log_.Complex = (a) => { return a.log(); }

Scalar.one_.Number = (a) => { return 1; }
Scalar.one_.Fraction = (a) => { return new Fraction(1, 1); }
Scalar.one_.Complex = (a) => { return new Complex(1, 0); }

Scalar.zero_.Number = (a) => { return 0; }
Scalar.zero_.Fraction = (a) => { return new Fraction(0, 1); }
Scalar.zero_.Complex = (a) => { return new Complex(0, 0); }

Scalar.similarOne_.Number = (a, precision) => { return Math.abs(a - 1) <= precision; }
Scalar.similarOne_.Fraction = (a, precision) => { return Math.abs(a.toNumber() - 1) <= precision; }
Scalar.similarOne_.Complex = (a, precision) => { return Math.abs(a.real - 1) <= precision && Math.abs(a.imag) <= precision; }

Scalar.similarZero_.Number = (a, precision) => { return Math.abs(a) <= precision; }
Scalar.similarZero_.Fraction = (a, precision) => { return Math.abs(a.toNumber()) <= precision; }
Scalar.similarZero_.Complex = (a, precision) => { return Math.abs(a.real) <= precision && Math.abs(a.imag) <= precision; }

Scalar.equalOne_.Number = (a) => { return (a == 1); }
Scalar.equalOne_.Fraction = (a) => { return (a.molecule == 1 && a.denominator == 1); }
Scalar.equalOne_.Complex = (a) => { return (a.real == 1 && a.imag == 0); }

Scalar.equalZero_.Number = (a) => { return (a == 0); }
Scalar.equalZero_.Fraction = (a) => { return (a.molecule == 0); }
Scalar.equalZero_.Complex = (a) => { return (a.real == 0 && a.imag == 0); }

Scalar.latex_.Number = (a) => { return String(a); }
Scalar.latex_.Fraction = (a) => { return a.latex(); }
Scalar.latex_.Complex = (a) => { return a.latex(); }
}
}  // Scalar

{/* Vector */
{/* Vector static properties */
Vector.equal_ = {}; 
Vector.to_ = {}; 
Vector.add_ = {}; 
Vector.sub_ = {}; 
Vector.mul_ = {}; 
Vector.div_ = {}; 
Vector.pow_ = {}; 
Vector.deepcopy_ = {}; 
Vector.abs_ = {}; 
Vector.positive_ = {}; 
Vector.negative_ = {}; 
Vector.reciprocal_ = {}; 
Vector.conjugate_ = {}; 
Vector.log_ = {}
Vector.one_ = {}; 
Vector.zero_ = {}; 
Vector.similarOne_ = {}; 
Vector.similarZero_ = {}; 
Vector.equalOne_ = {}; 
Vector.equalZero_ = {}; 
Vector.latex_ = {}; 
}
{/* Vector static methods */
Vector.isVector = (a) => { return (Scalar.isScalar(a) || a instanceof Vector); }
Vector.typeof = (a) => { 
    if (Scalar.isScalar(a)) return "Scalar"; 
    if (a.typeName) return a.typeName(); 
    throw "it is not a Vector !"; 
}
Vector.equal = (a, b) => {
    if (Vector.typeof(a) != Vector.typeof(b))
        return false; 
    else
        return Vector.equal_[Vector.typeof(a)](a, b); 
}
Vector.to = (a, b) => { return Vector.to_[Vector.typeof(a) + "0to0" + Vector.typeof(b)](a, b); }
Vector.add = (a, b) => { return Vector.add_[Vector.typeof(a) + "0add0" + Vector.typeof(b)](a, b); }
Vector.sub = (a, b) => { return Vector.sub_[Vector.typeof(a) + "0sub0" + Vector.typeof(b)](a, b); }
Vector.mul = (a, b) => { return Vector.mul_[Vector.typeof(a) + "0mul0" + Vector.typeof(b)](a, b); }
Vector.div = (a, b) => { return Vector.div_[Vector.typeof(a) + "0div0" + Vector.typeof(b)](a, b); }
Vector.pow = (a, b) => { return Vector.pow_[Vector.typeof(a) + "0pow0" + Vector.typeof(b)](a, b); }
Vector.log = (a) => { return Vector.log_[Vector.typeof(a)](a); }
Vector.deepcopy = (a) => { return Vector.deepcopy_[Vector.typeof(a)](a); }
Vector.abs = (a) => { return Vector.abs_[Vector.typeof(a)](a); }
Vector.positive = (a) => { return Vector.positive_[Vector.typeof(a)](a); }
Vector.negative = (a) => { return Vector.negative_[Vector.typeof(a)](a); }
Vector.reciprocal = (a) => { return Vector.reciprocal_[Vector.typeof(a)](a); }
Vector.conjugate = (a) => { return Vector.conjugate_[Vector.typeof(a)](a); }
Vector.one = (a) => { return Vector.one_[Vector.typeof(a)](a); }
Vector.zero = (a) => { return Vector.zero_[Vector.typeof(a)](a); }
Vector.similarOne = (a, precision=Scalar.precision) => { return Vector.similarOne_[Vector.typeof(a)](a, precision); }
Vector.similarZero = (a, precision=Scalar.precision) => { return Vector.similarZero_[Vector.typeof(a)](a, precision); }
Vector.equalOne = (a) => { return Vector.equalOne_[Vector.typeof(a)](a); }
Vector.equalZero = (a) => { return Vector.equalZero_[Vector.typeof(a)](a); }
Vector.latex = (a) => { return Vector.latex_[Vector.typeof(a)](a); }
}
{/* Vector child methods */
Vector.equal_.Scalar = Scalar.equal; 
Vector.to_.Scalar0to0Scalar = Scalar.to; 
Vector.add_.Scalar0add0Scalar = Scalar.add; 
Vector.sub_.Scalar0sub0Scalar = Scalar.sub; 
Vector.mul_.Scalar0mul0Scalar = Scalar.mul; 
Vector.div_.Scalar0div0Scalar = Scalar.div; 
Vector.pow_.Scalar0pow0Scalar = Scalar.pow; 
Vector.deepcopy_.Scalar = Scalar.deepcopy; 
Vector.abs_.Scalar = Scalar.abs; 
Vector.positive_.Scalar = Scalar.positive; 
Vector.negative_.Scalar = Scalar.negative; 
Vector.reciprocal_.Scalar = Scalar.reciprocal; 
Vector.conjugate_.Scalar = Scalar.conjugate; 
Vector.log_.Scalar = Scalar.log; 
Vector.one_.Scalar = Scalar.one; 
Vector.zero_.Scalar = Scalar.zero; 
Vector.similarOne_.Scalar = Scalar.similarOne; 
Vector.similarZero_.Scalar = Scalar.similarZero; 
Vector.equalOne_.Scalar = Scalar.equalOne; 
Vector.equalZero_.Scalar = Scalar.equalZero; 
Vector.latex_.Scalar = Scalar.latex; 

Vector.equal_.Polynomial = (a, b) => { return a.equal(b); }
Vector.add_.Polynomial0add0Polynomial = (a, b) => { return a.add(b); }
Vector.sub_.Polynomial0sub0Polynomial = (a, b) => { return a.sub(b); }
Vector.mul_.Polynomial0mul0Polynomial = (a, b) => { return a.mul(b); }
Vector.div_.Polynomial0div0Polynomial = (a, b) => { return a.div(b); }
Vector.deepcopy_.Polynomial = (a) => { return a.deepcopy(); }
Vector.positive_.Polynomial = (a) => { return a.positive(); }
Vector.negative_.Polynomial = (a) => { return a.negative(); }
Vector.conjugate_.Polynomial = (a) => { return a.conjugate(); }
Vector.one_.Polynomial = (a) => { return new Polynomial([Vector.one(a.coefficient[0])]); }
Vector.zero_.Polynomial = (a) => { return new Polynomial([Vector.zero(a.coefficient[0])]); }
Vector.similarOne_.Polynomial = Polynomial.similarOne; 
Vector.similarZero_.Polynomial = Polynomial.similarZero; 
Vector.equalOne_.Polynomial = (a) => { return (a.degree() == 0 && Vector.equalOne(a.coefficient[0])); }
Vector.equalZero_.Polynomial = (a) => { return (a.degree() == 0 && Vector.equalZero(a.coefficient[0])); }
Vector.latex_.Polynomial = (a) => { return a.latex(); }

Vector.equal_.Matrix = (a, b) => { return a.equal(b); }
Vector.add_.Matrix0add0Matrix = (a, b) => { return a.add(b); }
Vector.sub_.Matrix0sub0Matrix = (a, b) => { return a.sub(b); }
Vector.mul_.Matrix0mul0Matrix = (a, b) => { return a.mul(b); }
Vector.div_.Matrix0div0Matrix = (a, b) => { return a.div(b); }
Vector.deepcopy_.Matrix = (a) => { return a.deepcopy(); }
Vector.positive_.Matrix = (a) => { return a.positive(); }
Vector.negative_.Matrix = (a) => { return a.negative(); }
Vector.reciprocal_.Matrix = (a) => { return a.inverse(); }
Vector.conjugate_.Matrix = (a) => { return a.conjugate(); }
Vector.one_.Matrix = Matrix.one; //[TODO]
Vector.zero_.Matrix = Matrix.zero; //[TODO]
Vector.similarOne_.Matrix = Matrix.similarOne; 
Vector.similarZero_.Matrix = Matrix.similarZero; 
Vector.equalOne_.Matrix = Matrix.equalOne; 
Vector.equalZero_.Matrix = Matrix.equalZero; 
Vector.latex_.Matrix = (a) => { return a.latex(); }

Vector.to_.Scalar0to0Polynomial = (a, b) => { return new Polynomial([a]); }
Vector.to_.Scalar0toMatrix = (a, b) => {} //[TODO]
Vector.add_.Scalar0add0Polynomial = (a, b) => { return new Polynomial(a) + b; }
Vector.add_.Polynomial0add0Scalar = (a, b) => { return a + new Polynomial(b); }
Vector.sub_.Scalar0sub0Polynomial = (a, b) => { return new Polynomial(a) - b; }
Vector.sub_.Polynomial0sub0Scalar = (a, b) => { return a - new Polynomial(b); }
Vector.mul_.Scalar0mul0Polynomial = (a, b) => { return b.times_left(a); }
Vector.mul_.Polynomial0mul0Scalar = (a, b) => { return a.times(b); }
Vector.div_.Polynomial0div0Scalar = (a, b) => { return a.times(Scalar.reciprocal(b)); }
Vector.pow_.Polynomial0pow0Scalar = (a, b) => { return a.pow(b); }
}
}  // Vector

}  // init

exports.nt = nt; 
exports.Scalar = Scalar; 
exports.Complex = Complex; 
exports.Fraction = Fraction; 
exports.Vector = Vector; 
exports.Polynomial = Polynomial; 
exports.Matrix = Matrix; 
exports.init = init; 