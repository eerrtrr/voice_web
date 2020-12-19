import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'page-left',
  templateUrl: './page-left.component.html',
  styleUrls: ['./page-left.component.css', '../main-menu/main-menu.component.css']
})

export class PageLeftComponent implements OnInit {

  //search bar
  public searchBar: HTMLInputElement;

  //results
  public results: string = "";



  //methods
  constructor(){}

  ngOnInit(): void{
    this.searchBar = <HTMLInputElement>( document.querySelector("#left-search-bar") );
  }



  //results layout
  updateResults(): void{

    //get results
    var resultElement = document.querySelector("#left-results");

    //empty case
    if(this.results == ""){
      resultElement.innerHTML = "<div>Pas de résultat à afficher pour l'instant.</div>";
      return;
    }

    //not empty case
    var sections = JSON.parse(this.results);

    //add style element
    resultElement.innerHTML =
      "<style>\n" +
        ".left-section-container{\n" +
          "border-style: groove none none none;\n" +
          "border-color: rgba(0,150,255,1);\n" +
          "padding: 1% 1%;\n" +
          "margin: 1% 1% 1% 1%;\n" +
          "font-family: arial, sans-serif;\n" +
        "}\n" +
        ".left-section-url1{\n" +
          "font-size: 10px;\n" +
          "font-weight: bold;\n" +
          "color: rgba(  0,  0,  0, 1);\n" +
        "}\n" +
        ".left-section-url2{\n" +
          "font-size: 10px;\n" +
          "color: rgba( 80, 80, 80, 1);\n" +
        "}\n" +
        ".left-section-link{\n" +
          "font-size: 12px;\n" +
          "color: rgba(  0,  0,200, 1);\n" +
        "}\n" +
        ".left-section-text{\n" +
          "font-size: 10px;\n" +
          "font-style: italic;\n" +
          "color: rgba( 60, 60, 60, 1);\n" +
        "}\n" +
      "</style>\n"
    ;

    //build new results HTML structure
    var url1 = "";
    var separationIndex = 0;
    var url2 = "";
    for(var s=0; s < sections.length; s++){

      //prepare url separation
      url1 = sections[s]["url"].slice( sections[s]["url"].indexOf("//")+2);
      separationIndex = url1.indexOf("/");
      url2 = url1.slice(separationIndex+1);
      url1 = url1.slice(0, separationIndex);

      //div container
      var divElement = document.createElement("div");
      divElement.className = "left-section-container";
      resultElement.appendChild(divElement);

      //url1
      var spanElement = document.createElement("span");
      spanElement.className = "left-section-url1";
      spanElement.innerHTML = url1;
      divElement.appendChild(spanElement);

      //url2
      spanElement = document.createElement("span");
      spanElement.className = "left-section-url2";
      spanElement.innerHTML = " > " + url2;
      divElement.appendChild(spanElement);
      divElement.innerHTML += "<br>\n";

      //link
      var AElement = document.createElement("a");
      AElement.className = "left-section-link";
      AElement.href      = sections[s]["url"];
      AElement.target    = "_blank";
      AElement.innerHTML = sections[s]["title"];
      divElement.appendChild(AElement);
      divElement.innerHTML += "<br>\n";

      //text
      spanElement = document.createElement("span");
      spanElement.className = "left-section-text";
      spanElement.innerHTML = sections[s]["abstract"];
      divElement.appendChild(spanElement);
      divElement.innerHTML += "\n";
      resultElement.innerHTML += "<br>\n\n";
    }
  }

}
