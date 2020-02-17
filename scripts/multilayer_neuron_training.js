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

const evolution_time = 100; //ms
const step = 200;
const learning_rate = 0.8;
const nb_input = 5;

let Trainer = new TrainingMachine(step, learning_rate);
let mlp = new MLP();
mlp.setConfig({
    layer_structure : [2, 4, 2],
    n_input : 5
});

const samples = [
    {"input":[0,0,0,0,1],"label":[0, 1] },
    {"input":[0,0,0,1,0],"label":[1, 0]},
    {"input":[1,0,0,1,1],"label":[1, 1]},
    {"input":[0,0,1,0,0],"label":[0, 0]},
    {"input":[1,0,1,0,1],"label":[1, 1]}
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
}

function startTraining() {
    Draw.multiLayerNeuralNetwork(mlp, width, height);
    Trainer.trainNetwork(mlp, samples, function(mlp, step) {
        if(step + 1 == 100) {
            console.log("step ", step);

        }

    });
}

try {
     startTraining();
} catch(e) {
    alert("Oups! " +e)
}