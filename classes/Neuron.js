/**
 * @author afmika
 * @email afmichael73@gmail.com
 * https://github.com/afmika
 */

class Neuron {
    /**
     * 
     * @param {number} n_input number of input
     */
    constructor(n_input) {
        this.n_input = n_input || 0;
        this.weight = new Array(n_input).fill(0);
        this.bias = 0;
        this.data = {};
        this.activationFunction = Function.Sigmoid.expression;
        this.activationFunctionDerivative = Function.Sigmoid.derivative;
    }
    /**
     * @param {string} key data.key
     * @param {any} value data.value
     */
    set(key, value) {
        this.data[key] = value;
    }
    /**
     * @param {string} key data.key
     */
    get(key) {
        return this.data[key];
    }
    /**
     * @returns {JSON} data
     */
    getData() {
        return this.data;
    }

    /**
     * @returns {number[]}
     */
    getWeight() {
        return this.weight;
    }
    /**
     * 
     * @param {number[]} weight 
     */
    setWeight(weight) {
        if(weight.length != this.n_input) {
            throw "nb_weight must be equal to "+this.n_input;
        }
        this.weight = weight;
    }
    initRandomWeight() {
        this.weight = this.weight.map(w => -Math.random() + Math.random() );
        this.bias = -Math.random() + Math.random();
    }
    
    /**
     * @returns {number}
     */
    getBias() {
        return this.weight;
    }

    /**
     * @param {number} bias 
     */
    setBias(bias) {
        this.bias = bias;
    }

    /**
     * @param {number} n_input 
     */
    setNumberOfInput(n_input) {
        this.n_input = n_input;
    }
    /**
     * @returns {number}
     */
    getNumberOfInput() {
        return this.n_input;
    }

    /**
     * @param {Function} fun number function(x : number);
     */
    setActivationFunction(fun) {
        this.activationFunction = fun;
    }

    /**
     * @param {Function} fun number function(x : number);
     */
    setActivationFunctionDerivative(fun) {
        this.activationFunctionDerivative = fun;
    }

    /**
     * @param {number} s 
     */
    activation(s) {
        return this.activationFunction(s);
    }

    /**
     * @param {number} s
     */
    diff_activation(s) {
        return this.activationFunctionDerivative(s);
    }

    /**
     * @param {Number[]} input 
     */
    getScalarProductWith(input) {
        if(input.length != input.length) {
            throw new Error("Invalid input");
        }
        let s = 0;
        for (let i = 0; i < this.n_input; i++) {
            const [x, w] = [input[i], this.weight[i]];
            s += x * w;
        }
        return s + this.bias;
    }

    /**
     * @param {number[]} input 
     */
    getOutput(input) {
        if(!!!input) {
            throw new Error("No input given");
        }
        if(this.n_input != input.length) {
            throw new Error("Invalid number of input");
        }

        let s = this.getScalarProductWith(input);
        return this.activation(s);
    }

    /**
     * @param {number[]} input 
     */
    getDerivativeOutput(input) {
        if(!!!input) {
            throw new Error("No input given");
        }
        if(this.n_input != input.length) {
            throw new Error("Invalid number of input");
        }

        let s = this.getScalarProductWith(input);
        return this.diff_activation(s);
    }
}