"use server";

import axios from "axios";
import { cookies } from "next/headers";


export async function getFullPost(postId: string, userId: string) {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("session");

    if (!tokenCookie) {
        return { success: false, error: "Authentication session not found." };
    }
    const posrRes = await fetch(`${process.env.NEXT_PUBLIC_POST_SERVICE}/api/posts/${postId}`, {
        credentials: "include",
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${tokenCookie.value}`
        },
    });
    const post = await posrRes.json().then((data) => data.post);
    console.log("Fetched post:", post);

    // Fetch author
    const authorRes = await axios.get(`${process.env.NEXT_PUBLIC_USER_SERVICE}/api/auth/${post.authorId}`);
    const author = authorRes.data.user;

    // Fetch comments
    const commentsRes = await axios.get(`${process.env.NEXT_PUBLIC_POST_SERVICE}/api/posts/${postId}/comments`);
    const comments = commentsRes.data.comments;

    const authorIds = [...new Set(comments.map((c: any) => c.authorId))];
    const usersRes = await axios.post(`${process.env.NEXT_PUBLIC_USER_SERVICE}/api/auth/bulk`, { ids: authorIds });
    const usersMap = Object.fromEntries(usersRes.data.users.map((u: any) => [u.id, u]));

    const enrichedComments = comments.map((c: any) => ({ ...c, author: usersMap[c.authorId] }));

    if (post.type === "POLL") {
        post.pollOptions = post.pollOptions.map((opt: any) => ({
            ...opt,
            voteCount: post.pollVotes.filter((v: any) => v.pollOptionId === opt.id).length,
            isVotedByUser: post.pollVotes.some((v: any) => v.pollOptionId === opt.id)
        }));
    }

    return {
        ...post,
        author,
        comments: enrichedComments,
        userId,
    };
}
