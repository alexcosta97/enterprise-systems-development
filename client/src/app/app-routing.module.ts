import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PropertyComponent } from './property/property.component';
import { UserComponent } from './user/user.component';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'property/:id', component: PropertyComponent},
  {path: 'user/:id', component: UserComponent},
  {path: 'me', component: UserComponent},
  {path: 'login', component: AuthComponent},
  {path: 'signup', component: AuthComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
