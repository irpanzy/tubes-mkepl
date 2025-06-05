const request = require('supertest');
const app = require('../../app');
const mockPrisma = require('../../prisma');

const mockCars = [
  { id: 1, brand: 'Toyota', model: 'Corolla', year: 2020 },
  { id: 2, brand: 'Honda', model: 'Civic', year: 2021 },
  { id: 3, brand: 'Tesla', model: 'Model 3', year: 2022 },
];

describe('Car API E2E Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockPrisma.car.findMany.mockResolvedValue(mockCars);
    mockPrisma.car.findUnique.mockImplementation(({ where }) => {
      const car = mockCars.find((c) => c.id === where.id);
      return Promise.resolve(car || null);
    });
    mockPrisma.car.create.mockImplementation(({ data }) => {
      const newCar = { id: mockCars.length + 1, ...data };
      return Promise.resolve(newCar);
    });
    mockPrisma.car.update.mockImplementation(({ where, data }) => {
      const car = mockCars.find((c) => c.id === where.id);
      if (!car) {
        const error = new Error('Record not found');
        error.code = 'P2025';
        return Promise.reject(error);
      }
      const updatedCar = { ...car, ...data };
      return Promise.resolve(updatedCar);
    });
    mockPrisma.car.delete.mockImplementation(({ where }) => {
      const car = mockCars.find((c) => c.id === where.id);
      if (!car) {
        const error = new Error('Record not found');
        error.code = 'P2025';
        return Promise.reject(error);
      }
      return Promise.resolve({});
    });
  });

  describe('Complete Car CRUD Flow', () => {
    it('should perform complete CRUD operations', async () => {
      let response = await request(app).get('/api/v1/cars').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);

      response = await request(app).get('/api/v1/cars/1').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.brand).toBe('Toyota');

      const newCarData = {
        brand: 'BMW',
        model: 'X5',
        year: 2023,
      };

      response = await request(app)
        .post('/api/v1/cars')
        .send(newCarData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.brand).toBe('BMW');
      expect(response.body.message).toBe('Car created successfully');

      const updateData = {
        brand: 'BMW',
        model: 'X7',
        year: 2024,
      };

      response = await request(app)
        .put('/api/v1/cars/1')
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.model).toBe('X7');
      expect(response.body.message).toBe('Car updated successfully');

      response = await request(app).delete('/api/v1/cars/1').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Car deleted successfully');
    });
  });

  describe('Error Scenarios', () => {
    it('should handle 404 errors properly', async () => {
      await request(app).get('/api/v1/cars/999').expect(404);

      await request(app)
        .put('/api/v1/cars/999')
        .send({ brand: 'BMW' })
        .expect(404);

      await request(app).delete('/api/v1/cars/999').expect(404);
    });

    it('should handle validation errors', async () => {
      await request(app)
        .post('/api/v1/cars')
        .send({ brand: 'BMW' })
        .expect(400);

      await request(app)
        .post('/api/v1/cars')
        .send({ brand: 'BMW', model: 'X5', year: 'invalid' })
        .expect(400);

      await request(app).get('/api/v1/cars/invalid').expect(400);
    });

    it('should handle database errors', async () => {
      mockPrisma.car.findMany.mockRejectedValue(
        new Error('Connection timeout')
      );

      await request(app).get('/api/v1/cars').expect(500);
    });
  });

  describe('Data Types and Validation', () => {
    it('should handle different year formats', async () => {
      const carWithStringYear = {
        brand: 'Ford',
        model: 'Focus',
        year: '2021',
      };

      const response = await request(app)
        .post('/api/v1/cars')
        .send(carWithStringYear)
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    it('should validate required fields strictly', async () => {
      const testCases = [
        { brand: '', model: 'Test', year: 2021 },
        { brand: 'Test', model: '', year: 2021 },
        { brand: 'Test', model: 'Test', year: '' },
        { brand: null, model: 'Test', year: 2021 },
        { brand: 'Test', model: null, year: 2021 },
        { brand: 'Test', model: 'Test', year: null },
      ];

      for (const testCase of testCases) {
        await request(app).post('/api/v1/cars').send(testCase).expect(400);
      }
    });
  });

  describe('Response Format Consistency', () => {
    it('should return consistent success response format', async () => {
      const response = await request(app).get('/api/v1/cars').expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return consistent error response format', async () => {
      const response = await request(app).get('/api/v1/cars/999').expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.message).toBe('string');
    });
  });

  describe('HTTP Methods and Status Codes', () => {
    it('should return correct status codes for different operations', async () => {
      await request(app).get('/api/v1/cars').expect(200);

      await request(app)
        .post('/api/v1/cars')
        .send({ brand: 'BMW', model: 'X5', year: 2023 })
        .expect(201);

      await request(app)
        .put('/api/v1/cars/1')
        .send({ brand: 'Toyota' })
        .expect(200);

      await request(app).delete('/api/v1/cars/1').expect(200);
    });
  });
});
