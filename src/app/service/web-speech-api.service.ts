import { Injectable } from '@angular/core';


declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})

export class VoiceRecognitionService {

  recognition = new webkitSpeechRecognition();
  private sentence = "";

  constructor(){}



  //recognizer
  init(){
    this.recognition.interimResults = true;
    this.recognition.lang = 'fr-FR';
    this.recognition.continuous = false;

    //create the recognition event
    this.recognition.addEventListener('result', (e) => {
      this.sentence = e.results[0][0].transcript;
    });
  }

  start(){
    //start recognition
    this.recognition.start();

    //when recognizer has timed out
    this.recognition.addEventListener('end', (condition) => {

      //analyse the result
      this.analyseCommand(this.sentence);

      //relaunch recognition
      this.sentence = "";
      this.recognition.start();
    });
  }



  //commands
  analyseCommand(text : string){

    //command help
    if(text.includes("aide")){
      console.log(
        "WebSpeechAPI > Voici la liste des commandes disponibles :\n" +
        " - aide                      : Affiche la liste des commandes disponibles.\n" +
        " - cherche/recherche <texte> : Lance une recherche sur Internet."
      );
    }

    //research command
    else if(text.includes("cherche")){
      //get research text
      text = text.slice( text.indexOf("cherche")+7 );
      console.log("WebSpeechAPI > Lancement de la recherche \"" + text + "\" sur Internet.");
    }

    else if(text != ""){
      console.log("WebSpeechAPI > Commande non reconnue : \"" + text + "\".");
    }
  }
}