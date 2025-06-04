const request = require('supertest');
const express = require('express');
const carRoutes = require('../../routes/car.routes');

// Mock the controller
jest.mock('../../controllers/car.controllers', () => ({
  getCars: jest.fn((req, res) => res.json({ message: 'getCars called' })),
  getCar: jest.fn((req, res) =>
    res.json({ message: 'getCar called', id: req.params.id })
  ),
  createCar: jest.fn((req, res) =>
    res.json({ message: 'createCar called', body: req.body })
  ),
  updateCar: jest.fn((req, res) =>
    res.json({ message: 'updateCar called', id: req.params.id, body: req.body })
  ),
  deleteCar: jest.fn((req, res) =>
    res.json({ message: 'deleteCar called', id: req.params.id })
  ),
}));

const carController = require('../../controllers/car.controllers');

describe('Car Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/cars', carRoutes);
    jest.clearAllMocks();
  });

  describe('GET /cars', () => {
    it('should call getCars controller', async () => {
      const response = await request(app).get('/cars').expect(200);

      expect(carController.getCars).toHaveBeenCalledTimes(1);
      expect(response.body.message).toBe('getCars called');
    });
  });

  describe('GET /cars/:id', () => {
    it('should call getCar controller with correct id', async () => {
      const response = await request(app).get('/cars/123').expect(200);

      expect(carController.getCar).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({
        message: 'getCar called',
        id: '123',
      });
    });
  });

  describe('POST /cars', () => {
    it('should call createCar controller with request body', async () => {
      const carData = { brand: 'BMW', model: 'X5', year: 2023 };

      const response = await request(app)
        .post('/cars')
        .send(carData)
        .expect(200);

      expect(carController.createCar).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({
        message: 'createCar called',
        body: carData,
      });
    });
  });

  describe('PUT /cars/:id', () => {
    it('should call updateCar controller with id and body', async () => {
      const updateData = { brand: 'Toyota', model: 'Camry' };

      const response = await request(app)
        .put('/cars/456')
        .send(updateData)
        .expect(200);

      expect(carController.updateCar).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({
        message: 'updateCar called',
        id: '456',
        body: updateData,
      });
    });
  });

  describe('DELETE /cars/:id', () => {
    it('should call deleteCar controller with correct id', async () => {
      const response = await request(app).delete('/cars/789').expect(200);

      expect(carController.deleteCar).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({
        message: 'deleteCar called',
        id: '789',
      });
    });
  });
});
