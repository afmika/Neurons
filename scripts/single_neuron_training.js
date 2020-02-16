/**
 * @author afmika
 * @email afmichael73@gmail.com
 * https://github.com/afmika
 */


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const Draw = new DrawingTools(ctx);

const width = canvas.width;
const height = canvas.height;

const step = 1000;
const learning_rate = 0.8;
const nb_input = 5;
let Trainer = new TrainingMachine(step, learning_rate);
let neuron = new Neuron(nb_input);

const samples = [
    {"input":[0,0,0,0,1],"label":0},
    {"input":[0,0,0,1,0],"label":1},
    {"input":[0,0,0,1,1],"label":1},
    {"input":[0,0,1,0,0],"label":0},
    {"input":[0,0,1,0,1],"label":1},
    {"input":[0,0,1,1,0],"label":0},
    {"input":[0,0,1,1,1],"label":1},
    {"input":[0,1,0,0,0],"label":0},
    {"input":[0,1,0,0,1],"label":0},
    {"input":[0,1,0,1,0],"label":0},
    {"input":[0,1,0,1,1],"label":1},
    {"input":[0,1,1,0,0],"label":0},
    {"input":[0,1,1,0,1],"label":1},
    {"input":[0,1,1,1,0],"label":0},
    {"input":[0,1,1,1,1],"label":0},
    {"input":[1,0,0,0,0],"label":0},
    {"input":[1,0,0,0,1],"label":1},
    {"input":[1,0,0,1,0],"label":0},
    {"input":[1,0,0,1,1],"label":1},
    {"input":[1,0,1,0,0],"label":0},
    {"input":[1,0,1,0,1],"label":0},
    {"input":[1,0,1,1,0],"label":0},
    {"input":[1,0,1,1,1],"label":1},
    {"input":[1,1,0,0,0],"label":0},
    {"input":[1,1,0,0,1],"label":0}
];
/*
const samples = [
    {input: [1, 1, 1], label : 1},
    {input: [1, 1, 0], label : 0},
    {input: [1, 0, 0], label : 1},
    {input: [0, 0, 0], label : 0},

    {input: [0, 0, 1], label : 1},
    {input: [0, 1, 1], label : 0},
    {input: [0, 1, 0], label : 1},
    {input: [0, 0, 0], label : 0}
];
*/
$("#result").hide();
function logs(obj) {
    $("#result").show();
    $("#waiting").hide();
    document.querySelector("#result").innerHTML += 
    `<tr>
        <td> ${obj[0]} </td>
        <td> ${obj[1]} </td>
        <td> ${obj[2]} </td>
        <td> ${obj[3]} </td>
    </tr>`;
}

function runTest() {
    // test
    let pass_counter = 0;
    samples.forEach(sample => {
        const correct = sample.label;
        const guessed = neuron.getOutput(sample.input);
        const pass = Math.round(guessed) == correct;
        pass_counter += pass ? 1 : 0;
        logs([sample.input.join(", "), sample.label, guessed, pass ? `<b class="text text-primary">Pass</b>` : `<b class="text text-danger">Fail</b>`]);
    });
    Draw.singleNeuron(neuron, width, height);
    let rate = Math.floor(100 * pass_counter / samples.length);
    logs(["", "", "Success  ", pass_counter+ " / "+ samples.length + " ("+rate+"%)"]);
}

function startTraining() {

    Trainer.trainNeuron(neuron, samples, function(neuron, step) {
        if((step + 1) % 100 == 0) {
            console.log(step, neuron.getWeight(), `bias ${neuron.bias}`);
        }
    });

    // test
    runTest();
}

startTraining();