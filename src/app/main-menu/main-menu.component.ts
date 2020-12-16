import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { PageCenterComponent } from '../page-center/page-center.component';
import { VoiceRecognitionService } from '../service/web-speech-api.service';


@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css'],
  providers: [VoiceRecognitionService]
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
  constructor(private http: HttpClient, public voiceRecognizer : VoiceRecognitionService){ 
    this.voiceRecognizer.init();
    this.voiceRecognizer.start();
   }

  ngAfterViewInit(){}



  //main loop
  private mainLoop = setInterval(
    () => {
      //check service
      console.log("sentence[" + this.voiceRecognizer.sentence + "]");
    }, 10
  );



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
    //(minimum 1500ms to have the correct response)
    this.delay(1750);

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
      if(data != ""){
        this.page_center.updateResults(data);
      }else{

        //json reading timed dout
        console.log("Unable to get data in time.");
        this.delay(1000);

        //relaunch reading request
        this.getJSON().subscribe(data => {
          if(data != ""){
            this.page_center.updateResults(data);
          }

          //no timeout relaunch
        });

      }
    });
  }

  public getJSON(): Observable<any>{
    return this.http.get(
      '../../assets/result.json',
      {responseType: 'text'}
    );
  }
}
