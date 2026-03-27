import cors from "cors";
import express from "express";
import apiRoutes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Thrive Woman backend is running",
    baseUrl: "/api/v1"
  });
});

app.use("/api/v1", apiRoutes);
app.use(errorHandler);

export default app;
