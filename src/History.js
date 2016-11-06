export class History {
	constructor(){
		this.actions = [];
	}
	set(action){
		this.actions.push(action);
	}
	get(id, count){
		return [
			...this.actions
		];
	}
}
