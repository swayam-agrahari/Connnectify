"use server";

import axios from "axios";
import { cookies } from "next/headers";

// export async function  getFullPost(postId: string) {
//     // Fetch raw post
//     const postRes = await axios.get(`http://localhost:3003/api/posts/${postId}`);
//     const post = postRes.data.post;

//     console.log("Fetched post:", post);

//     // Fetch post author
//     const authorRes = await fetch(`http://localhost:3001/api/auth/${post.authorId}`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });
//     const author = await authorRes.json().then((data) => data.user);

//     console.log("Fetched author:", author);

//     // Fetch raw comments
//     const commentsRes = await axios.get(
//         `http://localhost:3003/api/posts/${postId}/comments`
//     );
//     const comments = commentsRes.data.comments;

//     // // Fetch raw votes
//     // const votesRes = await axios.get(
//     //     `http://localhost:3003/api/posts/${postId}/votes`
//     // );
//     // const votes = votesRes.data.votes;

//     // Fetch comment authors
//     const authorIds = [...new Set(comments.map((c: any) => c.authorId))];
//     const usersRes = await axios.post(`http://localhost:3001/api/auth/bulk`, {
//         ids: authorIds,
//     });
//     console.log("Fetched comment authors response:", usersRes.data);
//     const usersMap = Object.fromEntries(
//         usersRes.data.users.map((u: any) => [u.id, u])
//     );

//     console.log("Fetched comment authors:", usersMap);

//     // Attach author data to comments
//     const enrichedComments = comments.map((c: any) => ({
//         ...c,
//         author: usersMap[c.authorId]
//     }));

//     return {
//         ...post,
//         author,
//         comments: enrichedComments
//     };
// }

export async function getFullPost(postId: string, userId: string) {
    // const postRes = await axios.get(`http://localhost:3003/api/posts/${postId}`, { method: "GET" });
    // const post = postRes.data.post;
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("session");

    if (!tokenCookie) {
        return { success: false, error: "Authentication session not found." };
    }
    const posrRes = await fetch(`http://localhost:3003/api/posts/${postId}`, {
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
    const authorRes = await axios.get(`http://localhost:3001/api/auth/${post.authorId}`);
    const author = authorRes.data.user;

    // Fetch comments
    const commentsRes = await axios.get(`http://localhost:3003/api/posts/${postId}/comments`);
    const comments = commentsRes.data.comments;

    const authorIds = [...new Set(comments.map((c: any) => c.authorId))];
    const usersRes = await axios.post(`http://localhost:3001/api/auth/bulk`, { ids: authorIds });
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
