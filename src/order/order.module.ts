import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { BullModule } from '@nestjs/bullmq';
import { OrderProcessor } from './order.processor';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [BullModule.registerQueue({ name: 'orders-queue' }),
            ProductModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderProcessor],
})
export class OrderModule {}
