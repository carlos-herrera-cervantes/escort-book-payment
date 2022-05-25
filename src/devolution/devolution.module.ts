import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DevolutionService } from './devolution.service';
import { Devolution, DevolutionSchema } from './schemas/devolution.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Devolution.name, schema: DevolutionSchema },
    ]),
  ],
  providers: [DevolutionService],
  controllers: [],
  exports: [],
})
export class DevolutionModule {}
