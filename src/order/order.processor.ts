import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { ProductService } from '../product/product.service';

@Processor('orders-queue')
export class OrderProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`Processando pedido: ${job.data.orderId}`);
    
    try {
        const product = await this.productService.findOne(job.data.productId);
        if(!product) {
          throw new Error('Produto não encontrado');
        }
        if(job.data.quantity > product.stock) {

          throw new Error('Sem estoque suficiente');
        }
         await this.productService.update(job.data.productId, { stock: product.stock - job.data.quantity });

         await this.prisma.order.update({
          where: { id: job.data.orderId },
          data: { status: 'COMPLETED' },
        });

        return {
          message: 'Pedido processado com sucesso',
          orderId: job.data.orderId,
        };
    } catch (error) {
        await this.prisma.order.update({
          where: { id: job.data.orderId },
          data: { status: 'STOCK_FAILED' },
        });
      console.error('Falha ao processar pedido', error);
      throw error; 
    }
  }
}