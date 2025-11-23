import { z } from "zod";

export enum PostType {
    TEXT = "TEXT",
    IMAGE = "IMAGE",
    POLL = "POLL",
}

const pollSchema = z.object({
    options: z.array(z.string()).min(2, "A poll must have at least 2 options."),
    duration: z.number().positive("Duration must be a positive number."),
});

export const createPostSchema = z.object({
    content: z.string().min(1, "Content cannot be empty"),
    type: z.enum(['TEXT', 'IMAGE', 'POLL']),
    communityId: z.string(),
    imageUrl: z.url().optional(),
    expiresAt: z.date().optional(),
    poll: pollSchema.optional(),
    tags: z.array(z.string()).default([]),
    universityId: z.string(),
}).superRefine((data, ctx) => {
    if (data.type === 'POLL') {
        if (!data.poll) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Poll posts must include poll data.",
                path: ["poll"],
            });
        }
    } else {
        // Non-poll posts should NOT include poll
        if (data.poll) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Only poll posts can include poll data.",
                path: ["poll"],
            });
        }
    }
});


export const voteSchema = z.object({
    voteType: z.enum(["UPVOTE", "DOWNVOTE"]),
});

export const createCommentSchema = z.object({
    text: z.string().min(1, "Comment cannot be empty"),
    parentId: z.string().cuid().optional().nullable(),
});