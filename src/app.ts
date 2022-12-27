import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import { dbConnection } from "./db/dbConnection";
import http from "http";
import router from "./routes/index";
const app = express();
const server = http.createServer(app);
import errorHandler from "./middleware/errorController";

dbConnection();
app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hey this is SPEKO Backend (-_-)");
});
app.all("*",(req:Request,res:Response)=>{
  res.status(404).json({message:"This route does not exists on the server."})
})

app.use(errorHandler)

server.listen(process.env.PORT, () => {
  console.log(`Listening to port ${process.env.PORT}`);
});
