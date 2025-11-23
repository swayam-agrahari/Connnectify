import { redirect } from "next/navigation";
import NavBar from "./navbar";
import { cookies } from "next/headers";
import { getAllUsers, getCommunities, getUserDetail } from "./dashboard/action";
import { getAllComunities } from "./communities/action";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {


    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("session");

    if (!tokenCookie) {
        console.log("No session cookie found, rendering login page")
        redirect("/login");
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_USER_SERVICE}/api/auth/validate`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${tokenCookie.value}`
        },
    });

    const { valid } = await res.json();
    console.log("Authentication valid:", valid);
    if (!valid) {

        redirect("/login");
    }
    const user = await getUserDetail();
    console.log("user", user.user)
    const allUsers = await getAllUsers();
    const comm = await getAllComunities();
    return (


        <>
            <NavBar users={user.user} communities={comm} allUsers={allUsers} />
            {children}

        </>
    )
}