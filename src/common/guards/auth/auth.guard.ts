import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  /**
   * Constructur for AuthGuard.
   * 
   * @param authService 
   */
  constructor(@Inject(AuthService) private authService: AuthService) {}

  /**
   * @inheritdoc
   * 
   * @param context 
   * @returns boolean
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers['authorization'];
    if (authorization === null || authorization === undefined) return false;

    const accessToken = authorization.replace('Bearer', '').trim();

    // special case for /auth/check endpoint, no need to renew token
    // because renew token procedure will be handled in controller and service.
    return this.authService.checkAccessTokenForGuard({
      accessToken: accessToken
    }, (request.url === '/auth/check') ? false : true);
  }
}
