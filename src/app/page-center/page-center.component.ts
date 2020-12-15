import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'page-center',
  templateUrl: './page-center.component.html',
  styleUrls: ['./page-center.component.css', '../main-menu/main-menu.component.css']
})
export class PageCenterComponent implements OnInit {

  //attributes
  research = "";



  //methods
  constructor(){}

  ngOnInit(): void{}



  //input search bar
  refresh(): void{
  	this.research = ( <HTMLInputElement>document.querySelector("#page-search-bar") ).value;
  }



  //results layout
  updateResults(sections: string): void{
  	sections = JSON.parse(sections);

  	//reset results
  	var resultElement = document.querySelector("#center-results");
  	resultElement.innerHTML = "";

  	//build new results HTML structure
  	var url1 = "";
  	var separationIndex = 0;
  	var url2 = "";
  	for(var s=0; s < sections.length; s++){
  		url1 = (<Object>sections[s]).url.slice( (<Object>sections[s]).url.indexOf("//")+2);
  		separationIndex = url1.indexOf("/");
  		url2 = url1.slice(separationIndex);
  		url1 = url1.slice(0, separationIndex);
  		resultElement.innerHTML += "<div class=\"page-section\">\n";
		resultElement.innerHTML += "<span class=\"section-url1\">" + url1 + "</span>\n";
		resultElement.innerHTML += "<span class=\"section-url2\"> > " + url2 + "</span><br>\n";
		resultElement.innerHTML += "<a class=\"section-link\" href=\"" + (<Object>sections[s]).url + "\">" + (<Object>sections[s]).title + "</a><br>\n";
		resultElement.innerHTML += "<span class=\"section-text\">" + (<Object>sections[s]).abstract + "</span>\n";
		resultElement.innerHTML += "</div>\n";
		resultElement.innerHTML += "<br>\n\n";
		console.log(sections[s].url);
  	}
  }
}
