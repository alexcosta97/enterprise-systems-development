import { TestBed } from '@angular/core/testing';

import { UsersService } from './users.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';

describe('UsersService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpClient,
      HttpHandler,
      JwtModule,
      JwtHelperService
    ]
  }));

  it('should be created', () => {
    const service: UsersService = TestBed.get(UsersService);
    expect(service).toBeTruthy();
  });
});
