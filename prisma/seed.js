const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.car.deleteMany();

  const cars = [
    { brand: 'Toyota', model: 'Corolla', year: 2020 },
    { brand: 'Honda', model: 'Civic', year: 2021 },
    { brand: 'Tesla', model: 'Model 3', year: 2022 },
    { brand: 'Ford', model: 'Mustang', year: 2023 },
    { brand: 'Chevrolet', model: 'Camaro', year: 2024 },
    { brand: 'BMW', model: 'X5', year: 2025 },
    { brand: 'Mercedes-Benz', model: 'GLC', year: 2026 },
    { brand: 'Audi', model: 'Q7', year: 2027 },
    { brand: 'Lamborghini', model: 'Huracan', year: 2028 },
    { brand: 'Ferrari', model: 'F8', year: 2029 },
  ];

  for (const car of cars) {
    await prisma.car.create({
      data: car,
    });
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
