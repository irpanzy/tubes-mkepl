const carService = require('../../services/car.service');
const mockPrisma = require('../../prisma');

describe('Car Service', () => {
  const mockCars = [
    { id: 1, brand: 'Toyota', model: 'Corolla', year: 2020 },
    { id: 2, brand: 'Honda', model: 'Civic', year: 2021 },
    { id: 3, brand: 'Tesla', model: 'Model 3', year: 2022 },
  ];

  const mockCarData = {
    brand: 'BMW',
    model: 'X5',
    year: 2023,
  };

  describe('getAllCars', () => {
    it('should return all cars', async () => {
      mockPrisma.car.findMany.mockResolvedValue(mockCars);

      const result = await carService.getAllCars();

      expect(mockPrisma.car.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCars);
    });

    it('should throw error when database fails', async () => {
      mockPrisma.car.findMany.mockRejectedValue(new Error('Database error'));

      await expect(carService.getAllCars()).rejects.toThrow(
        'Failed to fetch cars'
      );
      expect(mockPrisma.car.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCarById', () => {
    it('should return car by id', async () => {
      const mockCar = mockCars[0];
      mockPrisma.car.findUnique.mockResolvedValue(mockCar);

      const result = await carService.getCarById(1);

      expect(mockPrisma.car.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockCar);
    });

    it('should return null when car not found', async () => {
      mockPrisma.car.findUnique.mockResolvedValue(null);

      const result = await carService.getCarById(999);

      expect(mockPrisma.car.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(result).toBeNull();
    });

    it('should throw error when database fails', async () => {
      mockPrisma.car.findUnique.mockRejectedValue(new Error('Database error'));

      await expect(carService.getCarById(1)).rejects.toThrow(
        'Failed to fetch car'
      );
    });
  });

  describe('addCar', () => {
    it('should create new car', async () => {
      const expectedCar = { id: 4, ...mockCarData };
      mockPrisma.car.create.mockResolvedValue(expectedCar);

      const result = await carService.addCar(mockCarData);

      expect(mockPrisma.car.create).toHaveBeenCalledWith({
        data: {
          brand: mockCarData.brand,
          model: mockCarData.model,
          year: mockCarData.year,
        },
      });
      expect(result).toEqual(expectedCar);
    });

    it('should convert year to integer', async () => {
      const carDataWithStringYear = { ...mockCarData, year: '2023' };
      const expectedCar = { id: 4, ...mockCarData };
      mockPrisma.car.create.mockResolvedValue(expectedCar);

      await carService.addCar(carDataWithStringYear);

      expect(mockPrisma.car.create).toHaveBeenCalledWith({
        data: {
          brand: mockCarData.brand,
          model: mockCarData.model,
          year: 2023,
        },
      });
    });

    it('should throw error when database fails', async () => {
      mockPrisma.car.create.mockRejectedValue(new Error('Database error'));

      await expect(carService.addCar(mockCarData)).rejects.toThrow(
        'Failed to create car'
      );
    });
  });

  describe('updateCar', () => {
    it('should update existing car', async () => {
      const updatedData = { brand: 'Toyota', model: 'Camry' };
      const expectedCar = { id: 1, ...updatedData, year: 2020 };
      mockPrisma.car.update.mockResolvedValue(expectedCar);

      const result = await carService.updateCar(1, updatedData);

      expect(mockPrisma.car.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          brand: updatedData.brand,
          model: updatedData.model,
        },
      });
      expect(result).toEqual(expectedCar);
    });

    it('should return null when car not found', async () => {
      const error = new Error('Record not found');
      error.code = 'P2025';
      mockPrisma.car.update.mockRejectedValue(error);

      const result = await carService.updateCar(999, { brand: 'BMW' });

      expect(result).toBeNull();
    });

    it('should convert year to integer when updating', async () => {
      const updatedData = { year: '2024' };
      const expectedCar = {
        id: 1,
        brand: 'Toyota',
        model: 'Corolla',
        year: 2024,
      };
      mockPrisma.car.update.mockResolvedValue(expectedCar);

      await carService.updateCar(1, updatedData);

      expect(mockPrisma.car.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          year: 2024,
        },
      });
    });

    it('should throw error when database fails', async () => {
      mockPrisma.car.update.mockRejectedValue(new Error('Database error'));

      await expect(carService.updateCar(1, { brand: 'BMW' })).rejects.toThrow(
        'Failed to update car'
      );
    });
  });

  describe('deleteCar', () => {
    it('should delete car and return true', async () => {
      mockPrisma.car.delete.mockResolvedValue({});

      const result = await carService.deleteCar(1);

      expect(mockPrisma.car.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toBe(true);
    });

    it('should return false when car not found', async () => {
      const error = new Error('Record not found');
      error.code = 'P2025';
      mockPrisma.car.delete.mockRejectedValue(error);

      const result = await carService.deleteCar(999);

      expect(result).toBe(false);
    });

    it('should throw error when database fails', async () => {
      mockPrisma.car.delete.mockRejectedValue(new Error('Database error'));

      await expect(carService.deleteCar(1)).rejects.toThrow(
        'Failed to delete car'
      );
    });
  });
});
