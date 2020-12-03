import { Component, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})

export class MainMenuComponent{

	//attributes
	@Input() isMainShown : boolean;
  data: string;
  baseURL: string = "http://localhost:3000/search";


	//methods
	constructor(private http: HttpClient){}

  sendData(){
    this.setJSON().subscribe(data => {console.log(data);});
  }

  public setJSON(): Observable<any>{
    var headers = {'content-type':'application/json'};
    var temp = (<HTMLInputElement>document.getElementById("name")).value;
    const temp_json = JSON.stringify({name:temp});
    console.log(temp_json);
    return this.http.post(this.baseURL,temp_json,{'headers':headers});
  }



  readData(){
    this.getJSON().subscribe(data => {console.log(data);});
  }

  public getJSON(): Observable<any>{
    return this.http.get('../../assets/data.txt', {responseType: 'text'});
  }
}
