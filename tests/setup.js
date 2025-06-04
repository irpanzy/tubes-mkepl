// eslint-disable-next-line no-unused-vars
const { PrismaClient } = require('@prisma/client');

// Mock Prisma Client
const mockPrisma = {
  car: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  $disconnect: jest.fn(),
};

// Mock the PrismaClient constructor
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

// Make mockPrisma available globally for tests
global.mockPrisma = mockPrisma;

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Clean up after tests
afterAll(async () => {
  await mockPrisma.$disconnect();
});
