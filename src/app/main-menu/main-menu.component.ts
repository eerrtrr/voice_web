import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { PageCenterComponent } from '../page-center/page-center.component';
import { VoiceRecognitionService } from '../service/web-speech-api.service';
import { VoiceSynthetizerService } from '../service/web-speech-api.service';



@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css'],
  providers: [VoiceRecognitionService, VoiceSynthetizerService]
})

export class MainMenuComponent implements AfterViewInit{

	//init-menu button
	@Input() isMainShown : boolean;

  //page-center search bar
  @ViewChild(PageCenterComponent) page_center: PageCenterComponent;

  //json server
  data: string;
  baseURL: string = "http://localhost:3000/research/1";

  //Jarvis
  private JarvisText;
  private pause: boolean = true;



	//methods
  constructor(
    private http: HttpClient,
    public voiceRecognizer: VoiceRecognitionService,
    public voiceSynthetizer: VoiceSynthetizerService
  ){ 
    this.voiceRecognizer.init();
    this.voiceRecognizer.start();

    this.voiceSynthetizer.initSynthesis();
   }

  ngAfterViewInit(){
    this.JarvisText = document.querySelector("#JarvisText");
  }



  neutralSentence(str: string): string{
    var accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
             /[\307]/g,      /[\347]/g  // C, c
    ];
    var noaccent = ['A','a','E','e','I','i','O','o','U','u','C','c'];

    for(var i = 0; i < accent.length; i++){
        str = str.replace(accent[i], noaccent[i]);
    }

    return str;
  }



  //main loop
  private mainLoop = setInterval(
    () => {
      //check service
      this.analyseCommand(this.voiceRecognizer.finalSentence);
    }, 10
  );



  //Jarvis speech
  speak(text: string): void{
    this.JarvisText.innerHTML = text;
  }



  //commands
  analyseCommand(text : string){

    //if in pause
    if(this.pause){

      //resume pause
      if(text.includes("Jarvis")){
        this.pause = false;
        this.speak("Jarvis > Oui Monsieur, je suis à vous.");
        this.voiceSynthetizer.speak("Oui Monsieur, je suis à vous.");
      }
    }

    //other commands
    else{
      //command help
      if(text.includes("aide")){
        this.speak(
          "Jarvis > Voici la liste des commandes disponibles Monsieur :\n" +
          " - aide                      : Affiche la liste des commandes disponibles.\n" +
          " - cherche/recherche <texte> : Lance une recherche sur Internet." +
          " - pause/stop/arrêt          : Met en pause mes services jusqu'à votre prochain appel."
        );
        this.voiceSynthetizer.speak(
          "Voici la liste des commandes disponibles Monsieur :\n" +
          " - aide                      : Affiche la liste des commandes disponibles.\n" +
          " - cherche/recherche <texte> : Lance une recherche sur Internet." +
          " - pause/stop/arrêt          : Met en pause mes services jusqu'à votre prochain appel."
        );
      }

      //research command
      else if(text.includes("cherche")){
        
        //get research text
        text = text.slice( text.indexOf("cherche")+7 ).trim();
        
        //incorrect research
        if(text === ""){
          this.speak("Jarvis > Vous n'avez rien demandé à rechercher Monsieur.");
          this.voiceSynthetizer.speak("Vous n'avez rien demandé à rechercher Monsieur.");
        }

        //launch research
        else{
          this.speak("Jarvis > Voici les résultats sur la recherche \"" + text + "\" Monsieur.");
          this.voiceSynthetizer.speak("Voici les résultats sur la recherche \"" + text + "\" Monsieur.");
          this.page_center.searchBar.value = text;
          this.sendData(this.neutralSentence(text));
        }
      }

      //thank you command
      else if(text.includes("merci")){
          this.speak("Jarvis > Mais de rien Monsieur, c'est un honneur de vous servir.");
          this.voiceSynthetizer.speak("Mais de rien Monsieur, c'est un honneur de vous servir.");
      }

      //Jarvis command
      else if(text.includes("Jarvis")){
          this.speak("Jarvis > Je suis là Monsieur. En quoi puis-je vous servir ?");
          this.voiceSynthetizer.speak("Je suis là Monsieur. En quoi puis-je vous servir ?");
      }

      //rock paper scissors
      else if(
        (
          text.includes("pierre") && (text.includes("feuille") || text.includes("papier")) && text.includes("ciseaux")
        ) ||
        text.includes("chifoumi")
      ){
          this.speak("Jarvis > Très bien, jouons à pierre feuille ciseaux.");
          this.voiceSynthetizer.speak("Très bien, jouons à pierre feuille ciseaux.");
      }

      //pause command
      else if(
        text.includes("pause") ||
        text.includes("stop") ||
        text.includes("arrêt")
      ){
        this.pause = true;
        this.speak(
          "Jarvis > Très bien, je vous laisse tranquille Monsieur.\n" +
          "Appelez-moi quand vous aurez besoin de moi à nouveau."
        );
        this.voiceSynthetizer.speak(
          "Très bien, je vous laisse tranquille Monsieur.\n" +
          "Appelez-moi quand vous aurez besoin de moi à nouveau."
        );
      }

      //unknown command
      else if(text != ""){
        this.speak("Jarvis > Commande non reconnue : \"" + text + "\".");
        this.voiceSynthetizer.speak("Commande non reconnue : \"" + text + "\".");
      }
    }

    //reset finalSentence
    this.voiceRecognizer.finalSentence = "";
  }



  //utilities
  delay(delay: number): void{
    var startDate = Date.now();
    while( Date.now() < startDate+delay);
  }



  //send research query
  sendData(text: string){
    this.setJSON(text).subscribe(data => {});

    //little delay in order to let Googlooper
    //search on the Internet and write the result
    //inside result.json
    //(minimum 1500ms to have the correct response)
    this.delay(1750);

    //get result data
    this.readData();
  }

  public setJSON(text: string): Observable<any>{
    return this.http.put(
      this.baseURL,
      "{\"name\":\"|" + text + "|\"}",
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
