import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { PageCenterComponent } from '../page-center/page-center.component';


@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})

export class MainMenuComponent implements AfterViewInit{

	//init-menu button
	@Input() isMainShown : boolean;

  //page-center search bar
  @ViewChild(PageCenterComponent) page_center: PageCenterComponent;

  //json server
  data: string;
  baseURL: string = "http://localhost:3000/research/1";



	//methods
	constructor(private http: HttpClient){}

  ngAfterViewInit(){}



  //utilities
  delay(delay: number): void{
    var startDate = Date.now();
    while( Date.now() < startDate+delay);
  }



  //send research query
  sendData(){
    this.setJSON().subscribe(data => {});

    //little delay in order to let Googlooper
    //search on the Internet and write the result
    //inside result.json
    console.log("start wait...");
    this.delay(1500);
    console.log("end wait.");

    //get result data
    this.readData();
  }

  public setJSON(): Observable<any>{
    return this.http.put(
      this.baseURL,
      "{\"name\":\"|" + this.page_center.research + "|\"}",
      {'headers': {'content-type':'application/json'}}
    );
  }



  //get research result
  readData(){
    this.getJSON().subscribe(data => {
      console.log(JSON.parse(data));
    });
  }

  public getJSON(): Observable<any>{
    return this.http.get('../../assets/result.json', {responseType: 'text'});
  }
}
