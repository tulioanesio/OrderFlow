import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class OrderService {
  @InjectQueue('orders-queue') private ordersQueue!: Queue;
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const order = await this.prisma.order.create({
      data: {
        ...createOrderDto,
      },
    });
    await this.ordersQueue.add('process-payment', {
      orderId: order.id,
      productId: order.productId,
      quantity: order.quantity,
    });

    return {
      message: 'Pedido recebido e em processamento',
      orderId: order.id,
    };
  }

  findAll() {
    return this.prisma.order.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
