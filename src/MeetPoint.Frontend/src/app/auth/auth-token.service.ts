import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, finalize, Observable, tap, throwError } from 'rxjs';
import { skipAuth } from '../http-context.tokens';

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthTokenService {
  private _http = inject(HttpClient);
  private _router = inject(Router);
  private _refreshing = signal<boolean>(false);
  private readonly _keys = {
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
    expireTime: 'expire_time',
    rememberMe: 'remember_me',
  };

  readonly tokensInvalid = signal(false);

  constructor() {
    if (this.getAccessToken) this.refresh().subscribe();
    else this.tokensInvalid.set(true);
  }

  refresh(): Observable<AuthResponse> {
    if (this._refreshing()) return EMPTY;
    this._refreshing.set(true);

    const refreshToken = localStorage.getItem(this._keys.refreshToken);

    if (!refreshToken) {
      this.clear();
      return throwError(
        () => new Error('AUTH TOKEN SERVICE - No refresh token available')
      );
    }

    return this._http
      .post<AuthResponse>(
        '/api/account/refresh',
        { refreshToken: refreshToken },
        { context: skipAuth() }
      )
      .pipe(
        tap((res) => {
          this.set(res);
        }),
        catchError((err) => {
          this._router.navigate(['/login']);
          this.clear();
          return EMPTY;
        }),
        finalize(() => this._refreshing.set(false))
      );
  }

  isAccessTokenExpiringSoon(bufferMin = 1): boolean {
    const expiresTime = parseInt(
      localStorage.getItem(this._keys.expireTime) || '0',
      10
    );
    const elapsed = (expiresTime - Date.now()) / 1000 / 60;
    return elapsed < bufferMin;
  }

  get getAccessToken(): string | null {
    return localStorage.getItem(this._keys.accessToken);
  }

  set(res: AuthResponse): void {
    const expireTime = Date.now() + res.expiresIn * 1000;
    localStorage.setItem(this._keys.expireTime, expireTime.toString());
    localStorage.setItem(this._keys.accessToken, res.accessToken);
    localStorage.setItem(this._keys.refreshToken, res.refreshToken);
    this.tokensInvalid.set(false);
  }

  clear(): void {
    Object.values(this._keys).forEach((key) => localStorage.removeItem(key));
    this.tokensInvalid.set(true);
  }
}
