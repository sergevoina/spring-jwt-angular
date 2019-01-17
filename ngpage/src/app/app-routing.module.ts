import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
	{
		path: 'app/login',
		component: LoginComponent
	},
	{
		path: 'app/home',
		component: HomeComponent,
		pathMatch: 'full'
	},
	{
		path: 'app/profile',
		component: ProfileComponent,
		pathMatch: 'full'
	},
	{
		path: 'app/settings',
		component: SettingsComponent,
		pathMatch: 'full'
	},
	{
		path: '',
		redirectTo: '/app/home',
		pathMatch: 'full'
	},
	{
		path: 'app',
		redirectTo: '/app/home',
		pathMatch: 'full'
	},
	{
		path: '**',
		component: PageNotFoundComponent
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
