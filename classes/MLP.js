class MLP {
    /**
     * @param {Object} config {layer_structure: [], n_input : number}
     */
    constructor(config) {
        if(config) {
            this.setConfig(config);
        }

        this.functions = {
            sigmoid : {
                expression : function(s) {
                    return 1 / (1 + Math.exp(-s));
                },
                derivative : function(s) {
                    return 1/ ( 2 + Math.exp(-s)+Math.exp(s));
                }
            }
        }
    }

    /**
     * @param {Object} config {layer_structure: [], n_input : number}
     */
    setConfig(config) {
        this.layer_structure = config.layer_structure;
        this.n_input = config.n_input;

        this.layers = [];
        this.init();
    }

    init() {
        // defines each layer
        for (let index = 0; index < this.layer_structure.length; index++) {
            let layer = new Layer();
            layer.data['index'] = index;
            let nb_of_inputs = index == 0 ? this.n_input : this.layers[index-1].getNbOfNeuron();
            layer.setNeuronsTo(this.layer_structure[index], nb_of_inputs);

            layer.each((neuron, index) => {
                neuron.setActivationFunction(this.functions.sigmoid.expression);
                neuron.setActivationFunctionDerivative(this.functions.sigmoid.expression);
            });

            this.layers.push(layer);
        }
        // joins them
        for (let i = 0; i < this.layers.length; i++) {
            if(i + 1 < this.layers.length) {
                this.layers[i].setNext(this.layers[i+1]);
                this.layers[i+1].setPrev(this.layers[i]);
            }
        }
        this.resetCursor();

        this.computeArrayRepresentations();
    }

    computeArrayRepresentations() {
        this.weights = []; // 3d
        this.biases = []; // 2d
        this.errors = []; // 2d
        this.deltas = []; // 2d
        this.outputs = []; // 2d

        let that = this;
        this.each((layer, l_index) => {
            that.weights[l_index] = [];
            that.biases[l_index] = [];
            that.errors[l_index] = [];
            that.deltas[l_index] = [];
            that.outputs[l_index] = []; // 2d

            layer.each((neuron, n_index) => {
                that.weights[l_index][n_index] = neuron.weight;
                that.biases[l_index][n_index] = neuron.bias;
                that.errors[l_index][n_index] = 0;
                that.deltas[l_index][n_index] = 0;
                that.outputs[l_index][n_index] = 0;
            });
        });
    }

    syncWithArrayRepresentations() {
        // called to sync the object representation and the array representation
        let that = this;
        this.each((layer, l_index) => {
            layer.each((neuron, n_index) => {
                neuron.weight = that.weights[l_index][n_index];
                neuron.bias = that.biases[l_index][n_index];
                neuron.set("error", that.errors[l_index][n_index]);
                neuron.set("delta", that.deltas[l_index][n_index]);
                neuron.set("output", that.outputs[l_index][n_index]);
            });
        });
    }

    /**
     * @param {Function} fun
     */
    each(fun) {
        this.layers.forEach((layer, i) => {
            fun(layer, i);
        });
    }

    resetCursor() {
        this.cursor_layer = this.layers[0];
    }
    /**
     * @returns {Layer}
     */
    prev() {
        this.cursor_layer = this.cursor_layer.getPrev();
        return this.cursor_layer;
    }

    hasNext() {
        return
    }
    /**
     * @returns {Layer}
     */
    next() {
        this.cursor_layer = this.cursor_layer.getNext();
        return this.cursor_layer;
    }
    end() {
        while(this.current().hasNext()) {
            this.next();
        }
        return this.current();
    }
    /**
     * @returns {Layer}
     */
    current() {
        return this.cursor_layer;
    }

    /**
     * @param {number} input
     * @returns {number[]}
     */
    getOutput(input) {
        let output = [];
        let that = this;
        this.each((layer, l_index) => {
            let _input = [];
            if(l_index == 0) {
                _input = input;
            } else {
                let previous = that.layers[l_index - 1];
                previous.each((p_neuron, pn_index) => {
                    _input.push(p_neuron.get('out'));
                });
            }
            layer.each((neuron, n_index) => {
                const out = neuron.getOutput(_input);
                neuron.set('input', _input); // used for training
                neuron.set("out", out);
                output.push(out);
            });

            // console.log("l_index ", l_index,"input ",_input);
            // console.log("l_index ", l_index,"out ",output);
            if(l_index + 1 != that.layers.length) {
                output = []; // reset
            }
        });

        // console.log(output);
        return output;
    }
/*
    weightsToMatrix() {

    }
*/
}