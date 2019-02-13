import { Component, OnInit } from '@angular/core';
import { Property } from '../models/property';
import { PropertiesService } from './properties.service';
import { ActivatedRoute } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { UserComponent } from '../user/user.component';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {
  properties: Property[];

  constructor(
    private propertiesService: PropertiesService,
    private loginService: LoginService,
    private route: ActivatedRoute
  ) { }

  /**
   * Gets the properties for the component.
   * First checks which component called the properties component,
   * and, dependent on the component, fetches the users from the
   * right method from PropertiesService
   */
  private getProperties() {
    const component = this.route.snapshot.component;
    // Checks if the component in the route is HomeComponent or UserComponent
    if (component instanceof HomeComponent) {
      // Fetches all the properties in the systems
      this.propertiesService.getProperties()
        .subscribe(properties => this.properties = properties);
    } else if (component instanceof UserComponent) {
      const id = this.route.snapshot.paramMap.get('id');
      // If an ID was provided with the route,
      // it gets the properties for that user
      if (id !== null) {
        this.propertiesService.getUserProperties(id)
          .subscribe(properties => this.properties = properties);
      } else {
        // Otherwise it gets the properties for the current user
        const user = this.loginService.currentUser;
        this.propertiesService.getUserProperties(user._id)
          .subscribe(properties => this.properties = properties);
      }
    }
  }

  ngOnInit() {
    this.getProperties();
  }

}
