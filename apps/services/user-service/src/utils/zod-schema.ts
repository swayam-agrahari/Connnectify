import zod from "zod";


export const RegisterSchema = zod.object({
    email: zod.email("Invalid email address"),
    username: zod.string().min(3, "Username must be at least 3 characters long").max(30, "Username must be at most 30 characters long"),
    password: zod.string().min(6, "Password must be at least 6 characters long").max(8, "Password must be at most 8 characters long"),

    name: zod.string().min(1, "Name must be at least 1 character long").max(100, "Name must be at most 100 characters long").optional(),
    profileImageUrl: zod.url("Not a url").optional(),

    universityId: zod.string().min(1, "University ID must be at least 1 character long").max(50, "University ID must be at most 50 characters long"),

});


export const LoginSchema = zod.object({
    email: zod.email("Invalid email address"),
    password: zod.string().min(6, "Password must be at least 6 characters long").max(8, "Password must be at most 8 characters long"),
    isEmailVerified: zod.boolean("Email is not verified").optional(),
});

export const RequestPasswordResetSchema = zod.object({
    email: zod.string().email(),
});

export const ResetPasswordSchema = zod.object({
    email: zod.string().email(),
    code: zod.string().length(6, "Code must be 6 digits"),
    newPassword: zod.string().min(8, "Password must be at least 8 characters"),
});