const nt = require('./number_theory'); 
const Scalar = require('./scalar'); 
const Fraction = require('./fraction'); 
const Vector = require('./vector'); 

class Polynomial extends Vector{
    constructor() {
        super(); 
        if (arguments.length != 1) throw "too many or too few arguments !"; 
        if (!arguments[0] instanceof Array) throw "argument must be Array !"; 
        this.coefficient = []; 
        for (var _i in arguments[0]) {
            if (!Vector.isVector(arguments[0][_i])) { throw "items in Polynomial must be Vector !"; }
            this.coefficient.push(Vector.deepcopy(arguments[0][_i])); 
        }
        this.adjust(); 
    }

    class() { return Polynomial; }

    typeName() { return "Polynomial"; }

    static typeName() { return "Polynomial"; }

    adjust() {
        while (this.coefficient.length > 1 && Vector.equalZero(this.coefficient[this.degree()]))
            this.coefficient.pop(); 
        return this; 
    }

    similarAdjust() {
        while (this.coefficient.length > 1 && Vector.similarZero(this.coefficient[this.degree()]))
            this.coefficient.pop(); 
        return this; 
    }

    degree() { return this.coefficient.length - 1; }

    latex() {
        var _latex = ''; 
        for (var i = this.coefficient.length - 1; i > 0; i--) 
            _latex += '(' + Vector.latex(this.coefficient[i]) + ')x^{' + String(i) + '}+'; 
        _latex += '(' + Vector.latex(this.coefficient[0]) + ')'; 
        return _latex; 
    }

    equal(other) {
        if (this.degree() != other.degree())
            return false; 
        if (this.coefficient == other.coefficient)
            return true; 
        for (var i = 0; i <= this.degree(); i++)
            if (!Vector.equal(this.coefficient[i], other.coefficient[i]))
                return false; 
        return true; 
    }

    deepcopy() { return new Polynomial(this.coefficient); }

    positive() { return new Polynomial(this.coefficient); }

    negative() { 
        var _coefficient = []; 
        for (var i in this.coefficient)
            _coefficient.push(Vector.negative(this.coefficient[i])); 
        return new Polynomial(_coefficient); 
    }

    conjugate() {
        var _coefficient = []; 
        for (var i in this.coefficient)
            _coefficient.push(Vector.conjugate(this.coefficient[i])); 
        return new Polynomial(_coefficient); 
    }

    add(other) {
        var _degree = Math.max(this.degree(), other.degree()); 
        var _coefficient = []; 
        for (var i = 0; i <= _degree; i++) {
            if (i <= this.degree()) {
                _coefficient.push(Vector.deepcopy(this.coefficient[i])); 
                if (i <= other.degree())
                    _coefficient[i] = Vector.add(_coefficient[i], other.coefficient[i]); 
            } else 
                _coefficient.push(Vector.deepcopy(other.coefficient[i])); 
        }
        return new Polynomial(_coefficient); 
    }

    sub(other) {
        var _degree = Math.max(this.degree(), other.degree()); 
        var _coefficient = []; 
        for (var i = 0; i <= _degree; i++) {
            if (i <= this.degree()) {
                _coefficient.push(Vector.deepcopy(this.coefficient[i])); 
                if (i <= other.degree())
                    _coefficient[i] = Vector.sub(_coefficient[i], other.coefficient[i]); 
            } else 
                _coefficient.push(Vector.negative(other.coefficient[i])); 
        }
        return new Polynomial(_coefficient); 
    }

    mul(other) {
        var _degree = this.degree() + other.degree(); 
        var _coefficient = []; 
        for (var i = 0; i <= this.degree(); i++)
            for (var j = 0; j <= other.degree(); j++) {
                var _ = Vector.mul(this.coefficient[i], other.coefficient[j]); 
                _coefficient[i + j] = (_coefficient[i + j]) ? Vector.add(_,  _coefficient[i + j]) : _; 
            }
        return new Polynomial(_coefficient); 
    }

    div(other) {
        var _this =  this.deepcopy(); 
        if (_this.degree() < other.degree())
            return [Vector.zero(Polynomial), _this]; 
        if (other.degree() == 0)
            return [_this.times(Vector.reciprocal(other.coefficient[0])), Vector.zero(Polynomial)]; 
        var _degree; 
        var _coefficient = []; 
        while (_this.degree() >= other.degree()) {
            _degree = _this.degree() - other.degree(); 
            _coefficient[_degree] = Vector.div(_this.coefficient[_this.degree()], other.coefficient[other.degree()]); 
            _this = _this.sub(other.times(_coefficient[_degree], _degree)); 
            if (_this.degree() == _degree + other.degree())
                _this.coefficient.pop(); 
        }
        return [new Polynomial(_coefficient), _this]; 
    }

    pow(exp) {
        /* exp: Int */
        if ((typeof(exp) == "number" || exp instanceof Number) && exp % 1 == 0 && exp >= 0) {
            var _this = this.deepcopy(); 
            var _pow = new Polynomial([1]); 
            while (exp) {
                if (exp & 1) _pow = _pow.mul(_this); 
                _this = _this.mul(_this); 
                exp >>= 1; 
            }
            return _pow; 
        } else throw "exponent must be non-negative integers in Polynomial !"; 
    }

    times(other, degree) {
        var _coefficient = []; 
        while (degree--) _coefficient.push(Vector.zero(other)); 
        for (var i in this.coefficient)
            _coefficient.push(Vector.mul(this.coefficient[i], other)); 
        return new Polynomial(_coefficient); 
    }

    times_left(other, degree) {
        var _coefficient = []; 
        while (degree--) _coefficient.push(Vector.zero(other)); 
        for (var i in this.coefficient)
            _coefficient.push(Vector.mul(other, this.coefficient[i])); 
        return new Polynomial(_coefficient); 
    }

    value(x) {
        var _value = this.coefficient[this.degree()]; 
        for (var i = this.degree() - 1; i >= 0; i--)
            _value = Vector.add(Vector.mul(_value, x), this.coefficient[i]); 
        return _value; 
    }

    derived() {
        var _coefficient = []; 
        for (var i = 1; i <= this.degree(); i++)
            _coefficient.push(Vector.mul(this.coefficient[i], i)); 
        return new Polynomial(_coefficient); 
    }

    integral() {
        var _coefficient = [0]; 
        for (var i = 0; i <= this.degree(); i++)
            _coefficient.push(Vector.div(this.coefficient[i], i + 1)); 
        return new Polynomial(_coefficient); 
    }

    monic() {
        var _this = this.deepcopy(); 
        if (Vector.equalOne(_this.coefficient[_this.degree()]) || (_this.degree() == 0 && Vector.equalZero(_this.coefficient[0])))
            return _this; 
        for (var i = 0; i < _this.degree(); i++)
            _this.coefficient[i] = Vector.div(_this.coefficient[i], _this.coefficient[_this.degree()]); 
        _this.coefficient[_this.degree()] = Vector.one(_this.coefficient[_this.degree()]); 
        return _this; 
    }

    primitive() {
        /* this function is valid only when all elements in this.coefficient are Fraction !!! */
        try {
        var _this = this.deepcopy(); 
        var _molecule_array = []; 
        var _denominator_array = []; 
        for (var i in _this.coefficient) {
            _molecule_array.push(_this.coefficient[i].molecule); 
            _denominator_array.push(_this.coefficient[i].denominator); 
        }
        var _molecule = nt.least_common_multiple_in_array(_denominator_array); 
        var _denominator = nt.greatest_common_divisor_in_array(_molecule_array); 
        var _times = new Fraction(_molecule, _denominator); 
        for (var i in _this.coefficient)
            _this.coefficient[i] = _this.coefficient[i].mul(_times); 
        return _this; 
        } catch { throw "primitive() is valid only when all elements in this.coefficient are Fraction !!!"; }
    }

    rational_roots() {
        /* this function is valid only when all elements in this.coefficient are Fraction !!! */
        try {
        var _this = this.primitive(); 
        if (_this.degree() == 0) return []; 
        if (_this.degree() == 1) return [_this.coefficient[0].div(_this.coefficient[1]).negative()]; 
        var _molecule_array = nt.factor(_this.coefficient[0].molecule); 
        var _denominator_array = nt.factor(_this.coefficient[_this.degree()].molecule); 
        var _rational_roots = []; 
        for (var i in _molecule_array)
            for (var j in _denominator_array) {
                var _fraction = new Fraction(_molecule_array[i], _denominator_array[j]); 
                if (_this.value(_fraction).molecule == 0)
                    _rational_roots.push(_fraction); 
                if (_this.value(_fraction.negative()).molecule == 0)
                    _rational_roots.push(_fraction.negative()); 
            }
        return _rational_roots; 
        } catch { throw "rational_roots() is valid only when all elements in this.coefficient are Fraction !!!"; }
    }

    real_roots(x_precision=Scalar.precision, y_precision=null) {
        /* this function is valid only when all elements in this.coefficient are Number !!! */
        function __real_root_multiplication(_this, _start, _pos) {
            if (_this.value(_start) == 0) return null; 
            var _start_pos = (_this.value(_start) > 0); 
            var x_delta = (_pos) ? 1 : -1; 
            var y_delta = _this.value(_start + x_delta); 
            while ((x_precision && Math.abs(x_delta) > x_precision) || (y_precision && Math.abs(y_delta) > y_precision)) {
                try {
                    if ((y_delta < 0) ^ _start_pos) {
                        _start += x_delta; 
                        x_delta *= 2; 
                    } else {
                        x_delta /= 2; 
                    }
                    y_delta = _this.value(_start + x_delta); 
                } catch {
                    return null; 
                }
            }
            return _start; 
        }

        function __real_root_dichotomy(_this, _left, _right) {
            if (_this.value(_left) == 0) return null; 
            if (_this.value(_right) == 0) return null; 
            var _left_pos = (_this.value(_left) > 0); 
            var _right_pos = (_this.value(_right) > 0); 
            if (!(_left_pos ^ _right_pos)) return null; 
            var _mid = (_left + _right) / 2; 
            while ((x_precision && (_right - _left) > x_precision) || (y_precision && (Math.abs(_this.value(_mid)) > y_precision))) {
                if ((_this.value(_mid) > 0) ^ _left_pos) 
                    _right = _mid; 
                else 
                    _left = _mid; 
                _mid = (_left + _right) / 2; 
            }
            return _mid; 
        }

        try {
        if (this.degree() == 0) return []; 
        if (this.degree() == 1) return [-this.coefficient[0] / this.coefficient[1]]; 
        var _derived_real_roots = this.derived().real_roots(); 
        if (_derived_real_roots.length > 0) {
            var _real_roots = []; 
            if ((this.coefficient[this.degree()] > 0) ^ (this.value(_derived_real_roots[0]) > 0))
                if (this.value(_derived_real_roots[0]) == 0) _real_roots.push(_derived_real_roots[0]); 
                else {
                    var _root = __real_root_multiplication(this, _derived_real_roots[0], true); 
                    if (_root) _real_roots.push(_root); 
                }
            for (var i = 1; i < _derived_real_roots.length; i++)
                if (this.value(_derived_real_roots[i]) == 0) _real_roots.push(_derived_real_roots[i]); 
                else {
                    var _root = __real_root_dichotomy(this, _derived_real_roots[i], _derived_real_roots[i - 1]); 
                    if (_root) _real_roots.push(_root); 
                }
            if ((this.degree() % 2) ^ (this.coefficient[this.degree()] > 0) ^ (this.value(_derived_real_roots[_derived_real_roots.length - 1]) > 0)) {
                var _root = __real_root_multiplication(this, _derived_real_roots[_derived_real_roots.length - 1], false); 
                if (_root) _real_roots.push(_root); 
            }
            return _real_roots; 
        } else {
            if (this.value(0) == 0) return [0]; 
            var _root; 
            if ((this.coefficient[this.degree()] > 0) ^ (this.value(0) > 0))
                _root = __real_root_multiplication(this, 0, true); 
            else
                _root = __real_root_multiplication(this, 0, false); 
            return (_root) ? [_root] : []; 
        }
        } catch { throw "real_roots() is valid only when all elements in this.coefficient are Number !!!"; }
    }
    
    static similarOne(_this, precision) {
        var __this = _this.deepcopy().similarAdjust(); 
        return (__this.degree() == 0 && Vector.similarOne(__this.coefficient[0], precision)); 
    }

    static similarZero(_this, precision) {
        var __this = _this.deepcopy().similarAdjust(); 
        return (__this.degree() == 0 && Vector.similarZero(__this.coefficient[0], precision)); 
    }

    static greatest_common_divisor_in_polynomial(a, b) {
        // assert(a instanceof Polynomial && b instanceof Polynomial); 
        // var _a = a.deepcopy(); 
        // var _b = b.deepcopy(); 
        while (a.div(b)[1].degree()) {
            var _mid = b; 
            b = a.div(b)[1]; 
            a = _mid; 
        }
        return b.monic(); 
    }
    static greatest_common_divisor_with_coefficient_in_polynomial(a, b) {
        // assert(a instanceof Polynomial && b instanceof Polynomial); 
        // var _a = a.deepcopy(); 
        // var _b = b.deepcopy(); 
        if (a.div(b)[1].degree() == 0)
            return [b.monic(), this.zero(b.coefficient[b.degree()]), new Polynomial([Vector.reciprocal(b.coefficient[b.degree()])])]; 
        else {
            var __g_x_y = this.greatest_common_divisor_with_coefficient_in_polynomial(b, a.div(b)[1]); 
            var _x = __g_x_y[2]; 
            var _y = Vector.sub(__g_x_y[1], Vector.mul(a.div(b)[0], _x)); 
            return [__g_x_y[0], _x, _y]; 
        }
    }
}

module.exports = Polynomial; 