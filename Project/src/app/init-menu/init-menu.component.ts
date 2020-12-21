import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'init-menu',
  templateUrl: './init-menu.component.html',
  styleUrls: ['./init-menu.component.css']
})

export class InitMenuComponent{

	//attributes
	@Input() isInitHidden : boolean;
	@Output() btnPressed = new EventEmitter<boolean>();

	//methods
	constructor(){}

	goToMainMenu(): void{
		this.btnPressed.emit(true);
	}
}
