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

const evolution_time = 40; //ms
const step = 100;
const learning_rate = 0.8;
let avg_data_errors = [];
let max_error = -Infinity;
let max_array = 2000;

let Trainer = new TrainingMachine(step, learning_rate);
let mlp = new MLP();
mlp.setConfig({
    layer_structure : [5, 4],
    n_input : 8
});

/*
	XOR problem
	1- xor(1010, 1111) = 0101
	2- xor(0110, 0110) = 0000
	3- xor(1001, 1000) = 0001
	4- xor(1101, 0011) = 1110
	5- xor(1101, 0011) = 1110
	6- xor(1111, 1010) = 0101
	... etc
*/

const samples = [
	{"input": [1,0,1,0,1,1,1,1], "label": [0,1,0,1]},
	{"input": [0,1,1,0,0,1,1,0], "label": [0,0,0,0]},
	{"input": [1,0,0,1,1,0,0,0], "label": [0,0,0,1]},
	{"input": [1,1,0,1,0,0,1,1], "label": [1,1,1,0]},
	{"input": [1,1,0,1,0,0,1,1], "label": [1,1,1,0]},
	{"input": [1,1,1,1,1,0,1,0], "label": [0,1,0,1]}
];

$("#result").hide();
$("#nb_step").text("Steps "+step);
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

function drawGradientErrorCurve() {
    if(avg_data_errors.length > 0) {
        let dt = graph.width / avg_data_errors.length;
        DrawGraph.clear(0, 0, graph.width, graph.height);
        let xs = 0, ys = 0;
        for (let index = 0; index < avg_data_errors.length; index++) {
            const dE = avg_data_errors[index];
            let x = index * dt;
            let hy = dE;
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

function runTest() {
    // test
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
        logs([sample.input.join(", "), sample.label.join(", "), guessed.join(", "), pass ? `<b class="text text-primary">Pass</b>` : `<b class="text text-danger">Fail</b>`]);
    });

    Draw.multiLayerNeuralNetwork(mlp, width, height);
    let rate = Math.floor(100 * pass_counter / samples.length);
    logs(["", "", "Success  ", pass_counter+ " / "+ samples.length + " ("+rate+"%)"]);
}

function startTraining() {
    let step_left = step;
    let interval = setInterval(function() {
        Draw.clear(0, 0, )
        if(step_left > 0) {
            let total_avg = 0;
            samples.forEach((sample, index) => {
                Trainer.trainNetworkPerSample(mlp, sample, index);
                total_avg += mlp.avg_error();
            });

            let curr_avg_data_error = total_avg / samples.length;
            avg_data_errors.push(curr_avg_data_error);
            if(avg_data_errors.length >= max_array) {
                avg_data_errors = avg_data_errors.filter((q, i) => {
                    return i % 9 != 0 || i == 0 || i + 1 == avg_data_errors.length
                });
            }

            drawGradientErrorCurve();
            Draw.multiLayerNeuralNetwork(mlp, width, height);
            Draw.text((step - step_left) + " STEPS", 20, 20);
            DrawGraph.text("AVG DATA SET ERROR : "+ curr_avg_data_error, 200, 20);

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