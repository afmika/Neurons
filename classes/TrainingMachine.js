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
        while(step_left > 0) {
            this.trainMore(mlp, samples);
            ////////
            fun(mlp, (this.n_steps - step_left));
            step_left--;
        }
    }

    /**
     * @param {MLP} mlp neuron input
     * @param {Object} samples { outputs : [ Array N * N_INPUT ] , labels : [ Array N] } :: configuration object
     * @param {Function} fun function called at each step
     */
    trainMore(mlp, samples) {
        let avg_error = 0;
        let alpha = this.alpha;
        let nb_layers = mlp.layers.length;
        for (let qq = 0; qq < nb_layers; qq++) {

            let l_index = nb_layers - qq - 1;
            mlp.layers[l_index].each((neuron, j) => {
                let neuron_bias_delta = 0;
                for (let i = 0; i < neuron.weight.length; i++) {
                    let neuron_weight_delta = 0;
                    if(l_index == nb_layers - 1) {
                        samples.forEach((sample, index) => {
                            let output = mlp.getOutput(sample.input);
                            let error = (sample.label[j] - output[j]);
                            let derivative = neuron.getDerivativeOutput(neuron.get('input'));
                            let temp =  mlp.layers[l_index - 1].neurons[i];
                            let yi = temp.getOutput(temp.get('input'));
                            let delta = error * derivative;

                            neuron_weight_delta +=  delta * yi;
                            neuron_bias_delta += delta;

                            neuron.set("delta", delta);
                        });
                        neuron_weight_delta *= alpha / samples.length;
                        neuron_bias_delta *= alpha / samples.length;
                    } else if(l_index - 1 >= 0) {
                        //samples.forEach((sample, index) => {
                            let sumDeltas = 0;
                            mlp.layers[l_index + 1].each((neuron_k, k) => {
                                sumDeltas += neuron_k.get("delta") * neuron_k.weight[j];
                            });

                            let derivative = neuron.getDerivativeOutput(neuron.get('input'));
                            let temp =  mlp.layers[l_index - 1].neurons[i];
                            let yi = temp.getOutput(temp.get('input'));
                            let delta = sumDeltas * derivative;

                            neuron_weight_delta +=  delta * yi;
                            neuron_bias_delta += delta;

                            neuron.set("delta", delta);
                        //});
                        neuron_weight_delta *= alpha /*/ samples.length*/;
                        neuron_bias_delta *= alpha /*/ samples.length*/;
                    }
                    neuron.weight[i] += neuron_weight_delta;
                }
                neuron.bias += neuron_bias_delta;
            });
        }
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