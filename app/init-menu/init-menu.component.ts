import { Component, Input, Output, EventEmitter } from '@angular/core';
import { VoiceRecognitionService } from '../service/web-speech-api.service';


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

	sendBtnStateToSuper() : void{
		this.btnPressed.emit(true);
		
	}
}
