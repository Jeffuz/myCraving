import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

interface CustomUser {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}

declare module "next-auth" {
  interface Session {
    user: CustomUser;
  }
}

export const authOptions = {
  pages: {
    signIn: "/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials): Promise<any> {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          (credentials as any).email || "",
          (credentials as any).password || ""
        );
        // user is found return id and email
        if (userCredential.user) {
          return {
            id: userCredential.user.uid,
            email: userCredential.user.email,
          };
        }
        // null if no one found
        return null;
      },
    }),
  ],
  callbacks: {
    // Callback to handle the session object
    async session({ session, token }: { session: Session; token: JWT }) {
      // assign token id to session id
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    // Callback to handle the JWT token
    async jwt({ token, user }: { token: JWT; user?: any }) {
      // assign id to token if user exists
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
