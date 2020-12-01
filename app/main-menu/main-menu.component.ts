import { Component, Input } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
//import SampleJson from '../../cookies/data.json';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})

export class MainMenuComponent{

	//attributes
	@Input() isMainShown : boolean;
  cookieValue: string;
  data: string;
	//methods
	constructor(private cookieService: CookieService, private http: HttpClient){}

  createCookie(){
      var data = (<HTMLInputElement>document.getElementById('name')).value;
      this.cookieService.set(data, '');
      console.log("Cookie created");
  }


  readAnswer(){
    this.getJSON().subscribe(data => {console.log(data);})
  }

  public getJSON(): Observable<any>{
    return this.http.get('../../assets/data.txt', {responseType: 'text'});
  }

}
