import { Injectable } from '@angular/core';
import { ErrorHandler } from '../services/errorHandler';
import { Observable } from 'rxjs';
import { Picture } from '../models/picture';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PicturesService {
  private picturesURL = 'https://three-sixty-rooms-bnu.herokuapp.com/api/pictures';
  private errorHandler: ErrorHandler = new ErrorHandler();

  /**
   * Gets the pictures for the room (usually one) in array form
   * @param roomID The ID of the room for which the pictures belong
   */
  getPictures(roomID: string): Observable<Picture[]> {
    const url = `${this.picturesURL}/?room=${roomID}`;
    return this.http.get<Picture[]>(url).pipe(
      catchError(this.errorHandler.handleError('getPictures', []))
    );
  }


  /**
   * Gets the picture with the given ID from the back-end server
   * @param pictureID The ID of the picture to retrieve
   */
  getPicture(pictureID: string): Observable<Picture> {
    const url = `${this.picturesURL}/${pictureID}`;
    return this.http.get<Picture>(url).pipe(
      catchError(this.errorHandler.handleError<Picture>('getPicture'))
    );
  }

  /**
   * Creates a picture object in the back-end server
   * @param data The FormData containing all the data for the new picture object to be created
   */
  createPicture(data: FormData): Observable<Picture> {
    return this.http.post<Picture>(this.picturesURL, data).pipe(
      catchError(this.errorHandler.handleError<Picture>('createPicture'))
    );
  }

  /**
   * Updates a picture object in the back-end server
   * @param data The FormData object representing the picture to be updated
   * @param pictureID The ID of the picture to be updated
   */
  updatePicture(data: FormData, pictureID: string): Observable<Picture> {
    const url = `${this.picturesURL}/${pictureID}`;
    return this.http.put(url, data).pipe(
      catchError(this.errorHandler.handleError<any>('updatePicture'))
    );
  }

  /**
   * Deletes a picture object in the back-end server
   * @param picture Either the picture object to be deleted or the picture ID of the picture to be deleted
   */
  deletePicture(picture: Picture | string): Observable<Picture> {
    const id = typeof picture === 'string' ? picture : picture._id;
    const url = `${this.picturesURL}/${id}`;

    return this.http.delete<Picture>(url).pipe(
      catchError(this.errorHandler.handleError<Picture>('deletePicture'))
    );
  }

  constructor(private http: HttpClient) { }
}
