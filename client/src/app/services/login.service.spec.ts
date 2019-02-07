import { TestBed } from '@angular/core/testing';

import { LoginService } from './login.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { JwtHelperService, JwtInterceptor, JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { InjectionToken } from '@angular/core';

describe('LoginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        JwtModule,
        JwtHelperService
      ]
    });
  });

  it('should be created', () => {
    const service: LoginService = TestBed.get(LoginService);
    expect(service).toBeTruthy();
  });
});
