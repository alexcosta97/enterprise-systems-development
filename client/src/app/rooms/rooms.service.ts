import { Injectable } from '@angular/core';
import { ErrorHandler } from '../services/errorHandler';
import { Observable } from 'rxjs';
import { Room } from '../models/room';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private roomsURL = 'https://three-sixty-rooms-bnu.herokuapp.com/api/rooms';
  private errorHandler: ErrorHandler = new ErrorHandler();

  /**
   * Gets the rooms for a certain floor on the platform
   * @param floorID The ID of the floor the rooms to be retrieved belong to
   */
  getRooms(floorID: string): Observable<Room[]> {
    const url = `${this.roomsURL}/?floor=${floorID}`;
    return this.http.get<Room[]>(url).pipe(
      catchError(this.errorHandler.handleError('getRooms', []))
    );
  }

  /**
   * Gets a particular room from the back-end server
   * @param roomID The ID of the room to be retrieved
   */
  getRoom(roomID: string): Observable<Room> {
    const url = `${this.roomsURL}/${roomID}`;
    return this.http.get<Room>(url).pipe(
      catchError(this.errorHandler.handleError<Room>('getRoom'))
    );
  }

  /**
   * Creates a new room on the back-end server
   * @param room A room object containing the information of the new room to be created
   */
  createRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(this.roomsURL, room).pipe(
      catchError(this.errorHandler.handleError<Room>('createRoom'))
    );
  }

  /**
   * Updates a room in the back-end server
   * @param room A room object containing the information of the room to be updated
   */
  updateRoom(room: Room): Observable<any> {
    const url = `${this.roomsURL}/${room._id}`;
    return this.http.put(url, room).pipe(
      catchError(this.errorHandler.handleError<any>('updateRoom'))
    );
  }

  /**
   * Deletes a room from the back-end server
   * @param room Is either a room object representing the room to be deleted or the ID of the room to be deleted
   */
  deleteRoom(room: Room | string): Observable<Room> {
    const id = typeof room === 'string' ? room : room._id;
    const url = `${this.roomsURL}/${id}`;

    return this.http.delete<Room>(url).pipe(
      catchError(this.errorHandler.handleError<Room>('deleteRoom'))
    );
  }

  constructor(private http: HttpClient) { }
}
