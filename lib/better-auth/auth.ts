import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
   if (authInstance) return authInstance;

   const mongoose = await connectToDatabase();
   const db = mongoose.connection.db;

   if (!db) throw new Error("No mongodb instance found");

   authInstance = betterAuth({
      database: mongodbAdapter(db),
      secret: process.env.BETTER_AUTH_SECRET,
      baseURL: process.env.BETTER_AUTH_URL,
      emailAndPassword: {
         enabled: true,
         disableSignUp: false,
         requireEmailVerification: false,
         maxPasswordLength: 100,
         minPasswordLength: 8,
         autoSignIn: true,
      },
      plugins: [nextCookies()],
   });

   return authInstance;
};

export const auth = await getAuth();
