import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionHubConnectionService } from './session-hub-connection';

@Injectable({ providedIn: 'root' })
export class SessionHubUsersService {
  private _connectionService = inject(SessionHubConnectionService);

  isOwner(token: string): Observable<boolean> {
    return this._connectionService.invoke<boolean>('IsOwner', token);
  }
}
