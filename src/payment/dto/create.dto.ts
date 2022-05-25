import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePaymentMethodCatalogDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class CreatePaymentUserDTO {
  @IsNotEmpty()
  @IsString()
  paymentMethodId: string;

  @IsOptional()
  @IsString()
  userId: string;
}

export class MethodsDTO {
  @IsNotEmpty()
  @IsArray()
  methods: string[];
}
