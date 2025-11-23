import express from "express"
import { communityRouter } from "../src/routes/communities";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";
import { universityRouter } from "./routes/university";

const app = express()
const PORT = process.env.PORT || 3002

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json())

app.use("/api/community", communityRouter)
app.use("/api/university", universityRouter)

app.get("/", (req, res) => {
  res.send("User Service is running")
})

app.listen(PORT, () => {
  console.log(`Community Service is running on port ${PORT}`)
})