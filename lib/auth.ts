import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { authConfig } from "../auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email as string },
        });
        
        if (!user) return null;
        
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );
        
        if (!isValid) return null;
        
        return { 
          id: user.id, 
          name: user.nombre, 
          email: user.email, 
          rol: user.rol 
        };
      },
    }),
  ],
});
