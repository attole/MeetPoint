import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ignoreElements, Observable, switchMap } from 'rxjs';

export interface FriendDto {
  id: string;
  username: string;
  phoneNumber: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class UserFriendsService {
  private _http = inject(HttpClient);

  getFriends(): Observable<FriendDto[]> {
    return this._http.get<FriendDto[]>('/api/account/friends');
  }

  deleteFriend(id: string): Observable<void> {
    return this._http
      .delete(`/api/account/friends/delete${id}`)
      .pipe(ignoreElements());
  }

  deleteFriendAndReload(id: string): Observable<FriendDto[]> {
    return this.deleteFriend(id).pipe(switchMap(() => this.getFriends()));
  }

  getReceivedInvites(): Observable<FriendDto[]> {
    return this._http.get<FriendDto[]>('/api/account/invites/received');
  }

  rejectInvite(id: string): Observable<void> {
    return this._http
      .post<void>(`/api/account/invite/reject${id}`, null)
      .pipe(ignoreElements());
  }

  acceptInvite(id: string): Observable<void> {
    return this._http
      .post<void>(`/api/account/invite/accept${id}`, null)
      .pipe(ignoreElements());
  }

  rejectAndRelod(id: string): Observable<FriendDto[]> {
    return this.rejectInvite(id).pipe(() => this.getReceivedInvites());
  }

  acceptAndRelod(id: string): Observable<FriendDto[]> {
    return this.acceptInvite(id).pipe(() => this.getReceivedInvites());
  }

  getSentInvites(): Observable<FriendDto[]> {
    return this._http.get<FriendDto[]>('/api/account/intives/send');
  }

  sentInvite(id: string): Observable<void> {
    return this._http
      .post<void>(`/api/account/invite/send${id}`, null)
      .pipe(ignoreElements());
  }

  sendAndReload(id: string): Observable<FriendDto[]> {
    return this.sentInvite(id).pipe(() => this.getSentInvites());
  }
}
