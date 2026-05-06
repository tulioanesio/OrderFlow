import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../../generated/prisma/enums';

export class CreateOrderDto {
  @IsInt()
  quantity!: number;

  @IsNumber()
  total!: number;

  @ApiProperty({
    enum: OrderStatus,
    required: false,
    default: OrderStatus.CREATED,
  })
  @IsOptional()
  @IsEnum(OrderStatus, {
    message:
      'Status inválido. Valores permitidos: ' +
      Object.values(OrderStatus).join(', '),
  })
  status?: OrderStatus;

  @IsString()
  productId!: string;
}
