import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../models/property';
import { catchError } from 'rxjs/operators';
import { ErrorHandler } from '../services/errorHandler';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {
  private propertiesURL = 'https://three-sixty-rooms-bnu.herokuapp.com/api/properties';
  private errorHandler: ErrorHandler = new ErrorHandler();

  /**
   * GET: Gets all the properties available on the platform
   */
  getProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(this.propertiesURL)
      .pipe(
        catchError(this.errorHandler.handleError('getProperties', []))
      );
  }


  /**
   * Gets the details of a particular property
   * @param id ID of the property to be fetched
   */
  getProperty(id: string): Observable<Property> {
    const url = `${this.propertiesURL}/${id}`;
    return this.http.get<Property>(url)
      .pipe(
        catchError(this.errorHandler.handleError<Property>('getProperty'))
      );
  }

  /**
   * Gets the properties that belong to a certain user
   * @param userID The ID of the user from whom properties are being queried
   */
  getUserProperties(userID: string): Observable<Property[]> {
    const url = `${this.propertiesURL}/?agent=${userID}`;
    return this.http.get<Property[]>(url).pipe(
      catchError(this.errorHandler.handleError<Property[]>('getUserProperties', []))
    );
  }

  /**
   * POST: Creates a new property in the back-end server
   * @param data Multi-part form data to send to server to create the new property
   */
  createProperty(data: FormData): Observable<Property> {
    return this.http.post<Property>(this.propertiesURL, data).pipe(
      catchError(this.errorHandler.handleError<Property>('createProperty'))
    );
  }

  /**
   * PUT: Updates the property in the back-end
   * @param data Multi-part form data to send to the server with the property details
   * @param id ID of the property to be updated
   */
  updateProperty(data: FormData, id: string): Observable<any> {
    const url = `${this.propertiesURL}/${id}`;
    return this.http.put(url, data).pipe(
      catchError(this.errorHandler.handleError<any>('updateProperty'))
    );
  }

  /**
   * DELETE: deletes the property from the back-end server
   * @param property Either the property object representing the property or the ID of the property to be deleted from the back-end
   */
  deleteProperty(property: Property | string): Observable<Property> {
    const id = typeof property === 'string' ? property : property._id;
    const url = `${this.propertiesURL}/${id}`;

    return this.http.delete<Property>(url).pipe(
      catchError(this.errorHandler.handleError<Property>('deleteHero'))
    );
  }

  constructor(
    private http: HttpClient
  ) { }
}
