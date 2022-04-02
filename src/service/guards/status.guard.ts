import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ServiceStatus } from '../enums/status.enum';

@Injectable()
export class StatusGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
      const { body } = context.switchToHttp().getRequest();

      if (body?.status != ServiceStatus.Completed) throw new BadRequestException();
      
      return true;
  }
}