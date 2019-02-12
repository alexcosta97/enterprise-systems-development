import { Component, OnInit } from '@angular/core';
import { Property } from '../models/property';
import { PropertiesService } from './properties.service';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {
  properties: Property[];

  constructor(private propertiesService: PropertiesService) { }

  private getProperties() {
    this.propertiesService.getProperties()
      .subscribe(properties => this.properties = properties);
  }

  ngOnInit() {
    this.getProperties();
  }

}
