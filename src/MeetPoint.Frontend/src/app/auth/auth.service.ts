import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ignoreElements, Observable, switchMap, tap } from 'rxjs';
import { skipAuth } from '../http-context.tokens';
import { AuthResponse, AuthTokenService } from './auth-token.service';

export interface AuthDto {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authTokenService = inject(AuthTokenService);
  private _http = inject(HttpClient);
  private _router = inject(Router);

  isAuthenticated = computed(() => !this._authTokenService.tokensInvalid());

  constructor() {
    effect(() => {
      if (this._authTokenService.tokensInvalid()) this.logout();
    });
  }

  login(dto: AuthDto): Observable<void> {
    return this._http
      .post<AuthResponse>('/api/account/login', dto, { context: skipAuth() })
      .pipe(
        tap((res) => this._authTokenService.set(res)),
        tap(() => this._router.navigate(['/home'])),
        ignoreElements()
      );
  }

  register(dto: AuthDto): Observable<void> {
    return this._http
      .post<void>('/api/account/register', dto, { context: skipAuth() })
      .pipe(
        switchMap(() => this.login(dto)),
        ignoreElements()
      );
  }

  logout(): void {
    this._authTokenService.clear();
    this._router.navigate(['/login']);
  }
}
