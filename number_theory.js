const assert = require('assert'); 
const Scalar = require('./scalar'); 

function is_prime(x) {
    /*
    judge whether x is a prime.
    if x <= 1, then return False.
    :param x: (int)
    :return: (bool) True if x is a prime, while False if not
    */
    assert(Scalar.isInt(x)); 
    if (x == 2)
        return true; 
    if ((x & 1) == 0 || x <= 1)
        return false; 
    var _is_prime = true; 
    var _sqrt = Math.sqrt(x) + 1; 
    var _i = 3; 
    while (_i <= _sqrt) {
        if (x % _i == 0) {
            _is_prime = false; 
            break; 
        }
        _i += 2; 
    }
    return _is_prime; 
}

function find_prime_until(x) {
    /*
    return all prime less than int x.
    :param x: (int)
    :return: (array) all prime less than int x
    */
    assert(Scalar.isNumber(x)); 
    if (x < 2)
        return []; 
    var _prime = [2]; 
    var _i = 3; 
    var _is_prime, _sqrt; 
    while (_i <= x) {
        _is_prime = true; 
        _sqrt = Math.sqrt(_i); 
        for (var _j = 0; _j < _prime.length; _j++) {
            if (_prime[_j] > _sqrt)
                break; 
            if (_i % _prime[_j] == 0) {
                _is_prime = false; 
                break; 
            }
        }
        if (_is_prime)
            _prime.push(_i); 
        _i += 2; 
    }
    return _prime; 
}

function prime_factor_without_exp(x) {
    /*
    calc all prime factors of int x.
    if x is zero or one, then return [].
    if x < 0, then return the result of -x.
    :param x: (int)
    :return: (array) all prime factors of int x
    */
    assert(Scalar.isInt(x)); 
    x = Math.abs(x); 
    if (x == 0 || x == 1)
        return []; 
    var _array = []; 
    var _prime = find_prime_until(Math.sqrt(x) + 1); 
    _prime.forEach(_i => {
        if (x % _i == 0) {
            _array.push(_i); 
            while (x % _i == 0)
                x /= _i; 
        }
    }); 
    if (x != 1)
        _array.push(x)
    return _array; 
}

function prime_factor_with_exp(x) {
    /*
    calc all prime factors and each exp of int x.
    if x is zero or one, then return {}.
    if x < 0, then return the result of -x.
    :param x: (int)
    :return: (dict) all prime factors as keys with each exp as value of int x
    */
    assert(Scalar.isInt(x)); 
    x = Math.abs(x); 
    if (x == 0 || x == 1)
        return {}; 
    var _dict = {}; 
    var _prime = find_prime_until(Math.sqrt(x) + 1); 
    _prime.forEach(_i => {
        if (x % _i == 0) {
            _dict[_i] = 0; 
            while (x % _i == 0) {
                _dict[_i]++; 
                x /= _i; 
            }
        }
    }); 
    if (x != 1)
        _dict[x] = 1; 
    return _dict; 
}

function factor(x) {
    /*
    calc all factors of int x.
    if x is zero, then return [].
    if x < 0, then return the result of -x.
    :param x: (int)
    :return: (array) all factors of int x
    */
    assert(Scalar.isInt(x)); 
    x = Math.abs(x); 
    if (x == 0) {
        console.warn('the factors of 0 is unclear, return [] instead. '); 
        return []; 
    }
    if (x == 1)
        return [1]; 
    
    function array_multiple(a, b) {
        _array = []
        b.forEach(_i => {
            a.forEach(_j => {
                _array.push(_i * _j); 
            });
        });
        return _array; 
    }

    var _prime_factor_with_exp = prime_factor_with_exp(x); 
    var _array2d = []; 
    for (var _prime in _prime_factor_with_exp) {
        var _array = [1]; 
        for (var _i = 1; _i < _prime_factor_with_exp[_prime] + 1; _i++)
            _array.push(_prime ** _i); 
        _array2d.push(_array); 
    }
    while (_array2d.length != 1) {
        var _len = _array2d.length; 
        _array2d[_len - 2] = array_multiple(_array2d[_len - 2], _array2d[_len - 1]); 
        _array2d.pop(); 
    }
    return _array2d[0]; 
}

function greatest_common_divisor(a, b) {
    /*
    calc the greatest common divisor between a and b.
    :param a: (int)
    :param b: (int)
    :return: (int) the greatest common divisor between a and b
    */
    assert(Scalar.isInt(a) && Scalar.isInt(b)); 
    if (a == 0 && b == 0) {
        console.warn('the greatest common divisor of 0 and 0 is unclear, return 0 instead. '); 
        return 0; 
    }
    if (b == 0)
        return a; 
    while (a % b != 0) {
        let _mid = b; 
        b = a % b; 
        a = _mid; 
    }
    return b; 
}

function greatest_common_divisor_in_array(a) {
    /*
    calc the greatest common divisor among items in a.
    :param a: (array) integer
    :return: (int) the greatest common divisor
    */
    assert(a instanceof Array && a.length); 
    var _a = a.slice(); 
    if (_a.includes(1))
        return 1; 
    var _pos = _a.indexOf(0); 
    while (_pos >= 0) {
        _a.splice(_pos, 1); 
        _pos = _a.indexOf(0); 
    }
    switch (_a.length) {
        case 0: { console.warn('the greatest common divisor of 0 and 0 is unclear, return 0 instead. '); return 0; }
        case 1: return _a[0]; 
        case 2: return greatest_common_divisor(_a[0], _a[1]); 
    }
    while (_a.length != 1) {
        _a[1] = greatest_common_divisor(_a[0], _a[1]); 
        _a.shift(); 
    }
    return _a[0]; 
}

function least_common_multiple(a, b) {
    /*
    calc the least common multiple between a and b.
    :param a: (int)
    :param b: (int)
    :return: (int) the least common multiple between a and b
    */
    return a * b / greatest_common_divisor(a, b); 
}

function least_common_multiple_in_array(a) {
    /*
    calc the least common multiple among items in a.
    :param a: (array) integer
    :return: (int) the least common multiple
    */
    assert(a instanceof Array && a.length); 
    var _a = a.slice(); 
    if (_a.includes(0))
        return 0; 
    var _pos = _a.indexOf(1); 
    while (_pos >= 0) {
        _a.splice(_pos, 1); 
        _pos = _a.indexOf(1); 
    }
    switch (_a.length) {
        case 0: return 1; 
        case 1: return _a[0]; 
        case 2: return least_common_multiple(_a[0], _a[1]); 
    }
    while (_a.length != 1) {
        _a[1] = least_common_multiple(_a[0], _a[1]); 
        _a.shift(); 
    }
    return _a[0]; 
}

function greatest_common_divisor_with_coefficient(a, b) {
    /*
    calc the greatest common divisor between a and b, and find two numbers x, y to fit formula:
    a * x + b * y = the greatest common divisor.
    :param a: (int)
    :param b: (int)
    :return: (array) the greatest common divisor, x, y
    */
    assert(Scalar.isInt(a) && Scalar.isInt(b)); 
    if (b == 0)
        return [a, 1, 0]; 
    var __gcd_x_y = greatest_common_divisor_with_coefficient(b, a % b); 
    var _x = __gcd_x_y[2]; 
    var _y = __gcd_x_y[1] - parseInt(a / b) * __gcd_x_y[2]; 
    return [__gcd_x_y[0], _x, _y]; 
}

function inverse(a, n) {
    /*
    calc the inverse of a in the case of module n, where a and n must be mutually prime.
    a * x = 1 (mod n)
    :param a: (int)
    :param n: (int)
    :return: (int) x
    */
    assert(greatest_common_divisor(a, n) == 1); 
    var _ = greatest_common_divisor_with_coefficient(a, n)[1] % n; 
    _ += (_ > 0) ? 0 : n; 
    return _; 
}

exports.is_prime = is_prime; 
exports.find_prime_until = find_prime_until; 
exports.prime_factor_without_exp = prime_factor_without_exp; 
exports.prime_factor_with_exp = prime_factor_with_exp; 
exports.factor = factor; 
exports.greatest_common_divisor = greatest_common_divisor; 
exports.greatest_common_divisor_in_array = greatest_common_divisor_in_array; 
exports.least_common_multiple = least_common_multiple; 
exports.least_common_multiple_in_array = least_common_multiple_in_array; 
exports.greatest_common_divisor_with_coefficient = greatest_common_divisor_with_coefficient; 
exports.inverse = inverse; 