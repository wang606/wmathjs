const nt = require('./number_theory'); 
const Scalar = require('./scalar'); 
const Complex = require('./complex'); 

class Fraction extends Scalar{
    constructor() {
        super(); 
        function toFraction(_x) {
            if (_x instanceof Fraction) return [_x.molecule, _x.denominator]; 
            if (Scalar.isInt(_x)) return [_x, 1]; 
            var _x = new String(_x); 
            if (_x.includes("/")) {
                _x = _x.split("/"); 
                var _m = toFraction(_x[0]); 
                var _d = toFraction(_x[1]); 
                return [_m[0] * _d[1], _m[1] * _d[0]]; 
            }
            var _molecule = 1, _denominator = 1; 
            if (_x.includes("e")) {
                var _exp = Number(_x.split("e")[1]); 
                if (_exp < 0) _denominator *= 10 ** -_exp; 
                else _molecule *= 10 ** _exp; 
                _x = _x.split("e")[0]; 
            }
            if (_x.includes(".")) {
                _molecule *= Number(_x.split(".")[0] + _x.split(".")[1]); 
                _denominator *= 10 ** _x.split(".")[1].length; 
            } else {
                _molecule *= Number(_x); 
            }
            return [_molecule, _denominator]; 
        }
        var _f; 
        switch (arguments.length) {
            case 1: {
                _f = toFraction(arguments[0]); 
                break; 
            }
            case 2: {
                var _f1 = toFraction(arguments[0]); 
                var _f2 = toFraction(arguments[1]); 
                _f = [_f1[0] * _f2[1], _f1[1] * _f2[0]]; 
                break; 
            }
            default:
                throw "too many or few arguments !"; 
        }
        if (_f[1] == 0) throw "denominator can't be zero !"; 
        this.molecule = _f[0]; 
        this.denominator = _f[1]; 
        this.adjust(); 
    }

    class() { return Fraction; }

    typeName() { return "Fraction"; }

    static typeName() { return "Fraction"; }

    adjust() {
        var _greatest_common_divisor = nt.greatest_common_divisor(this.molecule, this.denominator); 
        this.molecule /= _greatest_common_divisor; 
        this.denominator /= _greatest_common_divisor; 
    }

    toNumber() { return this.molecule / this.denominator; }
    
    latex() {
        if (this.denominator === 1)
            return String(this.molecule); 
        else
            return '\\frac{' + String(this.molecule) + '}{' + String(this.denominator) + '}'; 
    }

    equal() { 
        if (this.molecule == this.molecule && this.denominator == this.denominator)
            return true; 
        else
            return false; 
    }

    deepcopy() { return new Fraction(this.molecule, this.denominator); }

    abs() { return new Fraction(Math.abs(this.molecule), Math.abs(this.denominator)); }

    positive() { return new Fraction(this.molecule, this.denominator); }

    negative() { return new Fraction(-this.molecule, this.denominator); }

    reciprocal() { return new Fraction(this.denominator, this.molecule); }

    conjugate() { return new Fraction(this.molecule, this.denominator); }
    
    add(other) { return new Fraction(this.molecule * other.denominator + this.denominator * other.molecule, this.denominator * other.denominator); }

    sub(other) { return new Fraction(this.molecule * other.denominator - this.denominator * other.molecule, this.denominator * other.denominator); }

    mul(other) { return new Fraction(this.molecule * other.molecule, this.denominator * other.denominator); }

    div(other) { return new Fraction(this.molecule * other.denominator, this.denominator * other.molecule); }

    pow(exp) { /* exp: Int */ return new Fraction(this.molecule ** exp, this.denominator ** exp); }

    toComplex() { return new Complex(this.molecule / this.denominator, 0); }
    
}

module.exports = Fraction; 