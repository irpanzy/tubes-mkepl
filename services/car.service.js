const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getAllCars() {
  try {
    return await prisma.car.findMany();
  } catch (error) {
    throw new Error('Failed to fetch cars');
  }
}

async function getCarById(id) {
  try {
    return await prisma.car.findUnique({
      where: { id: parseInt(id) },
    });
  } catch (error) {
    throw new Error('Failed to fetch car');
  }
}

async function addCar(carData) {
  try {
    const { brand, model, year } = carData;
    return await prisma.car.create({
      data: {
        brand,
        model,
        year: parseInt(year),
      },
    });
  } catch (error) {
    throw new Error('Failed to create car');
  }
}

async function updateCar(id, updatedData) {
  try {
    const { brand, model, year } = updatedData;
    return await prisma.car.update({
      where: { id: parseInt(id) },
      data: {
        ...(brand && { brand }),
        ...(model && { model }),
        ...(year && { year: parseInt(year) }),
      },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return null; 
    }
    throw new Error('Failed to update car');
  }
}

async function deleteCar(id) {
  try {
    await prisma.car.delete({
      where: { id: parseInt(id) },
    });
    return true;
  } catch (error) {
    if (error.code === 'P2025') {
      return false; 
    }
    throw new Error('Failed to delete car');
  }
}

module.exports = {
  getAllCars,
  getCarById,
  addCar,
  updateCar,
  deleteCar,
};
