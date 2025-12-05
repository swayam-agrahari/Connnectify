import { cookies } from "next/headers";
import CommunitiesPage from ".";
import { getAllComunities, getAllUserCommunities } from "./action";
import { getUniversityName } from "../profile/[userId]/edit-profile/action";


export default async function Communities() {

    const communities = await getAllComunities();
    console.log("all communities", communities);


    const userComunities = await getAllUserCommunities();

    const createdCommunities = userComunities.communities.filter((comm: any) => comm.creator === userComunities.userId);


    const joinedIds = new Set(userComunities.communities.map((c: any) => c.id));
    const enrichedCommunities = communities.communities.map((comm: any) => ({
        ...comm,
        isMember: joinedIds.has(comm.id),
        isCreated: comm.creator === userComunities.userId
    }));


    return (
        <CommunitiesPage allCommunities={enrichedCommunities} createdCommunities={createdCommunities} />
    )
}