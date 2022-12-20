import http from "http";
import express, { Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
require("express-async-errors");
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import router from "./routes";
import errorHandler from "./middleware/errorController";
import { dbConnection } from "./db/dbConnection";

const app = express();
const server = http.createServer(app);

if (process.env.NODE_ENV === "production") {
  app.use(morgan("tiny"));
}

dbConnection();

app.use(helmet());
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(
  cors({
    credentials: true,
    origin: `${process.env.FRONTEND_URL}`,
  })
);

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("SPEKO BACKEND SAYS HELLO TO YOU!");
});

app.all("*", (req: Request, res: Response) => {
  res
    .status(404)
    .json({ status: "fail", message: "This route doesn't exist on server!" });
});

app.use(errorHandler);

server.listen(process.env.PORT, () => {
  console.log(`App is running in port ${process.env.PORT}`);
});
