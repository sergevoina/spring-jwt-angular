import { Component, OnInit } from '@angular/core';

import { SettingsService } from '../settings.service'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  private settings: any;
  private message: string;
  
  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.getSettings();
  }
  
  getSettings(): void {
  	this.settingsService.getSettings().subscribe(
  	  data => {
  		this.settings = data; 
  		this.message = "";
  	  },
  	  error => {
  	  	this.settings = null;
  	  	//this.errorMessage = "Error";
  	  });
  }
  
  save(): void {
  	this.settingsService.saveSettings(this.settings).subscribe(settings => {
  		this.settings = settings; 
  		this.message = "saved at " + new Date().toISOString();
  	});
  }
  
  add(): void {
    if(this.settings) {
    	    if(!this.settings.properties) {
    			this.settings.properties = [];
    		}	
		this.settings.properties.push({name:"Change Me", value:""});
    }	
  }
}
