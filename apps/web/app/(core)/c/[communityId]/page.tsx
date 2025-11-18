import CommunityPageComponent from ".";
import { checkCreatorStatus, checkMembership, getAllPosts, getCommunityDetails } from "./action";

export default async function CommunityPage(props: { params: Promise<{ communityId: string }> }) {
    const { communityId } = await props.params;

    if (!communityId) {
        throw new Error("Community id not found");
    }
    const posts = await getAllPosts(communityId);
    const communityDetail = await getCommunityDetails(communityId);
    const isMember = await checkMembership(communityId);
    const isCreator = await checkCreatorStatus(communityId);

    return <CommunityPageComponent posts={posts} community={communityDetail} isMember={isMember} creator={isCreator} />;
}
