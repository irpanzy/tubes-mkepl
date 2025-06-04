// services/car.service.js

let cars = require('../models/car.model');

function getAllCars() {
  return cars;
}

function getCarById(id) {
  return cars.find((car) => car.id === id);
}

function addCar(carData) {
  const newCar = {
    id: cars.length ? cars[cars.length - 1].id + 1 : 1,
    ...carData,
  };
  cars.push(newCar);
  return newCar;
}

function updateCar(id, updatedData) {
  const index = cars.findIndex((car) => car.id === id);
  if (index === -1) return null;

  cars[index] = { ...cars[index], ...updatedData };
  return cars[index];
}

function deleteCar(id) {
  const index = cars.findIndex((car) => car.id === id);
  if (index === -1) return false;

  cars.splice(index, 1);
  return true;
}

module.exports = {
  getAllCars,
  getCarById,
  addCar,
  updateCar,
  deleteCar,
};
