## Setup Project

## Testing Guide

### Test Structure

```
tests/
├── setup.js                  # Global test configuration dan mock setup
├── services/                 # Unit tests untuk service layer
│   └── car.service.test.js
├── controllers/              # Unit tests untuk controller layer
│   └── car.controller.test.js
├── routes/                   # Integration tests untuk routes
│   └── car.routes.test.js
├── e2e/                      # End-to-end tests
│   └── car.e2e.test.js
└── app.test.js               # Application integration tests
```

### Test Commands

#### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with detailed output
npm run test:verbose
```

#### Specific Test Types

```bash
# Run only unit tests (services & controllers)
npm run test:unit

# Run only integration tests (routes & app)
npm run test:integration

# Run only end-to-end tests
npm run test:e2e
```

### Test Categories

#### 1. Unit Tests

**Service Tests (`car.service.test.js`)**

- Tests semua fungsi di service layer
- Mock Prisma Client untuk isolasi
- Test cases:
  - ✅ Normal operations (CRUD)
  - ✅ Error handling
  - ✅ Data validation
  - ✅ Type conversion (string to int)
  - ✅ Prisma error codes (P2025)

**Controller Tests (`car.controller.test.js`)**

- Tests HTTP request/response handling
- Mock service layer
- Test cases:
  - ✅ Valid requests dengan proper responses
  - ✅ Invalid input validation
  - ✅ Error handling dan status codes
  - ✅ Request parameter validation

#### 2. Integration Tests

**Route Tests (`car.routes.test.js`)**

- Tests route configuration
- Mock controllers
- Memastikan routes terhubung dengan controller yang benar

**App Tests (`app.test.js`)**

- Tests middleware setup
- Tests route mounting
- Tests error handling di application level

#### 3. End-to-End Tests

**E2E Tests (`car.e2e.test.js`)**

- Tests complete user workflow
- Tests API dari HTTP request sampai response
- Test cases:
  - ✅ Complete CRUD flow
  - ✅ Error scenarios (404, 400, 500)
  - ✅ Data validation
  - ✅ Response format consistency
  - ✅ HTTP status codes

### Mock Strategy

#### Prisma Client Mock

```javascript
// Automatic mock setup di tests/setup.js
const mockPrisma = {
  car: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};
```

#### Service Layer Mock

```javascript
// Mock service untuk controller tests
jest.mock("../../services/car.service");
```

### Test Data

#### Mock Cars Data

```javascript
const mockCars = [
  { id: 1, brand: "Toyota", model: "Corolla", year: 2020 },
  { id: 2, brand: "Honda", model: "Civic", year: 2021 },
  { id: 3, brand: "Tesla", model: "Model 3", year: 2022 },
];
```

### Coverage Report

Test coverage meliputi:

- ✅ Controllers (semua functions)
- ✅ Services (semua functions)
- ✅ Routes (semua endpoints)
- ✅ App configuration

Target coverage: **90%+**

#### View Coverage Report

```bash
npm run test:coverage
```

Coverage report tersedia di:

- Terminal output
- `coverage/lcov-report/index.html` (detailed HTML report)

### Test Best Practices

#### 1. Test Structure (AAA Pattern)

```javascript
it("should create new car", async () => {
  // Arrange
  const carData = { brand: "BMW", model: "X5", year: 2023 };
  mockPrisma.car.create.mockResolvedValue({ id: 1, ...carData });

  // Act
  const result = await carService.addCar(carData);

  // Assert
  expect(result).toEqual({ id: 1, ...carData });
  expect(mockPrisma.car.create).toHaveBeenCalledWith({
    data: carData,
  });
});
```

#### 2. Mock Reset

```javascript
beforeEach(() => {
  jest.clearAllMocks(); // Reset semua mocks sebelum setiap test
});
```

#### 3. Error Testing

```javascript
it("should handle database errors", async () => {
  mockPrisma.car.findMany.mockRejectedValue(new Error("Database error"));

  await expect(carService.getAllCars()).rejects.toThrow("Failed to fetch cars");
});
```

#### 4. Async Testing

```javascript
// Gunakan async/await untuk testing async functions
it("should return cars", async () => {
  const result = await carService.getAllCars();
  expect(result).toBeDefined();
});
```

### Common Test Scenarios

#### 1. Success Cases

- Valid data input
- Successful CRUD operations
- Correct response format

#### 2. Error Cases

- Invalid input data
- Missing required fields
- Database connection errors
- Record not found (404)
- Server errors (500)

#### 3. Edge Cases

- Empty datasets
- Invalid data types
- Boundary values
- Malformed requests

### Debugging Tests

#### Run Specific Test

```bash
# Run specific test file
npx jest car.service.test.js

# Run specific test case
npx jest -t "should create new car"
```

#### Debug Mode

```bash
# Run with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Run with detailed error output
npx jest --verbose --no-cache
```

### CI/CD Integration

Test commands untuk CI/CD pipeline:

```bash
# Linting sebelum test
npm run lint

# Run all tests
npm test

# Check coverage threshold
npm run test:coverage -- --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80,"statements":80}}'
```
