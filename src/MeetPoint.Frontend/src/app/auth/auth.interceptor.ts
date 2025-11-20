import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { SKIP_AUTH } from '../http-context.tokens';
import { AuthTokenService } from './auth-token.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_AUTH)) return next(req);

  const tokenService = inject(AuthTokenService);
  const prepare = () => {
    return !tokenService.tokensInvalid()
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${tokenService.getAccessToken}`,
          },
        })
      : req;
  };

  if (tokenService.isAccessTokenExpiringSoon()) {
    return tokenService.refresh().pipe(switchMap(() => next(prepare())));
  }

  return next(prepare());
};
