// eslint-disable-next-line no-unused-vars
const { PrismaClient } = require('@prisma/client');

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

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

global.mockPrisma = mockPrisma;

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await mockPrisma.$disconnect();
});
