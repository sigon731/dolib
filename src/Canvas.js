import { Color } from "./Color";

const props = new WeakMap();

export class Canvas {
	constructor(width, height) {
		const data = new Uint8ClampedArray(width * height * 4);

		data.fill(0xFF);

		props.set(this, {
			width,
			height,
			data
		});
	}

	setPixel(x, y, color) {
		const { width, height } = props.get(this);

		return this.setUnsafePixel(
			(x <= 0 ? 0 : (x < width ? x : width)),
			(y <= 0 ? 0 : (y < height ? y : height)),
			color
		);
	}

	setUnsafePixel(x, y, color) {
		const { data, width } = props.get(this);

		const index = (y * width + x) * 4;

		data[index + 0] = color.r;
		data[index + 1] = color.g;
		data[index + 2] = color.b;
		data[index + 3] = color.a;
	}

	getPixel(x, y) {
		const { width, height } = props.get(this);

		return this.getUnsafePixel(
			(x <= 0 ? 0 : (x < width ? x : width)),
			(y <= 0 ? 0 : (y < height ? y : height))
		);
	}

	getUnsafePixel(x, y) {
		const { data, width } = props.get(this);

		const index = (y * width + x) * 4;

		return new Color(
			data[index + 0],
			data[index + 1],
			data[index + 2],
			data[index + 3]
		);
	}

	get width(){
		return props.get(this).width;
	}

	get height(){
		return props.get(this).height;
	}
}

export const getIndexByLocation = (x, y, width, height) => ((y <= 0 ? 0 : (y < height ? y : height)) * width + (x <= 0 ? 0 : (x < width ? x : width))) * 4;
