import { TestBed } from '@angular/core/testing';

import { PicturesService } from './pictures.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';

describe('PicturesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpClient,
      HttpHandler,
      JwtModule,
      JwtHelperService
    ]
  }));

  it('should be created', () => {
    const service: PicturesService = TestBed.get(PicturesService);
    expect(service).toBeTruthy();
  });
});
