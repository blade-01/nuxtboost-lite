import { NuxtAuthHandler } from "#auth"
import CredentialsProvider from "next-auth/providers/credentials"
import ApiRoutes from "~~/constant/ApiRoutes"
import useFetchApi from "~/composables/useFetchApi"
import type { AuthUserDataResponse } from "~/types/AuthUser"
import type { SignInResponse } from "~/types/SignInResponse"

const getUserData = async (token: string): Promise<Pick<AuthUserDataResponse, "data">> => {
  const user = await useFetchApi().rawFetch<AuthUserDataResponse>(ApiRoutes.user.me, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!user) {
    throw createError({
      message: "User not found",
      statusCode: 404
    })
  }

  if (!user.result) {
    throw createError({
      message: "User not found",
      statusCode: 404
    })
  }

  return {
    data: user.data
  }
}

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      credentials: {},
      async authorize(credentials: any) {
        try {
          // Get JWT token from API endpoint using credentials
          const res = await useFetchApi().post<SignInResponse>(ApiRoutes.auth.signIn, {
            email: credentials.email,
            password: credentials.password,
            rememberMe: credentials.rememberMe || false
          })
          if (res.result && res.data.token) {
            return {
              accessToken: res.data.token,
              status: undefined
            }
          } else {
            throw createError({
              statusCode: 403,
              statusMessage: "Credentials not working"
            })
          }
          // Return user data
        } catch (err: any) {
          throw createError({
            message: err?.data?.message || "Unable to sign in",
            statusCode: err?.status || 500
          })
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },

  pages: {
    signIn: "/auth/signin"
  },
  callbacks: {
    async jwt({ token, user }) {
      // This is true when the user is signing in for the first time
      if (user) {
        token = {
          ...token,
          ...user
        }
      }
      const accessToken = (token as any).accessToken as string | undefined

      if (accessToken) {
        try {
          const newData = await getUserData(accessToken)
          ;(token as any).user = newData.data.user
          ;(token as any).roles = newData.data.roles
          ;(token as any).userFetchedAt = Date.now()
          ;(token as any).sessionError = undefined
        } catch (err: any) {
          console.error("err in jwt callback: ", err)
          ;(token as any).sessionError = err?.status || "user_fetch_failed"
        }
      }

      if (accessToken) {
        ;(token as any).accessToken = accessToken
      }

      return token
    },
    async session({ session, token }) {
      try {
        const accessToken = (token as any).accessToken as string | undefined

        if (!accessToken) {
          return null
        }

        ;(session as any).user = {
          ...session.user,
          roles: (token as any).roles,
          accessToken
        }

        if ((token as any).sessionError) {
          ;(session as any).error = (token as any).sessionError
        }

        return Promise.resolve(session as any)
      } catch (err: any) {
        console.error("err in session callback: ", err)
        return null
      }
    }
  },

  events: {
    // Signs out the user from the API Server
    async signOut({ token }) {
      await useFetchApi().rawFetch<unknown>(ApiRoutes.auth.signOut, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.accessToken}`
        }
      })
    }
  }
})
