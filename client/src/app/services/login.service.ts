import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import { User } from '../models/user';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface SignInResponse {
  token: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpResponse {
  message: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private authURL = 'https://three-sixty-rooms-bnu.herokuapp.com/auth/';
  private jwtHelper = new JwtHelperService();

  /**
   * Allows for a user to login
   * @param credentials Defines the credentials sent by the component (email and password)
   * @returns Observable that defines if the user was logged in or not during the request
   */
  login(credentials: SignInRequest): Observable<boolean> {
    const URL = this.authURL + 'login';
    return this.http.post<SignInResponse>(URL, credentials)
      .pipe(
        map(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            return true;
          } else {
            return false;
          }
        }),
        catchError(this.handleError<boolean>('login', false))
      );
  }

  /**
   * Creates a new user in the back-end server
   * @param user The details for the new user
   * @returns Boolean Observable which states if the user was successfully added
   */
  signup(user: User): Observable<boolean> {
    const URL = this.authURL + 'signup';
    return this.http.post<SignUpResponse>(URL, user)
      .pipe(
        map(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            return true;
          } else {
            return false;
          }
        }),
        catchError(this.handleError<boolean>('signup', false))
      );
  }

  /**
   * Checks if the user is logged in
   */
  isLoggedIn(): boolean {
    return !this.jwtHelper.isTokenExpired();
  }

  /**
   * Gets the current user details from the JWT Token
   */
  get currentUser(): User {
    return this.jwtHelper.decodeToken(this.jwtHelper.tokenGetter());
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }

  constructor(
    private http: HttpClient
  ) { }
}
