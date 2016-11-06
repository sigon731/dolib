import * as Action from "./Action";

import { Camera } from "./Camera";

import { getIndexByLocation } from "./Canvas";

const listeners = new WeakMap();

const events = [
	"mousedown",
	"mouseup",
	"mousemove",
	"wheel"
];

export class View {
	constructor(canvas){
		this.canvas = canvas;

		this.context = canvas.getContext("2d");

		this.context.imageSmoothingEnabled = false;

		this.camera = new Camera(this.canvas.width, this.canvas.height);

		this.buffer = null;

		this.input = {};

		listeners.set(this, e => {
			console.log(e.button);
			switch (e.type) {
			case "mousedown":
				if(e.target === this.canvas){
					switch(e.button){
					case 0:
						this.input.left = true;

						modifier.dispatch({
							type: Action.POI,
							x: e.layerX / this.camera.zoom,
							y: e.layerY / this.camera.zoom,
							r: 0x1E,
							g: 0X62,
							b: 0xF2
						});
						break;
					case 1:
						this.input.middle = true;
						break;
					case 2:
						this.input.right = true;
						break;
					}
				}
				break;
			case "mousemove":
				if(this.input.left){
					if(e.target === this.canvas){
						modifier.dispatch({
							type: Action.POI,
							x: e.layerX / this.camera.zoom,
							y: e.layerY / this.camera.zoom,
							r: 0xF2,
							g: 0X62,
							b: 0x1E
						});
					}
				}
				break;
			case "mouseup":
				switch(e.button){
				case 0:
					this.input.left = false;
					break;
				case 1:
					this.input.middle = false;
					break;
				case 2:
					this.input.right = false;
					break;
				}
				break;
			case "wheel":
				if(e.target === this.canvas){
					this.camera.zoom += (n => n < 0 ? -1 : (n > 0 ? 1 : n))(-e.deltaY);
					this.flush();
				}
				break;
			}
		});

		const listener = listeners.get(this);

		for(let type of events){
			window.addEventListener(type, listener);
		}
	}
	dispatch(action){
		console.log(action);

		switch(action.type){
			case Action.CREATE_CANVAS:
				this.buffer = this.context.createImageData(action.width, action.height);
				this.buffer.data.fill(0xFF);

				this.context.fillStyle = "#FFF";
				this.context.fillRect(0, 0, action.width * this.camera.zoom, action.height * this.camera.zoom);
				break;
			case Action.POI:
				const index = getIndexByLocation(action.x | 0, action.y | 0, this.buffer.width, this.buffer.height);

				this.buffer.data[index + 0] = action.r;
				this.buffer.data[index + 1] = action.g;
				this.buffer.data[index + 2] = action.b;
				this.buffer.data[index + 3] = action.a || 0xFF;

				this.context.fillStyle = `rgba(${ action.r }, ${ action.g }, ${ action.b }, ${ action.a / 0xFF || 1 })`;
				console.log(`rgba(${ action.r }, ${ action.g }, ${ action.b }, ${ action.a / 0xFF || 1 })`);
				this.context.fillRect((action.x | 0) * this.camera.zoom, (action.y | 0) * this.camera.zoom, this.camera.zoom, this.camera.zoom);
				break;
		}
	}
	flush(init = "#453f3f"){
		this.context.fillStyle = init;
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		if(this.buffer){
			this.context.fillStyle = "#FFF";
			this.context.fillRect(0, 0, this.buffer.width * this.camera.zoom, this.buffer.height * this.camera.zoom);
			for(let i = 0; i < this.buffer.data.length; i += 4){
				const x = (i / 4 | 0) % this.buffer.width;
				const y = (i / 4 | 0) / this.buffer.width | 0;

				this.context.fillStyle = `rgba(
					${this.buffer.data[i + 0]},
					${this.buffer.data[i + 1]},
					${this.buffer.data[i + 2]},
					${this.buffer.data[i + 3]}
				)`;

				this.context.fillRect(x * this.camera.zoom, y * this.camera.zoom, this.camera.zoom, this.camera.zoom);
			}
		}
	}
}
