import { PrismaClient } from '../generated/prisma';

// This prevents TypeScript errors when accessing `globalThis.prisma`.
declare global {
  var prisma: PrismaClient | undefined;
}

// Type cast `globalThis` to include our custom `prisma` property.
// This gives us proper type safety when accessing `globalForPrisma.prisma`.
const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

// Use the existing global PrismaClient instance if it exists,
// or create a new one if not.
const Db = globalForPrisma.prisma ?? new PrismaClient();

// In development mode, store the PrismaClient instance on the global object.
// This avoids creating a new client every time the server reloads (e.g., with hot-reloading).
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = Db;
}

// Export the PrismaClient instance for use throughout the app
export default Db;
