import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js";
import environment from "./utils/environment.js";
import prisma from "./config/prisma.js";

const PORT = environment.PORT;

process.on("SIGTERM", async () => {
  await prisma.$disconnect();

  console.log("Prisma disconnected");
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server is started on port ${PORT}`);
});
