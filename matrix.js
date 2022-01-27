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

    transpose() {
        var _kernel = []; 
        for (var i = 0; i < this.size()[1]; i++) {
            _kernel.push([]); 
            for (var j = 0; j < this.size()[0]; j++)
                _kernel[i].push(Vector.deepcopy(this.kernel[j][i])); 
        }
        return new Matrix(_kernel); 
    }

    add(other) {
        if (this.size()[0] != other.size()[0] || this.size()[1] != other.size()[1]) { throw "matrices must have the same size !"; }
        var _kernel = []; 
        for (var i = 0; i < this.size()[0]; i++) {
            _kernel.push([]); 
            for (var j = 0; j < this.size()[1]; j++)
                _kernel[i].push(Vector.add(this.kernel[i][j], other.kernel[i][j])); 
        }
        return new Matrix(_kernel); 
    }

    sub(other) {
        if (this.size()[0] != other.size()[0] || this.size()[1] != other.size()[1]) { throw "matrices must have the same size !"; }
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
        for (var i = 0; i < this.size()[0]; i++) {
            _kernel.push([]); 
            for (var j = 0; j < other.size()[1]; j++) {
                var _ = Vector.mul(this.kernel[i][0], other.kernel[0][j]); 
                for (var k = 1; k < this.size()[1]; k++)
                    _ = Vector.add(_, Vector.mul(this.kernel[i][k], other.kernel[k][j])); 
                _kernel[i].push(_); 
            }
        }
        return new Matrix(_kernel); 
    }

    div(other) { return this.mul(other.inverse()); }

    horizontal_split() {
        /* 
        return a list of Matrix which is horizontally split from self.
        :return: (list of Matrix)
        */
        var _list = []; 
        for (var i = 0; i < this.size()[1]; i++) {
            _list.push([]); 
            for (var j = 0; j < this.size()[0]; j++)
                _list[i].push([Vector.deepcopy(this.kernel[j][i])])
        }
        for (var i = 0; i < this.size()[1]; i++)
            _list[i] = new Matrix(_list[i]); 
        return _list; 
    }

    vertical_split() {
        /*
        return a list of Matrix which is vertically split from self.
        :return: (list of Matrix)
        */
        var _list = []; 
        for (var i = 0; i < this.size()[0]; i++) {
            _list.push([]); 
            for (var j = 0; j < this.size()[1]; j++)
                _list[i].push(Vector.deepcopy(this.kernel[i][j])); 
        }
        for (var i = 0; i < this.size()[0]; i++)
            _list[i] = new Matrix([_list[i]]); 
        return _list; 
    }

    part(_rows, _cols) {
        /*
        return a new Matrix with values copied or deep-copied from {self}, specified by {rows} and {cols}.
        _rows(_cols) accept range (_from, _to, _step) or list [a1, a2, ...] type.
        :param _rows: (range or list of int or indefined if you choose all rows)
        :param _cols: (range or list of int or undefined if you choose all cols)
        :return: (Matrix)
        */
        if (_rows === undefined) var _rows = [...Array(this.size()[0]).keys()]; 
        if (_cols === undefined) var _cols = [...Array(this.size()[1]).keys()]; 
        var _kernel = []; 
        try {
        for (var i in _rows) {
            _kernel.push([]); 
            for (var j in _cols)
                _kernel[i].push(Vector.deepcopy(this.kernel[_rows[i]][_cols[j]])); 
        }
        } catch { throw "index out of range !"; }
        return new Matrix(_kernel); 
    }

    fill(other, _rows, _cols, _new=false) {
        /*
        fill specific part of {this} with corresponding values in {other}.
        the part is specified by {_rows} and {_cols}.
        the size of {other} must be bigger than or equal to (len(_rows), len(_cols)).
        :param other: (Matrix or list2d or tuple with the same basic_data_type of self)
        :param _rows: (range or list of int or None if you choose all rows)
        :param _cols: (range or list of int or None if you choose all cols)
        :param _new: (bool) (bool) True for a new matrix, False for no
        :return: (Matrix) if _new: a new matrix, else: self after filling
        */
        var _this = (_new) ? this.deepcopy() : this; 
        if (other instanceof Matrix) var other = other.kernel; 
        if (_rows === undefined) var _rows = [...Array(this.size()[0]).keys()]; 
        if (_cols === undefined) var _cols = [...Array(this.size()[1]).keys()]; 
        var __row = 0, __col = 0; 
        for (var i in _rows) {
            for (var j in _cols) {
                _this.kernel[_rows[i]][_cols[j]] = other[__row][__col]; 
                __col++; 
            }
            __col = 0; 
            __row++; 
        }
        return _this; 
    }

    times(_times, _rows, _cols) {
        /*
        multiply each item in {this} by _times.
        if _rows(_cols) is not None, it would only multiply the specific rows(cols).
        _rows(_cols) accept range (_from, _to, _step) or list [a1, a2, ...] type.
        :param _times: (self.basic_data_type()) times
        :param _rows: (range or list of int) keep None if you want to change all rows
        :param _cols: (range or list of int) keep None if you want to change all cols
        :return: (Matrix) this after multiplication(a brand-new Matrix)
        */
        var _this = this.deepcopy(); 
        if (_rows === undefined) var _rows = [...Array(this.size()[0]).keys()]; 
        if (_cols === undefined) var _cols = [...Array(this.size()[1]).keys()]; 
        for (var i in _rows)
            for (var j in _cols)
                _this.kernel[_rows[i]][_cols[j]] = Vector.mul(_this.kernel[_rows[i]][_cols[j]], _times); 
        return _this; 
    }
    

    stepped(standardized=false, simplified=false, _neg_needed=false, _independent_cols_needed=false) {
        /*
        turn any matrix into stepped or standardized stepped or simplified stepped matrix.
        :param simplified: (bool)
        :param standardized: (bool)
        :param _neg_needed: (bool)
        :param _independent_cols_needed: (bool)
        :return: (Matrix) if _new: a new matrix, else: self after stepped or standardized stepped or simplified stepped.
            (multi) Matrix as above, [_neg: (bool) if _neg_needed],
            [_independent_cols: (list) if _independent_cols_needed]
        */
        var _this = this.deepcopy(); 

        // independent_cols and neg
        var independent_cols = []; 
        var _row = 0, _col = 0; 
        var _neg = false; 
        while (_row < _this.size()[0] && _col < _this.size()[1]) {

            // skip rows with a 'zero' beginning
            var __row = _row; 
            while (__row < _this.size()[0] && Vector.similarZero(_this.kernel[__row][_col]))
                __row++; 
            if (__row == _this.size()[0]) {
                _col++; 
                continue; 
            }
            independent_cols.push(_col); 

            // upper-triangle method
            for (var ___row = __row + 1; ___row < _this.size()[0]; ___row++) {
                var ___times = Vector.div(_this.kernel[___row][_col], _this.kernel[__row][_col]); 
                _this.kernel[___row][_col] = Vector.zero(_this.kernel[___row][_col]); 
                for (var ___col = _col + 1; ___col < _this.size()[1]; ___col++)
                    _this.kernel[___row][___col] = Vector.sub(_this.kernel[___row][___col], Vector.mul(___times, _this.kernel[__row][___col])); 
            }

            // switch position if necessary
            if (__row != _row) {
                var _list = _this.kernel[_row]; 
                _this.kernel[_row] = _this.kernel[__row]; 
                _this.kernel[__row] = _list; 
                _neg = !_neg; 
            }

            _col++; 
            _row++; 
        }

        // simplified
        if (simplified) {

            // dependent_cols
            var dependent_cols = []; 
            for (var i = 0; i < _this.size()[1]; i++)
                if (!independent_cols.includes(i))
                    dependent_cols.push(i); 
            
            for (var i = independent_cols.length - 1; i >= 0; i--) {
                for (var __row = 0; __row < i; __row++) {
                    var __times = Vector.div(_this.kernel[__row][independent_cols[i]], _this.kernel[i][independent_cols[i]]); 
                    for (var __col in dependent_cols)
                        if (dependent_cols[__col] > independent_cols[i])
                            _this.kernel[__row][dependent_cols[__col]] = Vector.sub(_this.kernel[__row][dependent_cols[__col]], Vector.mul(__times, _this.kernel[i][dependent_cols[__col]])); 
                    _this.kernel[__row][independent_cols[i]] = Vector.zero(_this.kernel[__row][independent_cols[i]]); 
                }
                for (var __col in dependent_cols)
                    if (dependent_cols[__col] > independent_cols[i])
                        _this.kernel[i][dependent_cols[__col]] = Vector.div(_this.kernel[i][dependent_cols[__col]], _this.kernel[i][independent_cols[i]]); 
                _this.kernel[i][independent_cols[i]] = Vector.one(_this.kernel[i][independent_cols[i]]); 
            }
        } else {

            // standardized
            if (standardized)
                for (var i = independent_cols.length - 1; i >= 0; i--) {
                    for (var __col = independent_cols[i] + 1; __col < _this.size()[1]; __col++)
                        _this.kernel[i][__col] = Vector.div(_this.kernel[i][__col], _this.kernel[i][independent_cols[i]]); 
                    _this.kernel[i][independent_cols[i]] = Vector.one(_this.kernel[i][independent_cols[i]]); 
                }
        }

        if (_neg_needed && _independent_cols_needed) return [_this, _neg, independent_cols]; 
        else if (_neg_needed && !_independent_cols_needed) return [_this, _neg]; 
        else if (!_neg_needed && _independent_cols_needed) return [_this, independent_cols]; 
        else return _this; 
    }

    trace() {
        if (this.size()[0] != this.size()[1]) throw "trace is valid only when matrix is square !"; 
        var _trace = this.kernel[0][0]; 
        for (var i = 1; i < this.size()[0]; i++)
            _trace = Vector.add(_trace, this.kernel[i][i]); 
        return _trace; 
    }

    rank() {
        var _ = this.stepped(false, false, false, true); 
        return _[1].length; 
    }

    determinant_upper_triangle() {
        if (this.size()[0] != this.size()[1]) throw "determinant_upper_triangle is valid only when matrix is square !"; 
        var _this_neg_cols = this.stepped(false, false, true, false); 
        var _determinant = _this_neg_cols[0].kernel[0][0]; 
        for (var _index = 1; _index < this.size()[1]; _index++)
            _determinant = Vector.mul(_determinant, _this_neg_cols[0].kernel[_index][_index]); 
        if (_this_neg_cols[1]) _determinant = Vector.negative(_determinant); 
        return _determinant; 
    }

    determinant_definition() {
        if (this.size()[0] != this.size()[1]) throw "determinant_definition is valid only when matrix is square !"; 
        function __determinant(__this, __rows, __cols) {
            if (__rows.length == 1) 
                return __this.kernel[__rows[0]][__cols[0]]; 
            var _determinant = Vector.mul(__this.kernel[__rows[0]][__cols[0]], __determinant(__this, __rows.slice(1), __cols.slice(1))); 
            for (var i = 1; i < __rows.length; i++)
                if (i % 2) 
                    _determinant = Vector.sub(_determinant, Vector.mul(__this.kernel[__rows[i]][__cols[0]], __determinant(__this, __rows.slice(0, i).concat(__rows.slice(i + 1)), __cols.slice(1)))); 
                else 
                    _determinant = Vector.add(_determinant, Vector.mul(__this.kernel[__rows[i]][__cols[0]], __determinant(__this, __rows.slice(0, i).concat(__rows.slice(i + 1)), __cols.slice(1)))); 
            return _determinant; 
        }
        return __determinant(this, [...Array(this.size()[0]).keys()], [...Array(this.size()[1]).keys()]); 
    }
    
    similar_diagonal(precision) {
        if (this.size()[0] != this.size()[1]) return false; 
        for (var i = 0; i < this.size()[0]; i++)
            for (var j = 0; j < this.size()[1]; j++)
                if (i != j && !Vector.similarZero(this.kernel[i][j], precision)) return false; 
        return true; 
    }

    similar_upper_triangle(precision) {
        if (this.size()[0] != this.size()[1]) return false; 
        for (var i = 0; i < this.size()[0]; i++)
            for (var j = 0; j < i; j++)
                if (!Vector.similarZero(this.kernel[i][j], precision)) return false; 
        return true; 
    }

    similar_hermite(precision) {
        if (this.size()[0] != this.size()[1]) return false; 
        for (var i = 0; i < this.size()[0]; i++)
            for (var j = 0; j < i; j++)
                if (!Vector.equal(this.kernel[i][j], Vector.conjugate(this.kernel[j][i]))) return false; 
        return true; 
    }

    similar_upper_hessenberg(precision) {
        if (this.size()[0] != this.size()[1]) return false; 
        for (var i = 0; i < this.size()[0]; i++)
            for (var j = 0; j < i - 1; j++)
                if (!Vector.similarZero(this.kernel[i][j], precision)) return false; 
        return true; 
    }

    similar_tridiagonal(precision) {
        if (this.size()[0] != this.size()[1]) return false; 
        for (var i = 0; i < this.size()[0]; i++)
            for (var j = 0; j < this.size()[1]; j++)
                if (i != j && !Vector.similarZero(this.kernel[i][j], precision)) return false; 
        return true; 
    }

    qr_schmidt_decomposition(_column_linearly_independent=false) {
        /*
        QR decomposition of matrix using schmidt method.
        :param _column_linearly_independent: (bool) mark this param True if you are sure
                                                    that the matrix is column linearly independent
        :return: (Matrix, Matrix) Q, R
        */
        function __inner(col1, col2) {
            // col1: Matrix, col2: Matrix
            var __result = Vector.mul(col1.kernel[0][0], Vector.conjugate(col2.kernel[0][0])); 
            for (var i = 1; i < col1.size()[0]; i++)
                __result = Vector.add(__result, Vector.mul(col1.kernel[i][0], Vector.conjugate(col2.kernel[i][0]))); 
            return __result; 
        }

        var independent_cols = []; 
        if (!_column_linearly_independent) {
            independent_cols = this.stepped(false, false, false, true)[1]; 
            _column_linearly_independent = (independent_cols.length == this.size()[1]); 
        }

        if (_column_linearly_independent) {

            var _this = this.horizontal_split(); 
            var _unitary = this.horizontal_split(); 
            var _ = []; 
            for (var i = 0; i < this.size()[1]; i++) _.push(Array(this.size()[1]).fill(Vector.zero(this.kernel[0][i]))); 
            for (var i = 0; i < this.size()[1]; i++) _[i][i] = Vector.one(this.kernel[0][i]); 
            var _triangle = new Matrix(_); 
            var _inner = []; 

            for (var i = 0; i < this.size()[1]; i++) {
                for (var j = 0; j < i; j++) {
                    var _coefficient = Vector.div(__inner(_this[i], _unitary[j]), _inner[j]); 
                    _triangle.kernel[j][i] = _coefficient; 
                    _unitary[i] = Vector.sub(_unitary[i], _unitary[j].times(_coefficient)); 
                }
                _inner.push(__inner(_unitary[i], _unitary[i])); 
            }

            _unitary = Matrix.horizontal_stack(_unitary); 

            for (var i = 0; i < this.size()[1]; i++) {
                var _coefficient = Vector.pow(_inner[i], 0.5); 
                _triangle = _triangle.times(_coefficient, [i], undefined); 
                _unitary = _unitary.times(Vector.reciprocal(_coefficient), undefined, [i]); 
            }

            return [_unitary, _triangle]; 

        } else {
            var independent_part = this.part(undefined, independent_cols); 
            var independent_unitary = independent_part.qr_schmidt_decomposition(_column_linearly_independent=true)[0]; 
            var dependent_unitary_list = Matrix.homogeneous_linear_equations(independent_part.transpose().conjugate()); 
            for (var i in dependent_unitary_list)
                dependent_unitary_list[i] = dependent_unitary_list[i].times(Vector.reciprocal(Vector.pow(__inner(dependent_unitary_list[i], dependent_unitary_list[i]), 0.5))); 
            var dependent_unitary = Matrix.horizontal_stack(dependent_unitary_list); 
            var _unitary = Matrix.zero_from_size(this.size()[0], this.size()[1], Vector.one(this.kernel[0][0])); 
            _unitary.fill(independent_unitary, undefined, independent_cols); 
            var dependent_cols = []; 
            for (var i = 0; i < this.size()[1]; i++)
                if (!independent_cols.includes(i))
                    dependent_cols.push(i); 
            _unitary.fill(dependent_unitary, undefined, dependent_cols); 
            var _triangle = Vector.mul(_unitary.transpose().conjugate(), this); 
            return [_unitary, _triangle]; 
        }
    }

    qr_householder_decomposition(_unitary_need=false) {
        /*
        qr decomposition of matrix using householder method.
        matrix must be square.
        :param _unitary_need: (bool)
        :return: ([Matrix, ]Matrix) [Q, ]R
        */
        if (this.size()[0] != this.size()[1]) throw "qr_householder_decomposition can't handle non square matrix, qr_schmidt_decomposition is recommended. "; 
        var _triangle = this.deepcopy(); 
        var _len = _triangle.size()[0]; 
        var _one = Vector.one(_triangle.kernel[0][0]); 
        var _zero = Vector.zero(_triangle.kernel[0][0]); 
        var _unitary = Matrix.one_from_size(_len, _len, _one, _zero); 
        for (var i = 0; i < _len - 1; i++) {
            var _1 = [], _2 = [i]; 
            for (var j = i + 1; j < _len; j++) { _1.push(j); _2.push(j) }
            if (Vector.similarZero(_triangle.part(_1, [i]))) continue; 
            var _v = _triangle.part(_2, [i]); 
            var _v_norm_2 = Vector.pow(_v.transpose().mul(_v.conjugate()).kernel[0][0], 0.5); 
            var _ = Vector.negative(Vector.mul(Vector.div(_v.kernel[0][0], Vector.abs(_v.kernel[0][0])), _v_norm_2)); 
            var _e = Matrix.one_from_size(_len - i, 1, _, Vector.zero(_)); 
            var _u = _v.sub(_e); 
            var _times = Vector.div(Vector.mul(_one, 2), _u.transpose().mul(_u.conjugate()).kernel[0][0]); 
            var _sub_p = Vector.sub(Matrix.one_from_size(_len - i, _len - i, _one, _zero), _u.mul(_u.transpose().conjugate()).times(_times)); 
            _triangle.fill(_e, _2, [i]); 
            _triangle.fill(_sub_p.mul(_triangle.part(_2, _1)), _2, _1); 
            if (_unitary_need) _unitary.fill(_sub_p.mul(_unitary.part(_2, undefined)), _2, undefined); 
        }
        if (_unitary_need) {
            _unitary = _unitary.transpose().conjugate(); 
            return [_unitary.negative(), _triangle.negative()]; 
        } else return _triangle.negative(); 
    }

    qr_givens_decomposition(_unitary_need=true) {
        /*
        qr decomposition of matrix using givens method.
        matrix must be square.
        :param _unitary_need: (bool)
        :return: ([Matrix, ]Matrix) [Q, ]R
        */
        if (this.size()[0] != this.size()[1]) throw "qr_givens_decomposition can't handle non square matrix, qr_schmidt_decomposition is recommended. "; 
        var _triangle = this.deepcopy(); 
        var _len = _triangle.size()[0]; 
        var _one = Vector.one(_triangle.kernel[0][0]); 
        var _zero = Vector.zero(_triangle.kernel[0][0]); 
        var _unitary = Matrix.one_from_size(_len, _len, _one, _zero); 
        for (var i = 0; i < _len - 1; i++)
            for (var j = i + 1; j < _len; j++) {
                if (Vector.similarZero(_triangle.kernel[j][i])) continue; 
                var _a = _triangle.kernel[i][i]; 
                var _a_norm = Vector.mul(_a, Vector.conjugate(_a)); 
                var _b = _triangle.kernel[j][i]; 
                var _b_norm = Vector.mul(_b, Vector.conjugate(_b)); 
                var _norm_2 = Vector.pow(Vector.add(_a_norm, _b_norm), 0.5); 
                var _c1 = Vector.div(Vector.conjugate(_a), _norm_2); 
                var _s1 = Vector.div(Vector.conjugate(_b), _norm_2); 
                var _s2 = Vector.negative(Vector.div(_b, _norm_2)); 
                var _c2 = Vector.div(_a, _norm_2); 
                var _g = new Matrix([[_c1, _s1], [_s2, _c2]]); 
                var _ = []; for (var k = i; k < _len; k++) _.push(k); 
                _triangle.fill(_g.mul(_triangle.part([i, j], _)), [i, j], _); 
                if (_unitary_need) _unitary.fill(_g.mul(_unitary.part([i, j], undefined)), [i, j], undefined); 
            }
        if (_unitary_need) {
            _unitary = _unitary.transpose().conjugate(); 
            return [_unitary, _triangle]; 
        } else return _triangle; 
    }

    upper_hessenberg(_unitary_need=false, _is_hermite=false) {
        /*
        make the matrix upper hessenberg.
        unitary * this * (unitary.transpose().conjugate()) is a hessenberg matrix.
        :param _unitary_need: (bool)
        :param _is_hermite: (bool) mark this param True if you are sure that the matrix is a hermitian
        :return: (Matrix or [Matrix, Matrix])
        */
        if (this.size()[0] != this.size()[1]) throw "non-square matrix can't be hessenberged !"; 
        if (!_is_hermite) var _is_hermite = this.similar_hermite(); 
        var _triangle = this.deepcopy(); 
        var _len = _triangle.size()[0]; 
        var _one = Vector.one(_triangle.kernel[0][0]); 
        var _zero = Vector.zero(_triangle.kernel[0][0]); 
        var _unitary = Matrix.one_from_size(_len, _len, _one, _zero); 
        for (var i = 1; i < _len - 1; i++) {
            var _1 = [], _2 = [i]; 
            for (var j = i + 1; j < _len; j++) { _1.push(j); _2.push(j); }
            if (Vector.similarZero(_triangle.part(_1, [i - 1]))) continue; 
            var _v = _triangle.part(_2, [i - 1]); 
            var _v_norm_2 = Vector.pow(_v.transpose().mul(_v.conjugate()).kernel[0][0], 0.5); 
            var _ = Vector.negative(Vector.mul(Vector.div(_v.kernel[0][0], Vector.abs(_v.kernel[0][0])), _v_norm_2)); 
            var _e = Matrix.one_from_size(_len - i, 1, _, Vector.zero(_)); 
            var _u = _v.sub(_e); 
            var _times = Vector.div(Vector.mul(_one, 2), _u.transpose().mul(_u.conjugate()).kernel[0][0]); 
            var _sub_p = Matrix.one_from_size(_len - i, _len - i, _one, _zero).sub(_u.mul(_u.transpose().conjugate()).times(_times)); 
            _triangle.fill(_e, _2, [i - 1]); 
            if (_is_hermite) _triangle.fill(_e.transpose().conjugate(), [i - 1], _2); 
            else _triangle.fill(_triangle.part([...Array(i).keys()], _2).mul(_sub_p), [...Array(i).keys()], _2); 
            _triangle.fill(_sub_p.mul(_triangle.part(_2, _2)).mul(_sub_p), _2, _2); 
            if (_unitary_need) _unitary.fill(_sub_p.mul(_unitary.part(_2, undefined)), _2, undefined); 
        }
        if (_unitary_need) return [_triangle, _unitary]; 
        else return _triangle; 
    }

    eigenvalue() {
        /*
        eigenvalue of self with double shifts method.
        the basic data type of self must be complex unless all eigenvalue is real numbers.
        :return: (list) eigenvalues
        */
        if (this.size()[0] != this.size()[1]) throw "eigenvalue() is valid only when matrix is square !"; 
        
        var _one = Vector.one(this.kernel[0][0]); 
        var _zero = Vector.zero(this.kernel[0][0]); 

        var _this; 
        if (!this.similar_upper_hessenberg()) _this = this.upper_hessenberg(); 
        else _this = this.deepcopy(); 
        var _eigenvalue = []; 
        var _is_tridiagonal = _this.similar_tridiagonal(); 
        while (!_this.similar_upper_triangle()) {
            var _len = _this.size()[0]; 
            var _b = Vector.add(_this.kernel[_len - 2][_len - 2], _this.kernel[_len - 1][_len - 1]); 
            var _c = Vector.sub(Vector.mul(_this.kernel[_len - 1][_len - 2], _this.kernel[_len - 2][_len - 1]), Vector.mul(_this.kernel[_len - 2][_len - 2], _this.kernel[_len - 1][_len - 1])); 
            var _delta = Vector.pow(Vector.add(Vector.pow(_b, 2), Vector.mul(_c, 4)), 0.5); 
            var _a1 = Vector.mul(Vector.add(_b, _delta), 0.5); 
            var _a2 = Vector.mul(Vector.sub(_b, _delta), 0.5); 
            var _shift1 = Matrix.one_from_size(_len, _len, _a1, Vector.zero(_a1)); 
            var _shift2 = Matrix.one_from_size(_len, _len, _a2, Vector.zero(_a2)); 
            _this = _this.sub(_shift1); 
            qr_iteration_for_upper_hessenberg(_this); 
            _this = _this.add(_shift1).sub(_shift2); 
            qr_iteration_for_upper_hessenberg(_this); 
            _this = _this.add(_shift2); 
            if (Vector.similarZero(_this.kernel[_len - 1][_len - 2])) {
                _eigenvalue.push(_this.kernel[_len - 1][_len - 1]); 
                _this = _this.part([...Array(_len - 1).keys()], [...Array(_len - 1).keys()]); 
            }
        }
        for (var i = 0; i < _this.size()[0]; i++) _eigenvalue.push(_this.kernel[i][i]); 
        return _eigenvalue; 

        function qr_iteration_for_upper_hessenberg(_this) {
            var _givens = []; 
            for (var __i = 0; __i < _len - 1; __i++) {
                if (Vector.similarZero(_this.kernel[__i + 1][__i])) {
                    _givens[__i] = Matrix.one_from_size(2, 2, _one, _zero); 
                    continue; 
                }
                var __a = _this.kernel[__i][__i]; 
                var __a_norm = Vector.mul(__a, Vector.conjugate(__a)); 
                var __b = _this.kernel[__i + 1][__i]; 
                var __b_norm = Vector.mul(__b, Vector.conjugate(__b)); 
                var _norm_2 = Vector.pow(Vector.add(__a_norm, __b_norm), 0.5); 
                var _c1 = Vector.div(Vector.conjugate(__a), _norm_2); 
                var _s1 = Vector.div(Vector.conjugate(__b), _norm_2); 
                var _s2 = Vector.negative(Vector.div(__b, _norm_2)); 
                var _c2 = Vector.div(__a, _norm_2); 
                var _g = new Matrix([[_c1, _s1], [_s2, _c2]]); 
                _givens[__i] = _g; 
                var _ = []; 
                if (_is_tridiagonal) for (var i = __i; i < (__i + 3 > _len) ? _len : __i + 3; i++) _.push(i); 
                else var _ = []; for (var i = __i; i < _len; i++) _.push(i); 
                _this.fill(_g.mul(_this.part([__i, __i + 1], _)), [__i, __i + 1], _); 
            }
            for (var __i = 0; __i < _len - 1; __i++) {
                var _ = []; 
                if (_is_tridiagonal) for (var i = (__i - 1 > 0) ? __i - 1 : 0; i < __i + 2; i++) _.push(i); 
                else _ = [...Array(__i + 2).keys()]; 
                _this.fill(_this.part(_, [__i, __i + 1]).mul(_givens[__i].transpose().conjugate()), _, [__i, __i + 1]); 
            }
        }
    }

    static one_from_size(rows, cols, item, other) {
        /*
        return a Matrix, whose size is [{rows}, {cols}], with diagonal filled with {item} and other part {other}. 
        */
        var _kernel = []; 
        for (var i = 0; i < rows; i++) {
            _kernel.push([]); 
            for (var j = 0; j < cols; j++)
                if (i == j) _kernel[i].push(item); 
                else _kernel[i].push(other); 
        }
        return new Matrix(_kernel); 
    }

    static zero_from_size(rows, cols, item) {
        /*
        return a Matrix, whose size is [{rows}, {cols}], filled with {item}. 
        */
        var _kernel = []; 
        for (var i = 0; i < rows; i++) {
            _kernel.push([]); 
            for (var j = 0; j < cols; j++)
                _kernel[i].push(item); 
        }
        return new Matrix(_kernel); 
    }

    static one(_matrix) {
        if (!_matrix instanceof Matrix) throw "argument must be a instance of Matrix !"; 
        var _kernel = []; 
        for (var i = 0; i < _matrix.size()[0]; i++) {
            _kernel.push([]); 
            for (var j = 0; j < _matrix.size()[1]; j++)
                if (i == j) _kernel[i].push(Vector.one(_matrix.kernel[i][j])); 
                else _kernel[i].push(Vector.zero(_matrix.kernel[i][j])); 
        }
        return new Matrix(_kernel); 
    }

    static zero(_matrix) {
        if (!_matrix instanceof Matrix) throw "argument must be a instance of Matrix !"; 
        var _kernel = []; 
        for (var i = 0; i < _matrix.size()[0]; i++) {
            _kernel.push([]); 
            for (var j = 0; j < _matrix.size()[1]; j++)
                _kernel[i].push(Vector.zero(_matrix.kernel[i][j])); 
        }
        return new Matrix(_kernel); 
    }

    static similarOne(_matrix, precision) {
        if (!_matrix instanceof Matrix) throw "argument must be a instance of Matrix !"; 
        for (var i = 0; i < _matrix.size()[0]; i++)
            for (var j = 0; j < _matrix.size()[1]; j++)
                if (i == j) if (!Vector.similarOne(_matrix.kernel[i][j], precision)) return false; 
                else if (!Vector.similarZero(_matrix.kernel[i][j], precision)) return false; 
        return true; 
    }

    static similarZero(_matrix, precision) {
        if (!_matrix instanceof Matrix) throw "argument must be a instance of Matrix !"; 
        for (var i = 0; i < _matrix.size()[0]; i++)
            for (var j = 0; j < _matrix.size()[1]; j++)
                if (!Vector.similarZero(_matrix.kernel[i][j], precision)) return false; 
        return true; 
    }

    static equalOne(_matrix) {
        if (!_matrix instanceof Matrix) throw "argument must be a instance of Matrix !"; 
        for (var i = 0; i < _matrix.size()[0]; i++)
            for (var j = 0; j < _matrix.size()[1]; j++)
                if (i == j) if (!Vector.equalOne(_matrix.kernel[i][j])) return false; 
                else if (!Vector.equalZero(_matrix.kernel[i][j])) return false; 
        return true; 
    }

    static equalZero(_matrix) {
        if (!_matrix instanceof Matrix) throw "argument must be a instance of Matrix !"; 
        for (var i = 0; i < _matrix.size()[0]; i++)
            for (var j = 0; j < _matrix.size()[1]; j++)
                if (!Vector.equalZero(_matrix.kernel[i][j])) return false; 
        return true; 
    }

    static horizontal_stack(matrices) {
        /*
        stack matrices horizontally.
        :param matrices: (list of Matrix)
        :return: (Matrix)
        */
        if (!matrices) throw "matrices can't be null or undefined !"; 
        for (var i = 1; i < matrices.length; i++)
            if (matrices[i].size()[0] != matrices[0].size()[0]) throw "matrices must have the same row size !"; 
        var _kernel = []; 
        for (var i = 0; i < matrices[0].size()[0]; i++) {
            _kernel.push([]); 
            for (var j = 0; j < matrices.length; j++)
                for (var k = 0; k < matrices[j].size()[1]; k++)
                    _kernel[i].push(Vector.deepcopy(matrices[j].kernel[i][k])); 
        }
        return new Matrix(_kernel); 
    }

    static vertical_stack(matrices) {
        /*
        stack matrices vertically.
        :param matrices: (list of Matrix)
        :return: (Matrix)
        */
        if (!matrices) throw "matrices can't be null or undefined !"; 
        for (var i = 1; i < matrices.length; i++)
            if (matrices[i].size()[1] != matrices[0].size()[1]) throw "matrices must have the same column size !"; 
        var _kernel = []; 
        var _row = 0; 
        for (var i = 0; i < matrices.length; i++) {
            for (var j = 0; j < matrices[i].size()[0]; j++) {
                _kernel.push([]); 
                for (var k = 0; k < matrices[0].size()[1]; k++)
                    _kernel[_row + j].push(matrices[i].kernel[j][k]); 
            }
            _row += matrices[i].size()[0]; 
        }
        return new Matrix(_kernel); 
    }

    static homogeneous_linear_equations(a) {
        /*
        figure out the fundamental system of solutions of homogeneous linear equations: a * X = Matrix(zero).
        :param a: (Matrix) as above
        :return: (list of Matrix) fundamental system of solutions
        */
        // upper triangle
        var [_a, independent_cols] = a.stepped(true, true, false, true); 
        // fundamental solutions
        var dependent_cols = []; 
        for (var i = 0; i < _a.size()[1]; i++)
            if (!independent_cols.includes(i)) dependent_cols.push(i); 
        var _len = dependent_cols.length; 
        if (_len === 0) return []; 
        var _fundamental_solutions_matrix = Matrix.zero_from_size(_a.size()[1], _len, Vector.zero(_a.kernel[0][0])); 
        _fundamental_solutions_matrix.fill(Vector.negative(_a.part(undefined, dependent_cols)), independent_cols, undefined); 
        _fundamental_solutions_matrix.fill(Matrix.one_from_size(_len, _len, Vector.one(_a.kernel[0][0]), Vector.zero(_a.kernel[0][0])), dependent_cols, undefined); 
        var _fundamental_solutions_list = _fundamental_solutions_matrix.horizontal_split(); 
        return _fundamental_solutions_list; 
    }

    static non_homogeneous_linear_equations(a, b) {
        /*
        figure out the fundamental system of solutions and one special solution of non-homogeneous linear equations:
        a * X = b.
        good news ! argument {b} could be a multi-columns matrix, which means this function can solve multiple equations at
        the same time.
        :param a: (Matrix) as above
        :param b: (Matrix) as above
        :return: (list of fundamental solutions, list of special solutions)
        */
        if (a.size()[0] != b.size()[0]) throw "number of equations does not match !"; 
        var _a = Matrix.horizontal_stack([a, b]); 
        var [_a, independent_cols] = _a.stepped(true, true, false, true); 
        // fundamental solutions
        var _independent_cols = []; 
        var _dependent_cols = []; 
        for (var i = 0; i < a.size()[1]; i++)
            if (independent_cols.includes(i)) _independent_cols.push(i); 
            else _dependent_cols.push(i); 
        var _rank = _independent_cols.length; 
        var _len = _dependent_cols.length; 
        var _fundamental_solutions_list = []; 
        if (_len != 0) {
            var _fundamental_solutions_matrix = Matrix.zero_from_size(a.size()[1], _len, Vector.zero(_a.kernel[0][0])); 
            _fundamental_solutions_matrix.fill(Vector.negative(_a.part(undefined, _dependent_cols)), _independent_cols, undefined); 
            _fundamental_solutions_matrix.fill(Matrix.one_from_size(_len, _len, Vector.one(_a.kernel[0][0]), Vector.zero(_a.kernel[0][0])), _dependent_cols, undefined); 
            _fundamental_solutions_list = _fundamental_solutions_matrix.horizontal_split(); 
        }
        // special solutions
        var _special_solutions_list = []; 
        for (var i = 0; i < b.size()[1]; i++) {
            var _row = b.size()[0] - 1; 
            while (Vector.similarZero(_a.kernel[_row][a.size()[1] + i])) _row--; 
            if (_row < _rank) {
                var _special_solution = Matrix.zero_from_size(a.size()[1], 1, Vector.zero(_a.kernel[0][0])); 
                _special_solution.fill(_a.part(undefined, [a.size()[1] + i]), _independent_cols, [0]); 
                _special_solutions_list.push(_special_solution); 
            } else {
                _special_solutions_list.push(null); 
            }
        }
        return [_fundamental_solutions_list, _special_solutions_list]; 
    }
}

module.exports = Matrix; 