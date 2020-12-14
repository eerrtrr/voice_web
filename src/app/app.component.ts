import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{

	//attributes
	initHidden : boolean = false;
	initBtnState : boolean = false;

	//methods
	constructor(){}

	updateInitBtnState(state : boolean){
		this.initBtnState = state;
		console.log("Init button pressed !");

		this.initHidden = true;
	}
}
