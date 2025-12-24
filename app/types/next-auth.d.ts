import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
      grades?: number[];
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    isAdmin: boolean;
    grades?: number[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin: boolean;
    grades?: number[];
  }
}
