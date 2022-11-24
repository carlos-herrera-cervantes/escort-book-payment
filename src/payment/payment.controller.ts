import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessageResponse } from '../common/dto/message-response.dto';
import { CreatePaymentMethodCatalogDTO, MethodsDTO } from './dto/create.dto';
import {
  LinkPaymentMethodGuard,
  LinkPaymentMethodsGuard,
} from './guards/link-payment-method.guard';
import { PaymentMethodGuard } from './guards/payment-method.guard';
import { PaymentService } from './payment.service';
import { PaymentMethodCatalog } from './schemas/payment-method-catalog.schema';
import { UserPayment } from './schemas/user-payment.schema';

@Controller('api/v1/payments')
export class PaymentController {
  @Inject(PaymentService)
  private readonly paymentService: PaymentService;

  @Inject(EventEmitter2)
  private readonly eventEmitter: EventEmitter2;

  @Get('methods')
  async getPaymentMethods(): Promise<PaymentMethodCatalog[]> {
    return this.paymentService.getPaymentMethods({ deleted: false });
  }

  @Get('link')
  async getLinkedPaymentMethods(@Req() req: any): Promise<UserPayment[]> {
    const filter = { userId: req?.body?.user?.id };
    const populateFilter = { path: 'paymentMethodId' };
    return this.paymentService.getLinkedPaymentMethods(filter, populateFilter);
  }

  @Get('methods/:id/user')
  async getLinkedPaymentMethodsByUser(@Param('id') id: string): Promise<UserPayment[]> {
    const filter = { userId: id };
    const populateFilter = { path: 'paymentMethodId' };
    return this.paymentService.getLinkedPaymentMethods(filter, populateFilter);
  }

  @Post('methods')
  async createPaymentMethod(@Body() paymentMethod: CreatePaymentMethodCatalogDTO): Promise<PaymentMethodCatalog> {
    return this.paymentService.createPaymentMethod(paymentMethod).catch((err) => { throw new ConflictException(err); });
  }

  @Post('link')
  @UseGuards(LinkPaymentMethodsGuard)
  async linkPaymentMethods(@Req() req: any, @Body() body: MethodsDTO): Promise<MessageResponse> {
    const linkPayments = body.methods.map((element) => ({
      userId: req?.body?.user?.id,
      paymentMethodId: element,
    }));

    await this.paymentService.linkPaymentMethods(linkPayments);
    return { message: 'OK' };
  }

  @Delete('methods/:id')
  @UseGuards(PaymentMethodGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDeletePaymentMethod(@Param('id') id: string): Promise<void> {
    await this.paymentService.softDeletePaymentMethod({ _id: id });
    this.eventEmitter.emit('soft.delete.payment.method', id);
  }

  @Delete('unlink/:id')
  @UseGuards(LinkPaymentMethodGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlinkPaymentMethod(@Param('id') id: string): Promise<void> {
    await this.paymentService.unlinkPaymentMethod({ paymentMethodId: id });
  }
}
