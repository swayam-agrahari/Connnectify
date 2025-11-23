import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser"
import { postRouter } from './routes';

const app = express();
const port = process.env.PORT || 3003;


app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use("/api/posts", postRouter)


app.listen(port, () => {
    console.log("Post service is listenting at ", port)
})