const request = require('supertest');
const app = require('../app');

// Mock the entire car service
jest.mock('../services/car.service', () => ({
  getAllCars: jest.fn(),
  getCarById: jest.fn(),
  addCar: jest.fn(),
  updateCar: jest.fn(),
  deleteCar: jest.fn(),
}));

describe('App Integration Tests', () => {
  describe('Middleware', () => {
    it('should parse JSON requests', async () => {
      const carService = require('../services/car.service');
      carService.addCar.mockResolvedValue({
        id: 1,
        brand: 'BMW',
        model: 'X5',
        year: 2023,
      });

      const response = await request(app)
        .post('/api/v1/cars')
        .send({ brand: 'BMW', model: 'X5', year: 2023 })
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/v1/cars')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('API Routes', () => {
    it('should mount routes under /api/v1', async () => {
      const carService = require('../services/car.service');
      carService.getAllCars.mockResolvedValue([]);

      const response = await request(app).get('/api/v1/cars').expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 404 for non-existent routes', async () => {
      await request(app).get('/api/v1/nonexistent').expect(404);
    });

    it('should return 404 for routes without /api/v1 prefix', async () => {
      await request(app).get('/cars').expect(404);
    });
  });

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      const carService = require('../services/car.service');
      carService.getAllCars.mockRejectedValue(
        new Error('Database connection failed')
      );

      const response = await request(app).get('/api/v1/cars').expect(500);

      expect(response.body).toEqual({
        success: false,
        message: 'Database connection failed',
      });
    });
  });

  describe('CORS and Headers', () => {
    it('should accept JSON content type', async () => {
      const carService = require('../services/car.service');
      carService.addCar.mockResolvedValue({
        id: 1,
        brand: 'BMW',
        model: 'X5',
        year: 2023,
      });

      await request(app)
        .post('/api/v1/cars')
        .set('Content-Type', 'application/json')
        .send({ brand: 'BMW', model: 'X5', year: 2023 })
        .expect(201);
    });

    it('should return JSON responses', async () => {
      const carService = require('../services/car.service');
      carService.getAllCars.mockResolvedValue([]);

      const response = await request(app).get('/api/v1/cars').expect(200);

      expect(response.headers['content-type']).toMatch(/json/);
    });
  });
});
