import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js";
import environment from "./utils/environment.js";

const PORT = environment.PORT;

app.listen(PORT, () => {
  console.log(`Server is started on port ${PORT}`);
});
