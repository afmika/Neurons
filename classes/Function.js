 /**
 * @author afmika
 * @email afmichael73@gmail.com
 * https://github.com/afmika
 */
const Function = {};

/**
 * @param {Function} func A differentiable single variable function
 * @param {number} x0
 */
Function.diff = function ( func, x0) {
    let dx = 0.0001;
    let dy = func(x0 + dx) - func(x0);
    return dy / dx;
}

class ActivationFunction {
    /**
     * Define a function and its derivative
     * If not defined the derivative will be computed automatically
     * @param {Function} expression
     * @param {Function} derivative 
     */
    constructor( expression, derivative ) {
        this.expression = expression;
        this.derivative = derivative || function( s ) {
            return Function.diff(expression, s);
        };
    }
}

Function.LineChan = {
    // this one is pretty good i think :p
    expression : function(x) {
            return 0.1 * x + 2;
    },
    derivative : function(x) {
        return 0.1;
    }
};

Function.Sigmoid = {
    // classic
    expression : function(s) {
        return 1 / (1 + Math.exp(-s) );
    },
    derivative : function(s) {
        return 1 / ( 2 + Math.exp(-s) + Math.exp(s) );
    }
};

Function.ReLU = {
    // PS use a very small learning rate for ReLU
    expression : function(s) {
        return s <= 0 ? 0 : s;
    },
    derivative : function(s) {
        return s <= 0 ? 0 : 1; 
    }
};
