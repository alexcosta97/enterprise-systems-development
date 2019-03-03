import { TestBed } from '@angular/core/testing';

import { RoomsService } from './rooms.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';

describe('RoomsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpClient,
      HttpHandler,
      JwtModule,
      JwtHelperService
    ]
  }));

  it('should be created', () => {
    const service: RoomsService = TestBed.get(RoomsService);
    expect(service).toBeTruthy();
  });
});
