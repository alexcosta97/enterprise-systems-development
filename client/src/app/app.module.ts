import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { MaterialModule } from './material-module/material-module.module';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule } from '@angular/material';
import { LoginService } from './services/login.service';
import { UsersService } from './user/users.service';
import { PropertiesService } from './properties/properties.service';
import { FloorsService } from './floors/floors.service';
import { RoomsService } from './rooms/rooms.service';
import { PicturesService } from './show-room/pictures.service';

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
    }),
    BrowserAnimationsModule,
    MaterialModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule
  ],
  providers: [
    LoginService,
    UsersService,
    PropertiesService,
    FloorsService,
    RoomsService,
    PicturesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
