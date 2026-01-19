import { PrismaClient } from "@prisma/client";

let prismaClient: PrismaClient | null = null;

export const prisma = (() => {
  if (!prismaClient) {
    prismaClient = new PrismaClient();
  }
  return prismaClient;
})();
