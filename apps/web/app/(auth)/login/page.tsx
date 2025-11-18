import { redirect, RedirectType } from "next/navigation";
import LoginPage from ".";
import { cookies } from 'next/headers';


export default async function Login() {
  console.log("Checking authentication status");
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("session");

  if (!tokenCookie) {
    console.log("No session cookie found, rendering login page")
    return <LoginPage />;
  }

  const res = await fetch(`http://localhost:3001/api/auth/validate`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `session=${tokenCookie.value}`
    },
  });

  const { valid } = await res.json();
  console.log("Authentication valid:", valid);
  if (valid) {
    redirect("/dashboard", RedirectType.push);
  }

  return <LoginPage />;
}