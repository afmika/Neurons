class MLP {
    /**
     * @param {Object} config {layer_structure: [], n_input : number, n_output : number}
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
     * @param {Object} config {layer_structure: [], n_input : number, n_output : number}
     */
    setConfig(config) {
        this.layer_structure = config.layer_structure;
        this.n_input = config.n_input;
        this.n_output = config.n_output;

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
            layer.each((neuron, n_index) => {
                let out = null;
                if(l_index == 0) {
                    out = neuron.getOutput(input);
                    neuron.set("out", out);
                } else {
                    let _input = [];
                    let previous = that.layers[l_index - 1];
                    previous.each((p_neuron, pn_index) => {
                        _input.push(p_neuron.get('out'));
                    });
                    // console.log("layer ",l_index,_input);
                    out = neuron.getOutput(_input);
                    neuron.set("out", out);
                    if(l_index + 1 == that.layers.length) {
                        output.push(out);
                    }
                }
                
            });
        });
        return output;
    }
/*
    weightsToMatrix() {

    }
*/
}