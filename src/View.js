import * as Action from "./Action";

import { Camera } from "./Camera";

import { Canvas } from "./Canvas";

import { Color } from "./Color";

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

		this.input = {
			left: false,
			middle: false,
			right: false,
			track: []
		};

		this.listener = e => {
			switch (e.type) {
			case "mousedown":
				if(e.target === this.canvas){
					switch(e.button){
					case 0:
						this.input.left = true;

						this.input.track.push({
							x: e.layerX / this.camera.zoom,
							y: e.layerY / this.camera.zoom
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
						this.input.track.push({
							x: e.layerX / this.camera.zoom,
							y: e.layerY / this.camera.zoom
						});
					}
				}
				break;
			case "mouseup":
				switch(e.button){
				case 0:
					this.input.left = false;

					modifier.dispatch({
						type: Action.DRAW,
						pois: this.input.track,
						color: {
							r: 0xF2,
							g: 0x53,
							b: 0x1E
						}
					});

					this.input.track = [];
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
		};

		for(let type of events){
			window.addEventListener(type, this.listener);
		}
	}
	dispatch(action){
		console.log(action);

		switch(action.type){
			case Action.CREATE_CANVAS:
				this.buffer = new Canvas(action.width, action.height);

				this.flush();
				break;
			case Action.POI:
				this.buffer.setPixel(action.x, action.y, action.color);

				this.context.fillStyle = new Color(action.color).getRgba();
				this.context.fillRect((action.x | 0) * this.camera.zoom, (action.y | 0) * this.camera.zoom, this.camera.zoom, this.camera.zoom);
				break;
			case Action.DRAW:
				this.context.fillStyle = new Color(action.color).getRgba();

				console.log("5", action.pois);

				if(action.pois.length > 0){
					action.pois.reduce((last, poi) => {
						this.draw(last, poi, (x, y) => {
							this.buffer.setPixel(x, y, action.color);

							this.context.fillRect(x * this.camera.zoom, y * this.camera.zoom, this.camera.zoom, this.camera.zoom);
						});

						return poi;
					});
				}
				break;
		}
	}
	draw(last, poi, next){
		last.x = last.x | 0;
		last.y = last.y | 0;
		poi.x = poi.x | 0;
		poi.y = poi.y | 0;

		const dx = Math.abs(last.x - poi.x);
		const dy = Math.abs(last.y - poi.y);

		const sx = poi.x >= last.x ? 1 : -1;
		const sy = poi.y >= last.y ? 1 : -1;

		const slope = dy / dx || 0;

		console.log("3", last, poi, dx, dy, slope);

		if(dx > dy){
			for(let i = 0; i < dx; i ++){
				const x = last.x + sx * i;
				const y = last.y + sy * i * slope | 0;

				next(x, y);
			}
		} else {
			for(let i = 0; i < dy; i ++){
				const x = last.x + sx * i / slope | 0;
				const y = last.y + sy * i;

				next(x, y);
			}
		}
	}
	flush(init = "#453f3f"){
		this.context.fillStyle = init;
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		if(this.buffer){
			for(let i = 0; i < this.buffer.width; i ++){
				for(let j = 0; j < this.buffer.height; j ++){
					this.context.fillStyle = this.buffer.getUnsafePixel(i, j).getRgba();

					this.context.fillRect(i * this.camera.zoom, j * this.camera.zoom, this.camera.zoom, this.camera.zoom);
				}
			}
		}
	}
}
