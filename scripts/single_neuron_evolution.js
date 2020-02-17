/**
 * @author afmika
 * @email afmichael73@gmail.com
 * https://github.com/afmika
 */


const canvas = document.getElementById("canvas");
const graph = document.getElementById("graph");
const ctx = canvas.getContext('2d');
const ctx_graph = graph.getContext('2d');
const Draw = new DrawingTools(ctx);
const DrawGraph = new DrawingTools(ctx_graph);

const width = canvas.width;
const height = canvas.height;

const evolution_time = 60; //ms
const step = 250;
const learning_rate = 0.8;
const nb_input = 5;

let avg_grad_errors = [];
let max_error = -Infinity;

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

function drawGradientErrorCurve() {
    if(avg_grad_errors.length > 0) {
        let dt = graph.width / avg_grad_errors.length;
        DrawGraph.clear(0, 0, graph.width, graph.height);
        let xs = 0, ys = 0;
        for (let index = 0; index < avg_grad_errors.length; index++) {
            const dE = avg_grad_errors[index];
            let x = index * dt;
            let hy = Math.exp(dE * 5);
            max_error = Math.max(hy, max_error);
            let y = graph.height - graph.height * (hy / max_error);
            DrawGraph.line(x, graph.height, x, y, "red");
            if(index == 0) {
                xs = x;
                ys = y;
            } else {
                DrawGraph.line(xs, ys, x, y, "red", 1);
                xs = x;
                ys = y;            
            }
        }
    }
}

function startTraining() {
    let step_left = step;
    let interval = setInterval(function() {
        if(step_left > 0) {
            let average_grad_error = 0;
            samples.forEach((sample, index) => {
                let sq_err = 0;
                let error_gradient = Trainer.trainNeuronPerSample(neuron, sample, index);
                error_gradient.forEach(e => {
                    sq_err += e * e;
                });

                average_grad_error += sq_err;
            });

            average_grad_error = average_grad_error / samples.length;
            avg_grad_errors.push(average_grad_error);

            drawGradientErrorCurve();
            Draw.singleNeuron(neuron, width, height);
            Draw.text((step - step_left) + " STEPS", 20, 20);
            DrawGraph.text("AVG ERROR GRADIENT : "+ average_grad_error, 200, 20);

        } else {
            clearInterval(interval);
            runTest();
        }
        step_left--;
    }, evolution_time);
}

try {
    startTraining();
} catch(e) {
    alert("Oups! " +e)
}