import { TestBed } from '@angular/core/testing';

import { FloorsService } from './floors.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';

describe('FloorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpClient,
      HttpHandler,
      JwtModule,
      JwtHelperService
    ]
  }));

  it('should be created', () => {
    const service: FloorsService = TestBed.get(FloorsService);
    expect(service).toBeTruthy();
  });
});
