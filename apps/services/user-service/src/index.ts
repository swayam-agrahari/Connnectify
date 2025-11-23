import express from "express"
import { authRouter } from "./routes/auth.js";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";


const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(express.json())
app.use(cookieParser());

app.use("/api/auth", authRouter)

app.get("/", (req, res) => {
  res.send("User Service is running")
})

app.listen(PORT, () => {
  console.log(`User Service is running on port ${PORT}`)
})
