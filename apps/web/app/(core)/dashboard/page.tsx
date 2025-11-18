import { redirect } from 'next/navigation';
import ConnectifyDashboard from '.';
import { getAllPosts, getCommunities, getUserDetail } from './action';

import { cookies } from 'next/headers';

export default async function DashboardPage() {

  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("session");

  if (!tokenCookie) {
    console.log("No session cookie found, rendering login page")
    redirect("/login");
  }

  const res = await fetch(`http://localhost:3001/api/auth/validate`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `session=${tokenCookie.value}`
    },
  });

  const { valid } = await res.json();
  if (!valid) {

    redirect("/login");
  }



  const communities = await getCommunities();
  const posts = await getAllPosts();
  const user = await getUserDetail();
  console.log("User data in dashboard page:", user.user);
  return (
    <ConnectifyDashboard initialCommunities={communities} posts={Array.isArray(posts) ? posts : []} userInfo={user.user} />
  );
}
