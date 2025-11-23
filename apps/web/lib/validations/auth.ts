import zod from 'zod';

export const loginSchema = zod.object({
  email: zod
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: zod
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});


export const registerSchema = zod.object({
  email: zod.string().email("Invalid email address"),

  username: zod
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must be at most 30 characters long"),

  password: zod
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(8, "Password must be at most 8 characters long"),

  name: zod
    .string()
    .min(1, "Name must be at least 1 character long")
    .max(100, "Name must be at most 100 characters long")
    .optional(),

  profileImageUrl: zod.string().url("Not a url").optional(),

  universityId: zod
    .string()
    .min(1, "University ID must be at least 1 character long")
    .max(50, "University ID must be at most 50 characters long"),
});




export const verifyEmailSchema = zod.object({
  code: zod
    .string()
    .min(1, 'Verification code is required')
    .length(6, 'Verification code must be exactly 6 digits')
    .regex(/^\d+$/, 'Verification code must contain only numbers'),
});

export type LoginInput = zod.infer<typeof loginSchema>;
export type RegisterInput = zod.infer<typeof registerSchema>;
export type VerifyEmailInput = zod.infer<typeof verifyEmailSchema>;
