export class Color {
	constructor(r, g, b, a = 0xFF) {
		if(typeof r === "object"){
			if(r.hasOwnProperty("r") && r.hasOwnProperty("g") && r.hasOwnProperty("b")){
				this.r = r.r;
				this.g = r.g;
				this.b = r.b;
				this.a = r.a || 0xFF;
			} else {
				// ?
			}
		} else {
			this.r = r;
			this.g = g;
			this.b = b;
			this.a = a;
		}
	}

	get24() {
		return this.r << 16 | this.g << 8 | this.b;
	}

	get32() {  }

	getRgb() {
		return `rgb(${this.r},${this.g},${this.b})`;
	}

	getHsl() {  }

	getRgba() {
		return `rgba(${this.r},${this.g},${this.b},${this.a / 0xFF})`;
	}

	getHsla() {  }
}
