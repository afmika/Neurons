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

        neuron.setInput(x_);
        const y = neuron.getOutput();

        for (let k = 0; k <nb_input; k++) {
            /*
            * delta_w[k] = dError/dw[k] = alpha * (y correct - y guess) * input[k]
            * */
            const delta_w_k = alpha * (y_ - y) * x_[k];;
            neuron.weight[k] += delta_w_k;

            error_gradient.push(delta_w_k);
        }
        /*
        * delta_bias = dError/dbias = alpha * (y correct - y guess)
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
     * @param {Network} newtwork neural network input
     * @param {Function} fun function called at each step :)
     */
    trainNetwork(newtwork, fun) {

    }
}