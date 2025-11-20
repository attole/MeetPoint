import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { sessionSettings } from '../home/create-session-dialog.component';
import { SessionHubConnectionService } from './session-hub-connection';

@Injectable({ providedIn: 'root' })
export class SessionHubService {
  private _connectionService = inject(SessionHubConnectionService);

  generateSessionToken(): Observable<string> {
    return this._connectionService.invoke<string>('GenerateToken');
  }

  checkSessionToken(token: string): Observable<boolean> {
    return this._connectionService.invoke<boolean>('CheckToken', token);
  }

  createSession(
    token: string,
    sessionType: string,
    settings: sessionSettings
  ): Observable<void> {
    return this._connectionService.invoke(
      'CreateSession',
      token,
      sessionType,
      settings
    );
  }

  deleteSession(token: string): Observable<void> {
    return this._connectionService.invoke('DeleteSession', token);
  }

  joinSession(token: string): Observable<void> {
    return this._connectionService.invoke('JoinSession', token);
  }

  leaveSession(token: string): Observable<void> {
    return this._connectionService.invoke('LeaveSession', token);
  }
}
