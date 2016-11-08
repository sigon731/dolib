import { Color } from "./Color";

export class Canvas {
	constructor(width, height) {
		const data = new Uint8ClampedArray(width * height * 4);

		data.fill(0xFF);

		this.width = width;
		this.height = height;
		this.data = data;
	}

	setPixel(x, y, color) {
		return this.setUnsafePixel(
			(x <= 0 ? 0 : (x < this.width ? x : this.width)),
			(y <= 0 ? 0 : (y < this.height ? y : this.height)),
			color
		);
	}

	setUnsafePixel(x, y, color) {
		const index = (y * this.width + x) * 4;

		this.data[index + 0] = color.r;
		this.data[index + 1] = color.g;
		this.data[index + 2] = color.b;
		this.data[index + 3] = color.a || 0xFF;
	}

	getPixel(x, y) {
		return this.getUnsafePixel(
			(x <= 0 ? 0 : (x < this.width ? x : this.width)),
			(y <= 0 ? 0 : (y < this.height ? y : this.height))
		);
	}

	getUnsafePixel(x, y) {
		const index = (y * this.width + x) * 4;

		return new Color(
			this.data[index + 0],
			this.data[index + 1],
			this.data[index + 2],
			this.data[index + 3]
		);
	}
	getIndex(x, y){
		return ((y <= 0 ? 0 : (y < this.height ? y : this.height)) * this.width + (x <= 0 ? 0 : (x < this.width ? x : this.width))) * 4;
	}
}
