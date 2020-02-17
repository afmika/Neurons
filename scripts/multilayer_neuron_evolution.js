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

const evolution_time = 50; //ms
const step = 1200;
const learning_rate = 0.8;
let avg_grad_errors = [];
let max_error = -Infinity;
let max_array = 150;

let Trainer = new TrainingMachine(step, learning_rate);
let mlp = new MLP();
mlp.setConfig({
    layer_structure : [4, 5, 3],
    n_input : 5
});

const samples = [
    {"input":[1, 1, 1, 1, 1],"label":[1, 1, 1]},
    {"input":[0, 1, 1, 1, 1],"label":[1, 1, 1]},
    {"input":[0, 0, 1, 1, 1],"label":[1, 1, 1]},
    {"input":[0, 0, 0, 1, 1],"label":[0, 1, 1]},
    {"input":[0, 0, 0, 0, 1],"label":[0, 0, 1]},
    {"input":[0, 0, 0, 0, 1],"label":[0, 0, 1]},
    {"input":[1, 0, 0, 0, 0],"label":[1, 0, 0]},
    {"input":[1, 1, 0, 0, 0],"label":[1, 1, 0]},
    {"input":[1, 1, 1, 1, 0],"label":[1, 1, 0]}
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

function drawGradientErrorCurve() {
    if(avg_grad_errors.length > 0) {
        let dt = graph.width / avg_grad_errors.length;
        DrawGraph.clear(0, 0, graph.width, graph.height);
        let xs = 0, ys = 0;
        for (let index = 0; index < avg_grad_errors.length; index++) {
            const dE = avg_grad_errors[index];
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
                let euclidean_dist_gradError = 0;
                Trainer.trainNetworkPerSample(mlp, sample, index);

                total_avg += mlp.avg_error();
            });

            average_grad_error = total_avg / samples.length;
            avg_grad_errors.push(average_grad_error);
            if(avg_grad_errors.length >= max_array) {
                avg_grad_errors = avg_grad_errors.filter((q, i) => {
                    return i % 9 != 0 || i == 0 || i + 1 == avg_grad_errors.length
                });
            }

            drawGradientErrorCurve();
            Draw.multiLayerNeuralNetwork(mlp, width, height);
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