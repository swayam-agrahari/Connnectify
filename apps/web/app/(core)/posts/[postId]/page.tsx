import { cookies } from "next/headers";
import { getFullPost } from "./action";
import FullPost from "./FullPost";

export default async function PostPage(props: { params: Promise<{ postId: string }> }) {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("session")?.value;

    if (!tokenCookie) {
        // Handle unauthenticated access, e.g., redirect to login
        return <div>Please log in to view this post.</div>;
    }

    const params = await props.params;

    const userIdRes = await fetch(`${process.env.NEXT_PUBLIC_USER_SERVICE}/api/auth/me`, {
        credentials: "include",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${tokenCookie}`
        },
    })
    const userData = await userIdRes.json();
    const userId = userData.user.id;
    console.log("User ID:", userData);


    if (!userId) {
        return <div>Error loading user information.</div>;
    }
    const data = await getFullPost(params.postId, userId);
    data.userVoteOptionId = data.pollVotes?.[0]?.pollOptionId || null;
    data.pollOptions = data.pollOptions.map((opt: any) => ({
        ...opt,
        voteCount: opt.voteCount ?? 0,   // Ensure voteCount exists
    }));
    console.log("Post Data:", data);

    return (
        <div className="max-w-2xl mx-auto py-8">
            <FullPost post={data} userId={userId} />
        </div>
    );
}
