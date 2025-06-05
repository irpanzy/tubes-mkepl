const request = require('supertest');
const app = require('../../app');
const carService = require('../../services/car.service');

jest.mock('../../services/car.service');

describe('Car Controller', () => {
  const mockCars = [
    { id: 1, brand: 'Toyota', model: 'Corolla', year: 2020 },
    { id: 2, brand: 'Honda', model: 'Civic', year: 2021 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/cars', () => {
    it('should return all cars with success response', async () => {
      carService.getAllCars.mockResolvedValue(mockCars);

      const response = await request(app).get('/api/v1/cars').expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockCars,
      });
      expect(carService.getAllCars).toHaveBeenCalledTimes(1);
    });

    it('should return error when service fails', async () => {
      carService.getAllCars.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/v1/cars').expect(500);

      expect(response.body).toEqual({
        success: false,
        message: 'Database error',
      });
    });
  });

  describe('GET /api/v1/cars/:id', () => {
    it('should return car by id', async () => {
      const mockCar = mockCars[0];
      carService.getCarById.mockResolvedValue(mockCar);

      const response = await request(app).get('/api/v1/cars/1').expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockCar,
      });
      expect(carService.getCarById).toHaveBeenCalledWith(1);
    });

    it('should return 404 when car not found', async () => {
      carService.getCarById.mockResolvedValue(null);

      const response = await request(app).get('/api/v1/cars/999').expect(404);

      expect(response.body).toEqual({
        success: false,
        message: 'Car not found',
      });
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app)
        .get('/api/v1/cars/invalid')
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: 'Invalid car ID',
      });
    });

    it('should return error when service fails', async () => {
      carService.getCarById.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/v1/cars/1').expect(500);

      expect(response.body).toEqual({
        success: false,
        message: 'Database error',
      });
    });
  });

  describe('POST /api/v1/cars', () => {
    const validCarData = {
      brand: 'BMW',
      model: 'X5',
      year: 2023,
    };

    it('should create new car', async () => {
      const expectedCar = { id: 3, ...validCarData };
      carService.addCar.mockResolvedValue(expectedCar);

      const response = await request(app)
        .post('/api/v1/cars')
        .send(validCarData)
        .expect(201);

      expect(response.body).toEqual({
        success: true,
        data: expectedCar,
        message: 'Car created successfully',
      });
      expect(carService.addCar).toHaveBeenCalledWith(validCarData);
    });

    it('should return 400 when brand is missing', async () => {
      const invalidData = { model: 'X5', year: 2023 };

      const response = await request(app)
        .post('/api/v1/cars')
        .send(invalidData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: 'Brand, model, and year are required',
      });
    });

    it('should return 400 when model is missing', async () => {
      const invalidData = { brand: 'BMW', year: 2023 };

      const response = await request(app)
        .post('/api/v1/cars')
        .send(invalidData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: 'Brand, model, and year are required',
      });
    });

    it('should return 400 when year is missing', async () => {
      const invalidData = { brand: 'BMW', model: 'X5' };

      const response = await request(app)
        .post('/api/v1/cars')
        .send(invalidData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: 'Brand, model, and year are required',
      });
    });

    it('should return 400 when year is invalid', async () => {
      const invalidData = { brand: 'BMW', model: 'X5', year: 'invalid' };

      const response = await request(app)
        .post('/api/v1/cars')
        .send(invalidData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: 'Year must be a valid number',
      });
    });

    it('should return error when service fails', async () => {
      carService.addCar.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/v1/cars')
        .send(validCarData)
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        message: 'Database error',
      });
    });
  });

  describe('PUT /api/v1/cars/:id', () => {
    const updateData = { brand: 'Toyota', model: 'Camry' };

    it('should update existing car', async () => {
      const updatedCar = { id: 1, ...updateData, year: 2020 };
      carService.updateCar.mockResolvedValue(updatedCar);

      const response = await request(app)
        .put('/api/v1/cars/1')
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: updatedCar,
        message: 'Car updated successfully',
      });
      expect(carService.updateCar).toHaveBeenCalledWith(1, updateData);
    });

    it('should return 404 when car not found', async () => {
      carService.updateCar.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/v1/cars/999')
        .send(updateData)
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        message: 'Car not found',
      });
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app)
        .put('/api/v1/cars/invalid')
        .send(updateData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: 'Invalid car ID',
      });
    });

    it('should return 400 for invalid year', async () => {
      const invalidData = { year: 'invalid' };

      const response = await request(app)
        .put('/api/v1/cars/1')
        .send(invalidData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: 'Year must be a valid number',
      });
    });

    it('should return error when service fails', async () => {
      carService.updateCar.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/v1/cars/1')
        .send(updateData)
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        message: 'Database error',
      });
    });
  });

  describe('DELETE /api/v1/cars/:id', () => {
    it('should delete car successfully', async () => {
      carService.deleteCar.mockResolvedValue(true);

      const response = await request(app).delete('/api/v1/cars/1').expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Car deleted successfully',
      });
      expect(carService.deleteCar).toHaveBeenCalledWith(1);
    });

    it('should return 404 when car not found', async () => {
      carService.deleteCar.mockResolvedValue(false);

      const response = await request(app)
        .delete('/api/v1/cars/999')
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        message: 'Car not found',
      });
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app)
        .delete('/api/v1/cars/invalid')
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: 'Invalid car ID',
      });
    });

    it('should return error when service fails', async () => {
      carService.deleteCar.mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/api/v1/cars/1').expect(500);

      expect(response.body).toEqual({
        success: false,
        message: 'Database error',
      });
    });
  });
});
