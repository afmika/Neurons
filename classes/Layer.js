/**
 * @author afmika
 * @email afmichael73@gmail.com
 * https://github.com/afmika
 */

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
     * @param {Layer} prev 
     */
    setPrev(prev) {
        this.prev = prev;
    }
    /**
     * @param {Layer} next 
     */
    setNext(next) {
        this.next = next;
    }
    /**
     * @returns {Layer} next 
     */
    getPrev() {
        return this.prev;
    }
    /**
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
     * @param {Function} fun 
     */
    each(fun) {
        this.neurons.forEach((neuron, index) => {
            fun(neuron, index);
        });
    }
}