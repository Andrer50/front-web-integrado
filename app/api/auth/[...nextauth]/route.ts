import axios from "axios";
import NextAuth from "next-auth";
import jwt from "jsonwebtoken";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import type { AxiosError } from "axios";

import { ApiResponse } from "@/core/shared";
import { AuthenticateDecodeToken, LoginAuthenticationResponse } from "@/core/auth/interfaces";

async function refreshAccessToken(token: JWT) {
  try {
    const { data } = await axios.post<ApiResponse<LoginAuthenticationResponse>>(
      `${process.env.BACKEND_AUTH_URL}/auth/refresh`,
      { refreshToken: token.refreshToken },
    );
    const decoded = jwt.decode(
      data.data.accessToken,
    ) as AuthenticateDecodeToken;
    return {
      ...token,
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken || token.refreshToken,
      accessTokenExpires: decoded.exp * 1000,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<NextAuthUser | null> {
        try {
          const { data } = await axios.post<
            ApiResponse<LoginAuthenticationResponse>
          >(`${process.env.BACKEND_AUTH_URL}/auth/login`, {
            email: credentials?.email,
            password: credentials?.password,
          });

          const decoded = jwt.decode(
            data.data.accessToken,
          ) as AuthenticateDecodeToken;

          const { data: user } = await getUserByEmail(
            decoded.sub,
            data.data.accessToken,
          );

          if (!data?.data || !user) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            profilePicture: user.profilePicture,
            phone: user.phone,
            role: user.role,
            status: user.status,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ message: string }>;

            throw new Error(
              axiosError.response?.data?.message || "Error de autenticación",
            );
          }
          console.error("Unexpected authentication error:", error);
          throw new Error("Error inesperado en la autenticación");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 24 * 60 * 60, // 60 días (coincide con el refresh token)
    updateAge: 24 * 60 * 60, // Refresckar token cada 24 horas (máximo)
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const decoded = jwt.decode(
          user.accessToken as string,
        ) as AuthenticateDecodeToken;
        token.id = +user.id;
        token.email = user.email;
        token.phone = user.phone;
        token.name = user.name;
        token.role = user.role;
        token.status = user.status;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = decoded.exp * 1000;
        return token;
      }

      if (Date.now() < (token.accessTokenExpires as number) - 60 * 1000) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as number,
        email: token.email as string,
        phone: (token.phone as string) || "",
        name: token.name as string,
        role: token.role as string,
        status: token.status as string,
      };

      session.accessToken = token.accessToken as string;
      session.accessTokenExpires = token.accessTokenExpires;
      session.error = token.error;

      return session;
    },
    async redirect({ url, baseUrl }) {
      // Permite redirects a URLs internas
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Permite redirects al mismo dominio
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
