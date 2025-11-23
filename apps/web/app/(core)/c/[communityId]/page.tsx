import CommunityPageComponent from ".";
import { getUserDetail } from "../../dashboard/action";
import { checkCreatorStatus, checkMembership, getAllMentions, getAllPosts, getCommunityDetails } from "./action";

export default async function CommunityPage(props: { params: Promise<{ communityId: string }> }) {
    const { communityId } = await props.params;

    if (!communityId) {
        throw new Error("Community id not found");
    }
    const communityDetail = await getCommunityDetails(communityId);
    const posts = await getAllPosts(communityDetail.creator);
    console.log("Posts: ", posts);
    const mentions = await getAllMentions(communityDetail.creator, communityId);
    console.log("Mentions: ", mentions);
    const isMember = await checkMembership(communityId);
    const isCreator = await checkCreatorStatus(communityId);
    const user = await getUserDetail();

    return <CommunityPageComponent posts={posts} mentions={mentions} community={communityDetail} isMember={isMember} creator={isCreator} userInfo={user.user} />;
}
