import { cookies } from "next/headers";
import CreateCommunityComponent from ".";

export default async function CreateCommunityPage() {

    const cookieStore = await cookies();
    const userId = cookieStore.get("session")?.value;
    const universityId = cookieStore.get("uid")?.value;

    if (!userId || !universityId) {
        throw new Error("No user or university id found in cookies");
    }
    return (
        <CreateCommunityComponent universityId={universityId} userId={userId} />
    )
}