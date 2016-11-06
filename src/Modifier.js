import { Canvas } from "./Canvas";

import * as Action from "./Action";

export class Modifier {
	constructor(){
		this.canvas = null;

		this.listeners = [];
	}
	subscribe(listener){
		this.listeners.push(listener);
	}
	dispatch(action){
		for(let listener of this.listeners){
			listener(action);
		}
	}
}
