// In your apps/web/app/(auth)/verify/actions.ts

"use server";

import { redirect, RedirectType } from "next/navigation";
import { cookies } from "next/headers"; // Import cookies

export async function verifyAction(formData: any) {
    console.log("verifyAction called", formData);
    const code = formData.get("code");
    console.log("Verifying code:", code);

    // 1. Get the auth cookie
    const cookieStore = await cookies();
    console.log("cookie", cookieStore)
    const tokenCookie = cookieStore.get("session");

    if (!tokenCookie) {
        return { success: false, error: "Authentication session not found." };
    }

    // 2. Call your *new* user-service endpoint
    const res = await fetch(`${process.env.NEXT_PUBLIC_USER_SERVICE}/api/auth/verify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${tokenCookie.value}`
        },
        // credentials: "include",
        body: JSON.stringify({ code }),
    });

    console.log("Response from verify endpoint:", res);

    // 4. Handle the response from the service
    if (res.ok) {
        // Success! The service verified the code.
        redirect("/dashboard", RedirectType.push);
    } else {
        // Failure! Get the error message from the service
        const data = await res.json();
        console.log("Error data from verify endpoint:", data);
        return { success: false, error: data.error || "Invalid verification code" };
    }
}