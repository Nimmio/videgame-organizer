import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma";
import { reactStartCookies } from "better-auth/react-start";

const prisma = new PrismaClient();
export const auth = betterAuth({
  plugins: [reactStartCookies()], // make sure this is the last plugin in the array
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
});
