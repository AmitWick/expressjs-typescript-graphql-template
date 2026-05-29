import { PrismaClient } from "@prisma/client";
import environment from "@/utils/environment.js";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";

// const adapter = new PrismaNeon({
//   connectionString: environment.DATABASE_URL!,
// });

const adapter = new PrismaPg({
  connectionString: environment.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter, log: ["query"] });
// const prisma = new PrismaClient({
//   adapter,
// });

export default prisma;
