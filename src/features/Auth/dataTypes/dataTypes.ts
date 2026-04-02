import {z} from "zod";

export const LoginRequestBodySchema = z.object({
    username: z.string(),
    password: z.string(),
});


const nullableOptional = <T extends z.ZodTypeAny>(schema: T) => schema.optional().nullable();

const AvatarSchema = z.object({
  url: nullableOptional(z.string()),
  localPath: nullableOptional(z.string()),
  _id: nullableOptional(z.string()),
});


const UserSchema = z.object({
  _id: nullableOptional(z.string()),
  avatar: nullableOptional(AvatarSchema),
  username: nullableOptional(z.string()),
  email: nullableOptional(z.string().email()),
  role: nullableOptional(z.string()),
  loginType: nullableOptional(z.string()),
  isEmailVerified: nullableOptional(z.boolean()),
  createdAt: nullableOptional(z.string()),
  updatedAt: nullableOptional(z.string()),
  __v: nullableOptional(z.number()),
});


const DataSchema = z.object({
  user: nullableOptional(UserSchema),
  accessToken: nullableOptional(z.string()),
  refreshToken: nullableOptional(z.string()),
});

export const LoginResponseSchema = z.object({
  statusCode: nullableOptional(z.number()),
  data: nullableOptional(DataSchema),
  message: nullableOptional(z.string()),
  success: nullableOptional(z.boolean()),
});


export const RegisterRequestBodySchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.string(),
});


const RegisterDataSchema = z.object({
  user: nullableOptional(UserSchema),
});


export const RegisterResponseSchema = z.object({
  statusCode: nullableOptional(z.number()),
  data: nullableOptional(RegisterDataSchema),
  message: nullableOptional(z.string()),
  success: nullableOptional(z.boolean()),
});

export const OtherLoginMethodSchema = z.object({
  statusCode: z.number().nullable(),
  data: z.any().nullable(),
  message: z.string().nullable(),
  error: z.array(z.any()).nullable(),
});

export const RefreshTokenResponseSchema = z.object({
  statusCode: nullableOptional(z.number()),
  data: nullableOptional(z.object({
    accessToken: nullableOptional(z.string()),
    refreshToken: nullableOptional(z.string()),
  })),
  message: nullableOptional(z.string()),
  success: nullableOptional(z.boolean()),
});

export const UserDataSchema = z.object({
  statusCode : nullableOptional(z.number()),
  data: nullableOptional(UserSchema),
  message: nullableOptional(z.string()),
  success: nullableOptional(z.boolean()),
});

export const LogoutScheme = z.object({
  statusCode: nullableOptional(z.number()),
  data: nullableOptional(z.any()),
  message: nullableOptional(z.string()),
  success: nullableOptional(z.boolean()),
});




export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type LoginRequest = z.infer<typeof LoginRequestBodySchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestBodySchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type OtherLoginMethod = z.infer<typeof OtherLoginMethodSchema>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;
export type UserData = z.infer<typeof UserDataSchema>;
export type LogoutResponse = z.infer<typeof LogoutScheme>;