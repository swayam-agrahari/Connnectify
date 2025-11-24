import express, { type Request, type Response } from "express";
import { prisma } from "./prisma";



export const universityRouter = express.Router();

//get all universities
universityRouter.get("/", async (req: Request, res: Response) => {
    try {
        console.log("Fetching all universities");
        const universities = await prisma.university.findMany();
        res.status(200).json(universities);
    } catch (error) {
        console.error("Error fetching universities:", error);
        res.status(500).json({ error: "Failed to fetch universities" });
    }
});

//get university by id
universityRouter.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "University ID is required" });
    }
    try {
        const university = await prisma.university.findUnique({
            where: { id },
        });
        if (!university) {
            return res.status(404).json({ error: "University not found" });
        }
        res.status(200).json(university);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch university" });
    }
});

