/**
 * @author afmika
 * @email afmichael73@gmail.com
 * https://github.com/afmika
 */

class TrainingMachine {

    /**
     * 
     * @param {Number} steps learning step
     * @param {Number} alpha learning rate
     */
    constructor(steps, alpha) {
        this.alpha = alpha;
        this.n_steps = steps;
    }  
    /**
     * @param {Neuron} neuron neuron input
     * @param {Object} single_sample { outputs : [ Array N * N_INPUT ] , labels : [ Array N] } :: configuration object
     * @param {Number} sample_index sample index (optional)
     * @returns {number[]}
     */
    trainNeuronPerSample(neuron, single_sample, sample_index) {
        let error_gradient = []; // does nothing

        let sample = single_sample;
        let alpha = this.alpha;
        let nb_input = neuron.getNumberOfInput();

        const [ x_ , y_ ] = [sample.input, sample.label];

        if(x_.length != nb_input)
            throw "Invalid sample at index "+sample_index+" : "+JSON.stringify(sample);

        const y = neuron.getOutput(x_);

        for (let k = 0; k <nb_input; k++) {
            /*
            * delta_w[k] = - dError/dw[k] = 2 * (y correct - y guess) * input[k]
            * */
            const delta_w_k = alpha * (y_ - y) * x_[k];;
            neuron.weight[k] += delta_w_k;

            error_gradient.push(delta_w_k);
        }
        /*
        * delta_bias = - dError/dbias = 2 * (y correct - y guess)
        * */
        const delta_bias =  alpha * (y_ - y);
        neuron.bias += delta_bias;
        error_gradient.push(delta_bias);
        return error_gradient;
    }

    /**
     * @param {Neuron} neuron neuron input
     * @param {Object} samples { outputs : [ Array N * N_INPUT ] , labels : [ Array N] } :: configuration object
     * @param {Function} fun function called at each step
     */
    trainNeuron(neuron, samples, fun) {
        let step_left = this.n_steps;
            neuron.initRandomWeight();
        while(step_left > 0) {
            const that = this;
            samples.forEach((sample, index) => {
                that.trainNeuronPerSample(neuron, sample, index);
            });
            ////////
            fun(neuron, (this.n_steps - step_left));
            step_left--;
        }
    }



    /**
     * @param {MLP} mlp neuron input
     * @param {Object} samples { outputs : [ Array N * N_INPUT ] , labels : [ Array N] } :: configuration object
     * @param {Function} fun function called at each step
     */
    trainNetwork(mlp, samples, fun) {
        let step_left = this.n_steps;
        let that = this;
        while(step_left > 0) {
            samples.forEach((sample, index) => {
                that.trainMore(mlp, sample);
            });
            
            ////////
            let output_layer_index = mlp.layers.length - 1;
            let tot_err = 0;
            mlp.errors[output_layer_index].forEach(err => {
                tot_err += err * err;
            });
            tot_err /= mlp.layers.length;

            fun(mlp, (this.n_steps - step_left), tot_err);
            step_left--;
        }
    }

    /**
     * @param {MLP} mlp neuron input
     * @param {Object} samples { outputs : [ Array N * N_INPUT ] , labels : [ Array N] } :: configuration object
     * @param {Function} fun function called at each step
     */
    trainMore(mlp, sample) {
        let error_t = 0; // error for a single example
        let alpha = this.alpha;
        let nb_layers = mlp.layers.length;

        mlp.getOutput(sample.input);
        mlp.computeArrayRepresentations();

        // computes deltas
        for (let qq = 0; qq < nb_layers; qq++) {
            let layer = nb_layers - qq - 1;
            for (let node = 0; node < mlp.layer_structure[layer]; node++) {
                let output = mlp.outputs[layer][node];

                let error = 0;
                if (layer == nb_layers - 1) {
                    error = sample.label[node] - output;
                } else {
                    let deltas = mlp.deltas[layer + 1];
                    for (let k = 0; k < deltas.length; k++) {
                        error += deltas[k] * mlp.weights[layer + 1][k][node];
                    }
                }
                mlp.errors[layer][node] = error;
                mlp.deltas[layer][node] = error * output * (1 - output);
            }
        }

        // computes new weights
        for (let layer = 1; layer <= nb_layers - 1; layer++) {
            let incoming = mlp.outputs[layer - 1];

            for (let node = 0; node < mlp.layer_structure[layer]; node++) {
                let delta = mlp.deltas[layer][node];

                for (let k = 0; k < incoming.length; k++) {
                    let change = mlp.changes[layer][node][k];

                    change = (alpha * delta * incoming[k]) + (alpha/2) * change;

                    mlp.changes[layer][node][k] = change;
                    mlp.weights[layer][node][k] += change;
                }
                mlp.biases[layer][node] += alpha * delta;
            }
        }

        mlp.syncWithArrayRepresentations();
    }
}


/**
 * @param {Number[]} u 
 * @param {Number[]} v 
 */
function matrixProduct(u, v) {

}

/**
 * @param {Number[]} u 
 */
function matrixTranspose(u) {

}