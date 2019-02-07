import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Floor } from '../models/floor';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ErrorHandler } from '../services/errorHandler';

@Injectable({
  providedIn: 'root'
})
export class FloorsService {
  private floorsURL = 'https://three-sixty-rooms-bnu.herokuapp.com/api/floors';
  private errorHandler: ErrorHandler = new ErrorHandler();

  /**
   * Gets the floors that belong to a certain property
   * @param propertyID ID of the property for which the floors are getting fetched
   */
  getFloors(propertyID: string): Observable<Floor[]> {
    const url = `${this.floorsURL}/?property=${propertyID}`;
    return this.http.get<Floor[]>(url).pipe(
      catchError(this.errorHandler.handleError('getFloors', []))
    );
  }

  /**
   * Gets the details of a floor with a certain ID
   * @param floorID ID of the floor for which the details are getting fetched
   *    */
  getFloor(floorID: string): Observable<Floor> {
    const url = `${this.floorsURL}/${floorID}`;
    return this.http.get<Floor>(url).pipe(
      catchError(this.errorHandler.handleError<Floor>('getFloor'))
    );
  }

  /**
   * Creates a new floor in the back-end server
   * @param data The FormData containing all the data for the floor being created
   */
  createFloor(data: FormData): Observable<Floor> {
    return this.http.post<Floor>(this.floorsURL, data).pipe(
      catchError(this.errorHandler.handleError<Floor>('createFloor'))
    );
  }

  /**
   * Updates the details of the floor in the back-end server
   * @param data The FormData containing all the data for the floor being updated
   * @param floorID The ID of the floor being updated
   */
  updateFloor(data: FormData, floorID: string): Observable<any> {
    const url = `${this.floorsURL}/${floorID}`;
    return this.http.put(url, data).pipe(
      catchError(this.errorHandler.handleError<any>('updateProperty'))
    );
  }

  /**
   * Deletes a floor from the back-end server
   * @param floor Either the ID of the floor to be deleted or the Floor object itself
   */
  deleteFloor(floor: Floor | string): Observable<Floor> {
    const id = typeof floor === 'string' ? floor : floor._id;
    const url = `${this.floorsURL}/${id}`;

    return this.http.delete<Floor>(url).pipe(
      catchError(this.errorHandler.handleError<Floor>('deleteFloor'))
    );
  }

  constructor(private http: HttpClient) { }
}
