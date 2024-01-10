// import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github"; 
import Twitter from "next-auth/providers/twitter";
import { NextAuthOptions } from "next-auth";

import { prisma } from "@/server/db/PrismaClientSingleton";

export const authOptions : NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        // Google({
        //     clientId: process.env.GOOGLE_CLIENT_ID as string,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        // }),
        Twitter({
            clientId: process.env.TWITTER_API_KEY as string,
            clientSecret: process.env.TWITTER_API_SECRET as string,
        }),
        Github({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECERET as string,
        }),
    ],
    callbacks: {
      async signIn({account, user, profile} : any) {
        try {

          const authProviders: String[] = ["github", "twitter"];
          // console.log("Profile", profile);
          // console.log("User", user);
          // console.log("Account", account);
          
          const isAuthorisedProvider : Boolean = authProviders.some((authProvider:String) => {
            return authProvider === account?.provider
          })

          if(!isAuthorisedProvider) return false;

          const userExists = await prisma.user.findFirst({
            where : {
              email: user.email as string,
            }
          })

          if(userExists) return true;

          await  prisma.user.create({
            data : {
              username: profile?.screen_name || profile?.login,
              name: user?.name as string,
              email: user?.email as string,
              profilePic: user?.image as string,
            }
          })

          return true;
        } catch (error) {

          console.log(error);
          return false;
        }
      },
        async jwt({ token, account }) {
          if (account) {         
            token.accessToken  = account.oauth_token || account.access_token;
            token.refreshToken = account.oauth_token_secret;
          }

          return token;
        },

        async session({session, token }: any){
            session.accessToken = token?.accessToken
            session.refreshToken = token?.refreshToken
            session.user.id = token.sub
            console.log("User session: " , session);
            
            return session
        }
      },
      pages: {
        signIn: "/auth/signin",
      }
}