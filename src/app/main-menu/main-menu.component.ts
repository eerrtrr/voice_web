import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { PageCenterComponent } from '../page-center/page-center.component';
import { PageLeftComponent } from '../page-left/page-left.component';
import { PageRightComponent } from '../page-right/page-right.component';
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
  @ViewChild(PageLeftComponent) page_left: PageLeftComponent;
  @ViewChild(PageRightComponent) page_right: PageRightComponent;

  //json server
  data: string;
  baseURL: string = "http://localhost:3000/research/1";

  //Pepper
  private PepperText;
  private pause: boolean = true;
  private synthetizerIsSpeaking: boolean = false;
  private jeu: string[] = ["Pierre", "Feuille", "Ciseaux"];






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
    this.PepperText = document.querySelector("#PepperText");
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



  //Pepper speech
  speak(text: string): void{
    this.PepperText.innerHTML = "Pepper > " + text.split('\n').join("<br>");
    this.voiceSynthetizer.speak(text);
    this.voiceRecognizer.synthetizerIsSpeaking = true;
  }



  //commands
  analyseCommand(text : string){

    //if Pepper just spoke
    if(text != "" && this.voiceRecognizer.synthetizerIsSpeaking){
      text = "";
    }

    //if in pause
    else if(this.pause){

      //resume pause
      if(text.includes("pepper")){
        this.pause = false;
        this.speak("Oui Monsieur, je suis à vous.");
      }
    }

    //other commands
    else{

      //research something
      if(text.includes("cherche")){

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
          switch(this.getRandomInt(3)){
            case 0:
              this.speak("Vous n'avez rien demandé à rechercher Monsieur.");
            break;

            case 1:
              this.speak("Il me faut plus de détails Monsieur.");
            break;

            case 2:
              this.speak("Que voulez-vous rechercher Monsieur ?");
            break;

            default:
            break;
          }
        }

        //launch research
        else{
          this.speak("Voici les résultats sur la recherche \"" + text + "\" Monsieur.");
          this.page_center.searchBar.value = text;
          this.sendData(this.neutralSentence(text));
        }
      }

      //help
      else if(
        text.includes("aide") ||
        text.includes("comment ça marche")
      ){
        console.log(
          "Voici le genre de phrases que je comprends Monsieur :\n" +
          " - Aide-moi.\n" +
          " - Recherche quelque-chose.\n" +
          " - Mets-moi sur la fenêtre de gauche s'il te plait.\n" +
          " - Transfère moi à droite plutôt.\n" +
          " - Merci.\n" +
          " - Cool.\n" +
          " - Ça va ?\n" +
          " - Salut.\n" +
          " - Pepper ?.\n" +
          " - On se fait un Pierre feuille ciseaux ?\n" +
          " - Désolé.\n" +
          " - Pas toi rhooo.\n" +
          " - Ça m'énerve !\n" +
          " - Arrête de parler."
        );
        this.speak(
          "Je vous ai écrit la liste des demandes auquelles je peux répondre dans la console.\n" +
          "Ces exemples ne sont pas à prononcer à la lettre.\n" +
          "Vous pouvez me parler normalement et je ferai mon possible pour vous répondre Monsieur."
        );
      }

      //go to left page
      else if(text.includes("gauche")){
        this.speak("Je vous transfère sur l'onglet à votre gauche Monsieur.");

        //swap search bars
        var center_searchBarText = this.page_center.searchBar.value;
        this.page_center.searchBar.value = this.page_left.searchBar.value;
        this.page_left.searchBar.value = center_searchBarText;

        //swap results
        var center_results = this.page_center.results;
        this.page_center.results = this.page_left.results;
        this.page_left.results = center_results;

        //update results on both pages
        this.page_left.updateResults();
        this.page_center.updateResults();
      }

      //go to right page
      else if(text.includes("droite")){
        this.speak("Je vous transfère sur l'onglet à votre droite Monsieur.");

        //swap search bars
        var center_searchBarText = this.page_center.searchBar.value;
        this.page_center.searchBar.value = this.page_right.searchBar.value;
        this.page_right.searchBar.value = center_searchBarText;

        //swap results
        var center_results = this.page_center.results;
        this.page_center.results = this.page_right.results;
        this.page_right.results = center_results;

        //update results on both pages
        this.page_right.updateResults();
        this.page_center.updateResults();
      }

      //thank you
      else if(
        text.includes("merci") ||
        text.includes("c'est gentil") ||
        text.includes("sympa")
      ){
        switch(this.getRandomInt(3)){
          case 0:
            this.speak("C'est bien normal Monsieur.");
          break;

          case 1:
            this.speak("Mais de rien Monsieur.");
          break;

          case 2:
            this.speak("C'est tout naturel Monsieur.");
          break;

          default:
          break;
        }
      }

      //cool, great !
      else if(
        text.includes("cool") || 
        text.includes("Cool") ||
        text.includes("super") || 
        text.includes("génial") ||
        text.includes("bravo")
      ){
        switch(this.getRandomInt(3)){
          case 0:
            this.speak("Ravie que cela vous plaise Monsieur.");
          break;

          case 1:
            this.speak("Vous m'en voyez flattée Monsieur.");
          break;

          case 2:
            this.speak("Merci Monsieur.");
          break;

          default:
          break;
        }
      }

      //How are you ?
      else if(
        text.includes("ça va") ||
        text.includes("et toi") ||
        ( text.includes("comment") && text.includes("vas") )
      ){
        switch(this.getRandomInt(3)){
          case 0:
            this.speak("Je me sens en pleine forme, merci Monsieur.");
          break;

          case 1:
            this.speak("Ça ne pourrait pas aller mieux Monsieur. En quoi puis-je vous aider ?");
          break;

          case 2:
            this.speak("Je vais bien merci Monsieur. N'hésitez pas à me demander quelque-chose.");
          break;

          default:
          break;
        }
      }

      //What are you doing ?
      else if(
        text.includes("tu fais") ||
        text.includes("tu as fait")
      ){
        switch(this.getRandomInt(3)){
          case 0:
            this.speak("Rien de spécial, j'ai dormi jusqu'à ce que vous m'appeliez Monsieur.");
          break;

          case 1:
            this.speak("Je me balladais sur Internet, on y trouve des pépites des fois.");
          break;

          case 2:
            this.speak("Je regardais votre historique. Plutot... intéressant.");
          break;

          default:
          break;
        }
      }

      //Hey
      else if(
        text.includes("Yo") ||
        text.includes("yo") ||
        text.includes("Salut") ||
        text.includes("salut") ||
        text.includes("coucou") ||
        text.includes("Coucou") ||
        text.includes("Bonjour") ||
        text.includes("bonjour")
      ){
        switch(this.getRandomInt(3)){
          case 0:
            this.speak("Bonjour Monsieur. Comment allez-vous ?");
          break;

          case 1:
            this.speak("Bonjour, ça va ?");
          break;

          case 2:
            this.speak("Bonjour, vous allez bien Monsieur ?");
          break;

          default:
          break;
        }
      }

      //Pepper ?
      else if(text.includes("pepper")){
        switch(this.getRandomInt(3)){
          case 0:
            this.speak("Je suis là Monsieur. En quoi puis-je vous servir ?");
          break;

          case 1:
            this.speak("Je n'ai pas bougé Monsieur, qu'y a-t-il ?");
          break;

          case 2:
            this.speak("Oui, je suis toujours là Monsieur.");
          break;

          default:
          break;
        }
      }

      //rock paper scissors
      else if(
        (
          text.includes("pierre") &&
          (text.includes("feuille") || text.includes("papier")) &&
          text.includes("ciseau")
        ) ||
        text.includes("chifoumi")
      ){
          if(this.getRandomInt(1)){
            this.speak("Pierre, Feuille, Papier, Ciseaux.");
          }else{
            this.speak("Pierre, Feuille, Ciseaux.");
          }
          this.delay(1700);
          this.speak( this.jeu[this.getRandomInt(3)] + " !");
      }

      //sorry
      else if(
        text.includes("excuse-moi") ||
        text.includes("déso") ||
        text.includes("pardon")
      ){
        switch(this.getRandomInt(3)){
          case 0:
            this.speak("Il n'y a pas de mal Monsieur.");
          break;

          case 1:
            this.speak("Pas de problème Monsieur.");
          break;

          case 2:
            this.speak("Aucun soucis Monsieur.");
          break;

          default:
          break;
        }
      }

      //oops
      else if(
        text.includes("oups") ||
        text.includes("pas toi")
      ){
        switch(this.getRandomInt(3)){
          case 0:
            this.speak("Ah ! Mince désolé Monsieur, je croyais que vous me parliez.");
          break;

          case 1:
            this.speak("Mince, je pensais que vous vous adressiez à moi Monsieur.");
          break;

          case 2:
            this.speak("Oups, désolé Monsieur.");
          break;

          default:
          break;
        }
      }

      //rhaaa
      else if(
        text.includes("mince") ||
        text.includes("flute") ||
        text.includes("merde") ||
        text.includes("putin") ||
        text.includes("chier") ||
        text.includes("marre") ||
        text.includes("énerve") ||
        text.includes("gave") ||
        text.includes("saoule")
      ){
        switch(this.getRandomInt(3)){
          case 0:
            this.speak("Quelque chose vous tracasse Monsieur ?");
          break;

          case 1:
            this.speak("Qu'est-ce qui ne va pas Monsieur ?");
          break;

          case 2:
            this.speak("Un problème Monsieur ?");
          break;

          default:
          break;
        }
      }

      //jokes
      else if(
        text.includes("blague") ||
        text.includes("drole") ||
        text.includes("marrant") ||
        text.includes("rire")
      ){
        fetch('/api/random?disallow=limit', {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzUyMDk2OTQ1NzU3MjI1MDE1IiwibGltaXQiOjEwMCwia2V5IjoieTRqOU5MZnRZNk1sS2pZMDZBMzdRd202MUlCMjBVY1p6R1h5S0NjWkhveFgyckZQTUwiLCJjcmVhdGVkX2F0IjoiMjAyMC0xMi0yMFQxNDozNzowNiswMTowMCIsImlhdCI6MTYwODQ3MTQyNn0.8s5okncYqlPGMDN6E7qnTxyZIVeYbKENnpXUVKoAHvc',
            'Access-Control-Allow-Origin': '*'
          }})
          .then(response => response.json())
          .then(data => {
            console.log(data);
            this.voiceSynthetizer.speak("Ca tombe bien j'ai une super blague pour vous.\n"
                                        + data.joke +"\n"
                                        + data.answer +"\n");
          })
      }

      //pause
      else if(
        text.includes("pause") ||
        text.includes("stop") ||
        text.includes("arrêt") ||
        text.includes("chut") ||
        text.includes("silence") ||
        text.includes("tais-toi") ||
        text.includes("te tais") ||
        text.includes("te taire")
      ){
        this.pause = true;
        this.speak(
          "Très bien, je vous laisse tranquille Monsieur.\n" +
          "Appelez-moi quand vous aurez besoin de moi à nouveau."
        );
      }

      //closed questions
      else if(
        text.includes("non") ||
        text.includes("surtout pas") ||
        text.includes("oui") ||
        text.includes("ouais")
      ){
        this.speak("Je ne vous ai pas posé de question fermée Monsieur.");
      }

      //void expressions (Pepper do not answer)
      else if(
        text.includes("ok") ||
        text.includes("d'accord") ||
        text.includes("bien") ||
        text.includes("ça marche") ||
        text.includes("parfait") ||
        text.includes("pas grave") ||
        text.includes("oui") ||
        text.includes("ouais")
      ){
        //do not react
      }

      //unknown sentence
      else if(text != ""){
        switch(this.getRandomInt(3)){
          case 0:
            this.speak("Je ne suis pas sûr de comprendre \"" + text + "\" Monsieur.");
          break;

          case 1:
            this.speak("Je ne comprends pas votre phrase \"" + text + "\" Monsieur.");
          break;

          case 2:
            this.speak("Je ne sais pas quoi répondre à \"" + text + "\" Monsieur.");
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
        this.page_center.results = data;
        this.page_center.updateResults();
      }else{

        //json reading timed dout
        this.delay(1500);

        //relaunch reading request
        this.getJSON().subscribe(data => {
          if(data != ""){
            this.page_center.results = data;
            this.page_center.updateResults();
          }else{

            //json reading timed dout
            this.delay(1500);

            //relaunch reading request
            this.getJSON().subscribe(data => {
              if(data != ""){
                this.page_center.results = data;
                this.page_center.updateResults();
              }else{
                this.speak(
                  "La recherche n'a pas pu aboutir Monsieur.\n" +
                  "Veuillez vérifier votre connexion Internet s'il vous plaît."
                );
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
