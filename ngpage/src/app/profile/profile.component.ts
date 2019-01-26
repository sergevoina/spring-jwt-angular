import { Component, OnInit } from '@angular/core';

import { ProfileService } from '../profile.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: any;
  
  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.getProfile();
  }
  
  getProfile(): void {
  	this.profileService.getProfile().subscribe(profile => this.profile = profile);
  }
  
  save(): void {
  	this.profileService.saveProfile(this.profile).subscribe(profile => this.profile = profile);
  }
  
  add(): void {
    if(this.profile) {
    	    if(!this.profile.properties) {
    			this.profile.properties = [];
    		}	
		this.profile.properties.push({name:"Change Me", value:""});
    }	
  }

}
