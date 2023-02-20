import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import RequestWithUser from './requestWithUser.interface';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const user = request.user;
    return user.admin;
  }
}
