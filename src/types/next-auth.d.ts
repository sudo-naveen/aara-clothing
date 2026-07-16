import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      username: string;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    name?: string | null;
    username?: string;
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string | null;
    username?: string;
    isAdmin?: boolean;
  }
}
