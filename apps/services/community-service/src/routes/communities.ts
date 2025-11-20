import express, { type Request, type Response } from "express";
import prisma from "@/prisma/index.js";
import { communityMiddleware, type AuthenticatedRequest } from "@/utils/communityMiddleware";

export const communityRouter = express.Router();

//get all communities for a university
communityRouter.get("/university", communityMiddleware, async (req: AuthenticatedRequest, res: Response) => {

    try {

        const uId = req.user?.uid;

        if (!uId) {
            return res.status(403).json({ "msg": "unauthorized" })
        }
        const data = await prisma.community.findMany({
            where: {
                universityId: uId,
            },
            include: {
                _count: {
                    select: {
                        members: true
                    }
                },


            }
        })

        if (!data) {
            console.log("not have comunities");
            res.status(404).json({
                "communities": "not found"
            })
        }

        res.status(200).json({
            "communities": data
        }
        )
    } catch (error) {
        console.log("not have comunities");
        res.status(404).json({
            "communities": error
        })
    }
})


//get all created communities for a user
communityRouter.get("/user", communityMiddleware, async (req: AuthenticatedRequest, res: Response) => {

    try {
        const userId = req.user?.userId
        if (!userId) {
            return res.status(403).json({ "msg": "unauthorized" })
        }

        const data = await prisma.community.findMany({
            where: {
                creator: userId
            },
            include: {
                _count: {
                    select: {
                        members: true
                    }
                },

            }
        })

        if (!data) {
            console.log("not have comunities");
            res.status(404).json({
                "communities": "my community not found"
            })
        }

        res.status(200).json({
            "communities": data
        }
        )
    } catch (error) {
        console.log("not have comunities");
        res.status(404).json({
            "communities": error
        })
    }
})

//get all joined communities for a user
communityRouter.get("/user/communities", communityMiddleware, async (req: AuthenticatedRequest, res: Response) => {

    const userId = req.user?.userId;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    const communities = await prisma.community.findMany({
        where: {
            members: {
                some: {
                    userId: userId
                }
            }
        },
        include: {
            _count: {
                select: {
                    members: true
                }
            }
        }
    });

    res.status(200).json({ "communities": communities, "userId": userId });
});

//community details by id
communityRouter.get("/:communityId", communityMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const { communityId } = req.params;
    const { uid } = req.user!;

    console.log(`User ${uid} is requesting community with ID: ${communityId}`);

    if (!communityId) {
        return res.status(400).json({ error: "Community ID is required" });
    }

    try {
        const community = await prisma.community.findUnique({
            where: {
                id: communityId
            },
            include: {
                _count: {
                    select: {
                        members: true
                    }
                }
            }
        });

        if (!community) {
            return res.status(404).json({ error: "Community not found" });
        }

        res.status(200).json({ community });
    } catch (error) {
        console.error("Error fetching community by ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


//get community details by name
communityRouter.get("/:name", communityMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const { name } = req.params;
    const { uid } = req.user!;

    console.log(`User ${uid} is requesting community with name: ${name}`);

    if (!name) {
        return res.status(400).json({ error: "Community name is required" });
    }

    try {
        const community = await prisma.community.findUnique({
            where: {
                universityId_name: {
                    name: name,
                    universityId: uid
                }
            },
        });

        if (!community) {
            return res.status(404).json({ error: "Community not found" });
        }

        res.status(200).json({ community });
    } catch (error) {
        console.error("Error fetching community by name:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Join a community for a user (one endpoint)
communityRouter.post("/:communityId/join-leave", communityMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    console.log("in here")
    const { communityId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    if (!communityId) {
        return res.status(400).json({ error: "Community ID is required" });
    }

    try {

        const community = await prisma.community.findUnique({
            where: { id: communityId },
        });

        if (!community) {
            return res.status(404).json({ error: "Community not found" });
        }
        // Check if user is already a member
        const existingMembership = await prisma.membership.findUnique({
            where: {
                userId_communityId: {
                    userId,
                    communityId,
                },
            },
        });

        if (existingMembership) {
            return res.status(400).json({ error: "User already joined this community" });
        }

        // Create membership (Join)
        const membership = await prisma.membership.create({
            data: {
                userId,
                communityId,
            },
        });

        return res.status(201).json({
            message: "Successfully joined the community",
            membership,
        });

    } catch (error) {
        console.error("Error processing community join/leave:", error);
        res.status(500).json({ error: "Failed to process community join/leave" });
    }
}
);

//Leave a community for a user
communityRouter.delete("/:communityId/join-leave", communityMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const { communityId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    if (!communityId) {
        return res.status(400).json({ error: "Community ID is required" });
    }

    try {

        const membership = await prisma.membership.findUnique({
            where: {
                userId_communityId: {
                    userId,
                    communityId,
                },
            },
        });

        if (!membership) {
            return res.status(404).json({ error: "User is not a member of this community" });
        }

        // Delete the membership (Leave)
        await prisma.membership.delete({
            where: {
                userId_communityId: {
                    userId,
                    communityId,
                },
            },
        });

        return res.status(200).json({ message: "Successfully left the community" });

    } catch (error) {

        console.error("Error processing community join/leave:", error);
        res.status(500).json({ error: "Failed to process community join/leave" });

    }
});


// communities details in bulk
communityRouter.post("/bulk", async (req, res) => {
    console.log("in here", req.body)
    const { ids } = req.body; // Expects { ids: ["user1", "user2"] }

    // Validate and sanitize input
    if (!ids || !Array.isArray(ids)) {
        console.log("Invalid or missing IDs in request body");
        return res.status(400).json({ communities: [] });
    }

    const validIds = ids.filter((id): id is string => typeof id === "string" && id.trim() !== "");
    if (validIds.length === 0) {
        console.log("No valid IDs to query");
        return res.status(404).json({ communities: [] });
    }

    try {
        const communities = await prisma.community.findMany({
            where: { id: { in: validIds } },
            select: { id: true, name: true },
        });

        res.json({ communities });
    } catch (error) {
        console.error("Error fetching communities:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

});


//test route
communityRouter.get("/test", async (req, res) => {
    console.log("in here")
    res.status(200).json({
        "msg": "running successfulluy"
    })
})


//create a community by  creatorID

communityRouter.post("/create", communityMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    console.log("in here create")
    console.log(req.user)
    const userId = req.user?.userId;
    console.log("userId", userId)

    if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
    }
    const { universityId, name, description, communityTag } = req.body;
    console.log("universityId", universityId, "name", name, "description", description)

    if (!universityId || !name || !communityTag) {
        return res.status(400).json({ error: "University ID, Community name, and Community tag are required" });

    }

    try {
        console.log("in here try")
        const newCommunity = await prisma.community.create({
            data: {
                name: name,
                description: description || "",
                creator: userId,
                universityId: universityId,
                communityTag: communityTag
            },
        });

        return res.status(200).json({
            message: "Community created successfully",
            community: newCommunity,
        });

    }
    catch (error) {
        console.error("Error creating community:", error);
        return res.status(500).json({ error: "Failed to create community" });
    }
});


//check membership status
communityRouter.get("/:communityId/membership-status", communityMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const { communityId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
    }
    if (!communityId) {
        return res.status(400).json({ error: "Community ID is required" });
    }

    try {
        const membership = await prisma.membership.findUnique({
            where: {
                userId_communityId: {
                    userId,
                    communityId,
                },
            },
        });

        const isMember = !!membership;

        return res.status(200).json({ isMember });

    } catch (error) {
        console.error("Error checking membership status:", error);
        res.status(500).json({ error: "Failed to check membership status" });
    }
});


//check creator status
communityRouter.get("/:communityId/created", communityMiddleware, async (req: AuthenticatedRequest, res: Response) => {

    try {
        const { communityId } = req.params

        if (!communityId) {
            return res.status(403).json({ "msg": "No community id found" })
        }
        const creator = await prisma.community.findUnique({
            where: {
                id: communityId
            },
            select: {
                creator: true
            }
        })

        console.log("creator", creator)

        const isCreator = !!(creator?.creator === req.user?.userId)
        console.log(isCreator)
        res.json({
            "isCreator": isCreator
        })
    } catch (error) {
        console.log("could not find creator");
        res.status(403).json({
            "msg": error
        })
    }
})

// GET /api/communities/user/:userId/count
communityRouter.get("/user/:userId/count", async (req, res) => {
    try {
        const { userId } = req.params;
        const count = await prisma.membership.count({
            where: { userId: userId }
        });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: "Error fetching count" });
    }
});