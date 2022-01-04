const assert = require('assert'); 
const Scalar = require('./scalar'); 

class Complex extends Scalar{
    constructor(real, imag) {
        super(); 
        assert(Scalar.isNumber(real) && (Scalar.isNumber(imag) || imag == undefined)); 
        this.real = real; 
        this.imag = (imag) ? imag : 0; 
    }
    
    class() { return Complex; }

    typeName() { return "Complex"; }

    static typeName() { return "Complex"; }

    modulus() { return Math.sqrt(this.real ** 2 + this.imag ** 2); }

    radian() { return Math.atan(this.imag / this.real); }
    
    latex() {
        if (this.imag > 0)
            return String(this.real) + '+' + String(this.imag) + 'j'; 
        else if (this.imag < 0)
            return String(this.real) + String(this.imag) + 'j'; 
        else
            return String(this.real); 
    }

    equal(other) {
        if (this.real === other.real && this.imag === other.imag)
            return true; 
        else
            return false; 
    }

    deepcopy() { return new Complex(this.real, this.imag); }

    abs() { return this.modulus(); }

    positive() { return new Complex(this.real, this.imag); }

    negative() { return new Complex(-this.real, -this.imag); }

    reciprocal() { return Complex.one().div(this); }
    
    conjugate() { return new Complex(this.real, -this.imag); }

    add(other) { return new Complex(this.real + other.real, this.imag + other.imag); }

    sub(other) { return new Complex(this.real - other.real, this.imag - other.imag); }

    mul(other) { return new Complex(this.real * other.real - this.imag * other.imag, this.imag * other.real + this.real * other.imag); }

    div(other) {
        var _abs = other.real ** 2 + other.imag ** 2; 
        assert(_abs > 0); 
        return new Complex((this.real * other.real + this.imag * other.imag) / _abs, (this.imag * other.real - this.real * other.imag) / _abs); 
    }

    log() {
        var _modulus = Math.log(this.modulus()); 
        var _times = _modulus / this.modulus(); 
        return new Complex(this.real * _times, this.imag * _times); 
    }

    pow(exp) {
        /* exp: Number */
        var _modulus = this.modulus() ** exp; 
        var _radian = this.radian() * exp; 
        return new Complex(_modulus * Math.cos(_radian), _modulus * Math.sin(_radian)); 
    }

    pow_left(exp) {
        /* exp: Number */
        var _modulus = exp ** this.modulus(); 
        var _times = _modulus / this.modulus(); 
        return new Complex(this.real * _times, this.imag * _times); 
    }

    pow_complex(exp) {
        /* exp: Complex */
        var _modulus = this.modulus() ** exp.modulus(); 
        var _radian = this.radian() + exp.radian(); 
        return new Complex(_modulus * Math.cos(_radian), _modulus * Math.sin(_radian)); 
    }

    static one() { return new Complex(1, 0); }

    static zero() { return new Complex(0, 0); }

    static isOne() { return (this.real == 1 && this.imag == 0); }

    static isZero() { return (this.real == 0 && this.imag == 0); }
    
}; 

module.exports = Complex; 