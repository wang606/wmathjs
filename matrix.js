const Scalar = require('./scalar'); 
const Fraction = require('./fraction'); 
const Vector = require('./vector'); 

class Matrix extends Vector{
    constructor(kernel) {
        super(); 
        var _kernel = []; 
        if (!kernel instanceof Array) { throw "kernel must be a 2d Array !"; }
        for (var i = 0; i < kernel.length; i++) {
            if (!kernel[i] instanceof Array) { throw "kernel must be a 2d Array !"; }
            if (kernel[0].length != kernel[i].length) { throw "the length of Array in kernel must be the same !"; }
            _kernel.push([]); 
            for (var j = 0; j < kernel[i].length; j++) {
                if (!Vector.isVector(kernel[i][j])) { throw "items in Matrix must be Vector !"; }
                _kernel[i].push(Vector.deepcopy(kernel[i][j])); 
            }
        }
        this.kernel = _kernel; 
    }

    class() { return Matrix; }

    typeName() { return "Matrix"; }

    static typeName() { return "Matrix"; }

    size() { return [this.kernel.length, this.kernel[0].length]; }

    latex() {
        var _latex = '\\begin{pmatrix}\n'; 
        for (var i = 0; i < this.size()[0]; i++) {
            for (var j = 0; j < this.size()[1]; j++)
                _latex += '{' + Vector.latex(this.kernel[i][j]) + '}&'; 
            _latex += '\\\\\n'; 
        }
        _latex += '\\end{pmatrix}'; 
        return _latex; 
    }

    equal(other) {
        if (this.size() != other.size()) return false; 
        if (this.kernel == other.kernel) return true; 
        for (var i = 0; i < this.size()[0]; i++)
            for (var j = 0; j < this.size()[1]; j++)
                if (!Vector.equal(this.kernel[i][j], other.kernel[i][j])) return false; 
        return true; 
    }

    deepcopy() { return new Matrix(this.kernel); }

    positive() { return new Matrix(this.kernel); }

    negative() {
        var _kernel = []; 
        for (var i = 0; i < this.size()[0]; i++) {
            _kernel.push([]); 
            for (var j = 0; j < this.size()[1]; j++)
                _kernel[i].push(Vector.negative(this.kernel[i][j])); 
        }
        return new Matrix(_kernel); 
    }

    reciprocal() { return this.inverse(); }

    inverse() {
        if (this.size()[0] != this.size()[1]) { throw "reciprocal or inverse is valid only when matrix is square !"; }
        var _kernel = this.deepcopy().kernel; 
        var _len = _kernel.length; 

        // create _inverse as result
        var _inverse = []; 
        for (var i = 0; i < _len; i++) {
            _inverse.push([]); 
            for (var j = 0; j < _len; j++)
                if (i == j) _inverse[i].push(Vector.one(_kernel[0][0])); 
                else _inverse[i].push(Vector.zero(_kernel[0][0])); 
        }

        // upper triangle
        for (var _index = 0; _index < _len; _index++) {

            // skip rows with a 'zero' beginning
            var _row = _index; 
            while (_row < _len && Vector.similarZero(_kernel[_row][_index])) _row++; 
            if (_row == _len) return null; 

            for (var __row = _row + 1; __row < _len; __row++) {
                var __times = Vector.div(_kernel[__row][_index], _kernel[_row][_index]); 
                for (var __col = _index + 1; __col < _len; __col++)
                    _kernel[__row][__col] = Vector.sub(_kernel[__row][__col], Vector.mul(__times, _kernel[_row][__col])); 
                for (var __col = 0; __col < _len; __col++)
                    _inverse[__row][__col] = Vector.sub(_inverse[__row][__col], Vector.mul(__times, _inverse[_row][__col])); 
            }

            // switch position if necessary
            if (_row != _index) {
                var _array = _kernel[_index]; 
                _kernel[_index] = _kernel[_row]; 
                _kernel[_row] = _array; 
                _array = _inverse[_index]; 
                _inverse[_index] = _inverse[_row]; 
                _inverse[_row] = _array; 
            }
        }

        // lower triangle
        for (var _index = _len - 1; _index >= 0; _index--) {
            for (var _row = 0; _row < _index; _row++) {
                var _times = Vector.div(_kernel[_row][_index], _kernel[_index][_index]); 
                for (var _col = 0; _col < _len; _col++)
                    _inverse[_row][_col] = Vector.sub(_inverse[_row][_col], Vector.mul(_times, _inverse[_index][_col])); 
            }
            for (var _col = 0; _col < _len; _col++)
                _inverse[_index][_col] = Vector.div(_inverse[_index][_col], _kernel[_index][_index]); 
        }

        return new Matrix(_inverse); 
    }

    conjugate() {
        var _kernel = []; 
        for (var i = 0; i < this.size()[0]; i++) {
            _kernel.push([]); 
            for (var j = 0; j < this.size()[1]; j++)
                _kernel[i].push(Vector.conjugate(this.kernel[i][j])); 
        }
        return new Matrix(_kernel); 
    }

    add(other) {
        if (this.size() != other.size()) { throw "matrices must have the same size !"; }
        var _kernel = []; 
        for (var i = 0; i < this.size()[0]; i++) {
            _kernel.push([]); 
            for (var j = 0; j < this.size()[1]; j++)
                _kernel[i].push(Vector.add(this.kernel[i][j], other.kernel[i][j])); 
        }
        return new Matrix(_kernel); 
    }

    sub(other) {
        if (this.size() != other.size()) { throw "matrices must have the same size !"; }
        var _kernel = []; 
        for (var i = 0; i < this.size()[0]; i++) {
            _kernel.push([]); 
            for (var j = 0; j < this.size()[1]; j++)
                _kernel[i].push(Vector.sub(this.kernel[i][j], other.kernel[i][j])); 
        }
        return new Matrix(_kernel); 
    }

    mul(other) {
        if (this.size()[1] != other.size()[0]) { throw "size not match !"; }
        var _kernel = []; 
        for (var i = 0; i < this.size()[1]; i++) {
            _kernel.push([]); 
            for (var j = 0; j < other.size()[0]; j++) {
                var _ = Vector.mul(this.kernel[i][0], other.kernel[0][j]); 
                for (var k = 0; k < this.size()[1]; k++)
                    _ = Vector.add(_, Vector.mul(this.kernel[i][k], other.kernel[k][j])); 
                _kernel[i].push(Vector.sub(_, Vector.mul(this.kernel[i][0], other.kernel[0][j]))); 
            }
        }
        return new Matrix(_kernel); 
    }

    div(other) {} //[TODO]


}

module.exports = Matrix; 