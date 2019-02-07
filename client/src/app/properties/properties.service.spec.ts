import { TestBed } from '@angular/core/testing';

import { PropertiesService } from './properties.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';

describe('PropertiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpClient,
      HttpHandler,
      JwtModule,
      JwtHelperService
    ]
  }));

  it('should be created', () => {
    const service: PropertiesService = TestBed.get(PropertiesService);
    expect(service).toBeTruthy();
  });
});
