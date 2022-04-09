import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ServiceStatus } from '../enums/status.enum';

@Injectable()
export class StatusGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
      const { body } = context.switchToHttp().getRequest();
      const invalidStatus = body?.status != ServiceStatus.Completed && body?.status != ServiceStatus.Started;

      if (invalidStatus) throw new BadRequestException();

      const invalidStartedOperation = body?.user?.type == 'Escort' && body?.status != ServiceStatus.Started;

      if (invalidStartedOperation) throw new ForbiddenException();

      const invalidCompletedOperation = body?.user?.type == 'Customer' && body?.status != ServiceStatus.Completed;

      if (invalidCompletedOperation) throw new ForbiddenException();

      return true;
  }
}