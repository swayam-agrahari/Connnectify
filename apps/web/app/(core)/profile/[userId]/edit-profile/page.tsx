import ConnectifyProfile from ".";
import { getUniversityName, getUserDetails } from "./action";


export default async function EditProfile() {
    const data = await getUserDetails();
    const universityName = await getUniversityName(data.universityId);

    return (
        <ConnectifyProfile initialUserData={data} universityName={universityName} />
    )
}