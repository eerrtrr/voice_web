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

      //update the final sentence detected
      this.finalSentence = this.sentence;

      //relaunch recognition
      this.sentence = "";
      this.recognition.start();
    });
  }
}



export class VoiceSynthetizerService{

  speechSynthesizer!: SpeechSynthesisUtterance;
  isSynthesizing: boolean = false;

  constructor(){}

  initSynthesis(): void {
    this.speechSynthesizer = new SpeechSynthesisUtterance();
    this.speechSynthesizer.volume = 1;
    this.speechSynthesizer.rate = 1.1;
    this.speechSynthesizer.pitch = 0.5;
  }

  speak(message: string): void {
    this.speechSynthesizer.lang = "fr";
    this.speechSynthesizer.text = message;
    console.log("start");
    speechSynthesis.speak(this.speechSynthesizer);
    console.log("end");
  }
}
