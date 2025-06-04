const carService = require('../services/car.service');

async function getCars(req, res) {
  try {
    const cars = await carService.getAllCars();
    res.json({
      success: true,
      data: cars,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getCar(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid car ID',
      });
    }

    const car = await carService.getCarById(id);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    res.json({
      success: true,
      data: car,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function createCar(req, res) {
  try {
    const { brand, model, year } = req.body;

    // Validation
    if (!brand || !model || !year) {
      return res.status(400).json({
        success: false,
        message: 'Brand, model, and year are required',
      });
    }

    if (isNaN(parseInt(year))) {
      return res.status(400).json({
        success: false,
        message: 'Year must be a valid number',
      });
    }

    const car = await carService.addCar(req.body);
    res.status(201).json({
      success: true,
      data: car,
      message: 'Car created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function updateCar(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid car ID',
      });
    }

    const { year } = req.body;
    if (year && isNaN(parseInt(year))) {
      return res.status(400).json({
        success: false,
        message: 'Year must be a valid number',
      });
    }

    const updated = await carService.updateCar(id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    res.json({
      success: true,
      data: updated,
      message: 'Car updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function deleteCar(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid car ID',
      });
    }

    const success = await carService.deleteCar(id);
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    res.json({
      success: true,
      message: 'Car deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
};
