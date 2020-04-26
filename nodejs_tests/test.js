const Neuron = require('./classes/Neuron');
const Layer = require('./classes/Layer');
const MLP = require('./classes/MLP');
const TrainingMachine = require('./classes/TrainingMachine');


const step = 1000;
const learning_rate = 0.8;

let Trainer = new TrainingMachine(step, learning_rate);
let mlp = new MLP();
mlp.setConfig({
    layer_structure : [5, 4, 3],
    n_input : 5
});

const samples = [
    {"input" : [1, 1, 1, 1, 1], "label" : [1, 1, 1]},
    {"input" : [0, 1, 1, 1, 1], "label" : [1, 1, 1]},
    {"input" : [0, 0, 1, 1, 1], "label" : [1, 1, 1]},
    {"input" : [0, 0, 0, 1, 1], "label" : [0, 1, 1]},
    {"input" : [0, 0, 0, 0, 1], "label" : [0, 0, 1]},
    {"input" : [0, 0, 0, 0, 1], "label" : [0, 0, 1]},
    {"input" : [1, 0, 0, 0, 0], "label" : [1, 0, 0]},
    {"input" : [1, 1, 0, 0, 0], "label" : [1, 1, 0]},
    {"input" : [1, 1, 1, 1, 0], "label" : [1, 1, 0]}
];

// train
Trainer.trainNetwork(mlp, samples, function(mlp, s, err) {
	if(s % 50 == 0) {
		console.log("Error ", err);
	}
});

// tests
let pass_counter = 0;
samples.forEach(sample => {
	const correct = sample.label;
	const guessed = mlp.getOutput(sample.input);
	let pass_count = 0;
	guessed.forEach((guess, i) => {
		let bool = Math.round(guess) == correct[i];
		pass_count += bool ? 1 : 0;
	});
	const pass = pass_count >= 0.90 * guessed.length;
	pass_counter += pass ? 1 : 0;
	console.log([
		sample.input.join(", "), 
		sample.label.join(", "), 
		// guessed.join(", "), 
		pass ? 'Pass': 'Fail'
	]);
});
