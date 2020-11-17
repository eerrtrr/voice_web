import { Component, Input } from '@angular/core';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})

export class MainMenuComponent{

	//attributes
	@Input() isMainShown : boolean;

	//methods
	constructor(){}
}
