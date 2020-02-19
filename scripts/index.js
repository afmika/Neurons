const links = [
    {
        text : "Single neuron training", 
        value : "./single_neuron_training.html"
    },
    {
        text : "Single neuron training + animation", 
        value : "./single_neuron_evolution.html"
    },
    {
        text : "Neural network training", 
        value : "./multilayer_neuron_training.html"
    },
    {
        text : "Neural network training + animation", 
        value : "./multilayer_neuron_evolution.html"
    }
];

links.forEach(link => {
    document.querySelector("#link_list").innerHTML +=
    `<a href="${link.value}">
        <button class="btn btn-primary btn-lg btn-block" type="button">
            ${link.text}
        </button>
        <br/>
    </a>`;
});