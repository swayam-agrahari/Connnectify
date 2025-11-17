import express, { type Request, type Response } from "express";
import prisma from "@/prisma/index.js";


export const universityRouter = express.Router();

//get all communities for a university
universityRouter.get("/:universityId/communities", async (req: Request, res: Response) => {
    const { universityId } = req.params;

    if (!universityId) {
        return res.status(400).json({ message: "University ID is required" });
    }

    try {
        // Fetch all communities for the given university ID
        const communities = await prisma.community.findMany({
            where: { universityId },
            include: {
                university: {
                    select: {
                        id: true,
                        name: true,
                        emailDomain: true,
                        logoImageUrl: true
                    },
                },
            },
            orderBy: { name: "asc" }, // optional: sort alphabetically
        });

        if (!communities || communities.length === 0) {
            return res.status(404).json({ message: "No communities found for this university" });
        }

        res.status(200).json({ communities });
    } catch (error) {
        console.error("Error fetching communities:", error);
        res.status(500).json({ error: "Failed to fetch communities" });
    }
});


