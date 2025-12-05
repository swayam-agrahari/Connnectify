"use server";

import { loginSchema } from "@/lib/validations/auth";
import { redirect, RedirectType } from "next/navigation";
import { cookies } from "next/headers";

export async function loginAction(formData: FormData) {
    const parsed = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!parsed.success) {
        return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    const { email, password } = parsed.data;

    const res = await fetch(`${process.env.NEXT_PUBLIC_USER_SERVICE}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
        // 3. Use the error message from the backend
        if (res.status === 403) {
            return { success: false, errors: { message: ["Please verify your email before logging in."] } };
        }
        return { success: false, errors: { message: [data.error || "Invalid email or password"] } };
    }

    const oneWeekInSeconds = 7 * 24 * 60 * 60;
    (await cookies()).set("session", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: oneWeekInSeconds,
        path: "/",
    });

    (await cookies()).set("uid", data.uid, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: oneWeekInSeconds,
        path: "/",
    });


    redirect("/dashboard", RedirectType.push);
}


export async function logoutAction() {
    (await cookies()).delete("session");
    redirect("/login");
}
