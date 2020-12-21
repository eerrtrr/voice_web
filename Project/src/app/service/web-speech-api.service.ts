import { Injectable } from '@angular/core';


declare var webkitSpeechRecognition: any;
declare var SpeechSynthesisUtterance: any;


@Injectable({
  providedIn: 'root'
})

export class VoiceRecognitionService {

  recognition = new webkitSpeechRecognition();
  private sentence = "";
  public finalSentence = "";
  public synthetizerIsSpeaking: boolean = false;

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

      if(!this.synthetizerIsSpeaking){
        //update the final sentence detected
        this.finalSentence = this.sentence;
      }
      else{
        this.recognition.abort();
        this.synthetizerIsSpeaking = false;
      }

      //relaunch recognition
      //console.log(this.finalSentence);
      this.sentence = "";
      this.recognition.start();
    });
  }
}



export class VoiceSynthetizerService{

  public speechSynthesizer = new SpeechSynthesisUtterance();

  constructor(){}

  initSynthesis(): void {
    this.speechSynthesizer.volume = 1;
    this.speechSynthesizer.rate = 1.2;
    this.speechSynthesizer.pitch = 1.0;
  }

  speak(message: string): void {
    this.speechSynthesizer.lang = "fr";
    this.speechSynthesizer.text = message;
    speechSynthesis.speak(this.speechSynthesizer);
  }
}
