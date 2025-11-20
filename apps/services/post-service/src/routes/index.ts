import express, { type Request, type Response } from 'express';
import { PrismaClient } from "../generated/prisma/client";
import { createCommentSchema, createPostSchema, voteSchema } from '@/utils/schema';
import { authMiddleware, type AuthenticatedRequest } from '@/utils/authMiddleware';

export const postRouter = express.Router();

const prisma = new PrismaClient();

//get all posts
postRouter.get("/", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                pollOptions: {
                    include: {
                        _count: {
                            select: { votes: true }
                        }
                    },
                    orderBy: { id: 'asc' }
                },
                pollVotes: {
                    where: { userId },
                    select: { pollOptionId: true }
                },
                votes: true,
                comments: true
            }
        });


        const transformed = posts.map(post => {
            return {
                ...post,
                pollOptions: post.pollOptions.map(opt => ({
                    id: opt.id,
                    text: opt.text,
                    voteCount: opt._count.votes
                })),
                userVoteOptionId: post.pollVotes[0]?.pollOptionId || null
            };
        });


        res.status(200).json({ "posts": transformed });
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//get all posts by university 
postRouter.get("/:universityId/posts", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const { universityId } = req.params;

        if (!universityId) {
            return res.status(401).json({ error: "University id not provided" });
        }
        const posts = await prisma.post.findMany({
            where: {
                universityId: universityId
            },
            orderBy: { createdAt: 'desc' },
            include: {
                pollOptions: {
                    include: {
                        _count: {
                            select: { votes: true }
                        }
                    },
                    orderBy: { id: 'asc' }
                },
                pollVotes: {
                    where: { userId },
                    select: { pollOptionId: true }
                },
                votes: true,
                comments: true
            }
        })
        const transformed = posts.map(post => {
            return {
                ...post,
                pollOptions: post.pollOptions.map(opt => ({
                    id: opt.id,
                    text: opt.text,
                    voteCount: opt._count.votes
                })),
                userVoteOptionId: post.pollVotes[0]?.pollOptionId || null
            };
        });
        res.status(200).json({ posts: transformed });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


//get all posts for a community
postRouter.get("/:communityId/posts/community", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { communityId } = req.params;

        if (!communityId) {
            return res.status(401).json({ error: "Community id not provided" });
        }

        const posts = await prisma.post.findMany({
            where: {
                communityId: communityId
            },
            orderBy: { createdAt: 'desc' },
            include: {
                pollOptions: true,
                _count: true,
                votes: true,
                comments: true,

            }
        })

        res.status(200).json({ posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
//get all posts by a user
postRouter.get("/user/:userId/posts", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { userId } = req.params;
        console.log("Fetching posts for userId:", userId);

        if (!userId) {
            return res.status(401).json({ error: "User id not provided" });
        }

        const posts = await prisma.post.findMany({
            where: {
                authorId: userId
            },
            orderBy: { createdAt: 'desc' },
            include: {
                pollOptions: true,
                _count: true,
                votes: true,
                comments: true,

            }
        })

        if (!posts) {
            return res.status(200).json({ error: "No posts found for this user" });
        }

        res.status(200).json({ posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


//get a post by id
postRouter.get("/:postId", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        console.log("Authenticated userId:", userId);
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const { postId } = req.params;
        console.log("Fetching post for postId:", postId);

        if (!postId) {
            return res.status(400).json({ error: "Post ID not provided" });
        }

        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: {
                pollOptions: true,
                votes: true,
                comments: true,
                pollVotes: {
                    where: { userId },
                    select: { pollOptionId: true }
                },
            }
        });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.status(200).json({ post });
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


//create a post
postRouter.post("/", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;


    if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    try {
        console.log("Request body:", req.body);
        const parsedResponse = createPostSchema.safeParse(req.body);
        let expiresAt = null;

        if (!parsedResponse.success) {
            console.error("Validation errors:", parsedResponse.error);
            return res.status(400).json({ error: "Invalid post data", details: parsedResponse.error });
        }


        if (parsedResponse.data.type === 'POLL' && parsedResponse.data.poll?.duration) {
            expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + parsedResponse.data.poll.duration);
        }
        const data = await prisma.post.create({
            data: {
                content: parsedResponse.data.content,
                type: parsedResponse.data.type,
                imageUrl: parsedResponse.data.imageUrl ?? null,
                authorId: userId,
                tags: parsedResponse.data.tags,
                communityId: parsedResponse.data.communityId ?? null,
                universityId: parsedResponse.data.universityId,
                expiresAt: expiresAt,
            },

        });
        if (parsedResponse.data.poll?.options && parsedResponse.data.type === 'POLL') {
            console.log("Creating poll options");
            for (const option of parsedResponse.data.poll.options.map((text) => ({ text }))) {
                await prisma.pollOption.create({
                    data: {
                        text: option.text,
                        postId: data.id,
                    }
                });
            }
        }
        res.status(201).json({ post: data });


    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


//like a post
postRouter.post("/:postId/vote", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {

    try {
        const userId = req.user?.userId;
        const { postId } = req.params;

        const { voteType } = voteSchema.parse(req.body);


        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        if (!postId) {
            return res.status(400).json({ error: "Post ID not provided" });
        }

        // Find existing vote
        const existingVote = await prisma.vote.findUnique({
            where: {
                userId_postId: { userId, postId },
            },
        });

        // CASE A — Existing vote found
        if (existingVote) {
            // A1 — Same vote: user toggles off → delete
            if (existingVote.type === voteType) {
                await prisma.vote.delete({
                    where: { userId_postId: { userId, postId } },
                });

                return res.json({ message: "Vote removed" });
            }

            // A2 — Different vote: update
            const updated = await prisma.vote.update({
                where: { userId_postId: { userId, postId } },
                data: { type: voteType },
            });

            return res.json({ message: "Vote updated", vote: updated });
        }

        // CASE B — No existing vote → create
        const created = await prisma.vote.create({
            data: {
                userId,
                postId,
                type: voteType,
            },
        });

        return res.json({ message: "Vote created", vote: created });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: "Invalid request" });
    }

})


//comment on a post

postRouter.post("/:postId/comments", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { postId } = req.params;
        const authorId = req.user?.userId;

        if (!authorId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        if (!postId) {
            return res.status(400).json({ error: "Post ID not provided" });
        }

        // Validate request body
        const { text, parentId } = createCommentSchema.parse(req.body);

        // Create comment (top-level or reply)
        const newComment = await prisma.comment.create({
            data: {
                text,
                authorId,
                postId,
                parentId: parentId ?? null,
            },
        });

        return res.status(201).json({
            message: "Comment created successfully",
            comment: newComment,
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            error: "Invalid request body or failed to create comment",
        });
    }
});


//get all comments for a post

postRouter.get("/:postId/comments", async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { postId } = req.params;
        console.log("Fetching comments for postId:", postId);
        if (!postId) {
            return res.status(400).json({
                error: "Post ID not provided",
            });
        }

        const comments = await prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: "asc" },
            include: {
                _count: {
                    select: { replies: true },
                },

            }
        });

        return res.json({
            comments,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Failed to fetch comments",
        });
    }
});

//get all likes for a post
postRouter.get("/:postId/votes", async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { postId } = req.params;
        console.log("Fetching votes for postId:", postId);
        if (!postId) {
            return res.status(400).json({
                error: "Post ID not provided",
            });
        }

        const votes = await prisma.vote.findMany({
            where: { postId },
        });

        return res.json({
            votes,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Failed to fetch votes",
        });
    }
});

//vote on a poll option
postRouter.post("/:postId/poll/vote", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        console.log("Vote on poll option called");
        const { postId } = req.params;
        console.log("Fetching poll votes for postId:", postId);
        if (!postId) {
            return res.status(400).json({
                error: "Post ID not provided",
            });
        }

        const { pollOptionId } = req.body;
        console.log("pollOptionId:", pollOptionId);

        if (!pollOptionId) {
            return res.status(400).json({
                error: "Poll Option ID not provided",
            });
        }

        //check post is of type poll
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post || post.type !== "POLL") {
            return res.status(400).json({
                error: "Post is not of type POLL",
            });
        }

        if (post.expiresAt && new Date() > post.expiresAt) {
            return res.status(400).json({ error: "Poll has ended" });
        }

        //prisma.$transaction Check if PollVote exists for this userId + postId If it exists: Delete it (or update it) and Create the new PollVote for the selected pollOptionId

        const pollVote = await prisma.$transaction(async (prisma) => {
            const pollVotes = await prisma.pollVote.findUnique({
                where: {
                    userId_postId: {
                        userId: req.user?.userId!,
                        postId: postId
                    }
                }
            });

            if (pollVotes) {
                await prisma.pollVote.delete({
                    where: {
                        userId_postId: {
                            userId: req.user?.userId!,
                            postId: postId
                        }
                    }
                });
            }

            const newVote = await prisma.pollVote.create({
                data: {
                    userId: req.user?.userId!,
                    postId: postId,
                    pollOptionId: pollOptionId

                }
            });

            return newVote;


        });





        return res.status(200).json({
            message: "Vote recorded",
            votedOptionId: pollVote.pollOptionId,
        });



    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Failed to fetch poll votes",
        });
    }
});

// GET /api/posts/user/:userId/count
postRouter.get("/user/:userId/count", async (req, res) => {
    try {
        const { userId } = req.params;
        const count = await prisma.post.count({
            where: { authorId: userId }
        });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: "Error fetching count" });
    }
});


// GET /api/posts/tags/trending
postRouter.get("/tags/trending", async (req: Request, res: Response) => {
    try {
        // FIX: Try "post" (lowercase) instead of "Post"
        // Also ensure "tags" is the correct column name
        const tags = await prisma.$queryRaw`
            SELECT t as tag, CAST(COUNT(*) AS INT) as count
            FROM "post", unnest("tags") t
            GROUP BY t
            ORDER BY count DESC
            LIMIT 5;
        `;

        // Handle BigInt serialization if necessary (Prisma returns BigInt for counts)
        const serializedTags = (tags as any[]).map(t => ({
            tag: t.tag,
            count: Number(t.count) // Convert BigInt to Number
        }));

        res.status(200).json({ tags: serializedTags });
    } catch (error) {
        console.error("Error fetching trending tags:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});