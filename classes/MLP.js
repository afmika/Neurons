class MLP {
    /**
     * @param {Object} config {layer_structure: [], n_input : number, n_output : number}
     */
    constructor(config) {
        if(config) {
            this.setConfig(config);
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
    /**
     * @returns {Layer}
     */
    next() {
        this.cursor_layer = this.cursor_layer.getNext();
        return this.cursor_layer;
    }
    /**
     * @returns {Layer}
     */
    current() {
        return this.cursor_layer;
    }
}