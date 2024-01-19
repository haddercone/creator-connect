// import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github"; 
import Twitter from "next-auth/providers/twitter";
import { NextAuthOptions } from "next-auth";
import { prisma } from "@/server/db/PrismaClientSingleton";

function getUpdatedFields(existingUser:any, newUser:any) {
  const updatedFields : any = {};
  for (const [key, value] of Object.entries(newUser)) {
      if (existingUser.hasOwnProperty(key) && existingUser[key] !== value) {
          updatedFields[key] = value;
      }
  }
  return Object.keys(updatedFields).length > 0 ? updatedFields : null;
}


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
      async signIn({account, user, profile}:any) {
        try {

          const authProviders: String[] = ["github", "twitter"];
          // console.log("Profile", profile);
          // console.log("User", user);
          // console.log("Account", account);

          const inCommingUserObject = {
              username: (profile?.screen_name || profile?.login) as string,
              name: user?.name as string,
              email: user?.email as string,
              profilePic: user?.image as string,
          }

          const isAuthorisedProvider : Boolean = authProviders.some((authProvider:String) => {
            return authProvider === account?.provider
          })

          if(!isAuthorisedProvider) return false;

          const existingUser = await prisma.user.findFirst({
            where : {
              email: user.email as string,
            }
          })

          if(existingUser)  {
            const updatedFields = getUpdatedFields(existingUser, inCommingUserObject)

            if(!updatedFields) return true;

            await prisma.user.update({
              where : {
                email: user.email as string
              },
              data: updatedFields
            })

            return true;
          }

          await  prisma.user.create({ data : inCommingUserObject })
          return true;
          
        } catch (error) {
          console.log(error);
          return false;
        }
      },
        async jwt({ token, account, profile }: any) {
          if (account) {         
            token.accessToken  = account.oauth_token || account.access_token;
            token.refreshToken = account.oauth_token_secret;
            token.userName = profile?.screen_name || profile?.login;
          }
          
          return token;
        },

        async session({session, token }: any){
            session.accessToken = token?.accessToken
            session.refreshToken = token?.refreshToken
            session.user.username = token.userName
            session.user.id = token.sub
            // console.log("User session: " , session);
            
            return session
        }
      },
      pages: {
        signIn: "/auth/signin",
      }
}