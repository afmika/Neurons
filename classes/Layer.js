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
     * 
     * @param {number} n_neuron number of neuron for this layer
     * @param {number} n_input number of input of each neuron
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