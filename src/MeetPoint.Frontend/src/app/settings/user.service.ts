import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, switchMap, take, tap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  profileImageUrl?: string;
}

export interface FriendDto {
  id: string;
  username: string;
  phoneNumber: string | null;
}

export interface UpdateDto {
  userName: string;
  phoneNumber: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _authService = inject(AuthService);
  private _http = inject(HttpClient);
  public readonly user = signal<User | null>(null);

  constructor() {
    effect(() => {
      if (this._authService.isAuthenticated())
        this.updateUserData().pipe(take(1)).subscribe();
    });
  }

  updateUserData(): Observable<User> {
    return this._http.get<User>('api/account/me').pipe(
      tap((res) => this.user.set(res)),
      catchError((err) => throwError(() => err))
    );
  }

  setUserData(dto: UpdateDto, image: File | null): Observable<any> {
    if (image) {
      return this._http
        .put('/api/account/update', dto)
        .pipe(switchMap(() => this._http.post('api/image/upload', image)));
    } else {
      return this._http.put('/api/account/update', dto);
    }
  }

  setUserDataAndReload(dto: UpdateDto, image: File | null): Observable<User> {
    return this.setUserData(dto, image).pipe(
      switchMap(() => this.updateUserData())
    );
  }

  checkPassword(password: string): Observable<any> {
    return this._http.post<void>('/api/account/check-password', password);
  }
}
