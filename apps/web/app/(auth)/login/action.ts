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

    const res = await fetch(`http://localhost:3001/api/auth/login`, {
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

    (await cookies()).set("session", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: data.maxAge / 1000, // maxAge is in seconds for cookies()
        path: "/",
        domain: "localhost",
    });

    (await cookies()).set("uid", data.uid, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: data.maxAge / 1000, // maxAge is in seconds for cookies()
        path: "/",
        domain: "localhost",
    });


    redirect("/dashboard", RedirectType.push);
}
