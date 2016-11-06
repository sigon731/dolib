import { Vec2 } from "./Vec2";

export class Camera {
	constructor(width, height){
		this.pos = new Vec2();

		this.resolution = new Vec2(width, height);

		this.zoom = 1;
	}
}
