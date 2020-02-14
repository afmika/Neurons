/**
 * @author afmika
 * @email afmichael73@gmail.com
 * https://github.com/afmika
 */

class Neuron {
    constructor(size) {
        this.n_input = size || 0;
        this.input = new Array(size).fill(0);
        this.weight = new Array(size).fill(0);
        this.bias = 0;
        this.activation = function(s) {
            return 1 / (1 + Math.exp(-s));
            // return s > 0 ? 1 : 0;
        };
    }
    
    getWeight() {
        return this.weight;
    }
    setWeight(weight) {
        if(weight.length != this.n_input) {
            throw "nb_weight must be equal to "+this.n_input;
        }
        this.weight = weight;
    }
    initRandomWeight() {
        this.weight = this.weight.map(w => Math.random());
        this.bias = Math.random();
    }
    
    getBias() {
        return this.weight;
    }
    setBias(bias) {
        this.bias = bias;
    }

    setInput(input) {
        if(input.length != this.n_input) {
            throw "nb_input must be equal to "+this.n_input;
        }
        this.input = input;
    }
    getInput() {
        return this.input;
    }

    setNumberOfInput(n_input) {
        this.n_input = n_input;
    }
    getNumberOfInput() {
        return this.n_input;
    }
    getScalarProduct() {
        let s = 0;
        for (let i = 0; i < this.n_input; i++) {
            const [x, w] = [this.input[i], this.weight[i]];
            s += x * w;
        }
        return s + this.bias;
    }

    getOutput() {
        let s = this.getScalarProduct();
        return this.activation(s);
    }
}