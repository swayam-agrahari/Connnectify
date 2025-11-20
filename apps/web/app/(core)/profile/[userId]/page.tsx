import { cookies } from "next/headers";
import ProfilePage from ".";
import { getUserPosts, getUserProfile, getUserStats } from "./actions";
import { getUserDetail } from "../../dashboard/action";

export default async function Profile(props: { params: Promise<{ userId: string }> }) {

    const { userId } = await props.params;

    if (!userId) {
        throw new Error("User id not found");
    }

    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("session");

    if (!tokenCookie) {
        return <div>Please log in to view your profile.</div>;
    }

    const myUser = await getUserDetail();
    console.log("my user", myUser)
    const data = await getUserProfile(userId);
    console.log("user data", data)
    const stats = await getUserStats(data.id);


    const finalStats = {
        id: data.id,
        name: data.name,
        username: `@${data.username}`,
        email: data.email,
        bio: data.bio || '',
        avatarUrl: data.profileImageUrl,
        coverUrl: data.coverImageUrl || '',
        location: data.universityId || '',
        joinedDate: data.createdAt.split("T")[0],
        stats: {
            posts: stats.posts,
            communities: stats.communities,
            following: data.following || 0
        }
    };

    const posts = await getUserPosts(userId);



    return (
        <ProfilePage initialUserData={finalStats} initialPosts={posts} userId={userId} myUser={myUser.user} />
    )
}