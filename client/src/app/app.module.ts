import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginService } from './services/login.service';
import { JwtModule } from '@auth0/angular-jwt';
import { UserComponent } from './user/user.component';
import { PropertiesComponent } from './properties/properties.component';
import { PropertyComponent } from './property/property.component';
import { FloorsComponent } from './floors/floors.component';
import { RoomsComponent } from './rooms/rooms.component';
import { ShowRoomComponent } from './show-room/show-room.component';
import { AuthComponent } from './auth/auth.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    PropertiesComponent,
    PropertyComponent,
    FloorsComponent,
    RoomsComponent,
    ShowRoomComponent,
    AuthComponent,
    NavbarComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
        whitelistedDomains: ['https://three-sixty-rooms-bnu.herokuapp.com/'],
        headerName: 'x-auth-token',
        authScheme: ''
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
