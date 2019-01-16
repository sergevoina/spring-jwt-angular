import { Component, OnInit } from '@angular/core';

import { HomeService } from '../home.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private data: any;
  
  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.getData();
  }
  
  getData(): void {
  	this.homeService.getData().subscribe(data => this.data = data);
  }
}



