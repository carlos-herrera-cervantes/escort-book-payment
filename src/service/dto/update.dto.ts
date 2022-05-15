import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ServiceStatus } from '../enums/status.enum';

export class UpdateServiceDTO {
    @IsNotEmpty()
    @IsEnum(ServiceStatus)
    status: ServiceStatus;

    @IsOptional()
    @IsString()
    cardId: string;
}
