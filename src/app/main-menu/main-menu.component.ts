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
  private synthetizerIsSpeaking: boolean = false;
  private jeu: string[] = ["Pierre", "Feuille", "Papier", "Ciseaux"];

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
    this.JarvisText.innerHTML = "Jarvis > " + text;
    this.voiceSynthetizer.speak(text);
    this.voiceRecognizer.synthetizerIsSpeaking = true;
  }



  //commands
  analyseCommand(text : string){

    //if Jarvis just spoke
    if(text != "" && this.voiceRecognizer.synthetizerIsSpeaking){
      text = "";
    }

    //if in pause
    else if(this.pause){

      //resume pause
      if(text.includes("Jarvis")){
        this.pause = false;
        this.speak("Oui Monsieur, je suis à vous.");
      }
    }

    //other commands
    else{
      //command help
      if(text.includes("aide")){
        this.speak(
          "Voici la liste des commandes disponibles Monsieur :\n" +
          " - aide                      : Affiche la liste des commandes disponibles.\n" +
          " - cherche/recherche <texte> : Lance une recherche sur Internet." +
          " - pause/stop/arrêt          : Met en pause mes services jusqu'à votre prochain appel."
        );
      }

      //research command
      else if(text.includes("cherche")){
        
        //get research text
        if(text.includes("chercher"))
          text = text.slice( text.indexOf("chercher")+8 ).trim();

        else if(text.includes("-moi"))
          text = text.slice( text.indexOf("moi")+3 ).trim();

        else if(text.includes("cherche"))
          text = text.slice( text.indexOf("cherche")+7 ).trim();

        if(text.includes("s'il te plaît"))
          text = text.slice( 0, text.indexOf("s'il")-1).trim();
        
        //incorrect research
        if(text === ""){
          this.speak("Vous n'avez rien demandé à rechercher Monsieur.");
        }

        //launch research
        else{
          this.speak("Voici les résultats sur la recherche \"" + text + "\" Monsieur.");
          this.page_center.searchBar.value = text;
          this.sendData(this.neutralSentence(text));
        }
      }

      //thank you command
      else if(text.includes("merci")){
          this.speak("Mais de rien Monsieur, c'est un honneur de vous servir.");
      }

      //cool command
      else if(
        text.includes("cool") || 
        text.includes("Cool")
      ){
          this.speak("Ravie que cela vous plaise.");
      }

      //How are you command
      else if(
        text.includes("ça va") ||
        text.includes("et toi")
      ){
          this.speak("Je vais bien merci. N'hésitez pas à me donner des commandes.");
      }

      else if(
        text.includes("tu fais") ||
        text.includes("tu as fait")
      ){
          this.speak("Rien de spécial, j'ai dormi jusqu'à ce que vous m'appeliez!");
      }

      //Hey command
      else if(
        text.includes("Yo") ||
        text.includes("Salut") ||
        text.includes("salut") ||
        text.includes("coucou") ||
        text.includes("Coucou") ||
        text.includes("yo")
      ){
        this.speak("Bonjour Maître. Comment allez-vous?");
      }

      //Jarvis command
      else if(text.includes("Jarvis")){
          this.speak("Je suis là Monsieur. En quoi puis-je vous servir ?");
      }

      //rock paper scissors
      else if(
        (text.includes("pierre") && (text.includes("feuille")) || 
        (text.includes("papier")) && text.includes("ciseaux")) ||
        text.includes("chifoumi")
      ){
          this.speak("Jouons à pierre, feuille, papier, ciseaux.\n" +
          "Pierre, Feuille, Papier, Ciseaux.");

          this.speak(this.jeu[this.getRandomInt(4)]);


      }

      //pause command
      else if(
        text.includes("pause") ||
        text.includes("stop") ||
        text.includes("arrêt")
      ){
        this.pause = true;
        this.speak(
          "Très bien, je vous laisse tranquille Monsieur.\n" +
          "Appelez-moi quand vous aurez besoin de moi à nouveau."
        );
      }

      //unknown command
      else if(text != ""){
        switch(this.getRandomInt(3)){
          case 0:
            this.speak("Je n'ai pas bien compris, pouvez-vous répéter?");
            break;

          case 1:
            this.speak("Commande non reconnue : \"" + text + "\".");
            break;
          
          case 2:
            this.speak("Je ne sais pas quoi répondre!");
            break
          
          default:
            break;
        }
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

  getRandomInt(max: number): number{
    return Math.floor(Math.random() * Math.floor(max));
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
        this.delay(1500);

        //relaunch reading request
        this.getJSON().subscribe(data => {
          if(data != ""){
            this.page_center.updateResults(data);
          }else{

            //json reading timed dout
            this.delay(1500);

            //relaunch reading request
            this.getJSON().subscribe(data => {
              if(data != ""){
                this.page_center.updateResults(data);
              }else{
                console.log("Timed out, check your internet connection")
              }
            });
          }
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
