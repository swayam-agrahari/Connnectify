// app/(auth)/forgot-password/action.ts

"use server"

import { z } from "zod";
import { redirect } from "next/navigation"; // We only use this in the SECOND action

// --- ZOD SCHEMAS ---
const RequestOtpSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});

const ResetPasswordSchema = z.object({
    email: z.string().email(),
    code: z.string().length(6, "Code must be 6 digits"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

// --- ACTION 1: REQUEST OTP ---
export async function requestOtpAction(formData: FormData) {
    const parsedResponse = RequestOtpSchema.safeParse({
        email: formData.get("email"),
    });

    if (!parsedResponse.success) {
        return { success: false, errors: parsedResponse.error.flatten().fieldErrors };
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_USER_SERVICE}/api/auth/request-password-reset`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: parsedResponse.data.email }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        return { success: false, errors: { general: [errorData.message || "Failed to send code"] } };
    }

    // --- SUCCESS! ---
    // Return nothing, which tells the frontend to show the next step
    return { success: true };

} catch (err) {
    return { success: false, errors: { general: ["Server is unreachable"] } };
}
}


// --- ACTION 2: RESET PASSWORD ---
export async function resetPasswordWithOtpAction(formData: FormData) {
    console.log('3', formData.get("email"), formData.get("code"), formData.get("newPassword"))
    const parsedResponse = ResetPasswordSchema.safeParse({
        email: formData.get("email"),
        code: formData.get("code"),
        newPassword: formData.get("newPassword"),
    });
    console.log("4")

    if (!parsedResponse.success) {
        console.log("5")
        return { success: false, errors: parsedResponse.error.flatten().fieldErrors };
    }

    try {
        console.log("6")
        const res = await fetch(`${process.env.NEXT_PUBLIC_USER_SERVICE}/api/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsedResponse.data),
    });

    if (!res.ok) {
        console.log("7")
        const error = await res.json();
        return { success: false, errors: { general: [error.message || "Failed to reset"] } };
    }

} catch (err) {
    console.log("8")
    return { success: false, errors: { general: ["Server is unreachable"] } };
}
console.log("9")
redirect('/login');
}