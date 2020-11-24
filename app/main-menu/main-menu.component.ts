import { Component, Input } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})

export class MainMenuComponent{

	//attributes
	@Input() isMainShown : boolean;
    cookieValue: string;

	//methods
	constructor(private cookieService: CookieService){}

    createCookie(){
        var data = (<HTMLInputElement>document.getElementById('name')).value;
        this.cookieService.set(data, '');
        console.log("Cookie created");
    }
}
