import { Injectable } from '@angular/core';
import { ErrorHandler } from '../services/errorHandler';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private usersURL = 'https://three-sixty-rooms-bnu.herokuapp.com/api/users';
  private errorHandler: ErrorHandler = new ErrorHandler();

  /**
   * Gets the data for a specific user from the back-end server
   * @param userID The ID of the user to be retrieved
   */
  getUser(userID: string): Observable<User> {
    const url = `${this.usersURL}/${userID}`;
    return this.http.get<User>(url).pipe(
      catchError(this.errorHandler.handleError<User>('getUser'))
    );
  }

  /**
   * Updates the user object in the back-end server
   * @param user A User object containing the data of the user to be updated
   */
  updateUser(user: User): Observable<any> {
    const url = `${this.usersURL}/${user._id}`;
    return this.http.put(url, user).pipe(
      catchError(this.errorHandler.handleError<any>('updateUser'))
    );
  }

  /**
   * Deletes the given user from the back-end server
   * @param user Either the user object or the ID of the user object to be deleted
   */
  deleteUser(user: User | string): Observable<User> {
    const id = typeof user === 'string' ? user : user._id;
    const url = `${this.usersURL}/${id}`;

    return this.http.delete<User>(url).pipe(
      catchError(this.errorHandler.handleError<User>('deleteUser'))
    );
  }

  constructor(private http: HttpClient) { }
}
