import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma";
import { reactStartCookies } from "better-auth/react-start";
import { sendMail } from "./nodemailer";

const prisma = new PrismaClient();
export const auth = betterAuth({
  plugins: [reactStartCookies()], // make sure this is the last plugin in the array
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendMail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
        html: `<p>Click the link to verify your email:</p> <a href="${url}">Link</a>`,
      });
    },
    sendOnSignUp: true,
  },
});
