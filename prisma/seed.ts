import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando o seed de produtos... 🚀');

  const produtos = [
    {
      name: 'Produto Alpha',
      price: 150.0,
      stock: 120,
    },
    {
      name: 'Produto Beta',
      price: 45.5,
      stock: 3,
    },
    {
      name: 'Produto Gamma',
      price: 299.99,
      stock: 20,
    },
    {
      name: 'Produto Delta',
      price: 199.99,
      stock: 15,
    },
    {
      name: 'Produto Epsilon',
      price: 399.99,
      stock: 5,
    },
  ];

  for (const produto of produtos) {
    const p = await prisma.product.create({
      data: produto,
    });
    console.log(`Produto criado: ${p.name} (ID: ${p.id})`);
  }

  console.log('Seed de produtos concluído com sucesso! ✅');
}

main()
  .catch((e) => {
    console.error('Erro ao executar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });