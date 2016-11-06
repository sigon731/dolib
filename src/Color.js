export class Color {
	constructor(r, g, b, a = 255) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	get24() {
		return this.r << 16 | this.g << 8 | this.b;
	}

	get32() {  }

	getRgb() {
		return `rgb(${this.r},${this.g},${this.b})`;
	}

	getHsl() {  }

	getRgba() {  }

	getHsla() {  }
}
