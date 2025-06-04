// controllers/car.controller.js

const carService = require('../services/car.service');

function getCars(req, res) {
  const cars = carService.getAllCars();
  res.json(cars);
}

function getCar(req, res) {
  const id = parseInt(req.params.id);
  const car = carService.getCarById(id);
  if (!car) {
    return res.status(404).json({ message: 'Car not found' });
  }
  res.json(car);
}

function createCar(req, res) {
  const car = carService.addCar(req.body);
  res.status(201).json(car);
}

function updateCar(req, res) {
  const id = parseInt(req.params.id);
  const updated = carService.updateCar(id, req.body);
  if (!updated) {
    return res.status(404).json({ message: 'Car not found' });
  }
  res.json(updated);
}

function deleteCar(req, res) {
  const id = parseInt(req.params.id);
  const success = carService.deleteCar(id);
  if (!success) {
    return res.status(404).json({ message: 'Car not found' });
  }
  res.status(204).send();
}

module.exports = {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
};
