import ConnectifyProfile from ".";
import { getUserDetails } from "./action";


export default async function EditProfile() {
    const data = await getUserDetails();

    return (
        <ConnectifyProfile initialUserData={data} />
    )
}