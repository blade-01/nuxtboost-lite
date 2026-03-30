import type { EventHandler } from "h3";
import { NuxtAuthHandler } from "#auth";
import CredentialsProvider from "next-auth/providers/credentials";
import ApiRoutes from "~~/constant/ApiRoutes";
import type { AuthUserDataResponse } from "~/types/AuthUser";
import type { SignInResponse } from "~/types/SigninResponse";

const apiFetch = async <T>(
  endpoint: string,
  options?: Parameters<typeof $fetch<T>>[1],
) => {
  const config = useRuntimeConfig();

  return $fetch<T>(endpoint, {
    baseURL: config.public.baseURL,
    ...options,
  });
};

const getErrorMessage = (error: any) =>
  error?.data?.message ||
  error?.response?._data?.message ||
  error?.statusMessage ||
  error?.message ||
  "Unable to sign in";

const getErrorStatusCode = (error: any) =>
  error?.statusCode || error?.status || error?.response?.status || 500;

const getUserData = async (
  token: string,
): Promise<Pick<AuthUserDataResponse, "data">> => {
  const user = await apiFetch<AuthUserDataResponse>(ApiRoutes.user.me, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!user?.result || !user.data) {
    throw createError({
      message: "User not found",
      statusCode: 404,
    });
  }

  return {
    data: user.data,
  };
};

const authHandler = NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: "Credentials",
      credentials: {},
      async authorize(credentials: {
        email?: string;
        password?: string;
        rememberMe?: boolean;
      }) {
        if (!credentials?.email || !credentials.password) {
          throw createError({
            message: "Email and password are required",
            statusCode: 400,
          });
        }

        try {
          const res = await apiFetch<SignInResponse>(ApiRoutes.auth.signIn, {
            method: "POST",
            body: {
              email: credentials.email,
              password: credentials.password,
              // rememberMe: credentials.rememberMe ?? false,
            },
          });

          const accessToken = res?.data?.token;

          if (!res?.result || !accessToken) {
            throw createError({
              message: res?.message || "Invalid email or password",
              statusCode: 401,
            });
          }

          return {
            accessToken,
          };
        } catch (error: any) {
          throw createError({
            message: getErrorMessage(error),
            statusCode: getErrorStatusCode(error),
          });
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = {
          ...token,
          ...user,
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (!token.accessToken) {
        console.error("No accessToken found in token");
        return session;
      }

      try {
        const newData = await getUserData(token.accessToken as string);

        if (!newData.data.user) {
          console.error("No user found in newData");
          return session;
        }

        (session as any).user = {
          ...session.user,
          ...token,
          ...newData.data.user,
          roles: newData.data.roles,
        };

        return Promise.resolve(session);
      } catch (err: any) {
        console.error("Error in session callback: ", err);
        return session;
      }
    },
  },

  events: {
    async signOut({ token }) {
      await apiFetch<unknown>(ApiRoutes.auth.signOut, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      });
    },
  },
});

export default authHandler as EventHandler;
