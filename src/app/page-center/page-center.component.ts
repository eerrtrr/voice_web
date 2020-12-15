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
  updateResults(): void{
  }
}
