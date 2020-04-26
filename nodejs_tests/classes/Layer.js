/**
 * @author afmika
 * @email afmichael73@gmail.com
 * https://github.com/afmika
 */
const Neuron = require('./Neuron');

class Layer {
    /**
     * @param {Neuron[]} neurons 
     */
    constructor(neurons) {
        this.neurons = neurons || [];
        this.prev = null;
        this.next = null;
        this.data = {}; // extra info
    }
    /**
     * Add new data
     * @param {string} key data.key
     * @param {any} value data.value
     */
    set(key, value) {
        this.data[key] = value;
    }
    /**
     * Get data by key
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
     * Configure the number of neurons and inputs
     * @param {number} n_neuron number of neuron for this layer
     * @param {number} n_input number of each neuron's input
     */
    setNeuronsTo(n_neuron, n_input) {
        for (let index = 0; index < n_neuron; index++) {
            let neuron = new Neuron(n_input);
            neuron.initRandomWeight();
            this.neurons.push(neuron);
        }
    }

    /**
     * Set the previous layer
     * @param {Layer} prev 
     */
    setPrev(prev) {
        this.prev = prev;
    }
    /**
     * Set the next layer
     * @param {Layer} next 
     */
    setNext(next) {
        this.next = next;
    }
    /**
     * Get the previous layer
     * @returns {Layer} next 
     */
    getPrev() {
        return this.prev;
    }
    /**
     * Get the next layer
     * @returns {Layer} next 
     */
    getNext() {
        return this.next;
    }
    /**
     * @returns {boolean}
     */
    hasNext() {
        return this.getNext() != null;
    }
    /**
     * @returns {boolean}
     */
    hasPrev() {
        return this.getPrev() != null;
    }

    /**
     * @returns {number}
     */
    getNbOfNeuron() {
        return this.neurons.length;
    }
    
    /**
     * For loop
     * @param {Function} fun 
     */
    each(fun) {
        this.neurons.forEach((neuron, index) => {
            fun(neuron, index);
        });
    }
}

module.exports = Layer;