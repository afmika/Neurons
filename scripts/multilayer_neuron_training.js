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

const step = 2000;
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
    Trainer.trainNetwork(mlp, samples, function(mlp, s, err) {
        if(s % 500 == 0) {
            console.log("Error ", err);
        }
    });
}

try {
    startTraining();
    runTest();
} catch(e) {
    alert("Oups! " +e)
}