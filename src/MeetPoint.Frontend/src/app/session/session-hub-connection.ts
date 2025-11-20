import {
  computed,
  effect,
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import * as signalR from '@microsoft/signalr';
import {
  catchError,
  filter,
  from,
  map,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthTokenService } from '../auth/auth-token.service';
import { UserService } from '../settings/user.service';

@Injectable({ providedIn: 'root' })
export class SessionHubConnectionService {
  private _userService = inject(UserService);
  private _tokenService = inject(AuthTokenService);
  private _injector = inject(Injector);

  private _connection = signal<signalR.HubConnection | null>(null);
  private _connected = signal(false);

  constructor() {
    effect(() => {
      const user = this._userService.user();
      if (user) {
        this._connection.set(
          new signalR.HubConnectionBuilder()
            .withUrl(`/hubs/session?userId=${encodeURIComponent(user.id)}`, {
              accessTokenFactory: () => this._tokenService.getAccessToken || '',
            })
            .withAutomaticReconnect()
            .build()
        );
      }
    });

    effect(() => {
      const conn = this._connection();
      if (conn && !this._connected()) {
        from(conn.start()).subscribe({
          next: () => this._connected.set(true),
          error: () => this._connected.set(false),
        });
      }
    });
  }

  waitUntilConnected(): Observable<signalR.HubConnection> {
    return runInInjectionContext(this._injector, () =>
      toObservable(
        computed(() => this._connected() && this._connection() != null)
      ).pipe(
        filter(Boolean),
        map(() => this._connection()!),
        take(1)
      )
    );
  }

  invoke<T = void>(method: string, ...args: any[]): Observable<T> {
    return this.waitUntilConnected().pipe(
      switchMap((conn) => from(conn.invoke<T>(method, ...args))),
      catchError((err) =>
        throwError(() => new Error(`SignalR invoke failed: ${method}, ${err}`))
      )
    );
  }

  on<T>(method: string): Observable<T> {
    return this.waitUntilConnected().pipe(
      switchMap(
        (conn) =>
          new Observable<T>((subscriber) => {
            const handler = (data: T) => subscriber.next(data);
            conn.on(method, handler);

            return () => conn.off(method, handler);
          })
      )
    );
  }
}
