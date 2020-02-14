/**
 * @author afmika
 * @email afmichael73@gmail.com
 * github.com/afmika
 */
 
function roundTo(n, r) {
	n = Math.round(n * Math.pow(10, r));
	return n * Math.pow(10, -r);
}

class DrawingTools {
	constructor(context) {
		if(context) {
			this.context = context;
		} else {
			throw "PLEASE DEFINE A 2D CONTEXT FIRST";
		}
	}
	
	clear(x, y, c_width, c_height) {
		this.context.clearRect(x, y, c_width, c_height);
	}

	setFill(color) {
		this.context.fillStyle = color;
	}
	setOutline(color) {
		this.context.strokeStyle = color;
	}
	setLineWidth(width) {
		this.context.lineWidth = width;
	}


	line(minX, minY, maxX, maxY, stroke, thickness) {
		let context = this.context;

		// x
		context.beginPath();
		context.lineWidth = thickness;
		context.strokeStyle = stroke || "black";
		
		context.moveTo(minX, minY);
		context.lineTo(maxX, maxY);

		context.stroke();
		context.closePath();		
	}

	text(value, x, y) {
		let context = this.context;
		context.beginPath();
		context.lineWidth = 0.6;
		context.strokeStyle = "black";
		context.strokeText(value, x, y);
		context.closePath();
	}

	axis(minX, maxX, minY, maxY, stroke) {

		// x
		this.line(minX, 0, maxX, 0, stroke);

		// y	
		this.line(0, minY, 0, maxY, stroke);	
	}

	circle(centerX, centerY, radius, stroke, fill) {
		let context = this.context;

		context.beginPath();
		context.strokeStyle = stroke || "black";
		
		context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		if( fill ) {
			context.fillStyle = fill;
			context.fill();
		}
		context.stroke();
		context.closePath();		
	}

	/**
	 * @param {Neuron} neuron 
	 * @param {Number} c_width 
	 * @param {Number} c_height 
	 */
	singleNeuron(neuron, c_width, c_height) {
		this.clear(0, 0, c_width, c_height);
		
		let left_offset = c_height / 8;

		let n_input = neuron.getNumberOfInput();
		let region_height = ((c_height - 2*left_offset) / n_input); // allowed region for each input
		let cte = 4;
		let radius = region_height / cte;
		let bias_height =  4 * radius;

		let w = neuron.getWeight();
		let max_w = Math.max.apply(null, w);
		let inputs_coord = [];
		for (let i = 0; i < n_input; i++) {
			let p = {
				x : left_offset,
				y : left_offset + (i + 0.5) * cte * radius 
			};
			inputs_coord.push(p);
		}

		let n = {
			x : 2*radius + c_width / 2,
			y : c_height / 2
		};
		inputs_coord.forEach((p, i) => {
			let rel = w[i] / max_w;
			let lineThickness = Math.abs(5 * Math.exp(rel / 2));
			let color = 55 + Math.round(Math.abs(rel) * 1000 ) % 200;
			color = "rgb(0, "+Math.floor(color/3)+", 0, "+Math.abs(rel)+")";
			this.line(n.x, n.y, p.x, p.y, color, lineThickness);
			this.circle(p.x, p.y, radius, "black", "grey");

			this.text(w[i] + "", p.x + radius * 2, p.y);
		});

		// bias
		let rel = neuron.bias / max_w;
		let lineThickness = Math.abs(5 * Math.exp(rel / 2));
		let color = 55 + Math.round(Math.abs(rel) * 1000 ) % 200;
		color = "rgb(0, "+Math.floor(color/3)+", 0, "+Math.abs(rel)+")";
		this.line(n.x, n.y, n.x, n.y + bias_height, color, lineThickness);
		this.text(neuron.bias + "", n.x + radius, n.y + bias_height);


		this.arrow(n.x, n.y, c_width, c_height/2, "black", 50, 3);
		this.circle(n.x, n.y, radius * 2, "black", "pink");

	}
	/**
	 * @param {MLP} mlp 
	 * @param {Number} c_width 
	 * @param {Number} c_height 
	 */
	multiLayerNeuralNetwork(mlp, c_width, c_height) {
		this.clear(0, 0, c_width, c_height);
		
		let left_offset = c_height / 12;

		let n_input = mlp.n_input;
		let n_layer = mlp.layers.length;


		let region_height = ((c_height - 2*left_offset) / n_input); // allowed region for each input
		let cte = 6;
		let radius = region_height / cte;
		let neuron_start_offset_x = 4*left_offset +  2 * radius;


		// inputs
		let inputs_coord = [];
		for (let i = 0; i < n_input; i++) {
			let p = {
				x : left_offset,
				y : left_offset + (i + 0.5) * cte * radius 
			};
			inputs_coord.push(p);
		}

		let n = {
			x : 2*radius + c_width / 2,
			y : c_height / 2
		};
		inputs_coord.forEach((p, i) => {
			this.circle(p.x, p.y, radius, "black", "grey");
		});

		// neurons
		let neuron_coord = [];
		let that = this;
		mlp.each((layer, l_index) => {
			layer.each((neuron, n_index) => {
				let _offset_y = c_height / 8;
				let _region_height = ((c_height - 2*_offset_y) / layer.getNbOfNeuron()); // allowed region for each input
				let _cte = 6;
				let _radius = _region_height / _cte;
				let _zone_layer = (c_width - neuron_start_offset_x) / n_layer;
				let bias_height = 0.4 * _cte * _radius;

				let p = {
					x : neuron_start_offset_x + l_index * _zone_layer,
					y : _offset_y + (n_index + 0.5) * _cte * _radius
				};

				that.circle(p.x, p.y, _radius, "black", "grey");

				let rel = neuron.bias;
				let lineThickness = Math.abs(5 * Math.exp(rel / 2));
				let color = 55 + Math.round(Math.abs(rel) * 1000 ) % 200;
				color = "rgb(0, "+Math.floor(color/3)+", 0, "+Math.abs(rel)+", 0.8)";
				this.line(p.x, p.y, p.x, p.y + bias_height, color, lineThickness);
				this.text(roundTo(neuron.bias, 3) + "", p.x + 10, p.y + bias_height);
			});
		});

		/*
		// bias
		


		this.arrow(n.x, n.y, c_width, c_height/2, "black", 50, 3);
		this.circle(n.x, n.y, radius * 2, "black", "pink");
		*/
	}

	phasor(phasor, time, stroke) {
		// we start at 0, 0 and translate the context instead
		let context = this.context;
		let radius = phasor.getAmplitude();
		this.circle(0, 0, radius, stroke);

		let z = phasor.at(time);

		let arrow_length = 20;
		this.arrow(0, 0, z.getRe(), z.getIm(), stroke, arrow_length);
	}

	point( vec , color ) {
		let x = vec.getX(), y = vec.getY();
		let context = this.context;

		context.beginPath();
		context.fillStyle = color || "red";
		context.arc(x, y, 2, 0, 2 * Math.PI, false);
		context.fill();
		context.closePath();
	}
	
	
	arrow(minX, minY, maxX, maxY, stroke, arrow_length, line_width){
		let context = this.context;

		let angle = Math.atan2(maxY - minY, maxX - minX);
		let x, y;
		let length = arrow_length != undefined ? arrow_length : 7;
				
		// head
		context.beginPath();
		
		context.lineWidth = 0.5 || line_width;
		
		context.strokeStyle = stroke || "black";
		context.moveTo(minX, minY);
		context.lineTo(maxX, maxY);
		context.lineTo(maxX - length * Math.cos(angle - Math.PI / 7), maxY - length * Math.sin(angle - Math.PI / 7));
		context.moveTo(maxX, maxY);
		context.lineTo(maxX - length * Math.cos(angle + Math.PI / 7), maxY - length * Math.sin(angle + Math.PI / 7));

		context.stroke();
		context.closePath();
		
		// line
		context.beginPath();
		context.strokeStyle = stroke || "black";
		context.lineWidth = 0.5 || line_width;
		context.moveTo(minX, minY);
		context.lineTo(maxX, maxY);

		context.stroke();
		context.closePath();
		
	}
}