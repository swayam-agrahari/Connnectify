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

  const res = await fetch(`${process.env.NEXT_PUBLIC_USER_SERVICE}/api/auth/validate`, {
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

  const tagsRes = await fetch(`${process.env.NEXT_PUBLIC_POST_SERVICE}/api/posts/tags/trending`, {
    cache: 'no-store',
    method: "GET"
  });
  console.log("tag res", tagsRes)
  const { tags } = await tagsRes.json();
  console.log("tags here", tags)
  return (
    <ConnectifyDashboard initialCommunities={communities} posts={Array.isArray(posts) ? posts : []} userInfo={user.user} tags={tags} />
  );
}
